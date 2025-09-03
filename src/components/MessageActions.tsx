'use client';

import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Square } from 'lucide-react';
import { useState } from 'react';

interface MessageActionsProps {
  messageId: string;
  content: string;
  onRegenerate?: () => void;
  onStopRegenerate?: () => void;
  onFeedback?: (type: 'positive' | 'negative') => void;
  isRegenerating?: boolean;
}

export default function MessageActions({ 
  messageId, 
  content, 
  onRegenerate, 
  onStopRegenerate,
  onFeedback,
  isRegenerating = false
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={handleCopy}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title="复制消息"
      >
        {copied ? (
          <span className="text-xs text-green-600">已复制</span>
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
      
      {onRegenerate && !isRegenerating && (
        <button
          onClick={onRegenerate}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="重新生成"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}

      {onStopRegenerate && isRegenerating && (
        <button
          onClick={onStopRegenerate}
          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          title="停止重新生成"
        >
          <Square className="w-3 h-3" />
        </button>
      )}
      
      {onFeedback && (
        <>
          <button
            onClick={() => onFeedback('positive')}
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="好评"
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => onFeedback('negative')}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="差评"
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
} 