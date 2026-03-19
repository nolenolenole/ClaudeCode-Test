import React, { useState } from 'react';
import { 
  Compass, 
  Wand2, 
  Package, 
  Layout, 
  MessageCircle, 
  MoreHorizontal,
  ChevronDown,
  Maximize2,
  Upload,
  ChevronRight,
  Copy,
  Edit,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AgentPanel, AgentFloatingButton } from '../components/agent/AgentPanel';

// 侧边导航栏组件
const Sidebar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('discover');

  const menuItems = [
    { id: 'discover', icon: Compass, label: '发现', active: true },
    { id: 'generate', icon: Wand2, label: '生成', active: false },
    { id: 'assets', icon: Package, label: '资产', active: false },
    { id: 'canvas', icon: Layout, label: '画布', active: false },
  ];

  return (
    <div className="w-22 h-screen bg-gradient-to-b from-[#F9FFFE] via-[#F2F3FE] to-[#FDF9FE] flex flex-col items-center p-1">
      {/* Logo */}
      <div className="w-20 h-20 rounded flex items-center justify-center mb-7 relative">
        <img 
          src="https://img.alicdn.com/imgextra/i3/O1CN01VfBPxq1tIBCQRwU5p_!!6000000005878-2-tps-98-76.png" 
          alt="Logo" 
          className="w-12 h-9"
        />
        <img 
          src="https://img.alicdn.com/imgextra/i1/O1CN01F8W5H929QSCtFaqtp_!!6000000008062-2-tps-86-41.png" 
          alt="Beta" 
          className="w-10 h-5 absolute bottom-3 left-1/2 -translate-x-1/2"
        />
      </div>

      {/* 菜单栏 */}
      <nav className="flex flex-col gap-3 items-center">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className="flex flex-col items-center gap-1 w-10"
          >
            <div className={`rounded-lg w-10 h-10 flex items-center justify-center ${
              activeMenu === item.id ? 'bg-white' : ''
            }`}>
              <item.icon 
                size={24} 
                className={activeMenu === item.id ? 'text-[#6928FE]' : 'text-gray-400'}
                fill={activeMenu === item.id && item.id === 'discover' ? '#6928FE' : 'none'}
              />
            </div>
            <span className={`text-xs text-center ${
              activeMenu === item.id ? 'text-[#6928FE] font-medium' : 'text-gray-400'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* 辅助功能面板 */}
      <div className="flex flex-col gap-3 items-center mt-auto mb-4">
        {/* 积分入口 */}
        <div 
          className="rounded-2xl bg-white p-3 flex flex-col items-center shadow-sm"
          style={{
            border: '3px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(130deg, #BBA6FF, #AADCFE 50%, #DFC2FF 89%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="flex items-center gap-0.5">
            <Star size={16} className="text-[#6928FE]" fill="#6928FE" />
            <span className="text-xs font-medium text-[#6928FE]">100</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">邀请有礼</span>
        </div>

        {/* 默认头像 */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D6F482] via-[#AAE1FE] to-[#5BF2C6] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#F9FFFE] via-[#F2F3FE] to-[#FDF9FE] flex items-center justify-center">
            <img 
              src="https://img.alicdn.com/imgextra/i4/O1CN01C7eGa61VJ3ApUSHRr_!!6000000002631-2-tps-42-42.png" 
              alt="Avatar" 
              className="w-5 h-5"
            />
          </div>
        </div>

        {/* 消息 */}
        <button className="w-8 h-8 flex items-center justify-center">
          <MessageCircle size={24} className="text-gray-400" />
        </button>

        {/* 更多设置 */}
        <button className="w-8 h-8 flex items-center justify-center">
          <MoreHorizontal size={24} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

// Tab切换组件
const TabSwitch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  return (
    <div className="flex rounded-3xl bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setActiveTab('image')}
        className={`flex items-center gap-2 px-4 py-2 rounded-3xl transition-colors ${
          activeTab === 'image' 
            ? 'bg-white text-[#6928FE] font-medium' 
            : 'text-gray-600'
        }`}
      >
        <Layout size={20} />
        <span className="text-sm">图片生成</span>
      </button>
      <button
        onClick={() => setActiveTab('video')}
        className={`flex items-center gap-2 px-4 py-2 transition-colors ${
          activeTab === 'video' 
            ? 'bg-white text-[#6928FE] font-medium' 
            : 'text-gray-600'
        }`}
      >
        <Wand2 size={20} />
        <span className="text-sm">视频生成</span>
      </button>
    </div>
  );
};

// 图片卡片组件
const ImageCard: React.FC<{ src: string; author?: string }> = ({ src, author }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <img src={src} alt="Inspiration" className="w-full h-auto" />
      
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#D6F482] via-[#AAE1FE] to-[#5BF2C6] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              {author && <span className="text-white text-xs">{author}</span>}
            </div>
            <div className="flex gap-1">
              <button className="w-4 h-4 flex items-center justify-center">
                <Copy size={13} className="text-white" />
              </button>
              <button className="w-4 h-4 flex items-center justify-center">
                <Edit size={11} className="text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// 主页面组件
const AIGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  const inspirationImages = [
    // 第一列
    'https://img.alicdn.com/imgextra/i4/O1CN01S1baMC1FYalHXtu9G_!!6000000000499-2-tps-360-480.png',
    'https://img.alicdn.com/imgextra/i1/O1CN01CSB3M01LM7fiUayfK_!!6000000001284-2-tps-360-480.png',
    // 第二列
    'https://img.alicdn.com/imgextra/i4/O1CN01xCJ7sK1gN8TrPD0ec_!!6000000004129-2-tps-360-480.png',
    'https://img.alicdn.com/imgextra/i1/O1CN01FumToY1SBm2AmKNpc_!!6000000002209-2-tps-360-481.png',
    // 第三列
    'https://img.alicdn.com/imgextra/i4/O1CN01PdPldM1KwvtCwwfcF_!!6000000001229-2-tps-360-427.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01ZUsVNz1P0NKVaSive_!!6000000001778-2-tps-360-480.png',
    // 第四列
    'https://img.alicdn.com/imgextra/i4/O1CN01u9r2z91USNcuFd6xO_!!6000000002516-2-tps-360-480.png',
    'https://img.alicdn.com/imgextra/i4/O1CN01JpcPw81Ff0J4EkRLt_!!6000000000513-2-tps-360-480.png',
    // 第五列
    'https://img.alicdn.com/imgextra/i4/O1CN01uih2jC1jo6eQFhSlx_!!6000000004594-2-tps-360-375.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01V3Gq8e1wBiSOpk3pE_!!6000000006270-2-tps-360-480.png',
    // 第六列
    'https://img.alicdn.com/imgextra/i2/O1CN01ZEcici1TRAy97LttD_!!6000000002378-2-tps-360-480.png',
    'https://img.alicdn.com/imgextra/i1/O1CN01TBBEn921MJhfE74u4_!!6000000006970-2-tps-360-480.png',
  ];

  return (
    <>
      <div className="flex h-screen bg-gradient-to-b from-[#F9FFFE] via-[#F2F3FE] to-[#FDF9FE]">
        {/* 侧边导航栏 */}
        <Sidebar />

        {/* 主内容区域 */}
        <div className="flex-1 rounded-l-3xl bg-white overflow-y-auto">
          <div className="w-full h-full p-4 sm:p-6 lg:p-8">
          {/* 顶部标题 */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">无限画布</h1>
            <div className="flex items-center gap-2">
              <TabSwitch />
            </div>
          </div>

          {/* 生成区域 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-2 sm:p-3 mb-4 sm:mb-6">
            <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
              {/* 图片上传 */}
              <div className="w-10 sm:w-12 h-12 sm:h-16 rounded-lg sm:rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors flex-shrink-0">
                <Upload size={20} className="text-gray-400 sm:w-6 sm:h-6" />
              </div>

              {/* 提示词输入 */}
              <div className="flex-1 min-w-0">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="请输入你的创意..."
                  className="w-full h-12 sm:h-16 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-400 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* 参数和操作栏 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {/* 模型选择 */}
                <button className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 hover:border-gray-300 transition-colors text-xs">
                  <span className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">Qwen Image Turbo</span>
                  <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                </button>

                {/* 图片参数 */}
                <button className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 hover:border-gray-300 transition-colors text-xs">
                  <Maximize2 size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-900">智能比例</span>
                  <span className="font-medium text-gray-300 hidden sm:inline">｜</span>
                  <span className="font-medium text-gray-900 hidden sm:inline">高清2K</span>
                  <span className="font-medium text-gray-300 hidden sm:inline">｜</span>
                  <span className="font-medium text-gray-900 hidden sm:inline">1张</span>
                  <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                </button>

                {/* 联想助手 */}
                <button className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 hover:border-gray-300 transition-colors text-xs">
                  <Wand2 size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-900">联想助手</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
                {/* 翻译按钮 */}
                <button className="rounded bg-white px-2 py-1 flex items-center gap-1 hover:bg-gray-50 transition-colors">
                  <span className="text-xs font-medium text-purple-500">翻译</span>
                </button>

                {/* 生成按钮 */}
                <button 
                  disabled={!prompt}
                  className="rounded-2xl sm:rounded-3xl bg-gray-300 disabled:bg-gray-300 enabled:bg-purple-600 px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 text-white transition-colors"
                >
                  <Star size={14} fill="white" className="sm:w-4 sm:h-4" />
                  <span className="text-xs font-medium">4</span>
                </button>
              </div>
            </div>
          </div>

          {/* 运营位 */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 mb-4 sm:mb-6">
            <div className="rounded-2xl sm:rounded-3xl bg-gray-800 overflow-hidden w-full sm:flex-[2] h-[100px] relative">
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                <span className="text-lg sm:text-xl text-white">无限画布上新</span>
                <button className="flex items-center text-white text-xs sm:text-sm">
                  立即体验
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="rounded-2xl sm:rounded-3xl bg-purple-50 w-full sm:flex-1 h-[100px] p-4 sm:p-6 flex flex-col justify-center">
              <span className="text-lg sm:text-xl text-gray-900">AI视频创作计划</span>
              <button className="flex items-center text-gray-900 text-xs sm:text-sm mt-1.5">
                查看教程
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="rounded-2xl sm:rounded-3xl bg-purple-50 w-full sm:flex-1 h-[100px] p-4 sm:p-6 flex flex-col justify-center">
              <span className="text-lg sm:text-xl text-gray-900">Wan2.6模型上新啦</span>
              <span className="text-xs sm:text-sm text-gray-900 mt-1.5">速度更快，支持2~15秒动态时长</span>
            </div>
          </div>

          {/* 灵感广场 */}
          <div>
            <h2 className="text-sm sm:text-base font-medium text-gray-900 mb-2">灵感广场</h2>
            <div className="flex gap-4 sm:gap-6 mb-2 overflow-x-auto">
              <button className="text-xs font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap">全部</button>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap">图片</button>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap">视频</button>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-900 whitespace-nowrap">无限画布</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
              {inspirationImages.map((img, index) => (
                <ImageCard key={index} src={img} author={index === 1 ? '呜哩' : undefined} />
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Agent面板 */}
      <AgentPanel isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />

      {/* 浮动按钮 */}
      {!isAgentOpen && (
        <AgentFloatingButton onClick={() => setIsAgentOpen(true)} />
      )}
    </>
  );
};

export default AIGenerator;
