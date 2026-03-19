import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bot, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Code, 
  Loader2,
  CheckCircle,
  XCircle,
  Wand2,
  Search,
  Upload
} from 'lucide-react';
import type { Message, MessageContent, ToolCall } from '../../types/agent';

interface MessageItemProps {
  message: Message;
}

// 工具调用显示组件
const ToolCallDisplay: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const getToolIcon = () => {
    switch (toolCall.type) {
      case 'generate_image':
        return <ImageIcon size={16} />;
      case 'generate_video':
        return <Video size={16} />;
      case 'web_search':
        return <Search size={16} />;
      case 'file_upload':
        return <Upload size={16} />;
      default:
        return <Wand2 size={16} />;
    }
  };

  const getToolLabel = () => {
    switch (toolCall.type) {
      case 'generate_image':
        return '生成图片';
      case 'generate_video':
        return '生成视频';
      case 'web_search':
        return '网络搜索';
      case 'file_upload':
        return '文件上传';
      default:
        return '工具调用';
    }
  };

  const getStatusIcon = () => {
    switch (toolCall.status) {
      case 'running':
        return <Loader2 size={14} className="animate-spin" />;
      case 'success':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'error':
        return <XCircle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg text-sm">
      <div className="text-purple-600">{getToolIcon()}</div>
      <span className="text-purple-900 font-medium">{getToolLabel()}</span>
      <div className="ml-auto">{getStatusIcon()}</div>
    </div>
  );
};

// 内容渲染组件
const ContentRenderer: React.FC<{ content: MessageContent }> = ({ content }) => {
  switch (content.type) {
    case 'text':
      return (
        <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
          {content.text}
        </div>
      );

    case 'image':
      return (
        <div className="mt-2">
          <img
            src={content.imageUrl}
            alt="Generated"
            className="max-w-full rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => window.open(content.imageUrl, '_blank')}
          />
        </div>
      );

    case 'video':
      return (
        <div className="mt-2">
          <video
            src={content.videoUrl}
            controls
            className="max-w-full rounded-lg shadow-md"
          />
        </div>
      );

    case 'file':
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <FileText size={20} className="text-gray-600" />
          <span className="text-sm text-gray-900">{content.fileName}</span>
        </div>
      );

    case 'code':
      return (
        <div className="mt-2">
          <div className="flex items-center justify-between px-3 py-1 bg-gray-800 rounded-t-lg">
            <span className="text-xs text-gray-400">{content.language || 'code'}</span>
            <Code size={14} className="text-gray-400" />
          </div>
          <pre className="p-3 bg-gray-900 rounded-b-lg overflow-x-auto">
            <code className="text-sm text-gray-100">{content.code}</code>
          </pre>
        </div>
      );

    case 'tool_use':
      return content.toolCall ? <ToolCallDisplay toolCall={content.toolCall} /> : null;

    case 'thinking':
      return (
        <div className="flex items-center gap-2 text-gray-500 italic">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">思考中...</span>
        </div>
      );

    case 'error':
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg text-red-700">
          <XCircle size={16} />
          <span className="text-sm">{content.text}</span>
        </div>
      );

    default:
      return null;
  }
};

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* 头像 */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
        }`}
      >
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <Bot size={18} className="text-white" />
        )}
      </div>

      {/* 消息内容 */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.content.map((content, index) => (
            <div key={index} className={index > 0 ? 'mt-2' : ''}>
              <ContentRenderer content={content} />
            </div>
          ))}
          
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          )}
        </div>

        {/* 时间戳 */}
        <span className="text-xs text-gray-400 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  );
};
