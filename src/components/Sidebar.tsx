'use client';

import { Plus, Settings, MessageSquare, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isOpen && <h2 className="text-lg font-semibold text-gray-900">对话</h2>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center gap-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
            !isOpen && 'justify-center'
          }`}
        >
          <Plus className="w-5 h-5" />
          {isOpen && <span>新对话</span>}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              activeConversationId === conversation.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-center justify-between">
              <div className={`flex-1 min-w-0 ${!isOpen && 'hidden'}`}>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {conversation.title}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {conversation.lastMessage}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isHydrated ? conversation.timestamp.toLocaleDateString() : ''}
                </p>
              </div>
              
              {isOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${
            !isOpen && 'justify-center'
          }`}
        >
          <Settings className="w-5 h-5" />
          {isOpen && <span>设置</span>}
        </button>
      </div>
    </div>
  );
} 