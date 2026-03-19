/**
 * Wuli.art API 服务
 * 集成图片生成、视频生成等功能
 */

export interface WuliImageGenParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
}

export interface WuliVideoGenParams {
  prompt: string;
  duration?: number;
  fps?: number;
}

export interface WuliImage2VideoParams {
  imageUrl: string;
  prompt?: string;
  duration?: number;
}

export class WuliService {
  private static instance: WuliService;
  
  private constructor() {}
  
  static getInstance(): WuliService {
    if (!WuliService.instance) {
      WuliService.instance = new WuliService();
    }
    return WuliService.instance;
  }

  /**
   * 生成图片
   */
  async generateImage(params: WuliImageGenParams): Promise<string> {
    try {
      // 调用MCP工具生成图片
      const response = await this.callMCPTool('image-gen', 'generate_image', {
        prompt: params.prompt,
        negative_prompt: params.negativePrompt || '',
        width: params.width || 1024,
        height: params.height || 1024,
        num_inference_steps: params.steps || 20,
      });

      if (response.success && response.image_url) {
        return response.image_url;
      }
      
      throw new Error(response.error || '图片生成失败');
    } catch (error) {
      console.error('生成图片失败:', error);
      throw error;
    }
  }

  /**
   * 编辑图片
   */
  async editImage(imageUrl: string, prompt: string): Promise<string> {
    try {
      const response = await this.callMCPTool('image-edit', 'edit_image', {
        image_url: imageUrl,
        prompt: prompt,
      });

      if (response.success && response.image_url) {
        return response.image_url;
      }
      
      throw new Error(response.error || '图片编辑失败');
    } catch (error) {
      console.error('编辑图片失败:', error);
      throw error;
    }
  }

  /**
   * 文本生成视频
   */
  async generateVideoFromText(params: WuliVideoGenParams): Promise<string> {
    try {
      const response = await this.callMCPTool('txt2video', 'generate_video', {
        prompt: params.prompt,
        duration: params.duration || 5,
        fps: params.fps || 24,
      });

      if (response.success && response.video_url) {
        return response.video_url;
      }
      
      throw new Error(response.error || '视频生成失败');
    } catch (error) {
      console.error('生成视频失败:', error);
      throw error;
    }
  }

  /**
   * 图片生成视频
   */
  async generateVideoFromImage(params: WuliImage2VideoParams): Promise<string> {
    try {
      const response = await this.callMCPTool('image2video', 'animate_image', {
        image_url: params.imageUrl,
        prompt: params.prompt || '',
        duration: params.duration || 5,
      });

      if (response.success && response.video_url) {
        return response.video_url;
      }
      
      throw new Error(response.error || '视频生成失败');
    } catch (error) {
      console.error('图片转视频失败:', error);
      throw error;
    }
  }

  /**
   * 调用MCP工具的通用方法
   * 注意：由于浏览器环境限制，这里只能返回模拟数据
   * 真实的MCP调用需要在Cline环境中通过use_mcp_tool完成
   */
  private async callMCPTool(skillName: string, toolName: string, params: any): Promise<any> {
    console.log(`[WuliService] 调用MCP工具: ${skillName}/${toolName}`, params);
    
    // 浏览器环境无法直接调用MCP，返回模拟数据
    // 真实调用需要通过Cline的use_mcp_tool工具
    console.warn('[WuliService] 浏览器环境无法直接调用MCP，使用模拟数据');
    console.warn('[WuliService] 如需真实API，请在Cline中使用use_mcp_tool');
    
    return this.getMockResponse(skillName, toolName, params);
  }

  /**
   * 获取模拟响应（用于开发测试）
   */
  private getMockResponse(skillName: string, toolName: string, params: any): any {
    // 模拟延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        if (skillName === 'image-gen') {
          resolve({
            success: true,
            image_url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
          });
        } else if (skillName === 'txt2video' || skillName === 'image2video') {
          resolve({
            success: true,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          });
        } else {
          resolve({
            success: false,
            error: '不支持的工具类型',
          });
        }
      }, 2000);
    });
  }
}

export const wuliService = WuliService.getInstance();
