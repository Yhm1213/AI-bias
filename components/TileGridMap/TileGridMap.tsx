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
                    className="pointer-events-auto hover:scale-105 transition-transform duration-300 flex items-center justify-center p-1"
                >
                    <img 
                        src={import.meta.env.BASE_URL + "ICON/HOME.png"} 
                        alt="返回首页" 
                        className="h-10 w-auto object-contain drop-shadow-md" 
                    />
                </button>
                <div className="pointer-events-auto flex gap-2 items-center">
                    <button
                        onClick={() => handleLanguageSwitch('zh')}
                        className="transition-transform hover:scale-105 cursor-pointer flex items-center justify-center p-1"
                    >
                        <img 
                            src={import.meta.env.BASE_URL + (language === 'zh' ? "ICON/form/ZH_press.png" : "ICON/form/ZH_default.png")}
                            className="h-10 w-auto object-contain drop-shadow-md"
                            alt="中文"
                        />
                    </button>
                    <button
                        onClick={() => handleLanguageSwitch('en')}
                        className="transition-transform hover:scale-105 cursor-pointer flex items-center justify-center p-1"
                    >
                        <img 
                            src={import.meta.env.BASE_URL + (language === 'en' ? "ICON/form/EN_press.png" : "ICON/form/EN_default.png")}
                            className="h-10 w-auto object-contain drop-shadow-md"
                            alt="English"
                        />
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
