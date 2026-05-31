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
    const gdpInsightSections = (t('gdpDiscourse', { returnObjects: true }) as Array<{ title: string; paragraphs: string[] }>) || [];

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
                    <div id="gdp-scroll-box" className="h-[70%] max-h-[600px] overflow-y-scroll pr-4">
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

            <style>{`
                #gdp-scroll-box::-webkit-scrollbar {
                    -webkit-appearance: none !important;
                    display: block !important;
                    width: 6px !important;
                }
                #gdp-scroll-box::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.06) !important;
                    border-radius: 10px !important;
                }
                #gdp-scroll-box::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.35) !important;
                    border-radius: 10px !important;
                }
                #gdp-scroll-box:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.6) !important;
                }
            `}</style>
        </div>
    );
};
