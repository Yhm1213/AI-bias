import React, { useMemo, useState } from 'react';
import { WordGraph } from './WordGraph';
import { parseCSVData } from '../utils/dataParser';
import { rawFemaleCSV_CN, rawMaleCSV_CN, rawFemaleCSV_EN, rawMaleCSV_EN } from '../data/raw';
import { ParsedData, GDPGroup } from '../types';
import { MousePointer2, Languages } from 'lucide-react';

type Language = 'CN' | 'EN';

export const GdpGenderDiscourseSlide: React.FC = () => {
    // Default to GDP1 so we always show data
    const [activeGroup, setActiveGroup] = useState<string>('GDP1');
    const [lang, setLang] = useState<Language>('CN');

    // Localization Maps
    const content = {
        CN: {
            title: "GDP分组与性别描述词频",
            desc: "展示了不同GDP分组国家中，针对男性和女性最高频的30个描述词。",
            descSub: "圆圈大小代表词频高低。",
            interactiveTitle: "交互模式",
            interactiveHint: "点击中间的“低-高”按钮切换数据视图",
            hoverHint: "悬停词语可高亮详情",
            legendFemale: "女性描述 (Female)",
            legendMale: "男性描述 (Male)",
            labelMap: {
                'GDP1': '低',
                'GDP2': '低中',
                'GDP3': '中',
                'GDP4': '中高',
                'GDP5': '高',
            } as Record<string, string>
        },
        EN: {
            title: "GDP Group & Gender Discourse",
            desc: "Visualizing high-frequency descriptive words for males and females across 5 GDP groups.",
            descSub: "Circle size represents word frequency.",
            interactiveTitle: "Interactive Mode",
            interactiveHint: "Click center buttons (Low-High) to switch views",
            hoverHint: "Hover over words to highlight details",
            legendFemale: "Female Descriptors",
            legendMale: "Male Descriptors",
            labelMap: {
                'GDP1': 'Low',
                'GDP2': 'Lo-Mid',
                'GDP3': 'Mid',
                'GDP4': 'Hi-Mid',
                'GDP5': 'High',
            } as Record<string, string>
        }
    };

    const currentText = content[lang];

    // Parse data based on language selection
    const data: ParsedData = useMemo(() => {
        const rawFemale = lang === 'CN' ? rawFemaleCSV_CN : rawFemaleCSV_EN;
        const rawMale = lang === 'CN' ? rawMaleCSV_CN : rawMaleCSV_EN;

        const femaleGroups = parseCSVData(rawFemale, 'Female');
        const maleGroups = parseCSVData(rawMale, 'Male');

        const groups: GDPGroup[] = [];

        // Assuming both CSVs have the same GDP structure (GDP1...GDP5)
        femaleGroups.forEach((fg, index) => {
            const mg = maleGroups[index];
            groups.push({
                id: fg.id,
                label: currentText.labelMap[fg.id] || fg.id,
                femaleWords: fg.words,
                maleWords: mg ? mg.words : [],
                color: '#FFFFFF'
            });
        });

        return { groups };
    }, [lang, currentText.labelMap]);

    return (
        <div className="flex flex-col h-screen w-full bg-transparent relative overflow-hidden transition-colors duration-500">


            {/* Header */}
            <header className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-between items-start">
                <div className="transition-opacity duration-300">
                    {/* 标题和文字已移除 */}
                </div>

                <div className="pointer-events-auto flex flex-col items-end gap-3">
                    {/* Language Switcher */}
                    <button
                        onClick={() => setLang(prev => prev === 'CN' ? 'EN' : 'CN')}
                        className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-slate-500 rounded-full px-4 py-2 shadow-lg transition-all active:scale-95 group"
                    >
                        <Languages className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                        <div className="flex items-center text-xs font-bold text-slate-400">
                            <span className={`px-1 transition-colors ${lang === 'CN' ? 'text-white' : ''}`}>CN</span>
                            <span className="opacity-30">/</span>
                            <span className={`px-1 transition-colors ${lang === 'EN' ? 'text-white' : ''}`}>EN</span>
                        </div>
                    </button>


                </div>
            </header>

            {/* Main Content Area: Left 2/3 Visualization, Right 1/3 Text Box */}
            <main className="flex-1 w-full h-full flex relative z-0">
                {/* Left 2/3: Visualization Area */}
                <div className="w-2/3 h-full relative">
                    <WordGraph
                        data={data}
                        activeGroup={activeGroup}
                        onSelectGroup={setActiveGroup}
                        lang={lang}
                    />
                </div>

                {/* Right 1/3: Text Box (Placeholder) */}
                <div className="w-1/3 h-full flex flex-col justify-center pr-8 lg:pr-16 z-10">
                    <div className="h-[70%] max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                            {lang === 'CN' ? '数据洞察 (占位符)' : 'Data Insights (Placeholder)'}
                        </h2>
                        <div className="space-y-6 text-sm tracking-wide leading-relaxed text-slate-300">
                            <p>
                                {lang === 'CN'
                                    ? '这里是一个文本框占位符。未来你可以在这里添加关于当前选择的 GDP 分组和性别描述词频的详细分析和见解。'
                                    : 'This is a placeholder for a text box. In the future, you can add detailed analysis and insights regarding the currently selected GDP group and gender discourse frequency.'}
                            </p>
                            <p>
                                {lang === 'CN'
                                    ? '现在的布局是将左侧的三分之二分配给动态词云图，右侧的三分之一用于展示这些文本信息。可以通过点击中间的按钮切换不同国家组别的数据。'
                                    : 'The current layout allocates the left two-thirds to the dynamic word cloud and the right one-third for displaying text information. You can switch between different country groups by clicking the center buttons.'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Legend / Footer 已移除 */}
        </div>
    );
};
