import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import {
  getAttendance,
  getEmpNodeMapping,
  getEmployees,
  getOADetails,
  getStaffAllocation,
} from "../../api/shovelDetails";
import { Backdrop, Card, CircularProgress } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import AllJobs from "./allJobsPanel";
import NodeState from "./AttendancePanel";
import NodeAllocation from "./nodeAllocation";
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

export default function RightOperationTabPanel({
  selectedMenuItem,
  sendtoPlanningtab,
  toRightOperationTabPanel,
}) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [Oadetails, setOadetails] = useState([]);
  const [Employeedata, setEmployeedata] = useState([]);
  const [staffAllocation, setstaffAllocation] = useState([]);
  const [employeeNodeMap, setemployeeNodeMap] = useState([]);
  const [attendancedata, setattendancedata] = useState([]);
  useEffect(() => {
    showOA_details();
    showgetEmployees();
    showgetStaffAllocation();
    showemployeeNodeMap();
    showAttendance();
  }, []);

  function getEmployeeNamebyID(empId) {
    const emp = Employeedata.find((item) => String(item.empId) === empId);
    return emp ? emp.employeeName : "Node Not Found";
  }
  const [OpenLoader, setOpenLoader] = useState(false);
  const showOA_details = async (key) => {
    setOpenLoader(true);
    const responsedata = await getOADetails();
    setOadetails(responsedata, key);
    setOpenLoader(false);
  };
  // console.log(Oadetails,"30004")
  const showgetEmployees = async (key) => {
    const responsedata = await getEmployees();
    setEmployeedata(responsedata, key);
  };

  const showgetStaffAllocation = async (key) => {
    const responsedata = await getStaffAllocation();
    setstaffAllocation(responsedata, key);
  };

  const showemployeeNodeMap = async (key) => {
    const responsedata = await getEmpNodeMapping();
    setemployeeNodeMap(responsedata, key);
  };
  const showAttendance = async (key) => {
    const responsedata = await getAttendance();
    setattendancedata(responsedata, key);
  };

  const [expanded, setExpanded] = useState(false);
  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  let Attend = [];
  let X = 0;
  for (let i = 0; i < Employeedata.length; i++) {
    const empNodeVal = employeeNodeMap.filter(
      (item) => Employeedata[i].empId == item?.emp?.empId
    );
    Attend.push({
      ...Employeedata[i],
      ...empNodeVal[0],
    });
  }

  const newAttendData = [];
  // Iterate through the Attend data
  Attend.forEach((item) => {
    // Check if the empId is not present in the AttendanceData
    if (
      !attendancedata.some(
        (dataItem) =>
          parseInt(dataItem.empId) === parseInt(item.empId) &&
          dataItem.shiftId == item.shiftId
      )
    ) {
      // If it doesn't match, add it to the newAttendData
      newAttendData.push(item);
    }
  });

  const handlelabel = (label) => {
    sendtoPlanningtab(label);
    console.log(label);
  };

  useEffect(() => {
    switch (toRightOperationTabPanel) {
      case "Job Mapping":
        setValue(1); // Staff Mapping tab
        break;
      case "Staff Mapping":
        setValue(2); // Device Mapping tab
        break;
      // Add more cases for other values if needed
      default:
        setValue(0); // Default to Nodes tab
    }
  }, [toRightOperationTabPanel]);
  const [isExpandedFull, setIsExpandedFull] = React.useState(false);
  const [size, setSize] = useState();
  const HandleIcon = (item) => {
    console.log(item, "KKKK");
    setSize(item);
  };
  return (
    // expanded ? (
    //   <div
    //   // id="dasboard-right-container"
    //   // style={{ position: "fixed", top: "45px" }}
    //   // className={`dashboard-right-container sticky-top ${expanded ? "expanded" : "partial"
    //   //   }`}
    //     >
    //       <div className="pt-2" onClick={handleExpandToggle}>
    //         <KeyboardDoubleArrowRightIcon
    //           style={{
    //                     cursor: "pointer",
    //                     backgroundColor: "#09587C",
    //                     color: '#ffffff',
    //                     position: "fixed",
    //                     right:size ? size : '30%',
    //                     width:'25',height:'47px',
    //                     top:'46px',
    //                     display: 'inline'
    //                   }}
    //           onClick={handleExpandToggle}
    //         />
    //       </div>
    //   <Card
    //     id="dasboard-right-container"
    //     style={{ position: 'fixed', top: '45px' }}
    //     className={`dashboard-right-container sticky-top ${expanded ? 'expanded' : 'partial'}`}>
    //     <RightSlider isExpandedFull={isExpandedFull} setIsExpandedFull={setIsExpandedFull} onclick={HandleIcon}/>
    //     <Box sx={{ position: "relative" }}>
    //       <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    //         <Tabs
    //           value={value}
    //           onChange={handleChange}
    //           aria-label="basic tabs example"
    //           style={{background:'#ffffff'}}
    //         >
    //           <Tab style={{ fontSize: '10.5px', fontWeight: 'bold', color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#ffffff" }} onClick={() => handlelabel("")} label="Attendance" {...a11yProps(0)} />
    //           <Tab style={{ fontSize: '10.5px', fontWeight: 'bold', color:'#727272', backgroundColor: value === 1 ? "#E6ECEF" : "#ffffff" }} onClick={() => handlelabel("Job Mapping")} label="Job Assignment" {...a11yProps(1)} />
    //           <Tab style={{ fontSize: '10.5px', fontWeight: 'bold', color:'#727272', backgroundColor: value === 2 ? "#E6ECEF" : "#ffffff" }} onClick={() => handlelabel("Staff Mapping")} label="Staff Allocation" {...a11yProps(2)} />
    //         </Tabs>
    //       </Box>
    //       <CustomTabPanel value={value} index={0}>
    //         <NodeState />
    //       </CustomTabPanel>
    //       <CustomTabPanel value={value} index={1}>
    //         <AllJobs Oadetails={Oadetails} />
    //       </CustomTabPanel>
    //       <CustomTabPanel value={value} index={2}>
    //         <NodeAllocation />
    //       </CustomTabPanel>
    //     </Box>
    //   </Card>
    //   </div>
    // ) : (
    //   <div
    //     id="dasboard-right-container"
    //     style={{ position: "fixed", top: "45px" }}
    //     className={`dashboard-right-container sticky-top partial`}>
    //     <div className="pt-2" onClick={handleExpandToggle}>
    //       <KeyboardDoubleArrowLeftIcon
    //         style={{ cursor: "pointer", backgroundColor: "#09587C",
    //         color: '#ffffff',width:'25',height:'47px',position: "fixed",
    //         right:'0%'  }}
    //         onClick={handleExpandToggle}
    //       />
    //     </div>
    //     {OpenLoader && (
    //     <Backdrop
    //       sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    //       open={OpenLoader}
    //       // onClick={handleClose}
    //     >
    //       <CircularProgress size={80} color="inherit" />
    //     </Backdrop>
    //     )}
    //   </div>
    // )
    
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 m-0 p-0">
            <Box sx={{ position: "relative" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab style={{ fontSize: '10.5px', fontWeight: 'bold', color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#ffffff" }} onClick={() => handlelabel("")} label="Attendance" {...a11yProps(0)} />
                  <Tab style={{ fontSize: '10.5px', fontWeight: 'bold', color:'#727272', backgroundColor: value === 1 ? "#E6ECEF" : "#ffffff" }} onClick={() => handlelabel("Job Mapping")} label="Job Assignment" {...a11yProps(1)} />
                  <Tab style={{ fontSize: '10.5px', fontWeight: 'bold', color:'#727272', backgroundColor: value === 2 ? "#E6ECEF" : "#ffffff" }} onClick={() => handlelabel("Staff Mapping")} label="Staff Allocation" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <NodeState />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <AllJobs Oadetails={Oadetails} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <NodeAllocation />
              </CustomTabPanel>
            </Box>
          </div>
        </div>
      </div>
  );
}
