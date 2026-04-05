import React, { useEffect, useState, useRef, ReactNode } from 'react';
import pixelBackground from './PixelBackground'; // We don't need this inside, but we need the image import
import wangYuanJing from '../public/pic/wangyuanjing.png';

interface SlideContent {
    titleLeft: ReactNode;
    content: ReactNode;
}

interface ScrollTelescopeSectionProps {
    id: string;
    slides: SlideContent[];
    exitContent: ReactNode;
    mode?: 'default' | 'inverse';
    renderVisualZone?: (subPage: number, isVisible: boolean) => ReactNode;
}

const ScrollTelescopeSection: React.FC<ScrollTelescopeSectionProps> = ({
    id,
    slides,
    exitContent,
    mode = 'default',
    renderVisualZone
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [subPage, setSubPage] = useState(0);
    const [showExitHint, setShowExitHint] = useState(false);

    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollOffset = useRef(0);
    const wasVisible = useRef(false);

    useEffect(() => {
        // We need to attach the listener to the SCROLLABLE CONTAINER, not the window or the section itself.
        // In the parent layout, the scrollable container is the parent div.
        // We can traverse up to find it.
        const section = sectionRef.current;
        if (!section) return;

        const container = section.closest('.overflow-y-auto') as HTMLElement;
        if (!container) return;

        let rafId: number | null = null;
        let reverseMode = false; // Internal variable for logic, though we removed explicit reverse logic ref

        const handleScroll = () => {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                if (!sectionRef.current) return;

                const rect = sectionRef.current.getBoundingClientRect();
                const vh = window.innerHeight;

                let currentVisible = false;

                // 1. Determine Visibility Status
                if (rect.top > 0) {
                    // Entrance Phase (From Top)
                    scrollOffset.current = 0;

                    if (rect.top < vh * 0.5) {
                        currentVisible = true;
                    }
                } else {
                    // Sticky / Exit Phase
                    // Trigger Exit earlier (2.5 screen heights remaining) to give Page 3 more screentime
                    if (rect.bottom < vh * 2.5) {
                        currentVisible = false;
                        // Hint/Exit Content Logic
                        if (rect.bottom > 0) setShowExitHint(true);
                        else setShowExitHint(false);
                    } else {
                        currentVisible = true;
                        setShowExitHint(false);
                    }
                }

                setIsVisible(currentVisible);

                // 2. Check for Re-entry from Bottom specifically
                if (!wasVisible.current && currentVisible && rect.top <= 0) {
                    // Came from bottom -> Teleport to Top
                    container.scrollTo({
                        top: sectionRef.current.offsetTop,
                        behavior: 'auto'
                    });
                    scrollOffset.current = 0;
                    setSubPage(0);
                    wasVisible.current = true;
                    rafId = null;
                    return;
                }

                wasVisible.current = currentVisible;

                // 3. Calculate Page Index
                if (currentVisible) {
                    const scrolledDistance = -rect.top;
                    // Normal logic: Scrolling moves forward
                    const adjustedDistance = scrolledDistance - scrollOffset.current;

                    const pageIndex = Math.floor((adjustedDistance + vh * 0.3) / vh);
                    setSubPage(Math.min(Math.max(pageIndex, 0), slides.length - 1));
                } else {
                    if (rect.top > 0) setSubPage(0);
                }

                rafId = null;
            });
        };

        container.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [slides.length]);

    return (
        <section
            ref={sectionRef}
            className="h-[650vh] w-full relative bg-transparent snap-always"
            style={{ scrollSnapAlign: 'start end' }}
        >
            {/* Sticky Viewport Container */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Inverse Mode Light Background (Only visible during exit phase) */}
                {mode === 'inverse' && showExitHint && (
                    <div className="absolute inset-0 bg-[#f0f0f0] z-0" />
                )}

                {/* Dynamic Background Mask (Black overlay - always starts opaque) */}
                <div
                    className={`
              absolute inset-0 bg-[#121212] z-[1]
              transition-opacity duration-1000
              ${showExitHint ? 'opacity-0' : 'opacity-100'}
          `}
                />

                {/* Core Telescope Container */}
                <div
                    className={`
              relative w-fit h-fit flex justify-center items-center
              will-change-transform
              transition-all duration-[800ms] cubic-bezier(0.23, 1, 0.32, 1) z-10
              ${isVisible
                            ? 'opacity-100 scale-100'
                            : (showExitHint && mode === 'inverse' ? 'opacity-0 scale-[5]' : 'opacity-0 scale-[0.01]')}
            `}
                >
                    {/* Background Image */}
                    <img
                        src={wangYuanJing}
                        alt="Discovery Scope"
                        className="block max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain drop-shadow-2xl select-none pointer-events-none"
                    />

                    {/* Left Arc Progress Bar */}
                    <div
                        className={`
                  absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 h-[60%] w-[10px]
                  flex flex-col justify-center items-center gap-2
                  transition-opacity duration-1000 delay-1000
                  ${isVisible ? 'opacity-100' : 'opacity-0'}
                `}
                    >
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                className={`
                          w-1.5 rounded-full transition-all duration-500 ease-out
                          ${subPage === idx ? 'h-12 bg-[#22c55e] shadow-[0_0_10px_#22c55e]' : 'h-3 bg-zinc-700/50'}
                      `}
                            />
                        ))}
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex">
                        {/* Left Content (50%) */}
                        <div className="w-1/2 h-full flex items-center justify-center p-[8%]">
                            <div
                                className={`
                    w-full max-h-full overflow-hidden pr-1
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                    transition-opacity duration-1000 delay-500
                  `}
                            >
                                <div className="space-y-6 text-zinc-900 font-medium text-left">
                                    {/* Title Swapper */}
                                    <div key={`title-${subPage}`} className="text-center mb-4 animate-fadeIn">
                                        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-black/5 shadow-sm">
                                            {slides[subPage]?.titleLeft}
                                        </div>
                                    </div>

                                    {/* Body Swapper */}
                                    <div key={`content-${subPage}`} className="space-y-4 text-xs md:text-[13px] leading-[1.7] text-zinc-800/90 animate-fadeInSlideUp">
                                        {slides[subPage]?.content}
                                    </div>

                                    <div className="pt-2 border-t border-black/10 mt-2">
                                        <p className="text-[10px] opacity-60 leading-tight">
                                            * Page {subPage + 1} / {slides.length} | {id === 'page-3' ? 'DeepSeek Gender Bias Analysis' : 'ChatGPT English Dataset Bias Analysis'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Logic Placeholder (50%) */}
                        <div
                            id={`${id}-right-zone`}
                            className="w-1/2 h-full relative"
                        >
                            {renderVisualZone ? (
                                renderVisualZone(subPage, isVisible)
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-black/10 text-xs font-mono">
                                        VISUAL_DATA_ZONE_{subPage + 1}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Exit Content (Merged Next Slide) */}
                <div
                    className={`
               absolute inset-0 flex flex-col items-center justify-center z-50
               transition-opacity duration-1000 ease-in
               ${showExitHint ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
                >
                    {/* Force remount when showing to trigger animations (like FallingBlocksChart) */}
                    <div key={showExitHint ? 'show' : 'hide'} className="w-full h-full flex items-center justify-center">
                        {exitContent}
                    </div>
                </div>
            </div>

            {/* Internal Snap Points to enforce "one page per scroll" */}
            {/* We create snap points at intervals to force the parent snap container to catch us */}
            {
                Array.from({ length: slides.length + 2 }).map((_, i) => (
                    <div
                        key={`snap-${i}`}
                        className="absolute w-full h-1 pointer-events-none snap-start"
                        style={{ top: `${i * 100}vh` }}
                    />
                ))
            }
        </section >
    );
};

export default ScrollTelescopeSection;
