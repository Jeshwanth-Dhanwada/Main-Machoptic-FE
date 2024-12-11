/* eslint-disable import/no-anonymous-default-export */
import Dagre from "@dagrejs/dagre";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  useReactFlow
} from "reactflow";
import {ReactFlowProvider} from "react-flow-renderer"
import "./dashboard.css"

import "reactflow/dist/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import customNodeSelect from "./nodeTypes/customNodeSelect.js";
import iconNode from "./nodeTypes/iconNode.js";
import { getFormattedParametes, getHoursFiltered, getNodesEdgesFormatted, getNodesEdgesFormattedMines, getParameterNodesEdges } from "../utils/commonFunctions.js";
import ShowelNodeAction from "./showelNodeActionBar.js";
import { getEmployees, getShovels, getTrucks, minePlanData, parameterDetails } from "../api/shovelDetails.js";
import { getAllSoultions } from "../api/allsolutiions.js";
import DrawerComponent from "./drawer.js";
import RightTabPanel from "./rigtPanel/panelTabs.js";
import { Card } from "@mui/material";
import { NODE_HEIGHT, NODE_WIDTH } from "../constants/chartlConstants.js";
import Draggable from "./rigtPanel/draggableComponent.js";
import ConfirmModal from "./commonComponents/confirmModal.js";
// import { Tooltip as BsTooltip } from "bootstrap"
const connectionLineStyle = { stroke: "black" };
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const proOptions = { hideAttribution: true };

const nodeTypes = {
  selectorNode: customNodeSelect,
  iconNode: iconNode
};

