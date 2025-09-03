import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '@/lib/api';
import { logChatInteraction } from '@/lib/chatService';

// AI服务提供者接口
interface AIProvider {
  generateResponse(request: ChatRequest): Promise<ChatResponse>;
}



// Anthropic提供者
class AnthropicProvider implements AIProvider {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    // TODO: 集成Anthropic API
    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    // const message = await anthropic.messages.create({
    //   model: request.model,
    //   max_tokens: request.maxTokens,
    //   messages: [{ role: 'user', content: request.message }]
    // });
    
    return {
      message: `[Claude ${request.model}] ${request.message}的回复`,
      conversationId: request.conversationId || `conv_${Date.now()}`,
      model: request.model,
      usage: {
        prompt_tokens: request.message.length,
        completion_tokens: 50,
        total_tokens: request.message.length + 50,
      }
    };
  }
}

// Google提供者
class GoogleProvider implements AIProvider {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    // TODO: 集成Google AI API
    // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // const model = genAI.getGenerativeModel({ model: request.model });
    // const result = await model.generateContent(request.message);
    
    return {
      message: `[Gemini ${request.model}] ${request.message}的回复`,
      conversationId: request.conversationId || `conv_${Date.now()}`,
      model: request.model,
      usage: {
        prompt_tokens: request.message.length,
        completion_tokens: 50,
        total_tokens: request.message.length + 50,
      }
    };
  }
}

// Doubao 提供者（OpenAI 兼容接口）
class DoubaoProvider implements AIProvider {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
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

    const payload = {
      model,
      messages: [
        { role: 'user', content: request.message }
      ],
      max_tokens: effectiveMaxTokens,
      temperature: request.temperature,
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
      throw new Error(`Doubao API 请求失败: ${res.status} ${res.statusText} - ${errText}`);
    }

    const data = await res.json() as any;
    const content = data?.choices?.[0]?.message?.content ?? '';

    return {
      message: content,
      conversationId: request.conversationId || `conv_${Date.now()}`,
      model,
      usage: data?.usage ?? undefined,
    };
  }
}

// Hunyuan 提供者（OpenAI 兼容接口）
class HunyuanProvider implements AIProvider {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    const apiKey = process.env.HUNYUAN_API_KEY;
    const endpointBase = process.env.HUNYUAN_API_ENDPOINT;

    if (!apiKey) {
      throw new Error('缺少 HUNYUAN_API_KEY 环境变量');
    }
    if (!endpointBase) {
      throw new Error('缺少 HUNYUAN_API_ENDPOINT 环境变量');
    }

    const url = `${endpointBase.replace(/\/$/, '')}/chat/completions`;
    const model = process.env.HUNYUAN_MODEL_ID || request.model || 'hunyuan-pro';

    const payload = {
      model,
      messages: [
        { role: 'user', content: request.message }
      ],
      max_tokens: request.maxTokens,
      temperature: request.temperature,
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
      throw new Error(`Hunyuan API 请求失败: ${res.status} ${res.statusText} - ${errText}`);
    }

    const data = await res.json() as any;
    const content = data?.choices?.[0]?.message?.content ?? '';

    return {
      message: content,
      conversationId: request.conversationId || `conv_${Date.now()}`,
      model,
      usage: data?.usage ?? undefined,
    };
  }
}

// DeepSeek 提供者（OpenAI 兼容接口）
class DeepseekProvider implements AIProvider {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const endpointBase = process.env.DEEPSEEK_API_ENDPOINT || 'https://api.deepseek.com/v1';

    if (!apiKey) {
      throw new Error('缺少 DEEPSEEK_API_KEY 环境变量');
    }

    const url = `${endpointBase.replace(/\/$/, '')}/chat/completions`;
    const model = process.env.DEEPSEEK_MODEL_ID || request.model || 'deepseek-chat';

    const payload = {
      model,
      messages: [
        { role: 'user', content: request.message }
      ],
      max_tokens: request.maxTokens,
      temperature: request.temperature,
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

    const data = await res.json() as any;
    const content = data?.choices?.[0]?.message?.content ?? '';

    return {
      message: content,
      conversationId: request.conversationId || `conv_${Date.now()}`,
      model,
      usage: data?.usage ?? undefined,
    };
  }
}

// Kimi 提供者（OpenAI 兼容接口）
class KimiProvider implements AIProvider {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
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

    const data = await res.json() as any;
    const content = data?.choices?.[0]?.message?.content ?? '';

    return {
      message: content,
      conversationId: request.conversationId || `conv_${Date.now()}`,
      model,
      usage: data?.usage ?? undefined,
    };
  }
}

// Qwen提供者
class QwenProvider implements AIProvider {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    const apiKey = process.env.QWEN_API_KEY;
    const endpointBase = process.env.QWEN_API_ENDPOINT || 'https://api.qwen.ai/v1';

    if (!apiKey) {
      throw new Error('缺少 QWEN_API_KEY 环境变量');
    }

    // OpenAI 兼容模式接口: POST /chat/completions
    const url = `${endpointBase.replace(/\/$/, '')}/chat/completions`;

    // 某些平台可能模型名不同，如需要可在此映射
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
    } as Record<string, unknown>;

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

    const data = await res.json() as any;
    const content = data?.choices?.[0]?.message?.content ?? '';

    return {
      message: content,
      conversationId: request.conversationId || `conv_${Date.now()}`,
      model,
      usage: data?.usage ?? undefined,
    };
  }
}

// 提供者工厂
const getProvider = (provider: string): AIProvider => {
  switch (provider) {
    case 'anthropic':
      return new AnthropicProvider();
    case 'google':
      return new GoogleProvider();
    case 'qwen':
      return new QwenProvider();
    case 'doubao':
      return new DoubaoProvider();
    case 'hunyuan':
      return new HunyuanProvider();
    case 'deepseek':
      return new DeepseekProvider();
    case 'kimi':
      return new KimiProvider();
    default:
      return new KimiProvider();
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest & { provider?: string } = await request.json();
    const providerKey = body.provider || 'kimi';

    const provider = getProvider(providerKey);
    const response = await provider.generateResponse(body);

    // 记录聊天交互到数据库
    try {
      await logChatInteraction(body, {
        ...response,
        provider: body.provider || 'kimi'
      });
    } catch (dbError) {
      console.error('数据库记录错误:', dbError);
      // 不中断主流程，仅记录错误
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI API错误:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}