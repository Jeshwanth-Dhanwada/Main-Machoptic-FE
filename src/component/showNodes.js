/* eslint-disable import/no-anonymous-default-export */
import Dagre from "@dagrejs/dagre";
import React, { useCallback, useState, useEffect,useRef } from "react";
import EdgeEditPopup from "./EdgeEditor.js";
import RoutePopup from "./Route.js";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
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
import { BASE_URL } from "../constants/apiConstants.js";
import BasicTabs from "./tabs.js";
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

const proOptions = { hideAttribution: true };
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

const HomeComponent = ({selectedNodess, setSelectedNodes}) => {
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


  let computeNodeList = []
  // fetching Node data from database -----------
  
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeMaster`;

    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        let x = [];
        for (let index = 0; index < response.data.length; index++) {
          const data = response.data[index];
          x.push({
            nodeId: data.nodeId,
            // id: getId(),
            id:data.id,
            data: { label: data.nodeName },
            nodeType:data.nodeType,
            nodeCategory: data.nodeCategory,
            unit1Measurable: data.unit1Measurable,
            unit2Mandatory:data.unit2Mandatory,
            itemDescription:data.itemDescription,
            sourcePosition: data.sourcePosition,
            targetPosition: data.targetPosition,
            position: { x: data.xPosition, y: data.yPosition },
            style: {
              background: data.fillColor, // Set background color
              color: "#000", // Set text color
              borderColor: data.borderColor,
              borderStyle: data.borderStyle,
              borderWidth: data.borderWidth,
              fontSize: data.FontSize, // Set the font size
              fontStyle: data.FontStyle, // Set the font style
              width: data.width,
              height: data.height,
              borderRadius: data.borderRadius,
              display: data.borderRadius ? 'flex' : 'flex',
              alignItems: 'center',
              justifyContent: 'center', /* Horizontally center */
              fontColor:data.FontColor,
            },
          });
        }
        setNodes(x);
        // console.log(x)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    //   const APIUrl = `${BASE_URL}/api/edgeMaster`;

    // axios
    //   .get(APIUrl)
    //   .then((response) => {
    //     // if(response.status === 201){
    //     setData(response.data);
    //     let x = [];
    //     for (let index = 0; index < response.data.length; index++) {
    //       const data = response.data[index];
    //       console.log("&&&&&&&&&",data)
    //       x.push({
    //         edgeId:data.edgeId,
    //         id: data.id,
    //         branchId:'1001',
    //         source: data.sourceNodeId,
    //         target: data.targetNodeId,
    //         sourceId:data.sourceNodeId,
    //         targetId:data.targetNodeId,
    //         type: data.edgeStyle,
    //         animated: data.animation,
    //         label: data.label,
    //         style: { strokeWidth: data.edgeThickness, stroke: data.edgeColor },
    //         markerEnd: {
    //           type: MarkerType.ArrowClosed,
    //           width: 25,
    //           height: 25,
    //           color: "#000",
    //           arrow: data.arrow,
    //         },
    //       });
    //     }
    //     setEdges(x);
    //     console.log(x,"Edges ----------------")
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
  }, [setNodes]);

  const [dataFromChild, setDataFromChild] = useState();
  const [route, setRoute] = useState();
  

  const handleChildClick = (data,routeid) => {
    setDataFromChild(data);
    console.log(data)
    setEdges(data)
    var routedata = {routeid}
    setRoute(routedata)
    setShowEdges(true);
  };

  //Add Edge connection logic ----------------------

  console.log(route)
  const onConnect = useCallback(
    (params) => {
      if (route && route.routeid) {
        const newEdge = {
          ...params,
          id: uuidv4(),
          edgeId: undefined,
          routeId: route.routeid,
          type: "smoothstep",
          label: "label",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 25,
            height: 25,
            color: "#000",
            arrow: true,
          },
          style: { strokeWidth: 1, stroke: "#000" },
          animated: false,
        };
        console.log("new edge", newEdge);
        setEdges((edges) => addEdge(newEdge, edges));
      } else {
        // Handle the case when route.id is not present (e.g., show an error message)
        console.log("Cannot connect edges: route.id is not present.");
      }
    },
    [route, setEdges]
  );


  // Add Node --------------------------------------

  const onAddNode = useCallback(() => {
    const selectedNode = nodes.find((node) => node.selected);
    if (!selectedNode) {
        const newNode = {
          id: uuidv4(),
          nodeType:'',
          nodeCategory:'',
          unit1Measurable:'',
          unit2Mandatory:'',
          itemDescription:'',
          height:'100px',
          width:'40px',
          position:{
            x: 0, // Generate a random x-coordinate within a reasonable range
            y: 0, // Generate a random y-coordinate within a reasonable range
          },
          data: {
            label: `Node ${getId()}`,
          },
          sourcePosition: 'right',
          targetPosition:'left',
          type:'Ellipse Node',
          style: {
            background: 'white', // Set background color
            color: 'black',     // Set text color
            borderColor: '#000',
            borderStyle: 'solid',
            borderWidth: '1px',
            fontSize: '14px', // Set the font size
            fontStyle: 'normal', // Set the font style
            width:'150px',
            height:'40px',
            borderRadius:'',
            display:'flex',
            justifyContent: 'center', /* Horizontally center */
            alignItems:'center',/* Vertically center */
          },
        };
      setNewNode(newNode)
      // computeNodeList.push(newNode)
      addNodes(newNode);
      console.log(newNode,'new node')
      // console.log(nodes,'new node')
    }
    else{
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
          id: uuidv4(),
          nodeType:'',
          nodeCategory:'',
          unit1Measurable:'',
          unit2Mandatory:'',
          itemDescription:'',
          // nodeId:NodegetId(),
          position: { x: finalX, y: finalY },
          sourcePosition: 'bottom',
          targetPosition: 'top',
          data: {
            label: `Node ${getId()}`,
          },
          style: {
            background: 'white', // Set background color
            color: 'black',     // Set text color
            borderColor: '#000',
            borderStyle: 'solid',
            borderWidth: '1px',
            fontSize: '14px', // Set the font size
            fontStyle: 'normal', // Set the font style
            width:'150px',
            height:'40px',
            borderRadius:'',
            display:'flex',
            justifyContent: 'center', /* Horizontally center */
            alignItems:'center'/* Vertically center */
          },
        };
        setNewNode(newNode)
        computeNodeList.push(newNode)
        addNodes(newNode);
        setEdges((prevEdges) => [...prevEdges]);
      }
      else{
        const newNode = {
          id: uuidv4(),
          nodeType:'',
          nodeCategory:'',
          unit1Measurable:'',
          unit2Mandatory:'',
          itemDescription:'',
          // nodeId:NodegetId(),
          position: { x: finalX, y: finalY },
          sourcePosition: 'right',
          targetPosition: 'left',
          data: {
            label: `Node ${getId()}`,
          },
          style: {
            background: 'white', // Set background color
            color: 'black',     // Set text color
            borderColor: '#000',
            borderStyle: 'solid',
            borderWidth: '1px',
            fontSize: '14px', // Set the font size
            fontStyle: 'normal', // Set the font style
            width:'150px',
            height:'40px',
            borderRadius:'',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
          },
        };
        setNewNode(newNode)
        computeNodeList.push(newNode)
        addNodes(newNode);
        setEdges((prevEdges) => [...prevEdges]);
      }
    }
  }, [addNodes, computeNodeList, initialNodes, nodes, setEdges]);

  // Delete Node -------------------------------

  const deleteEdges = useCallback(() => {
    const selectedEdge = edges.find((edge) => edge.selected);
    // const selectedEdge = edges.find((edge) => edge.selected)
    if (!selectedEdge ) {
      // Display an alert or notification to the user
      alert("Please select a Edge to delete.");
      return;
    }

    axios
      .delete(`${BASE_URL}/api/edgeMaster/${selectedEdge.edgeId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        // alert("Node deleted successfully")
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });

    const selectedEdgeIds = new Set();
    edges.forEach((edge) => {
      if (edge.selected) {
        selectedEdgeIds.add(edge.id);
      }
    });
    const filteredEdges = edges.filter((edge) => !selectedEdgeIds.has(edge.id));
    setEdges(filteredEdges);
  }, [edges, setEdges]);

  // const deletenodes = useCallback(() => {
  //   // setConsecutiveAddCounter(0);
  //   const selectedNode = nodes.find((node) => node.selected);
  //   // const selectedEdge = edges.find((edge) => edge.selected)
  //   if (!selectedNode ) {
  //     // Display an alert or notification to the user
  //     alert("Please select a Node to delete.");
  //     return;
  //   }

  //   // Make an Axios DELETE request to delete the selected node by its ID
  //   axios
  //     .delete(`${BASE_URL}/api/nodeMaster/${selectedNode.nodeId}`)
  //     .then((response) => {
  //       console.log("Node deleted successfully", response.data);
  //       const apiUrl = `${BASE_URL}/api/nodeMaster`;

  //         axios
  //           .get(apiUrl)
  //           .then((response) => {
  //             setData(response.data);
  //             // console.log(response.data, "getting");
  //             // Reverse the data array
  //             // const reversedData = response.data.reverse();
  //             // console.log(reversedData)
  //             let x = [];
  //             for (let index = 0; index < response.data.length; index++) {
  //               const data = response.data[index];
  //               x.push({
  //                 nodeId: data.nodeId,
  //                 id: data.id,
  //                 nodeType:data.nodeType,
  //                 nodeCategory: data.nodeCategory,
  //                 data: { label: data.nodeName },
  //                 sourcePosition: data.sourcePosition,
  //                 targetPosition: data.targetPosition,
  //                 position: { x: data.xPosition, y: data.yPosition },
  //                 style: {
  //                   background: data.fillColor, // Set background color
  //                   color: "#000", // Set text color
  //                   borderColor: data.borderColor,
  //                   borderStyle: data.borderStyle,
  //                   borderWidth: data.borderWidth,
  //                   fontSize: data.FontSize, // Set the font size
  //                   fontStyle: data.FontStyle, // Set the font style
  //                   width: data.width,
  //                   height: data.height,
  //                   borderRadius: data.borderRadius,
  //                   display: data.borderRadius ? 'flex' : '',
  //                   alignItems: 'center',
  //                   fontColor:data.FontColor
  //                 },
  //               });
  //             }
  //             setNodes(x);
  //           })
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting node:", error);
  //     });

  //   const selectedNodeIds = new Set();
  //   const selectedEdgeIds = new Set();
  //   nodes.forEach((node) => {
  //     if (node.selected) {
  //       selectedNodeIds.add(node.id);
  //       // Collect descendant nodes by traversing edges
  //       edges.forEach((edge) => {
  //         if (edge.source === node.id) {
  //           selectedNodeIds.add(edge.target);
  //         }
  //       });
  //     }
  //   });

  //   // Collect edges connected to the selected nodes
  //   edges.forEach((edge) => {
  //     if (
  //       selectedNodeIds.has(edge.source) ||
  //       selectedNodeIds.has(edge.target)
  //     ) {
  //       selectedEdgeIds.add(edge.id);
  //     }
  //   });

  //   const filteredNodes = nodes.filter((node) => !selectedNodeIds.has(node.id));
  //   console.log(filteredNodes);
  //   // const filteredEdges = edges.filter((edge) => !selectedEdgeIds.has(edge.id));

  //   setNodes(filteredNodes);
  //   // setEdges(filteredEdges);
  // }, [nodes, edges]);


  const deletenodes = useCallback(() => {
    // setConsecutiveAddCounter(0);
    const selectedNode = nodes.find((node) => node.selected);
  
    if (!selectedNode) {
      // Display an alert or notification to the user
      alert("Please select a Node to delete.");
      return;
    }
  
    // Make an Axios DELETE request to delete the selected node by its ID
    axios
      .delete(`${BASE_URL}/api/nodeMaster/${selectedNode.nodeId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
  
        // Collect the IDs of edges connected to the deleted node
        const edgeIdsToDelete = edges
          .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
          .map((edge) => edge.edgeId);
  
        // Make DELETE requests to delete the connected edges
        edgeIdsToDelete.forEach((edgeId) => {
          console.log(edgeId,"%%%%%%%%%%%%%%%%");
          axios
            .delete(`${BASE_URL}/api/edgeMaster/${edgeId}`)
            .then((response) => {
              console.log("Edge deleted successfully", response.data);
            })
            .catch((error) => {
              console.error("Error deleting edge:", error);
            });
        });
  
        // Continue with updating the nodes and edges in your state as you did in your original code.
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
        const filteredEdges = edges.filter((edge) => !selectedEdgeIds.has(edge.id));
  
        setNodes(filteredNodes);
        setEdges(filteredEdges);
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  }, [nodes, edges]);

  function deleteSelectedElements (){
    const selectedEdge = edges.find((edge) => edge.selected);
    const selectedNode = nodes.find((node) => node.selected);
    if(selectedEdge){
      deleteEdges()
    }else{
      deletenodes()
    }  
  }

  // const deleteSelectedElements = useCallback(() => {
  //   setConsecutiveAddCounter(0);
  //   const selectedNode = nodes.find((node) => node.selected);
  //   if (!selectedNode) {
  //     // Display an alert or notification to the user
  //     alert("Please select a node to delete.");
  //     return;
  //   }
  //   const selectedNodeIds = new Set();
  //   const selectedEdgeIds = new Set();
  //   nodes.forEach((node) => {
  //     if (node.selected) {
  //       selectedNodeIds.add(node.id);
  //       // Collect descendant nodes by traversing edges
  //       edges.forEach((edge) => {
  //         if (edge.source === node.id) {
  //           selectedNodeIds.add(edge.target);
  //         }
  //       });
  //     }
  //   });

  //   // Collect edges connected to the selected nodes
  //   edges.forEach((edge) => {
  //     if (
  //       selectedNodeIds.has(edge.source) ||
  //       selectedNodeIds.has(edge.target)
  //     ) {
  //       selectedEdgeIds.add(edge.id);
  //     }
  //   });

  //   const filteredNodes = nodes.filter((node) => !selectedNodeIds.has(node.id));
  //   console.log(filteredNodes);
  //   const filteredEdges = edges.filter((edge) => !selectedEdgeIds.has(edge.id));

  //   setNodes(filteredNodes);
  //   setEdges(filteredEdges);
  // }, [nodes, edges, setNodes, setEdges]);

  const [layoutDirection, setLayoutDirection] = useState("TB"); // Default to "TB" (top-bottom) layout
  const onLayout = useCallback(
    (direction) => {
      const newDirection = layoutDirection === "TB" ? "LR" : "TB"; // Toggle the layout direction
      const layouted = getLayoutedElements(nodes, edges, {
        direction: newDirection,
      });
      setLayoutDirection(newDirection);
      // const layouted = getLayoutedElements(nodes, edges, { direction });
      directionOn = direction;
      console.log(directionOn);

      // Set source and target positions based on the direction
      const updatedNodes = layouted.nodes.map((node) => ({
        ...node,
        sourcePosition: newDirection === "TB" ? "bottom" : "right",
        targetPosition: newDirection === "TB" ? "top" : "left",
      }));

      setNodes(updatedNodes);
      setEdges([...layouted.edges]);
      const fitViewOptions = { padding: 0.4 };
      window.requestAnimationFrame(() => {
        fitView(fitViewOptions);
      });
    },
    [layoutDirection, nodes, edges, setNodes, setEdges, fitView]
  );

  const [showPopup, setShowPopup] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showNodePopup, setNodeShowPopup] = useState(false);
  //Edit edge ------------

  const handleEditEdge = (edge) => {
    setSelectedEdgeForEdit(edge);
    console.log("******", edge);
    // Set the selected property of the node to true
    const updatedEdges = edges.map((e) => ({
      ...e,
      selected: e.id === edge.id,

      
    }));
    setNodes(updatedEdges);
    console.log("*******");
  };
  const handleEdgeSave = (editedEdge) => {
    const updatedEdges = edges.map((edge) =>
      edge.id === editedEdge.id ? editedEdge : edge
    );
    setNodes(updatedEdges);
    setSelectedEdgeForEdit(null);
  };

  const handleEdgeCancel = () => {
    setSelectedEdgeForEdit(null);
  };

  //Edit Node ------------

  const handleEditNode = (node) => {
    setSelectedNodeForEdit(node);
    console.log("******");
    // Set the selected property of the node to true
    const updatedNodes = nodes.map((n) => ({
      ...n,
      selected: n.id === node.id,
      // style: {
      //   backgroundColor: '#fffff',
      //   border: '2px solid ',
      // },
    }));
    setNodes(updatedNodes);
  };

  const handleNodeSave = (editedNode) => {
    const updatedNodes = nodes.map((node) =>
      node.id === editedNode.id ? editedNode : node
    );
    setNodes(updatedNodes);
    setSelectedNodeForEdit(null);
  };

  const handleNodeCancel = () => {
    setSelectedNodeForEdit(null);
  };
  // Edges Popup --------------------

  const generateJSONDataForNodes = (nodes) => {
    console.log( "no_of rows*********");
    const jsonDatadummy = {
      nodes: nodes.map((node) => ({
        nodeId:node.nodeId,
        id:node.id,
        branchId: "1001",
        nodeCategory: node.nodeCategory,
        unit1Measurable: node.unit1Measurable,
        unit2Mandatory:node.unit2Mandatory,
        itemDescription:node.itemDescription,
        nodeCategoryId: "203",
        nodeType:node.nodeType,
        nodeName: node.data.label,
        width: node.style.width,
        height:  node.style.height,
        borderRadius:  node.style.borderRadius,
        xPosition: node.position.x,
        yPosition: node.position.y,
        borderColor:  node.style.borderColor,
        borderWidth: node.style.borderWidth,
        borderStyle: node.style.borderStyle,
        fillColor: node.style.background,
        fillTransparency: "Fill Transparency Value",
        isRootNode: false,
        isParent: false,
        formula: "Formula Value",
        // inputMaterialId: "Input Material ID",
        // outputMaterialId: "Output Material ID",
        // inputMaterialUnitId: "Input Material Unit ID",
        // outputMaterialUnitId: "Output Material Unit ID",
        fuelUsed: "Fuel Used Value",
        fuelUnitsId: "Fuel Units ID",
        capacity: "Capacity Value",
        capacityUnitsId: "Capacity Units ID",
        sourcePosition: "right",
        targetPosition: "left",
        FontColor:node.style.color,
        FontStyle:node.style.fontStyle,
        FontSize:node.style.fontSize,
        userId:'1111'
      })),
    };
    console.log( jsonDatadummy
      , "no_of rows");
    return JSON.stringify(jsonDatadummy);
  };

  const generateJSONDataForEdges = (edges) => {
    // console.log(route.routeid,"routedata")
    const jsonData = {
      edges: edges.map((edge) => ({
        id:edge.id,
        branchId: "1001",
        edgeId:edge.edgeId,
        edgeDescription:"edgeDescription",
        routeId: route.routeid.toString(),
        sequenceId: "YourSequenceId",
        sourceNodeType:"sourceNodeType",
        targetNodeType:"targetNodeType",
        sourceId:edge.source,
        targetId:edge.target,
        unitsId:"unitsId",
        materialType: "Material Type",
        edgeStyle: edge.type,
        edgeColor: edge.style.stroke,
        edgeThickness: edge.style.strokeWidth,
        animation: false,
        arrow: false,
        label:edge.label,
        userId:"1111",
        sourceNodeId:"1",
        targetNodeId:"1"
      })),
    };
    return JSON.stringify(jsonData); // Use null and 2 for pretty formatting
  };

  const handleSaveNode = () => {
    // Generate JSON data for nodes
    const nodesData = generateJSONDataForNodes(nodes);
    console.log("nodes data...",nodesData[-1])

    // Send the parsedNodesData to the database via an API
    axios
      .put(`${BASE_URL}/api/nodeMaster/bulk/`, nodesData, {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      })
      .then((response) => {
        if(response.status === 201){
          const apiUrl = `${BASE_URL}/api/nodeMaster`;

          axios
            .get(apiUrl)
            .then((response) => {
              setData(response.data);
              // console.log(response.data, "getting");
              // Reverse the data array
              // const reversedData = response.data.reverse();
              // console.log(reversedData)
              let x = [];
              for (let index = 0; index < response.data.length; index++) {
                const data = response.data[index];
                x.push({
                  nodeId: data.nodeId,
                  id: data.id,
                  nodeType:data.nodeType,
                  nodeCategory:data.nodeCategory,
                  unit1Measurable: data.unit1Measurable,
                  unit2Mandatory:data.unit2Mandatory,
                  itemDescription:data.itemDescription,
                  data: { label: data.nodeName },
                  sourcePosition: data.sourcePosition,
                  targetPosition: data.targetPosition,
                  position: { x: data.xPosition, y: data.yPosition },
                  style: {
                    background: data.fillColor, // Set background color
                    color: "#000", // Set text color
                    borderColor: data.borderColor,
                    borderStyle: data.borderStyle,
                    borderWidth: data.borderWidth,
                    fontSize: data.FontSize, // Set the font size
                    fontStyle: data.FontStyle, // Set the font style
                    width: data.width,
                    height: data.height,
                    borderRadius: data.borderRadius,
                    display:'flex',
                    alignItems: 'center',
                    fontColor:data.FontColor,

                  },
                });
              }
              setNodes(x);
            })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
            }
            console.log("Data saved successfully", response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        alert("Error in saving")
        // Handle the error, e.g., show an error message to the user
      });
  };

  const handleEdge = (routeid) => {
    const EdgesData = generateJSONDataForEdges(edges);
    console.log(EdgesData,"edgesdata")
    // Send the parsedNodesData to the database via an API
    axios
      .put(`${BASE_URL}/api/edgeMaster/bulk`, EdgesData, {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        }
      })
      //  console.log("Incoming")
      .then((response) => {
        console.log(edges)
        // if(response.status === 201){
        //   const apiUrl = `${BASE_URL}/api/edgeMaster?${routeid}`;
        //   axios
        //     .get(apiUrl)
        //     .then((response) => {
        //       setData(response.data);
        //       let x = [];
        //       for (let index = 0; index < response.data.length; index++) {
        //         const dataa = response.data[index];
        //         console.log(dataa)
        //         x.push({
        //           edgeId:parseInt(dataa.edgeId),
        //           id: dataa.id,
        //           branchId:'1001',
        //           routeId:dataa.routeId,
        //           source: dataa.sourceId,
        //           target: dataa.targetId,
        //           sourceId:dataa.sourceId,
        //           targetId:dataa.targetId,
        //           type: dataa.edgeStyle,
        //           animated: dataa.animation,
        //           label: dataa.label,
        //           style: { strokeWidth: dataa.edgeThickness, stroke: dataa.edgeColor },
        //           markerEnd: {
        //             type: MarkerType.ArrowClosed,
        //             width: 25,
        //             height: 25,
        //             color: "#000",
        //             arrow: dataa.arrow,
        //           },
        //         });
        //       }
        //       console.log("******:", x);
        //       setEdges(x);
        //     })
        //     .catch((error) => {
        //       console.error("Error fetching data:", error);
        //     });
        //   }
        })
      .catch((error) => {
        console.error("Error saving data:", error);
        });

  }
  
  const handleEdgesandNodes = () => {
    handleEdge()
    handleSaveNode()
    toast.success(
      <span>
        <strong>Saved</strong>Successfully.
      </span>
    );
  }

  const onEdgeContextMenu = (event, edge) => {
    event.preventDefault(); // Prevent the default context menu
    setSelectedEdge(edge);
    console.log("data from child component")
    setShowPopup(true);
    setNodeShowPopup(false);
  };

  const onClosePopup = () => {
    setShowPopup(false);
    setSelectedEdge(null);
  };

  const onSavePopup = (edge) => {
    const updatedEdges = edges.map((existingEdge) =>
      existingEdge.id === edge.id ? { ...existingEdge, ...edge } : existingEdge
    );
    setEdges(updatedEdges);
    onClosePopup();
  };
  // Nodes popup -----

  const onNodeContextMenu = (event, node) => {
    event.preventDefault(); // Prevent the default context menu
    setSelectedNodes(node);
    setNodeShowPopup(true);
    setShowPopup(false);
    setSelectedNodeId(node.id);
  }
  
  const onCloseNodePopup = () => {
    setNodeShowPopup(false);
    setSelectedNodes(null);
    setSelectedNodeId("")
  };

  const onSaveNodePopup = (node) => {
    const updateNodes = nodes.map(existingNode =>
        existingNode.id === node.id ? { ...existingNode, ...node } : existingNode
    )
    setNodes(updateNodes)
    console.log('Saving node:', node);
    onCloseNodePopup();
  };

  // Route popup ----------
  const [showRoutePopup, setShowRoutePopup] = useState(false);

  const handleRouteClick = () => {
    setShowRoutePopup(true);
  };

  const onCloseRoute = () => {
    setShowRoutePopup(false);
  };

  const onSaveRoute = () => {
    onCloseRoute();
  };

  // to set edges edges to be shown are not ---------

  const [showEdges, setShowEdges] = useState(route); // State to control edges visibility
  
  // Function to toggle edges visibility
  const toggleEdgesVisibility = () => {
    setShowEdges(!showEdges);
    // setRadioChecked(!radioChecked);
  };
  // const toggleEMployeeMapping = () => {
  //   setShowEdges(!showEdges)
  // }

  // Fetching Employee the data from the database

  const [Employeesdata, setEmployees] = useState()
  const [droppedData, setDroppedData] = useState();

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/employee`;
    axios.get(apiUrl)
      .then((response) => {
        setEmployees(response.data)
        console.log(response.data)  
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const dragStarted = (e, empId, empName) => {
    e.dataTransfer.setData("empId",empId)
    e.dataTransfer.setData("empName", empName)
    console.log( empId,empName);
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/shift`;
    axios.get(apiUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }  

  const reactFlowWrapper = useRef(null);
  const draggingOver = (event) =>{
    event.preventDefault();
    console.log("Dragging Over now");

    
  }

  const [PopupEmp, setEmpPopup] = useState(false)
  const dragDropped = (event) => {
    event.preventDefault(); // Allows the drop
    let dataTransferedData = event.dataTransfer.getData('empId'); // Use the same data type as set in dragStarted
    let dataTransfered = event.dataTransfer.getData('empName'); // Use the same data type as set in dragStarted
    setDroppedData({ empId: dataTransferedData, empName: dataTransfered })
    // Show the popup after setting the dropped data
    // setEmpPopup(true)

    
  }
  console.log(droppedData)
  const [shift, setShift] = useState(""); // State for the selected Shift
  const [startDate, setStartDate] = useState(""); // State for the Start Date

  const handleShiftChange = (e) => {
    setShift(e.target.value);
  };

  // Handle Start Date input
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleNewRowSubmit = () => {
    // Prepare the data payload to send to the API
  const newDataPayload = {
      branchId: "1001",
      empId: droppedData.empId,
      nodeId: '1',
      startDate: startDate, // Use the Start Date state
      expiryDate: startDate,
      isActive: true,
      shiftId: shift // Use the selected Shift state
    };
    
    console.log(newDataPayload)

    axios.post(`${BASE_URL}/api/employeeNodeMapping`,newDataPayload)
      .then((response) => {
        console.log('New row added successfully', response.data);
        // Add the new row to the data array
        setData([...data, response.data]);
        // Clear the new row form and deactivate the popup
        setStartDate(""); // Reset Start Date state
        setShift(""); // Reset Shift state
        setEmpPopup(false); // Close the popup
      })
      .catch((error) => {
        console.error('Error adding new row:', error);
      });
  };

  const [selectedNodeId, setSelectedNodeId] = useState(false); // New state for selected node ID
  const onNodeClick = useCallback((event, node) => {
    // Update the selected node ID when a node is clicked
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
  }, [selectedNodeId, setSelectedNodeId]);

  const getNodeStyle = useCallback((node) => {
    // Dynamically update the node's style based on whether it's selected
    const isSelected = node.id === selectedNodeId;
    console.log(node.id,"isSelected");
    console.log(selectedNodeId,"isSelected");
    return {
      ...node.style,
      borderWidth: isSelected ? '2px' : node.style.borderWidth,
      borderColor: isSelected ? '' : node.style.borderColor,
    };
  }, [selectedNodeId]);
  
  

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: sidebarCollapsed ? "100%" : "100%",
          transition: "width 0.1s",
          zIndex: 1,
        }}
      >
        <div 
            style={{ height: 565, width: "100%", overflow: "hidden" }} 
            ref={reactFlowWrapper}
            onDragOver={(e)=>draggingOver(e)} 
            onDrop={(e)=>dragDropped(e)} 
            >
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              style: getNodeStyle(node), // Apply the updated style
            }))}
            onNodeClick={onNodeClick}
            elements={droppedData}
            // edges={showEdges ? edges : []}
            proOptions={proOptions} // reactflow watermark remove
            edges={edges}
            onEdgeContextMenu={onEdgeContextMenu}
            onNodeContextMenu={onNodeContextMenu}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onElementClick={() => {}}
            // onNodeMouseEnter={(event, node) =>
            //   console.log({ name: 'onNodeMouseEnter', event, node })
            // }
            // onNodeMouseLeave={(event, node) =>
            //   console.log({ name: 'onNodeMouseLeave', event, node })
            // }
            fitView
            fitViewOptions={{ padding: 3, duration: 1000 }}
            style={{ width: "100%", height: "100%" }}
            connectionLineStyle={connectionLineStyle}
          >
            {/* Render nodes with draggable attributes */}
            {/* {nodes.map((node) => (
              <div
                key={node.id}
                data-nodeid={node.id}
                draggable
                onDragOver={(e) => draggingOver(e)}
                onDrop={() => dropOnNode(node.id)}
              >
                {node.data.label}
              </div>
            ))} */}
            <Panel position="top-left">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "fixed",
                  // left: 0,
                  top: 80,
                }}
              >
                {/* <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => (
                    <Tooltip {...props}>Toggle Layout</Tooltip>
                  )}
                  placement="left"
                >
                  <Button style={{ width: "50px",background:'#09587c' }} onClick={onLayout}>
                    {layoutDirection === "TB" ? (
                      <FaRulerHorizontal />
                    ) : (
                      <FaRulerVertical />
                    )}
                  </Button>
                </OverlayTrigger> */}
                {/* Other components */}
                <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => <Tooltip {...props}>Add Node</Tooltip>}
                  placement="left"
                >
                  <Button
                    style={{ width: "50px",background:'#09587c' }}
                    className="mt-2"
                    variant="primary"
                    onClick={onAddNode}
                  >
                    <FaPlus />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => <Tooltip {...props}>Delete Node</Tooltip>}
                  placement="left"
                >
                  <Button
                    style={{ width: "50px" }}
                    className="mt-2"
                    variant="danger"
                    onClick={deleteSelectedElements}
                    // onClick={() => handleButtonDelete(edge.id)}
                  >
                    {" "}
                    <FaTrash />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => <Tooltip {...props}>Save</Tooltip>}
                  placement="left"
                >
                  <Button
                    style={{ width: "50px",background:'#09587c' }}
                    className="mt-2"
                    variant="primary"
                    onClick={handleEdgesandNodes}
                  >
                    {" "}
                    <FaSave />
                  </Button>
                </OverlayTrigger>
                {/* <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => <Tooltip {...props}>Help</Tooltip>}
                  placement="left"
                >
                  <Button
                    style={{ width: "50px",background:'#09587c' }}
                    className="mt-2"
                    variant="primary"
                  >
                    {" "}
                    <BsQuestionCircleFill />
                  </Button>
                </OverlayTrigger> */}
              </div>
              <div>
                <div style={{  position: "fixed", top: '216px', right: '15px' }}>
                  {nodes.map((node) => (
                    <div key={node.id} className="node">
                      {node.selected && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "5px",
                            marginRight: "-5px",
                          }}
                        >
                          <OverlayTrigger
                            delay={{ hide: 450, show: 300 }}
                            overlay={(props) => (
                              <Tooltip {...props}>Update Node</Tooltip>
                            )}
                            placement="left"
                          >
                            <Button
                              className="edit-button mt-2"
                              variant="primary"
                              // size="sm"
                              style={{ width: "50px",background:'#09587c' }}
                              onClick={() => handleEditNode(node)}
                            >
                              <FaEdit></FaEdit>
                            </Button>
                          </OverlayTrigger>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", top: 165, right: 0 }}>
                  {edges.map((edge) => (
                    <div key={edge.id} className="edge">
                      {/* <div>{node.data.label}</div> */}
                      {/* Edit button */}
                      {/* {edge.selected && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "5px",
                            marginRight: "-5px",
                          }}
                        >
                          <OverlayTrigger
                            delay={{ hide: 450, show: 300 }}
                            overlay={(props) => (
                              <Tooltip {...props}>Update Edge</Tooltip>
                            )}
                            placement="left"
                          >
                            <Button
                              className="edit-button mt-2"
                              variant="primary"
                              // size="sm"
                              style={{ width: "50px" }}
                              onClick={() => handleEditEdge(edge)}
                            >
                              <FaEdit></FaEdit>
                            </Button>
                          </OverlayTrigger>
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", top: -22, right: -10 }}>
                  {selectedNodeForEdit && (
                    <NodeEditor
                      node={selectedNodeForEdit}
                      onCancel={handleNodeCancel}
                      onSave={handleNodeSave}
                    />
                  )}
                  {selectedEdgeForEdit && (
                    <EdgeEditPopup
                      // edge = {selectedEdgeForEdit}
                      onCancel={handleEdgeCancel}
                      onSave={handleEdgeSave}
                    />
                  )}
                </div>
              </div>
            </Panel>
            {/* <Panel style={{position:'absolute',top:'-12px'}}>
              <div className="hello" style={{ backgroundColor: "whitesmoke" }}>
                <div className="dropdown">
                  <button
                    className="btn btn-primary"
                    type="button"
                    id="dropdownMenuButton"
                    style={{background:'#09587c'}}
                    // setShowRoutePopup(true)
                    onClick={handleRouteClick}
                  >
                    Route
                  </button>
                </div>
              </div>
            </Panel> */}
            {/* <Controls /> */}
            {/* <Background variant="lines" /> */}
          </ReactFlow>
          {/* {showNodePopup && (
            <NodesPopup
              node={selectedNodess}
              onClose={onCloseNodePopup}
              onSave={onSaveNodePopup}
            />
          )} */}
          {selectedNodess && showNodePopup && (
            <BasicTabs
              node={selectedNodess}
              // onClose={onCloseNodePopup}
              // onSave={onSaveNodePopup}
            />
          )}
          {showPopup && (
            <EdgePopup
              edge={selectedEdge}
              onClose={onClosePopup}
              onSave={onSavePopup}
            />
          )}
          {showRoutePopup && (
            <RoutePopup 
              onCancel={onCloseRoute} 
              onSave={onSaveRoute} 
              // dataFromChild={dataFromChild}
              onClick={handleChildClick}
              />
          )}
          {PopupEmp && (
            <div className="popup"
              style={{
                  border:'1px solid black',
                  position:'absolute',
                  top:'220px',
                  left:'300px',
                  backgroundColor:'whitesmoke'
                }}  
            >
            <table border={'1px'} cellPadding={'5px'}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Start Date</th>
                  <th>ShiftId</th>
                  {/* <th>Shift</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{textAlign:'center'}}>{droppedData.empId}</td>
                  <td>{droppedData.empName}</td>
                  <td>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </td>
                  <td>
                  
                    <select
                    
                      value={shift}
                      onChange={handleShiftChange}
                    >
                      {data.map((item, index) => (
                      <option key={index} value={item.shiftId}>{item.shiftId}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="p-1">
                <button className="btn btn-success" onClick={handleNewRowSubmit}><FaCheck/></button>&nbsp;&nbsp;
                <button className="btn btn-danger" onClick={() => setEmpPopup(false)}><FaXmark/></button>
            </div>
            </div>
          )}
          <ToastContainer/>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
