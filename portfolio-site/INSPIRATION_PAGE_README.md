# Inspiration 页面实现说明

## 页面概述

这是一个仿照 https://gray.wuli.art/inspiration 的灵感页面，主要用于展示AI生成的图片和视频作品。

## 核心功能

### 1. 页面布局
- **顶部导航栏**：包含品牌logo和导航菜单
- **标题区域**：显示"吗哩运营位"
- **标签页切换**：图片生成 / 视频生成
- **输入框区域**：带AI模型选择和各种配置选项
- **横幅广告**：三个渐变色卡片展示产品特性
- **灵感广场**：内容筛选（全部/图片/视频）
- **瀑布流展示区**：响应式图片网格布局

### 2. 瀑布流响应式适配（核心修复）

**问题**：原页面在大于1350px时瀑布流区域不适配

**解决方案**：
```typescript
// 根据容器宽度动态计算列数
const calculateColumnCount = () => {
  if (!containerRef.current) return 3;
  const width = containerRef.current.offsetWidth;
  
  if (width > 1350) {
    return 4; // 超大屏幕显示4列
  } else if (width > 1024) {
    return 3; // 大屏幕显示3列
  } else if (width > 768) {
    return 2; // 中等屏幕显示2列
  } else {
    return 1; // 小屏幕显示1列
  }
};
```

**关键特性**：
- 使用 `useState` 存储当前列数
- 使用 `useEffect` 监听窗口大小变化
- 使用 `useRef` 获取容器实际宽度
- 动态更新 CSS Grid 列数

### 3. 瀑布流布局算法

```typescript
const getWaterfallLayout = () => {
  const columns: InspirationItem[][] = Array.from({ length: columnCount }, () => []);
  const columnHeights = Array(columnCount).fill(0);

  filteredItems.forEach(item => {
    // 找到最短的列
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    // 将项目添加到最短列
    columns[shortestColumnIndex].push(item);
    // 更新列高度
    columnHeights[shortestColumnIndex] += item.height;
  });

  return columns;
};
```

## 响应式断点

| 屏幕宽度 | 列数 | 说明 |
|---------|------|------|
| > 1350px | 4列 | 超大屏幕（修复重点） |
| 1024px - 1350px | 3列 | 大屏幕 |
| 768px - 1024px | 2列 | 中等屏幕 |
| < 768px | 1列 | 小屏幕 |

## 技术栈

- **React 18** + **TypeScript**
- **Tailwind CSS** - 样式框架
- **React Router** - 路由管理
- **CSS Grid** - 瀑布流布局

## 访问方式

启动开发服务器后，访问：
```
http://localhost:5173/inspiration
```

## 文件结构

```
portfolio-site/
├── src/
│   ├── pages/
│   │   └── Inspiration.tsx    # 灵感页面主组件
│   └── App.tsx                # 路由配置
```

## 主要组件

### Inspiration 组件

**State 管理**：
- `activeTab`: 当前激活的标签页（图片/视频）
- `filterType`: 内容筛选类型（全部/图片/视频）
- `items`: 展示项目列表
- `columnCount`: 当前瀑布流列数

**Refs**：
- `containerRef`: 瀑布流容器引用，用于获取实际宽度

**Effects**：
1. 初始化模拟数据
2. 监听窗口大小变化，动态更新列数

## 样式特点

1. **渐变背景**：使用 Tailwind 的 `gradient-to-r` 实现横幅卡片渐变
2. **悬停效果**：图片卡片悬停时放大 + 阴影增强
3. **圆角设计**：统一使用 `rounded-xl` 和 `rounded-2xl`
4. **紫色主题**：品牌色为紫色（`purple-600`）
5. **固定定位**：浮动按钮使用 `fixed` 定位

## 交互功能

1. **标签页切换**：点击切换图片生成/视频生成
2. **内容筛选**：点击筛选全部/图片/视频
3. **图片悬停**：鼠标悬停时图片放大、显示遮罩
4. **响应式布局**：窗口大小变化时自动调整列数

## 优化建议

1. **图片懒加载**：可以添加 Intersection Observer 实现懒加载
2. **虚拟滚动**：数据量大时可以使用虚拟滚动优化性能
3. **骨架屏**：加载时显示骨架屏提升用户体验
4. **真实数据**：替换模拟数据为真实API数据
5. **无限滚动**：滚动到底部时自动加载更多内容

## 注意事项

1. 瀑布流布局依赖于容器的实际宽度，确保容器有明确的宽度
2. 图片高度需要预先知道，否则布局可能不准确
3. 窗口大小变化时会重新计算布局，频繁变化可能影响性能
4. 建议添加防抖处理优化 resize 事件监听

## 测试建议

1. 测试不同屏幕尺寸下的显示效果
2. 测试窗口大小变化时的响应速度
3. 测试筛选功能是否正常工作
4. 测试图片加载失败的情况
5. 测试大量数据时的性能表现
