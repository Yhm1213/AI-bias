import React, { useState } from 'react';

// Import local SVGs
import low from '../public/pic/Property_1=低.svg';
import lowMid from '../public/pic/Property_1=低中.svg';
import mid from '../public/pic/Property_1=中.svg';
import midHigh from '../public/pic/Property_1=中高.svg';
import high from '../public/pic/Property_1=高.svg';

export const GdpVisualization: React.FC = () => {
    const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

    const layers = [
        { id: 'low', src: low, alt: 'Low GDP Group' },
        { id: 'lowMid', src: lowMid, alt: 'Low-Mid GDP Group' },
        { id: 'mid', src: mid, alt: 'Mid GDP Group' },
        { id: 'midHigh', src: midHigh, alt: 'Mid-High GDP Group' },
        { id: 'high', src: high, alt: 'High GDP Group' },
    ];

    return (
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">

            {/* Visual Layer - Pointer Events Disabled */}
            {layers.map((layer) => {
                const isHovered = hoveredLayer === layer.id;
                const isOthersHovered = hoveredLayer !== null && !isHovered;

                return (
                    <img
                        key={layer.id}
                        src={layer.src}
                        alt={layer.alt}
                        className={`
                            absolute inset-0 w-full h-full object-contain pointer-events-none
                            transition-opacity duration-300 ease-in-out will-change-opacity
                            ${isHovered ? 'z-20 opacity-100' : 'z-10'}
                            ${isOthersHovered ? 'opacity-10' : 'opacity-100'}
                        `}
                    />
                );
            })}

            {/* Interaction Hitbox Layer - Central Vertical Column */}
            {/* This invisible layer sits on top and captures mouse events, decoupling them from the visual layer */}
            <div className="absolute inset-0 z-30 flex items-center justify-center">
                {/* 
                   Adjust these dimensions based on where the 'nodes' are in the SVG.
                   Assuming a central vertical column of nodes.
                */}
                <div className="w-[16%] h-[50%] flex flex-col translate-y-[-2%]">
                    {layers.map((layer) => (
                        <div
                            key={`hitbox-${layer.id}`}
                            className="flex-1 cursor-pointer"
                            title={layer.alt}
                            onMouseEnter={() => setHoveredLayer(layer.id)}
                            onMouseLeave={() => setHoveredLayer(null)}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
};
