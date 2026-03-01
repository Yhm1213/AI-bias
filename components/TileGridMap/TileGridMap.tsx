import React, { useEffect, useRef, useState } from 'react';
import { TileGridMapAPI } from './tile-grid-map-api';
import PixelBackground from '../PixelBackground';
import './TileGridMap.css';

interface TileGridMapProps {
    onBack?: () => void;
}

const TileGridMap: React.FC<TileGridMapProps> = ({ onBack }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<TileGridMapAPI | null>(null);
    const [status, setStatus] = useState('初始化中...');
    const [language, setLanguage] = useState<'zh' | 'en'>('zh');

    useEffect(() => {
        if (!mapRef.current) return;

        // Set explicit ID for the API to look up
        const containerId = 'tile-grid-map-container';
        mapRef.current.id = containerId;

        // Instantiate API
        const api = new TileGridMapAPI(containerId, { language });
        apiRef.current = api;

        // Initialize with retry logic for dimensions
        const initMap = async () => {
            // Wait for layout paint
            await new Promise(resolve => setTimeout(resolve, 50));

            if (!mapRef.current) return;

            // Check if dimensions are ready
            if (mapRef.current.clientHeight === 0) {
                console.warn('Map container height is 0, waiting...');
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (mapRef.current && mapRef.current.clientHeight > 0) {
                await api.init();
            } else {
                console.error('Map container still has 0 height after wait');
                // Attempt initialization anyway, ECharts might handle it or fail
                await api.init();
            }
        };

        // Ensure we wait a tick for the DOM to settle
        requestAnimationFrame(() => {
            initMap();
        });

        return () => {
            if (apiRef.current) {
                apiRef.current.destroy();
            }
        };
    }, []);

    const handleLanguageSwitch = (lang: 'zh' | 'en') => {
        setLanguage(lang);
        if (apiRef.current) {
            apiRef.current.switchLanguage(lang);
        }
    };

    return (
        <div className="tile-grid-map-page flex flex-col w-full h-screen bg-[#121212] selection:bg-[#ff4d94]/30 relative overflow-hidden">
            <PixelBackground />
            {/* Header / Nav */}
            <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-start pointer-events-none">
                <button
                    onClick={onBack}
                    className="pointer-events-auto px-4 py-2 bg-white/10 backdrop-blur shadow-md rounded-full border border-white/20 hover:bg-white/20 hover:scale-105 transition-all text-sm font-medium flex items-center gap-2 text-white"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                    返回首页
                </button>

                <div className="pointer-events-auto flex p-1 bg-white/10 backdrop-blur shadow-md rounded-full border border-white/20">
                    <button
                        onClick={() => handleLanguageSwitch('zh')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${language === 'zh' ? 'bg-[#ff4d94] text-white shadow-sm' : 'text-gray-300 hover:bg-white/10'}`}
                    >
                        中文
                    </button>
                    <button
                        onClick={() => handleLanguageSwitch('en')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${language === 'en' ? 'bg-[#ff4d94] text-white shadow-sm' : 'text-gray-300 hover:bg-white/10'}`}
                    >
                        English
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div className="w-full h-full relative z-10" ref={mapRef}>
                <div className="loading absolute inset-0 flex items-center justify-center text-gray-400">正在加载地图数据...</div>
            </div>
        </div>
    );
};

export default TileGridMap;
