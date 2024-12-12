import * as React from "react";
import CommonSideBar from "../component/sideBar";
import { Card } from "@mui/material";
import AppBarContainer from "./appbar";
import "../component/dashboard.css";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import BasicTabs from "../component/tabs";
import Slider from "./slider";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ShowRoutes from "../component/showRoutes";
import HomeComponent from "../component/showNodes";
import { useState } from "react";
import BasicConfigurationTabs from "../component/tabsConfiguration";
import BasicPlanningTabs from "../component/tabsPlanning";
import BottomOperationsTabs from "../component/bottomOperationstab";
import Analyticstab from "../component/Analytics";
import JobPrioritytabs from "../component/JobPrioritytabs";
import JobPriorityGraphs from "../component/JobPriorityGraphs";
import MachinewiseReport from "../component/MachinewiseReport";
import MaterialProductionReport from "../component/MaterialProdReport";
import MaterialWiseReport from "../component/MaterialWiseReport";
import JobStatus from "../component/job_status";
import RawMaterialUpload from "../component/RawMaterialUpload";
import RawMaterialData from "../component/RMDataUpload";
import RMFabricUpload from "../component/RMFabricUpload";
import ItemRefresh from "../component/ItemRefresh";
import JobRefresh from "../component/JobRefresh";
import JobPrioritizing from "../component/JobPrioritizing";
import UserLogin from "../component/login";
import PersistLogin from "../component/PersistLogin";
import AuthContext from "../context/AuthProvider";
import WorkingHourSchedule from "../component/WorkingHourSchedule";
import GantCharts from "../component/gantCharts";
import SveltaTree from "../component/sveltCharts";
import SveltaWithDropDown from "../component/svelteChartsmain";
import CanvasConfig from "../component/CanvasConfig";
import EdgeConfig from "../component/EdgeConfig";
import NodesConfig from "../component/NodesConfig";
import MainMindMap from "../component/mainMindMap";
import AdministrationShowRoutes from "../component/Adminstration";
import PlanningShowRoutes from "../component/Planning";
import OperationsShowRoutes from "../component/Operations";
import JobPriorityShowRoutes from "../component/JobPriority";

// import showNodes

