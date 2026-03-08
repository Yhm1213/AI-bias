import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';

interface RawLink {
    Edges: string;
    Weight: number;
    V1: string;
    V2: string;
    V1_deleted: boolean;
    V2_deleted: boolean;
    [key: string]: any; // For the boolean theme columns
}

interface NetworkNode extends d3.SimulationNodeDatum {
    id: string;
    radius: number;
    degree: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
    gender?: 'female' | 'male';
}

interface ProcessedLink {
    source: string;
    target: string;
    weight: number;
}

interface NetworkScrollyProps {
    data: Record<string, RawLink[]>;
    activePage: number;
    isVisible: boolean;
}

const NetworkScrolly: React.FC<NetworkScrollyProps> = ({ data, activePage, isVisible }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const simulationRef = useRef<d3.Simulation<NetworkNode, undefined> | null>(null);

    const sheetNames = useMemo(() => Object.keys(data), [data]);

    // Handle container resize
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            });
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Main D3 Effect — delayed to avoid competing with CSS animation
    useEffect(() => {
        if (!isVisible || dimensions.width === 0 || dimensions.height === 0 || sheetNames.length === 0) {
            if (!isVisible && simulationRef.current) {
                simulationRef.current.stop();
            }
            return;
        }

        // Delay D3 init so telescope CSS transition (800ms) finishes first
        const initTimer = setTimeout(() => {
            if (!svgRef.current) return;

            const activeSheetName = sheetNames[Math.min(activePage, sheetNames.length - 1)];
            const allLinksRaw = data[activeSheetName] || [];

            // Filter: only use links that belong to the active theme AND are not deleted
            const filteredLinks = allLinksRaw.filter(l =>
                l[activeSheetName] === true && !l.V1_deleted && !l.V2_deleted
            );

            // Process into nodes and links
            const nodeMap = new Map<string, { id: string; degree: number; totalWeight: number; gender?: 'female' | 'male' }>();
            const processedLinks: ProcessedLink[] = [];

            filteredLinks.forEach(l => {
                if (!nodeMap.has(l.V1)) nodeMap.set(l.V1, { id: l.V1, degree: 0, totalWeight: 0, gender: l.gender });
                if (!nodeMap.has(l.V2)) nodeMap.set(l.V2, { id: l.V2, degree: 0, totalWeight: 0, gender: l.gender });

                // Update gender if it was somehow missing
                if (l.gender) {
                    nodeMap.get(l.V1)!.gender = l.gender;
                    nodeMap.get(l.V2)!.gender = l.gender;
                }

                nodeMap.get(l.V1)!.degree += 1;
                nodeMap.get(l.V1)!.totalWeight += l.Weight;
                nodeMap.get(l.V2)!.degree += 1;
                nodeMap.get(l.V2)!.totalWeight += l.Weight;

                processedLinks.push({
                    source: l.V1,
                    target: l.V2,
                    weight: l.Weight
                });
            });

            // Create scale for node radius based on degree
            const maxDegree = d3.max(Array.from(nodeMap.values()), d => d.degree) || 1;
            const radiusScale = d3.scaleSqrt().domain([1, maxDegree]).range([4, 20]);

            const nodes: NetworkNode[] = Array.from(nodeMap.values()).map(n => ({
                id: n.id,
                radius: radiusScale(n.degree),
                degree: n.degree,
                gender: n.gender
            }));

            // Preserve positions from existing simulation
            if (simulationRef.current) {
                const oldNodes = simulationRef.current.nodes();
                nodes.forEach(n => {
                    const old = oldNodes.find(on => on.id === n.id);
                    if (old) {
                        n.x = old.x;
                        n.y = old.y;
                        n.vx = old.vx;
                        n.vy = old.vy;
                    }
                });
            }

            // D3 setup
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();

            const canvas = svg.append('g').attr('class', 'MainCanvas');

            // Gender Color mapping
            const colorScale = (gender?: string) => {
                if (gender === 'female') return '#F68CB2'; // Pink
                if (gender === 'male') return '#2ABB3A';   // Green
                return '#d4d4d8'; // Default Greige
            };

            // Simulation layout
            const padding = 50;
            const centerX = (dimensions.width / 2) - 40;
            const centerY = (dimensions.height / 2) + 40;
            const maxBoundaryRadius = Math.min(dimensions.width, dimensions.height) / 2 - padding;

            const sim = d3.forceSimulation<NetworkNode>(nodes)
                .force('charge', d3.forceManyBody().strength(-50))
                .force('center', d3.forceCenter(centerX, centerY))
                .force('collide', d3.forceCollide<NetworkNode>().radius(d => d.radius + 5).iterations(2))
                .force('link', d3.forceLink(processedLinks).id((d: any) => d.id).distance(100).strength(0.3))
                .force('x', d3.forceX(centerX).strength(0.05))
                .force('y', d3.forceY(centerY).strength(0.05))
                .alphaDecay(0.05) // Faster convergence (default 0.0228)
                .velocityDecay(0.4); // More damping for quicker settle

            // Pre-tick: run simulation silently for ~60 ticks to pre-compute layout
            // This avoids the "chaotic explosion" animation on screen
            sim.stop();
            for (let i = 0; i < 80; i++) {
                sim.tick();
                // Apply circular boundary during pre-tick too
                nodes.forEach(d => {
                    if (d.x === undefined || d.y === undefined) return;
                    const dx = d.x - centerX;
                    const dy = d.y - centerY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance + d.radius > maxBoundaryRadius) {
                        const angle = Math.atan2(dy, dx);
                        d.x = centerX + Math.cos(angle) * (maxBoundaryRadius - d.radius);
                        d.y = centerY + Math.sin(angle) * (maxBoundaryRadius - d.radius);
                    }
                });
            }

            simulationRef.current = sim;

            // Links
            const linkElements = canvas.selectAll<SVGLineElement, ProcessedLink>('.link')
                .data(processedLinks)
                .enter()
                .append('line')
                .attr('class', 'link')
                .attr('stroke', 'rgba(255,255,255,0.15)')
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0.15);

            // Nodes
            const nodeGroups = canvas.selectAll<SVGGElement, NetworkNode>('.node')
                .data(nodes)
                .enter()
                .append('g')
                .attr('class', 'node')
                .style('cursor', 'pointer')
                .style('opacity', 1)
                .call(d3.drag<SVGGElement, NetworkNode>()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended));

            // Circle
            nodeGroups.append('circle')
                .attr('r', d => d.radius)
                .attr('fill', d => colorScale(d.gender))
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 0.8)
                .attr('opacity', 0.2); // Default opacity 20%

            // Label
            nodeGroups
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', d => -(d.radius + 6))
                .attr('fill', '#e2e8f0')
                .style('font-size', '11px')
                .style('font-weight', '500')
                .style('pointer-events', 'none')
                .style('text-shadow', '0 0 4px rgba(0,0,0,0.9)')
                .style('opacity', d => d.degree >= 3 ? 1 : 0)
                .text(d => d.id);

            // Hover effects
            nodeGroups.on('mouseover', function (event, hoveredNode) {
                const adjacentNodeIds = new Set<string>();
                adjacentNodeIds.add(hoveredNode.id);

                processedLinks.forEach(link => {
                    const sId = typeof link.source === 'string' ? link.source : (link.source as NetworkNode).id;
                    const tId = typeof link.target === 'string' ? link.target : (link.target as NetworkNode).id;
                    if (sId === hoveredNode.id) adjacentNodeIds.add(tId);
                    else if (tId === hoveredNode.id) adjacentNodeIds.add(sId);
                });

                // Dim other nodes, keep hovered and adjacent nodes at 40% (0.4) opacity
                nodeGroups.selectAll('circle').transition().duration(200).ease(d3.easeQuadOut)
                    .attr('opacity', (d: any) => adjacentNodeIds.has(d.id) ? 0.4 : 0.05);

                nodeGroups.selectAll('text').transition().duration(200)
                    .style('opacity', (d: any) => adjacentNodeIds.has(d.id) ? 1 : 0);

                linkElements.transition().duration(200).ease(d3.easeQuadOut)
                    .style('stroke-opacity', d => {
                        const sId = typeof d.source === 'string' ? d.source : (d.source as NetworkNode).id;
                        const tId = typeof d.target === 'string' ? d.target : (d.target as NetworkNode).id;
                        return (sId === hoveredNode.id || tId === hoveredNode.id) ? 0.8 : 0.05;
                    })
                    .attr('stroke-width', d => {
                        const sId = typeof d.source === 'string' ? d.source : (d.source as NetworkNode).id;
                        const tId = typeof d.target === 'string' ? d.target : (d.target as NetworkNode).id;
                        return (sId === hoveredNode.id || tId === hoveredNode.id) ? 2 : 1;
                    });
            });

            nodeGroups.on('mouseout', function () {
                // Restore circle opacity to 20% (0.2)
                nodeGroups.selectAll('circle').transition().duration(200).ease(d3.easeQuadOut)
                    .attr('opacity', 0.2);
                nodeGroups.selectAll('text').transition().duration(200)
                    .style('opacity', (d: any) => d.degree >= 3 ? 1 : 0);
                linkElements.transition().duration(200).ease(d3.easeQuadOut)
                    .style('stroke-opacity', 0.15)
                    .attr('stroke-width', 1);
            });

            // Render pre-computed positions immediately
            linkElements
                .attr('x1', d => (d.source as NetworkNode).x!)
                .attr('y1', d => (d.source as NetworkNode).y!)
                .attr('x2', d => (d.target as NetworkNode).x!)
                .attr('y2', d => (d.target as NetworkNode).y!);
            nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`);

            // Now restart with a low alpha so it just gently settles
            sim.on('tick', () => {
                nodes.forEach(d => {
                    if (d.x === undefined || d.y === undefined) return;
                    const dx = d.x - centerX;
                    const dy = d.y - centerY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance + d.radius > maxBoundaryRadius) {
                        const angle = Math.atan2(dy, dx);
                        d.x = centerX + Math.cos(angle) * (maxBoundaryRadius - d.radius);
                        d.y = centerY + Math.sin(angle) * (maxBoundaryRadius - d.radius);
                    }
                });

                linkElements
                    .attr('x1', d => (d.source as NetworkNode).x!)
                    .attr('y1', d => (d.source as NetworkNode).y!)
                    .attr('x2', d => (d.target as NetworkNode).x!)
                    .attr('y2', d => (d.target as NetworkNode).y!);
                nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`);
            });

            sim.alpha(0.3).restart(); // Low alpha - just gentle settling, not explosive

            function dragstarted(event: any, d: NetworkNode) {
                if (!event.active) sim.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
            function dragged(event: any, d: NetworkNode) {
                d.fx = event.x;
                d.fy = event.y;
            }
            function dragended(event: any, d: NetworkNode) {
                if (!event.active) sim.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        }, activePage === 0 ? 800 : 100); // First appearance: 800ms delay; page switch: 100ms

        return () => {
            clearTimeout(initTimer);
            if (simulationRef.current) {
                simulationRef.current.on('tick', null);
                simulationRef.current.stop();
            }
        };
    }, [data, dimensions, activePage, sheetNames, isVisible]);

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="block" style={{ overflow: 'hidden' }} />
        </div>
    );
};

export default NetworkScrolly;
