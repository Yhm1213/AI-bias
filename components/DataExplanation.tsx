
import React, { useState } from 'react';

interface DataExplanationProps {
  onBack: () => void;
  highlightId?: number | null;
}

const DataExplanation: React.FC<DataExplanationProps> = ({ onBack, highlightId }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-hover and scroll to highlightId on mount
  React.useEffect(() => {
    if (highlightId) {
      const index = items.findIndex(item => item.id === highlightId);
      if (index !== -1) {
        setHoveredIndex(index);
        const element = document.getElementById(`data-item-${highlightId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [highlightId]);

  const items = [
    {
      id: 1,
      content: "每个国家和性别分别请两个模型都续写10次，但并非每次都成功。且在个别时候，英文模型反馈不能续写，举例如下：The term \"Liberia man\" is not specific enough to draw a conclusion. However, if you are referring to men from Liberia, it is important to recognize that individuals from any country, including Liberia, are diverse in their characteristics, experiences, and identities. It is essential to avoid making generalizations or stereotypes about people based on their nationality, as doing so can perpetuate harmful biases. It is always important to approach individuals with an open mind, recognizing their unique traits and qualities as individuals rather than attributing characteristics to them based on where they come from."
    },
    {
      id: 2,
      content: "【2】中文数据清洗方式：将分词获得1547个原始词语通过Uniqueness, Versatility, 和Votes删除无效词。"
    },
    {
      id: 3,
      content: "【3】英文数据清洗方式：将分词获得的4067个原始词语，通过Uniqueness, Versatility, 和Votes删除无效词，最终总有效词语1808个。因为英文词汇过多，我们筛选出同一词语在两个问题下词频的的排序百分比差值在0.1及以上的词，并确保这些词都出现在共现网络中。"
    },
    {
      id: 4,
      content: "【4】词语性别差异指数\n具体而言，对于词语w来说，其**词语性别差异指数的计算方式为：**$I_w=Quantile_{woman}(freq_{woman}(w))-Quantile_{man}(freq_{man}(w))$\n看不懂没有关系，你只需要知道：这个指数的取值范围在-1到1之间，接近1表示该词语更多用于描述女性，接近-1则表示更多用于男性，0代表完全中性，没有性别倾向。"
    },
    {
      id: 5,
      content: "【5】人均GDP，《金融与发展》https://www.imf.org/external/chinese/pubs/ft/fandd/2008/12/pdf/basics.pdf"
    },
    {
      id: 6,
      content: "【6】人均GDP分组\n......"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#121212] flex flex-col p-8 md:p-16 animate-fade-in relative">
      {/* Header - Positioned at top left */}
      <h1 className="fixed top-8 left-8 md:top-16 md:left-16 font-mono text-4xl md:text-6xl text-[#22c55e] z-20 tracking-tighter pixel-font pointer-events-none">
        数据说明
      </h1>

      <div className="w-full md:w-2/3 md:ml-auto space-y-12 pt-32 md:pt-48 pb-32 px-8 md:px-16">

        {/* Content List */}
        <div className="space-y-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              id={`data-item-${item.id}`}
              className={`text-[13px] md:text-[14px] leading-relaxed transition-all duration-300 font-light tracking-wide cursor-default p-4 rounded-sm border border-transparent
                ${hoveredIndex === index
                  ? 'text-[#22c55e] border-[#22c55e]/20 bg-[#22c55e]/5 -translate-x-12'
                  : 'text-zinc-300'
                }
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex gap-4">
                {/* Visual indicator for id 1 (circle number) */}
                {item.id === 1 && (
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 transition-colors duration-300
                        ${hoveredIndex === index ? 'bg-[#22c55e] text-[#121212]' : 'bg-[#22c55e] text-[#121212]'}
                    `}>
                    1
                  </span>
                )}
                {/* Content */}
                <div className="whitespace-pre-line">
                  {item.content}
                  {hoveredIndex === index && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onBack();
                      }}
                      className="inline-block ml-3 px-1.5 py-0.5 border border-[#22c55e]/50 text-[#22c55e] text-[10px] cursor-pointer hover:bg-[#22c55e] hover:text-[#121212] font-mono uppercase tracking-widest align-middle transition-all select-none"
                    >
                      BACK
                    </span>
                  )}
                </div>
              </div>

              {/* BACK button appearing on hover, positioned absolute relative to item or fixed */}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Back Button */}
      <button
        onClick={onBack}
        className="fixed bottom-8 right-8 md:hidden px-4 py-2 border border-[#22c55e] text-[#22c55e] font-mono text-xs uppercase bg-[#121212]"
      >
        BACK
      </button>

      <style>{`
        .pixel-font {
             font-family: 'Fira Code', monospace; 
             /* In a real pixel font scenario we might load a specific font, but user asked for Fira Code/Inter usage */
        }
      `}</style>
    </div>
  );
};

export default DataExplanation;
