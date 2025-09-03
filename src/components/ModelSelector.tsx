'use client';

import { ChevronDown, Sparkles, Zap, Brain, Star, Crown } from 'lucide-react';
import { useState } from 'react';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  maxTokens: number;
  pricing: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'kimi-k2',
    name: 'Kimi K2',
    description: 'Moonshot Kimi大模型，支持长文本和复杂推理',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-purple-500',
    maxTokens: 128000,
    pricing: '按量计费'
  },
  {
    id: 'doubao-pro',
    name: '豆包 Pro',
    description: '字节跳动豆包大模型，通用对话与创作',
    icon: <Star className="w-4 h-4" />,
    color: 'bg-pink-600',
    maxTokens: 32768,
    pricing: '按量计费'
  },
  {
    id: 'hunyuan-pro',
    name: '腾讯混元 Pro',
    description: '腾讯混元大模型，中文与工具调用能力强',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-cyan-600',
    maxTokens: 32768,
    pricing: '按量计费'
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    description: 'DeepSeek 对话/推理模型，性价比高',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-gray-700',
    maxTokens: 32768,
    pricing: '按量计费'
  },
  {
    id: 'qwen3-4b',
    name: '千问3-4B',
    description: '阿里云开源模型，中文能力强',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-red-500',
    maxTokens: 32768,
    pricing: '免费'
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModelData = AI_MODELS.find(model => model.id === selectedModel);

  return (
    <div className="relative w-full max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200 shadow-sm w-full min-w-[280px] h-[64px]"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md ${selectedModelData?.color}`}>
          {selectedModelData?.icon}
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-gray-900">{selectedModelData?.name}</div>
          <div className="text-xs text-gray-500">{selectedModelData?.pricing}</div>
          <div className="text-xs text-gray-400 mt-1 line-clamp-1">{selectedModelData?.description}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto backdrop-blur-sm min-w-[320px]">
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-5 hover:bg-gray-50 transition-all duration-150 ${
                selectedModel === model.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${model.color}`}>
                {model.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">{model.name}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{model.pricing}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{model.description}</p>
                <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md inline-block">
                  📏 {model.maxTokens.toLocaleString()} tokens
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}