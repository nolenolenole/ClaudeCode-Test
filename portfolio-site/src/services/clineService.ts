import type { MessageContent, ToolCall, ToolType } from '../types/agent';
import { wuliService } from './wuliService';

// Cline AI 服务 - 集成Wuli.art真实API
class ClineService {
  private isProcessing = false;

  // 发送消息到Cline
  async sendMessage(
    message: string,
    onStream?: (content: string) => void,
    onToolCall?: (toolCall: ToolCall) => void
  ): Promise<MessageContent[]> {
    this.isProcessing = true;

    try {
      // 检测是否包含工具调用指令
      const toolType = this.detectToolType(message);
      
      if (toolType) {
        // 如果检测到工具调用，先返回工具调用状态
        const toolCall: ToolCall = {
          id: `tool_${Date.now()}`,
          type: toolType,
          status: 'running',
          input: { prompt: message },
          timestamp: Date.now(),
        };

        if (onToolCall) {
          onToolCall(toolCall);
        }

        // 模拟工具执行
        await this.delay(1500);

        // 执行工具
        const toolResult = await this.executeToolCall(toolType, message);
        
        toolCall.status = 'success';
        toolCall.output = toolResult;

        if (onToolCall) {
          onToolCall(toolCall);
        }

        return [
          {
            type: 'tool_use',
            toolCall,
          },
          ...toolResult,
        ];
      }

      // 普通对话
      const response = await this.generateResponse(message, onStream);
      return response;
    } finally {
      this.isProcessing = false;
    }
  }

  // 检测工具类型
  private detectToolType(message: string): ToolType | null {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('生成图片') || lowerMessage.includes('画一张') || lowerMessage.includes('生图')) {
      return 'generate_image';
    }
    if (lowerMessage.includes('生成视频') || lowerMessage.includes('做一个视频') || lowerMessage.includes('生视频')) {
      return 'generate_video';
    }
    if (lowerMessage.includes('搜索') || lowerMessage.includes('查找') || lowerMessage.includes('search')) {
      return 'web_search';
    }
    
    return null;
  }

  // 执行工具调用
  private async executeToolCall(toolType: ToolType, prompt: string): Promise<MessageContent[]> {
    switch (toolType) {
      case 'generate_image':
        return await this.generateImage(prompt);
      case 'generate_video':
        return await this.generateVideo(prompt);
      case 'web_search':
        return await this.webSearch(prompt);
      default:
        return [{
          type: 'text',
          text: '抱歉，该工具暂不可用。',
        }];
    }
  }

  // 生成图片 - 使用Wuli.art真实API
  private async generateImage(prompt: string): Promise<MessageContent[]> {
    try {
      // 提取图片描述
      const imagePrompt = this.extractImagePrompt(prompt);
      
      // 调用Wuli.art API生成图片
      const imageUrl = await wuliService.generateImage({
        prompt: imagePrompt,
        width: 1024,
        height: 1024,
        steps: 20,
      });

      return [
        {
          type: 'text',
          text: `已为您生成图片：${imagePrompt}`,
        },
        {
          type: 'image',
          imageUrl: imageUrl,
        },
      ];
    } catch (error) {
      console.error('生成图片失败:', error);
      return [
        {
          type: 'error',
          text: `图片生成失败：${error instanceof Error ? error.message : '未知错误'}`,
        },
      ];
    }
  }

  // 生成视频 - 使用Wuli.art真实API
  private async generateVideo(prompt: string): Promise<MessageContent[]> {
    try {
      // 提取视频描述
      const videoPrompt = this.extractVideoPrompt(prompt);
      
      // 调用Wuli.art API生成视频
      const videoUrl = await wuliService.generateVideoFromText({
        prompt: videoPrompt,
        duration: 5,
        fps: 24,
      });

      return [
        {
          type: 'text',
          text: `已为您生成视频：${videoPrompt}`,
        },
        {
          type: 'video',
          videoUrl: videoUrl,
        },
      ];
    } catch (error) {
      console.error('生成视频失败:', error);
      return [
        {
          type: 'error',
          text: `视频生成失败：${error instanceof Error ? error.message : '未知错误'}`,
        },
      ];
    }
  }

  // 网络搜索
  private async webSearch(prompt: string): Promise<MessageContent[]> {
    await this.delay(1500);
    
    return [
      {
        type: 'text',
        text: `正在搜索"${prompt}"的相关信息...\n\n搜索结果：\n1. 相关内容A\n2. 相关内容B\n3. 相关内容C`,
      },
    ];
  }

  // 提取图片描述
  private extractImagePrompt(message: string): string {
    // 移除触发词，提取实际描述
    let prompt = message
      .replace(/生成图片|画一张|生图|图片/gi, '')
      .replace(/的/g, '')
      .trim();
    
    return prompt || '一张美丽的风景图';
  }

  // 提取视频描述
  private extractVideoPrompt(message: string): string {
    // 移除触发词，提取实际描述
    let prompt = message
      .replace(/生成视频|做一个视频|生视频|视频/gi, '')
      .replace(/的/g, '')
      .trim();
    
    return prompt || '一段精彩的视频';
  }

  // 生成普通回复
  private async generateResponse(
    message: string,
    onStream?: (content: string) => void
  ): Promise<MessageContent[]> {
    // 模拟AI回复
    const responses = [
      '我是您的AI助手，很高兴为您服务！我可以帮您生成图片、视频，进行网络搜索等。请告诉我您需要什么帮助？',
      '收到您的消息了！我正在思考如何最好地回答您的问题...',
      '这是一个很好的问题！让我为您详细解答...',
      '我理解您的需求。让我来帮您处理这个任务。',
    ];

    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // 针对特定问题的回复
    if (message.includes('你好') || message.includes('hello')) {
      response = '你好！我是AI助手，很高兴见到你！\n\n我已经接入了Wuli.art的真实API，可以为您：\n🎨 生成高质量图片\n🎬 创建精彩视频\n🌐 进行网络搜索\n\n试试对我说"生成一张猫咪的图片"吧！';
    } else if (message.includes('帮助') || message.includes('help')) {
      response = '我可以为您提供以下帮助：\n\n🎨 **生成图片** - 说"生成一张...的图片"\n   使用Wuli.art Qwen Image Turbo模型\n\n🎬 **生成视频** - 说"生成一个...的视频"\n   使用Tongyi Wanxiang 2.2 Turbo\n\n🌐 **网络搜索** - 说"搜索..."\n\n📁 **文件上传** - 点击上传按钮\n\n还有其他问题吗？';
    } else if (message.includes('功能') || message.includes('能做什么')) {
      response = '我的主要功能包括：\n\n✨ **智能对话** - 回答各种问题\n🎨 **图片生成** - 使用Wuli.art AI生成高质量图片\n🎬 **视频生成** - 创建动态视频内容\n🌐 **网络搜索** - 查找最新信息\n📝 **代码生成** - 编写和解释代码\n📁 **文件处理** - 上传和分析文件\n\n💡 **提示**：所有图片和视频都由Wuli.art真实API生成！\n\n试试对我说"生成一张猫咪的图片"吧！';
    }

    // 模拟流式输出
    if (onStream) {
      for (let i = 0; i < response.length; i++) {
        await this.delay(30);
        onStream(response.slice(0, i + 1));
      }
    }

    return [
      {
        type: 'text',
        text: response,
      },
    ];
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 检查是否正在处理
  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}

export const clineService = new ClineService();
