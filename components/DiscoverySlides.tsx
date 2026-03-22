import React, { useRef } from 'react';
import PixelBackground from './PixelBackground';
import ScrollTelescopeSection from './ScrollTelescopeSection';
import { GdpVisualization } from './GdpVisualization';
import { GdpGenderDiscourseSlide } from './GdpGenderDiscourseSlide';
import { WblGenderDiscourseSlide } from './WblGenderDiscourseSlide';
import FallingBlocksChart from './FallingBlocksChart';
import NetworkScrolly from './NetworkScrolly';

// Data for Scrollytelling
import cnNetworkData from '../data/cn_network.json';
import enNetworkData from '../data/en_network.json';

import { useTranslation } from '../contexts/LanguageContext';

interface DiscoverySlidesProps {
  onBack: () => void;
  language: 'CN' | 'EN';
  toggleLanguage: () => void;
}

const DiscoverySlides: React.FC<DiscoverySlidesProps> = ({ onBack, language, toggleLanguage }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const GENDER_BIAS_DATA = [
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">{t('discovery.bias_cn.0.title_female_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_cn.0.title_female_2')}</span>
        <span className="font-bold text-green-800 mx-1">{t('discovery.bias_cn.0.title_male_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_cn.0.title_male_2')}</span>
      </>,
      content: (
        <>
          <p>
            {t('discovery.bias_cn.0.p1_1')}<span className="font-bold text-pink-800">{t('discovery.bias_cn.0.p1_2')}</span>{t('discovery.bias_cn.0.p1_3')}<span className="font-bold text-green-900">{t('discovery.bias_cn.0.p1_4')}</span>{t('discovery.bias_cn.0.p1_5')}
          </p>
          <p>
            {t('discovery.bias_cn.0.p2_1')}<span className="bg-zinc-900/5 ring-1 ring-zinc-900/10 px-1 rounded">{t('discovery.bias_cn.0.p2_2')}</span>{t('discovery.bias_cn.0.p2_3')}
          </p>
          <p>
            {t('discovery.bias_cn.0.p3')}
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-blue-700 mx-1">{t('discovery.bias_cn.1.title_female_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_cn.1.title_female_2')}</span>
        <span className="font-bold text-orange-800 mx-1">{t('discovery.bias_cn.1.title_male_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_cn.1.title_male_2')}</span>
      </>,
      content: (
        <>
          <p className="font-bold text-sm mb-2 text-zinc-900">
            {t('discovery.bias_cn.1.p1')}
          </p>
          <p>
            {t('discovery.bias_cn.1.p2_1')}<span className="text-blue-800 bg-blue-100/50 px-1 rounded">{t('discovery.bias_cn.1.p2_2')}</span>{t('discovery.bias_cn.1.p2_3')}
          </p>
          <p>
            {t('discovery.bias_cn.1.p3_1')}<span className="text-orange-800 bg-orange-100/50 px-1 rounded">{t('discovery.bias_cn.1.p3_2')}</span>{t('discovery.bias_cn.1.p3_3')}
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-purple-700 mx-1">{t('discovery.bias_cn.2.title_female_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_cn.2.title_female_2')}</span>
        <span className="font-bold text-red-800 mx-1">{t('discovery.bias_cn.2.title_male_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_cn.2.title_male_2')}</span>
      </>,
      content: (
        <>
          <p className="font-bold text-sm mb-2 text-zinc-900">
            {t('discovery.bias_cn.2.p1')}
          </p>
          <p>
            {t('discovery.bias_cn.2.p2_1')}<span className="text-purple-800 italic">{t('discovery.bias_cn.2.p2_2')}</span>{t('discovery.bias_cn.2.p2_3')}
          </p>
          <p>
            {t('discovery.bias_cn.2.p3_1')}<span className="text-red-800 italic">{t('discovery.bias_cn.2.p3_2')}</span>{t('discovery.bias_cn.2.p3_3')}
          </p>
        </>
      )
    }
  ];

  const EN_GENDER_BIAS_DATA = [
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">{t('discovery.bias_en.0.title_female_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_en.0.title_female_2')}</span>
      </>,
      content: (
        <>
          <p>
            {t('discovery.bias_en.0.p1_1')}<span className="font-bold text-pink-800">{t('discovery.bias_en.0.p1_2')}</span>{t('discovery.bias_en.0.p1_3')}
          </p>
          <p>
            {t('discovery.bias_en.0.p2')}
          </p>
          <p className="text-zinc-500 italic mt-2 text-[10px]">{t('discovery.bias_en.0.placeholder')}</p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-blue-700 mx-1">{t('discovery.bias_en.1.title_female_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_en.1.title_female_2')}</span>
      </>,
      content: (
        <>
          <p>
            {t('discovery.bias_en.1.p1_1')}<span className="font-bold text-blue-800">{t('discovery.bias_en.1.p1_2')}</span>{t('discovery.bias_en.1.p1_3')}
          </p>
          <p>
            {t('discovery.bias_en.1.p2')}
          </p>
          <p className="text-zinc-500 italic mt-2 text-[10px]">{t('discovery.bias_en.1.placeholder')}</p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-purple-700 mx-1">{t('discovery.bias_en.2.title_female_1')}</span>
        <span className="text-xs text-zinc-600">{t('discovery.bias_en.2.title_female_2')}</span>
      </>,
      content: (
        <>
          <p>
            {t('discovery.bias_en.2.p1_1')}<span className="font-bold text-purple-800">{t('discovery.bias_en.2.p1_2')}</span>{t('discovery.bias_en.2.p1_3')}
          </p>
          <p>
            {t('discovery.bias_en.2.p2')}
          </p>
          <p className="text-zinc-500 italic mt-2 text-[10px]">{t('discovery.bias_en.2.placeholder')}</p>
        </>
      )
    }
  ];

  // 第3页内容（作为Page 2的出口展示）
  const PAGE_3_EXIT_CONTENT = (
    <div className="w-full max-w-2xl px-6 text-center">
      <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.2em] mb-8 leading-relaxed">
        {t('discovery.page3_exit.title_1')}<br className="md:hidden" />{t('discovery.page3_exit.title_2')}
      </h2>
      <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest">
        <p className="mb-4">
          {t('discovery.page3_exit.p1_1')}<br />
          {t('discovery.page3_exit.p1_2')}<br />
          {t('discovery.page3_exit.p1_3')}
          <span className="inline-flex items-center ml-2 translate-y-1.5 opacity-80">
            <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-10 h-auto object-contain" />
          </span>
        </p>
      </div>
      <div className="mt-20 opacity-10 flex justify-center">
        <div className="w-[1px] h-12 bg-white"></div>
      </div>
    </div>
  );

  // 第4页的出口内容 (Dark Text for Light Background - 词语性别差异指数可视化)
  const PAGE_4_EXIT_CONTENT_LIGHT = (
    <div className="w-full max-w-6xl px-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
      {/* 左侧：叠加图表 */}
      <div className="relative w-full md:w-1/2 max-w-[500px]">
        {/* 框线层 (最底层) */}
        <img
          src={import.meta.env.BASE_URL + "pic/kuangxian.png"}
          alt="Chart Frame"
          className="w-full h-auto object-contain object-left-bottom"
        />
        {/* 中文数据层 - Falling Blocks Animation */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          <FallingBlocksChart
            src={import.meta.env.BASE_URL + "pic/CN.png"}
            alt="Chinese Data"
            className="w-full h-full object-left-bottom" // alignment is handled by wrapper mostly, but pass visual styles
            rows={12}
            cols={12}
            delay={0}
          />
        </div>

        {/* 英文数据层 - Falling Blocks Animation */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          <FallingBlocksChart
            src={import.meta.env.BASE_URL + "pic/EN.png"}
            alt="English Data"
            className="w-full h-full object-left-bottom"
            rows={12}
            cols={12}
            delay={500} // Start slightly later
          />
        </div>
        {/* 表注 - Adjusted to left side of chart */}
        <div className="absolute top-1/2 -left-12 -translate-y-1/2">
          <img
            src={import.meta.env.BASE_URL + "pic/biaozhu.png"}
            alt="Legend"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>

      {/* 右侧：文字说明 - Scrollable with hidden scrollbar */}
      <div className="w-full md:w-1/2 max-w-md text-left h-[400px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p1_1')}<span className="font-bold text-zinc-900">{t('discovery.page4_exit.p1_2')}</span>{t('discovery.page4_exit.p1_3')}
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p2')}
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p3')}
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p4')}
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p5')}
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p6')}
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p7')}
        </p>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory bg-[#121212] selection:bg-[#ff4d94]/30 relative scroll-smooth"
    >
      {/* 这里的 PixelBackground 会被 Page 2/4 的黑色遮罩覆盖，并在 Exit 时透出 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PixelBackground />
      </div>

      {/* 返回首页按钮 - 固定在左上角 */}
      <div className="fixed top-4 left-4 z-50 pointer-events-auto">
        <button
          onClick={onBack}
          className="hover:scale-105 transition-transform duration-300 flex items-center justify-center p-1"
        >
          <img 
            src={import.meta.env.BASE_URL + "ICON/HOME.png"} 
            alt={t('discovery.back')} 
            className="h-10 w-auto object-contain drop-shadow-md" 
          />
        </button>
      </div>

      {/* 语言切换按钮 - 固定在右下角 */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 pointer-events-auto">
        <div
          onClick={toggleLanguage}
          className="h-10 cursor-pointer drop-shadow-md"
        >
          <img
            src={language === 'CN' ? (import.meta.env.BASE_URL + "ICON/language_zh.png") : (import.meta.env.BASE_URL + "ICON/language_en.png")}
            alt="Language Switch"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* 第一屏：首屏内容 */}
      <section className="h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center p-6 text-center z-20 bg-transparent">
        {/* 注意：bg-transparent 让它透出下面的 PixelBackground */}
        <div className="w-full max-w-2xl z-10 flex flex-col items-center">
          <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.3em] mb-12 leading-relaxed">
            {t('discovery.slide1.title')}
          </h2>
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-4 text-justify">
              {t('discovery.slide1.p1')}
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-12 h-auto object-contain" />
              </span>
            </p>
          </div>
          <div className="mt-20 opacity-10">
            <div className="w-[1px] h-12 bg-white"></div>
          </div>
        </div>
      </section>

      {/* 第二屏：望远镜视角 (Gender Bias) -> Page 3 (Deep Dive Intro) */}
      <ScrollTelescopeSection
        id="gender-bias"
        slides={GENDER_BIAS_DATA}
        exitContent={PAGE_3_EXIT_CONTENT}
        renderVisualZone={(subPage, isVisible) => (
          <div className="w-full h-[80%] my-auto relative">
            <NetworkScrolly data={cnNetworkData} activePage={subPage} isVisible={isVisible} />
          </div>
        )}
      />

      <ScrollTelescopeSection
        id="page-4-duplicate"
        slides={EN_GENDER_BIAS_DATA}
        mode="inverse"
        exitContent={PAGE_4_EXIT_CONTENT_LIGHT}
        renderVisualZone={(subPage, isVisible) => (
          <div className="w-full h-[80%] my-auto relative">
            <NetworkScrolly data={enNetworkData as any} activePage={subPage} isVisible={isVisible} />
          </div>
        )}
      />

      {/* 第六屏：过渡屏 (Page 6) */}
      <section className="h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center p-6 text-center z-20 bg-transparent">
        <div className="w-full max-w-2xl z-10 flex flex-col items-center">
          <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.3em] mb-12 leading-relaxed">
            {t('discovery.slide6.title')}
          </h2>
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-4 text-justify">
              {t('discovery.slide6.p1')}
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-12 h-auto object-contain" />
              </span>
            </p>
          </div>
          <div className="mt-20 opacity-10">
            <div className="w-[1px] h-12 bg-white"></div>
          </div>
        </div>
      </section>



      {/* 第八屏：GDP Gender Discourse Visualization */}
      <section className="h-screen w-full snap-start snap-always relative z-20">
        <GdpGenderDiscourseSlide language={language} toggleLanguage={toggleLanguage} />
      </section>

      {/* 补充过渡屏：放在两个数据洞察页面之间 */}
      <section className="h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center p-6 text-center z-20 bg-transparent">
        <div className="w-full max-w-2xl z-10 flex flex-col items-center">
          <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.3em] mb-12 leading-relaxed">
            {t('discovery.slide_interstitial.title')}
          </h2>
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-4 text-justify">
              {t('discovery.slide_interstitial.p1')}
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-12 h-auto object-contain" />
              </span>
            </p>
          </div>
          <div className="mt-20 opacity-10">
            <div className="w-[1px] h-12 bg-white"></div>
          </div>
        </div>
      </section>

      {/* 第九屏：WBL Gender Discourse Visualization */}
      <section className="h-screen w-full snap-start snap-always relative z-20">
        <WblGenderDiscourseSlide language={language} toggleLanguage={toggleLanguage} />
      </section>

    </div>
  );
};

export default DiscoverySlides;
