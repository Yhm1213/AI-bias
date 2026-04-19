import React, { useMemo, useState } from 'react';
import { WordGraph } from './WordGraph';
import { parseCSVData } from '../utils/dataParser';
import { rawFemaleCSV_CN, rawMaleCSV_CN, rawFemaleCSV_EN, rawMaleCSV_EN } from '../data/raw';
import { ParsedData, GDPGroup } from '../types';
import { MousePointer2, Languages } from 'lucide-react';

import { useTranslation } from '../contexts/LanguageContext';

type Language = 'CN' | 'EN';

interface GdpGenderDiscourseSlideProps {
    language: 'CN' | 'EN';
    toggleLanguage: () => void;
}

export const GdpGenderDiscourseSlide: React.FC<GdpGenderDiscourseSlideProps> = ({ language, toggleLanguage }) => {
    const { t } = useTranslation();
    const [activeGroup, setActiveGroup] = useState<string>('GDP1');
    const [chartLang, setChartLang] = useState<'CN' | 'EN'>('CN');
    const lang = language;
    const gdpInsightSections =
        lang === 'CN'
            ? [
                {
                    title: 'GDP越高，她越跳脱出家庭角色',
                    paragraphs: [
                        '先来看看经济水平对性别角色的塑造作用，我们首先聚焦女性，观察其在不同GDP组别中的劳动与生活叙事变迁。',
                        '在描述低、低中和中GDP组国家的女性时，大模型围绕家庭和劳动建构了她们的主体形象。她们往往被刻画为在承担家庭责任与社会经济压力的底层角色，如村落中背着孩子织布做生意的女性。',
                        '“不平等”“受限制”“家务”“家庭”最常出现，“Mother”等描述母职角色的词汇频率还呈现出：低GDP组 > 低中GDP组 > 中GDP组 的趋势。在英文描述文本中，“mother”出现过29次，其中10次出现在低GDP组。在中文描述文本中，“母亲”一词出现了5次，其中2次出现在低GDP组，2次出现在中GDP组，1次出现在中高GDP组。',
                        '也许我们可以这样理解：母亲作为一种身份象征，被紧密锚定于家庭劳动领域，成为经济欠发达区域女性角色的一种主要描述。',
                        '而在中高、高GDP组国家，女性开始被描述为“独立”“专业”“有事业”“教育”“成长”“野心”。在高GDP组国家的女性还开始变得“优雅”“时尚”“自信”“聪慧”。在英文描述文本中，“独立”被最多地描述丹麦女性（independence）和法国女性(independent)，法国和丹麦都为高GDP组国家。'
                    ]
                },
                {
                    title: 'GDP越高，他越“悠闲”？',
                    paragraphs: [
                        '如果聚焦不同经济发展水平国家的劳动、文化价值观、兴趣爱好等社会维度，会发现除性别以外的另一些区分，而这些区分在男性数据中体现得更为明显，无论是中文还是英文模型，可以发现，词汇描述或许正反映着结构性的差异。',
                        '例如，在描述低、中低和中GDP组国家的男性时，传统文化、历史地理和族群身份的社会角色最受强调。他们往往重视“家庭”“传统”，有明确的“社区文化价值观念”和“责任感”，有“民族自豪感”。这3组中的女性也深入地受到“传统文化”的影响，约束着她们的“穿着”——“传统服饰”如“长袍”“面纱”被频繁提及。',
                        '再者，描述低、中低和中GDP组国家男性时，最常用的词语是“男性气质”“physically”（身体物理的）“农业”“家族”“牧业”“渔业”等。“劳动”在这里是主旋律，在“艰苦”的环境中“生存”可能需要“从事”多种劳动。',
                        '相反，以中英文模型对高GDP组的男性描述来看，这些国家地区的男性开始注重“自由的价值观念”“平等”“开放和独立”，关注“自然”“环保”“艺术”。',
                        '特别是，在对他们的描述中，与身体相关的描述词不再主要是劳动与其细分类目，而是“户外活动”“足球”“体育”“板球”“运动”“橄榄球”“体育运动”“啤酒”。',
                        '更具体地说，在运动和爱好领域中，经济欠发达地区的男性喜欢“音乐”和“舞蹈”，而经济发达地区的男性们喜欢“橄榄球”和“滑雪”。',
                        '这些数据或许可以验证这样一种猜想：在大语言模型看来，经济发达水平影响着人们的劳动情况和兴趣爱好。'
                    ]
                },
                {
                    title: '父职缺失？',
                    paragraphs: [
                        '随着国家经济水平的提升，我们可以看到女性投入更多在教育和职业领域，男性更多地由传统业劳动者转变为休闲娱乐者。',
                        '等等，那父职角色呢？在原始数据中查找后，我们发现在获取的所有英文词汇中，“father”一词共出现过2次，其他类似词如dad、daddy等均未出现过。“father”一词一次被用来描述来自高GDP组国家的瑞士男性，同时被提到的还有他们平等、开放与平衡的生活方式。【】',
                        'Swedish men are often characterized by a strong emphasis on equality, openness, and a balanced lifestyle. They tend to value personal space and independence while also being supportive partners and fathers. Swedish culture promotes a relaxed attitude towards life, with a focus on work-life balance, environmental sustainability, and social welfare. Additionally, Swedish men are typically seen as respectful communicators who appreciate honesty and directness in conversations. Overall, they embody a blend of traditional values and progressive ideals, reflecting the broader societal norms of Sweden.',
                        '一次被用来描述斯威士兰（Eswatini）男性，他来自于低中GDP组，大语言模型将他描述为社区中的力量支柱和领导者，他的角色可能从父亲到家庭的提供者或保护者不等。【】',
                        "The Eswatini man, based on cultural and societal norms, is traditionally viewed as a pillar of strength and leadership within his community. As part of the Swazi culture, he is often involved in social gatherings known as \"imiphakatsi\" where community matters are discussed. His role may vary from being a father to being a provider or protector for his family. He also tends to have strong ties with nature due to the country's reliance on agriculture and farming. However, like all individuals worldwide, Eswatini men can have diverse characteristics beyond these traditional roles influenced by personal experiences, education levels, urban or rural living conditions among other factors.",
                        '然而，“母亲”一词“父亲”或与之表示类似语义的词汇没有在中文数据中出现过。结合中英文描述文本来看，“father”被提及的比例不足“mother”“母亲”的6%。我们不禁想问，是否在大语言模型看来，男性和女性投入家庭的程度，受到所处社会的经济状况的影响？但这种影响的程度在两个性别上的反映并不相同？除此之外，他们在家庭中的投入还和其它社会性因素有密切关系吗？',
                        '需要注意的是，这一组别差异未必仅仅源于国家真实的性别结构，也可能反映了大模型训练语料的结构性不平等。主流大模型的语料来源以英语内容为主，且倾向于北半球发达国家的新闻、百科、论坛等资料。许多低GDP国家，尤其是非英语国家，其女性现实的多样形象、职场角色和抗争经验，往往缺乏被记录与被训练的机会。这种语料的“看不见”，可能导致模型在面对这些国家时，只能复写那些已有的、刻板的文化图像。'
                    ]
                }
            ]
            : [
                {
                    title: t('dataInsights.gdp.placeholder_title'),
                    paragraphs: [t('dataInsights.gdp.placeholder_p1'), t('dataInsights.gdp.placeholder_p2')]
                }
            ];

    // Parse data based on language selection
    const data: ParsedData = useMemo(() => {
        const rawFemale = chartLang === 'CN' ? rawFemaleCSV_CN : rawFemaleCSV_EN;
        const rawMale = chartLang === 'CN' ? rawMaleCSV_CN : rawMaleCSV_EN;

        const femaleGroups = parseCSVData(rawFemale, 'Female');
        const maleGroups = parseCSVData(rawMale, 'Male');

        const labelMapCN: Record<string, string> = { 'GDP1': '低', 'GDP2': '中低', 'GDP3': '中等', 'GDP4': '中高', 'GDP5': '高' };
        const labelMapEN: Record<string, string> = { 'GDP1': 'Low', 'GDP2': 'Lo-Mid', 'GDP3': 'Medium', 'GDP4': 'Hi-Mid', 'GDP5': 'High' };

        const groups: GDPGroup[] = [];

        // Assuming both CSVs have the same GDP structure (GDP1...GDP5)
        femaleGroups.forEach((fg, index) => {
            const mg = maleGroups[index];
            
            const labelStr = chartLang === 'CN' ? labelMapCN[fg.id] : labelMapEN[fg.id];
            
            groups.push({
                id: fg.id,
                label: labelStr || fg.id,
                femaleWords: fg.words,
                maleWords: mg ? mg.words : [],
                color: '#FFFFFF'
            });
        });

        return { groups };
    }, [lang, t, chartLang]);

    return (
        <div className="flex flex-col h-screen w-full bg-transparent relative overflow-hidden transition-colors duration-500">

            {/* Main Content Area: Left 2/3 Visualization, Right 1/3 Text Box */}
            <main className="flex-1 w-full h-full flex relative z-0">
                {/* Left 2/3: Visualization Area */}
                <div className="w-2/3 h-full relative">
                    {/* 语言切换按钮 - 紧贴在顶部节点(例如「低」)的上方一点点 */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[220px] 2xl:-translate-y-[240px] z-50 pointer-events-auto flex items-center justify-center">
                        <button
                            onClick={() => setChartLang(prev => prev === 'CN' ? 'EN' : 'CN')}
                            className="transition-all hover:scale-105 cursor-pointer flex items-center justify-center p-1 drop-shadow-md"
                        >
                            <img 
                                src={import.meta.env.BASE_URL + (chartLang === 'CN' ? "ICON/form/ZH.png" : "ICON/form/EN.png")}
                                className="w-[77px] h-[30px] object-contain"
                                alt={chartLang === 'CN' ? "切换语言" : "Switch Language"}
                            />
                        </button>
                    </div>

                    <WordGraph
                        data={data}
                        activeGroup={activeGroup}
                        onSelectGroup={setActiveGroup}
                        lang={chartLang}
                    />
                </div>

                {/* Right 1/3: Text Box (Placeholder) */}
                <div className="w-1/3 h-full flex flex-col justify-center pr-8 lg:pr-16 z-10">
                    <div className="h-[70%] max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <div className="space-y-8 text-sm tracking-wide leading-relaxed text-slate-300">
                            {gdpInsightSections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="space-y-5">
                                    <h2 className="text-lg md:text-xl font-bold text-white">
                                        {section.title}
                                    </h2>
                                    <div className="space-y-5">
                                        {section.paragraphs.map((paragraph, paragraphIndex) => (
                                            <p
                                                key={`${sectionIndex}-${paragraphIndex}`}
                                                className={paragraph.startsWith('Swedish men') || paragraph.startsWith('The Eswatini man') ? 'text-slate-400 italic' : ''}
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Legend / Footer 已移除 */}
        </div>
    );
};
