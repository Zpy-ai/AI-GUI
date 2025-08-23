import { NextRequest } from 'next/server';
import { getStreamProvider } from '@/lib/providers';
import { logChatInteraction } from '@/lib/chatService';

// 流式响应包装器，用于记录到数据库
class StreamResponseRecorder {
  private chunks: string[] = [];
  private fullResponse: any = null;
  
  constructor(private request: any, private originalStream: ReadableStream) {}
  
  async recordToDatabase(): Promise<void> {
    try {
      const fullContent = this.chunks.join('');
      

      
      await logChatInteraction(this.request, {
        message: fullContent,
        model: this.request.model,
        provider: this.request.provider || 'openai',
        usage: this.fullResponse?.usage
      });
    } catch (error) {
      console.error('流式响应数据库记录错误:', error);
    }
  }
  
  getRecordedStream(): ReadableStream {
    const transformer = new TransformStream({
      transform: (chunk, controller) => {
        const text = new TextDecoder().decode(chunk);
        this.chunks.push(text);
        
        try {
          const data = JSON.parse(text);
          if (data.done && data.response) {
            this.fullResponse = data.response;
          }
        } catch (e) {
          // 忽略解析错误
        }
        
        controller.enqueue(chunk);
      },
      flush: async () => {
        await this.recordToDatabase();
      }
    });
    
    return this.originalStream.pipeThrough(transformer);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const providerKey = body.provider || 'openai';

    const provider = getStreamProvider(providerKey);
    const originalStream = provider.generateStreamResponse(body);
    
    const recorder = new StreamResponseRecorder(body, originalStream);
    const recordedStream = recorder.getRecordedStream();

    return new Response(recordedStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('流式API错误:', error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}