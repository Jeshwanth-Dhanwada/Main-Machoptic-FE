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
import JobMapping from "./JobMapping";
import StaffMapping from "./staffMapping";
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

export default function BasicPlanningTabs({
  node,
  setSelectedId,
  onClick,
  nodeIdselected,
  sendtoPlanningtab,
  tableHeight
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleTableRowClick = (edgeId) => {
    console.log(edgeId);
    const edge = {edgeId}
    setSelectedId(edge)
  };
  console.log(nodeIdselected,"nodeIdselected");
  // const HandleNodetoNodesComponent = (item) => {

  // }
  console.log(sendtoPlanningtab);
  useEffect(() => {
    // Set the initial tab value based on sidetobottompanel
    switch (sendtoPlanningtab) {
      case "Job Mapping":
        setValue(0); // Staff Mapping tab
        break;
      case "Staff Mapping":
        setValue(1); // Device Mapping tab
        break;
      // Add more cases for other values if needed
      default:
        setValue(); // Default to Nodes tab
    }
  }, [sendtoPlanningtab]);

  const HandleBottomtoLeftSlide = (item) => {
    console.log(item);
    onClick(item);
  }
  console.log(node);
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
              style={{background:'#FFFFFF'}}
            >
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#FFFFFF"}} onClick={() => HandleBottomtoLeftSlide("Job Mapping")} label="Job Mapping" {...a11yProps(1)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 1 ? "#E6ECEF" : "#FFFFFF"}} onClick={() => HandleBottomtoLeftSlide("Staff Mapping")} label="Staff Mapping" {...a11yProps(2)} />
          </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0} >
            <JobMapping tableHeight={tableHeight}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1} >
          <StaffMapping tableHeight={tableHeight}/>
          </CustomTabPanel>
        </Box>
        </div>
      </div>
    </div>
  );
}
