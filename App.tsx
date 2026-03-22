import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import PixelBackground from './components/PixelBackground';
import DiscoverySlides from './components/DiscoverySlides';
import DataExplanation from './components/DataExplanation';
import TileGridMap from './components/TileGridMap/TileGridMap';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'main' | 'discovery' | 'data' | 'explore'>('landing');
  const [highlightDataId, setHighlightDataId] = useState<number | null>(null);
  const [language, setLanguage] = useState<'CN' | 'EN'>('CN');
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'CN' ? 'EN' : 'CN');
  };

  const handleEnter = () => {
    setCurrentView('main');
    window.scrollTo(0, 0);
  };

  const handleGoToDiscovery = () => {
    setCurrentView('discovery');
    window.scrollTo(0, 0);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    // 通用逻辑：如果是从脚注跳转回来的，根据 highlightDataId 查找对应的 ID 并在渲染后滚动
    if (highlightDataId) {
      setTimeout(() => {
        const element = document.getElementById(`citation-${highlightDataId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // 保持 highlightDataId 不清空或者稍后清空都可以，这里清空以免影响下次
        setHighlightDataId(null);
      }, 100);
    } else {
      // 默认回到主页
      setTimeout(() => {
        if (containerRef.current) containerRef.current.scrollTop = window.innerHeight;
      }, 10);
    }
  };

  const handleGoToData = (id?: number) => {
    if (id) setHighlightDataId(id);
    setCurrentView('data');
    window.scrollTo(0, 0);
  };

  const handleGoToExplore = () => {
    setCurrentView('explore');
    window.scrollTo(0, 0);
  };



  if (currentView === 'landing') {
    return <LandingPage onEnter={handleEnter} />;
  }

  if (currentView === 'discovery') {
    return <DiscoverySlides onBack={handleBackToMain} />;
  }


  if (currentView === 'data') {
    return <DataExplanation onBack={handleBackToMain} highlightId={highlightDataId} />;
  }

  if (currentView === 'explore') {
    return <TileGridMap onBack={handleBackToMain} />;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory bg-[#121212] selection:bg-[#ff4d94]/30"
    >

      {/* 第一部分：首屏视频（留白屏） */}
      <section className="h-screen w-full snap-start flex items-center justify-center relative bg-black overflow-hidden relative">
        {/* 背景视频 */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80 z-0 pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={`${import.meta.env.BASE_URL}video.mp4`} type="video/mp4" />
        </video>

        {/* 提示文字 */}
        <div className="absolute bottom-12 text-white/50 font-mono text-[10px] tracking-[0.6em] uppercase animate-pulse z-10 pointer-events-none">
          SCROLL_TO_REVEAL
        </div>
      </section>

      {/* 第二部分：内容展示 */}
      <section className="min-h-screen w-full snap-start relative flex flex-col items-center justify-center py-32 px-6">
        <PixelBackground />

        {/* 内容容器：严格控制在屏幕约 1/2 宽度 */}
        <div className="w-full max-w-2xl z-10 flex flex-col items-center space-y-28">

          {/* 我们的初衷 */}
          <div className="w-full space-y-12">
            <h2 className="text-[#22c55e] font-bold text-center text-xl tracking-[0.5em]">我们的初衷</h2>
            <div className="text-zinc-300 text-[15px] leading-[2.2] space-y-10 font-light tracking-wide text-justify">
              <p className="text-center italic text-zinc-500 mb-14 text-sm border-b border-zinc-800/50 pb-10">
                哲学家维特根斯坦认为：语言的边界即是思想的边界。
              </p>
              <p>
                AI时代，大模型正悄然进入搜索框、朋友圈等各个场景，它的语言，将从很大程度上影响人类的思想。也许短时间内，我们无法获知影响几何，但可以借模型之眼，了解性别如何被人类过往生产的庞大语料，被精心设计的算法结构观看和评论。
              </p>
              <p>
                而当屏幕前的你凝视着这个作品，实际上是现在的你，在凝视人类的过去，此刻，你看到了什么？又在思考什么？
              </p>
              <p>
                我们把这种互相凝视，抽象成“眼睛”这一视觉映射，希望能帮助人们重新审视并思考性别的现实与想象。
                大模型会如何描述男性和女性？这些文本数据将展现出不同经济水平、语言、性别之间的何种差异与共性？这背后又隐含了哪些“刻板印象”？
              </p>
            </div>
          </div>

          {/* 方法 */}
          <div className="w-full space-y-12">
            <h2 className="text-[#22c55e] font-bold text-center text-xl tracking-[0.5em]">方法</h2>
            <div className="text-zinc-300 text-[15px] leading-[2.2] text-center font-light tracking-wide">
              <p className="mb-8">
                我们以ChatGPT和DeepSeek两种大语言模型为对象，系统采集其对196个国家“男人是……”和“女人是……”的续写回答，每个国家、性别、语言采集10条生成文本，总计近8千条。
                <span
                  id="citation-1"
                  onClick={() => handleGoToData(1)}
                  className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
                >1</span>
              </p>
              <p className="opacity-50 text-zinc-400 text-[13px] italic">
                也许这种句式已经带有本质主义的偏向，但它就像一场“高压测试”，能最大限度地暴露模型内在的偏见结构与训练语料的倾斜性。
              </p>
            </div>
          </div>

          {/* 交互导航区 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-24 pt-16">

            {/* 我们发现了什么 - 点击跳转 */}
            <div
              onClick={handleGoToDiscovery}
              className="flex flex-col items-center group cursor-pointer relative"
            >
              {/* 悬停显示的粉色光标 */}
              {/* 悬停显示的粉色光标 */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-10">
                <img src={import.meta.env.BASE_URL + "ICON/cursor_pink.png"} alt="cursor" className="w-6 h-auto" />
              </div>

              <div className="w-32 h-32 flex items-center justify-center mb-6 transition-all duration-300">
                <img src={import.meta.env.BASE_URL + "ICON/buttom01_cn.png"} alt="icon" className="w-full h-full object-contain group-hover:hidden transition-all duration-300" />
                <img src={import.meta.env.BASE_URL + "ICON/buttom01_cn_hover.png"} alt="icon hover" className="w-full h-full object-contain hidden group-hover:block transition-all duration-300" />
              </div>

            </div>

            {/* 探索8000条回答 */}
            {/* 探索8000条回答 - Now clickable */}
            <div
              onClick={handleGoToExplore}
              className="flex flex-col items-center group cursor-pointer relative"
            >
              {/* 悬停显示的粉色光标 */}
              {/* 悬停显示的粉色光标 */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-10">
                <img src={import.meta.env.BASE_URL + "ICON/cursor_pink.png"} alt="cursor" className="w-6 h-auto" />
              </div>

              <div className="w-32 h-32 flex items-center justify-center mb-6 transition-all duration-300">
                <img src={import.meta.env.BASE_URL + "ICON/buttom02_cn.png"} alt="icon" className="w-full h-full object-contain group-hover:hidden transition-all duration-300" />
                <img src={import.meta.env.BASE_URL + "ICON/buttom02_cn_hover.png"} alt="icon hover" className="w-full h-full object-contain hidden group-hover:block transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* 底部导航栏 - 改为跟随内容的静态布局 */}
        <div className="w-full px-6 md:px-12 flex justify-between items-end z-10 mt-32">
          <div
            onClick={() => handleGoToData()}
            className="w-32 h-10 relative cursor-pointer group"
          >
            <img src={import.meta.env.BASE_URL + "ICON/data_zh.png"} alt="Data Explanation" className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
            <img src={import.meta.env.BASE_URL + "ICON/data_zh_hover.png"} alt="Data Explanation Hover" className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
          </div>

          <div
            onClick={toggleLanguage}
            className="w-32 h-10 relative cursor-pointer group"
          >
            <img
              src={language === 'CN' ? (import.meta.env.BASE_URL + "ICON/language_zh.png") : (import.meta.env.BASE_URL + "ICON/language_en.png")}
              alt="Language Switch"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </section>



    </div>
  );
};

export default App;
