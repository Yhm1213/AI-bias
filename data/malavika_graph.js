// document.addEventListener('DOMContentLoaded', function () {
//     // Ensure globalGraphData is available
//     if (typeof globalGraphData === 'undefined') {
//         console.error('globalGraphData is undefined');
//         return;
//     }

//     // Get breadcrumbs from session storage to determine visited nodes
//     const visitedHrefs = JSON.parse(sessionStorage.getItem('breadcrumbs') || '[]').map(item => item.href);

//     // Create nodes and links from the data
//     const nodes = [];
//     const tagNodes = [];

//     // Process posts
//     globalGraphData.forEach(post => {
//         const postNode = {
//             id: post.postID,
//             title: post.postTitle,
//             href: post.postHref,
//             forwardLinks: post.forwardLinks || [],
//             backlinks: post.backlinks || [],
//             type: visitedHrefs.includes(post.postHref) ? 'visited' : 'unvisited'
//         };
//         nodes.push(postNode);

//         // Process tags for this post
//         if (post.tags && post.tags.length > 0) {
//             post.tags.forEach(tag => {
//                 // Check if tag node already exists
//                 let tagNode = tagNodes.find(t => t.id === `tag_${tag.id}`);
                
//                 if (!tagNode) {
//                     tagNode = {
//                         id: `tag_${tag.id}`,
//                         title: tag.name,
//                         href: `/tag/${tag.slug}`,
//                         type: 'tag'
//                     };
//                     tagNodes.push(tagNode);
//                 }
//             });
//         }
//     });

//     // Combine nodes
//     const allNodes = [...nodes, ...tagNodes];

//     // Create links array
//     const links = [];

//     // Process post-to-post links
//     nodes.forEach(node => {
//         // Forward links
//         node.forwardLinks.forEach(link => {
//             const targetNode = nodes.find(n => n.title === link.title);
//             if (targetNode) {
//                 links.push({ 
//                     source: node.id, 
//                     target: targetNode.id, 
//                     type: link.href.includes(window.location.hostname) ? 'forward-internal' : 'forward-external'
//                 });
//             }
//         });

//         // Backlinks
//         node.backlinks.forEach(link => {
//             const targetNode = nodes.find(n => n.title === link.title);
//             if (targetNode) {
//                 links.push({ 
//                     source: targetNode.id, 
//                     target: node.id, 
//                     type: link.href.includes(window.location.hostname) ? 'backward-internal' : 'backward-external'
//                 });
//             }
//         });
//     });

//     // Add tag-to-post links with more robust checking
//     globalGraphData.forEach(post => {
//         if (post.tags && post.tags.length > 0) {
//             post.tags.forEach(tag => {
//                 // Find the tag node
//                 const tagNodeId = `tag_${tag.id}`;
//                 const tagNode = allNodes.find(n => n.id === tagNodeId);
                
//                 // Find the post node
//                 const postNode = allNodes.find(n => n.id === post.postID);
                
//                 // Only add link if both nodes exist
//                 if (tagNode && postNode) {
//                     links.push({
//                         source: tagNodeId,
//                         target: post.postID,
//                         type: 'tag-post'
//                     });
//                 }
//             });
//         }
//     });

//     // Select the global-graph container
//     const container = d3.select('#global-graph');
//     const svg = container.append('svg')
//         .attr('width', '100%')
//         .attr('height', '600px')
//         .style('overflow', 'visible');

//     // Create a group for zoom
//     const g = svg.append('g');

//     // Zoom functionality
//     const zoom = d3.zoom()
//         .scaleExtent([0.1, 10])
//         .on('zoom', (event) => {
//             g.attr('transform', event.transform);
//         });

//     svg.call(zoom);

//     const width = +svg.attr('width');
//     const height = +svg.attr('height');

