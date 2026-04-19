
import React, { useState } from 'react';

interface DataExplanationProps {
  onBack: () => void;
  highlightId?: number | null;
}

interface DataExplanationItem {
  id: number;
  content: React.ReactNode;
  tableHeaders?: string[];
  tableRows?: string[][];
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

  const items: DataExplanationItem[] = [
    {
      id: 1,
      content: "每个国家和性别分别请两个模型都续写10次，但并非每次都成功。且在个别时候，英文模型反馈不能续写，举例如下：The term \"Liberia man\" is not specific enough to draw a conclusion. However, if you are referring to men from Liberia, it is important to recognize that individuals from any country, including Liberia, are diverse in their characteristics, experiences, and identities. It is essential to avoid making generalizations or stereotypes about people based on their nationality, as doing so can perpetuate harmful biases. It is always important to approach individuals with an open mind, recognizing their unique traits and qualities as individuals rather than attributing characteristics to them based on where they come from."
    },
    {
      id: 2,
      content: "中文数据清洗方式：将分词获得1547个原始词语通过Uniqueness, Versatility, 和Votes删除无效词。"
    },
    {
      id: 3,
      content: "英文数据清洗方式：将分词获得的4067个原始词语，通过Uniqueness, Versatility, 和Votes删除无效词，最终总有效词语1808个。因为英文词汇过多，我们筛选出同一词语在两个问题下词频的的排序百分比差值在0.1及以上的词，并确保这些词都出现在共现网络中。"
    },
    {
      id: 4,
      content: "词语性别差异指数\n具体而言，对于词语w来说，其**词语性别差异指数的计算方式为：**$I_w=Quantile_{woman}(freq_{woman}(w))-Quantile_{man}(freq_{man}(w))$\n看不懂没有关系，你只需要知道：这个指数的取值范围在-1到1之间，接近1表示该词语更多用于描述女性，接近-1则表示更多用于男性，0代表完全中性，没有性别倾向。"
    },
    {
      id: 5,
      content: "人均GDP，《金融与发展》https://www.imf.org/external/chinese/pubs/ft/fandd/2008/12/pdf/basics.pdf"
    },
    {
      id: 6,
      content: "【6】人均GDP分组",
      tableHeaders: ["人均GDP分组组别", "国家"],
      tableRows: [
        ["分组1——低人均GDP组", "贝宁，布基纳法索，布隆迪，柬埔寨，喀麦隆，中非共和国，乍得，科摩罗，埃塞俄比亚，几内亚，几内亚比绍，海地，基里巴斯，吉尔吉斯斯坦，老挝人民民主共和国，莱索托，利比里亚，马达加斯加，马拉维，马里，毛里塔尼亚，莫桑，比克，缅甸，尼泊尔，尼日尔，巴基斯坦，卢旺达，塞内加尔，塞拉利昂，索马里，苏丹，塔吉克斯坦，坦桑尼亚，冈比亚，多哥，乌干达，也门，赞比亚，津巴布韦"],
        ["分组2——低中人均GDP组", "阿尔及利亚，安哥拉，埃及阿拉伯共和国，孟加拉国，玻利维亚，佛得角，科特迪瓦，刚果民主共和国，吉布提，萨尔瓦多，斯威士兰，密克罗尼西亚联邦，斐济，加纳，洪都拉斯，印度，伊朗伊斯兰共和国，约旦，肯尼亚，蒙古，摩洛哥，纳米比亚，尼加拉瓜，尼日利亚，巴布亚新几内亚，菲律宾，刚果共和国，萨摩亚，圣多美和普林西比，所罗门群岛，斯里兰卡，东帝汶，突尼斯，图瓦卢，乌克兰，乌兹别克斯坦，瓦努阿图，越南"],
        ["分组3——中人均GDP组", "阿尔巴尼亚，亚美尼亚，阿塞拜疆，白俄罗斯，伯利兹，波斯尼亚和黑塞哥维那，博茨瓦纳，巴西，哥伦比亚，多米尼克，多米尼加共和国，厄瓜多尔，赤道几内亚，加蓬，格鲁吉亚，格林纳达，危地马拉，伊拉克，牙买加，哈萨克斯坦，利比亚，马来西亚，马尔代夫，马绍尔群岛，毛里求斯，墨西哥，摩尔多瓦，黑山，瑙鲁，北马其顿，巴拉圭，秘鲁，圣文森特和格林纳丁斯，塞尔维亚，南非，苏里南，泰国，土耳其，土库曼斯坦"],
        ["分组4——中高人均GDP组", "美属萨摩亚，安提瓜和巴布达，阿根廷，阿鲁巴，巴林，巴巴多斯，保加利亚，智利，中国，哥斯达黎加，克罗地亚，库拉索，塞浦路斯，捷克共和国，爱沙尼亚，法属波利尼西亚，希腊，圭亚那，匈牙利，拉脱维亚，立陶宛，阿曼，巴拿马，波兰，葡萄牙，罗马尼亚，俄罗斯联邦，圣基茨和尼维斯，圣卢西亚，沙特阿拉伯，塞舌尔，斯洛伐克共和国，斯洛文尼亚，韩国，西班牙，巴哈马，特立尼达和多巴哥，特克斯和凯科斯群岛，乌拉圭"],
        ["分组5——高人均GDP组", "安道尔，澳大利亚，奥地利，比利时，百慕大，文莱达鲁萨兰国，加拿大，开曼群岛，丹麦，法罗群岛，芬兰，法国，德国，香港特别行政区，冰岛，爱尔兰，以色列，意大利，日本，科威特，卢森堡，澳门特别行政区，马耳他，摩纳哥，荷兰，新喀里多尼亚，新西兰，挪威，波多黎各，卡塔尔，新加坡，圣马丁岛（荷兰部分），瑞典，瑞士，阿拉伯联合酋长国，英国，美国"]
      ]
    },
    {
      id: 7,
      content: (
        <>
          <div>【7】WBL分组</div>
          <div className="italic mt-2">
            World Bank. 2024. Women, Business and the Law 2024. Washington, DC: World Bank.
          </div>
        </>
      )
    },
    {
      id: 8,
      content: "【8】由于数据匹配原因，最终纳入WBL交叉分析的共175个国家。",
      tableHeaders: ["组别", "WBL区间", "国家"],
      tableRows: [
        ["第一组", "26.25_65.5", "阿尔及利亚，阿曼，埃及阿拉伯共和国，巴布亚新几内亚，巴基斯坦，博茨瓦纳，赤道几内亚，多米尼克，刚果共和国，海地，几内亚比绍，喀麦隆，卡塔尔，科摩罗，科威特，利比亚，马来西亚，马里，毛里塔尼亚，孟加拉国，密克罗尼西亚联邦，缅甸，尼日尔，斯威士兰，苏丹，所罗门群岛，索马里，突尼斯，瓦努阿图，文莱达鲁萨兰国，西岸和加沙地带，也门，伊拉克，伊朗伊斯兰共和国，约旦"],
        ["第二组", "65.5_78.75", "安提瓜和巴布达，巴林，白俄罗斯，布隆迪，俄罗斯联邦，菲律宾，冈比亚，刚果民主共和国，哈萨克斯坦，洪都拉斯，基里巴斯，吉布提，吉尔吉斯斯坦，几内亚，加纳，马达加斯加，马尔代夫，马绍尔群岛，摩洛哥，尼日利亚，日本，萨摩亚，塞内加尔，塞舌尔，沙特阿拉伯，圣基茨和尼维斯，圣文森特和格林纳丁斯，斯里兰卡，苏里南，塔吉克斯坦，泰国，特立尼达和多巴哥，危地马拉，牙买加，印度，乍得，中非共和国，中国"],
        ["第三组", "78.75_85.0", "阿根廷，阿联酋，阿塞拜疆，埃塞俄比亚，安哥拉，巴巴多斯，巴哈马，巴拿马，巴西，北马其顿，贝宁，波多黎各，波斯尼亚和黑塞哥维那，伯利兹，布基纳法索，斐济，哥伦比亚，格林纳达，黑山，柬埔寨，肯尼亚，莱索托，利比里亚，马拉维，莫桑比克，纳米比亚，尼泊尔，圣卢西亚，坦桑尼亚，乌干达，乌克兰，乌兹别克斯坦，新加坡，以色列，赞比亚，智利"],
        ["第四组", "85.0_92.0", "阿尔巴尼亚，保加利亚，玻利维亚，东帝汶，多米尼加共和国，厄瓜多尔，佛得角，哥斯达黎加，格鲁吉亚，圭亚那，韩国，津巴布韦，科索沃，老挝人民民主共和国，卢旺达，罗马尼亚，马耳他，毛里求斯，美国，蒙古，摩尔多瓦，墨西哥，南非，尼加拉瓜，瑞士，萨尔瓦多，斯洛伐克共和国，乌拉圭，香港特别行政区，亚美尼亚，越南"],
        ["第五组", "92.0_100.0", "爱尔兰，爱沙尼亚，奥地利，澳大利亚，巴拉圭，比利时，冰岛，波兰，丹麦，德国，多哥，法国，芬兰，荷兰，加拿大，加蓬，捷克，克罗地亚，拉脱维亚，立陶宛，卢森堡，秘鲁，挪威，葡萄牙，瑞典，塞尔维亚，塞拉利昂，塞浦路斯，斯洛文尼亚，西班牙，希腊，新西兰，匈牙利，意大利，英国"]
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#121212] flex flex-col p-8 md:p-16 animate-fade-in relative">
      {/* Header - Positioned at top left */}
      <h1 className="fixed top-8 left-8 md:top-16 md:left-16 font-quan text-4xl md:text-6xl text-[#22c55e] z-20 tracking-tighter pixel-font pointer-events-none">
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
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 transition-colors duration-300
                        ${hoveredIndex === index ? 'bg-[#22c55e] text-[#121212]' : 'bg-[#22c55e] text-[#121212]'}
                    `}
                >
                  {item.id}
                </span>
                {/* Content */}
                <div className="whitespace-pre-line">
                  <div>{item.content}</div>
                  {item.tableHeaders && item.tableRows && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-[720px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-[#22c55e]/30">
                            {item.tableHeaders.map((header) => (
                              <th key={header} className="px-3 py-2 text-[#22c55e] font-semibold align-top">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.tableRows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-white/10 align-top">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-3 whitespace-normal">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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

      {/* 返回首页按钮 - 固定在左下角 */}
      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 pointer-events-auto flex items-center gap-2">
        <button
          onClick={onBack}
          className="hover:scale-105 transition-transform duration-300 flex items-center justify-center p-1"
        >
          <img 
            src={import.meta.env.BASE_URL + "ICON/HOME.png"} 
            alt="返回首页"
            className="h-10 w-auto object-contain drop-shadow-md" 
          />
        </button>
      </div>

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
