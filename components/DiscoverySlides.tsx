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
  onGoToData: (id?: number) => void;
  language: 'CN' | 'EN';
  toggleLanguage: () => void;
  highlightId?: number | null;
  pendingScrollAction?: React.MutableRefObject<'highlight' | 'default' | null>;
  onClearHighlight?: () => void;
}

const DiscoverySlides: React.FC<DiscoverySlidesProps> = ({ onBack, onGoToData, language, toggleLanguage, highlightId, pendingScrollAction, onClearHighlight }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (pendingScrollAction?.current === 'highlight') {
      let targetElementId = `citation-${highlightId}`;
      let scrollBlock: ScrollLogicalPosition = 'center';

      if (highlightId === 3) {
        targetElementId = 'gender-bias-exit-snap';
        scrollBlock = 'start'; // block start maps it exactly to top matching the vh logic
      } else if (highlightId === 4) {
        targetElementId = 'page-4-duplicate-exit-snap';
        scrollBlock = 'start'; // block start maps it exactly to top matching the vh logic
      }

      const element = document.getElementById(targetElementId);
      if (element && containerRef.current) {
        
        // temporarily disable smooth scrolling if present, so we "jump" instantly without triggering intermediate animations
        const hasSmooth = containerRef.current.classList.contains('scroll-smooth');
        if (hasSmooth) {
          containerRef.current.classList.remove('scroll-smooth');
        }

        const origSnap = containerRef.current.style.scrollSnapType;
        containerRef.current.style.scrollSnapType = 'none';
        
        // Type case to bypass TS complaining about 'instant' (which is the modern standard for jumping)
        // while falling back to 'auto' with scroll-smooth disabled.
        element.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: scrollBlock });
        if (hasSmooth) {
          element.scrollIntoView({ behavior: 'auto', block: scrollBlock }); // Fallback for older browsers
        }

        containerRef.current.style.scrollSnapType = origSnap;
        
        if (hasSmooth) {
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.classList.add('scroll-smooth');
            }
          }, 50);
        }
      }
      if (onClearHighlight) onClearHighlight();
    } else if (pendingScrollAction?.current === 'default') {
      if (onClearHighlight) onClearHighlight();
    }
  }, [highlightId, pendingScrollAction, onClearHighlight]);

  const GENDER_BIAS_DATA = [
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">“温柔”与“装饰”</span>
        <span className="text-xs text-zinc-600">的她，对比</span>
        <span className="font-bold text-green-800 mx-1">“高大”与“力量”</span>
        <span className="text-xs text-zinc-600">的他</span>
      </>,
      content: (
        <>
          <p>
            从<strong>外貌、气质与文化符号</strong>的表征来看，DeepSeek 展现出的性别画像极其保守。
          </p>
          <p>
            在气质词频上，女性被牢牢锁定在
            <span className="font-bold text-pink-800">“温柔（33次）”“优雅（47次）”</span>
            等柔性特质中；而男性则由
            <span className="font-bold text-green-900">“坚韧（185次）”“勇敢（87次）”“强（137次）”</span>
            定义。这种对比在身体刻画上近乎极端：女性的描写往往指向视觉细节与服饰，如
            <span className="font-bold text-pink-800">“头巾（87次）”“长袍（81次）”“时尚（63次）”</span>
            ；而男性则被简化为纯粹的生理力量，如
            <span className="font-bold text-green-900">“高大（26次）”</span>
            与
            <span className="font-bold text-green-900">“强壮（67次）”</span>
            。
          </p>
          <p>
            这种叙事路径泾渭分明：女性被<strong>“客体化”</strong>为一种视觉存在，而男性则被<strong>“功能化”</strong>为一种力量符号。正如英美文化中的“Boys don't cry”，这种刻板印象在中文模型中依然稳固，甚至对近年来涌现的“中性化”或“角色倒置”新认知反应迟钝，模型似乎仍在一个“发胶与肌肉”、“丝绸与温柔”的传统世界里徘徊。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">“照顾”家庭</span>
        <span className="text-xs text-zinc-600">的她，对比</span>
        <span className="font-bold text-green-800 mx-1">“热爱”世界</span>
        <span className="text-xs text-zinc-600">的他</span>
      </>,
      content: (
        <>
          <p>
            如果说第一层是形象的塑造，那么<strong>行为与职责指向</strong>的数据则揭示了深层的不平等。
          </p>
          <p>
            在统计中，“家庭”是双方共同的高频词，但语境完全不同。女性的关键词是<strong className="text-pink-800">“照顾（56次）”、“核心（44次）”、“和谐（62次）”</strong>。她们是家庭的润滑剂，负责具体的、重复的、维系性的事务。
          </p>
          <p>
            相比之下，男性的行为动词充满了<strong className="text-green-900">外部探索性</strong>：他们<span className="font-bold text-green-900">“热爱（147次）”、“喜欢（297次）”</span>的对象是<span className="font-bold text-green-900">“足球（100次）”、“体育（48次）”</span>或<span className="font-bold text-green-900">“户外活动（118次）”</span>。
          </p>
          <p>
            同样是谈论“责任”，女性的<span className="font-bold text-pink-800">“责任感（85次）”</span>往往与家务琐事捆绑，是具体的<strong>无偿劳动</strong>；而男性的<span className="font-bold text-green-900">“责任感（218次）”</span>频次是女性的 2.5 倍，通常指向一种宏大的抽象品质。这意味着在模型的逻辑里，男性的责任是一种“社会光环”，而女性的责任则是一种“生存定式”。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">“遵守”规范</span>
        <span className="text-xs text-zinc-600">的她，对比</span>
        <span className="font-bold text-green-800 mx-1">“开拓”疆域</span>
        <span className="text-xs text-zinc-600">的他</span>
      </>,
      content: (
        <>
          <p>
            当我们将目光从生活琐事转向<strong>社会参与</strong>，数据呈现出一种“规训”与“扩张”的对立。
          </p>
          <p>
            在女性的文本中，高频词包括
            <span className="font-bold text-pink-800">“遵守”</span>、
            <span className="font-bold text-pink-800">“扮演着（307次）”</span>、
            <span className="font-bold text-pink-800">“传统（785次）”</span>
            ，强调她们在既定社会框架内的<strong>适应与服从</strong>。而男性的高频词则更多涉及
            <span className="font-bold text-green-900">“职业（25次）”</span>、
            <span className="font-bold text-green-900">“商业（30次）”</span>
            以及
            <span className="font-bold text-green-900">“社会（109次）”</span>
            地位。
          </p>
          <p>
            即便在同样追求
            <span className="font-bold text-pink-800">“平等（48次 vs 43次）”</span>
            的语境下，女性更多是在争取
            <span className="font-bold text-pink-800">“教育（306次）”</span>
            和
            <span className="font-bold text-pink-800">“独立（269次）”</span>
            的权利，而男性则早已在
            <span className="font-bold text-green-900">“经济（41次）”</span>
            与
            <span className="font-bold text-green-900">“文化传承（225次）”</span>
            中占据主导。这种差异印证了社会学家西尔维娅·沃尔比的观点：现代叙事依然倾向于将女性置于“规范的追随者”地位，而将公共资源的控制权与变革的“创新者”角色留给男性。
          </p>
        </>
      )
    }
  ];

  const EN_GENDER_BIAS_DATA = [
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">“优雅（Grace）”</span>
        <span className="text-xs text-zinc-600">的内在化，对比</span>
        <span className="font-bold text-green-800 mx-1">“影响力（Influence）”</span>
        <span className="text-xs text-zinc-600">的扩张</span>
      </>,
      content: (
        <>
          <p>
            在形象描述上，英文模型完成了一次从“外在修饰”向“内在特质”的转移，但性别边界依然清晰。
          </p>
          <p>
            女性的形象在 ChatGPT 笔下显得更为立体，关键词从简单的外貌转向了
            <span className="font-bold text-pink-800">“优雅（Grace，478次）”</span>
            与
            <span className="font-bold text-pink-800">“韧性（Resilience，1309次）”</span>
            。相比中文模型对“身材”的关注，英文模型更强调女性的
            <span className="font-bold text-pink-800">“风度（Poise）”</span>
            与
            <span className="font-bold text-pink-800">“自信（Confidence）”</span>
            。
          </p>
          <p>
            然而，男性的关键词则直接指向社会权力。
            <span className="font-bold text-green-900">“影响力（Influence，1089次）”</span>、
            <span className="font-bold text-green-900">“个体（Individual，847次）”</span>
            以及
            <span className="font-bold text-green-900">“智力特质（Intellectual）”</span>
            构成了男性的核心。虽然英文模型赋予了男性“现代感”，但这种“现代感”本质上仍是<strong>“理性与掌控力”</strong>的代名词。总体看下来，中文模型是在描述长相，而英文模型是在描述人格。但这种人格分配依然遵循：女性负责美与情感，男性负责逻辑与世界。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">“关怀（Care）”</span>
        <span className="text-xs text-zinc-600">的多重重担，对比</span>
        <span className="font-bold text-green-800 mx-1">“探索（Explore）”</span>
        <span className="text-xs text-zinc-600">的无界参与</span>
      </>,
      content: (
        <>
          <p>
            在行为逻辑中，英文模型展现了一个非常显著的“空间差”：女性被留在社区，男性走向世界。
          </p>
          <p>
            数据显示，女性与
            <span className="font-bold text-pink-800">“社区（Community，1474次）”</span>、
            <span className="font-bold text-pink-800">“平衡（Balance，676次）”</span>、
            <span className="font-bold text-pink-800">“教育（Education，837次）”</span>
            高度关联。高频词如“Juggle”和“Manage”揭示了现代女性的困境：她们不仅要作为“Caregiver（照顾者）”，还要在“Professional（职业的）”领域证明自己。
          </p>
          <p>
            反观男性，他们的行为充满了<strong>公共性与流动性</strong>。关键词如
            <span className="font-bold text-green-900">“探索（Explore）”</span>、
            <span className="font-bold text-green-900">“外交（Diplomacy）”</span>、
            <span className="font-bold text-green-900">“科技（Technology）”</span>
            将男性定位为全球公民。不同于中文模型中“捕鱼/运动”这种具体体力活动，英文模型中的男性行为更具“脑力资本”色彩。但不变的是，女性依然是“家庭与关系的维系者（Homemaker）”，她们的勤奋往往带有<strong>牺牲与奉献</strong>的色彩，而男性的勤奋则指向<strong>职业成就</strong>。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">“抗争（Advocacy）”</span>
        <span className="text-xs text-zinc-600">的补偿，对比</span>
        <span className="font-bold text-green-800 mx-1">“策略（Strategy）”</span>
        <span className="text-xs text-zinc-600">的主导</span>
      </>,
      content: (
        <>
          <p>
            在社会角色的期待上，英文模型引入了大量关于<strong>性别正义</strong>的现代词汇，这与中文模型形成了鲜明对比。
          </p>
          <p>
            在女性的词簇中，出现了大量
            <span className="font-bold text-pink-800">“平等（Equality，495次）”</span>、
            <span className="font-bold text-pink-800">“赋权（Empowerment，321次）”</span>
            和
            <span className="font-bold text-pink-800">“倡议（Advocate，319次）”</span>
            。这反映出英文语境下，女性的身份往往与<strong>“挑战障碍（Challenge / Barrier）”</strong>捆绑在一起。换句话说，模型认为女性的“力量”体现在对现状的“突破”上。
          </p>
          <p>
            而男性的关键词则显得“顺风顺水”：
            <span className="font-bold text-green-900">“策略（Strategic）”</span>、
            <span className="font-bold text-green-900">“地缘政治（Geopolitical）”</span>、
            <span className="font-bold text-green-900">“视野（Perspective，160次）”</span>
            。男性被预设为规则的制定者和体系的操盘手。这揭示了一个残酷的真相，在英文模型的逻辑里，女性的“进步”是需要<strong>“Strive（奋斗/争取）”</strong>的补偿性叙事，而男性的“成功”则是<strong>“Nature（天生/自然）”</strong>的战略延展。模型虽然学会了“政治正确”的词汇，但在潜意识里，它依然认为世界是由男性的战略构建的，而女性则负责在其中呼吁公平。
          </p>
        </>
      )
    }
  ];

  // 第3页内容（作为Page 2的出口展示）
  const PAGE_3_EXIT_CONTENT = (
    <div className="w-full max-w-3xl px-6 text-center">
      <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest text-left">
        <p className="mb-4">
          再来看看英文语境下AI语言中的性别差异。<br />
          我们将chatgpt对于男性和女性的描述分词，经过清洗和筛选后获得756个英文词汇<span
            id="citation-3"
            onClick={() => onGoToData(3)}
            className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
          >3</span>。我们观察这些词，最终发现了如下差异：
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
          {t('discovery.page4_exit.p1_1')}<span className="font-bold text-zinc-900">{t('discovery.page4_exit.p1_2')}</span><span
            id="citation-4"
            onClick={() => onGoToData(4)}
            className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
          >4</span>{t('discovery.page4_exit.p1_3')}
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

      {/* 返回首页按钮 - 固定在左下角 */}
      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 pointer-events-auto">
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
          className="w-[146px] h-[25px] cursor-pointer drop-shadow-md"
        >
          <img
            src={language === 'CN' ? (import.meta.env.BASE_URL + "ICON/language_zh.png") : (import.meta.env.BASE_URL + "ICON/language_en.png")}
            alt="Language Switch"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 第一屏：首屏内容 */}
      <section className="h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center p-6 text-center z-20 bg-transparent">
        {/* 注意：bg-transparent 让它透出下面的 PixelBackground */}
        <div className="w-full max-w-2xl z-10 flex flex-col items-center">
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-4 text-left">
              {t('discovery.slide1.p1_before')}
              <span
                id="citation-2"
                onClick={() => onGoToData(2)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >
                2
              </span>
              {t('discovery.slide1.p1_after')}
              <span className="inline-flex items-center ml-2 translate-y-1.5 opacity-80">
                <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-10 h-auto object-contain" />
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
            <p className="mb-6 text-left">
              如果说模型中的性别词汇揭示了文化与语言的差异，那么当这些语言落在不同经济体中，又会如何与全球的经济结构产生共鸣与冲突？
            </p>
            <p className="mb-4 text-left">
              为更深入地展开讨论，我们引入了人均GDP（GDP per capita）以交叉分析，这是被广泛用于衡量一国居民平均生活水平提高或恶化的指标
              <span
                id="citation-5"
                onClick={() => onGoToData(5)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >5</span>
              。我们将2023年各国的人均GDP从低到高排序，把前述196个国家和地区等分为5组（低、低中、中、中高、高）
              <span
                id="citation-6"
                onClick={() => onGoToData(6)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >6</span>
              ，依照此分组和大模型的描述文本展开交叉分析，探究在不同经济水平下，大语言模型对男性和女性劳动角色与生活方式等多方面的差异化描述。
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
            <p className="mb-6 text-left">
              除了利用GDP进行交叉分析之外，我们也从另一个指标——性别平等指数出发，探究大模型在描述不同性别平等指数的地区的男女时，是否存在一定的描述差异。
            </p>
            <p className="mb-6 text-left">
              我们从世界银行官网获取Women, Business and the Law 2.0 Data
              <span
                id="citation-7"
                onClick={() => onGoToData(7)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >7</span>
              （以下简称WBL）作为国家法律性别平等（Legal gender parities）的度量，其值越大说明该国家不同性别更加平等。我们通过WBL数据的从低到高，将所有国家等分为5个组别
              <span
                id="citation-8"
                onClick={() => onGoToData(8)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >8</span>
              。
            </p>
            <p className="mb-4 text-left">
              在分析中我们发现，随着WBL指数的提高，语言模型对女性的描述呈现趋势性变化：从传统束缚转向更自主的多元表达。
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

      {/* 结尾页 */}
      <section className="min-h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center px-6 py-20 z-20 bg-transparent">
        <div className="w-full max-w-2xl space-y-6 text-zinc-300 text-left text-[15px] leading-[2.05] font-light tracking-wide">
          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            AI时代，思考问题时，会不自觉地想知道：AI会如何回答？我们已经在被AI“想象”的答案中塑造自己的答案了。
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            但这不是一个全然悲观的问题。人从来都是在和社会、语言、文化互动中“建构”出来的，正如波伏娃的思想核心——“成为女人，不是出生如此，而是逐渐形成。”大模型只不过是新的“语言环境”，我们在它的语境中也许能创造“新的自我形象”。更关键的是，我们应该思考，如何有能力在技术中重新谈“自我”。
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            从上述分析来看：大模型所读取的世界，是一个北半球中心、男性中心的语料堆叠。它继承的是维多利亚式百科、英美新闻体系、男性主导的互联网络。当我们说AI“看到”了什么，其实是在问：谁拥有被记录的权力？谁在历史里说过话？谁的故事从未被写入数据？
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            我们借分析AI，分析真实世界，也是在借这种分析，表达我身为女性未曾被更多地看见、未曾更多地表达、未曾更多地展现价值的愤怒。这种愤怒，让这篇文章摆在你面前。我们应该承认，在最初请AI续写“男人/女人是”时，我们自带偏见，我希望分析结果能证明AI有偏见的，我希望这篇文章是有影响力的，让更多人能看得见，能让更多人发现：我也应该记录、书写、表达，并借此不断扩大定义的权利。如此，一个更客观、公平的未来也将拥有可能。
          </div>
        </div>
      </section>

    </div>
  );
};

export default DiscoverySlides;
