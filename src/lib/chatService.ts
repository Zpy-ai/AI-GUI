import { query } from './database';
import { ChatRequest, ChatResponse } from './api';

// 对话接口
export interface Conversation {
  id: string;
  title: string;
  model: string;
  provider: string;
  created_at: Date;
  updated_at: Date;
}

// 消息接口
export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant';
  model?: string;
  provider?: string;
  usage_prompt_tokens?: number;
  usage_completion_tokens?: number;
  usage_total_tokens?: number;
  created_at: Date;
}

// 创建新对话
export const createConversation = async (
  model: string,
  provider: string,
  title?: string
): Promise<Conversation> => {
  const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const conversationTitle = title || `对话 ${new Date().toLocaleString()}`;
  
  await query(
    'INSERT INTO conversations (id, title, model, provider) VALUES (?, ?, ?, ?)',
    [id, conversationTitle, model, provider]
  );

  return {
    id,
    title: conversationTitle,
    model,
    provider,
    created_at: new Date(),
    updated_at: new Date()
  };
};

// 获取对话列表
export const getConversations = async (limit: number = 20, offset: number = 0): Promise<Conversation[]> => {
  const results = await query(
    'SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );

  return results.map((row: any) => ({
    id: row.id,
    title: row.title,
    model: row.model,
    provider: row.provider,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at)
  }));
};

// 限制对话数量，只保留最新的5条对话
export const limitConversations = async (maxConversations: number = 5): Promise<void> => {
  try {
    // 获取所有对话按更新时间倒序排列
    const allConversations = await getConversations(1000, 0);
    
    // 如果对话数量超过限制，删除旧的对话
    if (allConversations.length > maxConversations) {
      const conversationsToDelete = allConversations.slice(maxConversations);
      
      for (const conversation of conversationsToDelete) {
        await deleteConversation(conversation.id);
      }
      
      console.log(`已删除 ${conversationsToDelete.length} 条旧对话，保留最新的 ${maxConversations} 条`);
    }
  } catch (error) {
    console.error('限制对话数量时出错:', error);
  }
};

// 获取单个对话
export const getConversation = async (id: string): Promise<Conversation | null> => {
  const results = await query(
    'SELECT * FROM conversations WHERE id = ?',
    [id]
  );

  if (results.length === 0) {
    return null;
  }

  const row = results[0];
  return {
    id: row.id,
    title: row.title,
    model: row.model,
    provider: row.provider,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at)
  };
};

// 删除对话
export const deleteConversation = async (id: string): Promise<void> => {
  await query('DELETE FROM conversations WHERE id = ?', [id]);
};

// 保存用户消息
export const saveUserMessage = async (
  conversationId: string,
  content: string,
  model?: string,
  provider?: string
): Promise<Message> => {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await query(
    'INSERT INTO messages (id, conversation_id, content, role, model, provider) VALUES (?, ?, ?, ?, ?, ?)',
    [id, conversationId, content, 'user', model, provider]
  );

  // 更新对话更新时间
  await query(
    'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [conversationId]
  );

  return {
    id,
    conversation_id: conversationId,
    content,
    role: 'user',
    model,
    provider,
    created_at: new Date()
  };
};

// 保存AI回复消息
export const saveAssistantMessage = async (
  conversationId: string,
  content: string,
  model: string,
  provider: string,
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }
): Promise<Message> => {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await query(
    `INSERT INTO messages 
     (id, conversation_id, content, role, model, provider, usage_prompt_tokens, usage_completion_tokens, usage_total_tokens) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, 
      conversationId, 
      content, 
      'assistant', 
      model, 
      provider,
      usage?.prompt_tokens || 0,
      usage?.completion_tokens || 0,
      usage?.total_tokens || 0
    ]
  );

  // 更新对话更新时间
  await query(
    'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [conversationId]
  );

  return {
    id,
    conversation_id: conversationId,
    content,
    role: 'assistant',
    model,
    provider,
    usage_prompt_tokens: usage?.prompt_tokens,
    usage_completion_tokens: usage?.completion_tokens,
    usage_total_tokens: usage?.total_tokens,
    created_at: new Date()
  };
};

// 获取对话中的消息列表
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const results = await query(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
    [conversationId]
  );

  return results.map((row: any) => ({
    id: row.id,
    conversation_id: row.conversation_id,
    content: row.content,
    role: row.role,
    model: row.model,
    provider: row.provider,
    usage_prompt_tokens: row.usage_prompt_tokens,
    usage_completion_tokens: row.usage_completion_tokens,
    usage_total_tokens: row.usage_total_tokens,
    created_at: new Date(row.created_at)
  }));
};

// 记录完整的聊天交互
export const logChatInteraction = async (
  request: ChatRequest,
  response: ChatResponse
): Promise<{
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
}> => {
  let conversationId = request.conversationId;
  
  // 如果没有提供对话ID，创建新对话
  if (!conversationId) {
    const conversation = await createConversation(
      request.model,
      request.provider || 'kimi'
    );
    conversationId = conversation.id;
    
    // 创建新对话后执行对话数量限制
    await limitConversations(5);
  }

  // 保存用户消息
  const userMessage = await saveUserMessage(
    conversationId,
    request.message,
    request.model,
    request.provider
  );

  // 保存AI回复
  const assistantMessage = await saveAssistantMessage(
    conversationId,
    response.message,
    response.model,
    request.provider || 'kimi',
    response.usage
  );

  return {
    conversationId,
    userMessage,
    assistantMessage
  };
};

// 在应用启动时和每次新对话创建后调用限制函数
export const enforceConversationLimit = async (maxConversations: number = 5): Promise<void> => {
  await limitConversations(maxConversations);
};