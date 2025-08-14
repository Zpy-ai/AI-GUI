// AI API 服务
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  replyToId?: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 根据模型ID获取对应的API配置
const getModelConfig = (modelId: string) => {
  const configs = {
    'gpt-4o': {
      provider: 'openai',
      model: 'gpt-4o',
      maxTokens: 128000,
      temperature: 0.7
    },
    'doubao-pro': {
      provider: 'doubao',
      model: 'ep-32b-chat',
      maxTokens: 32768,
      temperature: 0.7
    },
    'hunyuan-pro': {
      provider: 'hunyuan',
      model: 'hunyuan-pro',
      maxTokens: 32768,
      temperature: 0.7
    },
    'deepseek-chat': {
      provider: 'deepseek',
      model: 'deepseek-chat',
      maxTokens: 8192,
      temperature: 0.7
    },
    // 'qwen2.5-72b': {
    //   provider: 'qwen',
    //   model: 'qwen2.5-72b',
    //   maxTokens: 32768,
    //   temperature: 0.7
    // },
    'qwen3-4b': {
      provider: 'qwen',
      model: 'qwen3-4b',
      maxTokens: 8192,
      temperature: 0.7
    }
  };
  
  return configs[modelId as keyof typeof configs] || configs['gpt-4o'];
};

// AI接口调用函数
export const callAIAPI = async (request: ChatRequest): Promise<ChatResponse> => {
  const modelConfig = getModelConfig(request.model);
  
  const apiRequest = {
    ...request,
    ...modelConfig,
    maxTokens: request.maxTokens || modelConfig.maxTokens,
    temperature: request.temperature || modelConfig.temperature
  };

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiRequest),
  });

  if (!response.ok) {
    throw new Error('AI API调用失败');
  }

  return response.json();
};

// 流式响应处理
export const callAIStreamAPI = async (
  request: ChatRequest,
  onChunk: (chunk: string) => void,
  onComplete: (response: ChatResponse) => void,
  onError: (error: Error) => void
) => {
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('AI流式API调用失败');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    let fullResponse = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      fullResponse += chunk;
      onChunk(chunk);
    }

    // 解析完整响应
    const parsedResponse: ChatResponse = JSON.parse(fullResponse);
    onComplete(parsedResponse);
    
  } catch (error) {
    onError(error as Error);
  }
}; 