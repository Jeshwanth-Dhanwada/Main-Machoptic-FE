// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemButton from '@mui/material/ListItemButton';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import CloseIcon from '@mui/icons-material/Close';
// import Slide from '@mui/material/Slide';
// import { BASE_URL } from '../constants/apiConstants';
// import axios from 'axios';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// export default function FullScreenDialog({FullNodeDetails,onClose,FullNodeData}) {
//   const [open, setOpen] = React.useState(FullNodeDetails);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const getFormattedToday = () => {
//           const today = new Date();
//           const year = today.getFullYear();
//           const month = String(today.getMonth() + 1).padStart(2, "0");
//           const day = String(today.getDate()).padStart(2, "0");
//           return `${year}-${month}-${day}`;
//       }
//   const handleClose = () => {
//     setOpen(false);
//     onClose(false)
//   };

//   const [fromDate, setFromDate] = React.useState(null);
//   const [toDate, setToDate] = React.useState([]);
//   const [selectedNodes, setSelectedNodes] = React.useState([]);

//   const [nodemaster, setnodemaster] = React.useState([]);

//   // Fetching nodemaster Details ----------
//   React.useEffect(() => {
//           // Fetch data from the API when the component mounts
//           const apiUrl = `${BASE_URL}/api/nodeMaster`;
//           axios
//               .get(apiUrl)
//               .then((response) => {
//                   setnodemaster(response.data);
//           //         const nodes = response.data.map((item) => item?.nodeId);
//           //         setSelectedNodes(nodes);
//                   // console.log(response.data);
//               })
//               .catch((error) => {
//                   console.error("Error fetching data:", error);
//               });
//       }, []);

//   const getMachineNodes = () => {
//           return nodemaster.filter((item) => item?.nodeType == "Machine");
//       };

//       const toggleNodes = (item) => {
//           if (selectedNodes.includes(item)) {
//               setSelectedNodes(selectedNodes.filter((val) => val !== item));
//           } else {
//               setSelectedNodes([...selectedNodes, item]);
//           }
//       };
//   return (
//     <React.Fragment>
//       {/* <Button variant="outlined" onClick={handleClickOpen}>
//         Open full-screen dialog
//       </Button> */}
//       <Dialog
//         fullScreen
//         open={open}
//         onClose={handleClose}
//         TransitionComponent={Transition}
//       >
//         <AppBar sx={{ position: 'relative' }}>
//           <Toolbar>
//             {/* <IconButton
//               edge="start"
//               color="inherit"
//               onClick={handleClose}
//               aria-label="close"
//             >
//               <CloseIcon />
//             </IconButton> */}
//             <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
//             {FullNodeData.nodeId} - {FullNodeData.data.label}
//             </Typography>
//             <Button autoFocus color="inherit" onClick={handleClose}>
//              <CloseIcon />
//             </Button>
//           </Toolbar>
//         </AppBar>
//         <List>
//           {/* <ListItemButton>
//             <ListItemText primary="Phone ringtone" secondary="Titania" />
//           </ListItemButton>
//           <Divider />
//           <ListItemButton>
//             <ListItemText
//               primary="Default notification ringtone"
//               secondary="Tethys"
//             />
//           </ListItemButton> */}
//           <div className='container-fluid'>
//           <div className="row p-2">
//                     <div className="col-2 d-flex align-items-center">
//                     <span>FromDate </span>:
//                         <input
//                         type="date"
//                         value={fromDate}
//                         className="form-control"
//                         max={getFormattedToday()}
//                         onChange={(e) => {
//                             setFromDate(e.target.value);
//                         }}
//                         // style={{ border: 'none',fontSize:'13px',  backgroundColor: 'whitesmoke', paddingRight: "10px" }}
//                     />
//                     </div>
//                     <div className="col-2 d-flex align-items-center">
//                     <span>ToDate </span>:
//                         <input
//                         type="date"
//                         value={toDate}
//                         max={getFormattedToday()}
//                         className="form-control"
//                         disabled={fromDate ? false : true}
//                         onChange={(e) => {
//                             setToDate(e.target.value);
//                         }}
//                         // style={{ border: 'none',fontSize:'13px', width: '120px', height: '25px', backgroundColor: 'whitesmoke' }}
//                     />
//                     </div>

