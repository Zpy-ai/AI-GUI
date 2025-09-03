import { ChatRequest, ChatResponse } from '@/lib/api';
import { AIStreamProvider } from './index';

// Kimi提供者（流式）
export class KimiStreamProvider implements AIStreamProvider {
  generateStreamResponse(request: ChatRequest): ReadableStream {
    const encoder = new TextEncoder();
    
    return new ReadableStream({
      async start(controller) {
        try {
          const apiKey = process.env.KIMI_API_KEY;
          const endpointBase = process.env.KIMI_API_ENDPOINT || 'https://api.moonshot.cn/v1';

          if (!apiKey) {
            throw new Error('缺少 KIMI_API_KEY 环境变量');
          }

          const url = `${endpointBase.replace(/\/$/, '')}/chat/completions`;
          const model = process.env.KIMI_MODEL_ID || request.model || 'kimi-k2-0711-preview';

          const payload = {
            model,
            messages: [
              { role: 'user', content: request.message }
            ],
            max_tokens: request.maxTokens,
            temperature: request.temperature,
            stream: true
          } as Record<string, unknown>;

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
            throw new Error(`Kimi API 请求失败: ${res.status} ${res.statusText} - ${errText}`);
          }

          const reader = res.body?.getReader();
          if (!reader) {
            throw new Error('无法读取响应流');
          }

          let fullResponse = '';
          let usageData: any = null;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // 流结束，发送最终响应
                  const finalResponse: ChatResponse = {
                    message: fullResponse,
                    conversationId: request.conversationId || `conv_${Date.now()}`,
                    model,
                    provider: request.provider || 'kimi',
                    usage: usageData || {
                      prompt_tokens: request.message.length,
                      completion_tokens: fullResponse.length,
                      total_tokens: request.message.length + fullResponse.length,
                    }
                  };

                  controller.enqueue(encoder.encode(JSON.stringify({
                    chunk: '',
                    done: true,
                    response: finalResponse
                  }) + '\n'));
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices?.[0]?.delta?.content) {
                    const content = parsed.choices[0].delta.content;
                    fullResponse += content;
                    
                    // 发送流式块
                    controller.enqueue(encoder.encode(JSON.stringify({
                      chunk: content,
                      done: false,
                      response: null
                    }) + '\n'));
                  }
                  
                  if (parsed.usage) {
                    usageData = parsed.usage;
                  }
                } catch (e) {
                  console.warn('解析流数据失败:', e, data);
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });
  }
}