import React, { useEffect, useState, useRef } from 'react';

interface FallingBlocksChartProps {
    src: string;
    alt: string;
    className?: string;
    rows?: number;
    cols?: number;
    delay?: number;
}

const FallingBlocksChart: React.FC<FallingBlocksChartProps> = ({
    src,
    alt,
    className = '',
    rows = 10,
    cols = 10,
    delay = 0
}) => {
    const [blocks, setBlocks] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        // Generate blocks
        const newBlocks = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Randomize drop delay slightly for natural feel, plus base delay
                const dropDelay = delay + (Math.random() * 1000);
                newBlocks.push({
                    id: r * cols + c,
                    x: c * (100 / cols),
                    y: r * (100 / rows),
                    delay: dropDelay
                });
            }
        }
        setBlocks(newBlocks);
    }, [rows, cols, delay]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            {/* The actual image, hidden but used for sizing if needed, or we just rely on aspect-ratio */}
            <img
                src={src}
                alt={alt}
                className="opacity-0 w-full h-full object-contain"
                onLoad={() => setImageLoaded(true)}
            />

            {/* The Grid of Blocks forming the image */}
            {imageLoaded && blocks.map((block) => (
                <div
                    key={block.id}
                    className="absolute bg-no-repeat bg-contain transition-all duration-1000 ease-out"
                    style={{
                        left: `${block.x}%`,
                        top: `${block.y}%`,
                        width: `${100 / cols + 0.1}%`, // slight overlap to prevent gaps
                        height: `${100 / rows + 0.1}%`,
                        backgroundImage: `url(${src})`,

                        // Scale and Position background to show the correct segment of the image
                        backgroundSize: `${cols * 100}% ${rows * 100}%`,
                        backgroundPosition: `${(block.x / (100 - 100 / cols)) * 100}% ${(block.y / (100 - 100 / rows)) * 100}%`,

                        // Initial state (we animate TO this, so we need to start "elsewhere")
                        // Animation:
                        transform: `translateY(0)`, // Final state
                        opacity: 1,
                        animation: `fallIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards`,
                        animationDelay: `${block.delay}ms`
                    }}
                />
            ))}

            <style>{`
        @keyframes fallIn {
          0% {
            transform: translateY(-100vh) rotate(10deg);
            opacity: 0;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default FallingBlocksChart;
