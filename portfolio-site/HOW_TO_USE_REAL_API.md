# 如何使用Wuli.art真实API

## 🔍 问题说明

当前Agent对话系统使用的是**模拟数据**，原因是：

1. **浏览器环境限制**：前端JavaScript无法直接调用MCP工具
2. **MCP工具需要Cline环境**：只有在Cline/VSCode扩展环境中才能使用MCP工具
3. **跨域限制**：直接从浏览器调用Wuli.art API会遇到CORS问题

## ✅ 解决方案

### 方案1：通过Cline直接使用（推荐）

**在Cline对话中直接使用MCP工具生成图片/视频：**

```
请帮我生成一张猫咪的图片
```

Cline会自动调用image-gen MCP工具，使用Wuli.art真实API生成图片。

**优点：**
- ✅ 真实API调用
- ✅ 无需额外配置
- ✅ 直接在Cline中使用

**缺点：**
- ❌ 不是在Agent对话框中使用
- ❌ 需要在Cline主界面操作

### 方案2：创建后端代理服务器

创建一个Node.js后端服务器，代理MCP工具调用：

#### 步骤1：创建代理服务器

```bash
# 创建新目录
mkdir wuli-proxy-server
cd wuli-proxy-server

# 初始化项目
npm init -y

# 安装依赖
npm install express cors
```

#### 步骤2：创建server.js

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 代理MCP工具调用
app.post('/api/mcp/:skill/:tool', async (req, res) => {
  const { skill, tool } = req.params;
  const params = req.body;
  
  try {
    // 这里需要实现MCP工具调用逻辑
    // 可以通过VSCode扩展API或直接调用Wuli.art API
    
    // 示例：调用Wuli.art API
    const response = await fetch('https://wuli.art/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': process.env.WULI_COOKIE // 从环境变量读取Cookie
      },
      body: JSON.stringify(params)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('代理服务器运行在 http://localhost:3001');
});
```

#### 步骤3：配置环境变量

创建`.env`文件：

```env
WULI_COOKIE=your_cookie_here
```

#### 步骤4：启动服务器

```bash
node server.js
```

#### 步骤5：配置前端

在`portfolio-site/.env`中添加：

```env
VITE_MCP_PROXY_URL=http://localhost:3001/api
```

### 方案3：直接调用Wuli.art API（需要Cookie）

如果您有Wuli.art的API访问权限和Cookie，可以直接在前端调用：

#### 修改wuliService.ts

```typescript
private async callMCPTool(skillName: string, toolName: string, params: any): Promise<any> {
  // 直接调用Wuli.art API
  const apiUrl = 'https://wuli.art/api/v1/generate'; // 替换为实际API地址
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'your_cookie_here', // 使用您提供的Cookie
      },
      body: JSON.stringify({
        prompt: params.prompt,
        width: params.width,
        height: params.height,
        // 其他参数
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      image_url: data.image_url || data.url,
    };
  } catch (error) {
    console.error('API调用失败:', error);
    // 降级到模拟数据
    return this.getMockResponse(skillName, toolName, params);
  }
}
```

**注意：** 这种方式可能遇到CORS问题，建议使用方案2的代理服务器。

## 🎯 推荐使用流程

### 当前最佳实践

1. **在Agent对话框中体验UI和交互**
   - 测试对话流程
   - 测试历史记录功能
   - 查看工具调用可视化
   - 使用模拟数据预览效果

2. **在Cline主界面使用真实API**
   - 直接对Cline说："生成一张猫咪的图片"
   - Cline会自动调用image-gen工具
   - 获得真实的Wuli.art生成结果

3. **如需在Agent中使用真实API**
   - 实施方案2：创建代理服务器
   - 配置环境变量
   - 重启应用

## 📝 使用示例

### 在Cline中使用（真实API）

```
用户：生成一张猫咪的图片
Cline：[调用image-gen MCP工具]
      [返回真实生成的图片URL]
```

### 在Agent对话框中使用（当前为模拟数据）

```
用户：生成一张猫咪的图片
Agent：[显示工具调用状态]
       [返回模拟图片]
```

## 🔧 技术限制说明

### 为什么浏览器无法直接调用MCP？

1. **MCP协议设计**：MCP是为服务器端设计的协议
2. **安全限制**：浏览器的同源策略限制
3. **环境隔离**：MCP工具运行在VSCode扩展环境中

### 解决方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| 方案1：Cline直接使用 | 简单、真实API | 不在Agent中 | ⭐⭐⭐⭐⭐ |
| 方案2：代理服务器 | 真实API、在Agent中 | 需要额外服务器 | ⭐⭐⭐⭐ |
| 方案3：直接调用API | 简单 | CORS问题、需要Cookie | ⭐⭐⭐ |

## 🎉 总结

**当前状态：**
- ✅ Agent UI完整可用
- ✅ 历史对话功能正常
- ✅ 工具调用可视化完善
- ⚠️ 使用模拟数据（浏览器环境限制）

**使用真实API：**
- 🎯 **推荐**：在Cline主界面直接使用
- 🔧 **进阶**：实施代理服务器方案
- 📖 **参考**：本文档提供的实现方案

**下一步：**
1. 在Cline中测试真实API：`生成一张猫咪的图片`
2. 如需在Agent中使用，实施代理服务器方案
3. 参考本文档进行配置

---

如有问题，请查看：
- [Wuli.art官方文档](https://wuli.art)
- [MCP协议文档](https://modelcontextprotocol.io)
- [Agent测试指南](./AGENT_TEST_GUIDE.md)
