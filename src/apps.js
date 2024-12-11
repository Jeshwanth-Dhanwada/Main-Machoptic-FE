/* eslint-disable import/no-anonymous-default-export */
import Dagre from "@dagrejs/dagre";
import React, { useCallback, useState } from "react";
// import { BsQuestionCircleFill } from "react-icons/bs";
// import DepartmentForm from "./component/department.js";
import Section from "./component/section.js"
import Shift from "./component/shift.js";
import Material from "./component/material.js";
import EmployeeType from "./component/EmployeeType.js";
import Branch from "./component/branch.js";
import MaterialCategory from "./component/materailcategory.js";
import MaterialType from "./component/materialType.js";
import Canvas from "./component/canvas.js";
import Edge from "./component/edge.js";
import Node from "./component/Node.js";
import NodeState from "./component/NodeState.js";
import Units from "./component/units.js";
import RadioButtonGroup from "./component/radiobutton.js";
import NodesComponent from "./component/nodes.js";
import JobAssign from "./component/JobAssign.js";
import NodeTypeForm from "./component/NodeType.js";
import ActivityUpdateForm from "./component/activityUpdate.js";
import RoutePopup from "./component/Route.js";
import ShowNodes from "./component/showNodes.js";
import ShowRoute from "./component/showRoutes.js";
import FGmapping from "./component/FGMapping.js";
import NodeAllocation from "./component/nodeAllocation.js";
import RouteMapping from "./component/routeItemMapping.js";
import BatchUpdate from "./component/batch.js";

import ReactFlow, {
  ReactFlowProvider,
  // Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  // Controls,
  // Background,
  MiniMap,
  addEdge,
  MarkerType
} from "reactflow";
import DepartmentForm from "./component/department.js"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Department from "./component/department";
import Employee from"./component/Employees";
import Navbar from "./component/Nav.js"
import HomeComponent from "./component/homeComponent.js"
// import department from "./component/department.js"
// import MiniMapNode from './MiniMapNode.js';

import { initialNodes, initialEdges } from "./nodes-edges.js";
import "reactflow/dist/style.css";
import Sidebar from "./component/sidebar.js";
// import CustomNode from './component/customnode.js'
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebars from "./component/sidebar.js";

// import { initialNodes, initialEdges } from './nodes-edges.js';
// import { Tooltip as BsTooltip } from "bootstrap"
let directionOn = ''

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

