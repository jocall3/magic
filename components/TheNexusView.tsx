// components/views/platform/TheNexusView.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import type { NexusGraphData, NexusNode, NexusLink } from '../../../types';

declare const d3: any;

const TheNexusView: React.FC = () => {
    const context = useContext(DataContext);
    const [graphData, setGraphData] = useState<NexusGraphData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (context) {
            // Simulate fetching and processing data
            setTimeout(() => {
                setGraphData(context.getNexusData());
                setIsLoading(false);
            }, 1000);
        }
    }, [context]);

    if (!context) {
        return <div>Loading context...</div>;
    }

    if (isLoading) {
        // FIX: The Card component requires a 'children' prop. Added an empty fragment
        // to satisfy the type requirement during the loading state. The skeleton loader
        // is displayed via the `isLoading` prop and does not use the children.
        return <Card title="The Nexus" isLoading={true}><></></Card>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">The Nexus</h2>
            <Card title="Map of Emergent Relationships" subtitle="This is a living visualization of the connections between your financial activities.">
                {graphData ? <NexusGraph data={graphData} /> : <div>No data to display.</div>}
            </Card>
        </div>
    );
};

const NexusGraph: React.FC<{ data: NexusGraphData }> = ({ data }) => {
    const ref = useRef<SVGSVGElement>(null);
    const [selectedNode, setSelectedNode] = useState<NexusNode | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous render

        const width = ref.current.parentElement?.clientWidth || 800;
        const height = 600;

        svg.attr('viewBox', [0, 0, width, height]);

        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke-width", 2);

        const node = svg.append("g")
            .selectAll("g")
            .data(data.nodes)
            .join("g")
            .attr("class", "cursor-pointer")
            .call(drag(simulation))
            .on("click", (event: any, d: any) => {
                setSelectedNode(d);
            });
            
        node.append("circle")
            .attr("r", (d: any) => d.value)
            .attr("fill", (d: any) => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);
            
        node.append("text")
            .attr("x", (d: any) => d.value + 5)
            .attr("y", "0.31em")
            .text((d: any) => d.label)
            .attr("fill", "#e5e7eb")
            .attr("font-size", "12px")
            .attr("paint-order", "stroke")
            .attr("stroke", "#111827")
            .attr("stroke-width", "3px");

        function ticked() {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        }

        function drag(simulation: any) {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
            return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        }

    }, [data]);

    return (
        <div className="relative">
            <svg ref={ref} width="100%" height="600"></svg>
            {selectedNode && (
                <div className="absolute top-2 right-2 bg-gray-900/70 backdrop-blur-sm p-4 rounded-lg border border-gray-700 max-w-xs text-sm">
                    <h4 className="font-bold text-cyan-300">{selectedNode.label}</h4>
                    <p className="text-gray-300">Type: {selectedNode.type}</p>
                    <p className="text-gray-300">Connections:</p>
                    <ul className="list-disc list-inside text-gray-400">
                        {data.links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                        .map(l => {
                            const otherNodeId = typeof l.source === 'object' ? (l.source as any).id === selectedNode.id ? (l.target as any).id : (l.source as any).id : l.source === selectedNode.id ? l.target : l.source;
                            const otherNode = data.nodes.find(n => n.id === otherNodeId);
                            return <li key={`${l.source}-${l.target}`}>{l.relationship} {otherNode?.label}</li>
                        })}
                    </ul>
                     <button onClick={() => setSelectedNode(null)} className="text-xs text-gray-500 mt-2 hover:underline">Close</button>
                </div>
            )}
        </div>
    );
};

export default TheNexusView;