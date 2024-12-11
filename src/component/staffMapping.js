import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaXmark, FaCheck, FaMinus, FaPlus, } from "react-icons/fa6";
import AuthContext from "../context/AuthProvider";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';


import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BASE_URL } from "../constants/apiConstants";
import Nodesdata from "./Nodesdata";
import { getNodeMaster } from "../api/shovelDetails";
import { Backdrop, CircularProgress, Tooltip } from "@mui/material";


function StaffMapping({tableHeight}) {
  const {auth} = useContext(AuthContext)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState);
    console.log(sidebarCollapsed);
  };
  const [data, setData] = useState([]);
  const [NodeType, setNodeTypeData] = useState([]);
  const [Employee, setEmployeeData] = useState([]);
  const [Nodedata, setNodeData] = useState([]);
  const [shiftdata, setShiftdata] = useState([]);
  const [NodeAllocation, setNodeAllocation] = useState([]);
  const [employeeNodeMapping, setEmployeeNodeMapping] = useState([]);
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState([]);
  const [droppedData, setDroppedData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [updatedfilterEmployeeData, setFilteredEmployeeData] = useState([]); //ramesh changes

  const [OpenLoader, setOpenLoader] = useState(false); //ramesh changes


  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/attendance`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/employee`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        setNodeData(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/shift`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        setShiftdata(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/employeeNodeMapping`;
    axios
      .get(apiUrl)
      .then((response) => {
        setEmployeeNodeMapping(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //updated attendance data for without filter & search
  // useEffect(() => {
  //   let updated = data.filter((item) => !NodeAllocation.some((secondItem) => item.empId === secondItem.empId && item.shiftId === secondItem.shiftNumber));
  //   updated = [...updated.filter((item) => !droppedData.some((secondItem) => item.empId === secondItem.empId && item.shiftId === secondItem.shiftId))];
  //   setUpdatedEmployeeData(updated);
  // }, [NodeAllocation, droppedData])
  useEffect(() => {
    let updated = data.filter((item) => !NodeAllocation.some((secondItem) => item.empId === secondItem.empId && item.shiftId === secondItem.shiftNumber));

    if (Array.isArray(droppedData)) {
        updated = [...updated.filter((item) => !droppedData.some((secondItem) => item.empId === secondItem.empId && item.shiftId === secondItem.shiftId))];
        setUpdatedEmployeeData(updated);
    } else {
        console.error("droppedData is not an array.");
    }
}, [NodeAllocation, droppedData]);


  // Ramesh updated attendance data for with filter & search
  useEffect(() => {
    let updated = filteredResults.filter((item) => !NodeAllocation.some((secondItem) => item.empId === secondItem.empId && item.shiftId === secondItem.shiftNumber));
    updated = [...updated.filter((item) => !droppedData.some((secondItem) => item.empId === secondItem.empId && item.shiftId === secondItem.shiftId))];
    setFilteredEmployeeData(updated);
  }, [NodeAllocation, droppedData,filteredResults])

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
      return firstShift[0]
    }
    else{
      const SecondShift = shiftdata.map(item => item.shiftNumber)
      return SecondShift[1]
    }
}
  getShiftTime()

  useEffect(() => {
    // Fetch data from the API when the component mounts
    setOpenLoader(true)
    const apiUrl = `${BASE_URL}/api/nodeAllocation`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setNodeAllocation(response.data);
        setOpenLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeTypes`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        setNodeTypeData(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [shift, setShift] = useState(Array(droppedData?.length).fill("")); // State for the selected Shift

  const initializeStartDateArray = (length) => {
    return Array(length).fill(getFormattedToday());
  };
  const [startDate, setStartDate] = useState(initializeStartDateArray(droppedData ? droppedData.length : 0)); // State for the Start Date


  // Function to get today's date in the format 'YYYY-MM-DD'
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }
  // function updateEnpdata()

  function getNodeAllocation() {
    const apiUrl = `${BASE_URL}/api/nodeAllocation`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setNodeAllocation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function updateAttendance(emp, shiftNumber) {
    const attendance = {
      attendance: data
        .filter(item => item.empId === emp)
        .map((item) => ({
          attendanceId: item.attendanceId,
          branchId: item.branchId,
          empId: item.empId.toString(),
          date: startDate,
          allocated: "No",
          default: item.default,
          shiftId: shiftNumber,
          userId: "1111"
        })),
    }

    console.log("attendance update");
    axios
      .put(`${BASE_URL}/api/attendance/bulk`, attendance)
      .then((response) => {
        console.log(response.data)
        console.log("coming", response.data)
        // setData(response.data);
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  }
  

  // Delete the table row

  const deleteNode = (nodeId) =>{
    console.log(nodeId);
    axios
      .delete(`${BASE_URL}/api/nodeMaster/${nodeId}`)
      .then((response) => {
        getNodeMaster()
        console.log("deleted successfully",response.data);
      })
    .catch((error) => {
      console.error("Error deleting node:", error);
    });
  }

  const handleDeleteNodeAllocation = (nodeAllote, emp, shift) => {
      console.log(NodeAllocation);
      const findnodeId = NodeAllocation.filter((item) => item.NodeAllocationId == nodeAllote).map((item)=>(item.empId))
      const findIconId = Nodedata.filter((item) => item.iconId == findnodeId).map((item)=>(item.nodeId))
      console.log(findIconId);
      updateAttendance(emp, shift)
      axios
        .delete(`${BASE_URL}/api/nodeAllocation/${nodeAllote}`)
        .then((response) => {
          console.log(" Deleted successfully", response.data);
          toast.error(<span><strong>Deleted</strong> successfully.</span>);
          setOpen(false)
          deleteNode(findIconId)
          // After successful deletion, update the empNodeMap state by filtering out the deleted item
          setNodeAllocation((prevEmpNodeMap) => {
            return prevEmpNodeMap.filter((item) => item.NodeAllocationId !== nodeAllote);
          });
          window.location.reload();
        })
        .catch((error) => {
          setOpen(false)
          console.error("Error deleting node:", error);
        });
  };

  // Update the row -----------

  const [editedIndex, setEditedIndex] = useState(null);

  const handleEdit = (index) => {
    setEditedIndex(index);
  };

  const removeEdit = (index) => {
    setEditedIndex(null)
    getNodeAllocation()
  }

  const handleEditNode = (nodeEdit,empEdit) => {
    console.log(nodeEdit);
    console.log(empEdit);
    const node = Nodedata.filter((item) => item.nodeId == nodeId).map((item) =>item)

    const drop = {
      id: uuidv4(), //empData.deviceName + "",
      nodeCategory : "",
      nodeCategoryId: "203",
      unit1Measurable : "",
      unit2Mandatory : "",
      itemDescription : "",
      nodeType:"employee",
      nodeName:getEmpById(empEdit),
      xPosition:110,
      yPosition:20,
      type:"iconNode",
      parentNode: getParentNode(nodeEdit),
      extent:"parent",
      sourcePosition: "right",
      targetPosition: "left",
      iconId:empId,
      width:"10",
      height:"10",
      borderColor:"",
      borderStyle:"",
      borderWidth:"",
      FontSize:"",
      FontStyle:"",
      borderRadius:"",
      FontColor:"",
      branchId: node.branchId,
      userId :"1111",
      isRootNode:false,
      fillColor:"",
      fillTransparency:"",
      isParent: false,
      formula: "Formula Value",
      fuelUsed: "Fuel Used Value",
      fuelUnitsId: "Fuel Units ID",
      capacity: "Capacity Value",
      capacityUnitsId: "Capacity Units ID",
    }
    console.log(drop, "drop--------------------")

  }

  const handleSave = () => {
    const editedItem = NodeAllocation[editedIndex];
    console.log(editedItem)

    const edite = {
      NodeAllocationId: editedItem.NodeAllocationId,
      empId: editedItem.empId,
      nodeId: editedItem.nodeId,
      shiftNumber: editedItem.shiftNumber,
      branchId: editedItem.branchId,
      date: editedItem.date,
      userId: auth.empId.toString(),
    }
    console.log(edite, "edite--------------------")
    // handleEditNode(editedItem.nodeId,editedItem.empId)
    
    axios.put(`${BASE_URL}/api/nodeAllocation/${editedItem.NodeAllocationId}`, edite)
      .then((response) => {
        console.log('Data saved successfully', response.data);
        toast.success(<span><strong>Successfully</strong> Updated.</span>);
        setEditedIndex(null);
      })
      .catch((error) => {
        setEditedIndex(null)
        getNodeAllocation()
        toast.error(<span><strong>User</strong> is not authorized fot this action.</span>);
        console.error('Error saving data:', error);
      });
  };

  // end ramesh filter & search

  function getEmpNameById(empId) {
    const emp = Employee.find((item) => item.empId == empId);
    return emp ? emp.employeeName : 'Node Not Found';
  }
  function getNodeNameById(nodeId) {
    const node = Nodedata.find((item) => item.nodeId == nodeId);
    return node ? node.nodeName : 'Node Not Found';
  }
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [isNewRowActive, setNewRowActive] = useState(false);
    const handleAddNewRow = () => {
      setNewRowActive(true);
    };

  const [nodeId, setnodeId] = useState([]);
  const [empId, setempId] = useState([]);

  const handleNodeId = (e) => {
    setnodeId(e.target.value);
  }
  const handleEmpId = (e) => {
    setempId(e.target.value);
  }

  function getEmpById(empId) {
    const node = Employee.find((item) => item.empId == empId);
    return node ? node.employeeName : 'Node Not Found';
  }

  const getParentNode = (nodeId) => {
    const node = Nodedata.find((item) => item.nodeId == nodeId);
    return node? node.id : 'Node Not Found';
  }

  const handleCreateNode = (empId,nodeId) => {
    const deviceNode = {
      id: uuidv4(), //empData.deviceName + "",
      nodeCategory : "",
      nodeCategoryId: "203",
      unit1Measurable : "",
      unit2Mandatory : "",
      itemDescription : "",
      nodeType:"employee",
      nodeName:getEmpById(empId),
      xPosition:110,
      yPosition:20,
      type:"iconNode",
      parentNode: getParentNode(nodeId),
      extent:"parent",
      sourcePosition: "right",
      targetPosition: "left",
      iconId:empId,
      width:"10",
      height:"10",
      borderColor:"",
      borderStyle:"",
      borderWidth:"",
      FontSize:"",
      FontStyle:"",
      borderRadius:"",
      FontColor:"",
      branchId: "1001",
      userId :"1111",
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

  const handleNewRowSubmit = (event) => {
    event.preventDefault()
    const drop = {
          empId: empId.toString(),
          nodeId: nodeId.toString(),
          branchId: "1001",
          shiftNumber: getShiftTime(),
          // shift ? shift : "1"
          date: getFormattedToday(),
          userId: auth.empId.toString(),
        }
    console.log(drop)
    axios
      .post(`${BASE_URL}/api/nodeAllocation`, drop)
      .then((response) => {
        console.log("New row added successfully", response.data);
        handleCreateNode(empId,nodeId)
        getNodeAllocation();
        updateAttendance();
        setNewRowActive(false)
        toast.success(<span><strong>Successfully! </strong> Assigned to Node Allocation.</span>);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
        setDroppedData([])
      });
}

const [searchInput, setSearchInput] = useState([]);
  // const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = NodeAllocation.filter((item) => {
      const Id = String(item.NodeAllocationId).toLowerCase();
      const nodeId = String(item.nodeId).toLowerCase();
      const nodeName = String(getNodeNameById(item.nodeId)).toLowerCase();
      const empId = String(item.empId).toLowerCase();
      const empName = String(getEmpNameById(item.empId)).toLowerCase();
      const shift = String(item.shiftNumber).toLowerCase();
      return (
        Id.includes(searchValue.toLowerCase()) ||
        nodeName.includes(searchValue.toLowerCase()) ||
        empId.includes(searchValue.toLowerCase()) ||
        empName.includes(searchValue.toLowerCase()) ||
        shift.includes(searchValue.toLowerCase()) ||
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
        <div className="row p-1 d-flex flex-row">
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
          <div className="col-12 justofy-content-center">
            <div style={{overflowY: 'auto' }} >
              <table className="table table-bordered table-striped">
                <thead class="sticky-top">
                  <tr>
                    <th>id</th>
                    <th>Equipment ID</th>
                    <th>Equipment Name</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Shift ID</th>
                    <th>Assigned Date</th>
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
                              value={nodeId}
                              onChange={handleNodeId}
                      >
                      <option hidden>Equipment Id</option>
                      {Nodedata
                      .filter((item) => item.nodeType === "Machine")
                      .map((item) =>(
                        <option value={item.nodeId}>{item.nodeId} - {item.nodeName}</option>
                      ))}
                      </select>
                    </td>
                    <td colSpan={2}>
                    <select 
                    style={{
                      border: "none",
                      width: "200px",
                      height: "20px",
                      backgroundColor: "whitesmoke"
                    }}
                      value={empId}
                      onChange={handleEmpId}
                      >
                      <option hidden>Employee Id</option>
                      {Employee
                      .map((item) =>(
                        <option value={item.empId}>{item.empId} - {item.employeeName}</option>
                      ))}
                      </select>
                    </td>
                    <td>{getShiftTime()}</td>
                    <td>{getFormattedToday()}</td>
                    <td>
                    <button style={{border:'none',background: 'transparent'}} 
                    onClick={handleNewRowSubmit}
                    >
                      <FaCheck id="FaCheck"/>
                    </button> &nbsp;
                    <button style={{border:'none',background: 'transparent'}} onClick={() => setNewRowActive(false)}>
                      <FaXmark id="FaMinus"/>
                  </button>
                    </td>
                  </tr>
                )}
                {searchInput.length > 0
                ? filteredResults.map((item, index) => (
                  <tr>
                      <td>{item.NodeAllocationId}</td>
                      {/* <td>{item.nodeId}</td> */}
                      <td style={{ textAlign: 'left' }}>
                        {editedIndex === index ? (
                          <select
                            value={item.nodeId}
                            onChange={(e) => {
                              // Update the edited item with the new value
                              const newData = [...NodeAllocation];
                              newData[index].nodeId = e.target.value;
                              setNodeAllocation(newData);
                            }}
                            style={{ border: 'none', width: '60px', height: '25px', backgroundColor: 'whitesmoke' }}
                          >
                            <option value={item.nodeId} disabled>{item.nodeId}</option>
                            {Nodedata
                            .filter((item1) => (item1.nodeType === "Machine"))
                            .map((item) => (
                              <option value={item.nodeId}>{item.nodeId} - {item.nodeName}</option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            {item.nodeId}
                          </div>
                        )}
                      </td>
                      <td>
                        {getNodeNameById(item.nodeId)}
                      </td>
                      {/* <td>{item.empId}</td> */}
                      <td style={{ textAlign: 'left' }}>
                        {editedIndex === index ? (
                          <select
                            value={item.empId}
                            onChange={(e) => {
                              // Update the edited item with the new value
                              const newData = [...NodeAllocation];
                              newData[index].empId = e.target.value;
                              setNodeAllocation(newData);
                            }}
                            style={{ border: 'none', width: '73px', height: '25px', backgroundColor: 'whitesmoke' }}
                          >
                            <option value={item.empId} hidden>{item.empId}</option>
                            {Employee.map((item) => (
                              <option value={item.empId}>{item.empId} - {item.employeeName}</option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            {item.empId}
                          </div>
                        )}
                      </td>
                      <td>
                        {/* {getEmpNameById(item.empId)} */}
                        {getEmpNameById(item.empId)}
                      </td>
                      <td style={{ textAlign: 'left' }}>
                        {item.shiftNumber}
                      </td>
                      {/* <td>{item.shiftId}</td> */}
                      <td>{new Date(item.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      </td>
                      {/* <td>{item.nodeType}</td> */}
                      <td>
                        {editedIndex === index ? (
                          <>
                            <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={removeEdit}><FaXmark  id="FaMinus"/></button>
                          </>
                        ) : (
                          <span>
                            {/* <Button variant="outlined" onClick={handleClickOpen}>
                              <FaMinus />
                            </Button> */}
                            <button
                                style={{ border: "none", backgroundColor: 'transparent' }}
                                onClick={handleClickOpen}
                              >
                                <FaMinus id="FaMinus"/>
                              </button>
                            <React.Fragment>
                              <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                PaperProps={{
                                  style: {
                                    marginTop: -350, // Adjust the marginTop value as needed
                                    width:'40%'
                                  },
                                }}
                              >
                                <DialogTitle id="alert-dialog-title">
                                  {/* {"Use Google's location service?"} */}
                                </DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete?
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button 
                                    onClick={() => handleDeleteNodeAllocation(item.NodeAllocationId, item.empId, item.shiftNumber)}
                                    autoFocus>
                                    Yes
                                  </Button>
                                  <Button onClick={handleClose}>No</Button>
                                </DialogActions>
                              </Dialog>
                            </React.Fragment>
                          </span>
                        )}

                        &nbsp;&nbsp;
                        {editedIndex === index ? (
                          <>
                            <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={handleSave}><FaCheck id="FaCheck"/></button>
                          </>
                        ) : (
                          <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={() => handleEdit(index)}><FaEdit id="FaEdit"/></button>
                        )}
                      </td>
                    </tr>
                  ))
              :
                  NodeAllocation.map((item, index) => (
                    <tr>
                      <td>{item.NodeAllocationId}</td>
                      {/* <td>{item.nodeId}</td> */}
                      <td style={{ textAlign: 'left' }}>
                        {editedIndex === index ? (
                          <select
                            value={item.nodeId}
                            onChange={(e) => {
                              // Update the edited item with the new value
                              const newData = [...NodeAllocation];
                              newData[index].nodeId = e.target.value;
                              setNodeAllocation(newData);
                            }}
                            style={{ border: 'none', width: '60px', height: '25px', backgroundColor: 'whitesmoke' }}
                          >
                            <option value={item.nodeId} disabled>{item.nodeId}</option>
                            {Nodedata
                            .filter((item1) => (item1.nodeType === "Machine"))
                            .map((item) => (
                              <option value={item.nodeId}>{item.nodeId} - {item.nodeName}</option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            {item.nodeId}
                          </div>
                        )}
                      </td>
                      <td>
                        {getNodeNameById(item.nodeId)}
                      </td>
                      {/* <td>{item.empId}</td> */}
                      <td style={{ textAlign: 'left' }}>
                        {editedIndex === index ? (
                          <select
                            value={item.empId}
                            onChange={(e) => {
                              // Update the edited item with the new value
                              const newData = [...NodeAllocation];
                              newData[index].empId = e.target.value;
                              setNodeAllocation(newData);
                            }}
                            style={{ border: 'none', width: '73px', height: '25px', backgroundColor: 'whitesmoke' }}
                          >
                            <option value={item.empId} hidden>{item.empId}</option>
                            {Employee.map((item) => (
                              <option value={item.empId}>{item.empId} - {item.employeeName}</option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            {item.empId}
                          </div>
                        )}
                      </td>
                      <td>
                        {/* {getEmpNameById(item.empId)} */}
                        {getEmpNameById(item.empId)}
                      </td>
                      <td style={{ textAlign: 'left' }}>
                        {item.shiftNumber}
                      </td>
                      {/* <td>{item.shiftId}</td> */}
                      <td>{new Date(item.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      </td>
                      {/* <td>{item.nodeType}</td> */}
                      <td>
                        {editedIndex === index ? (
                          <>
                            <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={removeEdit}><FaXmark  id="FaMinus"/></button>
                          </>
                        ) : (
                          <span>
                            {/* <Button variant="outlined" onClick={handleClickOpen}>
                              <FaMinus />
                            </Button> */}
                            <button
                                style={{ border: "none", backgroundColor: 'transparent' }}
                                onClick={handleClickOpen}
                              >
                                <FaMinus id="FaMinus"/>
                              </button>
                            <React.Fragment>
                              <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                PaperProps={{
                                  style: {
                                    marginTop: -350, // Adjust the marginTop value as needed
                                    width:'40%'
                                  },
                                }}
                              >
                                <DialogTitle id="alert-dialog-title">
                                  {/* {"Use Google's location service?"} */}
                                </DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete?
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button 
                                    onClick={() => handleDeleteNodeAllocation(item.NodeAllocationId, item.empId, item.shiftNumber)}
                                    autoFocus>
                                    Yes
                                  </Button>
                                  <Button onClick={handleClose}>No</Button>
                                </DialogActions>
                              </Dialog>
                            </React.Fragment>
                          </span>
                        )}

                        &nbsp;&nbsp;
                        {editedIndex === index ? (
                          <>
                            <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={handleSave}><FaCheck id="FaCheck"/></button>
                          </>
                        ) : (
                          <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={() => handleEdit(index)}><FaEdit id="FaEdit"/></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
        <br />
        <ToastContainer />
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

export default StaffMapping;

