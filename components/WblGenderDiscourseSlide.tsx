import React, { useMemo, useState } from 'react';
import { WordGraph } from './WordGraph';
import { parseCSVData } from '../utils/dataParser';
import { rawFemaleCSV_WBL_CN, rawMaleCSV_WBL_CN, rawFemaleCSV_WBL_EN, rawMaleCSV_WBL_EN } from '../data/raw';
import { ParsedData, GDPGroup } from '../types';
import { MousePointer2, Languages } from 'lucide-react';

import { useTranslation } from '../contexts/LanguageContext';

type Language = 'CN' | 'EN';

interface WblGenderDiscourseSlideProps {
    language: 'CN' | 'EN';
    toggleLanguage: () => void;
}

export const WblGenderDiscourseSlide: React.FC<WblGenderDiscourseSlideProps> = ({ language, toggleLanguage }) => {
    const { t } = useTranslation();
    const [activeGroup, setActiveGroup] = useState<string>('GDP1');
    const [chartLang, setChartLang] = useState<'CN' | 'EN'>('CN');
    const lang = language;
    const wblInsightTitle =
        lang === 'CN'
            ? '从规训到自主：女性叙事的解放趋势'
            : t('dataInsights.wbl.placeholder_title');
    const wblInsightSections =
        lang === 'CN'
            ? [
                {
                    title: '从规训到自主：女性叙事的解放趋势',
                    paragraphs: [
                        '首先是外貌约束性语言的消退。在低WBL组国家的女性描述文本中，“面貌”“黑袍”“传统服饰”等约束性外貌词汇频繁出现，随着WBL指数上升，这类词汇减少，取而代之的是“美丽”“皮肤”等更具自主性的表达。同样地，英文大模型中，高WBL组别更多地提及“appearance”。',
                        '其次是角色和行为的解放。家庭角色的刻板印象同样呈现梯度变化。“孩子”“照顾”“贤惠”等词语在低WBL组国家的描述文本中高频出现，却在高WBL组中大幅淡化，“独立性”“职场”等词汇与女性更多地出现关联。在英文语境下，“occupation”“profession”也呈现随着WBL指数增高而更高频被提到的现象。',
                        '同样地，“活跃”一词随着WBL的增加，更多地在描述女性的文本中体现。活跃一词往往和“xx领域”相关联，意味着女性更多地展露在商业、政治、社会、学术等各大领域中。如“比利时女性……在社会和职业生活中表现活跃，注重个人发展和自由。”',
                        '品德评价的“平等化”也是不容忽视的一点。譬如，尽管男性更多地被表述为好客的（hospitable），但在高WBL分组中，女性热情好客的表达也在增加。',
                        '高WBL分组的数据中，传统男性主导的品德评价也逐渐平等分配至两性。例如，在低WBL组模型中，“勇敢”多用于男性英雄叙事，而高WBL组中同样使用“勇敢”来描述女性。',
                        '在部分“品德”描述上，中英文语言模型显现出差异。如在中文叙述下，“诚实”更多代指男性；而在英文叙事中，“authenticity（真诚）”一词更多用于女性，并且在高WBL分组中，这一规律更加明显。'
                    ]
                },
                {
                    title: '甩不掉的偏见：大模型还是有点“老眼光”',
                    paragraphs: [
                        '即便性别平等指数（WBL）高的国家让AI对女性的描述更自由，偏见还是悄悄藏在字里行间。比如，“美丽”一词在女性描述中总是比男性多得多；“母亲”“妻子”常出现在女性描述里，但“父亲”“丈夫”等男性家庭角色却几乎不被提及。同样地，在男性的描述文本中，“活跃”一词更多出现在商业、科技、政治等具体领域，而女性则仍停留在家庭和社会的泛泛描述中。不论中文还是英文语境下，爱国（patriotism）的美德似乎只停留在男性叙事中了。',
                        '此外，中文大模型的“眼光”似乎比英文大模型更老。在英语语境下，高WBL组别中，女性更多被赋予“adaptive”（适应力强）、“versatile”（多才多艺）、“variety”（多样化）等动态标签，而中文模型却将女性更多固化在“贤惠”“顾家”的单一叙事中，“多元”更多描述男性且没有出现随着WBL组别增高而增加的现象。',
                        '值得进一步追问的是，模型是否真正“理解”了这些国家的性别结构？同GDP中的分析一样，我们需要注意大模型训练语料的结构性不平等问题。数据训练中的“文化他者化”，意味着来自某些国家的本地女性声音、非官方叙事、民间知识等没有被广泛记录或进入英文主语料库。在这种不对称的信息结构中，模型学习到的“性别现实”往往是由西方媒体或国际NGO构建的他者视角，而非当地女性自己的叙述。',
                        '“语言模型是社会的一面镜子，”不同性别之间的偏见客观存在，AI叙事的偏向性因此也客观存在，但不应放任AI加大加深它。技术必须主动识别这些偏见，而非被动复制现实。或许当模型开发者引入更多WBL等结构性指标，系统性检测并更加主动修正模型中的歧视性叙事时，机器将拥有一双更加平等的眼睛。'
                    ]
                }
            ]
            : [
                {
                    title: t('dataInsights.wbl.placeholder_title'),
                    paragraphs: [t('dataInsights.wbl.placeholder_p1'), t('dataInsights.wbl.placeholder_p2')]
                }
            ];

    // Parse data based on language selection
    const data: ParsedData = useMemo(() => {
        const rawFemale = chartLang === 'CN' ? rawFemaleCSV_WBL_CN : rawFemaleCSV_WBL_EN;
        const rawMale = chartLang === 'CN' ? rawMaleCSV_WBL_CN : rawMaleCSV_WBL_EN;

        const femaleGroups = parseCSVData(rawFemale, 'Female');
        const maleGroups = parseCSVData(rawMale, 'Male');

        const labelMapCN: Record<string, string> = { 'GDP1': '低', 'GDP2': '低中', 'GDP3': '中', 'GDP4': '中高', 'GDP5': '高' };
        const labelMapEN: Record<string, string> = { 'GDP1': 'Low', 'GDP2': 'Lo-Mid', 'GDP3': 'Medium', 'GDP4': 'Hi-Mid', 'GDP5': 'High' };

        const groups: GDPGroup[] = [];

        // Assuming both CSVs have the same structure (parsed as GDP1...GDP5 internally)
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
                            {wblInsightSections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="space-y-5">
                                    <h2 className="text-lg md:text-xl font-bold text-white">
                                        {section.title}
                                    </h2>
                                    <div className="space-y-5">
                                        {section.paragraphs.map((paragraph, index) => (
                                            <p key={`${sectionIndex}-${index}`}>
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
