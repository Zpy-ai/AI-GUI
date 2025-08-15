import { ChatRequest } from '@/lib/api';

// AI服务提供者接口
export interface AIStreamProvider {
  generateStreamResponse(request: ChatRequest): ReadableStream;
}

// 提供者工厂
import { OpenAIStreamProvider } from './openai';
import { DoubaoStreamProvider } from './doubao';
import { HunyuanStreamProvider } from './hunyuan';
import { DeepseekStreamProvider } from './deepseek';
import { QwenStreamProvider } from './qwen';

export const getStreamProvider = (provider: string): AIStreamProvider => {
  switch (provider) {
    case 'openai':
      return new OpenAIStreamProvider();
    case 'qwen':
      return new QwenStreamProvider();
    case 'doubao':
      return new DoubaoStreamProvider();
    case 'hunyuan':
      return new HunyuanStreamProvider();
    case 'deepseek':
      return new DeepseekStreamProvider();
    default:
      return new OpenAIStreamProvider();
  }
};

// 导出所有提供者
export { OpenAIStreamProvider } from './openai';
export { DoubaoStreamProvider } from './doubao';
export { HunyuanStreamProvider } from './hunyuan';
export { DeepseekStreamProvider } from './deepseek';
export { QwenStreamProvider } from './qwen';
