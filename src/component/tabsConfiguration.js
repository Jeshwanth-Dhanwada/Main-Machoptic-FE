import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Edgesdata from "./edgesdata";
import StaffAllocation from "./tabStaffAllocation";
import DeviceMapping from "./tabsDeviceMapping";
import Nodesdata from "./Nodesdata";
import FGmapping from "./FGMapping";
import BottomFGmapping from "./BottomFGMapping";
// import Node
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
        <Box sx={{ p: 0 }}>
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

export default function BasicConfigurationTabs({
  node,
  edge,
  onSaveEdge,
  onClose,
  onSaveNode,
  onCloseNode,
  selectedMenuItem,
  RoutedatafromEdge, 
  selectedId, 
  setSelectedId,
  sidetobottompanel,
  onClick,
  nodeIdselected,
  tableHeight,
  setNewNodes
  
}) {
  const [value, setValue] = useState(0);
  console.log(tableHeight,"tableHeight")

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleTableRowClick = (edgeId) => {
    console.log(edgeId);
    const edge = {edgeId}
    setSelectedId(edge)
  };
  
  useEffect(() => {
    // Set the initial tab value based on sidetobottompanel
    switch (sidetobottompanel) {
      case "Routes":
        setValue(1); // Device Mapping tab
        break;
      case "Staff":
        setValue(2); // Staff Mapping tab
        break;
      case "Material":
        setValue(3); // Device Mapping tab
        break;
      case "Device":
        setValue(4); // Device Mapping tab
        break;
      case "FG Mapping":
        setValue(5); // Device Mapping tab
        break;
      // Add more cases for other values if needed
      default:
        setValue(0); // Default to Nodes tab
    }
  }, [sidetobottompanel]);

  const HandleBottomtoLeftSlide = (item) => {
    console.log(item,"checkk");
    onClick(item);
  }

  // const [newNodes, setNewNodes] = useState()
  const HandleNodestoOperations = (nodes) => {
    setNewNodes(nodes)
    console.log(nodes)
  }
  return (
    <div className="container-fluid">
        <div className="row">
          <div className="col-12 m-0 p-0">
          <Box sx={{ position: "relative" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                style={{background:'#ffffff'}}
              >
                <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#ffffff" }} onClick={() => HandleBottomtoLeftSlide("")} label="Nodes" {...a11yProps(0)} />
                <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 1 ? "#E6ECEF" : "#ffffff" }} onClick={() => HandleBottomtoLeftSlide("Edges")} label="Edges" {...a11yProps(1)} />
                <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 2 ? "#E6ECEF" : "#ffffff" }} onClick={() => HandleBottomtoLeftSlide("Staff Mapping")} label="Staff Mapping" {...a11yProps(2)} />
                <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 3 ? "#E6ECEF" : "#ffffff" }} onClick={() => HandleBottomtoLeftSlide("Raw Material")} label="Raw Material" {...a11yProps(3)} />
                <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 4 ? "#E6ECEF" : "#ffffff" }} onClick={() => HandleBottomtoLeftSlide("Device Mapping")} label="Device Mapping" {...a11yProps(4)} />
                <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 5 ? "#E6ECEF" : "#ffffff" }} onClick={() => HandleBottomtoLeftSlide("FG Mapping")} label="Finished Goods Mapping" {...a11yProps(5)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Nodesdata nodeIdselected={nodeIdselected} tableHeight = {tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1} style={{ overflowY: "scroll" }}>
              <Edgesdata 
                RoutedatafromEdge={RoutedatafromEdge} 
                onClick={handleTableRowClick}
                tableHeight = {tableHeight}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <StaffAllocation tableHeight = {tableHeight} sendtoConfigurations = {HandleNodestoOperations}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              RM Mapping
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
            <DeviceMapping tableHeight = {tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
            <BottomFGmapping tableHeight = {tableHeight}/>
            </CustomTabPanel>
          </Box>

          </div>
        </div>
    </div>
  );
}
