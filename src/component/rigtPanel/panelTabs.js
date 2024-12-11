import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import {
  getJobAssign,
  getOADetails,
  getAttendance,
  getEmployees,
  getNodeMaster,
} from "../../api/shovelDetails";
import { Card } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import Employees from "./employees";
import AssignedJobs from "./jobspanel";
import RightSlider from "../../layout/RightSlider";
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

export default function RightTabPanel({
  nodefromshowRoutes,
  setJobIdSidetoBottom,
}) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(nodefromshowRoutes,"getNodeId")
  function getJobNameById(jobId) {
    const job = Oadetails.find((item) => item.jobId === jobId);
    return job ? job.IT_NAME : "Node Not Found";
  }

  function getEmployeeNamebyID(empId) {
    const emp = Employeedata.find((item) => String(item.empId) === empId);
    return emp ? emp.employeeName : "Node Not Found";
  }

  const [JobAssigndata, setJobAssigndata] = useState([]);
  const [Oadetails, setOadetails] = useState([]);
  const [Attendance, setAttendance] = useState([]);
  const [Employeedata, setEmployeedata] = useState([]);
  const [Nodesdata, setNodesdata] = useState([]);

  const showgetJobAssign = async (key) => {
    const responsedata = await getJobAssign();
    setJobAssigndata(responsedata, key);
  };
  const showOA_details = async (key) => {
    const responsedata = await getOADetails();
    setOadetails(responsedata, key);
  };
  const showAttendance = async (key) => {
    const responsedata = await getAttendance();
    setAttendance(responsedata, key);
  };
  const showEmployees = async (key) => {
    const responsedata = await getEmployees();
    setEmployeedata(responsedata, key);
  };
  const showNodesdata = async (key) => {
    const responsedata = await getNodeMaster();
    setNodesdata(responsedata, key);
  };

  useEffect(() => {
    showgetJobAssign();
    showOA_details();
    showAttendance();
    showEmployees();
    showNodesdata();
  }, []);

  const [expanded, setExpanded] = useState(false);
  const [isExpandedFull, setIsExpandedFull] = React.useState(false);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
    setIsExpandedFull(true);
  };

  // const
  const HandleJobId = (jobId, nodeId) => {
    setJobIdSidetoBottom(jobId, nodeId);
  };
  const getNodeId = Nodesdata.filter(
    (item) => item.id === nodefromshowRoutes
  ).map((item) => item.nodeId);

  const [size, setSize] = useState();
  const HandleIcon = (item) => {
    console.log(item, "KKKK");
    setSize(item);
  };
  return (
    // expanded ? (
    //   <div
    // //   id="dasboard-right-container"
    // //   style={{ position: "fixed", top: "45px" }}
    // //   className={`dashboard-right-container sticky-top ${expanded ? "expanded" : "partial"
    // // }`}
    // >
    //       <div className="pt-2" onClick={handleExpandToggle}>
    //         <KeyboardDoubleArrowRightIcon
    //           style={{
    //                     cursor: "pointer",
    //                     backgroundColor: "#09587C",
    //                     color: '#ffffff',
    //                     position: "fixed",
    //                     right:size ? size :'30%',
    //                     width:'25',height:'47px',
    //                     top:'46px',
    //                     display: 'inline'
    //                   }}
    //           onClick={handleExpandToggle}
    //         />
    //       </div>
    //     <Card
    //       id="dasboard-right-container"
    //       style={{ position: "fixed", top: "45px" }}
    //       className={`dashboard-right-container sticky-top ${expanded ? "expanded" : "partial"
    //         }`}
    //     >
    //       {/* <KeyboardDoubleArrowRightIcon style={{cursor:'pointer'}} /> */}
    //       <RightSlider
    //             isExpandedFull={isExpandedFull}
    //             setIsExpandedFull={setIsExpandedFull}
    //             onclick={HandleIcon}
    //             />
    //       <Box sx={{ position: "relative" }}>
    //         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    //           <Tabs
    //             value={value}
    //             onChange={handleChange}
    //             aria-label="basic tabs example"
    //             style={{background:'#ffffff'}}
    //           >
    //             <Tab style={{ fontSize: '10.5px', fontWeight: 'bold',color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#ffffff" }} label="Jobs" {...a11yProps(0)} />
    //             {/* <Tab label="Inputs" {...a11yProps(1)} />
    //           <Tab label="Outputs" {...a11yProps(2)} /> */}
    //           </Tabs>
    //         </Box>
    //         <CustomTabPanel value={value} index={0}>
    //           <AssignedJobs
    //             JobAssigndata={JobAssigndata}
    //             SendSidetoBottomPanel={HandleJobId}
    //             getNodeId={getNodeId}
    //           />
    //         </CustomTabPanel>
    //         {/* <CustomTabPanel value={value} index={1}>
    //         <Employees Employeedata={Employeedata} />
    //       </CustomTabPanel>
    //       <CustomTabPanel value={value} index={2}>
    //         <div style={{ height: "350px", overflowY: "auto" }}></div>
    //       </CustomTabPanel> */}
    //       </Box>
    //     </Card>
    //   </div>
    // ) : (
    //   <div
    //     id="dasboard-right-container"
    //     style={{ position: "fixed", top: "45px" }}
    //     className={`dashboard-right-container sticky-top partial`}>
    //     <div className="pt-2" onClick={handleExpandToggle}>
    //     {/* <RightSlider isExpandedFull={isExpandedFull} setIsExpandedFull={setIsExpandedFull}/> */}
    //       <KeyboardDoubleArrowLeftIcon
    //         style={{ cursor: "pointer",backgroundColor: "#09587C",
    //         color: '#ffffff',width:'25',height:'47px',position: "fixed",
    //         right:'0%' }}
    //         onClick={handleExpandToggle}
    //       />
    //     </div>
    //   </div>
    // )
  <div>
      <Box sx={{ position: "relative" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            style={{ background: "#ffffff" }}
          >
            <Tab style={{ fontSize: '10.5px', fontWeight: 'bold',color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#ffffff" }} label="Jobs" {...a11yProps(0)} />
            {/* <Tab label="Inputs" {...a11yProps(1)} />
                <Tab label="Outputs" {...a11yProps(2)} /> */}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AssignedJobs
            JobAssigndata={JobAssigndata}
            SendSidetoBottomPanel={HandleJobId}
            getNodeId={getNodeId}
          />
        </CustomTabPanel>
      </Box>
      </div>
  );
}
