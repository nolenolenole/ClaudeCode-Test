# 交互设计师作品集网站

一个现代化、响应式的交互设计师个人作品集网站，使用 React + TypeScript + Tailwind CSS 构建。

## ✨ 特性

- 🎨 **现代化设计** - 简约优雅的界面设计
- 🌓 **深色模式** - 支持亮色/暗色主题切换
- 📱 **响应式布局** - 完美适配移动端、平板和桌面设备
- ⚡ **流畅动画** - 使用 Framer Motion 实现丰富的动画效果
- 🎯 **SEO 优化** - 良好的搜索引擎优化
- 🚀 **性能优化** - 快速加载和流畅体验

## 📦 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **路由**: React Router v6
- **图标**: Lucide React
- **部署**: 可部署到 Vercel/Netlify

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 查看网站

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
portfolio-site/
├── src/
│   ├── components/          # 可复用组件
│   │   └── layout/         # 布局组件
│   ├── contexts/           # React Context
│   ├── data/               # 静态数据
│   ├── pages/              # 页面组件
│   ├── types/              # TypeScript 类型定义
│   ├── App.tsx             # 应用入口
│   ├── main.tsx            # 主文件
│   └── index.css           # 全局样式
├── public/                 # 静态资源
└── package.json
```

## 🎨 页面说明

- **首页** (`/`) - 展示个人介绍和精选作品
- **作品集** (`/portfolio`) - 展示所有设计作品
- **作品详情** (`/portfolio/:id`) - 单个作品的详细信息
- **关于我** (`/about`) - 个人简介、技能、经历和教育背景
- **博客** (`/blog`) - 设计文章和思考
- **联系** (`/contact`) - 联系方式和留言表单

## 🔧 自定义配置

### 修改个人信息

编辑 `src/data/profile.ts` 文件，更新个人信息、技能、经历等。

### 添加作品

编辑 `src/data/projects.ts` 文件，添加或修改作品信息。

### 添加博客文章

编辑 `src/data/blog.ts` 文件，添加或修改博客文章。

### 修改主题颜色

编辑 `tailwind.config.js` 文件中的 `colors` 配置。

## 📝 数据结构

### 项目数据 (Project)

```typescript
{
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  tags: string[];
  year: string;
  client?: string;
  role: string;
  duration: string;
  challenge: string;
  solution: string;
  results: string[];
  link?: string;
  featured: boolean;
}
```

### 博客文章 (BlogPost)

```typescript
{
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
}
```

## 🌐 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### Netlify 部署

1. 将代码推送到 GitHub
2. 在 Netlify 中导入项目
3. 构建命令: `npm run build`
4. 发布目录: `dist`

## 📄 许可证

MIT License

## 👤 作者

张设计 - 交互设计师

- 邮箱: designer@example.com
- 位置: 中国 · 上海

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