function DashboardLayout(props) {
  const { auth } = React.useContext(AuthContext);

  const [isSideBarExpanded, setIsExpanded] = React.useState(false);
  const [isExpandedFull, setIsExpandedFull] = React.useState(false);
  const [selectedNodes, setSelectedNodes] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(null);
  const [showNodePopup, setNodeShowPopup] = React.useState(null);
  const [selectedNodess, setSelectedNodess] = React.useState(null);
  const [selectedEdge, setSelectedEdge] = React.useState(null);
  const [edges, setEdges] = useState([]); // Make sure to initialize this state properly
  const [nodes, setNodes] = useState([]); // Make sure to initialize this state properly
  const width = isSideBarExpanded ? "100%" : "95%";
  const marginLeft = isSideBarExpanded ? `calc(20% + 8px)` : "73px";
  const footerHeight = isExpandedFull ? "55%" : "10%";
  // const IconfooterHeight = isExpandedFull ? "100%" : "10%";

  const onClosePopup = () => {
    // setShowPopup(false);
    setSelectedEdge(null);
  };
  const onSavePopup = (edge) => {
    // console.log(edge.id, "edgeId");
    // const updatedEdges = edges.map((existingEdge) =>
    //   existingEdge.id === edge.id ? { ...existingEdge, ...edge } : existingEdge
    // );
    setEdges(edge);
    // onClosePopup();
  };

  const onCloseNodePopup = () => {
    setSelectedNodess(null);
    setSelectedNodes(null);
  };
  const onSaveNodePopup = (node) => {
    // const updateNodes = nodes.map(existingNode =>
    //   existingNode.id === node.id ? { ...existingNode, ...node } : existingNode
    // )
    setNodes(node);
    console.log("Saving node:", node);
    // onCloseNodePopup();
  };

  const onEdgeContextMenu = () => {
    setNodeShowPopup(false);
    setShowPopup(true);
  };

  // const onclickedgedata = () =>{

  const onNodeContextMenu = () => {
    setNodeShowPopup(true);
    setShowPopup(false);
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [RoutedatafromEdge, setRoutedatafromEdge] = useState([]);
  const [selectedId, setSelectedId] = useState([]);

  const handleLinkClick = (item) => {
    setSelectedMenuItem(item);
  };

  const [sidetobottompanel, setSidetoBottomPanel] = useState([]);
  const [bottomtosidepanel, setBottomtoSidePanel] = useState([]);
  const [sendtoPlanningtab, setSendtoPlanningtab] = useState([]);
  const [toRightOperationTabPanel, setToRightOperationTabPanel] = useState([]);

  const HandlebottomSlide = (item) => {
    setSidetoBottomPanel(item);
  };

  const HandleBottomtoRight = (item) => {
    setBottomtoSidePanel(item);
  };
  const HandletoRightOperationTabPanel = (item) => {
    console.log(item);
    setToRightOperationTabPanel(item);
  };
  const [nodeIdselected, setnodeIdselected] = useState([]);
  const handleselectednode = (item) => {
    setnodeIdselected(item);
  };

  const [JobfromOperations, setJobtoOperations] = useState([]);
  const HandleJobFromOperations = (item, nodeId) => {
    console.log(item, nodeId);
    setJobtoOperations({ item, nodeId });
  };

  const [JobIdtoJobPriority, setJobIdtoJobPriority] = useState([]);
  const HandlesetjobIdtoJobpriority = (jobId) => {
    setJobIdtoJobPriority(jobId);
    console.log(jobId, "and");
  };

  const [MultipleJobIdtoJobPriority, setMultipleJobIdtoJobPriority] = useState(
    []
  );
  const HandlesetMultiplejobIdtoJobpriority = (multipleJobs) => {
    console.log(multipleJobs, "multipleJobs");
    setMultipleJobIdtoJobPriority(multipleJobs);
  };

  const [SendDatatoJobPriority, setSendDatatoJobPriority] = useState([]);
  const HandlesetdataToBottomJobPriorPanel = (item) => {
    console.log(item, "anddd");
    setSendDatatoJobPriority(item);
    // setJobIdtoJobPriority(item)
  };
  const [sendtoRoutes, setsendtoRoutes] = useState([]);
  const HanldeNewImageNode = (item) => {
    console.log(item, "KKKKKK");
    setsendtoRoutes(item);
  };

  const [tableHeight, settableHeight] = useState([]);
  const HandleHeight = (height) => {
    settableHeight(height);
  };

  const [dateFilter,setDateFilter] = useState()

  const HandleDateFiltering = (date) => {
    console.log(date,"dateFilter")
    setDateFilter(date)
  }

  const [datafromStaffToshowRoutes,setNewNodes] = useState()
  const HandleStaffToshowRoutes = (item) => {
    setNewNodes(item)
    console.log(item)
  }

  // const HandleMultipleJobsToRoutes = (multipleJobs) => {
  //   console.log(multipleJobs,)
  // }

  // const location = useLocation(); // Get the current route
  // const hideComponents = location.pathname === '/Login'; // Determine if the current route is the login page

  return (
    <Router>
      {auth?.accessToken && (
        <CommonSideBar
          isExpanded={isSideBarExpanded}
          setIsExpanded={setIsExpanded}
          handleLinkClick={handleLinkClick}
        />
      )}
      {auth?.accessToken && (
        <AppBarContainer
          class="sticky-top"
          selectedMenuItem={selectedMenuItem}
          setDate = {HandleDateFiltering}
        />
      )}
      <br />
      <div
        className="app-footer-content"
        style={
          auth?.accessToken
            ? { width, marginLeft, position: "fixed" }
            : {
                width: "100%",
                height: "600px",
                position: "absolute",
                top: "0px",
              }
        }
      >
        {isExpandedFull &&
        (selectedMenuItem === "Administration" ||
          selectedMenuItem === "Configuration" ||
          selectedMenuItem === "Planning" ||
          selectedMenuItem === "Operations") ? (
          <Card
            id="dasboard-footer-container"
            className="dashboard-container"
            style={{ height: footerHeight, display: "inline-flex" }}
          >
            <Slider
              isExpandedFull={isExpandedFull}
              setIsExpandedFull={setIsExpandedFull}
              onclick={HandleHeight}
            />
            {selectedMenuItem === "Administration" && (
              <BasicTabs
                isEnabled={isExpandedFull}
                node={selectedNodes}
                edge={selectedEdge}
                setsendtoRoutes={HanldeNewImageNode}
                onSaveEdge={onSavePopup}
                onClose={onClosePopup}
                onSaveNode={onSaveNodePopup}
                onCloseNode={onCloseNodePopup}
                onEdgeContextMenu={onEdgeContextMenu}
                onNodeContextMenu={onNodeContextMenu}
                selectedMenuItem={selectedMenuItem}
                tableHeight={tableHeight}
              />
            )}
            {selectedMenuItem === null && (
              <BasicTabs
                isEnabled={isExpandedFull}
                node={selectedNodes}
                edge={selectedEdge}
                onSaveEdge={onSavePopup}
                onClose={onClosePopup}
                onSaveNode={onSaveNodePopup}
                onCloseNode={onCloseNodePopup}
                onEdgeContextMenu={onEdgeContextMenu}
                onNodeContextMenu={onNodeContextMenu}
                selectedMenuItem={selectedMenuItem}
              />
            )}
            {selectedMenuItem === "Configuration" && (
              <BasicConfigurationTabs
                selectedMenuItem={selectedMenuItem}
                RoutedatafromEdge={RoutedatafromEdge}
                setRoutedatafromEdge={setRoutedatafromEdge}
                selectedId={selectedId}
                nodeIdselected={nodeIdselected}
                setnodeIdselected={setnodeIdselected}
                setSelectedId={setSelectedId}
                sidetobottompanel={sidetobottompanel}
                onClick={HandleBottomtoRight}
                tableHeight={tableHeight}
                setNewNodes = {HandleStaffToshowRoutes}
              />
            )}
            {selectedMenuItem === "Planning" && (
              <BasicPlanningTabs
                selectedMenuItem={selectedMenuItem}
                RoutedatafromEdge={RoutedatafromEdge}
                setRoutedatafromEdge={setRoutedatafromEdge}
                selectedId={selectedId}
                nodeIdselected={nodeIdselected}
                setnodeIdselected={setnodeIdselected}
                setSelectedId={setSelectedId}
                sidetobottompanel={sidetobottompanel}
                onClick={HandletoRightOperationTabPanel}
                sendtoPlanningtab={sendtoPlanningtab}
                tableHeight={tableHeight}
              />
            )}
            {selectedMenuItem === "Operations" && (
              <BottomOperationsTabs JobfromOperations={JobfromOperations} tableHeight={tableHeight}/>
            )}
            {selectedMenuItem === "Priority Job" && (
              <JobPrioritytabs
                JobIdtoJobPriority={JobIdtoJobPriority}
                SendDatatoJobPriority={SendDatatoJobPriority}
                MultipleJobIdtoJobPriority={MultipleJobIdtoJobPriority}
              />
            )}
            <KeyboardDoubleArrowDownIcon
              className="drawer-arrow-icon"
              style={{
                backgroundColor: "#09587C",
                display: "inline",
                color: "#ffffff",
                width: "47",
                height: "25px",
                position: "fixed",
              }}
              onClick={() => setIsExpandedFull(false)}
            />
            {/* bottom:tableHeight ? tableHeight : '270px' */}
          </Card>
        ) : (
          <div
            id="dasboard-footer-container"
            className="dashboard-container"
            style={{ height: footerHeight }}
          >
            {selectedMenuItem === "Operations" && (
              <KeyboardDoubleArrowUpIcon
                className="drawer-arrow-icon"
                id="ArrowIcon"
                onClick={() => setIsExpandedFull(true)}
              />
            )}
            {selectedMenuItem === "Planning" && (
              <KeyboardDoubleArrowUpIcon
                className="drawer-arrow-icon"
                id="ArrowIcon"
                onClick={() => setIsExpandedFull(true)}
              />
            )}
            {selectedMenuItem === "Configuration" && (
              <KeyboardDoubleArrowUpIcon
                className="drawer-arrow-icon"
                id="ArrowIcon"
                onClick={() => setIsExpandedFull(true)}
              />
            )}
            {selectedMenuItem === "Administration" && (
              <KeyboardDoubleArrowUpIcon
                className="drawer-arrow-icon"
                id="ArrowIcon"
                onClick={() => setIsExpandedFull(true)}
              />
            )}
          </div>
        )}
        <div>
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route element={<PersistLogin />}>
              {/* Add more routes as needed */}
              <Route
                path="/ShowRoutes"
                element={
                  <ShowRoutes
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                    selectedEdge={selectedEdge}
                    edgeData={edges}
                    nodeData={nodes}
                    setSelectedEdge={setSelectedEdge}
                    selectedMenuItem={selectedMenuItem}
                    showPopup={showPopup}
                    showNodePopup={showNodePopup}
                    setNodeShowPopup={setNodeShowPopup}
                    setShowPopup={setShowPopup}
                    RoutedatafromEdge={RoutedatafromEdge}
                    setRoutedatafromEdge={setRoutedatafromEdge}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    onClick={HandlebottomSlide}
                    bottomtosidepanel={bottomtosidepanel}
                    senddatatoNodes={handleselectednode}
                    nodeIdselected={nodeIdselected}
                    setnodeIdselected={setnodeIdselected}
                    sendtoPlanningtab={sendtoPlanningtab}
                    setSendtoPlanningtab={setSendtoPlanningtab}
                    setJobfromOperations={HandleJobFromOperations}
                    toRightOperationTabPanel={toRightOperationTabPanel}
                    setjobIdtoJobpriority={HandlesetjobIdtoJobpriority}
                    setMultiplejobIdtoJobpriority={
                      HandlesetMultiplejobIdtoJobpriority
                    }
                    setdataToBottomJobPriorPanel={
                      HandlesetdataToBottomJobPriorPanel
                    }
                    sendtoRoutes={sendtoRoutes}
                    datafromdatafromchild = {datafromStaffToshowRoutes}
                  />
                }
              />
              <Route
                path="/showNodes"
                element={
                  <HomeComponent
                    selectedNodess={selectedNodess}
                    setSelectedNodes={setSelectedNodess}
                  />
                }
              />
              <Route path="/Analytics" element={<Analyticstab />} />
              <Route
                path="/JobPriorityGraphs"
                element={<JobPriorityGraphs />}
              />
              <Route
                path="/MachinewiseReport"
                element={<MachinewiseReport />}
              />
              <Route
                path="/MaterialWiseReport"
                element={<MaterialWiseReport />}
              />
              <Route
                path="/MaterialProductionReport"
                element={<MaterialProductionReport />}
              />
              <Route path="/job_status" element={<JobStatus />} />
              <Route
                path="/RawMaterialUpload"
                element={<RawMaterialUpload />}
              />
              <Route path="/RMDataUpload" element={<RawMaterialData />} />
              <Route path="/RMFabricUpload" element={<RMFabricUpload />} />
              <Route path="/itemRefresh" element={<ItemRefresh />} />
              <Route path="/jobRefresh" element={<JobRefresh />} />
              <Route path="/jobPrioritizing" element={<JobPrioritizing />} />
              <Route
                path="/WorkingHourSchedule"
                element={<WorkingHourSchedule />}
              />
              <Route path="/gantCharts" element={<GantCharts />} />
              <Route path="/sveltCharts" element={<SveltaTree />} />
              <Route
                path="/SveltaWithDropDown"
                element={<SveltaWithDropDown />}
              />
              <Route path="/CanvasConfig" element={<CanvasConfig />} />
              <Route path="/EdgeConfig" element={<EdgeConfig />} />
              <Route path="/NodesConfig" element={<NodesConfig />} />
              <Route path="/MainMindMap" element={<MainMindMap />} />
              <Route
                path="/administration"
                element={
                  <AdministrationShowRoutes
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                    selectedEdge={selectedEdge}
                    edgeData={edges}
                    nodeData={nodes}
                    setSelectedEdge={setSelectedEdge}
                    selectedMenuItem={selectedMenuItem}
                    showPopup={showPopup}
                    showNodePopup={showNodePopup}
                    setNodeShowPopup={setNodeShowPopup}
                    setShowPopup={setShowPopup}
                    RoutedatafromEdge={RoutedatafromEdge}
                    setRoutedatafromEdge={setRoutedatafromEdge}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    onClick={HandlebottomSlide}
                    bottomtosidepanel={bottomtosidepanel}
                    senddatatoNodes={handleselectednode}
                    nodeIdselected={nodeIdselected}
                    setnodeIdselected={setnodeIdselected}
                    sendtoPlanningtab={sendtoPlanningtab}
                    setSendtoPlanningtab={setSendtoPlanningtab}
                    setJobfromOperations={HandleJobFromOperations}
                    toRightOperationTabPanel={toRightOperationTabPanel}
                    setjobIdtoJobpriority={HandlesetjobIdtoJobpriority}
                    setMultiplejobIdtoJobpriority={
                      HandlesetMultiplejobIdtoJobpriority
                    }
                    setdataToBottomJobPriorPanel={
                      HandlesetdataToBottomJobPriorPanel
                    }
                    sendtoRoutes={sendtoRoutes}
                  />
                }
              />
              <Route
                path="/planning"
                element={
                  <PlanningShowRoutes
                    dateFilter={dateFilter}
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                    selectedEdge={selectedEdge}
                    edgeData={edges}
                    nodeData={nodes}
                    setSelectedEdge={setSelectedEdge}
                    selectedMenuItem={selectedMenuItem}
                    showPopup={showPopup}
                    showNodePopup={showNodePopup}
                    setNodeShowPopup={setNodeShowPopup}
                    setShowPopup={setShowPopup}
                    RoutedatafromEdge={RoutedatafromEdge}
                    setRoutedatafromEdge={setRoutedatafromEdge}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    onClick={HandlebottomSlide}
                    bottomtosidepanel={bottomtosidepanel}
                    senddatatoNodes={handleselectednode}
                    nodeIdselected={nodeIdselected}
                    setnodeIdselected={setnodeIdselected}
                    sendtoPlanningtab={sendtoPlanningtab}
                    setSendtoPlanningtab={setSendtoPlanningtab}
                    setJobfromOperations={HandleJobFromOperations}
                    toRightOperationTabPanel={toRightOperationTabPanel}
                    setjobIdtoJobpriority={HandlesetjobIdtoJobpriority}
                    setMultiplejobIdtoJobpriority={
                      HandlesetMultiplejobIdtoJobpriority
                    }
                    setdataToBottomJobPriorPanel={
                      HandlesetdataToBottomJobPriorPanel
                    }
                    sendtoRoutes={sendtoRoutes}
                  />
                }
              />
              <Route
                path="/operations"
                element={
                  <OperationsShowRoutes
                    dateFilter={dateFilter}
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                    selectedEdge={selectedEdge}
                    edgeData={edges}
                    nodeData={nodes}
                    setSelectedEdge={setSelectedEdge}
                    selectedMenuItem={selectedMenuItem}
                    showPopup={showPopup}
                    showNodePopup={showNodePopup}
                    setNodeShowPopup={setNodeShowPopup}
                    setShowPopup={setShowPopup}
                    RoutedatafromEdge={RoutedatafromEdge}
                    setRoutedatafromEdge={setRoutedatafromEdge}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    onClick={HandlebottomSlide}
                    bottomtosidepanel={bottomtosidepanel}
                    senddatatoNodes={handleselectednode}
                    nodeIdselected={nodeIdselected}
                    setnodeIdselected={setnodeIdselected}
                    sendtoPlanningtab={sendtoPlanningtab}
                    setSendtoPlanningtab={setSendtoPlanningtab}
                    setJobfromOperations={HandleJobFromOperations}
                    toRightOperationTabPanel={toRightOperationTabPanel}
                    setjobIdtoJobpriority={HandlesetjobIdtoJobpriority}
                    setMultiplejobIdtoJobpriority={
                      HandlesetMultiplejobIdtoJobpriority
                    }
                    setdataToBottomJobPriorPanel={
                      HandlesetdataToBottomJobPriorPanel
                    }
                    sendtoRoutes={sendtoRoutes}
                  />
                }
              />
              <Route
                path="/jobPriority"
                element={
                  <JobPriorityShowRoutes
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                    selectedEdge={selectedEdge}
                    edgeData={edges}
                    nodeData={nodes}
                    setSelectedEdge={setSelectedEdge}
                    selectedMenuItem={selectedMenuItem}
                    showPopup={showPopup}
                    showNodePopup={showNodePopup}
                    setNodeShowPopup={setNodeShowPopup}
                    setShowPopup={setShowPopup}
                    RoutedatafromEdge={RoutedatafromEdge}
                    setRoutedatafromEdge={setRoutedatafromEdge}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    onClick={HandlebottomSlide}
                    bottomtosidepanel={bottomtosidepanel}
                    senddatatoNodes={handleselectednode}
                    nodeIdselected={nodeIdselected}
                    setnodeIdselected={setnodeIdselected}
                    sendtoPlanningtab={sendtoPlanningtab}
                    setSendtoPlanningtab={setSendtoPlanningtab}
                    setJobfromOperations={HandleJobFromOperations}
                    toRightOperationTabPanel={toRightOperationTabPanel}
                    setjobIdtoJobpriority={HandlesetjobIdtoJobpriority}
                    setMultiplejobIdtoJobpriority={
                      HandlesetMultiplejobIdtoJobpriority
                    }
                    setdataToBottomJobPriorPanel={
                      HandlesetdataToBottomJobPriorPanel
                    }
                    sendtoRoutes={sendtoRoutes}
                  />
                }
              />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default DashboardLayout;
