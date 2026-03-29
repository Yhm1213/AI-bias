import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { ParsedData, NodeData, LinkData } from '../types';

interface WordGraphProps {
    data: ParsedData;
    activeGroup: string;
    onSelectGroup: (id: string) => void;
    lang?: 'CN' | 'EN';
}

// Pseudo-random generator for consistent chaos
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const WordGraph: React.FC<WordGraphProps> = ({ data, activeGroup, onSelectGroup, lang = 'CN' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    // Refs for animation manipulation
    const floatingGroupRefs = useRef<Map<string, SVGGElement>>(new Map());
    const linkPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    // Dynamic Layout Config based on Language
    // EN needs wider buttons for "Lo-Mid", "Hi-Mid" consistency
    const layoutConfig = useMemo(() => {
        const isEN = lang === 'EN';
        return {
            braceX: isEN ? 45 : 28,      // Distance of braces from center
            tipOffset: isEN ? 10 : 8,    // Distance from brace X to connection point
            ellipseRx: isEN ? 60 : 38,   // Background ellipse width
            ellipseRy: 20,
            textScale: isEN ? 14 : 16    // Slightly smaller font for EN if needed, or keep same
        };
    }, [lang]);

    // Handle Resize with ResizeObserver
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Use contentRect for precise dimensions
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Compute Layout
    const { nodes, links, centerY, outerRadius, arcSpreadAngle } = useMemo(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return { nodes: [], links: [], centerY: 0, outerRadius: 0, arcSpreadAngle: 0 };

        const { width, height } = dimensions;
        const cx = width / 2;
        const cy = height / 2;

        // Config
        const r = Math.min(width, height) / 2 - 80;
        const spread = Math.PI * 0.75; // 135 degrees spread

        const allNodes: NodeData[] = [];
        const allLinks: LinkData[] = [];

        // 1. Place Center Nodes (GDP Groups)
        const verticalGap = Math.min(70, height / (data.groups.length + 4));
        const stackHeight = verticalGap * (data.groups.length - 1);
        const startY = cy - stackHeight / 2;

        data.groups.forEach((group, i) => {
            const y = startY + i * verticalGap;
            allNodes.push({
                id: group.id,
                type: 'root',
                text: group.label,
                size: 30,
                groupIndex: i,
                color: '#FFFFFF',
                x: cx,
                y: y,
            });
        });

        // 2. Place Word Nodes - ONLY for the active group
        const activeGroupData = data.groups.find(g => g.id === activeGroup);

        if (activeGroupData) {
            const allocateWords = (side: 'left' | 'right') => {
                const words = side === 'left' ? activeGroupData.femaleWords : activeGroupData.maleWords;
                if (words.length === 0) return;

                const startAngle = -spread / 2;
                const endAngle = spread / 2;
                const totalAngle = endAngle - startAngle;
                const angleStep = totalAngle / (words.length);

                words.forEach((w, wIdx) => {
                    const offsetAngle = startAngle + wIdx * angleStep + (angleStep / 2);
                    let angle: number;
                    if (side === 'right') {
                        angle = offsetAngle;
                    } else {
                        angle = Math.PI - offsetAngle;
                    }

                    const wx = cx + r * Math.cos(angle);
                    const wy = cy + r * Math.sin(angle);

                    const sizeScale = d3.scaleSqrt().domain([0, 500]).range([6, 26]);
                    const nodeSize = sizeScale(w.freq);

                    const nodeId = `${side}-${activeGroupData.id}-${w.word}-${wIdx}`;
                    const nodeColor = side === 'left' ? '#F68CB2' : '#2ABB3A';

                    // Calculate Rotation
                    let rotation = angle * (180 / Math.PI);
                    if (side === 'left') {
                        rotation = rotation - 180;
                    }

                    const node: NodeData = {
                        id: nodeId,
                        type: 'word',
                        side: side,
                        text: w.word,
                        size: nodeSize,
                        groupIndex: data.groups.indexOf(activeGroupData),
                        color: nodeColor,
                        x: wx,
                        y: wy,
                        originalFreq: w.freq,
                        index: wIdx,
                        rotation: rotation
                    };
                    allNodes.push(node);

                    const sourceNode = allNodes.find(n => n.id === activeGroup);
                    if (sourceNode) {
                        allLinks.push({
                            source: sourceNode,
                            target: node,
                            groupIndex: node.groupIndex,
                            color: nodeColor
                        });
                    }
                });
            };
            allocateWords('left');
            allocateWords('right');
        }

        return { nodes: allNodes, links: allLinks, axisHeight: stackHeight + 100, centerY: cy, outerRadius: r, arcSpreadAngle: spread };
    }, [data, dimensions, activeGroup]);

    // Pre-calculate random parameters for animation to keep it stable
    const animMeta = useMemo(() => {
        const meta = new Map();
        const { braceX, tipOffset } = layoutConfig;

        links.forEach((link, i) => {
            const seed = i * 1337;
            const rand1 = seededRandom(seed) - 0.5;
            const rand2 = seededRandom(seed + 1) - 0.5;
            const nodeSeed = link.target.index || 0;

            // Calculate offset baseSx to attach to OUTER brace tips
            const connectionX = braceX + tipOffset;
            const xOffset = link.target.side === 'left' ? -connectionX : connectionX;

            meta.set(link.target.id, {
                chaosY: 150 * rand1,
                chaosY2: 100 * rand2,
                duration: 3000 + seededRandom(nodeSeed) * 4000,
                delay: seededRandom(nodeSeed + 100) * -5000,
                baseSx: (link.source.x || 0) + xOffset,
                baseSy: link.source.y || 0,
                baseTx: link.target.x || 0,
                baseTy: link.target.y || 0,
                side: link.target.side
            });
        });
        return meta;
    }, [links, layoutConfig]);

    // Animation Loop
    useEffect(() => {
        startTimeRef.current = performance.now();

        const animate = (time: number) => {
            const elapsed = time;

            // Iterate over all active links
            animMeta.forEach((meta, nodeId) => {
                const nodeGroup = floatingGroupRefs.current.get(nodeId);
                const linkPath = linkPathRefs.current.get(nodeId);

                // Calculate float offset
                const t = (elapsed + meta.delay) % meta.duration;
                const progress = t / meta.duration;
                const angle = progress * Math.PI * 2;
                const yOffset = -3 + Math.sin(angle) * 3;

                // 1. Update Node Position
                if (nodeGroup) {
                    nodeGroup.setAttribute('transform', `translate(0, ${yOffset})`);
                }

                // 2. Update Link Path
                if (linkPath) {
                    const sx = meta.baseSx;
                    const sy = meta.baseSy;
                    const tx = meta.baseTx;
                    const ty = meta.baseTy + yOffset;

                    const cp1x = sx + (meta.side === 'right' ? 80 : -80);
                    const cp1y = sy + meta.chaosY * 0.2;
                    const cp2x = tx + (meta.side === 'right' ? -100 : 100);
                    const cp2y = ty + meta.chaosY2;

                    const d = `M${sx},${sy} C${cp1x},${cp1y} ${cp2x},${cp2y} ${tx},${ty}`;
                    linkPath.setAttribute('d', d);
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animMeta]);

    // Helper to draw arcs
    const drawArc = (startAngle: number, endAngle: number, r: number) => {
        const x1 = r * Math.cos(startAngle);
        const y1 = r * Math.sin(startAngle);
        const x2 = r * Math.cos(endAngle);
        const y2 = r * Math.sin(endAngle);
        return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
    };

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <svg width={dimensions.width} height={dimensions.height} className="block overflow-visible">
                <defs>
                    <radialGradient id="ellipse-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                        <stop offset="40%" stopColor="white" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>

                    <filter id="ellipse-glow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <filter id="link-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* STRUCTURAL FRAME */}
                {dimensions.width > 0 && (
                    <g className="frame pointer-events-none" transform={`translate(${dimensions.width / 2}, ${dimensions.height / 2})`}>
                        {/* 1. Left Arc (Female) */}
                        <path
                            d={drawArc(Math.PI - arcSpreadAngle / 2, Math.PI + arcSpreadAngle / 2, outerRadius)}
                            fill="none"
                            stroke="white"
                            strokeOpacity={0.15}
                            strokeWidth={1.5}
                            strokeLinecap="round"
                        />

                        {/* 2. Right Arc (Male) */}
                        <path
                            d={drawArc(-arcSpreadAngle / 2, arcSpreadAngle / 2, outerRadius)}
                            fill="none"
                            stroke="white"
                            strokeOpacity={0.15}
                            strokeWidth={1.5}
                            strokeLinecap="round"
                        />

                        {/* 3. Split Inner Glow - Left */}
                        <path
                            d={drawArc(Math.PI - arcSpreadAngle / 2, Math.PI + arcSpreadAngle / 2, outerRadius * 0.8)}
                            fill="none"
                            stroke="url(#ellipse-grad)"
                            strokeWidth={40}
                            strokeOpacity={0.05}
                            strokeLinecap="round"
                        />

                        {/* 4. Split Inner Glow - Right */}
                        <path
                            d={drawArc(-arcSpreadAngle / 2, arcSpreadAngle / 2, outerRadius * 0.8)}
                            fill="none"
                            stroke="url(#ellipse-grad)"
                            strokeWidth={40}
                            strokeOpacity={0.05}
                            strokeLinecap="round"
                        />

                        {/* 椭圆眼眶图 - 将整个图表当成眼球包上去 */}
                        <image 
                            href={import.meta.env.BASE_URL + "ICON/tuoyuan.png"}
                            x={- (outerRadius * 2.15 * (1720 / 672)) / 2}
                            y={- (outerRadius * 2.15) / 2}
                            width={outerRadius * 2.15 * (1720 / 672)}
                            height={outerRadius * 2.15}
                            preserveAspectRatio="xMidYMid meet"
                            className="pointer-events-none opacity-80"
                        />

                        {/* Female Label - positioned exactly below the center stack aligned left */}
                        <text
                            x={-70}
                            y={Math.min(140, (dimensions.height / 9) * 2) + 110}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill="#F68CB2"
                            fontSize={14}
                            fontWeight="500"
                            letterSpacing="0.1em"
                            className="select-none pointer-events-none drop-shadow-lg"
                        >
                            {lang === 'CN' ? '女性描述' : 'Female'}
                        </text>

                        {/* Male Label - positioned exactly below the center stack aligned right */}
                        <text
                            x={70}
                            y={Math.min(140, (dimensions.height / 9) * 2) + 110}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill="#2ABB3A"
                            fontSize={14}
                            fontWeight="500"
                            letterSpacing="0.1em"
                            className="select-none pointer-events-none drop-shadow-lg"
                        >
                            {lang === 'CN' ? '男性描述' : 'Male'}
                        </text>
                    </g>
                )}

                {/* Links Layer */}
                <g className="links pointer-events-none">
                    {links.map((link, i) => {
                        if (!link.source.x || !link.source.y || !link.target.x || !link.target.y) return null;

                        // Chaos Seeds for static visuals (opacity)
                        const seed = i * 1337;
                        const rand1 = seededRandom(seed) - 0.5;

                        const isHovered = hoveredNodeId === link.target.id;
                        const isDimmed = hoveredNodeId && !isHovered;

                        const variedOpacity = 0.25 + (rand1 * 0.1);

                        // Fallback D logic for initial render
                        const meta = animMeta.get(link.target.id);
                        // Use meta params if available to prevent jump, otherwise calculate based on config
                        const { braceX, tipOffset } = layoutConfig;
                        const connectionX = braceX + tipOffset;
                        const xOffset = link.target.side === 'left' ? -connectionX : connectionX;

                        const sx = meta ? meta.baseSx : link.source.x + xOffset;
                        const sy = link.source.y;
                        const tx = link.target.x;
                        const ty = link.target.y;

                        const cp1x = sx + (link.target.side === 'right' ? 80 : -80);
                        const cp1y = sy;
                        const cp2x = tx + (link.target.side === 'right' ? -100 : 100);
                        const cp2y = ty;
                        const fallbackD = `M${sx},${sy} C${cp1x},${cp1y} ${cp2x},${cp2y} ${tx},${ty}`;

                        return (
                            <path
                                key={`link-${link.target.id}`}
                                ref={(el) => { if (el) linkPathRefs.current.set(link.target.id, el); }}
                                d={fallbackD}
                                fill="none"
                                stroke={link.color}
                                strokeWidth={isHovered ? 2.5 : 1.2}
                                strokeOpacity={isHovered ? 1 : (isDimmed ? 0.05 : variedOpacity)}
                                className="transition-all duration-300 ease-out"
                                style={{
                                    filter: isHovered ? 'url(#link-glow)' : 'none',
                                    transitionProperty: 'stroke, stroke-width, stroke-opacity, filter',
                                }}
                            />
                        );
                    })}
                </g>

                {/* Word Nodes Layer */}
                <g className="nodes">
                    {nodes.filter(n => n.type === 'word').map((node, i) => {
                        const isLeft = node.side === 'left';
                        const delay = (node.index || 0) * 20;

                        const isHovered = hoveredNodeId === node.id;
                        const isDimmed = hoveredNodeId && !isHovered;

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x},${node.y})`}
                                onMouseEnter={() => setHoveredNodeId(node.id)}
                                onMouseLeave={() => setHoveredNodeId(null)}
                                className={`cursor-pointer transition-opacity duration-300 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                            >
                                {/* Wrapper for Entrance Animation */}
                                <g
                                    className="animate-pop-in"
                                    style={{ animationDelay: `${delay}ms` }}
                                >
                                    {/* Inner Wrapper for Floating (JS Controlled) */}
                                    <g ref={(el) => { if (el) floatingGroupRefs.current.set(node.id, el); }}>
                                        {/* Glow Halo on Hover */}
                                        <circle
                                            r={node.size * 1.5}
                                            fill={node.color}
                                            fillOpacity={isHovered ? 0.3 : 0}
                                            filter="url(#ellipse-glow)"
                                            className="transition-all duration-300"
                                        />

                                        {/* Main Visual Circle */}
                                        <circle
                                            r={isHovered ? node.size * 1.1 : node.size}
                                            fill={node.color}
                                            fillOpacity={isHovered ? 0.9 : 0.7}
                                            className="transition-all duration-300"
                                        />

                                        {/* Center Dot */}
                                        <circle
                                            r={isHovered ? 3 : 2}
                                            fill="white"
                                            opacity={0.6}
                                            className="transition-all duration-300"
                                        />

                                        {/* Text Label */}
                                        <text
                                            x={isLeft ? - (node.size + 12) : (node.size + 12)}
                                            y={0}
                                            dy="0.35em"
                                            transform={`rotate(${node.rotation || 0})`}
                                            textAnchor={isLeft ? "end" : "start"}
                                            fontSize={isHovered ? 16 : 14}
                                            fill={isHovered ? "#FFFFFF" : "#E2E8F0"}
                                            fontWeight={isHovered ? "bold" : "500"}
                                            className="select-none pointer-events-none transition-all duration-300"
                                            style={{
                                                textShadow: isHovered
                                                    ? `0 0 15px ${node.color}`
                                                    : '0 0 5px rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            {node.text}
                                        </text>
                                    </g>
                                </g>
                            </g>
                        );
                    })}
                </g>

                {/* Center Group Nodes (Axis Buttons) */}
                <g className="roots">
                    {nodes.filter(n => n.type === 'root').map((node) => {
                        const isActive = activeGroup === node.id;
                        const { braceX, ellipseRx, ellipseRy, textScale } = layoutConfig;

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x},${node.y})`}
                                onClick={() => onSelectGroup(node.id)}
                                className={`cursor-pointer transition-all duration-500 group`}
                            >
                                <circle r={35} fill="transparent" />

                                {isActive && (
                                    <ellipse
                                        cx={0} cy={0}
                                        rx={ellipseRx} ry={ellipseRy}
                                        fill="url(#ellipse-grad)"
                                        filter="url(#ellipse-glow)"
                                        className="animate-breathe"
                                    />
                                )}

                                {/* Split Brackets and Text for Consistent Width */}
                                <g className={`select-none transition-all duration-300 relative z-10 ${isActive ? 'scale-110' : 'group-hover:text-white'}`}
                                    style={{
                                        fill: isActive ? "white" : "rgba(255,255,255,0.3)",
                                        fontWeight: isActive ? "bold" : "normal",
                                        fontSize: isActive ? textScale + 2 : textScale,
                                        fontFamily: 'monospace',
                                        textShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                                    }}
                                >
                                    <text x={-braceX} y={0} dy=".35em" textAnchor="middle">{'{'}</text>
                                    <text x={0} y={0} dy=".35em" textAnchor="middle">{node.text}</text>
                                    <text x={braceX} y={0} dy=".35em" textAnchor="middle">{'}'}</text>
                                </g>
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Bottom Centered Legends (Removed in favor of SVG texts on arcs) */}


            <style>{`
        .animate-pop-in {
            animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
        }
        @keyframes popIn {
            from { opacity: 0; transform: scale(0); }
            to { opacity: 1; transform: scale(1); }
        }

        .animate-breathe {
            animation: breathe 4s ease-in-out infinite;
        }
        @keyframes breathe {
            0%, 100% { opacity: 0.6; rx: ${layoutConfig.ellipseRx}px; ry: ${layoutConfig.ellipseRy}px; }
            50% { opacity: 0.8; rx: ${layoutConfig.ellipseRx + 4}px; ry: ${layoutConfig.ellipseRy + 2}px; }
        }
      `}</style>
        </div>
    );
};
