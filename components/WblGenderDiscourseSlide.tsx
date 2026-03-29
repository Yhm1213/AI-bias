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
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                            {t('dataInsights.wbl.placeholder_title')}
                        </h2>
                        <div className="space-y-6 text-sm tracking-wide leading-relaxed text-slate-300">
                            <p>
                                {t('dataInsights.wbl.placeholder_p1')}
                            </p>
                            <p>
                                {t('dataInsights.wbl.placeholder_p2')}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Legend / Footer 已移除 */}
        </div>
    );
};
