# Wuli.art API 集成说明

## 🎯 集成概述

Agent对话系统已成功集成Wuli.art的真实API，支持：
- 🎨 图片生成（Qwen Image Turbo）
- 🎬 视频生成（Tongyi Wanxiang 2.2 Turbo）
- 🖼️ 图片编辑
- 🎥 图片转视频

## 📁 文件结构

```
src/services/
├── wuliService.ts      # Wuli.art API封装
└── clineService.ts     # Agent服务（已集成Wuli API）
```

## 🔧 技术实现

### 1. WuliService 服务层

`wuliService.ts` 提供了三种API调用方式：

#### 方案1: VSCode MCP通信（推荐）
```typescript
// 通过VSCode的postMessage与MCP服务器通信
window.vscode.postMessage({
  type: 'mcp_call',
  skill: 'image-gen',
  tool: 'generate_image',
  params: { prompt, width, height }
});
```

#### 方案2: HTTP代理
```typescript
// 通过配置的代理服务器转发请求
fetch(`${VITE_MCP_PROXY_URL}/mcp/image-gen/generate_image`, {
  method: 'POST',
  body: JSON.stringify(params)
});
```

#### 方案3: 模拟数据（开发环境）
```typescript
// 降级到模拟数据，用于开发测试
return {
  success: true,
  image_url: 'https://picsum.photos/1024/1024'
};
```

### 2. ClineService 集成

`clineService.ts` 已更新，调用Wuli API：

```typescript
// 生成图片
private async generateImage(prompt: string) {
  const imageUrl = await wuliService.generateImage({
    prompt: imagePrompt,
    width: 1024,
    height: 1024,
    steps: 20,
  });
  
  return [
    { type: 'text', text: `已为您生成图片：${imagePrompt}` },
    { type: 'image', imageUrl }
  ];
}

// 生成视频
private async generateVideo(prompt: string) {
  const videoUrl = await wuliService.generateVideoFromText({
    prompt: videoPrompt,
    duration: 5,
    fps: 24,
  });
  
  return [
    { type: 'text', text: `已为您生成视频：${videoPrompt}` },
    { type: 'video', videoUrl }
  ];
}
```

## 🚀 使用方式

### 图片生成

**触发词：**
- "生成图片"
- "画一张"
- "生图"

**示例：**
```
生成一张猫咪的图片
画一张日落风景
生图：未来城市
```

**API参数：**
```typescript
{
  prompt: string;          // 图片描述
  negativePrompt?: string; // 负面提示词
  width?: number;          // 宽度（默认1024）
  height?: number;         // 高度（默认1024）
  steps?: number;          // 推理步数（默认20）
}
```

### 视频生成

**触发词：**
- "生成视频"
- "做一个视频"
- "生视频"

**示例：**
```
生成一个海浪的视频
做一个视频：樱花飘落
生视频：星空延时
```

**API参数：**
```typescript
{
  prompt: string;    // 视频描述
  duration?: number; // 时长（秒，默认5）
  fps?: number;      // 帧率（默认24）
}
```

## 🔐 认证配置

### Cookie配置（如需要）

如果API需要Cookie认证，在`wuliService.ts`中添加：

```typescript
private async callMCPTool(skillName: string, toolName: string, params: any) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'your_cookie_here' // 添加Cookie
    },
    body: JSON.stringify(params),
  });
}
```

### 环境变量配置

在`.env`文件中配置代理URL（如使用HTTP代理方案）：

```env
VITE_MCP_PROXY_URL=http://localhost:3001
```

## 🧪 测试步骤

### 1. 启动应用
```bash
cd portfolio-site
npm run dev
```

### 2. 访问页面
打开浏览器访问: http://localhost:5173/ai-generator

### 3. 测试图片生成
1. 点击右下角紫色浮动按钮打开Agent
2. 输入："生成一张猫咪的图片"
3. 观察：
   - ✅ 显示工具调用状态
   - ✅ 调用Wuli.art API
   - ✅ 显示生成的图片

### 4. 测试视频生成
1. 输入："生成一个海浪的视频"
2. 观察：
   - ✅ 显示工具调用状态
   - ✅ 调用Wuli.art API
   - ✅ 显示生成的视频（带播放控件）

## 📊 API响应格式

### 成功响应
```json
{
  "success": true,
  "image_url": "https://...",  // 或 video_url
  "metadata": {
    "model": "qwen-image-turbo",
    "duration": 2.5
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误信息"
}
```

## 🐛 故障排查

### 问题1: API调用失败

**检查项：**
1. 确认MCP服务器正在运行
2. 检查网络连接
3. 查看浏览器控制台错误信息

**解决方案：**
- 如果MCP不可用，系统会自动降级到模拟数据
- 检查Cookie是否有效
- 确认API端点配置正确

### 问题2: 图片/视频不显示

**检查项：**
1. 检查返回的URL是否有效
2. 查看Network标签的请求状态
3. 确认CORS配置

**解决方案：**
- 使用代理服务器解决CORS问题
- 检查URL格式是否正确
- 确认资源可访问

### 问题3: 生成速度慢

**原因：**
- AI模型推理需要时间
- 网络延迟

**优化建议：**
- 降低图片分辨率（512x512）
- 减少推理步数（10-15步）
- 使用CDN加速

## 🎨 自定义配置

### 修改默认参数

在`clineService.ts`中修改：

```typescript
// 图片生成默认参数
const imageUrl = await wuliService.generateImage({
  prompt: imagePrompt,
  width: 512,        // 改为512
  height: 512,       // 改为512
  steps: 15,         // 改为15步
});

// 视频生成默认参数
const videoUrl = await wuliService.generateVideoFromText({
  prompt: videoPrompt,
  duration: 3,       // 改为3秒
  fps: 30,           // 改为30帧
});
```

### 添加新功能

#### 图片编辑
```typescript
const editedUrl = await wuliService.editImage(
  originalImageUrl,
  '添加蓝天白云'
);
```

#### 图片转视频
```typescript
const videoUrl = await wuliService.generateVideoFromImage({
  imageUrl: originalImageUrl,
  prompt: '添加动态效果',
  duration: 5
});
```

## 📝 开发注意事项

1. **错误处理**：所有API调用都包含try-catch
2. **降级策略**：MCP不可用时自动使用模拟数据
3. **用户反馈**：显示清晰的加载状态和错误信息
4. **性能优化**：避免频繁调用API
5. **安全性**：不在前端暴露敏感信息

## 🎉 成功标志

当您完成以下测试后，集成即为成功：

1. ✅ 输入"生成一张猫咪的图片"，成功显示图片
2. ✅ 输入"生成一个视频"，成功显示视频
3. ✅ 图片可以点击放大查看
4. ✅ 视频可以正常播放
5. ✅ 错误情况有友好提示
6. ✅ 历史对话正确保存

## 📚 相关文档

- [Wuli.art官方文档](https://wuli.art)
- [Agent测试指南](./AGENT_TEST_GUIDE.md)
- [MCP协议文档](https://modelcontextprotocol.io)

## 🔄 更新日志

### v1.0.0 (2026-03-03)
- ✅ 集成Wuli.art图片生成API
- ✅ 集成Wuli.art视频生成API
- ✅ 实现三种API调用方案
- ✅ 添加错误处理和降级策略
- ✅ 更新UI支持视频显示

---

如有问题，请查看浏览器控制台日志或联系开发团队。
