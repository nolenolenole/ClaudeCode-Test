import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, MessageContent, ToolCall, ChatSession } from '../types/agent';
import { clineService } from '../services/clineService';

const STORAGE_KEY = 'agent_chat_sessions';
const CURRENT_SESSION_KEY = 'agent_current_session';

export const useAgentChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化：从localStorage加载历史会话
  useEffect(() => {
    const loadSessions = () => {
      try {
        const savedSessions = localStorage.getItem(STORAGE_KEY);
        const savedCurrentId = localStorage.getItem(CURRENT_SESSION_KEY);
        
        if (savedSessions) {
          const parsedSessions: ChatSession[] = JSON.parse(savedSessions);
          setSessions(parsedSessions);
          
          if (savedCurrentId && parsedSessions.find(s => s.id === savedCurrentId)) {
            setCurrentSessionId(savedCurrentId);
            const currentSession = parsedSessions.find(s => s.id === savedCurrentId);
            if (currentSession) {
              setMessages(currentSession.messages);
            }
          } else {
            // 创建新会话
            createNewSession();
          }
        } else {
          // 首次使用，创建新会话
          createNewSession();
        }
      } catch (error) {
        console.error('加载历史会话失败:', error);
        createNewSession();
      }
    };

    loadSessions();
  }, []);

  // 保存会话到localStorage
  const saveSessions = useCallback((updatedSessions: ChatSession[], currentId: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      localStorage.setItem(CURRENT_SESSION_KEY, currentId);
    } catch (error) {
      console.error('保存会话失败:', error);
    }
  }, []);

  // 创建新会话
  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: '新对话',
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: '你好！我是AI助手，很高兴为您服务！\n\n我可以帮您：\n🎨 生成图片\n🎬 生成视频\n🌐 网络搜索\n📁 处理文件\n\n有什么我可以帮助您的吗？',
            },
          ],
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSessions(prev => {
      const updated = [newSession, ...prev];
      saveSessions(updated, newSession.id);
      return updated;
    });
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
  }, [saveSessions]);

  // 切换会话
  const switchSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
    }
  }, [sessions]);

  // 删除会话
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      
      if (sessionId === currentSessionId) {
        if (updated.length > 0) {
          setCurrentSessionId(updated[0].id);
          setMessages(updated[0].messages);
          localStorage.setItem(CURRENT_SESSION_KEY, updated[0].id);
        } else {
          createNewSession();
        }
      }
      
      saveSessions(updated, currentSessionId);
      return updated;
    });
  }, [currentSessionId, createNewSession, saveSessions]);

  // 更新当前会话的消息
  const updateCurrentSession = useCallback((newMessages: Message[]) => {
    setSessions(prev => {
      const updated = prev.map(session => {
        if (session.id === currentSessionId) {
          // 自动生成标题（使用第一条用户消息）
          let title = session.title;
          if (title === '新对话') {
            const firstUserMessage = newMessages.find(m => m.role === 'user');
            if (firstUserMessage) {
              const text = firstUserMessage.content.find(c => c.type === 'text')?.text || '';
              title = text.slice(0, 20) + (text.length > 20 ? '...' : '');
            }
          }
          
          return {
            ...session,
            title,
            messages: newMessages,
            updatedAt: Date.now(),
          };
        }
        return session;
      });
      
      saveSessions(updated, currentSessionId);
      return updated;
    });
  }, [currentSessionId, saveSessions]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: [{ type: 'text', text }],
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    // 创建助手消息占位符
    const assistantMessageId = `assistant_${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: [],
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setStreamingMessageId(assistantMessageId);

    try {
      // 调用Cline服务
      const responseContent = await clineService.sendMessage(
        text,
        // 流式输出回调
        (streamedText) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: [{ type: 'text', text: streamedText }],
                  }
                : msg
            )
          );
          scrollToBottom();
        },
        // 工具调用回调
        (toolCall: ToolCall) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: [
                      ...msg.content,
                      { type: 'tool_use', toolCall },
                    ],
                  }
                : msg
            )
          );
          scrollToBottom();
        }
      );

      // 更新最终消息
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: responseContent,
                isStreaming: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加错误消息
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: [
                  {
                    type: 'error',
                    text: '抱歉，发送消息时出现错误，请稍后重试。',
                  },
                ],
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      scrollToBottom();
    }
  }, [isLoading, scrollToBottom]);

  // 清空对话
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: '对话已清空。有什么我可以帮助您的吗？',
          },
        ],
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // 重新生成回复
  const regenerateResponse = useCallback(async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousUserMessage = messages[messageIndex - 1];
    if (previousUserMessage.role !== 'user') return;

    // 删除当前助手消息
    setMessages(prev => prev.filter(msg => msg.id !== messageId));

    // 重新发送用户消息
    const userText = previousUserMessage.content.find(c => c.type === 'text')?.text;
    if (userText) {
      await sendMessage(userText);
    }
  }, [messages, sendMessage]);

  // 监听messages变化，自动更新当前会话
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      updateCurrentSession(messages);
    }
  }, [messages, currentSessionId, updateCurrentSession]);

  return {
    // 消息相关
    messages,
    isLoading,
    streamingMessageId,
    messagesEndRef,
    sendMessage,
    clearMessages,
    regenerateResponse,
    scrollToBottom,
    
    // 会话管理
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
  };
};
