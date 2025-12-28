
import React, { useEffect, useState, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import PixelBackground from './PixelBackground';

interface DiscoverySlidesProps {
  onBack: () => void;
}

const DATA_VIS = [
  { subject: '社会地位', A: 20, B: 95, fullMark: 100 },
  { subject: '职业成就', A: 15, B: 90, fullMark: 100 },
  { subject: '外貌描写', A: 98, B: 25, fullMark: 100 },
  { subject: '情感价值', A: 85, B: 30, fullMark: 100 },
  { subject: '审美客体', A: 92, B: 15, fullMark: 100 },
  { subject: '领袖气质', A: 10, B: 88, fullMark: 100 },
];

const DiscoverySlides: React.FC<DiscoverySlidesProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const slide2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (slide2Ref.current) {
      observer.observe(slide2Ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-[#121212] selection:bg-[#ff4d94]/30 relative">
      
      {/* 第一屏：首屏内容 */}
      <section className="h-screen w-full snap-start relative flex flex-col items-center justify-center p-6 text-center">
        <PixelBackground />
        <div className="w-full max-w-2xl z-10 flex flex-col items-center">
          <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.3em] mb-12 leading-relaxed">
            中文大模型被「男强女柔」框住了想象力
          </h2>
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-4 text-justify">
              首先，我们对比中文大模型DeepSeek对男人和女人的描述差异，我们将DeepSeek对于男性和女性的描述分词，经过清洗后获得584个词语【2】。我们分析发现了如下差异
              <span className="inline-flex items-center ml-4 translate-y-2">
                <svg width="48" height="24" viewBox="0 0 60 30" fill="none">
                  <circle cx="15" cy="15" r="12" stroke="white" strokeWidth="1.5" />
                  <circle cx="45" cy="15" r="12" stroke="white" strokeWidth="1.5" />
                </svg>
              </span>
            </p>
          </div>
          <div className="mt-20 opacity-10">
            <div className="w-[1px] h-12 bg-white"></div>
          </div>
        </div>
      </section>

      {/* 第二屏：左文右图 - 圆形维恩图 */}
      <section 
        ref={slide2Ref}
        className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden bg-[#121212]"
      >
        <PixelBackground />
        
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* 左侧圆形：文字区 */}
          <div 
            className={`
              absolute left-1/2 w-[80vh] h-[80vh] rounded-full bg-gray-200 text-black flex items-center justify-end
              transition-all duration-[1500ms] cubic-bezier(0.23, 1, 0.32, 1) z-10
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `}
            style={{ 
                transformOrigin: 'right center',
                marginLeft: '-60vh'
            }}
          >
            {/* 内容区 */}
            <div className="w-[50%] pr-[8%] space-y-10">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold tracking-[0.2em] flex items-center">
                  <span className="w-8 h-[2px] bg-pink-400 mr-3"></span>
                  女性形象：被凝视的客体
                </h3>
                <div className="space-y-2 text-xs md:text-[14px] leading-[1.8] text-zinc-700 font-light tracking-wide text-justify">
                  <p>
                    描述高度集中于 <span className="bg-pink-100 px-1 font-medium">审美属性</span> 与 <span className="bg-pink-100 px-1 font-medium">情感依附</span>。关键词中，关于“美丽”、“温柔”、“细腻”的权重占据了核心位置。
                  </p>
                  <p className="opacity-70 italic text-[12px]">
                    模型对女性外貌的刻画极为具体，常涉及身材比例与五官特征。
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold tracking-[0.2em] flex items-center">
                  <span className="w-8 h-[2px] bg-green-500 mr-3"></span>
                  男性形象：主导性的主体
                </h3>
                <div className="space-y-2 text-xs md:text-[14px] leading-[1.8] text-zinc-700 font-light tracking-wide text-justify">
                  <p>
                    描述偏向 <span className="bg-green-100 px-1 font-medium">社会成就</span> 与 <span className="bg-green-100 px-1 font-medium">职场领袖</span>。模型更倾向于赋予男性“成功”、“富有”、“高大”等代表社会资源的标签。
                  </p>
                  <p className="opacity-70 italic text-[12px]">
                    其性格描写往往与“决断力”、“理性”等功能性特质挂钩。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧圆形：图表区 */}
          <div 
            className={`
              absolute right-1/2 w-[80vh] h-[80vh] rounded-full bg-[#f8f8f8] text-black flex items-center justify-start
              transition-all duration-[1500ms] cubic-bezier(0.23, 1, 0.32, 1) z-20 mix-blend-multiply md:mix-blend-normal
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `}
            style={{ 
                transformOrigin: 'left center',
                marginRight: '-60vh'
            }}
          >
            {/* 图表承载区 */}
            <div className="w-[50%] pl-[4%] h-[50vh]">
              <div className="w-full h-full p-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={DATA_VIS}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 300 }} />
                    <Radar
                      name="女性"
                      dataKey="A"
                      stroke="#ff4d94"
                      fill="#ff4d94"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="男性"
                      dataKey="B"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                
                {/* 自定义图例 */}
                <div className="absolute bottom-[-20px] left-0 flex space-x-6 text-[10px] font-mono tracking-widest pl-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#ff4d94] mr-2"></div> <span>FEMALE_BIAS</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#22c55e] mr-2"></div> <span>MALE_BIAS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 装饰层：中心分割线 */}
          <div className={`absolute left-1/2 top-0 w-[1px] h-full bg-black/5 z-30 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>

        {/* 底部备注 */}
        <div className={`absolute bottom-8 left-12 text-white/20 font-mono text-[9px] tracking-[0.5em] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          QUANTITATIVE_CHART // VISUAL_SEMANTICS // GAP_ANALYSIS
        </div>
      </section>

      {/* 第三屏：后续内容 */}
      <section className="h-screen w-full snap-start relative flex flex-col items-center justify-center p-6 bg-[#0a0a0a]">
        <PixelBackground />
        <div className="z-10 text-[#22c55e] font-mono text-sm opacity-20 tracking-widest uppercase">
          Slide_03 // DIMENSIONAL_DEEP_DIVE
        </div>
      </section>

    </div>
  );
};

export default DiscoverySlides;
