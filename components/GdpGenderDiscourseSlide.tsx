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

    // Parse data based on language selection
    const data: ParsedData = useMemo(() => {
        const rawFemale = chartLang === 'CN' ? rawFemaleCSV_CN : rawFemaleCSV_EN;
        const rawMale = chartLang === 'CN' ? rawMaleCSV_CN : rawMaleCSV_EN;

        const femaleGroups = parseCSVData(rawFemale, 'Female');
        const maleGroups = parseCSVData(rawMale, 'Male');

        const groups: GDPGroup[] = [];

        // Assuming both CSVs have the same GDP structure (GDP1...GDP5)
        femaleGroups.forEach((fg, index) => {
            const mg = maleGroups[index];
            groups.push({
                id: fg.id,
                label: (t('dataInsights.gdp.labelMap') as unknown as Record<string, string>)[fg.id] || fg.id,
                femaleWords: fg.words,
                maleWords: mg ? mg.words : [],
                color: '#FFFFFF'
            });
        });

        return { groups };
    }, [lang, t]);

    return (
        <div className="flex flex-col h-screen w-full bg-transparent relative overflow-hidden transition-colors duration-500">

            {/* Main Content Area: Left 2/3 Visualization, Right 1/3 Text Box */}
            <main className="flex-1 w-full h-full flex relative z-0">
                {/* Left 2/3: Visualization Area */}
                <div className="w-2/3 h-full relative">
                    {/* 语言切换按钮 - 展示图的正上方中间 */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex gap-2 items-center">
                        <button
                            onClick={() => setChartLang('CN')}
                            className="transition-transform hover:scale-105 cursor-pointer flex items-center justify-center p-1"
                        >
                            <img 
                                src={import.meta.env.BASE_URL + (chartLang === 'CN' ? "ICON/form/ZH_press.png" : "ICON/form/ZH_default.png")}
                                className="h-10 w-auto object-contain drop-shadow-md"
                                alt="中文"
                            />
                        </button>
                        <button
                            onClick={() => setChartLang('EN')}
                            className="transition-transform hover:scale-105 cursor-pointer flex items-center justify-center p-1"
                        >
                            <img 
                                src={import.meta.env.BASE_URL + (chartLang === 'EN' ? "ICON/form/EN_press.png" : "ICON/form/EN_default.png")}
                                className="h-10 w-auto object-contain drop-shadow-md"
                                alt="English"
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
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                            {t('dataInsights.gdp.placeholder_title')}
                        </h2>
                        <div className="space-y-6 text-sm tracking-wide leading-relaxed text-slate-300">
                            <p>
                                {t('dataInsights.gdp.placeholder_p1')}
                            </p>
                            <p>
                                {t('dataInsights.gdp.placeholder_p2')}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Legend / Footer 已移除 */}
        </div>
    );
};
