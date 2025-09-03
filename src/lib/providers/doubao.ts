import { ChatRequest, ChatResponse } from '@/lib/api';
import { AIStreamProvider } from './index';

// Doubao 提供者（流式）
export class DoubaoStreamProvider implements AIStreamProvider {
  generateStreamResponse(request: ChatRequest): ReadableStream {
    const encoder = new TextEncoder();
    
    return new ReadableStream({
      async start(controller) {
        try {
          const apiKey = process.env.DOUBAO_API_KEY;
          const endpointBase = process.env.DOUBAO_API_ENDPOINT;

          if (!apiKey) {
            throw new Error('缺少 DOUBAO_API_KEY 环境变量');
          }
          if (!endpointBase) {
            throw new Error('缺少 DOUBAO_API_ENDPOINT 环境变量');
          }

          const url = `${endpointBase.replace(/\/$/, '')}/chat/completions`;
          const model = process.env.DOUBAO_MODEL_ID || request.model || 'ep-32b-chat';

          const maxTokensRaw = request.maxTokens;
          const effectiveMaxTokens = Math.max(1, Math.min(8192, typeof maxTokensRaw === 'number' ? maxTokensRaw : 8192));

          // 构建消息内容，支持多模态输入（文本+图像）
          let messageContent: any = request.message;
          
          // 如果消息包含图像URL，构建多模态消息格式
          if (request.message && typeof request.message === 'string' && request.message.includes('http') && 
              (request.message.includes('.jpg') || request.message.includes('.jpeg') || 
               request.message.includes('.png') || request.message.includes('.gif'))) {
            messageContent = [
              {
                type: 'image_url',
                image_url: {
                  url: request.message
                }
              },
              { type: 'text', text: '请描述这张图片' }
            ];
          }

          const payload = {
            model,
            messages: [
              { role: 'user', content: messageContent }
            ],
            max_tokens: effectiveMaxTokens,
            temperature: request.temperature,
            stream: true
          };

          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Doubao API 请求失败: ${res.status} ${res.statusText} - ${errText}`);
          }

          if (!res.body) {
            throw new Error('响应体为空');
          }

          const reader = res.body.getReader();
          let fullContent = '';
          let usage: any = null;

          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) break;
              
              const chunk = new TextDecoder().decode(value);
              const lines = chunk.split('\n');
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  
                  if (data === '[DONE]') {
                    // 发送最终响应
                    const finalResponse: ChatResponse = {
                      message: fullContent,
                      conversationId: request.conversationId || `conv_${Date.now()}`,
                      model,
                      provider: request.provider || 'doubao',
                      usage
                    };
                    
                    controller.enqueue(encoder.encode(JSON.stringify({
                      chunk: '',
                      done: true,
                      response: finalResponse
                    }) + '\n'));
                    return;
                  }
                  
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content || '';
                    fullContent += content;
                    
                    if (parsed.usage) {
                      usage = parsed.usage;
                    }
                    
                    if (content) {
                      controller.enqueue(encoder.encode(JSON.stringify({
                        chunk: content,
                        done: false,
                        response: null
                      }) + '\n'));
                    }
                  } catch (e) {
                    // 忽略解析错误
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
          
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });
  }
}
