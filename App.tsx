import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import PixelBackground from './components/PixelBackground';
import DiscoverySlides from './components/DiscoverySlides';
import DataExplanation from './components/DataExplanation';
import TileGridMap from './components/TileGridMap/TileGridMap';

import { useTranslation } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'main' | 'discovery' | 'data' | 'explore'>('landing');
  const [previousView, setPreviousView] = useState<'landing' | 'main' | 'discovery' | 'data' | 'explore' | null>(null);
  const [highlightDataId, setHighlightDataId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingScrollAction = useRef<'highlight' | 'default' | null>(null);

  const { language, toggleLanguage, t } = useTranslation();

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
    if (highlightDataId) {
      pendingScrollAction.current = 'highlight';
    } else {
      pendingScrollAction.current = 'default';
    }
  };

  const handleBackFromData = () => {
    setCurrentView(previousView || 'main');
    if (highlightDataId) {
      pendingScrollAction.current = 'highlight';
    } else {
      pendingScrollAction.current = 'default';
    }
  };

  useLayoutEffect(() => {
    if (currentView === 'main') {
      if (pendingScrollAction.current === 'highlight') {
        const element = document.getElementById(`citation-${highlightDataId}`);
        if (element && containerRef.current) {
          // Temporarily disable scroll snap to prevent jumping animations forced by the browser
          const orig = containerRef.current.style.scrollSnapType;
          containerRef.current.style.scrollSnapType = 'none';
          element.scrollIntoView({ behavior: 'auto', block: 'center' });
          containerRef.current.style.scrollSnapType = orig;
        }
        setHighlightDataId(null);
        pendingScrollAction.current = null;
      } else if (pendingScrollAction.current === 'default') {
        if (containerRef.current) {
          const orig = containerRef.current.style.scrollSnapType;
          containerRef.current.style.scrollSnapType = 'none';
          containerRef.current.scrollTop = window.innerHeight;
          containerRef.current.style.scrollSnapType = orig;
        }
        pendingScrollAction.current = null;
      }
    }
  }, [currentView, highlightDataId]);

  const handleGoToData = (id?: number) => {
    if (id) setHighlightDataId(id);
    if (currentView !== 'data') {
      setPreviousView(currentView);
    }
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
    return <DiscoverySlides onBack={handleBackToMain} onGoToData={handleGoToData} language={language} toggleLanguage={toggleLanguage} highlightId={highlightDataId} pendingScrollAction={pendingScrollAction} onClearHighlight={() => { setHighlightDataId(null); pendingScrollAction.current = null; }} />;
  }


  if (currentView === 'data') {
    return <DataExplanation onBack={handleBackFromData} highlightId={highlightDataId} />;
  }

  if (currentView === 'explore') {
    return <TileGridMap onBack={handleBackToMain} language={language} toggleLanguage={toggleLanguage} />;
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
          preload="auto"
        >
          <source src={`${import.meta.env.BASE_URL}video.mp4`} type="video/mp4" />
        </video>

        {/* 提示图标 */}
        <div className="absolute bottom-4 animate-pulse z-10 pointer-events-none flex flex-col items-center">
          <img 
            src={`${import.meta.env.BASE_URL}ICON/cursor_pink.png`} 
            alt="Scroll down" 
            className="w-8 h-auto object-contain opacity-80 drop-shadow-lg" 
          />
        </div>
      </section>

      {/* 第二部分：内容展示 */}
      <section className="min-h-screen w-full snap-start relative flex flex-col items-center justify-center py-32 px-6 bg-[#111111]">
        <div className="absolute inset-0 bg-[#111111]" />
        <PixelBackground />

        {/* 内容容器：严格控制在屏幕约 1/2 宽度，增加pb-32以还原原来的视觉高度平衡 */}
        <div className="w-full max-w-2xl z-10 flex flex-col items-center space-y-28 pb-32">

          {/* 我们的初衷 */}
          <div className="w-full space-y-12">
            <h2 className="text-[#22c55e] font-bold text-center text-xl tracking-[0.5em]">{t('home.our_intention')}</h2>
            <div className="text-zinc-300 text-[15px] leading-[2.05] space-y-6 font-light tracking-wide text-left">
              <p>
                {t('home.intro_1')}
              </p>
              <p>
                {t('home.intro_2')}
                <span
                  id="citation-1"
                  onClick={() => handleGoToData(1)}
                  className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
                >1</span>
              </p>
              <p>
                {t('home.intro_3')}
              </p>
              <p>
                {t('home.method_2')}
              </p>
            </div>
          </div>

          {/* 方法 */}
          <div className="w-full space-y-12">
            <h2 className="text-[#22c55e] font-bold text-center text-xl tracking-[0.5em]">{t('home.method_title')}</h2>
            <div className="text-zinc-300 text-[15px] leading-[2.2] text-left font-light tracking-wide">
              <p className="mb-8">
                {t('home.method_1')}
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

              <div className="w-[224px] h-[224px] flex items-center justify-center mb-6 transition-all duration-300">
                <img src={import.meta.env.BASE_URL + (language === 'CN' ? "ICON/buttom01_cn.png" : "ICON/buttom01_en.png")} alt="icon" className="w-full h-full object-contain group-hover:hidden transition-all duration-300" />
                <img src={import.meta.env.BASE_URL + (language === 'CN' ? "ICON/buttom01_cn_hover.png" : "ICON/buttom01_en_hover.png")} alt="icon hover" className="w-full h-full object-contain hidden group-hover:block transition-all duration-300" />
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

              <div className="w-[224px] h-[224px] flex items-center justify-center mb-6 transition-all duration-300">
                <img src={import.meta.env.BASE_URL + (language === 'CN' ? "ICON/buttom02_cn.png" : "ICON/buttom02_en.png")} alt="icon" className="w-full h-full object-contain group-hover:hidden transition-all duration-300" />
                <img src={import.meta.env.BASE_URL + (language === 'CN' ? "ICON/buttom02_cn_hover.png" : "ICON/buttom02_en_hover.png")} alt="icon hover" className="w-full h-full object-contain hidden group-hover:block transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* 底部导航栏 - 绝对定位贴底 */}
        <div className="absolute bottom-8 left-0 right-0 w-full px-6 md:px-12 flex justify-between items-end z-10">
          <div
            onClick={() => handleGoToData()}
            className="w-[83px] h-[25px] relative cursor-pointer group"
          >
            <img src={import.meta.env.BASE_URL + (language === 'CN' ? "ICON/data_zh.png" : "ICON/data_en.png")} alt="Data Explanation" className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
            <img src={import.meta.env.BASE_URL + (language === 'CN' ? "ICON/data_zh_hover.png" : "ICON/data_en_hover.png")} alt="Data Explanation Hover" className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
          </div>

          <div
            onClick={toggleLanguage}
            className="w-[146px] h-[25px] cursor-pointer"
          >
            <img
              src={language === 'CN' ? (import.meta.env.BASE_URL + "ICON/language_zh.png") : (import.meta.env.BASE_URL + "ICON/language_en.png")}
              alt="Language Switch"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>



    </div>
  );
};

export default App;