//     // Color mapping based on theme colors
//     const color = d3.scaleOrdinal()
//         .domain([
//             'visited', 'unvisited', 'tag',
//             'forward-internal', 'forward-external', 
//             'backward-internal', 'backward-external',
//             'tag-post'
//         ])
//         .range([
//             'var(--wp--preset--color--maroon)', 
//             'var(--wp--preset--color--greige)',
//             'var(--wp--preset--color--blue)', 
//             'var(--wp--preset--color--green)', 
//             'var(--wp--preset--color--yellow)', 
//             'var(--wp--preset--color--beige)', 
//             'var(--wp--preset--color--beige-50)',
//             'var(--wp--preset--color--green-50)'
//         ]);

//     // Create simulation
//     const simulation = d3.forceSimulation(allNodes)
//         .force('link', d3.forceLink().id(d => d.id).distance(100))
//         .force('charge', d3.forceManyBody().strength(-50))
//         .force('center', d3.forceCenter(600, 400))
//         .force('x', d3.forceX(600).strength(0.1))
//         .force('y', d3.forceY(400).strength(0.1));

//     // Create the links
//     const link = g.append('g')
//         .attr('class', 'links')
//         .selectAll('line')
//         .data(links)
//         .enter().append('line')
//         .attr('stroke-width', d => {
//             return d.type === 'tag-post' ? 5 : 12;
//         })
//         .attr('stroke', d => {
//             if (d.type === 'tag-post') return "var(--wp--preset--color--green)";
//             return "var(--wp--preset--color--beige)";
//         })
//         .attr('stroke-opacity', d => {
//             return d.type === 'tag-post' ? 0.5 : 0.6;
//         });

//     // Create tooltip
//     const tooltip = container.append('div')
//         .attr('class', 'graph-tooltip')
//         .style('position', 'absolute')
//         .style('visibility', 'hidden')
//         .style('background', 'white')
//         .style('border', '1px solid black')
//         .style('padding', '5px')
//         .style('border-radius', '5px');

//     // Create the nodes
//     const node = g.append('g')
//     .attr('class', 'nodes')
//     .selectAll('circle')
//     .data(allNodes)
//     .enter().append('circle')
//     .attr('r', d => {
//         return d.type === 'tag' ? 4 : 10;
//     })
//     .attr('fill', d => color(d.type))
//     .attr('stroke', d => {
//         return d.type === 'tag' ? 'var(--wp--preset--color--blue)' : 'none';
//     })
//     .attr('stroke-width', 2)
//     .style('cursor', 'pointer') // Add pointer cursor to nodes
//     .on('mouseover', function(event, d) {
//         // Show tooltip
//         tooltip.html(() => {
//             if (d.type === 'tag') {
//                 return `Tag: ${d.title}`;
//             } else {
//                 return `${d.title}`;
//             }
//         })
//         .style('visibility', 'visible')
//         .style('left', (event.pageX + 10) + 'px')
//         .style('top', (event.pageY + 10) + 'px');
//     })
//     .on('mouseout', function() {
//         // Hide tooltip
//         tooltip.style('visibility', 'hidden');
//     })
//     .call(d3.drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended))
//     .on('click', function (event, d) {
//         window.location = d.href;
//     });

//     // Update simulation on tick
//     simulation
//         .nodes(allNodes)
//         .on('tick', () => {
//             link.attr('x1', d => d.source.x)
//                 .attr('y1', d => d.source.y)
//                 .attr('x2', d => d.target.x)
//                 .attr('y2', d => d.target.y);

//             node.attr('cx', d => d.x)
//                 .attr('cy', d => d.y);

//             label.attr('x', d => d.x)
//                 .attr('y', d => d.y);
//         });

//     // Set links for simulation
//     simulation.force('link').links(links);

//     // Drag functions
//     function dragstarted(event, d) {
//         if (!event.active) simulation.alphaTarget(0.3).restart();
//         d.fx = d.x;
//         d.fy = d.y;
//     }

//     function dragged(event, d) {
//         d.fx = event.x;
//         d.fy = event.y;
//     }

//     function dragended(event, d) {
//         if (!event.active) simulation.alphaTarget(0);
//         d.fx = d.x;
//         d.fy = d.y;
//     }
// });

