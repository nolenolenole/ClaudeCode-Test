import React, { useState, useEffect, useRef } from 'react';

interface InspirationItem {
  id: number;
  imageUrl: string;
  title: string;
  type: 'image' | 'video';
  height: number;
}

const Inspiration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [columnCount, setColumnCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // 模拟数据
  useEffect(() => {
    const mockItems: InspirationItem[] = [
      { id: 1, imageUrl: 'https://via.placeholder.com/300x400', title: '醒狮2026', type: 'image', height: 400 },
      { id: 2, imageUrl: 'https://via.placeholder.com/300x600', title: 'CAMP IN THE CITY', type: 'image', height: 600 },
      { id: 3, imageUrl: 'https://via.placeholder.com/300x350', title: '职场羊', type: 'image', height: 350 },
      { id: 4, imageUrl: 'https://via.placeholder.com/300x450', title: '金马', type: 'image', height: 450 },
      { id: 5, imageUrl: 'https://via.placeholder.com/300x500', title: '有机认证', type: 'image', height: 500 },
      { id: 6, imageUrl: 'https://via.placeholder.com/300x380', title: '彩虹独角兽', type: 'image', height: 380 },
      { id: 7, imageUrl: 'https://via.placeholder.com/300x420', title: '玩偶装', type: 'image', height: 420 },
      { id: 8, imageUrl: 'https://via.placeholder.com/300x360', title: '笑脸女孩', type: 'image', height: 360 },
      { id: 9, imageUrl: 'https://via.placeholder.com/300x480', title: '卡通角色', type: 'image', height: 480 },
    ];
    setItems(mockItems);
  }, []);

  // 计算瀑布流列数
  const calculateColumnCount = () => {
    if (!containerRef.current) return 3;
    const width = containerRef.current.offsetWidth;
    
    // 修复：大于1350px时的适配
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

  // 监听窗口大小变化
  useEffect(() => {
    const updateColumnCount = () => {
      const newColumnCount = calculateColumnCount();
      setColumnCount(newColumnCount);
    };

    // 初始化
    updateColumnCount();

    // 添加resize监听
    window.addEventListener('resize', updateColumnCount);
    
    // 清理
    return () => {
      window.removeEventListener('resize', updateColumnCount);
    };
  }, []);

  // 瀑布流布局计算
  const getWaterfallLayout = () => {
    const columns: InspirationItem[][] = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);

    const filteredItems = items.filter(item => 
      filterType === 'all' || item.type === filterType
    );

    filteredItems.forEach(item => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columns[shortestColumnIndex].push(item);
      columnHeights[shortestColumnIndex] += item.height;
    });

    return columns;
  };

  const columns = getWaterfallLayout();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              吗
            </div>
            <span className="text-xl font-semibold">吗哩</span>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-purple-600 font-medium">页面</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">生成</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">资产</a>
          </nav>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">吗哩运营位</h1>

        {/* 标签页 */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('image')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'image'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>🖼️</span>
              <span>图片生成</span>
            </span>
            {activeTab === 'image' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'video'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>🎬</span>
              <span>视频生成</span>
            </span>
            {activeTab === 'video' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
            )}
          </button>
        </div>

        {/* 输入框区域 */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <button className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-colors">
              +
            </button>
            <div className="flex-1">
              <textarea
                placeholder="请输入你的创意 (按 Enter 发送，Shift+Enter 换行)"
                className="w-full min-h-[80px] border-0 focus:outline-none resize-none text-gray-700 placeholder-gray-400"
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                    <span>🎨</span>
                    <span>Qwen Image 2.0</span>
                    <span>▼</span>
                  </button>
                  <button className="text-gray-600 hover:text-purple-600">智能配图</button>
                  <button className="text-gray-600 hover:text-purple-600">高清2K</button>
                  <button className="text-gray-600 hover:text-purple-600">4张</button>
                  <button className="text-purple-600">🎭 视觉创意</button>
                  <button className="text-gray-600 hover:text-purple-600">😊</button>
                </div>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  翻译
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 横幅广告 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Hailuo 2.3/2.3 Fast 上线</h3>
            <p className="text-sm opacity-90">立即体验 &gt;</p>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded">小红书联名</div>
            <h3 className="text-xl font-bold mb-2">吗哩AI，认识一下</h3>
            <p className="text-sm opacity-90">关注官方小红书 &gt;</p>
            <div className="absolute bottom-0 right-0 w-24 h-24">
              <div className="w-full h-full bg-yellow-300 rounded-tl-full"></div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Qwen Image 2.0上新</h3>
            <p className="text-sm opacity-90">更准文字渲染、更强语意理解 &gt;</p>
          </div>
        </div>

        {/* 灵感广场 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">灵感广场</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'image'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              图片
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'video'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              视频
            </button>
          </div>
        </div>

        {/* 瀑布流区域 - 修复大于1350px的适配问题 */}
        <div 
          ref={containerRef}
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          }}
        >
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {column.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ height: `${item.height}px` }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* 浮动按钮 */}
      <div className="fixed bottom-8 left-8 flex flex-col space-y-4">
        <button className="w-12 h-12 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-yellow-500 transition-colors">
          <span className="text-xl">⚡</span>
        </button>
        <div className="text-center text-xs text-gray-600">
          <div>450</div>
          <div>消耗积分</div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
        <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-xl">⚙️</span>
        </button>
        <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-xl">☰</span>
        </button>
      </div>
    </div>
  );
};

export default Inspiration;
