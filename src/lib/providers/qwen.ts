import { ChatRequest, ChatResponse } from '@/lib/api';
import { AIStreamProvider } from './index';

// Qwen提供者（流式）
export class QwenStreamProvider implements AIStreamProvider {
  generateStreamResponse(request: ChatRequest): ReadableStream {
    const encoder = new TextEncoder();
    
    return new ReadableStream({
      async start(controller) {
        try {
          const apiKey = process.env.QWEN_API_KEY;
          const endpointBase = process.env.QWEN_API_ENDPOINT || 'https://api.qwen.ai/v1';

          if (!apiKey) {
            throw new Error('缺少 QWEN_API_KEY 环境变量');
          }

          const url = `${endpointBase.replace(/\/$/, '')}/chat/completions`;

          const envModel = process.env.QWEN_MODEL_ID;

          const normalizeQwenModelId = (
            inputModelId: string | undefined,
            endpoint: string
          ): string | undefined => {
            if (!inputModelId) return undefined;
            const id = inputModelId.toLowerCase();
            // 前端展示模型到服务商真实模型的最小映射
            if (id === 'qwen2.5-72b' || id === 'qwen3-4b') {
              if (endpoint.includes('dashscope.aliyuncs.com')) return 'qwen-plus';
              if (endpoint.includes('siliconflow')) return 'Qwen/Qwen2.5-72B-Instruct';
              return 'qwen2.5-72b-instruct';
            }
            return inputModelId;
          };

          const mappedRequestModel = normalizeQwenModelId(request.model, endpointBase);
          const model = envModel || mappedRequestModel || process.env.DEFAULT_MODEL || 'qwen-plus';

          const payload = {
            model,
            messages: [
              { role: 'user', content: request.message }
            ],
            max_tokens: request.maxTokens,
            temperature: request.temperature,
            stream: true
          };

          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Qwen OpenAI 兼容接口使用 Bearer 鉴权
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Qwen API 请求失败: ${res.status} ${res.statusText} - ${errText}`);
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
                    const finalResponse: ChatResponse = {
                      message: fullContent,
                      conversationId: request.conversationId || `conv_${Date.now()}`,
                      model,
                      provider: request.provider || 'qwen',
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
