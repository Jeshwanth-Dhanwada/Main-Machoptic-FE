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
import { ToastContainer, toast } from "react-toastify";
import { Backdrop, Card, Slider } from "@mui/material";
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
import { ReactFlowProvider } from "react-flow-renderer";
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
  addEdge,
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

import Modal from "@mui/material/Modal";
import { FaRegRectangleXmark } from "react-icons/fa6";

import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { createNodeData } from "../utils/convertToNodes.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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

const JobPriorityShowRoutes = ({
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
  const [showGraph, setshowGraph] = useState(false);
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
  const [DeviceMapping, setDeviceMapping] = useState([]);
  const [shiftdata, setShiftdata] = useState([]);
  const [sendtoRoutess, setSendtoRoutes] = useState({ sendtoRoutes });
  // Ramesh added state variables
  const [ConfirmUserToReplace, setConfirmUserToReplace] = useState(false);
  const [YesToReplace, setYesToReplace] = useState(false);
  const [NodeDeviceID, setNodeDeviceID] = useState([]);
  const [DeviceAllocationID, setDeviceAllocationID] = useState([]);


  // fetching Node data from database -----------
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
                  .filter((item)=> (item.nodeType === 'Machine' 
                                    || item.nodeType === 'Material'
                                    || item.nodeType === 'MachineIcon'
                                  ))
        const x = createNodeData(filter)
        setNodes(x);
        setOpenLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [setNodes]);

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

  const [nodeType, setNodeType] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const HandleNodeType = (item) => {
    console.log(item, "NodeType");
    setNodeType(item);
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  // Delete Node -------------------------------


  const [open,setDeletePopup] = useState(false)
  const [openUnselected,setOpenUnselected] = useState(false)
  const handleCloseDeletPopup = () => {
    setDeletePopup(false)
  }
  const handleCloseUnselectedPopup = () => {
    setOpenUnselected(false)
  }
 


  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update the current time every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const today = new Date();

  // Define options for date formatting
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata", // Set the timezone to Indian Standard Time (IST)
  };

  // Format the date using toLocaleDateString
  const indianFormattedDate = today.toLocaleDateString("en-IN", options);



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
  );



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
        borderWidth: isSelected ? "2px" : node?.style?.borderWidth,
        borderColor: isSelected ? "" : node?.style?.borderColor,
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
    setSize('30%');
  };
  const [reactFlowInstance, setReactFlowInstance] = useState(null);




  const onDragOver = (event) => {
    console.log("Start dragged over");
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
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
          // onIconDoubbleClick: onIconDoubbleClick,
        },
      };
      setNodes((es) => es.concat(MachineNode));
    });
  };



  useEffect(() => {
    if (selectedMenuItem === "Analytics - Priority Job") {
      // Filter batchdata for all material nodes
      const filteredNodes = batchdata.filter((node) => node.MaterialId);
      // Get unique nodeIds
      console.log(filteredNodes,"checkjobprior")
      const uniqueNodeIds = [
        ...new Set(filteredNodes.map((node) => node.MaterialId)),
      ];
      console.log(uniqueNodeIds,"checkjobprior")
      const correspondingIds = [];

      setNodes((existingNodes) => {
        const filteredNodes = existingNodes.filter(
          (node) => node.nodeType !== "GraphNode"
        );
        return filteredNodes;
      });

      uniqueNodeIds.forEach((nodeId) => {
        const node = Nodemasterdata.find(
          (item) =>
            String(item.nodeId) === String(nodeId) &&
            item.nodeCategory !== "Waste" &&
            item.nodeCategory !== "Raw Material"
        );
        if (node) {
          correspondingIds.push(node);
        }
      });
      const empNodeData = correspondingIds.map((node) => {
        const producedQty = batchMasterdata
          .filter((item) => String(item.nodeId) === String(node.nodeId))
          .map((item) => item.producedQty1);
          let a = 0;
          producedQty.forEach((item) => {
            a += parseInt(item);
          });
          console.log(producedQty,"outstanding")
        const target = batchMasterdata
          .filter((item) => String(item.nodeId) === String(node.nodeId))
          .map((item) => item.targetQty);
          let b = 0;
          target.forEach((item) => {
            b += parseInt(item);
          });
        console.log(target,"outstanding")

        const outstanding = batchMasterdata
          .filter((item) => String(item.nodeId) === String(node.nodeId))
          .map((item) => item.outstandingQty);
          let c = 0;
          outstanding.forEach((item) => {
            c += parseInt(item);
          });
        console.log(outstanding,"outstanding")
        const empNodeMap = {
          parenId: "",
          id: uuidv4(),
          position: {
            x: node.xPosition -30,
            y: node.yPosition - 100,
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
            label: "",
            node: node.nodeId,
            allnodes: correspondingIds,
            producedQty: a,
            targetQty: b,
            outQty: c,
          },
        };
        return empNodeMap;
      });

      setNodes((es) => es.concat(empNodeData));
      setdataToBottomJobPriorPanel(empNodeData);
    }
    if (selectedMenuItem === "Analytics - Priority Job") {
      console.log(selectedMenuItem, "today");
      const getnodeIds = jobAssignmentdata.map((item) => item.node.nodeId);
      const PlannedJobs = jobAssignmentdata
        .filter((item) => item.status === "Assigned")
        .map((item) => item);
      const completedJobs = Activitydata.map((item) => item);
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
      correspondingIds.map((node) => {
        const MachineNode = {
          parenId: "",
          id: uuidv4(),
          position: {
            x: node.xPosition + 0,
            y: node.yPosition - 130,
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
            // onIconDoubbleClick: onIconDoubbleClick,
          },
        };
        setNodes((es) => es.concat(MachineNode));
      });
    }
  },[
    Nodemasterdata,
    batchdata,
    selectedMenuItem,
    Activitydata,
    jobAssignmentdata,
  ]);

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
            // onIconDoubbleClick: onIconDoubbleClick,
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
    // if(getEdges){
    //   setEdges(getEdges)
    // }
  };

  // console.log(sendtoRoutess,"sendtoRoutess")
  // console.log(sendtoRoutes,"sendtoRoutess")
  // useEffect(() => {
  //   if (sendtoRoutes) {
  //     setNodes([...nodes, sendtoRoutes]);
  //     // console.log(nodes)
  //     // console.log(sendtoRoutes)
  //   }
  // }, [nodes,sendtoRoutes]);

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

  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });

  const onNodeMouseEnter = (event, node) => {
    console.log(node.position.x, node.position.y, "2704");
  };
  // console.log(nodePosition,"2704")
  const onNodeMouseLeave = () => {
    setHoveredNodeId(null);
  };

  const flowRef = useRef(null);
  
  const handleClose = () => {
    setConfirmUserToReplace(false);
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
          <div
            style={{ height: 565, width: "100%", overflow: "hidden" }}
            ref={reactFlowWrapper}
          >
            <ReactFlow
              onLoad={(reactFlowInstance) =>
                (flowRef.current = reactFlowInstance)
              }
              ref={flowRef}
              nodesDraggable={selectedMenuItem === "Configuration"} // Disable dragging for nodes
              nodes={nodes.map((node) => ({
                ...node,
                style: getNodeStyle(node), // Apply the updated style
              }))}
              edges={edges.map((edge) => ({
                ...edge,
                style: getEdgeStyle(edge), // Apply the updated style
              }))}
              // edges={edges}
              onNodeClick={onNodeClick}
              elements={droppedData}
              proOptions={proOptions} // reactflow watermark remove
              onEdgeContextMenu={onEdgeContextMenu}
              onNodesChange={onNodesChange}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              onEdgesChange={onEdgesChange}
              onInit={setReactFlowInstance}
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
              {/* <Background variant="lines" /> */}
            </ReactFlow>
            {hoveredNodeId && (
              <div
                style={{
                  position: "absolute",
                  top: nodePosition.y + 100,
                  left: nodePosition.x,
                  background: "white",
                  padding: "5px",
                  border: "1px solid #ccc",
                }}
              >
                {/* Render data related to hovered node */}
                {/* Example: <p>{getDataForNodeId(hoveredNodeId)}</p> */}
                <p>{`Data for node ${hoveredNodeId}`}</p>
              </div>
            )}
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
          </div>
      </div>
      {OpenLoader && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={OpenLoader}
          // onClick={handleClose}
        >
          <CircularProgress size={80} color="inherit" />
        </Backdrop>
      )}
      
    </div>
  );
};

export default JobPriorityShowRoutes;

