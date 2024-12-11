/* eslint-disable import/no-anonymous-default-export */
import Dagre from "@dagrejs/dagre";
import React, { useCallback, useState, useEffect, useRef } from "react";
import EdgeEditPopup from "./EdgeEditor.js";
import RoutePopup from "./Route.js";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ReactFlow, {
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
    // Controls,
    Background,
    addEdge,
    MarkerType,
} from "reactflow";

import NodesPopup from "./NodePopup";
import EdgePopup from "./edgePopup";
// import department from "./component/department.js"
// import MiniMapNode from './MiniMapNode.js';

// import { initialEdges } from "../nodes-edges.js";
import "reactflow/dist/style.css";
// import CustomNode from './component/customnode.js'
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "react-bootstrap/Tooltip";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { v4 as uuidv4 } from 'uuid';
import {
    FaPlus,
    FaTrash,
    FaRulerVertical,
    FaRulerHorizontal,
    FaEdit,
    FaSave,
    FaCheck,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

import NodeEditor from "./NodeEditor.js";
// import { initialNodes, initialEdges } from './nodes-edges.js';
// import { Tooltip as BsTooltip } from "bootstrap"
let directionOn = "";

const connectionLineStyle = { stroke: "black" };
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));


const getLayoutedElements = (nodes, edges, options, direction) => {
    // const isHorizontal = direction === "LR";
    // g.setGraph({ rankdir: direction });
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) => g.setNode(node.id, node));

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const { x, y } = g.node(node.id);
            return { ...node, position: { x, y } };
        }),
        edges,
    };
};

// const nodeColor = (node) => {
//   switch (node.type) {
//     case "input":
//       return "#6ede87";
//     case "output":
//       return "#6865A5";
//     default:
//       return "#ff0072";
//   }
// };

let id = 1;
const getId = () => {
    const newId = id;
    id += 1; // Increment by 1
    console.log(id)
    return `${newId}`;
};



let newEdgeID = 1;
const getEdgeID = () => {
    const NewEdge = newEdgeID;
    newEdgeID += 1; // Increment by 1
    return `${NewEdge}`;
};

const DashboardComponent = () => {
    const { fitView, addNodes } = useReactFlow();
    const [selectedNodeForEdit, setSelectedNodeForEdit] = useState(null);
    const [selectedEdgeForEdit, setSelectedEdgeForEdit] = useState(null);
    const [sidebarCollapsed] = useState(false);
    const [data, setData] = useState([]);
    // const [Edgedata, setEdgeData] = useState([]);
    const [initialNodes] = useState([]);
    const [initialEdges] = useState([])
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [newNode, setNewNode] = useState(null);
    // const [EdgeConnection, onConnect] = useState([])





    return (
        <div style={{ display: "flex" }}>
            <div style={{ width: sidebarCollapsed ? "100%" : "100%", transition: "width 0.1s", zIndex: 1, }}>
                <div>
                    <ReactFlow>
                        {/* <Controls /> */}
                        <Background variant="lines" />
                    </ReactFlow>
                    <div >
                    {/* <iframe title="Report Section" width="1050" height="550px" src="https://app.powerbi.com/view?r=eyJrIjoiNTVhMmJhMzUtMDQ5NS00Mzc4LTk3NjMtZWUxZDBmY2YyMjM5IiwidCI6IjhhMTc1MDNjLTNlMjUtNGY5Ni05YTMxLWE0N2FjZGZkZTRjMiIsImMiOjEwfQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe> */}
                    <iframe title="Report Section" width="1050" height="550px" src="https://app.powerbi.com/view?r=eyJrIjoiMWRhZmNiNjMtOGQ2NS00MjJiLWIwNDYtY2EzMGJhY2IwNmM3IiwidCI6IjhhMTc1MDNjLTNlMjUtNGY5Ni05YTMxLWE0N2FjZGZkZTRjMiIsImMiOjEwfQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe>
                    </div>
                    <ToastContainer />
                </div>
            </div>
            
        </div>
    );
};

export default DashboardComponent;