const ShovelNodesView = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [solutionOptions, setSolutionOptions] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [selectedSolutions, setSelectedSolutions] = useState([18, 20]);
  const [mineSelected, setMineSelected] = useState();
  const [memeOptions, setMemeOptions] = useState([])
  const [allExcScenarios, setAllExcScenarios] = useState({})
  const [allSolutions, setAllSolutions] = useState({})
  const [tabSelected, setTabSelected] = useState(-1);
  const [expandedNodes, setExpandedNodes] = useState({ root: false, shovel: {}, hour: {}, sol: {} });
  const [selectedNode, setSelectedNode] = useState("");
  const [toggle, setToggle] = useState(false);
  const [filterOption, setFilterOption] = React.useState(["Best 5", "Worst 5"])
  const [nodesCount, setNodesCount] = useState(3)
  const [parameterType, setParameterType] = useState("Queue")
  const { setViewport } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmps, setFilteredEmps] = useState([])
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showAlert, setShowAlert] = useState(false)
  // for maintaining nodes of collapse and expand
  let nodesToHide = [];
  const updateNodes = (updatedNodes, updatedEdges) => {
    setNodes(updatedNodes)
    setEdges(updatedEdges)
  }

  const refreshNodes = (updatedNodes, updatedEdges) => {
    updateNodes([], [])
    setTimeout(() => {
      updateNodes(updatedNodes, updatedEdges)
    }, 100);
  }

  const getChildNodes = (nodeId) => {
    const childNodes = edges.filter(a => a.source === nodeId).map(x => x.target);
    if (childNodes.length) {
      for (let i = 0; i < childNodes.length; i++) {
        nodesToHide.push(childNodes[i])
        getChildNodes(childNodes[i])
      }
    }
  }

  useEffect(() => {
    if (tabSelected === 0) showShovels("name", filterOption);
    if (tabSelected === 1) showTrucks("Truck", filterOption);
    if (tabSelected === 2) showMinePlans("MinePlan", filterOption);
    if (tabSelected === 3) parameters(filterOption);
    setViewport({ x: 1300, y: 400, zoom: 2 });
  }, [toggle])

  const onIconDoubbleClick = (e, data) => {
    const employee = allEmployees.find(a => a.empId == data.id);
    setFilteredEmps((emps) => ([...emps, {...employee}]));
  }

  const showMineplanDetails = (apiDetails, groupByKey, filterType) => {
    const { shovelNodes, shovelEdges } = getNodesEdgesFormattedMines(apiDetails, selectedSolutions, groupByKey, onDoubbleClick, filterType)
    refreshNodes(shovelNodes, shovelEdges)
  }

  const showParameterDetails = (apiDetails, filterType, key) => {
    console.time("Create structure");
    const selectedMineId = memeOptions.find(a => a.MineName === mineSelected).id;
    const { shovelNodes, shovelEdges } = getParameterNodesEdges(apiDetails, selectedSolutions, onDoubbleClick, filterType, key, expandedNodes, allExcScenarios, selectedMineId)
    refreshNodes(shovelNodes, shovelEdges)
    console.timeEnd("Create structure");
  }

  const showSelectedDetails = (apiDetails, groupByKey, filterType) => {
    const { shovelNodes, shovelEdges } = getNodesEdgesFormatted(apiDetails, selectedSolutions, groupByKey, onDoubbleClick, filterType)
    refreshNodes(shovelNodes, shovelEdges)
  }

  const showShovels = async (key, filterType) => {
    const responseData = await getShovels();
    showSelectedDetails(responseData, key, filterType)
    setExpandedNodes({ root: false, shovel: {}, hour: {}, sol: {} })
  }

  const parameters = async(filterType) => {
    let allParams;
    if(kpiData.length) {
      allParams = kpiData;
    }
    else {
      console.time("API");
      allParams =  await parameterDetails();
      setKpiData(allParams)
      console.timeEnd("API");
    }
    console.time("Format");
    const allParametrs = getFormattedParametes(allParams, parameterType, expandedNodes);
    console.timeEnd("Format");
    showParameterDetails(allParametrs, filterType, parameterType);
  }

  const showMinePlans = async (key, filterType) => {
    const mines = await minePlanData(key, filterType);
    showMineplanDetails(mines, key, filterType)
    setExpandedNodes({ root: false, shovel: {}, hour: {}, sol: {} })
  }

  const showTrucks = async (key, filterType) => {
    const responseData = await getTrucks();
    showSelectedDetails(responseData, key, filterType)
    setExpandedNodes({ root: false, shovel: {}, hour: {}, sol: {} })
  }

  useEffect(() => {
    if (mineSelected) {
      const mineId = memeOptions.find(a => a.MineName === mineSelected).id
      setSolutionOptions(allSolutions[mineId])
      setSelectedSolutions(["", ""])
    }
  }, [mineSelected])

  const getSolutionsDetails = async () => {
    const { availablemines, solutions, executionScenarios } = await getAllSoultions();
    const employees = await getEmployees();
    setAllEmployees(employees)
    setFilteredEmps(employees)
    setMemeOptions(availablemines);
    setAllSolutions(solutions);
    setAllExcScenarios(executionScenarios);
    // setSolutionOptions(ExecutionID)
  }

  useEffect(() => {
    // Fetch data from the API when the component mounts
    getSolutionsDetails()
  }, []);

  const collapseNodes = (nodeId) => {
    nodesToHide = [];
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
    let isNodeExpanding;
    const childrens = edges.filter(a => a.source === data.id && !a.hidden).map(x => x.target);
    const isNotCollapsed = childrens.length ? childrens.every(a => nodes.some(s => s.id === a && !s.hidden)) : false
    if (isNotCollapsed) {
      collapseNodes(data.id)
      isNodeExpanding = false;
    }
    else {
      expandNode(data.id);
      isNodeExpanding = true;
    }
    const id = data.id.split("-").slice(-2).join("-");
    if (data.id.includes("root")) {
      if (isNodeExpanding) setExpandedNodes((prev) => ({ ...prev, root: isNodeExpanding }))
      else setExpandedNodes({ root: isNodeExpanding, shovel: {}, hour: {}, sol: {} })
    }
    else if (data.id.includes("shovel-SHOVEL")) {
      if (isNodeExpanding) setExpandedNodes((prev) => ({ ...prev, shovel: { ...prev.shovel, [id]: isNodeExpanding } }));
      else setExpandedNodes((prev) => ({ ...prev, hour: getHoursFiltered(prev.hour, data.id), shovel: { ...prev.shovel, [id]: isNodeExpanding } }));
    } else if (data.id.includes("hour-")) {
      setExpandedNodes((prev) => ({ ...prev, hour: { ...prev.hour, [`${id}`]: isNodeExpanding } }));
    }
  }
  // to update the nodes and edges present in event ahndler
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map(node => {
        if(node.parentId) node.data.onIconDoubbleClick = onIconDoubbleClick
        else node.data.onDoubbleClick = onDoubbleClick
        return node;
      }))
  }, [edges, selectedNode])

  const handleChangeMine = (value) => {
    setMineSelected(value)
  }

  const handleSolutionSelection = (sol, index) => {
    if (index === 0) setSelectedSolutions([sol, selectedSolutions[1] || ""])
    else setSelectedSolutions([selectedSolutions[0] || "", sol])
  }

  useEffect(() => {
    if (tabSelected > 0) {
      parameters(filterOption)
    }
  }, [parameterType])

  const actionCallBack = (type, value, index) => {
    if (type === "nodesCount") setNodesCount(value)
    if (type === "updateParameterType") setParameterType(value)
    if (type === "updateFilter") {
      if (filterOption.includes(value)) setFilterOption(filterOption.filter((a) => a !== value));
      else setFilterOption((a) => ([...a, value]));
    }
    if (type === "Go") {
      setTabSelected(0);
      setToggle(!toggle);
    }
    if (type === "changeMine") handleChangeMine(value);
    if (type === "selectSolution") handleSolutionSelection(value, index);
    if (type === "clearsolution") {
      setSelectedSolutions(["", ""]);
      setMineSelected("");
      setNodes([])
      setEdges([]);
      setTabSelected(-1);
      setFilterOption("Best 5", "Worst 5")
    }
    if (type === "updateTab") {
      setTabSelected(value);
      setToggle(!toggle);
    }
  }

  const drawerCallBacks = (type) => {
    if (type === "closeDrawer") setSelectedNode("")
  }

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    setSelectedNode(node);
  }

  const actionProps = {
    solutionOptions,
    actionCallBack,
    tabSelected,
    memeOptions,
    mineSelected,
    selectedSolutions,
    filterOption,
    nodesCount,
    parameterType
  }

  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const empData = JSON.parse(event.dataTransfer.getData("application/reactflow") || "{}");
    const {x,y} = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const minX=-10,minY=-20,maxX=NODE_WIDTH-20,maxY=15;
    const parentNode = nodes.find(({position:{x:ox, y:oy}}) => x >= ox+minX && x <= ox+maxX && y >= oy+minY && y <= oy+maxY )
    if(parentNode) {
      const assignedUser = nodes.find(a => a.parenId === parentNode.id);
      if(assignedUser) {
        setShowAlert({empId:empData.empId, userName:empData.userName, parentId: parentNode.id, parentPos:{...parentNode.position}, 
          oldUserId:assignedUser.id, oldUserName:assignedUser.data.label, machineName:parentNode.data.label.split("(")[0]});
      }
      else {
        const newNode = {
          parenId:parentNode.id,
          id: empData.empId + "",
          position: {},
          type:"iconNode",
          sourcePosition: "right",
          targetPosition: "left",
          height:20,
          width:20,
          style:{
            zIndex:1001
          },
          data: { label: empData.userName, onIconDoubbleClick: onIconDoubbleClick },
        };
        newNode.position.x = parentNode.position.x+NODE_WIDTH-30;
        newNode.position.y = parentNode.position.y + NODE_HEIGHT-30;
        setFilteredEmps((emps) => emps.filter(a => a.empId !== empData.empId));
        setNodes((es) => es.concat(newNode));
      }
    }
  };
  
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const closeConfirmModal = (replaceEmployee) => {
    setShowAlert(null);
    if(replaceEmployee) {
      const oldEmp = allEmployees.find(a => showAlert.oldUserId == a.empId);
      setFilteredEmps((emps) => emps.map(emp => {
        if(emp.empId === showAlert.empId) return {...oldEmp}
        return emp;
      }))
      setNodes((nodes) => nodes.map((node) => {
        if(node.parentId == showAlert.parentId) {
          return {
            ...node,
            id: showAlert.empId + "",
            data: { label: showAlert.userName, onIconDoubbleClick: onIconDoubbleClick },
          }
        }
        return node
      }))
    }
  }

  return (
    <>
      {/* {selectedNode && <DrawerComponent selectedNode={selectedNode} drawerCallBacks={drawerCallBacks} anchor="right" />} */}
      <ShowelNodeAction {...actionProps} />
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "100%",
            transition: "width 0.1s",
            zIndex: 1,
            backgroundColor: "transparent"
          }}
        >
          <div className="dndflow">
            <ReactFlowProvider>
              <div
                ref={reactFlowWrapper}
                style={{ height: 490, width: "100%", overflow: "hidden", direction: 'ltr' }}
              >
                <ReactFlow
                  nodes={nodes}
                  // onNodesChange={onNodesChange}
                  proOptions={proOptions} // reactflow watermark remove
                  nodeTypes={nodeTypes}
                  edges={edges}
                  onInit={setReactFlowInstance}
                  snapToGrid={true}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  fitView
                  fitViewOptions={{ padding: 3, duration: 1000 }}
                  style={{ width: "100%", height: "100%" }}
                  connectionLineStyle={connectionLineStyle}
                  onNodeContextMenu={onNodeContextMenu}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                >
                  <Background variant="lines" />
                 {selectedNode && <Card id="dasboard-right-container" className='dashboard-right-container'>
                    <RightTabPanel employees={filteredEmps} />
                  </Card>}
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </div>
        </div>
        <ToastContainer />
        {showAlert && <ConfirmModal nodeData={showAlert} closeConfirmModal={closeConfirmModal} />}
      </div>
    </>
  );
};

export default ShovelNodesView;