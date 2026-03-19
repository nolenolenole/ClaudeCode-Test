import React, { useState, useRef, type KeyboardEvent } from 'react';
import { Send, Image as ImageIcon, Video, Search, Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理发送消息
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      // 重置textarea高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 自动调整textarea高度
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // 自动调整高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  // 快捷操作按钮
  const quickActions = [
    {
      icon: ImageIcon,
      label: '生成图片',
      prompt: '生成一张',
      color: 'text-purple-600 hover:bg-purple-50',
    },
    {
      icon: Video,
      label: '生成视频',
      prompt: '生成一个视频',
      color: 'text-pink-600 hover:bg-pink-50',
    },
    {
      icon: Search,
      label: '网络搜索',
      prompt: '搜索',
      color: 'text-blue-600 hover:bg-blue-50',
    },
  ];

  // 处理快捷操作点击
  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  // 处理文件上传
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage(`上传文件: ${file.name}`);
      // 重置文件输入
      e.target.value = '';
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* 快捷操作按钮 */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction(action.prompt)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 transition-colors whitespace-nowrap ${action.color}`}
            disabled={isLoading}
          >
            <action.icon size={16} />
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFileUpload}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 transition-colors whitespace-nowrap text-green-600 hover:bg-green-50"
          disabled={isLoading}
        >
          <Upload size={16} />
          <span className="text-sm font-medium">上传文件</span>
        </motion.button>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />
      </div>

      {/* 输入框 */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Shift+Enter 换行)"
            className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:border-purple-500 focus:outline-none resize-none transition-colors"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={isLoading}
          />
          
          {/* 发送按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </div>
      </div>

      {/* 提示文本 */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        AI助手可能会出错，请核实重要信息
      </div>
    </div>
  );
};
