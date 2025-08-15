import { NextRequest } from 'next/server';
import { getStreamProvider } from '@/lib/providers';

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const providerKey = body.provider || 'openai';

    const provider = getStreamProvider(providerKey);
    const stream = provider.generateStreamResponse(body);

    return new Response(stream, {
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