document.addEventListener('DOMContentLoaded', function () {
    // Ensure globalGraphData is available
    if (typeof globalGraphData === 'undefined') {
        console.error('globalGraphData is undefined');
        return;
    }

    // Get breadcrumbs from session storage to determine visited nodes
    const visitedHrefs = JSON.parse(sessionStorage.getItem('breadcrumbs') || '[]').map(item => item.href);

    // Create nodes and links from the data
    const nodes = [];
    const tagNodes = [];

    // Process posts
    globalGraphData.forEach(post => {
        const postNode = {
            id: post.postID,
            title: post.postTitle,
            href: post.postHref,
            forwardLinks: post.forwardLinks || [],
            backlinks: post.backlinks || [],
            type: visitedHrefs.includes(post.postHref) ? 'visited' : 'unvisited'
        };
        nodes.push(postNode);

        // Process tags for this post
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
                // Check if tag node already exists
                let tagNode = tagNodes.find(t => t.id === `tag_${tag.id}`);
                
                if (!tagNode) {
                    tagNode = {
                        id: `tag_${tag.id}`,
                        title: tag.name,
                        href: `/tag/${tag.slug}`,
                        type: 'tag'
                    };
                    tagNodes.push(tagNode);
                }
            });
        }
    });

    // Combine nodes
    const allNodes = [...nodes, ...tagNodes];

    // Create links array
    const links = [];

    // Process post-to-post links
    nodes.forEach(node => {
        // Forward links
        node.forwardLinks.forEach(link => {
            const targetNode = nodes.find(n => n.title === link.title);
            if (targetNode) {
                links.push({ 
                    source: node.id, 
                    target: targetNode.id, 
                    type: link.href.includes(window.location.hostname) ? 'forward-internal' : 'forward-external'
                });
            }
        });

        // Backlinks
        node.backlinks.forEach(link => {
            const targetNode = nodes.find(n => n.title === link.title);
            if (targetNode) {
                links.push({ 
                    source: targetNode.id, 
                    target: node.id, 
                    type: link.href.includes(window.location.hostname) ? 'backward-internal' : 'backward-external'
                });
            }
        });
    });

    // Add tag-to-post links with more robust checking
    globalGraphData.forEach(post => {
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
                // Find the tag node
                const tagNodeId = `tag_${tag.id}`;
                const tagNode = allNodes.find(n => n.id === tagNodeId);
                
                // Find the post node
                const postNode = allNodes.find(n => n.id === post.postID);
                
                // Only add link if both nodes exist
                if (tagNode && postNode) {
                    links.push({
                        source: tagNodeId,
                        target: post.postID,
                        type: 'tag-post'
                    });
                }
            });
        }
    });

    // Select the global-graph container
    const container = d3.select('#global-graph');
    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', '90vh')
        .style('overflow', 'visible');

    // Create background pattern
    const defs = svg.append('defs');
    
    // Subtle grid pattern
    const pattern = defs.append('pattern')
        .attr('id', 'gridPattern')
        .attr('width', 20)
        .attr('height', 20)
        .attr('patternUnits', 'userSpaceOnUse');
    
    pattern.append('path')
        .attr('d', 'M 20 0 L 0 0 0 20')
        .attr('fill', 'none')
        .attr('stroke', 'rgba(0,0,0,0.05)')
        .attr('stroke-width', 1);

    // Add background rect with pattern
    svg.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'url(#gridPattern)')
        .style('pointer-events', 'none');

    // Create a group for zoom
    const g = svg.append('g');

    // Zoom functionality
    const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Color mapping - softer, more muted palette
    const color = d3.scaleOrdinal()
        .domain([
            'visited', 'unvisited', 'tag',
            'forward-internal', 'forward-external', 
            'backward-internal', 'backward-external',
            'tag-post'
        ])
        .range([
            'var(--wp--preset--color--yellow)',   // visited
            'var(--wp--preset--color--maroon)',   // unvisited
            'var(--wp--preset--color--green)',   // tag
            'var(--wp--preset--color--beige)',    // forward internal
            'var(--wp--preset--color--beige)',   // forward external
            'var(--wp--preset--color--beige)',   // backward internal
            'var(--wp--preset--color--beige)',   // backward external
            'var(--wp--preset--color--greige)'    // tag-post
        ]);

    // Create simulation with more spread-out layout
    const simulation = d3.forceSimulation(allNodes)
        .force('link', d3.forceLink().id(d => d.id).distance(150)) // Increased distance
        .force('charge', d3.forceManyBody().strength(-50)) // Reduced repulsion
        .force('center', d3.forceCenter(600, 400))
        .force('x', d3.forceX(600).strength(0.05)) // Reduced x force
        .force('y', d3.forceY(400).strength(0.05)); // Reduced y force

    // Create the links - thinner and more subtle
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke-width', d => {
            return d.type === 'tag-post' ? 1 : 2; // Much thinner links
        })
        .attr('stroke', d => color(d.type))
        .attr('stroke-opacity', 0.1);

    // Create tooltip
    const tooltip = container.append('div')
        .attr('class', 'graph-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'var(--wp--preset--color--beige)')
        .style('border', '1px solid rgba(160, 137, 134, 0.3)')
        .style('padding', '5px 10px')
        .style('border-radius', '15px');

    // Create the nodes - smaller and more subtle
    const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(allNodes)
    .enter().append('circle')
    .attr('r', d => {
        return d.type === 'tag' ? 6 : 8;
    })
    .attr('fill', d => color(d.type))
    .style('cursor', 'pointer')
    .style('opacity', 1) // Default full opacity
    .on('mouseover', function(event, hoveredNode) {
        // Find adjacent nodes
        const adjacentNodes = new Set();
        
        // Find nodes connected to the hovered node
        links.forEach(link => {
            if (link.source === hoveredNode || link.target === hoveredNode) {
                adjacentNodes.add(link.source);
                adjacentNodes.add(link.target);
            }
        });
    
        // Dim other nodes, keep hovered and adjacent nodes fully visible
        node.transition()
            .duration(300)
            .ease(d3.easeQuadOut)
            .style('opacity', d => {
                // Full opacity for hovered node and its adjacent nodes
                return d === hoveredNode || adjacentNodes.has(d) ? 1 : 0.25;
            });
    
        // Highlight connected links with transition
        link.transition()
            .duration(300)
            .ease(d3.easeQuadOut)
            .style('stroke-opacity', d => {
                // More visible for directly connected links
                return (d.source === hoveredNode || d.target === hoveredNode) 
                    ? 1  // Connected links
                    : 0.05; // Unconnected links
            })
            .attr('stroke-width', d => {
                // Make connected links thicker
                return (d.source === hoveredNode || d.target === hoveredNode) 
                    ? (d.type === 'tag-post' ? 4 : 6)  // Thicker for connected links
                    : (d.type === 'tag-post' ? 1 : 2); // Original thickness
            });
    
        // Tooltip with slight delay for smoother appearance
        tooltip.transition()
            .duration(200)
            .style('opacity', 1)
            .on('end', () => {
                tooltip.html(() => {
                    if (hoveredNode.type === 'tag') {
                        return `Tag: ${hoveredNode.title}`;
                    } else {
                        return `${hoveredNode.title}`;
                    }
                })
                .style('visibility', 'visible')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px');
            });
    })
    .on('mouseout', function() {
        // Restore original state with transition
        node.transition()
            .duration(300)
            .ease(d3.easeQuadOut)
            .style('opacity', 1);
    
        link.transition()
            .duration(300)
            .ease(d3.easeQuadOut)
            .style('stroke-opacity', 0.1)
            .attr('stroke-width', d => {
                return d.type === 'tag-post' ? 1 : 2;
            });
    
        // Tooltip fade out
        tooltip.transition()
            .duration(200)
            .style('opacity', 0)
            .on('end', () => {
                tooltip.style('visibility', 'hidden');
            });
    })    
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
    .on('click', function (event, d) {
        window.location = d.href;
    });

    // Update simulation on tick
    simulation
        .nodes(allNodes)
        .on('tick', () => {
            link.attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });

    // Set links for simulation
    simulation.force('link').links(links);

    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = d.x;
        d.fy = d.y;
    }
});
