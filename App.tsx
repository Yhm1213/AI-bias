
import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import PixelBackground from './components/PixelBackground';
import DiscoverySlides from './components/DiscoverySlides';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'main' | 'discovery'>('landing');
  const [showControls, setShowControls] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    // 回到主页后稍微延迟一下以触发滚动监听
    setTimeout(() => {
       if (containerRef.current) containerRef.current.scrollTop = window.innerHeight;
    }, 10);
  };

  // 监听滚动位置，控制底部按钮的显示与隐藏
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && currentView === 'main') {
        const scrollTop = containerRef.current.scrollTop;
        const vh = window.innerHeight;
        setShowControls(scrollTop > vh * 0.4);
      }
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentView]);

  if (currentView === 'landing') {
    return <LandingPage onEnter={handleEnter} />;
  }

  if (currentView === 'discovery') {
    return <DiscoverySlides onBack={handleBackToMain} />;
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory bg-[#121212] selection:bg-[#ff4d94]/30"
    >
      
      {/* 第一部分：留白屏 */}
      <section className="h-screen w-full snap-start flex items-center justify-center relative">
        <div className="text-zinc-800 font-mono text-[10px] tracking-[0.6em] uppercase opacity-10">
          VOID // SCROLL_TO_REVEAL
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
                我们以ChatGPT和DeepSeek两种大语言模型为对象，系统采集其对196个国家“男人是……”和“女人是……”的续写回答，每个国家、性别、语言采集10条生成文本，总计近8千条。<span className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1">1</span>
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
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#ff4d94] opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 text-xs">▼</div>
              
              <div className="w-32 h-32 pixel-border flex items-center justify-center mb-6 group-hover:border-[#ff4d94] group-hover:bg-[#ff4d94]/5 transition-all duration-300">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="transition-colors duration-300">
                  <rect x="5" y="10" width="22" height="22" rx="11" stroke="currentColor" strokeWidth="2" className="text-[#22c55e] group-hover:text-[#ff4d94]"/>
                  <rect x="33" y="10" width="22" height="22" rx="11" stroke="currentColor" strokeWidth="2" className="text-[#22c55e] group-hover:text-[#ff4d94]"/>
                  <path d="M27 21C30 21 30 21 33 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#22c55e] group-hover:text-[#ff4d94]"/>
                </svg>
              </div>
              <span className="text-[#22c55e] group-hover:text-[#ff4d94] text-xs font-medium tracking-[0.4em] transition-all uppercase">我们发现了什么</span>
            </div>

            {/* 探索8000条回答 */}
            <div className="flex flex-col items-center group cursor-pointer relative">
              {/* 悬停显示的粉色光标 */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#ff4d94] opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 text-xs">▼</div>
              
              <div className="w-32 h-32 pixel-border flex items-center justify-center mb-6 group-hover:border-[#ff4d94] group-hover:bg-[#ff4d94]/5 transition-all duration-300">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="transition-colors duration-300">
                  <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="2" className="text-[#22c55e] group-hover:text-[#ff4d94]"/>
                  <path d="M18 18L26 26M26 18L18 26" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-[#22c55e] group-hover:text-[#ff4d94]"/>
                  <line x1="31" y1="31" x2="42" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#22c55e] group-hover:text-[#ff4d94]"/>
                </svg>
              </div>
              <span className="text-[#22c55e] group-hover:text-[#ff4d94] text-xs font-medium tracking-[0.4em] transition-all uppercase">探索8000条回答</span>
            </div>
          </div>
        </div>
      </section>

      {/* 固定底栏：仅在 showControls 且在主视图时显现 */}
      <div 
        className={`fixed bottom-10 left-0 w-full px-12 flex justify-between items-end z-[50] transition-all duration-1000 pointer-events-none ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="pointer-events-auto">
          <button className="border border-[#22c55e]/60 text-[#22c55e] px-6 py-2.5 font-mono text-[10px] tracking-[0.25em] hover:bg-[#22c55e] hover:text-[#121212] hover:border-[#22c55e] transition-all duration-500 uppercase">
            数据说明
          </button>
        </div>
        <div className="flex pointer-events-auto items-center overflow-hidden border border-[#22c55e]/20 bg-[#121212]/90 backdrop-blur-md">
          <div className="bg-[#22c55e] text-[#121212] px-5 py-2.5 text-[10px] font-bold font-mono tracking-widest">中文</div>
          <div className="text-[#22c55e] px-5 py-2.5 text-[10px] font-mono opacity-40 hover:opacity-100 hover:bg-[#22c55e]/5 cursor-pointer transition-all uppercase tracking-widest">English</div>
        </div>
      </div>

    </div>
  );
};

export default App;
