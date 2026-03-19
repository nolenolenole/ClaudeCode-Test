// Agent消息类型
export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageContentType = 
  | 'text'
  | 'image'
  | 'video'
  | 'file'
  | 'code'
  | 'thinking'
  | 'tool_use'
  | 'error';

// 工具类型
export type ToolType = 
  | 'generate_image'
  | 'generate_video'
  | 'web_search'
  | 'file_upload'
  | 'code_execution';

// 工具调用状态
export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error';

// 工具调用接口
export interface ToolCall {
  id: string;
  type: ToolType;
  status: ToolCallStatus;
  input?: any;
  output?: any;
  error?: string;
  timestamp: number;
}

// 消息内容接口
export interface MessageContent {
  type: MessageContentType;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  code?: string;
  language?: string;
  toolCall?: ToolCall;
}

// 消息接口
export interface Message {
  id: string;
  role: MessageRole;
  content: MessageContent[];
  timestamp: number;
  isStreaming?: boolean;
}

// 聊天会话接口
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// Agent配置接口
export interface AgentConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  enableTools?: boolean;
  availableTools?: ToolType[];
}

// 快捷操作接口
export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  type: ToolType;
  prompt?: string;
}
