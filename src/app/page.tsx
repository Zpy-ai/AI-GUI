'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { callAIAPI, callAIStreamAPI, ChatMessage } from '@/lib/api';
import MessageActions from '@/components/MessageActions';
import Sidebar from '@/components/Sidebar';
import ModelSelector, { AI_MODELS } from '@/components/ModelSelector';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '你好！我是你的AI助手，有什么可以帮助你的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState('conv_1');
  const [selectedModel, setSelectedModel] = useState('kimi-k2');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // 模拟会话数据
  const [conversations] = useState([
    {
      id: 'conv_1',
      title: '新对话',
      lastMessage: '你好！我是你的AI助手，有什么可以帮助你的吗？',
      timestamp: new Date()
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 终止AI回答
  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 创建AI消息占位符，包含思考状态
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      content: 'AI正在思考中...',
      role: 'assistant',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);

    // 创建AbortController用于终止请求
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // 获取模型配置
      const modelConfig = getModelConfig(selectedModel);
      const apiRequest = {
        message: inputValue.trim(),
        model: selectedModel,
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        provider: modelConfig.provider
      };

      // 使用流式API
      await callAIStreamAPI(
        apiRequest,
        (chunk: string) => {
          // 更新AI消息内容，替换思考状态
          setMessages(prev => prev.map(m => 
            m.id === aiMessageId 
              ? { ...m, content: m.content === 'AI正在思考中...' ? chunk : m.content + chunk }
              : m
          ));
        },
        (response) => {
          // 流式响应完成
          console.log('流式响应完成:', response);
        },
        (error) => {
          if (error.name === 'AbortError') {
            console.log('用户终止了AI回答');
            setMessages(prev => prev.map(m => 
              m.id === aiMessageId 
                ? { ...m, content: m.content + '\n\n[回答已终止]' }
                : m
            ));
          } else {
            console.error('流式API调用失败:', error);
            // 更新错误消息
            setMessages(prev => prev.map(m => 
              m.id === aiMessageId 
                ? { ...m, content: '抱歉，AI服务暂时不可用，请稍后再试。' }
                : m
            ));
          }
        },
        controller
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('用户终止了AI回答');
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId 
            ? { ...m, content: m.content + '\n\n[回答已终止]' }
            : m
        ));
      } else {
        console.error('AI API调用失败:', error);
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId 
            ? { ...m, content: '抱歉，AI服务暂时不可用，请稍后再试。' }
            : m
        ));
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  // 根据模型ID获取对应的API配置
  const getModelConfig = (modelId: string) => {
    const configs = {
      'kimi-k2': {
        provider: 'kimi',
        model: 'kimi-k2-0711-preview',
        maxTokens: 128000,
        temperature: 0.7
      },
      'doubao-pro': {
        provider: 'doubao',
        model: 'Doubao-Seed-1.6-vision',
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
      'qwen3-4b': {
        provider: 'qwen',
        model: 'qwen3-4b',
        maxTokens: 8192,
        temperature: 0.7
      }
    };
    
    return configs[modelId as keyof typeof configs] || configs['kimi-k2'];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRegenerate = async (messageId: string) => {
    if (isLoading) return;

    // 找到要重新生成的助手消息索引
    const targetIndex = messages.findIndex(m => m.id === messageId && m.role === 'assistant');
    if (targetIndex === -1) return;

    // 找到与该助手消息配对的那条用户消息（就近向前找到第一条用户消息）
    const pairedUser = (() => {
      for (let i = targetIndex - 1; i >= 0; i--) {
        if (messages[i].role === 'user') return messages[i];
      }
      return undefined;
    })();
    if (!pairedUser) return;

    setIsLoading(true);
    
    // 清空当前AI消息内容并显示思考状态
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, content: 'AI正在思考中...', timestamp: new Date() }
        : m
    ));

    // 创建AbortController用于终止请求
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const modelConfig = getModelConfig(selectedModel);
      const apiRequest = {
        message: pairedUser.content,
        model: selectedModel,
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        provider: modelConfig.provider
      };

      // 使用流式API重新生成
      await callAIStreamAPI(
        apiRequest,
        (chunk: string) => {
          // 更新AI消息内容，替换思考状态
          setMessages(prev => prev.map(m => 
            m.id === messageId 
              ? { ...m, content: m.content === 'AI正在思考中...' ? chunk : m.content + chunk }
              : m
          ));
        },
        (response) => {
          console.log('重新生成完成:', response);
        },
        (error) => {
          if (error.name === 'AbortError') {
            console.log('用户终止了重新生成');
            setMessages(prev => prev.map(m => 
              m.id === messageId 
                ? { ...m, content: m.content + '\n\n[重新生成已终止]' }
                : m
            ));
          } else {
            console.error('重新生成失败:', error);
            setMessages(prev => prev.map(m => 
              m.id === messageId 
                ? { ...m, content: '抱歉，重新生成失败，请稍后再试。' }
                : m
            ));
          }
        },
        controller
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('用户终止了重新生成');
        setMessages(prev => prev.map(m => 
          m.id === messageId 
            ? { ...m, content: m.content + '\n\n[重新生成已终止]' }
            : m
        ));
      } else {
        console.error('重新生成失败:', error);
        setMessages(prev => prev.map(m => 
          m.id === messageId 
            ? { ...m, content: '抱歉，重新生成失败，请稍后再试。' }
            : m
        ));
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleRegenerateByIndex = async (messageIndex: number) => {
    if (isLoading) return;
    if (messageIndex < 0 || messageIndex >= messages.length) return;
    const target = messages[messageIndex];
    if (!target || target.role !== 'assistant') return;

    const pairedUser = (() => {
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].role === 'user') return messages[i];
      }
      return undefined;
    })();
    if (!pairedUser) return;

    setIsLoading(true);
    
    // 清空当前AI消息内容并显示思考状态
    setMessages(prev => prev.map((m, i) => 
      i === messageIndex 
        ? { ...m, content: 'AI正在思考中...', timestamp: new Date() }
        : m
    ));

    // 创建AbortController用于终止请求
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const modelConfig = getModelConfig(selectedModel);
      const apiRequest = {
        message: pairedUser.content,
        model: selectedModel,
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        provider: modelConfig.provider
      };

      // 使用流式API重新生成
      await callAIStreamAPI(
        apiRequest,
        (chunk: string) => {
          // 更新AI消息内容，替换思考状态
          setMessages(prev => prev.map((m, i) => 
            i === messageIndex 
              ? { ...m, content: m.content === 'AI正在思考中...' ? chunk : m.content + chunk }
              : m
          ));
        },
        (response) => {
          console.log('重新生成完成:', response);
        },
        (error) => {
          if (error.name === 'AbortError') {
            console.log('用户终止了重新生成');
            setMessages(prev => prev.map((m, i) => 
              i === messageIndex 
                ? { ...m, content: m.content + '\n\n[重新生成已终止]' }
                : m
            ));
          } else {
            console.error('重新生成失败:', error);
            setMessages(prev => prev.map((m, i) => 
              i === messageIndex 
                ? { ...m, content: '抱歉，重新生成失败，请稍后再试。' }
                : m
            ));
          }
        },
        controller
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('用户终止了重新生成');
        setMessages(prev => prev.map((m, i) => 
          i === messageIndex 
            ? { ...m, content: m.content + '\n\n[重新生成已终止]' }
            : m
        ));
      } else {
        console.error('重新生成失败:', error);
        setMessages(prev => prev.map((m, i) => 
          i === messageIndex 
            ? { ...m, content: '抱歉，重新生成失败，请稍后再试。' }
            : m
        ));
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    // TODO: 实现反馈功能
    console.log('消息反馈:', messageId, type);
  };

  const handleNewConversation = () => {
    // TODO: 实现新对话功能
    console.log('创建新对话');
  };

  const handleSelectConversation = (id: string) => {
    // TODO: 实现选择对话功能
    console.log('选择对话:', id);
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    // TODO: 实现删除对话功能
    console.log('删除对话:', id);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">AI助手</h1>
            </div>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 group ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm prose prose-sm max-w-none">
                      {message.content === 'AI正在思考中...' ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                          <span className="text-gray-500">{message.content}</span>
                        </div>
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <pre className="bg-gray-100 rounded-md p-3 overflow-x-auto">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              ) : (
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-2">
                                {children}
                              </blockquote>
                            ),
                            h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {isHydrated ? message.timestamp.toLocaleTimeString() : ''}
                    </p>
                    
                    {message.role === 'assistant' && (
                      <MessageActions
                        messageId={message.id}
                        content={message.content}
                        onRegenerate={() => handleRegenerateByIndex(index)}
                        onStopRegenerate={isLoading ? handleStopGeneration : undefined}
                        onFeedback={(type) => handleFeedback(message.id, type)}
                        isRegenerating={isLoading}
                      />
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的问题..."
                className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            {isLoading ? (
              <button
                onClick={handleStopGeneration}
                className="bg-red-600 text-white rounded-full p-3 hover:bg-red-700 transition-colors"
                title="停止生成"
              >
                <Square className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
