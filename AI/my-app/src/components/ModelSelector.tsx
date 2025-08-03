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
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI最新多模态模型，支持图像和文本',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-purple-500',
    maxTokens: 128000,
    pricing: '$5/1M tokens'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'OpenAI高性能模型，适合复杂任务',
    icon: <Star className="w-4 h-4" />,
    color: 'bg-blue-500',
    maxTokens: 128000,
    pricing: '$10/1M tokens'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic最新模型，推理能力强',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-orange-500',
    maxTokens: 200000,
    pricing: '$3/1M tokens'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Google多模态模型，支持长文本',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-green-500',
    maxTokens: 1000000,
    pricing: '$3.5/1M tokens'
  },
  {
    id: 'qwen2.5-72b',
    name: 'Qwen2.5-72B',
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${selectedModelData?.color}`}>
          {selectedModelData?.icon}
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">{selectedModelData?.name}</div>
          <div className="text-xs text-gray-500">{selectedModelData?.pricing}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors ${
                selectedModel === model.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${model.color}`}>
                {model.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{model.name}</span>
                  <span className="text-xs text-gray-500">{model.pricing}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{model.description}</p>
                <p className="text-xs text-gray-500 mt-1">最大长度: {model.maxTokens.toLocaleString()} tokens</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 