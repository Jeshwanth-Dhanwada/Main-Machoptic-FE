import React, { useContext, useEffect, useState } from "react";
import {
  getJobAssign,
  getNodeMaster,
  getOADetails,
  getShifts,
} from "../api/shovelDetails";
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { FaCheck, FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import { Backdrop, CircularProgress, Tooltip } from "@mui/material";

import AuthContext from "../context/AuthProvider";

function JobMapping({tableHeight}) {
  const {auth} = useContext(AuthContext)
  const [jobAssigndata, setJobAssigndata] = useState([]);
  const [Nodedata, setNodedata] = useState([]);
  const [Oa_details, setOa_details] = useState([]);
  const [shiftdata, setShiftdata] = useState([]);

  const [OpenLoader, setOpenLoader] = useState([]);


  const showJobAssigndata = async (key) => {
    setOpenLoader(true)
    const responsedata = await getJobAssign();
    setJobAssigndata(responsedata, key);
    setOpenLoader(false);
  };
  const showNodesdata = async (key) => {
    const responsedata = await getNodeMaster();
    setNodedata(responsedata, key);
  };
  const showOa_detailsdata = async (key) => {
    const responsedata = await getOADetails();
    setOa_details(responsedata, key);
  };
  const showShiftsdata = async (key) => {
    const responsedata = await getShifts();
    setShiftdata(responsedata, key);
  };
  useEffect(() => {
    showJobAssigndata();
    showNodesdata();
    showOa_detailsdata();
    showShiftsdata();
  }, []);

  function getNodesdata() {
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setNodedata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function getNodeNameById(nodeId) {
    const node = Nodedata.find((item) => item.nodeId === nodeId);
    return node ? node.nodeName : "Node Not Found";
  }
  function getJobDescription(jobId) {
    const node = Oa_details.find((item) => item.jobId === jobId);
    return node ? node.IT_NAME : "Node Not Found";
  }

  const getParentNode = (nodeId) => {
    const node = Nodedata.find((item) => item.nodeId == nodeId);
    return node? node.id : 'Node Not Found';
  }
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`; // Correct format: DD-YYYY-MM
  }
  function getFormattedTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: DD-YYYY-MM
  }

  function formatIndianDate(dateString) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const indianDateFormat = 'en-IN'; // Use 'en-IN' for Indian English locale
  
    // Convert the input date string to a JavaScript Date object
    const dateObject = new Date(dateString);
  
    // Format the date using toLocaleDateString with the Indian locale
    return dateObject.toLocaleDateString(indianDateFormat, options);
  }



  const [opendeletepopup, setOpenDelete] = useState(false);
  const handleClickdeletepopup = () => {
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const [editedIndex, setEditedIndex] = useState(null);

  const handleEdit = (index) => {
    setEditedIndex(index);
  };

  const removeEdit = (index) => {
    setEditedIndex(null);
  };

  const deleteNode = (nodeId) => {
    console.log(nodeId);
    axios
      .delete(`${BASE_URL}/api/nodeMaster/${nodeId}`)
      .then((response) => {
        getNodesdata();
        console.log("deleted successfully", response.data);
        showJobAssigndata();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  };

  const handleSave = () => {
    const editedItem = jobAssigndata[editedIndex];
    console.log(editedItem);
    const edite = {
      branchId: editedItem.branchId,
      date: editedItem.date,
      routeId: editedItem.routeId,
      userId: editedItem.userId,
      shift: editedItem.shift.shiftNumber,
      jobId: editedItem.jobId,
      node: editedItem.node.nodeId.toString(),
      totalProducedQty: editedItem.totalProducedQty,
      outstandingQty: editedItem.outstandingQty,
      targetQty: editedItem.targetQty,
      status: editedItem.status,
    };
    console.log(edite);
    axios
      .put(`${BASE_URL}/api/jobassign/${editedItem.id}`, edite)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(null);
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>
        );
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setEditedIndex(null);
      });
  };

  const handleDeleteJobAssign = (jobassignId) => {
    console.log(jobassignId);
    const findJobId = jobAssigndata
      .filter((item) => item.id == jobassignId)
      .map((item) => item.jobId);
    console.log(findJobId);
    const findNodeId = Nodedata.filter((item) => item.iconId == findJobId).map(
      (item) => item.nodeId
    );
    console.log(findNodeId);
    deleteNode(findNodeId);
    axios
      .delete(`${BASE_URL}/api/jobassign/${jobassignId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        toast.success(
          <span>
            <strong>Deleted</strong> successfully.
          </span>
        );
        setOpenDelete(false);
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
        // toast.error(<span><strong>User</strong> is not authorized fot this action.</span>);
      });
  };

  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(true);
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update the current time every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const shiftST = shiftdata.map(item => item.startTime)
  const shiftET = shiftdata.map(item => item.endTime)

  function getShiftTime(){
    if(formattedTime >= shiftST[0] && shiftET[0] >= formattedTime){
      const firstShift = shiftdata.map(item => item.shiftNumber)
      // setShiftId(firstShift[0]); // Update the shiftId state
      console.log(firstShift);
      return firstShift[0]
    }
    else{
      const SecondShift = shiftdata.map(item => item.shiftNumber)
      console.log(SecondShift);
      return SecondShift[1]
    }
}
  const [jobId, setjobId] = useState([])
  const [nodeId, setnodeId] = useState([])

  const handleJobId = (e) => {
    setjobId(e.target.value)
  }
  const handleNodeId = (e) => {
    setnodeId(e.target.value)
  }

  const handleCreateNode = (nodeId,jobId) => {
    const deviceNode = {
      id: uuidv4(), //empData.deviceName + "",
      nodeCategory : "",
      nodeCategoryId: "203",
      unit1Measurable : "",
      unit2Mandatory : "",
      itemDescription : "",
      nodeType:"job",
      nodeName:getJobDescription(jobId),
      xPosition:75,
      yPosition:20,
      type:"iconNode",
      parentNode: getParentNode(nodeId),
      extent:"parent",
      sourcePosition: "right",
      targetPosition: "left",
      iconId:jobId,
      width:"10px",
      height:"10px",
      borderColor:"",
      borderStyle:"",
      borderWidth:"",
      FontSize:"",
      FontStyle:"",
      borderRadius:"",
      FontColor:"",
      branchId: auth?.branchId.toString(),
      userId :auth?.empId.toString(),
      isRootNode:false,
      fillColor:"",
      fillTransparency:"",
      isParent: false,
      formula: "Formula Value",
      fuelUsed: "Fuel Used Value",
      fuelUnitsId: "Fuel Units ID",
      capacity: "Capacity Value",
      capacityUnitsId: "Capacity Units ID",
    };
    console.log(deviceNode);
    axios
    .post(`${BASE_URL}/api/nodeMaster`, deviceNode)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  }

  const handleNewRowSubmit = (event,job,node) => {
    event.preventDefault();
    const payload = {
      date:getFormattedTodayDate(),
      routeId:"1",
      branchId: auth?.branchId.toString(),
      userId:auth?.empId.toString(),
      status:'Assigned',
      jobId:job,
      totalProducedQty:"",
      outstandingQty:"",
      targetQty:"",
      shift:getShiftTime(),
      node:node

    }
    console.log(payload);
   axios
     .post(`${BASE_URL}/api/jobassign`,payload)
     .then((response) => {
        showJobAssigndata()
          console.log('New row added successfully', response.data);
          toast.success(<span><strong>Successfully! </strong> Added.</span>);
          setNewRowActive(false);
          handleCreateNode(nodeId,jobId)
          setjobId("");
          setnodeId("");
      })
      .catch((error) => {
        console.error('Error adding new row:', error);
      });
  }

  const [searchInput, setSearchInput] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = jobAssigndata.filter((item) => {
      const Id = String(item.id).toLowerCase();
      const nodeId = String(item.node.nodeId).toLowerCase();
      const nodeName = String(getNodeNameById(item.node.nodeId)).toLowerCase();
      const jobId = String(item.jobId).toLowerCase();
      const jobName = String(getJobDescription(item.jobId)).toLowerCase();
      const status = String(item.status).toLowerCase();
      return (
        Id.includes(searchValue.toLowerCase()) ||
        nodeName.includes(searchValue.toLowerCase()) ||
        jobId.includes(searchValue.toLowerCase()) ||
        jobName.includes(searchValue.toLowerCase()) ||
        status.includes(searchValue.toLowerCase()) ||
        nodeId.includes(searchValue.toLowerCase()) 
      );
    });
    setFilteredResults(filteredData);
  };

  const [height, setHeight] = useState();
  useEffect(() => {
    console.log(tableHeight,"heightt")
    if(tableHeight > '1' && tableHeight < '360'){
      setHeight(tableHeight-'100');
    }
    else{
      setHeight('350px')
    }
  }, []);

  return (
    <div>
      <div className="container-fluid" style={{
          // height: tableHeight ? tableHeight : '200px',
          height:  height,
          overflowY: "scroll",
          overflowX :"hidden"
        }}>
        <div className="row">
        <div className="col-3 d-flex flex-row justify-content-end m-1">
          <input
            type="text"
            className="form-control"
            onChange={(e) => searchItems(e.target.value)}
            value={searchInput}
            style={{ flex: 1, height: "30px" }}
            placeholder="Search"
          />
          <Tooltip title="Add Agent">
            <Button
              onClick={handleAddNewRow}
              id="addbutton"
              style={{ marginLeft: "5px" }}
            >
              <FaPlus />
            </Button>
          </Tooltip>
        </div>
          <div
            className="col-12"
            style={{ height: "400px", overflowY: "auto" }}
          >
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Job Id</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  {/* <th style={{ fontSize: "11px" }}>Route Id</th> */}
                  <th style={{ fontSize: "11px", width: "100px" }}>
                    Total Produced Quantity
                  </th>
                  <th style={{ fontSize: "11px", width: "100px" }}>
                    Out Standing Quantity
                  </th>
                  <th style={{ fontSize: "11px", width: "8x0px" }}>
                    Target <br/>Quantity
                  </th>
                  <th>Node Id</th>
                  <th>Node Description</th>
                  <th>Shift Id</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isNewRowActive && (
                  <tr>
                    <td></td>
                    <td style={{}} colSpan={2}>
                      <select style={{
                              border: "none",
                              width: "200px",
                              height: "20px",
                              backgroundColor: "whitesmoke"}}
                              value={jobId}
                              onChange={handleJobId}
                      >
                      <option hidden>JobId Id</option>
                      {Oa_details
                      // .filter((item) => item.nodeType === "Machine")
                      .map((item) =>(
                        <option value={item.jobId}>{item.jobId} - {item.IT_NAME}</option>
                      ))}
                      </select>
                    </td>
                    <td>{"Assigned"}</td>
                    <td>{getFormattedToday()}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colSpan={2}>
                    <select 
                    style={{
                      border: "none",
                      width: "200px",
                      height: "20px",
                      backgroundColor: "whitesmoke"
                    }}
                      value={nodeId}
                      onChange={handleNodeId}
                      >
                      <option hidden>NodeId Id</option>
                      {Nodedata
                      .filter((item) => item.nodeType === "Machine")
                      .map((item) =>(
                        <option value={item.nodeId}>{item.nodeId} - {item.nodeName}</option>
                      ))}
                      </select>
                    </td>
                    <td style={{textAlign:'center'}}>{getShiftTime()}</td>
                    <td>
                    <button style={{border:'none',background: 'transparent'}} 
                    onClick={(event) => handleNewRowSubmit(event,jobId,nodeId)}
                    >
                      <FaCheck style={{color:'green'}}/>
                    </button> &nbsp;
                    <button style={{border:'none',background: 'transparent'}} onClick={() => setNewRowActive(false)}>
                      <FaXmark style={{color:'red'}}/>
                  </button>
                    </td>
                  </tr>
                )}
                {searchInput.length > 0
                ? filteredResults.map((item, index) => (
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.jobId}</td>
                    <td style={{width:'200px' }}>
                      {getJobDescription(item.jobId)}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <select
                          value={item.status}
                          onChange={(e) => {
                            const newData = [...jobAssigndata];
                            newData[index].status = e.target.value;
                            setJobAssigndata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "70px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        >
                          <option hidden>Job Status</option>
                          <option value={"Received"}>Received</option>
                          <option value={"Assigned"}>Assigned</option>
                          <option value={"In Progress"}>In Progress</option>
                          <option value={"Completed"}>Completed</option>
                        </select>
                      ) : (
                        <div>{item.status}</div>
                      )}
                    </td>
                    <td>
                      {formatIndianDate(item.date)}
                    </td>
                    {/* <td style={{ fontSize: "smaller",textAlign:'center'}}>{item.routeId}</td> */}
                    <td>
                      {item.totalProducedQty}
                    </td>
                    <td>
                      {item.outstandingQty}
                    </td>
                    <td>{item.targetQty}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.node.nodeId}
                    </td>
                    <td>
                      {getNodeNameById(item.node.nodeId)}
                    </td>
                    <td style={{ fontSize: "smaller", textAlign: "center" }}>
                      {item.shift.shiftNumber}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                            onClick={removeEdit}
                          >
                            <FaXmark id="FaMinus"/>
                          </button>
                        </>
                      ) : (
                        <span>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                            disabled={item.status === "Completed"}
                            onClick={handleClickdeletepopup}
                          >
                            <FaMinus id="FaMinus"/>
                          </button>
                          <React.Fragment>
                            <Dialog
                              open={opendeletepopup}
                              onClose={handleDeleteClose}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                              PaperProps={{
                                style: {
                                  marginTop: -350, // Adjust the marginTop value as needed
                                  width: "40%",
                                },
                              }}
                            >
                              <DialogTitle id="alert-dialog-title">
                                {/* {"Taxonalytica"} */}
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  Are you sure you want to delete?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() => handleDeleteJobAssign(item.id)}
                                >
                                  Yes
                                </Button>
                                <Button onClick={handleDeleteClose}>No</Button>
                              </DialogActions>
                            </Dialog>
                          </React.Fragment>
                        </span>
                      )}
                      &nbsp;&nbsp;
                      {editedIndex === index ? (
                        <>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                            onClick={(event) => handleSave()}
                          >
                            <FaCheck id="FaCheck"/>
                          </button>
                        </>
                      ) : (
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                          }}
                          disabled={item.status === "Completed"}
                          onClick={() => handleEdit(index)}
                        >
                          <FaEdit id="FaEdit"/>
                        </button>
                      )}
                    </td>
                  </tr>
                  ))
              :
                jobAssigndata
                .filter((item) => item.status !== 'Completed')
                .map((item, index) => (
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.jobId}</td>
                    <td style={{width:'200px' }}>
                      {getJobDescription(item.jobId)}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <select
                          value={item.status}
                          onChange={(e) => {
                            const newData = [...jobAssigndata];
                            newData[index].status = e.target.value;
                            setJobAssigndata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "70px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        >
                          <option hidden>Job Status</option>
                          <option value={"Received"}>Received</option>
                          <option value={"Assigned"}>Assigned</option>
                          <option value={"In Progress"}>In Progress</option>
                          <option value={"Completed"}>Completed</option>
                        </select>
                      ) : (
                        <div>{item.status}</div>
                      )}
                    </td>
                    <td>
                      {formatIndianDate(item.date)}
                    </td>
                    {/* <td style={{ fontSize: "smaller",textAlign:'center'}}>{item.routeId}</td> */}
                    <td>
                      {item.totalProducedQty}
                    </td>
                    <td>
                      {item.outstandingQty}
                    </td>
                    <td>{item.targetQty}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.node.nodeId}
                    </td>
                    <td>
                      {getNodeNameById(item.node.nodeId)}
                    </td>
                    <td style={{ fontSize: "smaller", textAlign: "center" }}>
                      {item.shift.shiftNumber}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                            onClick={removeEdit}
                          >
                            <FaXmark id="FaMinus"/>
                          </button>
                        </>
                      ) : (
                        <span>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                            disabled={item.status === "Completed"}
                            onClick={handleClickdeletepopup}
                          >
                            <FaMinus id="FaMinus"/>
                          </button>
                          <React.Fragment>
                            <Dialog
                              open={opendeletepopup}
                              onClose={handleDeleteClose}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                              PaperProps={{
                                style: {
                                  marginTop: -350, // Adjust the marginTop value as needed
                                  width: "40%",
                                },
                              }}
                            >
                              <DialogTitle id="alert-dialog-title">
                                {/* {"Taxonalytica"} */}
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  Are you sure you want to delete?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() => handleDeleteJobAssign(item.id)}
                                >
                                  Yes
                                </Button>
                                <Button onClick={handleDeleteClose}>No</Button>
                              </DialogActions>
                            </Dialog>
                          </React.Fragment>
                        </span>
                      )}
                      &nbsp;&nbsp;
                      {editedIndex === index ? (
                        <>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                            onClick={(event) => handleSave()}
                          >
                            <FaCheck id="FaCheck"/>
                          </button>
                        </>
                      ) : (
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                          }}
                          disabled={item.status === "Completed"}
                          onClick={() => handleEdit(index)}
                        >
                          <FaEdit id="FaEdit"/>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {OpenLoader && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={OpenLoader}
            // onClick={handleClose}
          >
            <CircularProgress size={80} color="inherit" />
          </Backdrop>
          )}
    </div>
  );
}

export default JobMapping;
