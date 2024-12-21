/* eslint-disable import/no-anonymous-default-export */
import Dagre from "@dagrejs/dagre";
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
  useContext,
} from "react";
import EdgeEditPopup from "./EdgeEditor.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Backdrop, Card } from "@mui/material";
import { BsPlusLg } from "react-icons/bs";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  getEmployees,
  getItemmaster,
  getOADetails,
  getDeviceMapping,
  getJobAssign,
  getShifts,
  getNodeMaster,
  getNodeAllocation,
  getbatch_master,
  getbatches,
  getEdges,
  getActivities,
} from "../api/shovelDetails.js";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { NODE_WIDTH, NODE_HEIGHT } from "../constants/chartlConstants.js";
import iconNode from "./nodeTypes/iconNode.js";
import graphNode from "./nodeTypes/graphNode.js";
import MachineNode from "./nodeTypes/MachineNode.js";
import MachinegraphNode from "./nodeTypes/MachinegraphNode.js";
import customNodeSelect from "./nodeTypes/customNodeSelect.js";
import ConfirmModal from "./commonComponents/confirmModal.js";
import Employees from "./rigtPanel/employees.js";
import AuthContext from "../context/AuthProvider.js";
import CircularProgress from "@mui/material/CircularProgress";
import ReactFlow, {
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
} from "reactflow";
import "./sidebar.css";
import { BASE_URL } from "../constants/apiConstants.js";
import BasicTabs from "./tabs.js";
import RightOperationTabPanel from "./rigtPanel/rightOperationPanel.js";
import "reactflow/dist/style.css";
import Button from "@mui/material/Button";
import debounce from "lodash.debounce";

import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { v4 as uuidv4 } from "uuid";
import { FaSave, FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import NodeEditor from "./NodeEditor.js";
import RightTabPanel from "./rigtPanel/panelTabs.js";
import DevicePanel from "./rigtPanel/devicePanel.js";
import Priorityjobspanel from "./rigtPanel/Priority_jobspanel.js";
import RightSlider from "../layout/RightSlider.js";
import { RiDeleteBinLine } from "react-icons/ri";
import RoutePopup from "./Route.js";
import FGmapping from "./FGMapping.js";

// Import for dialogue popup to confirm user
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import NodeTypeModal from "./nodeTypeModal.js";


import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import FullScreenModal from "./FullScreenModal.js";
import { createNodeData } from "../utils/convertToNodes.js";
import { IoInformationCircleOutline } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";


function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

let directionOn = "";

const connectionLineStyle = { stroke: "black" };
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
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
  return `${newId}`;
};

const proOptions = { hideAttribution: true };

