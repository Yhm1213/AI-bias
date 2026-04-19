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
    const [isTransitioning, setIsTransitioning] = useState(false);

    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollOffset = useRef(0);
    const wasBelow = useRef(false);
    const previousSubPage = useRef(0);

    useEffect(() => {
        if (previousSubPage.current === subPage) return;

        previousSubPage.current = subPage;
        setIsTransitioning(true);

        const timer = window.setTimeout(() => {
            setIsTransitioning(false);
        }, 420);

        return () => window.clearTimeout(timer);
    }, [subPage]);

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
                    if (rect.bottom <= vh * 2.51) {
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

                const isBelow = rect.bottom <= 0;

                // 2. Check for Re-entry from Bottom specifically
                if (wasBelow.current && !isBelow) {
                    // Came from bottom entirely -> Teleport to Top
                    container.scrollTo({
                        top: sectionRef.current.offsetTop,
                        behavior: 'auto'
                    });
                    scrollOffset.current = 0;
                    setSubPage(0);
                    wasBelow.current = false;
                    rafId = null;
                    return;
                }

                // Update wasBelow tracking
                wasBelow.current = isBelow;

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

                <div
                    className={`
              absolute inset-y-[12%] left-1/2 z-[6] w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#22c55e] to-transparent
              transition-all duration-300 ease-out
              ${isTransitioning ? 'opacity-40 scale-y-100' : 'opacity-0 scale-y-75'}
            `}
                />

                {/* Core Telescope Container */}
                <div
                    className={`
              relative w-fit h-fit flex justify-center items-center
              will-change-transform
              transition-all duration-[800ms] cubic-bezier(0.23, 1, 0.32, 1) z-10
              ${isTransitioning ? 'brightness-[1.03]' : 'brightness-100'}
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
                        <div className="w-1/2 h-full flex items-center justify-center p-[6%] pt-[12%] pl-[10%]">
                            <div
                                className={`
                    w-full h-full max-h-full overflow-hidden pr-1 flex flex-col
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                    transition-opacity duration-1000 delay-500
                  `}
                            >
                                <div className="space-y-6 text-zinc-900 font-medium text-left flex flex-col min-h-0 h-full">
                                    {/* Title Swapper */}
                                    <div key={`title-${subPage}`} className="text-center mb-4 animate-fadeIn">
                                        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-black/5 shadow-sm">
                                            {slides[subPage]?.titleLeft}
                                        </div>
                                    </div>

                                    {/* Body Swapper */}
                                    <div
                                        key={`content-${subPage}`}
                                        className="min-h-0 max-h-[34vh] overflow-y-auto pr-3 space-y-4 text-xs md:text-[13px] leading-[1.7] text-zinc-800/90 animate-fadeInSlideUp [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.16)_transparent] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15"
                                    >
                                        {slides[subPage]?.content}
                                    </div>

                                    <div className="pt-2 border-t border-black/10 mt-3 shrink-0" />

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
                Array.from({ length: slides.length + 2 }).map((_, i) => {
                    const isLast = i === slides.length + 1;
                    return (
                        <div
                            key={`snap-${i}`}
                            id={isLast ? `${id}-exit-snap` : undefined}
                            className="absolute w-full h-1 pointer-events-none snap-start"
                            style={{ top: `${i * 100}vh` }}
                        />
                    );
                })
            }
        </section >
    );
};

export default ScrollTelescopeSection;