// Convert the array to JSON format


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
// let nodeId = 0;
const getId = () => {
  const newId = id;
  id += 1; // Increment by 1
  return `${newId}`;
};
const LayoutFlow = () => {
  const { fitView, addNodes } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const onConnect = useCallback((params) => 
  //       setEdges((edge) => 
  //       addEdge(params, edge, type:"smoothstep")), 
  //       [setEdges]);





  // Add Node --------------------------------------
  
  const [consecutiveAddCounter, setConsecutiveAddCounter] = useState(0);
  const onAddNode = useCallback(() => {
    const selectedNode = nodes.find((node) => node.selected);
    
    if (!selectedNode) {
      setConsecutiveAddCounter((prevCount) => prevCount + 1);

        if (consecutiveAddCounter >= 1) {
            // Show an alert when adding nodes consecutively for the second time
            alert("Please select a node before adding a new one.");
        }else {
          const newNode = {
            id: getId(),
            position: { x: 0, y: 0 },
            data: {
              label: `Node ${id}`,
            },
            sourcePosition: 'right',
            targetPosition:'left',
            style: {
              background: 'white', // Set background color
              color: 'black',     // Set text color
              borderColor: '#000',
              borderStyle: 'solid',
              borderWidth: '1px',
              fontSize: '14', // Set the font size
              fontStyle: 'normal', // Set the font style
              width:'150',
              height:'45',
              justifycontent: 'center', /* Horizontally center */
              alignitems:'center'/* Vertically center */
            },
          };
          const newEdge = {
            id: `${newNode.id}`,
            source: 'left',
            target: '',
            type: "smoothstep",
            animated: false,
            label:'New Label',
            style: { strokeWidth: 1,
              stroke: '#000' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 25,
              height: 25,
              color: '#000',
              arrow: true
            },
          };
    
        addNodes(newNode,newEdge,setEdges);
        console.log(newNode,'new node')
        console.log(nodes,'new node')
        }
    }
     else{
      setConsecutiveAddCounter(0);
      const xOffset = 200; // Initial x-offset
      const yOffset = 0; // Initial y-offset
      const offsetIncrement = 50; // Increase in offset for each new node

      const existingNodesAtPosition = (x, y) =>
        nodes.some((node) => node.position.x === x && node.position.y === y);

      const calculatePosition = (x, y, offset) => {
        while (existingNodesAtPosition(x, y)) {
          x += offset;
          y += offset;
        }
        return { x, y };
        
      };
      
      console.log("something",initialNodes);

      // If a node is selected, add the new node and create a connection
      const newX = selectedNode.position.x + xOffset;
      const newY = selectedNode.position.y + yOffset;

      const { x: finalX, y: finalY } = calculatePosition(
        newX,
        newY,
        offsetIncrement
      );
      if(directionOn === 'TB'){
        const newNode = {
          id: getId(),
          position: { x: finalX, y: finalY },
          sourcePosition: 'bottom',
          targetPosition: 'top',
          data: {
            label: `Node ${id}`,
          },
          style: {
            background: 'white', // Set background color
            color: 'black',     // Set text color
            borderColor: '#000',
            borderStyle: 'solid',
            borderWidth: '1px',
            fontSize: '14', // Set the font size
            fontStyle: 'normal', // Set the font style
            width:'150',
            height:'45',
            justifycontent: 'center', /* Horizontally center */
            alignitems:'center'/* Vertically center */
          },
        };
        const newEdge = {
          id: `${newNode.id}-edge`,
          source: selectedNode.id,
          target: newNode.id,
          type: "smoothstep",
          animated: false,
          label:'New Label',
          style: { strokeWidth: 1,
            stroke: '#000' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 25,
              height: 25,
              color: '#000',
              arrow: true
            },
        };
        addNodes(newNode);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
      }
      else{
        const newNode = {
          id: getId(),
          position: { x: finalX, y: finalY },
          sourcePosition: 'right',
          targetPosition: 'left',
          data: {
            label: `Node ${id}`,
          },
          style: {
            background: 'white', // Set background color
            color: 'black',     // Set text color
            borderColor: '#000',
            borderStyle: 'solid',
            borderWidth: '1px',
            fontSize: '14', // Set the font size
            fontStyle: 'normal', // Set the font style
            width:'150',
            height:'45'
          },
        };
        const newEdge = {
          id: `${newNode.id}-edge`,
          source: selectedNode.id,
          target: newNode.id,
          type: "smoothstep",
          animated: false,
          label:'New Label',
          style: { strokeWidth: 1,
            stroke: '#000' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 25,
              height: 25,
              color: '#000',
              arrow: true
            },
        };
        addNodes(newNode);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
      }
    }
    
  }, [addNodes, consecutiveAddCounter, nodes, setEdges]);

  


  // Delete Node -------------------------------

  const deleteSelectedElements = useCallback(() => {
    setConsecutiveAddCounter(0);
    const selectedNode = nodes.find((node) => node.selected);
    if (!selectedNode) {
      // Display an alert or notification to the user
      alert("Please select a node to delete.");
      return;
    }
    const selectedNodeIds = new Set();
    const selectedEdgeIds = new Set();
    nodes.forEach((node) => {
      if (node.selected) {
        selectedNodeIds.add(node.id);
        // Collect descendant nodes by traversing edges
        edges.forEach((edge) => {
          if (edge.source === node.id) {
            selectedNodeIds.add(edge.target);
          }
        });
      }
    });

    // Collect edges connected to the selected nodes
    edges.forEach((edge) => {
      if (
        selectedNodeIds.has(edge.source) ||
        selectedNodeIds.has(edge.target)
      ) {
        selectedEdgeIds.add(edge.id);
      }
    });

    const filteredNodes = nodes.filter((node) => !selectedNodeIds.has(node.id));
    console.log(filteredNodes);
    const filteredEdges = edges.filter((edge) => !selectedEdgeIds.has(edge.id));

    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [nodes, edges, setNodes, setEdges]);


 
  
  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState);
    // console.log(sidebarCollapsed);
  };

  

  const generateJSONData = (nodes, edges) => {
    const jsonData = {
      nodes: nodes.map(node => ({
        id: node.id,
        sourcePosition:node.sourcePosition,
        targetPosition:node.targetPosition,
        label: node.data.label,
        position: node.position,
        style:node.style
       
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        label: edge.label,
        animated: edge.animated,
        style: { strokeWidth: 1, stroke: '#000' },
        mark:edge.markerEnd


      })),
    };
    return JSON.stringify(jsonData, null, 2); // Use null and 2 for pretty formatting
  };

  const [activePage, setActivePage] = useState('');

  // const handleLinkClick = (pageName) => {
  //   setActivePage(pageName);
  //   console.log(pageName)
  // };
  
  return (
    
    <Router>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: sidebarCollapsed ? "5%" : "20%",
            transition: "width 0.1s",
            zIndex: 2,
            overflow: "hidden",
          }}
        >
          <Sidebar 
                onSidebarClick={toggleSidebar}
                setActivePage={setActivePage}
                />
        </div>
        <div
          style={{
            width: sidebarCollapsed ? "95%" : "80%",
            transition: "width 0.1s",
            zIndex: 1,
          }}
        >
          <Navbar activePage={activePage}/>
          {/* <HomeComponent /> */}
          <Routes>
            <Route path="/department" element={<DepartmentForm />} />
            <Route path="/Employees" element={<Employee/>} />
            <Route path="/" element={<HomeComponent />} />
            <Route path="/section" element={<Section/>}/>
            <Route path="/shift" element={<Shift/>} />
            <Route path="/material" element={<Material/>} />
            <Route path="/EmployeeType" element={<EmployeeType/>} />
            <Route path="/branch" element={<Branch/>} />
            <Route path="/materailcategory" element={<MaterialCategory/>} />
            <Route path="/materialType" element={<MaterialType/>} />
            <Route exact path="/homeComponent" element={<HomeComponent/>} />
            <Route path="/edge" element={<Edge/>} />
            <Route path="/Node" element={<Node/>} />
            <Route path="/NodeState" element={<NodeState/>} />
            <Route path="/units" element={<Units/>} />
            <Route path="/nodes" element={<NodesComponent/>} />
            <Route path="/JobAssign" element={<JobAssign/>} />
            <Route path="/NodeType" element={<NodeTypeForm/>} />
            <Route path="/activityUpdate" element={<ActivityUpdateForm/>} />
            <Route path="/Route" element={<RoutePopup/>} />
            <Route path="/showNodes" element={<ShowNodes/>} />
            <Route path="/showRoutes" element={<ShowRoute/>} />
            <Route path="/FGMapping" element={<FGmapping/>} />
            <Route path="/nodeAllocation" element={<NodeAllocation/>} />
            <Route path="/routeItemMapping" element={<RouteMapping/>} />
            <Route path="/batch" element={<BatchUpdate/>} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default function () {
  return (
    
    <ReactFlowProvider>
      
      {/* <MiniMap
        nodeColor={nodeColor}
        nodeStrokeWidth={3}
        // nodeComponent={MiniMapNode}
        zoomable
        pannable
      /> */}
      <LayoutFlow>
      
      </LayoutFlow>
      
    </ReactFlowProvider>
  );
}
