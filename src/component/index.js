import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNodeSelect from './customNodeSelect';

const initialEdges = [
    { id: 'hidden-e1-2', source: 'hidden-1', target: 'hidden-2' },
    { id: 'hidden-e1-3', source: 'hidden-1', target: 'hidden-3' },
    { id: 'hidden-e3-4', source: 'hidden-3', target: 'hidden-4' },
    { id: 'hidden-e3-5', source: 'hidden-3', target: 'hidden-5' },
    { id: 'hidden-e3-6', source: 'hidden-3', target: 'hidden-6' },
    { id: 'hidden-e3-7', source: 'hidden-4', target: 'hidden-7' },
    { id: 'hidden-e3-8', source: 'hidden-4', target: 'hidden-8' },
];


let initialNodes = [];

const nodeTypes = { selectorNode: CustomNodeSelect};

const CollapseNodes = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    let nodesToHide = [];
    let edgesToHide = [];
    const getChildNodes = (nodeId) => {
        const childNodes = edges.filter(a => a.source === nodeId).map(x => x.target);
        if (childNodes.length) {
            for (let i = 0; i < childNodes.length; i++) {
                nodesToHide.push(childNodes[i])
                getChildNodes(childNodes[i])
            }
        }
    }

    const collapseNodes = (nodeId) => {
        nodesToHide = [];
        edgesToHide = [];
        getChildNodes(nodeId)
        setNodes((nodes) => nodes.map(a => {
            if (nodesToHide.includes(a.id)) a.hidden = true;
            return a;
        }))
        setEdges((edges) => edges.map((edge) => {
            if (nodesToHide.includes(edge.target)) edge.hidden = true
            return edge;
        }))
    }

    const expandNode = (nodeId) => {
        const childNodes = edges.filter(a => a.source === nodeId).map(s => s.target);
        setNodes((nodes) => nodes.map(a => {
            if (childNodes.includes(a.id)) a.hidden = false;
            return a;
        })
        )
        setEdges((edges) => edges.map((edge) => {
            if (childNodes.includes(edge.target)) edge.hidden = false;
            return edge;
        }))
    }

    const onDoubbleClick = (data) => {
        const childrens = edges.filter(a => a.source === data.id && !a.hidden).map(x => x.target);
        const isNotCollapsed = childrens.length ? childrens.every(a => nodes.some(s => s.id === a)) : false
        if (isNotCollapsed) collapseNodes(data.id)
        else expandNode(data.id)
    }

    useEffect(() => {
        initialNodes = [
            {
                id: 'hidden-1',
                type: 'input',
                data: { id: "hidden-1", label: 'Node 1', onDoubbleClick: (data) => onDoubbleClick(data, nodes) },
                position: { x: 250, y: 5 },
                type: 'selectorNode',
            },
            { id: 'hidden-2', data: { id: "hidden-2", label: 'Node 2', onDoubbleClick: onDoubbleClick }, position: { x: 100, y: 100 }, type: 'selectorNode', },
            { id: 'hidden-3', data: { id: "hidden-3", label: 'Node 3', onDoubbleClick: onDoubbleClick }, position: { x: 400, y: 100 }, type: 'selectorNode', },
            { id: 'hidden-4', data: { id: "hidden-4", label: 'Node 4', onDoubbleClick: onDoubbleClick }, position: { x: 400, y: 200 }, type: 'selectorNode', },
            { id: 'hidden-5', data: { id: "hidden-5", label: 'Node 5', onDoubbleClick: onDoubbleClick }, position: { x: 450, y: 200 }, type: 'selectorNode', },
            { id: 'hidden-6', data: { id: "hidden-6", label: 'Node 6', onDoubbleClick: onDoubbleClick }, position: { x: 420, y: 150 }, type: 'selectorNode', },
            { id: 'hidden-7', data: { id: "hidden-7", label: 'Node 7', onDoubbleClick: onDoubbleClick }, position: { x: 500, y: 180 }, type: 'selectorNode', },
            { id: 'hidden-8', data: { id: "hidden-8", label: 'Node 8', onDoubbleClick: onDoubbleClick }, position: { x: 530, y: 200 }, type: 'selectorNode', }
        ];
        setNodes(initialNodes)
        setEdges((eds) => eds.map(a => a));
    }, [])

    useEffect(() => {
        setNodes((nodes) =>
            nodes.map(node => {
                node.data.onDoubbleClick = onDoubbleClick
                return node;
            }))
    }, [edges])

    const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

    return (
        <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    );
};

export default CollapseNodes;