const AdministrationShowRoutes = ({
  selectedNodes,
  setSelectedNodes,
  selectedEdge,
  setSelectedEdge,
  edgeData,
  nodeData,
  selectedMenuItem,
  showPopup,
  setShowPopup,
  showNodePopup,
  setNodeShowPopup,
  setRoutedatafromEdge,
  EdgefromEdgeComp,
  setEdgefromEdgeComp,
  selectedId,
  onClick,
  bottomtosidepanel,
  senddatatoNodes,
  sendtoPlanningtab,
  setSendtoPlanningtab,
  toRightOperationTabPanel,
  setJobfromOperations,
  setjobIdtoJobpriority,
  setMultiplejobIdtoJobpriority,
  setdataToBottomJobPriorPanel,
  sendtoRoutes,
  setSelectedId,
}) => {
  const { fitView, addNodes } = useReactFlow();
  const [selectedNodeForEdit, setSelectedNodeForEdit] = useState(null);
  const [showGraph, setshowGraph] = useState(false);
  const [selectedEdgeForEdit, setSelectedEdgeForEdit] = useState(null);
  const [sidebarCollapsed] = useState(false);
  const [data, setData] = useState([]);
  // const [Edgedata, setEdgeData] = useState([]);
  const [initialNodes] = useState([]);
  const [initialEdges] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes || nodeData
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges || edgeData
  );
  const [OpenLoader, setOpenLoader] = useState(false);
  const [newNode, setNewNode] = useState(null);
  const [StaffAllocation, setStaffAllocation] = useState([]);
  const [DeviceMapping, setDeviceMapping] = useState([]);
  const [JobMapping, setJobMapping] = useState([]);
  const [Devicenode, setDevicenode] = useState([]);
  const [shiftdata, setShiftdata] = useState([]);
  const [sendtoRoutess, setSendtoRoutes] = useState({ sendtoRoutes });
  // Ramesh added state variables
  const [ConfirmUserToReplace, setConfirmUserToReplace] = useState(false);
  const [YesToReplace, setYesToReplace] = useState(false);
  const [NodeDeviceID, setNodeDeviceID] = useState([]);
  const [DeviceAllocationID, setDeviceAllocationID] = useState([]);

  let computeNodeList = [];
  // fetching Node data from database -----------
  const { auth } = useContext(AuthContext);
  const inputRef = useRef(null);

  useEffect(() => {
    let resizeObserverEntries = [];
    const debouncedResizeHandler = debounce((entries) => {
      try {
        resizeObserverEntries = entries;
        // Your resize handling logic here
      } catch (err) {
        console.error("ResizeObserver error: ", err);
      }
    }, 100); // Adjust the debounce delay as needed

    const observer = new ResizeObserver(debouncedResizeHandler);

    if (inputRef.current) observer.observe(inputRef.current);

    return () => {
      resizeObserverEntries.forEach((entry) => entry.target.remove());
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setSendtoRoutes(sendtoRoutes);
  }, [sendtoRoutes]);

  useEffect(() => {
    const updatedEdges = edges.map((existingEdge) =>
      existingEdge.id === edgeData.id
        ? { ...existingEdge, ...edgeData }
        : existingEdge
    );
    const updatedNodes = nodes.map((existingNode) =>
      existingNode.id === nodeData.id
        ? { ...existingNode, ...nodeData }
        : existingNode
    );
    setEdges(updatedEdges);
    setNodes(updatedNodes);
  }, [edgeData, nodeData]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    setOpenLoader(true);
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        let filter = []
        filter = response.data
                  .filter((item)=> (
                                    item.nodeType !== 'job' &&
                                    item.nodeType !== 'employee' &&
                                    item.nodeType !== 'device' 
                                  ))
        const x = createNodeData(filter)
        setNodes(x);
        setOpenLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [setNodes]);

  function getNodedata(){
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);

        let filter = []
        filter = response.data
                  .filter((item)=> (item.nodeType !== 'job' &&
                    item.nodeType !== 'employee' &&
                    item.nodeType !== 'device' 
                                  ))
        const x = createNodeData(filter)
        setNodes(x);
        setOpenLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const [dataFromChild, setDataFromChild] = useState();
  const [route, setRoute] = useState([]);

  const handleChildClick = (data, routeid) => {
    setDataFromChild(data);
    setEdges(data);
    var routedata = { routeid };
    setRoute(routedata);
    setRoutedatafromEdge(routedata);
    setShowEdges(true);
    setNodeShowPopup(false);
  };


  // Add Node --------------------------------------

  const [nodeType, setNodeType] = useState();
  const [triggered, setTriggered] = useState(false); // Flag to control the effect
  const [isModalOpen, setIsModalOpen] = useState(false);
  const HandleNodeType = (item) => {
    console.log(item, "NodeType");
    setNodeType(item);
  };

  
  const onAddNode = useCallback(
    (NodeType) => {
      resetTrigger();
      setNodeType();
      // const onAddNode = (NodeType) => {
      // if (NodeType === 'NodeType') {
      //   setIsModalOpen(true); // Open the modal if NodeType matches 'NodeType'
      // }
      const selectedNode = nodes.find((node) => node.selected);
      if (!selectedNode) {
        const newNode = {
          id: uuidv4(),
          nodeType: "",
          MachineType: "",
          nodeCategory: "",
          unit1Measurable: "",
          parentNode: "",
          extent: "",
          type: "",
          unit2Mandatory: "",
          iconId: "",
          itemDescription: "",
          nodeImage: "",
          percentage_rejects: "",
          height: "60px",
          width: "250px",
          position: {
            x: 200, // Generate a random x-coordinate within a reasonable range
            y: 0, // Generate a random y-coordinate within a reasonable range
          },
          data: {
            label: `Node ${getId()}`,
          },
          date:getDate(),
          sourcePosition: "right",
          targetPosition: "left",
          style: {
            background: "white", // Set background color
            color: "black", // Set text color
            borderColor: "#000",
            borderStyle: "solid",
            borderWidth: "1px",
            fontSize: "14px", // Set the font size
            fontStyle: "normal", // Set the font style
            width: "150px",
            height: "40px",
            borderRadius: "50px",
            justifycontent: "center" /* Horizontally center */,
            alignitems: "center" /* Vertically center */,
          },
        };
        setNewNode(newNode);
        // computeNodeList.push(newNode)
        addNodes(newNode);
      } else {
        const xOffset = 400; // Initial x-offset
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

        // console.log("something", initialNodes);

        // If a node is selected, add the new node and create a connection
        const newX = selectedNode.position.x + xOffset;
        const newY = selectedNode.position.y + yOffset;

        const { x: finalX, y: finalY } = calculatePosition(
          newX,
          newY,
          offsetIncrement
        );
        if (directionOn === "TB") {
          const newNode = {
            id: uuidv4(),
            nodeType: "",
            MachineType: "",
            nodeCategory: "",
            unit1Measurable: "",
            parentNode: "",
            extent: "",
            type: "",
            unit2Mandatory: "",
            iconId: "",
            itemDescription: "",
            nodeImage: "",
            percentage_rejects: "",
            // nodeId:NodegetId(),
            position: { x: finalX, y: finalY },
            sourcePosition: "right",
            targetPosition: "left",
            data: {
              label: `Node ${getId()}`,
            },
            style: {
              background: "white", // Set background color
              color: "black", // Set text color
              borderColor: "#CECECE",
              borderStyle: "solid",
              borderWidth: "1px",
              fontSize: "14px", // Set the font size
              fontStyle: "normal", // Set the font style
              width: "250px",
              height: "60px",
              justifycontent: "center" /* Horizontally center */,
              alignitems: "center" /* Vertically center */,
            },
          };
          setNewNode(newNode);
          computeNodeList.push(newNode);
          addNodes(newNode);
          setEdges((prevEdges) => [...prevEdges]);
        } else {
          const newNode = {
            id: uuidv4(),
            nodeType: "",
            MachineType: "",
            nodeCategory: "",
            unit1Measurable: "",
            parentNode: "",
            extent: "",
            type: "",
            unit2Mandatory: "",
            iconId: "",
            itemDescription: "",
            nodeImage: "",
            percentage_rejects: "",
            // nodeId:NodegetId(),
            position: { x: finalX, y: finalY },
            sourcePosition: "right",
            targetPosition: "left",
            data: {
              label: `Node ${getId()}`,
            },
            date:getDate(),
            style: {
              background: "white", // Set background color
              color: "black", // Set text color
              borderColor: "#000",
              borderStyle: "solid",
              borderWidth: "1px",
              fontSize: "14px", // Set the font size
              fontStyle: "normal", // Set the font style
              width: "150px",
              height: "40px",
              borderRadius: "50px",
              justifycontent: "center" /* Horizontally center */,
              alignitems: "center" /* Vertically center */,
            },
          };
          setNewNode(newNode);
          computeNodeList.push(newNode);
          addNodes(newNode);
          setEdges((prevEdges) => [...prevEdges]);
        }
      }
    },
    [addNodes, computeNodeList, nodes, setEdges]
  );

  // useEffect(() => {
  //   // Call CreateNewNode when nodeType is set
  //   if ((nodeType === 'Machine' || nodeType === 'Material') && !triggered) {
  //     CreateNewNode();
  //     setTriggered(true); // Prevent it from triggering again
  //   }
  // },[nodeType, triggered])

  // Reset triggered flag if needed elsewhere
  const resetTrigger = () => {
    setTriggered(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  // Delete Node -------------------------------

  const deleteEdges = useCallback(() => {
    const selectedEdge = edges.find((edge) => edge.selected);
    // const selectedEdge = edges.find((edge) => edge.selected)
    if (!selectedEdge) {
      // Display an alert or notification to the user
      alert("Please select a Edge to delete.");
      return;
    }

    axios
      .delete(`${BASE_URL}/api/edgeMaster/${selectedEdge.edgeId}`)
      .then((response) => {
        console.log("Edges deleted successfully", response.data);
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

  const DeleteChildNodes = (Id,nodeId) => {
    const getId = Nodemasterdata
                          .filter((item) => String(item?.parentNode) === String(Id))
                          .map((item) => item.nodeId);
    const getEmpdata = empAllocation
                          .filter((item)=>parseInt(item.node.nodeId) === parseInt(nodeId))
                          .map((item1)=>item1.empnodemapId
                        );
    const getDevicedata = deviceAllocation
                          .filter((item)=>parseInt(item.nodeId) === parseInt(nodeId))
                          .map((item1)=>item1.Id
                        );

    if(getId.length>0){
      try{
        console.log(getId, "selectedNode");
        getId.forEach(element => {
          axios
          .delete(`${BASE_URL}/api/nodeMaster/${element}`)
          .then((response) => {
            console.log("Node deleted successfully", response.data);
            getNodedata()
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
          });
        });
      }
      catch{
        console.log("Error In deleting child nodes")
      }
    }
    if(getEmpdata.length>0){
      try{
        getEmpdata.forEach((element)=>{
          axios
          .delete(`${BASE_URL}/api/employeeNodeMapping/${element}`)
          .then((response) => {
            console.log("Node deleted successfully", response.data);
            getNodedata()
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
          });
        })
      }
      catch{
        console.log("Error while deleting the Employee node")
      }
    }
    if(getDevicedata.length>0){
      try{
        getDevicedata.forEach((element)=>{
          axios
          .delete(`${BASE_URL}/api/deviceMapping/${element}`)
          .then((response) => {
            console.log("Node deleted successfully", response.data);
            getNodedata()
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
          });
        })
      }
      catch {
        console.log("Error while deleting the Device Mapping")
      }
    }
  };

  const DeleteCorrespondingEdges = (id) =>{
    // Collect the IDs of edges connected to the deleted node
          const edgeIdsToDelete = edges
            .filter(
              (edge) =>
                edge?.source === id ||
                edge?.target === id
            )
            .map((edge) => edge?.edgeId);

          // Make DELETE requests to delete the connected edges
          edgeIdsToDelete.forEach((edgeId) => {
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
          // const selectedNodeIds = new Set();
          const selectedEdgeIds = new Set();
          // nodes.forEach((node) => {
          //   if (node.selected) {
          //     selectedNodeIds.add(node.id);
          //     // Collect descendant nodes by traversing edges
          //     edges.forEach((edge) => {
          //       if (edge.source === node.id) {
          //         selectedNodeIds.add(edge.target);
          //       }
          //     });
          //   }
          // });

          // Collect edges connected to the selected nodes
          // edges.forEach((edge) => {
          //   if (
          //     selectedNodeIds.has(edge?.source) ||
          //     selectedNodeIds.has(edge?.target)
          //   ) {
          //     selectedEdgeIds.add(edge?.id);
          //   }
          // });

          // const filteredNodes = nodes.filter(
          //   (node) => !selectedNodeIds.has(node?.id)
          // );
          const filteredEdges = edges.filter(
            (edge) => !selectedEdgeIds.has(edge?.id)
          );

          // setNodes(filteredNodes);
          setEdges(filteredEdges);
  }

  const deletenodes = useCallback(() => {
    setSelectedNodeId("")
    const selectedNode = nodes.find((node) => node.selected);
    if (!selectedNode) {
      alert("Please select a Node to delete.");
      return;
    }

    setNodes((prevNodes) => [
      ...prevNodes.filter((n) => n?.id !== selectedNode?.nodeId),
    ]);

    if (selectedNode?.nodeId === "undefined" && selectedNode?.id === "undefined") {
      console.error("Error: No edgeid provided");
      // return Promise.reject(new Error("No edgeid provided"));
    } else {
      try{
        if(selectedNode.id && selectedNode.nodeId){
          DeleteChildNodes(selectedNode?.id,selectedNode.nodeId);
        }
      }
      catch{
        console.log("No Id found")
      }
      
      DeleteCorrespondingEdges(selectedNode?.id)
      // Make an Axios DELETE request to delete the selected node by its ID
      axios
        .delete(`${BASE_URL}/api/nodeMaster/${selectedNode.nodeId}`)
        .then((response) => {
          getNodedata()
          console.log("Node deleted successfully", response.data);
          setDeletePopup(false)
          toast.error(
            <span>
              <strong>Deleted</strong> Successfully.
            </span>,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              className: "custom-toast",
            }
          );
        })
        .catch((error) => {
          console.error("Error deleting node:", error);
        });
    }
  }, [nodes, edges]);

  const [open,setDeletePopup] = useState(false)
  const [openUnselected,setOpenUnselected] = useState(false)
  const handleCloseDeletPopup = () => {
    setDeletePopup(false)
  }
  const handleCloseUnselectedPopup = () => {
    setOpenUnselected(false)
  }
  const HandleDeleteNodes = () => {
    const selectedNode = nodes.find((node) => node.selected);
    const selectedEdge = edges.find((edge) => edge.selected);
    if(selectedNode || selectedEdge){
      setDeletePopup(true)
    }
    else{
      setOpenUnselected(true)
    }
  }
  function deleteSelectedElements() {    
    const selectedEdge = edges.find((edge) => edge.selected);
    if (selectedEdge) {
      deleteEdges();
    } else {
      deletenodes();
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

      // Set source and target positions based on the direction
      const updatedNodes = layouted.nodes.map((node) => ({
        ...node,
        sourcePosition: newDirection === "TB" ? "right" : "left",
        targetPosition: newDirection === "TB" ? "right" : "left",
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
    // CreateImageNode(nodes)
    const jsonDatadummy = {
      nodes: nodes
        .filter(
          (item) =>
            item.nodeType !== "GraphNode" && item.nodeType !== "MachineNode"
        )
        .map((node) => ({
          nodeId: node.nodeId,
          id: node.id,
          branchId: auth.branchId.toString(),
          nodeCategory: node.nodeCategory,
          unit1Measurable: node.unit1Measurable,
          parentNode: node?.parentNode,
          extent: node.extent,
          type: node.type,
          unit2Mandatory: node.unit2Mandatory,
          iconId: node.iconId,
          itemDescription: node.itemDescription,
          nodeImage: node.nodeImage,
          percentage_rejects: node.percentage_rejects,
          nodeCategoryId: "203",
          nodeType: node.nodeType,
          nodeName: node.data.label,
          width: node.style.width,
          height: node.style.height,
          borderRadius: node.style.borderRadius,
          xPosition: node.position.x,
          yPosition: node.position.y,
          borderColor: node.style.borderColor,
          borderWidth: node.style.borderWidth,
          borderStyle: node.style.borderStyle,
          fillColor: node.style.background,
          fillTransparency: "Fill Transparency Value",
          isRootNode: false,
          isParent: false,
          formula: "Formula Value",
          fuelUsed: "Fuel Used Value",
          fuelUnitsId: "Fuel Units ID",
          capacity: "Capacity Value",
          capacityUnitsId: "Capacity Units ID",
          sourcePosition: node.sourcePosition,
          targetPosition: node.targetPosition,
          FontColor: node.style.color,
          FontStyle: node.style.fontStyle,
          FontSize: node.style.fontSize,
          userId: auth.empId.toString(),
          borderLeftWidth: node.style.borderLeftWidth, // Set left border width to 10px
          borderLeftColor: node.style.borderLeftColor, // Set left border color to red (you can change this to any color)
        })),
    };
    return JSON.stringify(jsonDatadummy);
  };


  const handleSaveNode = () => {
    const nodesData = generateJSONDataForNodes(nodes);
    axios
      .put(`${BASE_URL}/api/nodeMaster/bulk/`, nodesData, {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      })
      .then((response) => {
        if (response.status === 201) {
          const apiUrl = `${BASE_URL}/api/nodeMaster`;
          axios
            .get(apiUrl)
            .then((response) => {
              setData(response.data);
              let filter = []
              filter = response.data
                        .filter((item)=> (item.nodeType !== 'job' &&
                          item.nodeType !== 'employee' &&
                          item.nodeType !== 'device' 
                                        ))
              const x = createNodeData(filter)
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
      });
  };

  // find current date
  const getDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };


  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update the current time every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);


  const handleEdgesandNodes = (event) => {
    event.preventDefault();
    Promise.all([
      handleSaveNode(),
    ]).then(() => {
      toast.success(
        <span>
          <strong>Saved</strong> Successfully.
        </span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "custom-toast",
        }
      );
    });
  };

  const onEdgeContextMenu = (event, edge) => {
    event.preventDefault(); // Prevent the default context menu
    setSelectedEdge(edge);
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
    // onClosePopup();
  };
  // Nodes popup -----
  const [selectedNodeId, setSelectedNodeId] = useState(false); // New state for selected node ID
  const [selectedNodeIdtoNodeGrpah, setselectedNodeIdtoNodeGrpah] = useState(
    []
  ); // New state for selected node ID

  const [FullNodeDetails,setFullNodeDetails] = useState(false)
  const [FullNodeData,setFullNodeData] = useState()
  const onNodeContextMenu = (event, node) => {
    event.preventDefault(); // Prevent the default context menu
    setFullNodeData(node)
    setFullNodeDetails(true)
  };

  const HandleCloseFullScreen = () => {
    setFullNodeDetails(false)
  }

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNodes(node);
      setNodeShowPopup(true);
      setShowPopup(false);
      setShowRoutePopup(true);
      setSelectedNodeId(node.id);
      setselectedNodeIdtoNodeGrpah(node);
      // Update the selected node ID when a node is clicked
      // setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
    },
    [selectedNodeId, setNodeShowPopup, setSelectedNodes, setShowPopup]
  );

  const getNodeStyle = useCallback(
    (node) => {
      // Dynamically update the node's style based on whether it's selected
      const isSelected = node.id === selectedNodeId;
      senddatatoNodes(selectedNodeId);
      return {
        ...node.style,
        // borderWidth: isSelected ? "2px" : node?.style?.borderWidth,
        // borderColor: isSelected ? "" : node?.style?.borderColor,
        borderLeftWidth: isSelected ? node?.style?.borderLeftWidth : node?.style?.borderLeftWidth, // Set left border width to 10px
        borderLeftColor: isSelected ? node?.style?.borderLeftColor : node?.style?.borderLeftColor, // Set left border color to red (you can change this to any color)
      };
    },
    [selectedNodeId, senddatatoNodes]
  );

  const getEdgeStyle = useCallback(
    (edge) => {
      const isSelected = String(edge.id) === String(selectedId.edgeId);
      return {
        ...edge.style,
        // style: { strokeWidth: edge.edgeThickness, stroke: edge.edgeColor },
        stroke: isSelected ? "red" : "black",
        strokeWidth: isSelected ? "3px" : edge.style.edgeThickness,
      };
    },
    [selectedId]
  );

  const onCloseNodePopup = () => {
    setNodeShowPopup(false);
    setSelectedNodes(null);
    setSelectedNodeId("");
  };

  const onSaveNodePopup = (node) => {
    const updateNodes = nodes.map((existingNode) =>
      existingNode.id === node.id ? { ...existingNode, ...node } : existingNode
    );
    setNodes(updateNodes);
    onCloseNodePopup();
  };

  // Route popup ----------
  const [showRoutePopup, setShowRoutePopup] = useState(true);

  const onCloseRoute = () => {
    setShowRoutePopup(true);
    setNodeShowPopup(false);
  };

  const onSaveRoute = () => {
    onCloseRoute();
  };

  // to set edges edges to be shown are not ---------

  const [showEdges, setShowEdges] = useState(route); // State to control edges visibility


  // Fetching Employee the data from the database

  const [Employeesdata, setEmployees] = useState();
  const [droppedData, setDroppedData] = useState();

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/employee`;
    axios
      .get(apiUrl)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const reactFlowWrapper = useRef(null);
  const [PopupEmp, setEmpPopup] = useState(false);
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
      nodeId: "1",
      startDate: startDate, // Use the Start Date state
      expiryDate: startDate,
      isActive: true,
      shiftId: shift, // Use the selected Shift state
    };

    axios
      .post(`${BASE_URL}/api/employeeNodeMapping`, newDataPayload)
      .then((response) => {
        console.log("New row added successfully", response.data);
        // Add the new row to the data array
        setData([...data, response.data]);
        // Clear the new row form and deactivate the popup
        setStartDate(""); // Reset Start Date state
        setShift(""); // Reset Shift state
        setEmpPopup(false); // Close the popup
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    switch (bottomtosidepanel) {
      case "Staff Mapping":
        setValue(1); // Device Mapping tab
        break;
      case "Device Mapping":
        setValue(3); // Device Mapping tab
        break;
      case "Raw Material":
        setValue(2); // Device Mapping tab
        break;
      case "FG Mapping":
        setValue(4); // Device Mapping tab
        break;
      default:
        setValue(0); // Default to Nodes tab
    }
  }, [bottomtosidepanel]);

  // Define nodeTypes and edgeTypes outside the component

  const nodeTypes = useMemo(
    () => ({
      selectorNode: customNodeSelect,
      iconNode: iconNode,
      graphNode: graphNode,
      MachineNode: MachinegraphNode,
      MachineIcon: MachineNode,
    }),
    []
  );

  // useEffect(() => {

  // },[])

  const [Employeedata, setEmployeedata] = useState([]);
  const [Oadetails, setOadetails] = useState([]);
  const [ItemMaster, setItemMaster] = useState([]);
  const [Edgestabledata, setEdgestabledata] = useState([]);
  const [empAllocation, setempAllocation] = useState([]);
  const [NodeMapping, setNodeMapping] = useState([]);
  const [nodeAllocation, setNodeAllocation] = useState([]);
  const [deviceAllocation, setDeviceAllocation] = useState([]);
  const [jobAssignmentdata, setjobAssigndata] = useState([]);
  const [Activitydata, setActivitydata] = useState([]);
  const [batchdata, setbatchdata] = useState([]);
  const [batchMasterdata, setbatchMasterdata] = useState([]);
  const [Nodemasterdata, setNodemasterdata] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/employeeNodeMapping`;
    axios
      .get(apiUrl)
      .then((response) => {
        setempAllocation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const showgetEmployees = async (key) => {
    setOpenLoader(true);
    const responsedata = await getEmployees();
    setEmployeedata(responsedata, key);
    setOpenLoader(false);
  };
  const showshiftdata = async (key) => {
    const responsedata = await getShifts();
    setShiftdata(responsedata, key);
  };
  const showOA_details = async (key) => {
    const responsedata = await getOADetails();
    setOadetails(responsedata, key);
  };
  const showItemmaster = async (key) => {
    setOpenLoader(true);
    const responsedata = await getItemmaster();
    setItemMaster(responsedata, key);
    setOpenLoader(false);
  };
  const showDeviceMapping = async (key) => {
    const responsedata = await getDeviceMapping();
    setDeviceAllocation(responsedata, key);
  };
  const showJobAssignMapping = async (key) => {
    const responsedata = await getJobAssign();
    setjobAssigndata(responsedata, key);
  };

  const showNodeAllocation = async (key) => {
    const responsedata = await getNodeAllocation();
    setNodeAllocation(responsedata, key);
  };
  const showbatchdata = async (key) => {
    const responsedata = await getbatches();
    setbatchdata(responsedata, key);
  };
  const showbatchMasterdata = async (key) => {
    const responsedata = await getbatch_master();
    setbatchMasterdata(responsedata, key);
  };
  const showNodemasterdata = async (key) => {
    const responsedata = await getNodeMaster();
    setNodemasterdata(responsedata, key);
  };
  const showEdgedata = async (key) => {
    const responsedata = await getEdges();
    setEdgestabledata(responsedata, key);
  };
  const showActivitydata = async (key) => {
    const responsedata = await getActivities();
    setActivitydata(responsedata, key);
  };

  useEffect(() => {
    showgetEmployees();
    showOA_details();
    showItemmaster();
    showDeviceMapping();
    showJobAssignMapping();
    showshiftdata();
    showNodeAllocation();
    showbatchdata();
    showNodemasterdata();
    showEdgedata();
    showActivitydata();
    showbatchMasterdata();
  }, []);

  const [expanded, setExpanded] = useState(false);
  const handleExpandToggle = () => {
    setIsExpandedFull(true);
    setExpanded(!expanded);
    setSize(384);
  };
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [filteredEmps, setFilteredEmps] = useState([]);

  const DeleteDeviceNode = (nodeId) => {
    if (typeof nodeId[0] === "undefined") {
      console.error("BackendAlert: No nodeid provided");
      // return Promise.reject(new Error("No nodeid provided"));
    } else {
      axios
        .delete(`${BASE_URL}/api/nodeMaster/${nodeId}`)
        .then((response) => {})
        .catch((error) => {
          console.error("Error deleting node:", error);
        });
    }
  };

  const deleteNode = (nodeId) => {
    if (typeof nodeId[0] === "undefined") {
      console.error("BackendAlert: No nodeid provided");
      // return Promise.reject(new Error("No nodeid provided"));
    } else {
      axios.delete(`${BASE_URL}/api/nodeMaster/${nodeId}`).then((response) => {
        // console.log(response.data)
        const apiUrl = `${BASE_URL}/api/nodeMaster`;
        axios
          .get(apiUrl)
          .then((response) => {
            setData(response.data);
            let filter = []
              filter = response.data
                        .filter((item)=> (item.nodeType !== 'job' &&
                          item.nodeType !== 'employee' &&
                          item.nodeType !== 'device' 
                                        ))
            const x = createNodeData(filter)
            setNodes(x);
            console.log("nodes from API:", x);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
          });
      });
    }
  };

  function getEmpNameById(empId) {
    const emp = Employeedata.find((item) => item.empId === empId);
    return emp ? emp.employeeName : "Node Not Found";
  }

  const onIconDoubbleClick = (e, data) => {
    console.log(data);
    const employee = Employeedata.find((a) => a.empId === data.id);
    setFilteredEmps((emps) => [...emps, { ...employee }]);
  };
  const onNodeDoubleClick = useCallback(
    (event, node) => {
      console.log(node, "ondoubleclick");
      console.log(node.iconId, "ondoubleclick");
      const findEmp = empAllocation
        .filter((item) => item.emp.empId === node.iconId)
        .map((item) => item.empnodemapId);
      console.log(findEmp, "ondoubleclick");
      const finddevice = deviceAllocation
        .filter((item) => item.deviceId === node.iconId)
        .map((item) => item.Id);
      const findJob = jobAssignmentdata
        .filter((item) => item.jobId === node.iconId)
        .map((item) => item.id);
      const findNodeAllocation = nodeAllocation
        .filter((item) => item.empId === node.iconId)
        .map((item) => item.NodeAllocationId);
      console.log(findNodeAllocation);
      if (findEmp) {
        axios
          .delete(`${BASE_URL}/api/employeeNodeMapping/${findEmp}`)
          .then((response) => {
            if (node.nodeType === "employee") {
              deleteNode(node.nodeId);
            }
            console.log(
              "employeeNodeMapping deleted successfully",
              response.data
            );
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
          });
      }
      if (finddevice) {
        axios
          .delete(`${BASE_URL}/api/deviceMapping/${finddevice}`)
          .then((response) => {
            if (node.nodeType === "device") {
              deleteNode(node.nodeId);
            }
            console.log("DeviceMapping deleted successfully", response.data);
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
          });
      }
      if (findJob) {
        axios
          .delete(`${BASE_URL}/api/jobassign/${findJob}`)
          .then((response) => {
            if (node.nodeType === "job") {
              deleteNode(node.nodeId);
            }
            console.log("DeviceMapping deleted successfully", response.data);
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
          });
      }
      if (findNodeAllocation) {
        axios
          .delete(`${BASE_URL}/api/nodeAllocation/${findNodeAllocation}`)
          .then((response) => {
            if (node.nodeType === "employee") {
              deleteNode(node.nodeId);
            }
            console.log("DeviceMapping deleted successfully", response.data);
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
          });
      }
    },
    [deviceAllocation, empAllocation, jobAssignmentdata, nodeAllocation]
  );


  const DeleteDeviceAllocation = (deviceid) => {
    axios
      .delete(`${BASE_URL}/api/deviceMapping/${deviceid}`)
      .then((response) => {
        setDeviceAllocationID([]);
        setDeviceMapping(response.data);
        console.log("DeviceMapping deleted successfully", response.data);
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  };

  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const empData = JSON.parse(
      event.dataTransfer.getData("application/reactflow") || "{}"
    );
    const { x, y } = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const ParentnodeData = nodes.find(({ position }) => {
      const { x: parentX, y: parentY } = position;
      return (
        x >= parentX &&
        x <= parentX + NODE_WIDTH + 100 &&
        y >= parentY &&
        y <= parentY + NODE_HEIGHT
      );
    });

    if (ParentnodeData) {
      // Calculate the coordinates relative to the parent node
      const { x: parentX, y: parentY } = ParentnodeData.position;

      // Calculate the drop location within the parent node based on the mouse pointer's position relative to the parent node
      const dropX = x - parentX;
      const dropY = y - parentY;

      // Now you can use the dropX and dropY values to position the dropped item within the parent node
      // console.log("Item dropped within parent node at coordinates:", dropX, dropY);
    } else {
      console.log("No parent node found.");
    }

    if (ParentnodeData) {
      const exitemployee = nodes
        .filter((empl) => empl?.parentNode === ParentnodeData.id)
        .find((b) => String(b.iconId) === String(empData.empId));
      if (exitemployee) {
        toast.error(
          <span>
            <strong>Already Employe mapped!!</strong>.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        // alert("Already node mapped!!");
        return; // exit the function early
      }

      // console.log(ParentnodeData);
      const assignedUser = nodes.find((a) => a.parenId === ParentnodeData.id);
      // const jobAssigned = Oadetails.find()X & Y positions
      // console.log(assignedUser?.parenId,"assignedUser");
      // console.log(parentNode.id,"assignedUser");
      // if(assignedUser) {
      //   setShowAlert({empId:empData.empId, userName:empData.userName, parentId: parentNode.id, parentPos:{...parentNode.position},
      //     oldUserId:assignedUser.id, oldUserName:assignedUser.data.label, machineName:parentNode.data.label.split("(")[0]});
      // }
      // else {
      if (empData.empId && !empData.attendanceId) {
        const lastChildNode = nodes.filter(
          (node) =>
            node?.parentNode === ParentnodeData.id &&
            node.nodeType === "employee"
        );
        const childNodeCount = lastChildNode.length;
        const newY = childNodeCount > 0 ? -41 - childNodeCount * 20 : -41;
        console.log("newY:", newY);

        const empNode = {
          parenId: ParentnodeData.id,
          empId: empData.empId,
          nodedetails: ParentnodeData,
          id: uuidv4(), //empData.empId + "",
          position: { x: 0, y: newY },
          // position: { x: ParentnodeData.position.parentX + 5,
          //  y: -40 },
          nodeCategory: "",
          unit1Measurable: "",
          parentNode: ParentnodeData.id,
          extent: "parent",
          unit2Mandatory: "",
          itemDescription: "",
          nodeImage: "",
          percentage_rejects: "",
          nodeType: "employee",
          MachineType: "",
          type: "iconNode",
          sourcePosition: "right",
          targetPosition: "left",
          iconId: empData.empId.toString(),
          style: {
            zIndex: 1001,
            width: "20",
            height: "20",
            background: "",
            color: "",
            borderColor: "",
            borderStyle: "",
            borderWidth: "",
            fontSize: "",
            fontStyle: "",
            borderRadius: "",
            display: "",
            alignItems: "",
            fontColor: "",
          },
          data: {
            label: empData?.userName,
            onIconDoubbleClick: onIconDoubbleClick,
          },
        };

        setFilteredEmps((emps) =>
          emps.filter((a) => a.empId !== empData.empId)
        );
        // const node_EMployee =
        setStaffAllocation([...StaffAllocation, empNode]);
        setNodes((es) => es.concat(empNode));
      }
      // }
      if (empData.attendanceId && empData.empId) {
        const lastChildNode = nodes.find(
          (node) => node.parenId === ParentnodeData.id
        );
        const newY = lastChildNode
          ? lastChildNode.position.y + NODE_WIDTH - 80
          : -20;
        const empNodeMap = {
          parenId: ParentnodeData.id,
          empId: empData.empId,
          nodedetails: ParentnodeData,
          id: uuidv4(), //empData.empId + "",
          position: { x: 110, y: 20 },
          nodeCategory: "",
          unit1Measurable: "",
          parentNode: ParentnodeData.id,
          extent: "parent",
          unit2Mandatory: "",
          itemDescription: "",
          nodeImage: "",
          percentage_rejects: "",
          nodeType: "employee",
          MachineType: "",
          type: "iconNode",
          sourcePosition: "right",
          targetPosition: "left",
          iconId: empData.empId.toString(),
          style: {
            zIndex: 1001,
            width: "20",
            height: "20",
            background: "",
            color: "",
            borderColor: "",
            borderStyle: "",
            borderWidth: "",
            fontSize: "",
            fontStyle: "",
            borderRadius: "",
            display: "",
            alignItems: "",
            fontColor: "",
          },
          data: {
            label: getEmpNameById(empData.empId),
            onIconDoubbleClick: onIconDoubbleClick,
          },
        };
        console.log(empNodeMap, "********");
        setFilteredEmps((emps) =>
          emps.filter((a) => a.empId !== empData.empId)
        );
        setNodes((es) => es.concat(empNodeMap));
        // const node_EMployee =
        setNodeMapping([...NodeMapping, empNodeMap]);
      }
      const deviceNodes = nodes.filter(
        (empl) =>
          empl?.parentNode === ParentnodeData.id && empl.nodeType === "device"
      );
      const deviceID = nodes
        .filter(
          (empl) =>
            empl?.parentNode === ParentnodeData.id && empl.nodeType === "device"
        )
        .map((dev) => dev.nodeId);
      const deviceNodeid = nodes
        .filter(
          (empl) =>
            empl.parentNode === ParentnodeData.id && empl.nodeType === "device"
        )
        .map((node) => node.id);
      const exiteDevice = nodes
        .filter(
          (empl) =>
            empl?.parentNode === ParentnodeData.id && empl.nodeType === "device"
        )
        .find((b) => String(b.iconId) === String(empData.deviceId));
      const deviceIdAllocated = deviceAllocation
        .filter((device) => device.deviceId == deviceNodes.map((a) => a.iconId))
        .map((dev) => dev.Id);
      // setNodeDeviceID(deviceID)
      // setDeviceAllocationID(deviceIdAllocated)
      // const exiteDevice = nodes.filter((empl) => empl.parentNode == ParentnodeData.id).find((b) => String(b.iconId) === String(empData.empId))

      if (exiteDevice && deviceNodes.length > 0) {
        toast.error(
          <span>
            <strong>Already Device mapped!!</strong>.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        return; // exit the function early
      }
      if (deviceNodes.length > 0) {
        // handleClickOpen()
        if (empData.deviceId) {
          const deviceNode = {
            parenId: ParentnodeData.id,
            id: uuidv4(), //empData.deviceName + "",
            deviceId: empData.deviceId,
            nodedetails: ParentnodeData,
            nodeCategory: "",
            unit1Measurable: "",
            unit2Mandatory: "",
            itemDescription: "",
            nodeImage: "",
            percentage_rejects: "",
            nodeType: "device",
            MachineType: "",
            position: { x: 55, y: -40 },
            type: "iconNode",
            parentNode: ParentnodeData.id,
            extent: "parent",
            sourcePosition: "right",
            targetPosition: "left",
            iconId: empData.deviceId.toString(),
            style: {
              zIndex: 1001,
              width: "10",
              height: "10",
              background: "",
              color: "",
              borderColor: "",
              borderStyle: "",
              borderWidth: "",
              fontSize: "",
              fontStyle: "",
              borderRadius: "",
              display: "",
              alignItems: "",
              fontColor: "",
            },
            data: {
              label: empData.deviceName,
              onIconDoubbleClick: onIconDoubbleClick,
            },
          };
          if (
            window.confirm(
              `Do you want to replace ${
                deviceNodes.length > 0 ? deviceNodes[0].data.label : "null"
              } with ${empData.deviceName} ?`
            )
          ) {
            DeleteDeviceNode(deviceID);
            DeleteDeviceAllocation(deviceIdAllocated);
            setNodes((prevNodes) => [
              ...prevNodes.filter((n) => !deviceNodeid.includes(n.id)),
              deviceNode,
            ]);
            setDeviceMapping([...DeviceMapping, deviceNode]);
            setDevicenode(deviceNode);
            setOadetails((jobs) =>
              jobs.filter((a) => a.jobId !== empData.jobId)
            );
            console.log("after deleted response of nodes:", nodes);
          }
        }
      } else if (empData.deviceId && deviceNodes.length === 0) {
        // console.log(empData);
        const deviceNode = {
          parenId: ParentnodeData.id,
          id: uuidv4(), //empData.deviceName + "",
          deviceId: empData.deviceId,
          nodedetails: ParentnodeData,
          nodeCategory: "",
          unit1Measurable: "",
          unit2Mandatory: "",
          itemDescription: "",
          nodeImage: "",
          percentage_rejects: "",
          nodeType: "device",
          MachineType: "",
          position: { x: 55, y: -40 },
          type: "iconNode",
          parentNode: ParentnodeData.id,
          extent: "parent",
          sourcePosition: "right",
          targetPosition: "left",
          iconId: empData.deviceId.toString(),
          style: {
            zIndex: 1001,
            width: "10",
            height: "10",
            background: "",
            color: "",
            borderColor: "",
            borderStyle: "",
            borderWidth: "",
            fontSize: "",
            fontStyle: "",
            borderRadius: "",
            display: "",
            alignItems: "",
            fontColor: "",
          },
          data: {
            label: empData.deviceName,
            onIconDoubbleClick: onIconDoubbleClick,
          },
        };
        // deviceNode.position.x = ParentnodeData.position.x / 2 + NODE_WIDTH /2
        // deviceNode.position.y = ParentnodeData.position.y / 2 + NODE_HEIGHT /2 ;
        setOadetails((jobs) => jobs.filter((a) => a.jobId !== empData.jobId));
        setNodes((es) => es.concat(deviceNode));
        // setDeviceMapping(deviceNode);
        setDeviceMapping([...DeviceMapping, deviceNode]);
        setDevicenode(deviceNode);
      }
      // if (empData.jobId) {
      //   console.log(empData);
      //   const jobNode = {
      //     parenId: ParentnodeData.id,
      //     id: uuidv4(),
      //     position: { x: 108, y: -40 },
      //     type: "iconNode",
      //     parentNode: ParentnodeData.id,
      //     nodedetails: ParentnodeData,
      //     extent: "parent",
      //     sourcePosition: "right",
      //     targetPosition: "left",
      //     nodeCategory: "",
      //     unit1Measurable: "",
      //     unit2Mandatory: "",
      //     itemDescription: "",
      //     nodeImage: "",
      //     percentage_rejects: '',
      //     nodeType: "job",
      //     MachineType: "",
      //     height: 20,
      //     width: 20,
      //     iconId: empData.jobId.toString(),
      //     style: {
      //       zIndex: 1001,
      //       width: "10",
      //       height: "10",
      //       background: "",
      //       color: "",
      //       borderColor: "",
      //       borderStyle: "",
      //       borderWidth: "",
      //       fontSize: "",
      //       fontStyle: "",
      //       borderRadius: "",
      //       display: "",
      //       alignItems: "",
      //       fontColor: ""
      //     },
      //     data: { label: getJobNameById(empData.jobId), onIconDoubbleClick: onIconDoubbleClick },
      //   };
      //   console.log(jobNode, "JobDetails");
      //   // jobNode.position.x = ParentnodeData.position.x+NODE_WIDTH+22;
      //   // jobNode.position.y = ParentnodeData.position.y + NODE_HEIGHT-50;
      //   setOadetails((jobs) => jobs.filter(a => a.jobId !== empData.jobId));
      //   setNodes((es) => es.concat(jobNode));
      //   setJobMapping([...JobMapping, jobNode])
      // }
      // if(empData.IT_CODE){
      //   console.log(empData);
      //   const deviceNode = {
      //     parenId:ParentnodeData.id,
      //     id: empData.IT_CODE + "",
      //     position: {},
      //     type:"iconNode",
      //     sourcePosition: "right",
      //     targetPosition: "left",
      //     height:20,
      //     width:20,
      //     style:{
      //       zIndex:1001,
      //     },
      //     data: { label: empData.IT_NAME, onIconDoubbleClick: onIconDoubbleClick },
      //   };
      //   console.log(deviceNode,"JobDetails");
      //   console.log(nodes, "JobDetails");
      //   deviceNode.position.x = ParentnodeData.position.x+NODE_WIDTH-110;
      //   deviceNode.position.y = ParentnodeData.position.y + NODE_HEIGHT-10;
      //   setOadetails((jobs) => jobs.filter(a => a.jobId !== empData.jobId));
      //   setNodes((es) => es.concat(deviceNode));
      // }
    }
  };

  const onDragOver = (event) => {
    console.log("Start dragged over");
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const closeConfirmModal = (replaceEmployee) => {
    setShowAlert(null);
    if (replaceEmployee) {
      const oldEmp = Employeedata.find((a) => showAlert.oldUserId === a.empId);
      setEmployeedata((emps) =>
        emps.map((emp) => {
          if (emp.empId === showAlert.empId) return { ...oldEmp };
          return emp;
        })
      );
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.parentId === showAlert.parentId) {
            return {
              ...node,
              id: showAlert.empId + "",
              data: {
                label: showAlert.userName,
                onIconDoubbleClick: onIconDoubbleClick,
              },
            };
          }
          return node;
        })
      );
    }
  };

  const [active, setActive] = useState([]);
  const HandlebottomSlide = (item) => {
    setActive(item);
    onClick(item);
  };

  // const [sendtoPlanningtab,setSendtoPlanningtab] = useState([])
  const HandlesendtoPlanningtab = (item) => {
    setSendtoPlanningtab(item);
  };

  const HandleJobfromOperations = (job, nodeId) => {
    console.log(job, nodeId);
    setJobfromOperations(job, nodeId);
  };
  const [jobIdtopriority, setjobIdtopriority] = useState([]);

  const HandleMachineGraph = (jobId) => {
    const getnodeIds = jobAssignmentdata
      .filter((item) => item.jobId === jobId)
      .map((item) => item.node.nodeId);
    const PlannedJobs = jobAssignmentdata
      .filter((item) => item.jobId === jobId)
      .filter((item) => item.status === "Assigned")
      .map((item) => item);
    const completedJobs = Activitydata.filter(
      (item) => item.jobId === jobId
    ).map((item) => item);
    const combinedJobs = completedJobs.concat(PlannedJobs);

    const uniqueNodeIds = [...new Set(getnodeIds.map((node) => node))];

    const correspondingIds = [];

    // Filter Nodemasterdata for unique nodeIds and get corresponding IDs
    uniqueNodeIds.forEach((nodeId) => {
      const node = Nodemasterdata.find((item) => item.nodeId === nodeId);
      if (node) {
        correspondingIds.push(node);
      }
    });
    // Filter out graph type nodes from the nodes state
    setNodes((existingNodes) => {
      // Filter out any graph-type nodes
      const filteredNodes = existingNodes.filter(
        (node) => node.nodeType !== "MachineNode"
      );
      // Concatenate the new MachineNode with the filtered nodes
      return filteredNodes;
    });
    console.log(correspondingIds, "hello");
    correspondingIds.map((node) => {
      const MachineNode = {
        parenId: "",
        id: uuidv4(),
        position: {
          x: node.xPosition + 30,
          y: node.yPosition - 330,
        },
        nodeCategory: "",
        unit1Measurable: "",
        parentNode: "",
        extent: "",
        unit2Mandatory: "",
        itemDescription: "",
        nodeImage: "",
        percentage_rejects: "",
        nodeType: "MachineNode",
        MachineType: "",
        type: "MachineNode",
        sourcePosition: "right",
        targetPosition: "left",
        iconId: "",
        style: {
          zIndex: 1001,
          width: "100",
          height: "100",
          background: "",
          color: "",
          borderColor: "",
          borderStyle: "",
          borderWidth: "",
          fontSize: "",
          fontStyle: "",
          borderRadius: "",
          display: "",
          alignItems: "",
          fontColor: "",
        },
        data: {
          data: combinedJobs,
          nodeId: node.nodeId,
          onIconDoubbleClick: onIconDoubbleClick,
        },
      };
      console.log(MachineNode, "hello");
      console.log(nodes, "helloo");
      setNodes((es) => es.concat(MachineNode));
      console.log(nodes, "helloo");
    });
  };
  const HandleAllMachineGraph = (multipleJobs) => {
    console.log(multipleJobs, "160444");
    const getnodeIdss = jobAssignmentdata
      .filter((item) => item.jobId === multipleJobs)
      .map((item) => item.node.nodeId);
    console.log(getnodeIdss, "160444");
    let getnodeIds = [];
    let combinedJobs = [];
    multipleJobs.forEach((item1) => {
      console.log(item1, "150444");
      getnodeIds = jobAssignmentdata
        .filter((item) => item.jobId === multipleJobs)
        .map((item) => item.node.nodeId);
      const PlannedJobs = jobAssignmentdata
        .filter((item) => item.jobId === multipleJobs)
        .filter((item) => item.status === "Assigned")
        .map((item) => item);
      const completedJobs = Activitydata.filter(
        (item) => item.jobId === multipleJobs
      ).map((item) => item);
      combinedJobs = completedJobs.concat(PlannedJobs);
    });
    console.log(getnodeIds, "16044");
    const uniqueNodeIds = [...new Set(getnodeIds.map((node) => node))];

    const correspondingIds = [];

    // Filter Nodemasterdata for unique nodeIds and get corresponding IDs
    uniqueNodeIds.forEach((nodeId) => {
      const node = Nodemasterdata.find((item) => item.nodeId === nodeId);
      if (node) {
        correspondingIds.push(node);
      }
    });
    // Filter out graph type nodes from the nodes state
    setNodes((existingNodes) => {
      // Filter out any graph-type nodes
      const filteredNodes = existingNodes.filter(
        (node) => node.nodeType !== "MachineNode"
      );
      // Concatenate the new MachineNode with the filtered nodes
      return filteredNodes;
    });
    console.log(correspondingIds, "150444");
    correspondingIds.map((node) => {
      const MachineNode = {
        parenId: "",
        id: uuidv4(),
        position: {
          x: node.xPosition + 30,
          y: node.yPosition - 330,
        },
        nodeCategory: "",
        unit1Measurable: "",
        parentNode: "",
        extent: "",
        unit2Mandatory: "",
        itemDescription: "",
        nodeImage: "",
        percentage_rejects: "",
        nodeType: "MachineNode",
        MachineType: "",
        type: "MachineNode",
        sourcePosition: "right",
        targetPosition: "left",
        iconId: "",
        style: {
          zIndex: 1001,
          width: "100",
          height: "100",
          background: "",
          color: "",
          borderColor: "",
          borderStyle: "",
          borderWidth: "",
          fontSize: "",
          fontStyle: "",
          borderRadius: "",
          display: "",
          alignItems: "",
          fontColor: "",
        },
        data: {
          data: combinedJobs,
          nodeId: node.nodeId,
          onIconDoubbleClick: onIconDoubbleClick,
        },
      };
      setNodes((es) => es.concat(MachineNode));
    });
  };

  const HandleMaterialGraph = (jobId) => {
    console.log(jobId, "multipleJobs");
    if (jobId.length > 0) {
      // Filter batchdata for jobId
      const filteredNodes = batchdata.filter((node) => node.jobId === jobId);
      // Get unique nodeIds
      const uniqueNodeIds = [
        ...new Set(filteredNodes.map((node) => node.MaterialId)),
      ];

      // Initialize array to store corresponding IDs from Nodemasterdata
      const correspondingIds = [];

      setNodes((existingNodes) => {
        // Filter out any graph-type nodes
        const filteredNodes = existingNodes.filter(
          (node) => node.nodeType !== "GraphNode"
        );
        return filteredNodes;
      });
      console.log(uniqueNodeIds, "checking");
      // Filter Nodemasterdata for unique nodeIds and get corresponding IDs
      uniqueNodeIds.forEach((nodeId) => {
        const node = Nodemasterdata.find(
          (item) => item.nodeId === nodeId && item.nodeCategory !== "Waste"
          // && item.nodeCategory !== "Raw Material"
        );
        if (node) {
          correspondingIds.push(node);
        }
      });
      // Do something with correspondingIds
      console.log(correspondingIds, "today");
      const empNodeData = correspondingIds.map((node) => {
        const empNodeMap = {
          parenId: "",
          id: uuidv4(),
          position: {
            x: node.xPosition + 5,
            y: node.yPosition - 350,
          },
          nodeCategory: "",
          unit1Measurable: "",
          parentNode: "",
          extent: "",
          unit2Mandatory: "",
          itemDescription: "",
          nodeImage: "",
          percentage_rejects: "",
          nodeType: "GraphNode",
          MachineType: "",
          type: "graphNode",
          sourcePosition: "right",
          targetPosition: "left",
          iconId: node.nodeId,
          style: {
            zIndex: 1001,
            width: "100",
            height: "100",
            background: "",
            color: "",
            borderColor: "",
            borderStyle: "",
            borderWidth: "",
            fontSize: "",
            fontStyle: "",
            borderRadius: "",
            display: "",
            alignItems: "",
            fontColor: "",
          },
          data: {
            label: jobId,
            node: node.nodeId,
            onIconDoubbleClick: onIconDoubbleClick,
          },
        };
        return empNodeMap;
      });
      setNodes((es) => es.concat(empNodeData));
      setdataToBottomJobPriorPanel(empNodeData, jobId);
    }
  };

  const HandleAllMaterialGraph = (multipleJobs) => {
    if (multipleJobs.length > 0) {
      // Filter batchdata for jobId
      const filteredNodes = [];

      multipleJobs.forEach((jobId) => {
        const filtered = batchdata.filter((node) => node.jobId === jobId);
        filteredNodes.push(...filtered);
      });
      // Get unique nodeIds
      const uniqueNodeIds = [
        ...new Set(filteredNodes.map((node) => node.MaterialId)),
      ];

      // Initialize array to store corresponding IDs from Nodemasterdata
      const correspondingIds = [];

      setNodes((existingNodes) => {
        // Filter out any graph-type nodes
        const filteredNodes = existingNodes.filter(
          (node) => node.nodeType !== "GraphNode"
        );
        return filteredNodes;
      });
      console.log(uniqueNodeIds, "checking");
      // Filter Nodemasterdata for unique nodeIds and get corresponding IDs
      uniqueNodeIds.forEach((nodeId) => {
        const node = Nodemasterdata.find(
          (item) => item.nodeId === nodeId && item.nodeCategory !== "Waste"
          // && item.nodeCategory !== "Raw Material"
        );
        if (node) {
          correspondingIds.push(node);
        }
      });
      // Do something with correspondingIds
      console.log(correspondingIds, "1504");
      const empNodeData = correspondingIds.map((node) => {
        const producedQty = batchMasterdata
          .filter((item) => item.nodeId === node.nodeId)
          .map((item) => item.producedQty1);
        let a = 0;
        multipleJobs.forEach((item1) => {
          const filteredproducedQty = batchMasterdata
            .filter(
              (item) =>
                item.producedJobId === item1 && item.nodeId === node.nodeId
            )
            .map((item) => item.producedQty1);
          filteredproducedQty.forEach((item) => {
            a += parseInt(item);
          });
        });
        const target = batchMasterdata
          .filter((item) => item.nodeId === node.nodeId)
          .map((item) => item.targetQty);
        let b = 0;
        target.forEach((item) => {
          b += parseInt(item);
        });

        const outstanding = batchMasterdata
          .filter((item) => item.nodeId === node.nodeId)
          .map((item) => item.outstandingQty);
        let c = 0;
        outstanding.forEach((item) => {
          c += parseInt(item);
        });
        const empNodeMap = {
          parenId: "",
          id: uuidv4(),
          position: {
            x: node.xPosition + 5,
            y: node.yPosition - 350,
          },
          nodeCategory: "",
          unit1Measurable: "",
          parentNode: "",
          extent: "",
          unit2Mandatory: "",
          itemDescription: "",
          nodeImage: "",
          percentage_rejects: "",
          nodeType: "GraphNode",
          MachineType: "",
          type: "graphNode",
          sourcePosition: "right",
          targetPosition: "left",
          iconId: node.nodeId,
          style: {
            zIndex: 1001,
            width: "100",
            height: "100",
            background: "",
            color: "",
            borderColor: "",
            borderStyle: "",
            borderWidth: "",
            fontSize: "",
            fontStyle: "",
            borderRadius: "",
            display: "",
            alignItems: "",
            fontColor: "",
          },
          data: {
            label: multipleJobs,
            node: node.nodeId,
            producedQty: a,
            targetQty: b,
            outQty: c,
          },
        };
        return empNodeMap;
      });
      setNodes((es) => es.concat(empNodeData));
      setdataToBottomJobPriorPanel(empNodeData, multipleJobs);
    }
  };

  const HandleCreateNode = (jobId) => {
    console.log(jobId, "hello");
    HandleMaterialGraph(jobId);
    HandleMachineGraph(jobId);
  };

  const HandleCreateNodeMultipleNodes = (multipleJobs) => {
    HandleAllMaterialGraph(multipleJobs);
    HandleAllMachineGraph(multipleJobs);
  };

  const HandleJobIdtoJobPriority = (jobId) => {
    console.log(jobId, "hello");
    HandleCreateNode(jobId);
    setshowGraph(true);
    setjobIdtopriority(jobId);
    setjobIdtoJobpriority(jobId);
    HandleshowEdgesbasedonJob(jobId);
  };

  const HandleMultipleJobs = (multipleJobs) => {
    setMultiplejobIdtoJobpriority(multipleJobs);
    HandleCreateNodeMultipleNodes(multipleJobs);
  };

  const HandleshowEdgesbasedonJob = (jobId) => {
    const getIT_Code = Oadetails.filter((item) => item.jobId === jobId).map(
      (item) => item.IT_CODE
    );

    const getRoute = ItemMaster.filter(
      (item) => item.IT_CODE === getIT_Code
    ).map((item) => item.Route);
    const getEdges = Edgestabledata.filter(
      (item) => item.routeId === getRoute
    ).map((item) => item);

    const dataArray = getEdges.map((data) => ({
      id: data?.id,
      edgeId: data?.edgeId,
      routeid: data?.routeId,
      source: data?.sourceId,
      target: data?.targetId,
      type: data?.edgeStyle,
      animated: data?.animation,
      sourceNodeId: data?.sourceNodeId,
      targetNodeId: data?.targetNodeId,
      label: data?.label,
      style: { strokeWidth: data?.edgeThickness, stroke: data?.edgeColor },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: "#000",
        arrow: data?.arrow,
      },
    }));
    setEdges(dataArray);
  };


  useEffect(() => {
    if (sendtoRoutes) {
      setNodes((nds) => nds.concat(sendtoRoutes));
    }
  }, [sendtoRoutes]);

  
  const [isExpandedFull, setIsExpandedFull] = React.useState(false);
  const [size, setSize] = useState();
  const HandleIcon = (item) => {
    console.log(item, "KKKK");
    setSize(item);
  };

  const rfstyle = {
    height: window.outerHeight,
  };

  const getActivityMessage = (color) => {
    const a =   color === "#FFA726" ? "Machine is up for Maintenance!" : color === "#ED2226" ? "Machine is Broken!" :
                color === "#ED2226" ? "Machine is OFF!" : color === "#29B6F6" ? "Machine is on Holiday!" : color === "#08A64F" ? "Machine is ON!" : ""
    return a
}

  const onNodeMouseEnter = (event, node) => {
    if(node.nodeType === "Machine"){
    const childNode = {
      id: `child-${node.id}`,
      type: "input", // You can use a different type if needed
      position: {
        x: 0, // Same x position as parent
        y: 110, // Adjust this to place the child below the parent
      },
      sourcePosition: "right",
      targetPosition: "left",
      parentNode:node.id,
      extent:'parent',
      // data: { label: 'Machine is ON!' },
      data: { label: <div className=" flex flex-col justify-center items-center font-sans font-large ">
        <IoIosInformationCircle/> &nbsp;
        <span>{getActivityMessage(node.style.borderLeftColor)}</span>
      </div> },
      style:{
        borderRightWidth: node.style.borderWidth,
        borderTopWidth: node.style.borderWidth,
        borderBottomWidth: node.style.borderWidth,
        borderRightColor: node.style.borderColor,
        borderTopColor: node.style.borderColor,
        borderBottomColor: node.style.borderColor,
        borderLeftWidth: node.nodeType  === 'Machine' ?  node.style.borderLeftWidth : '', // Set left border Color to 10px
        borderLeftColor: node.nodeType  === 'Machine' ? node.style.borderLeftColor : '#FFFFFF', 
        borderRadius:'10px',
        background: "white", // Set background color
        color: "#8A8A8A", // Set text color
        fontSize: "14px", // Set the font size
        fontStyle: "normal", // Set the font style
        width: "150px",
        height: "35px",
        justifycontent: "center" /* Horizontally center */,
        alignitems: "center" /* Vertically center */,
        boxShadow:'0px 2px 5px #888',
      }
    };

    // Add the child node to the dynamic nodes
    setNodes((prevNodes) => [...prevNodes, childNode]);
  }
  };
  const onNodeMouseLeave = (event, node) => {
    // Remove the child node when mouse leaves
    setNodes((prevNodes) => prevNodes.filter((n) => n.id !== `child-${node.id}`));
  };

  const flowRef = useRef(null);


  const handleClose = () => {
    setConfirmUserToReplace(false);
  };
  const handleYes = () => {
    setYesToReplace(true);
    console.log("Replace the device..yesssss", YesToReplace, NodeDeviceID);
    if (YesToReplace) {
      deleteNode(NodeDeviceID);
      DeleteDeviceAllocation(DeviceAllocationID);
      // const replaceDevice = (deviceNode) => {
      //   setOadetails((jobs) => jobs.filter(a => a.jobId !=== empData.jobId));
      //   setNodes((es) => es.concat(deviceNode));
      //   setDeviceMapping([...DeviceMapping, deviceNode]);
      //   setDevicenode(deviceNode);
      // }
      setConfirmUserToReplace(false);
    }
  };

  const observerErrorHandler = (e) => {
    if (
      e.message ===
      "ResizeObserver loop completed with undelivered notifications."
    ) {
      e.stopImmediatePropagation();
    }
  };

  window.addEventListener("error", observerErrorHandler);

  return (
    <div style={{ display: "flex" }} ref={inputRef}>
      <div
        style={{
          width: sidebarCollapsed ? "100%" : "100%",
          transition: "width 0.1s",
          zIndex: 1,
        }}
      >
        {/* <ReactFlowProvider> */}
          <div
            style={{ height: 565, width: "100%", overflow: "hidden" }}
            ref={reactFlowWrapper}
            // onWheel={handleWheel}
          >
            <ReactFlow
              onLoad={(reactFlowInstance) =>
                (flowRef.current = reactFlowInstance)
              }
              ref={flowRef}
              nodesDraggable={selectedMenuItem === "Configuration" || selectedMenuItem === "Administration"} // Disable dragging for nodes
              nodes={nodes.map((node) => ({
                ...node,
                style: getNodeStyle(node), // Apply the updated style
                draggable: node.nodeType !== "MachineIcon", // Allow dragging for nodes that are not "Machine"
              }))}
              edges={edges.map((edge) => ({
                ...edge,
                style: getEdgeStyle(edge), // Apply the updated style
              }))}
              // edges={edges}
              onNodeClick={onNodeClick}
              onNodeDoubleClick={onNodeDoubleClick}
              elements={droppedData}
              proOptions={proOptions} // reactflow watermark remove
              onEdgeContextMenu={onEdgeContextMenu}
              onNodeContextMenu={onNodeContextMenu}
              onNodesChange={onNodesChange}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              onEdgesChange={onEdgesChange}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              fitViewOptions={{ padding: 3, duration: 1000 }}
              style={rfstyle}
              connectionLineStyle={connectionLineStyle}
              nodeTypes={nodeTypes}
            >
              {selectedMenuItem === "Configuration" && expanded && (
                <Card
                  id="dasboard-right-container"
                  style={{ position: "fixed", top: "38px" }}
                  // className={`dashboard-right-container sticky-top ${expanded ? 'expanded' : 'partial'}`}>
                  className={`dashboard-right-container sticky-top ${
                    active === "FG Mapping"
                      ? expanded
                        ? "expanded"
                        : "partial"
                      : ""
                  }`}
                >
                  {expanded ? (
                    <div className="pt-2" onClick={handleExpandToggle}>
                      <RightSlider
                        active={active}
                        isExpandedFull={isExpandedFull}
                        setIsExpandedFull={setIsExpandedFull}
                        onclick={HandleIcon}
                      />
                      <KeyboardDoubleArrowRightIcon
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#09587C",
                          color: "#ffffff",
                          position: "fixed",
                          // right:'30%',
                          right: size ? size : "30%",
                          width: "25",
                          height: "47px",
                          top: "46px",
                          display: "inline",
                        }}
                        onClick={handleExpandToggle}
                      />
                    </div>
                  ) : (
                    <div className="pt-2" onClick={handleExpandToggle}>
                      <KeyboardDoubleArrowLeftIcon
                        style={{ cursor: "pointer", color: "#09587C" }}
                        onClick={handleExpandToggle}
                      />
                    </div>
                  )}
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12 m-0 p-0">
                        <Box sx={{ position: "relative" }}>
                          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                              value={value}
                              onChange={handleChange}
                              aria-label="basic tabs example"
                              style={{ background: "#ffffff" }}
                              variant="scrollable"
                              scrollButtons="auto"
                            >
                              <Tab
                                style={{
                                  fontSize: "10.5px",
                                  fontWeight: "bold",
                                  color: "#727272",
                                  backgroundColor:
                                    value === 0 ? "#E6ECEF" : "#ffffff",
                                }}
                                onClick={() => HandlebottomSlide("Routes")}
                                label="Routes"
                                {...a11yProps(0)}
                              />
                              <Tab
                                style={{
                                  fontSize: "10.5px",
                                  fontWeight: "bold",
                                  color: "#727272",
                                  backgroundColor:
                                    value === 1 ? "#E6ECEF" : "#ffffff",
                                }}
                                onClick={() => HandlebottomSlide("Staff")}
                                label="Staff"
                                {...a11yProps(1)}
                              />
                              <Tab
                                style={{
                                  fontSize: "10.5px",
                                  fontWeight: "bold",
                                  color: "#727272",
                                  backgroundColor:
                                    value === 2 ? "#E6ECEF" : "#ffffff",
                                }}
                                onClick={() => HandlebottomSlide("Material")}
                                label="Material"
                                {...a11yProps(3)}
                              />
                              <Tab
                                style={{
                                  fontSize: "10.5px",
                                  fontWeight: "bold",
                                  color: "#727272",
                                  backgroundColor:
                                    value === 3 ? "#E6ECEF" : "#ffffff",
                                }}
                                onClick={() => HandlebottomSlide("Device")}
                                label="Device"
                                {...a11yProps(2)}
                              />
                              <Tab
                                style={{
                                  fontSize: "10.5px",
                                  fontWeight: "bold",
                                  color: "#727272",
                                  backgroundColor:
                                    value === 4 ? "#E6ECEF" : "#ffffff",
                                }}
                                onClick={() => HandlebottomSlide("FG Mapping")}
                                label="Finished Goods"
                                {...a11yProps(4)}
                              />
                            </Tabs>
                          </Box>
                          <CustomTabPanel value={value} index={0}>
                            {showRoutePopup && (
                              <RoutePopup
                                onCancel={onCloseRoute}
                                onSave={onSaveRoute}
                                // dataFromChild={dataFromChild}
                                onClick={handleChildClick}
                              />
                            )}
                          </CustomTabPanel>
                          <CustomTabPanel value={value} index={1}>
                            <Employees Employeedata={Employeedata} />
                          </CustomTabPanel>
                          <CustomTabPanel value={value} index={2}>
                            {/* <DevicePanel /> */}
                            Materials
                          </CustomTabPanel>
                          <CustomTabPanel value={value} index={3}>
                            <DevicePanel />
                          </CustomTabPanel>
                          <CustomTabPanel value={value} index={4}>
                            <FGmapping />
                          </CustomTabPanel>
                        </Box>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              {selectedMenuItem === "Configuration" && !expanded && (
                <div
                  id="dasboard-right-container"
                  style={{ position: "fixed", top: "45px" }}
                  className={`dashboard-right-container sticky-top partial`}
                >
                  <div className="pt-2" onClick={handleExpandToggle}>
                    <KeyboardDoubleArrowLeftIcon
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#09587C",
                        color: "#ffffff",
                        width: "25",
                        height: "47px",
                        position: "fixed",
                        right: "0%",
                      }}
                      onClick={handleExpandToggle}
                    />
                  </div>
                </div>
              )}
              {selectedMenuItem === "Planning" && expanded && (
                <Card
                  id="dasboard-right-container"
                  style={{ position: "fixed", top: "38px" }}
                  className={`dashboard-right-container sticky-top ${
                    active === "FG Mapping"
                      ? expanded
                        ? "expanded"
                        : "partial"
                      : ""
                  }`}
                >
                  {expanded ? (
                    <div className="pt-2" onClick={handleExpandToggle}>
                      <RightSlider
                        active={active}
                        isExpandedFull={isExpandedFull}
                        setIsExpandedFull={setIsExpandedFull}
                        onclick={HandleIcon}
                      />
                      <KeyboardDoubleArrowRightIcon
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#09587C",
                          color: "#ffffff",
                          position: "fixed",
                          // right:'30%',
                          right: size ? size : "30%",
                          width: "25",
                          height: "47px",
                          top: "46px",
                          display: "inline",
                        }}
                        onClick={handleExpandToggle}
                      />
                    </div>
                  ) : (
                    <div className="pt-2" onClick={handleExpandToggle}>
                      <KeyboardDoubleArrowLeftIcon
                        style={{ cursor: "pointer", color: "#09587C" }}
                        onClick={handleExpandToggle}
                      />
                    </div>
                  )}
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12 m-0 p-0">
                        <RightOperationTabPanel
                          sendtoPlanningtab={HandlesendtoPlanningtab}
                          toRightOperationTabPanel={toRightOperationTabPanel}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              {selectedMenuItem === "Planning" && !expanded && (
                <div
                  id="dasboard-right-container"
                  style={{ position: "fixed", top: "45px" }}
                  className={`dashboard-right-container sticky-top partial`}
                >
                  <div className="pt-2" onClick={handleExpandToggle}>
                    <KeyboardDoubleArrowLeftIcon
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#09587C",
                        color: "#ffffff",
                        width: "25",
                        height: "47px",
                        position: "fixed",
                        right: "0%",
                      }}
                      onClick={handleExpandToggle}
                    />
                  </div>
                </div>
              )}
              {selectedMenuItem === "Operations" && expanded && (
                <Card
                  id="dasboard-right-container"
                  style={{ position: "fixed", top: "38px" }}
                  className={`dashboard-right-container sticky-top ${
                    active === "FG Mapping"
                      ? expanded
                        ? "expanded"
                        : "partial"
                      : ""
                  }`}
                >
                  {expanded ? (
                    <div className="pt-2" onClick={handleExpandToggle}>
                      <RightSlider
                        active={active}
                        isExpandedFull={isExpandedFull}
                        setIsExpandedFull={setIsExpandedFull}
                        onclick={HandleIcon}
                      />
                      <KeyboardDoubleArrowRightIcon
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#09587C",
                          color: "#ffffff",
                          position: "fixed",
                          // right:'30%',
                          right: size ? size : "30%",
                          width: "25",
                          height: "47px",
                          top: "46px",
                          display: "inline",
                        }}
                        onClick={handleExpandToggle}
                      />
                    </div>
                  ) : (
                    <div className="pt-2" onClick={handleExpandToggle}>
                      <KeyboardDoubleArrowLeftIcon
                        style={{ cursor: "pointer", color: "#09587C" }}
                        onClick={handleExpandToggle}
                      />
                    </div>
                  )}
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12 m-0 p-0">
                        <RightTabPanel
                          nodefromshowRoutes={selectedNodeId}
                          setJobIdSidetoBottom={HandleJobfromOperations}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              {selectedMenuItem === "Operations" && !expanded && (
                <div
                  id="dasboard-right-container"
                  style={{ position: "fixed", top: "45px" }}
                  className={`dashboard-right-container sticky-top partial`}
                >
                  <div className="pt-2" onClick={handleExpandToggle}>
                    <KeyboardDoubleArrowLeftIcon
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#09587C",
                        color: "#ffffff",
                        width: "25",
                        height: "47px",
                        position: "fixed",
                        right: "0%",
                      }}
                      onClick={handleExpandToggle}
                    />
                  </div>
                </div>
              )}
              {selectedMenuItem === "Priority Job" && expanded && (
                <Card
                  id="dasboard-right-container"
                  style={{ position: "fixed", top: "38px" }}
                  className={`dashboard-right-container sticky-top ${
                    active === "FG Mapping"
                      ? expanded
                        ? "expanded"
                        : "partial"
                      : ""
                  }`}
                >
                  {expanded ? (
                    <div className="pt-2" onClick={handleExpandToggle}>
                      <RightSlider
                        active={active}
                        isExpandedFull={isExpandedFull}
                        setIsExpandedFull={setIsExpandedFull}
                        onclick={HandleIcon}
                      />
                      <KeyboardDoubleArrowRightIcon
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#09587C",
                          color: "#ffffff",
                          position: "fixed",
                          // right:'30%',
                          right: size ? size : "30%",
                          width: "25",
                          height: "47px",
                          top: "46px",
                          display: "inline",
                        }}
                        onClick={handleExpandToggle}
                      />
                    </div>
                  ) : (
                    <div className="pt-2" onClick={handleExpandToggle}>
                      <KeyboardDoubleArrowLeftIcon
                        style={{ cursor: "pointer", color: "#09587C" }}
                        onClick={handleExpandToggle}
                      />
                    </div>
                  )}
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12 m-0 p-0">
                        <Priorityjobspanel
                          onClick={HandleJobIdtoJobPriority}
                          onDoubleClick={HandleMultipleJobs}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              {selectedMenuItem === "Priority Job" && !expanded && (
                <div
                  id="dasboard-right-container"
                  style={{ position: "fixed", top: "45px" }}
                  className={`dashboard-right-container sticky-top partial`}
                >
                  <div className="pt-2" onClick={handleExpandToggle}>
                    <KeyboardDoubleArrowLeftIcon
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#09587C",
                        color: "#ffffff",
                        width: "25",
                        height: "47px",
                        position: "fixed",
                        right: "0%",
                      }}
                      onClick={handleExpandToggle}
                    />
                  </div>
                </div>
              )}
              <Panel position="top-left">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    // left: 80,
                    top: 60,
                  }}
                >
                  <OverlayTrigger
                    delay={{ hide: 450, show: 300 }}
                    overlay={(props) => <Tooltip {...props}>Add Node</Tooltip>}
                    placement="right"
                  >
                    <Button
                      style={{ width: "50px", border: "1px solid #ECECEF" }}
                      className="mt-2"
                      variant="white"
                      id="savebutton"
                      onClick={() => onAddNode("NodeType")}
                    >
                      <BsPlusLg
                        id="icon"
                        style={{ fontSize: "20px", color: "7C7C7C" }}
                      />
                      {/* <FaPlus style={{color:'7C7C7C'}}/> */}
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    delay={{ hide: 450, show: 300 }}
                    overlay={(props) => (
                      <Tooltip {...props}>Delete Node</Tooltip>
                    )}
                    placement="right"
                  >
                    <Button
                      style={{ width: "50px", border: "1px solid #ECECEF" }}
                      className="mt-2"
                      variant="white"
                      id="savebutton"
                      onClick={HandleDeleteNodes}
                    >
                      <RiDeleteBinLine
                        id="icon"
                        style={{ fontSize: "20px", color: "7C7C7C" }}
                      />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    delay={{ hide: 450, show: 300 }}
                    overlay={(props) => <Tooltip {...props}>Save</Tooltip>}
                    placement="right"
                  >
                    <Button
                      style={{ width: "50px", border: "1px solid #ECECEF" }}
                      className="mt-2"
                      id="savebutton"
                      variant="white"
                      onClick={handleEdgesandNodes}
                    >
                      <FaSave
                        id="icon"
                        style={{ fontSize: "20px", color: "7C7C7C" }}
                      />
                    </Button>
                  </OverlayTrigger>
                </div>
                <div>
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
                        onCancel={handleEdgeCancel}
                        onSave={handleEdgeSave}
                      />
                    )}
                  </div>
                </div>
              </Panel>
              {/* <Background variant="lines" /> */}
            </ReactFlow>
            
            {selectedNodes && showNodePopup && (
              <BasicTabs
                node={selectedNodes}
                onClose={onCloseNodePopup}
                onSave={onSaveNodePopup}
                onNodeClick={onNodeClick}
              />
            )}
            {showPopup && (
              <BasicTabs
                edge={selectedEdge}
                onClose={onClosePopup}
                onSaveEdge={onSavePopup}
                onEdgeContextMenu={onEdgeContextMenu}
              />
            )}
            {/* {NodestoMachineGraph && NodestoMachineGraph.length > 0 && (
              <MachineNode/>
            )} */}
            {PopupEmp && (
              <div
                className="popup"
                style={{
                  border: "1px solid black",
                  position: "absolute",
                  top: "220px",
                  left: "300px",
                  backgroundColor: "whitesmoke",
                }}
              >
                <table border={"1px"} cellPadding={"5px"}>
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      <th>Start Date</th>
                      <th>ShiftId</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        {droppedData.empId}
                      </td>
                      <td>{droppedData.empName}</td>
                      <td>
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                        />
                      </td>
                      <td>
                        <select value={shift} onChange={handleShiftChange}>
                          {data.map((item, index) => (
                            <option key={index} value={item.shiftId}>
                              {item.shiftId}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-1">
                  <button
                    className="btn btn-success"
                    onClick={handleNewRowSubmit}
                  >
                    <FaCheck />
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-danger"
                    onClick={() => setEmpPopup(false)}
                  >
                    <FaXmark />
                  </button>
                </div>
              </div>
            )}
            <Dialog
              open={ConfirmUserToReplace}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
              maxWidth="md"
            >
              <DialogTitle>{`Alert !!!`}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {`Do you want to replace the Device?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant="outline-danger" onClick={handleClose}>
                  No
                </Button>
                <Button variant="outline-success" onClick={handleYes}>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        {/* </ReactFlowProvider> */}
      </div>
      {showAlert && (
        <ConfirmModal
          nodeData={showAlert}
          closeConfirmModal={closeConfirmModal}
        />
      )}
      {OpenLoader && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={OpenLoader}
          // onClick={handleClose}
        >
          <CircularProgress size={80} color="inherit" />
        </Backdrop>
      )}
      {isModalOpen && (
        <NodeTypeModal
          onClose={handleCloseModal}
          isModalOpen={isModalOpen}
          sendNodeType={HandleNodeType}
        />
      )}
      
      <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseDeletPopup}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Are you sure you want to delete the Machine Node? This action may also 
          delete all the dependent nodes.
        </DialogTitle>
        
        <DialogActions>
          <Button onClick={deleteSelectedElements}>Yes</Button>
          <Button autoFocus onClick={handleCloseDeletPopup}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

      {openUnselected && (
        <React.Fragment>
        <Dialog
          open={openUnselected}
          onClose={handleCloseUnselectedPopup}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Please Select the Node to Delete.
          </DialogTitle>
          {/* <DialogContent>
            <DialogContentText>
            Are you sure you want to delete the Machine Node? This action may also 
            delete all the dependent nodes.
            </DialogContentText>
          </DialogContent> */}
          <DialogActions>
            <Button onClick={handleCloseUnselectedPopup}>OK</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      )}

      {FullNodeDetails && (
      <FullScreenModal FullNodeDetails={FullNodeDetails} FullNodeData={FullNodeData} onClose={HandleCloseFullScreen}/>
      )}

    </div>
  );
};

export default AdministrationShowRoutes;
