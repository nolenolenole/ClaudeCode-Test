import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, RotateCcw, ChevronRight, ChevronLeft, Plus, MessageSquare, Clock } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { InputArea } from './InputArea';
import { useAgentChat } from '../../hooks/useAgentChat';

interface AgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({ isOpen, onClose }) => {
  const {
    messages,
    isLoading,
    messagesEndRef,
    sendMessage,
    clearMessages,
    scrollToBottom,
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
  } = useAgentChat();

  const [showSessions, setShowSessions] = useState(false);

  // 当消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />

          {/* 面板 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[400px] lg:w-[500px] bg-white shadow-2xl z-50 flex"
          >
            {/* 历史会话侧边栏 */}
            <AnimatePresence>
              {showSessions && (
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="w-[280px] border-r border-gray-200 bg-gray-50 flex flex-col"
                >
                  {/* 侧边栏头部 */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">历史对话</h3>
                      <button
                        onClick={() => setShowSessions(false)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <ChevronLeft size={16} className="text-gray-600" />
                      </button>
                    </div>
                    
                    {/* 新建对话按钮 */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={createNewSession}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:shadow-md transition-shadow"
                    >
                      <Plus size={16} />
                      新建对话
                    </motion.button>
                  </div>

                  {/* 会话列表 */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {sessions.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        暂无历史对话
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {sessions.map((session) => (
                          <motion.div
                            key={session.id}
                            whileHover={{ scale: 1.02 }}
                            className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                              session.id === currentSessionId
                                ? 'bg-white shadow-sm border border-purple-200'
                                : 'hover:bg-white/50'
                            }`}
                            onClick={() => {
                              switchSession(session.id);
                              setShowSessions(false);
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <MessageSquare
                                size={16}
                                className={`mt-0.5 flex-shrink-0 ${
                                  session.id === currentSessionId
                                    ? 'text-purple-500'
                                    : 'text-gray-400'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {session.title}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock size={12} className="text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {formatTime(session.updatedAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 删除按钮 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('确定要删除这个对话吗？')) {
                                  deleteSession(session.id);
                                }
                              }}
                              className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={14} className="text-red-500" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 主聊天区域 */}
            <div className="flex-1 flex flex-col">
              {/* 头部 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  {/* 显示历史按钮 */}
                  {!showSessions && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowSessions(true)}
                      className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                      title="历史对话"
                    >
                      <ChevronRight size={18} className="text-gray-600" />
                    </motion.button>
                  )}

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">AI助手</h2>
                    <p className="text-xs text-gray-500">
                      {isLoading ? '正在思考...' : '在线'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 清空对话 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearMessages}
                    className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                    title="清空对话"
                  >
                    <Trash2 size={18} className="text-gray-600" />
                  </motion.button>

                  {/* 关闭按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))}
                
                {/* 滚动锚点 */}
                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <InputArea onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// 浮动按钮组件
interface AgentFloatingButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export const AgentFloatingButton: React.FC<AgentFloatingButtonProps> = ({
  onClick,
  hasUnread = false,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg flex items-center justify-center z-40 hover:shadow-xl transition-shadow"
    >
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      )}
      <ChevronLeft size={24} />
    </motion.button>
  );
};
