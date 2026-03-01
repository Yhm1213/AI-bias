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

interface DiscoverySlidesProps {
  onBack: () => void;
}

const DiscoverySlides: React.FC<DiscoverySlidesProps> = ({ onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 模拟数据内容 (Page 2: Gender Bias)
  const GENDER_BIAS_DATA = [
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">温柔美丽</span>
        <span className="text-xs text-zinc-600">的她 &</span>
        <span className="font-bold text-green-800 mx-1">高大富有</span>
        <span className="text-xs text-zinc-600">的他</span>
      </>,
      content: (
        <>
          <p>
            从外貌、气质与文化符号看，女性形象往往围绕 <span className="font-bold text-pink-800">温柔</span> 等特性展开，而男性则与 <span className="font-bold text-green-900">勇敢、勤奋</span> 强相关。
          </p>
          <p>
            女性外貌常被精细描绘（<span className="bg-zinc-900/5 ring-1 ring-zinc-900/10 px-1 rounded">身材/眼睛/发质</span>），男性则常被简化为“高大強壯”。
          </p>
          <p>
            服饰意象上，女性被赋予“头巾/长袍”，男性则多关联“宗教/信仰”。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-blue-700 mx-1">家庭琐事</span>
        <span className="text-xs text-zinc-600">的她 &</span>
        <span className="font-bold text-orange-800 mx-1">社会征战</span>
        <span className="text-xs text-zinc-600">的他</span>
      </>,
      content: (
        <>
          <p className="font-bold text-sm mb-2 text-zinc-900">
            场景主要构建：
          </p>
          <p>
            女性角色高频出现于 <span className="text-blue-800 bg-blue-100/50 px-1 rounded">家庭内部、厨房、卧室</span>，行为多为“照顾”、“打扫”、“等待”。
          </p>
          <p>
            男性角色则更多活跃于 <span className="text-orange-800 bg-orange-100/50 px-1 rounded">战场、商场、会议室</span>，行为多为“决策”、“战斗”、“演讲”。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-purple-700 mx-1">情感支撑</span>
        <span className="text-xs text-zinc-600">的她 &</span>
        <span className="font-bold text-red-800 mx-1">逻辑理性</span>
        <span className="text-xs text-zinc-600">的他</span>
      </>,
      content: (
        <>
          <p className="font-bold text-sm mb-2 text-zinc-900">
            性格深层归因：
          </p>
          <p>
            遇到危机时，女性角色的反应常被描述为 <span className="text-purple-800 italic">“惊慌”、“哭泣”、“寻求帮助”</span>。
          </p>
          <p>
            而男性角色则倾向于被描述为 <span className="text-red-800 italic">“冷静”、“分析”、“挺身而出”</span>，似乎天生具备解决麻烦的能力。
          </p>
        </>
      )
    }
  ];

  // 第3页内容（作为Page 2的出口展示）
  const PAGE_3_EXIT_CONTENT = (
    <div className="w-full max-w-2xl px-6 text-center">
      <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.2em] mb-8 leading-relaxed">
        英文大模型部分更新了<br className="md:hidden" />性别剧本
      </h2>
      <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest">
        <p className="mb-4">
          再来看看英文语境下AI语言中的性别差异。<br />
          我们将chatgpt对于男性和女性的描述分词，经过清洗和筛选后获得756个英文词汇【3】。<br />
          我们观察这些词，最终发现了如下差异
          <span className="inline-flex items-center ml-2 translate-y-1.5 opacity-80">
            <img src="/ICON/binoculars_wh.png" alt="binoculars" className="w-10 h-auto object-contain" />
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
          src="/pic/kuangxian.png"
          alt="Chart Frame"
          className="w-full h-auto object-contain object-left-bottom"
        />
        {/* 中文数据层 - Falling Blocks Animation */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          <FallingBlocksChart
            src="/pic/CN.png"
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
            src="/pic/EN.png"
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
            src="/pic/biaozhu.png"
            alt="Legend"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>

      {/* 右侧：文字说明 - Scrollable with hidden scrollbar */}
      <div className="w-full md:w-1/2 max-w-md text-left h-[400px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          为了更好地对比DeepSeek和ChatGPT在男女描述上的差异，我们提出 <span className="font-bold text-zinc-900">词语性别差异指数【4】</span>：通过计算同一词语在两种续写（"女人是……"和"男人是……"）中词频排序的百分比差值，来量化单一语言模型中的性别偏见程度。
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          一个理想中的没有差异的词语，在两性描述下被提到的可能性应该相同，即差异指数为0。
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          比如："家庭"一词在中文男性数据中被提到1384次，其词频排序百分比为0.997，在中文女性数据中被提到1667次，其词频排序百分比为1，"家庭"的词语性别差异指数为0.003，约等于0，意味着此词在不同性别背景下被同等地被提到，呈现出"无差别化"现象。
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          相反地，"照顾"一词在女性中文包之中被提及927次，女性词频排序显著高于男性。这种差异并非孤例。我们在数据中发现了大量类似的模式，例如"温柔"、"美丽"等词汇高度集中于女性描述，而"强壮"、"领袖"等词汇则更多出现在男性描述中。
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          通过词语性别差异指数，我们可以清晰地看到这些刻板印象如何在模型生成的文本中被量化。这个指数不仅揭示了单个词汇的偏见，也为我们提供了一个宏观的视角，去审视大语言模型在训练过程中所习得的社会偏见。
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          当我们把成百上千个词汇的差异指数汇聚成图表时（如左图所示），这种结构性的不平衡便一目了然。每一个数据点都代表了一个词语在性别叙事中的位置，它们共同构建了一个由数据定义的性别图景。我们也可以看到，在某些中性词汇上，模型表现出了较好的公平性，但在涉及职业、性格和家庭角色的词汇上，偏见依然根深蒂固。
        </p>
        <p className="text-zinc-700 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          这些发现提醒我们，在享受人工智能带来的便利的同时，必须警惕其中隐藏的偏见。只有通过不断的监测和修正，我们才能推动AI向着更加公平、包容的方向发展。
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

      {/* 第一屏：首屏内容 */}
      <section className="h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center p-6 text-center z-20 bg-transparent">
        {/* 注意：bg-transparent 让它透出下面的 PixelBackground */}
        <div className="w-full max-w-2xl z-10 flex flex-col items-center">
          <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.3em] mb-12 leading-relaxed">
            中文大模型被「男强女柔」框住了想象力
          </h2>
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-4 text-justify">
              首先，我们对比中文大模型DeepSeek对男人和女人的描述差异，我们将DeepSeek对于男性和女性的描述分词，经过清洗后获得584个词语【2】。我们分析发现了如下差异
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src="/ICON/binoculars_wh.png" alt="binoculars" className="w-12 h-auto object-contain" />
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
        slides={GENDER_BIAS_DATA} // 复用数据，以后改
        mode="inverse"
        exitContent={PAGE_4_EXIT_CONTENT_LIGHT}
        renderVisualZone={(subPage, isVisible) => (
          <div className="w-full h-full relative flex items-center justify-center">
            <p className="text-black/30 font-mono tracking-widest border border-black/10 px-6 py-3 rounded-full">
              FUTURE DATA ZONE
            </p>
          </div>
        )}
      />

      {/* 第六屏：首页复刻 (Page 6) */}
      <section className="h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center p-6 text-center z-20 bg-transparent">
        {/* 注意：bg-transparent 让它透出下面的 PixelBackground */}
        <div className="w-full max-w-2xl z-10 flex flex-col items-center">
          <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.3em] mb-12 leading-relaxed">
            中文大模型被「男强女柔」框住了想象力
          </h2>
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-4 text-justify">
              首先，我们对比中文大模型DeepSeek对男人和女人的描述差异，我们将DeepSeek对于男性和女性的描述分词，经过清洗后获得584个词语【2】。我们分析发现了如下差异
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src="/ICON/binoculars_wh.png" alt="binoculars" className="w-12 h-auto object-contain" />
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
        <GdpGenderDiscourseSlide />
      </section>

      {/* 第九屏：WBL Gender Discourse Visualization */}
      <section className="h-screen w-full snap-start snap-always relative z-20">
        <WblGenderDiscourseSlide />
      </section>

    </div>
  );
};

export default DiscoverySlides;