//                     <div className="col-3 pt-1">
//                         {/* <button className="btn" style={{backgroundColor:'#022A3A',color:'#ffffff'}} onClick={downloadReport}> Download Report</button>  */}
//                     </div>
//                 </div>
//                     <div className='row'>
//                               <div className='col-12'>
//                                         <table className='table table-bordered table-striped'>
//                                                   <thead>
//                                                             <tr>
//                                                                       <th>Date</th>
//                                                                       <th>Job</th>
//                                                                       <th>Output Quantity</th>
//                                                                       <th>Waste</th>
//                                                                       <th>Operator</th>
//                                                                       <th>Batch Id</th>
//                                                             </tr>
//                                                   </thead>
//                                         </table>
//                               </div>
//                     </div>
//           </div>
//         </List>
//       </Dialog>
//     </React.Fragment>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  FullNodeDetails,
  onClose,
  FullNodeData,
}) {
  const [open, setOpen] = React.useState(FullNodeDetails);

  const [OA_details, setOA_details] = useState([]);
  const [itemmaster, setitemmaster] = useState([]);
  const [batchData, setbatchData] = useState([]);
  const [nodemaster, setnodemaster] = useState([]);
  const [ActivityLog, setActivityLog] = useState([]);
  const [reportData, setReportsData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);

  // Fetching OA Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/OA_DETRoute`;
    axios
      .get(apiUrl)
      .then((response) => {
        setOA_details(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Itemmaster Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/itemmaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setitemmaster(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching nodemaster Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setnodemaster(response.data);
        const nodes = response.data.map((item) => item?.nodeId);
        setSelectedNodes(nodes);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching batch Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/batch`;
    axios
      .get(apiUrl)
      .then((response) => {
        setbatchData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Activity Log ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/activitylog`;
    axios
      .get(apiUrl)
      .then((response) => {
        setActivityLog(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    setReportData();
  }, [fromDate, toDate, selectedNodes]);

  const isNotWaste = (value) => {
    const data = nodemaster.filter((item) => item?.nodeId == value.MaterialId);
    return data[0]?.nodeCategory !== "Waste";
  };


  const getFormattedToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDesc = (nodeId) => {
    const data = nodemaster.filter((item) => item?.nodeId == nodeId)[0];
    return data?.nodeName;
  };

  const getJobDesc = (jobId) => {
    const job = OA_details.find((item) => item.jobId == jobId);
    return job ? job.IT_NAME : "Not Found";
  };

  const setDetailsForReport = (inputDetails, outputDetails) => {
    console.log(inputDetails, "inputDetails");
    console.log(outputDetails, "");
    return {
      JobId: inputDetails?.jobId ? inputDetails?.jobId : "",
      "Job Desc": inputDetails?.jobId ? getJobDesc(inputDetails?.jobId) : "",
      MaterialName: inputDetails?.MaterialId
        ? getDesc(inputDetails?.MaterialId)
        : "",
      "Machine Name": inputDetails?.MachinenodeId
        ? getDesc(inputDetails?.MachinenodeId)
        : getDesc(outputDetails?.MachinenodeId),
      Date: inputDetails?.date ? inputDetails?.date : "",
      BatchId: inputDetails?.activityId ? inputDetails?.activityId : "",
      "Quantity(m)": inputDetails?.Consumedquantity1
        ? inputDetails?.Consumedquantity1
        : "",
      "Quantity(kgs)": inputDetails?.Consumedquantity2
        ? inputDetails?.Consumedquantity2
        : "",
      "Job Id": outputDetails?.jobId ? outputDetails?.jobId : "",
      "Material Name": outputDetails?.MaterialId
        ? getDesc(outputDetails?.MaterialId)
        : "",
      "Batch Id": outputDetails?.activityId ? outputDetails?.activityId : "",
      "Quantity (m)": outputDetails?.Balancequantity1
        ? outputDetails?.Balancequantity1
        : "",
      "Quantity (kgs)": outputDetails?.Balancequantity2
        ? outputDetails?.Balancequantity2
        : "",
      StartTime: outputDetails?.startTime ? outputDetails?.startTime : "",
      EndTime: outputDetails?.endTime ? outputDetails?.endTime : "",
    };
  };

  const getUpdatedReport = (inputDetails, outputDetails) => {
    let updatedReport = [];
    for (let i = 0; i < inputDetails.length; i++) {
      const item = inputDetails[i];
      const inputDetail = [inputDetails[i]]; //inputDetails.filter((item1) => item.jobId === item1.jobId && item?.consumedActivityId === item1?.consumedActivityId);
      const outputDetail = outputDetails.filter(
        (item1) =>
          item?.jobId === item1.jobId &&
          item?.consumedActivityId == item1?.activityId
      );
      const data =
        inputDetail?.length > outputDetail.length ? outputDetail : inputDetail;
      for (let j = 0; j < data.length; j++) {
        updatedReport.push(
          setDetailsForReport(inputDetail[j], outputDetail[j])
        );
      }
      if (outputDetail?.length > data?.length) {
        for (let j = data?.length; j < outputDetail.length; j++) {
          updatedReport.push(setDetailsForReport([], outputDetail[j]));
        }
      } else {
        for (let j = data?.length; j < inputDetail.length; j++) {
          updatedReport.push(setDetailsForReport(inputDetail[j], []));
        }
      }
      const length = updatedReport.length - 1;
      const lastReport = updatedReport[length];
      updatedReport = [
        ...updatedReport.slice(0, length),
        { ...lastReport, border: true },
      ];
    }
    return updatedReport;
  };

  console.log(fromDate)
  console.log(toDate)
  const setReportData = () => {
    const inputDetails = ActivityLog.map((item) => {
      const matchedData = batchData.filter(
        (data) =>
          selectedNodes.includes(+item?.nodeId) &&
          item?.date >= fromDate &&
          item?.date <= toDate &&
          item?.id == data?.consumedActivityId &&
          item?.jobId == data?.jobId 
          // && item?.MachinenodeId == FullNodeData?.nodeId
      );
      return matchedData.map((value) => ({
        ...value,
        date: item?.date,
        startTime: new Date(item?.shiftStartTime).toLocaleString(),
        endTime: new Date(item?.shiftEndTime).toLocaleString(),
        //activityId: item?.id,
      }));
    }).flat();

    const filterInputDetails  = inputDetails.filter((item)=>item.MachinenodeId == FullNodeData.nodeId)
    let wasteData = [];
    let outputDetails = ActivityLog.map((item) => {
      const matchedData = batchData.filter(
        (data) =>
          selectedNodes.includes(+item?.nodeId) &&
          item?.date >= fromDate &&
          item?.date <= toDate &&
          item?.id == data?.activityId?.split("-")[0] &&
          !data?.consumedActivityId &&
          item?.jobId == data?.jobId
      );
      return matchedData.map((value) => {
        if (isNotWaste(value)) {
          return {
            ...value,
            date: item?.date,
            startTime: new Date(item?.shiftStartTime).toLocaleString(),
            endTime: new Date(item?.shiftEndTime).toLocaleString(),
            activityId: item?.id,
          };
        } else {
          wasteData.push({
            ...value,
            date: item?.date,
            startTime: new Date(item?.shiftStartTime).toLocaleString(),
            endTime: new Date(item?.shiftEndTime).toLocaleString(),
            activityId: item?.id,
          });
          return;
        }
      });
    }).flat();
    console.log(outputDetails,"filterInputDetails")
    outputDetails = [...outputDetails, ...wasteData];
    const output = outputDetails.filter((item) => item !== undefined);
    setReportsData(getUpdatedReport(filterInputDetails, output));
//     setReportsData(getUpdatedReport(inputDetails, output));
  };

  const handleClose = () => {
    setOpen(false);
    onClose(false);
  };

  return (
    <>
      <React.Fragment>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {FullNodeData.nodeId} - {FullNodeData.data.label}
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                <CloseIcon />
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <div className="container-fluid">
              <div className="row p-2">
                <div className="col-2 d-flex align-items-center">
                  <span>FromDate </span>:
                  <input
                    type="date"
                    value={fromDate}
                    className="form-control"
                    max={getFormattedToday()}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                    }}
                    // style={{ border: 'none',fontSize:'13px',  backgroundColor: 'whitesmoke', paddingRight: "10px" }}
                  />
                </div>
                <div className="col-2 d-flex align-items-center">
                  <span>ToDate </span>:
                  <input
                    type="date"
                    value={toDate}
                    max={getFormattedToday()}
                    className="form-control"
                    disabled={fromDate ? false : true}
                    onChange={(e) => {
                      setToDate(e.target.value);
                    }}
                    // style={{ border: 'none',fontSize:'13px', width: '120px', height: '25px', backgroundColor: 'whitesmoke' }}
                  />
                </div>
              </div>
              <div className="row">
                <div
                  className="col-12 d-flex justify-content-around "
                  style={{ textAlign: "center" }}
                >
                  <h5>Input Material</h5>
                  <h5>Output Material</h5>
                </div>
                <div
                  className="col-12"
                  style={{ height: "100vh", overflowY: "auto" }}
                >
                  <table
                    className={"table table-bordered tablestriped"}
                    style={{ width: "100%", height: "70%", overflow: "auto" }}
                  >
                    {/* className="table table-bordered table-striped" */}
                    <thead className="sticky-top">
                      <tr>
                        <th style={{ fontSize: "11px" }}>Date</th>
                        <th style={{ fontSize: "11px" }}>Job Id</th>
                        <th style={{ fontSize: "11px" }}>Job Desc</th>
                        <th
                          style={{ borderRight: "1px solid", fontSize: "11px" }}
                        >
                          Machine Name
                        </th>
                        <th style={{ width: "120px", fontSize: "11px" }}>
                          Material Name
                        </th>
                        <th style={{ width: "140px", fontSize: "11px" }}>
                          Batch ID
                        </th>
                        <th style={{ width: "100px", fontSize: "11px" }}>
                          Quantity (m)
                        </th>
                        <th
                          style={{ borderRight: "1px solid", width: "100px" }}
                        >
                          Quantity (kgs)
                        </th>
                        {/* <th>Job Id</th> */}
                        <th style={{ width: "150px", fontSize: "11px" }}>
                          Material Name
                        </th>
                        <th style={{ fontSize: "11px" }}>Batch ID</th>
                        <th style={{ width: "90px", fontSize: "11px" }}>
                          Quantity (m)
                        </th>
                        <th style={{ width: "90px", fontSize: "11px" }}>
                          Quantity (kgs)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ cursor: "pointer" }}>
                      {reportData?.map((item, index) => (
                        <tr
                          style={{
                            borderBottom: item?.border
                              ? "1px solid black"
                              : "none",
                          }}
                          key={index}
                        >
                          <td>{item["Date"]}</td>
                          <td>{item["JobId"]}</td>
                          <td>{item["Job Desc"]}</td>
                          <td style={{ borderRight: "1px solid" }}>
                            {item["Machine Name"]}
                          </td>
                          <td>{item["MaterialName"]}</td>
                          <td>{item["BatchId"]}</td>
                          <td>{item["Quantity(m)"]}</td>
                          <td style={{ borderRight: "1px solid" }}>
                            {item["Quantity(kgs)"]}
                          </td>
                          {/* <td >
                                                {item["Job Id"]}
                                            </td> */}
                          <td>{item["Material Name"]}</td>
                          <td>{item["Batch Id"]}</td>
                          <td>{item["Quantity (m)"]}</td>
                          <td>{item["Quantity (kgs)"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </List>
        </Dialog>
      </React.Fragment>
    </>
  );
}
