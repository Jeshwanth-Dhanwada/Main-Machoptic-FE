import React, { useContext, useEffect, useState } from "react";
import { getDeviceMapping, getDeviceMaster, getNodeMaster } from "../api/shovelDetails";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { FaCheck, FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Backdrop, CircularProgress, Tooltip } from '@mui/material';
import { NODE_WIDTH, NODE_HEIGHT } from "../constants/chartlConstants.js";
import AuthContext from "../context/AuthProvider.js";


function DeviceMapping({tableHeight, sendtoConfigurations}) {
  const {auth} = useContext(AuthContext)
  const [DeviceMapping, setDeviceMapping] = useState([]);
  const [Devices, setDevices] = useState([]);
  const [nodesdata, setnodesdata] = useState([]);

  const [OpenLoader, setOpenLoader] = useState(false);

  const showDeviceMapping = async (key) => {
    setOpenLoader(true)
    const responsedata = await getDeviceMapping();
    setDeviceMapping(responsedata, key);
    setOpenLoader(false)
  };

  const showDevices = async (key) => {
    const responsedata = await getDeviceMaster();
    setDevices(responsedata, key);
  };

  const showNodes = async (key) => {
    const responsedata = await getNodeMaster();
    setnodesdata(responsedata, key);
  };

  useEffect(() => {
    showDeviceMapping();
    showDevices();
    showNodes();
  }, []);

  const [editedIndex, setEditedIndex] = useState(null);
  const [editedNodeData, setEditNodeData] = useState(null);
  const handleEdit = (index) => {
    setEditedIndex(index);
    const editedItem = DeviceMapping[index];
    console.log(editedItem, "2504")
    // console.log(nodesdata.filter((item) => item.iconId == editedItem.deviceId).map((item)=>item), "2504")
    console.log(nodesdata.map((item) => item.iconId), "2504")
    const GetNodes = nodesdata.filter((item) => item.iconId == editedItem.deviceId)
    console.log(GetNodes, "2504")
    setEditNodeData(GetNodes)
  };
  const removeEdit = (index) => {
    setEditedIndex(null);
    setEditNodeData(null)
  };

  function getNodesdata() {
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setnodesdata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const EditnodeChange = (PrevnodeId, nodeDetails) => {
    console.log(PrevnodeId, nodeDetails, "2504")
    const getParentNode = nodesdata.filter((item) => item.nodeId == PrevnodeId).map((item) => item.id)
    console.log(getParentNode, "2504")
    const EditNode = {
      nodes: nodeDetails
        .map((nodeDetails) => ({
          nodeId: nodeDetails.nodeId,
          id: nodeDetails.id,
          branchId: "1001",
          nodeCategory: nodeDetails.nodeCategory,
          unit1Measurable: nodeDetails.unit1Measurable,
          parentNode: getParentNode.toString(),
          extent: nodeDetails.extent,
          type: nodeDetails.type,
          unit2Mandatory: nodeDetails.unit2Mandatory,
          iconId: nodeDetails.iconId,
          itemDescription: nodeDetails.itemDescription,
          nodeImage: nodeDetails.nodeImage,
          nodeCategoryId: "203",
          nodeType: nodeDetails.nodeType,
          nodeName: nodeDetails.nodeName,
          width: nodeDetails.width,
          height: nodeDetails.height,
          borderRadius: nodeDetails.borderRadius,
          xPosition: nodeDetails.xPosition,
          yPosition: nodeDetails.yPosition,
          borderColor: nodeDetails.borderColor,
          borderWidth: nodeDetails.borderWidth,
          borderStyle: nodeDetails.borderStyle,
          fillColor: nodeDetails.background,
          fillTransparency: "Fill Transparency Value",
          isRootNode: false,
          isParent: false,
          formula: "Formula Value",
          fuelUsed: "Fuel Used Value",
          fuelUnitsId: "Fuel Units ID",
          capacity: "Capacity Value",
          capacityUnitsId: "Capacity Units ID",
          sourcePosition: nodeDetails.sourcePosition,
          targetPosition: nodeDetails.targetPosition,
          FontColor: nodeDetails.color,
          FontStyle: nodeDetails.fontStyle,
          FontSize: nodeDetails.fontSize,
          userId: '1111'
        }))
    }

    console.log(EditNode, "2504")

    // axios
    //   .put(`${BASE_URL}/api/nodeMaster/bulk/`, EditNode, {
    //     headers: {
    //       "Content-Type": "application/json", // Set the content type to JSON
    //     },
    //   })
    //   .catch((error) => {
    //     console.error("Error saving data:", error);
    //   });
  }
  const handleSave = () => {
    const editedItem = DeviceMapping[editedIndex];
    EditnodeChange(editedItem.nodeId, editedNodeData)
    const edite = {
      deviceId: editedItem.deviceId,
      nodeId: editedItem.nodeId,
      branchId: auth.branchId.toString(),
      userId: auth.empId.toString(),
    }
    axios
      .put(`${BASE_URL}/api/deviceMapping/${editedItem.Id}`, edite)
      .then((response) => {
        console.log('Data saved successfully', response.data);
        setEditedIndex(null);
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: 'custom-toast' // Optional: Add custom CSS class
          }
        );
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setEditedIndex(null);
      });
  };

  const deleteNode = (nodeId) => {
    console.log(nodeId);
    axios
      .delete(`${BASE_URL}/api/nodeMaster/${nodeId}`)
      .then((response) => {
        getNodesdata()
        sendtoConfigurations();
        console.log("deleted successfully", response.data);
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  }

  const handleDeleteDeiceMapping = () => {
    const findDeviceId = DeviceMapping.filter((item) => item.Id == DeviceId).map((item) => parseInt(item.deviceId))
    console.log(findDeviceId);
    const findNodeId = nodesdata.filter((item) => item.nodeType === 'device' && item.iconId == findDeviceId).map((item) => (item.nodeId));
    console.log(findNodeId);
    deleteNode(findNodeId)
    axios
      .delete(`${BASE_URL}/api/deviceMapping/${DeviceId}`,)
      .then((response) => {
        sendtoConfigurations(DeviceId);
        console.log("Node deleted successfully", response.data);
        toast.success(
          <span><strong>Deleted</strong> successfully.</span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: 'custom-toast' // Optional: Add custom CSS class
          }
        );
        setOpenDelete(false);
        showDeviceMapping(deviceId);
      })
      .catch((error) => {
        console.error("Error deleting node:", error,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: 'custom-toast' // Optional: Add custom CSS class
          }
        );
        // toast.error(<span><strong>User</strong> is not authorized fot this action.</span>);
      });
  }

  const [opendeletepopup, setOpenDelete] = useState(false);
  const [DeviceId,setdeviceId] = useState()
  const handleClickdeletepopup = (Id) => {
    console.log(Id)
    setdeviceId(Id)
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(true);
  };

  const [deviceId, setDeviceId] = useState([])
  const [nodeId, setnodeId] = useState([])

  const handleDeviceId = (e) => {
    setDeviceId(e.target.value)
  }
  const handleNodeId = (e) => {
    setnodeId(e.target.value)
  }

  function getNodeNameById(nodeId) {
    const node = nodesdata.find((item) => item.nodeId == nodeId);
    return node ? node.nodeName : 'Node Not Found';
  }
  function getDeviceNameById(deviceId) {
    const node = Devices.find((item) => item.deviceId == deviceId);
    return node ? node.deviceName : 'Node Not Found';
  }

  const getParentNode = (nodeId) => {
    const node = nodesdata.find((item) => item.nodeId == nodeId);
    return node ? node.id : 'Node Not Found';
  }

  const getYpositions = (nodeId) => { 
    // const node = nodesdata.find((item) => item.nodeId == nodeId);
    const lastChildNode = nodesdata.find((node) => node.parenId === nodeId);
    const newY = lastChildNode ? lastChildNode.position.y + NODE_WIDTH - 80 : -20
    return newY
  }

  const handleCreateNode = (nodeId, deviceId) => {
    const deviceNode = {
      id: uuidv4(), //empData.deviceName + "",
      nodeCategory: "",
      nodeCategoryId: "203",
      unit1Measurable: "",
      unit2Mandatory: "",
      itemDescription: "",
      nodeType: "device",
      nodeName: getDeviceNameById(deviceId),
      xPosition: 30,
      yPosition: -41,
      // { x: 30, y: -41.5 }
      type: "iconNode",
      parentNode: getParentNode(nodeId),
      extent: "parent",
      sourcePosition: "right",
      targetPosition: "left",
      iconId: deviceId,
      width: "20",
      height: "20",
      borderColor: "",
      borderStyle: "",
      borderWidth: "",
      FontSize: "",
      FontStyle: "",
      borderRadius: "",
      FontColor: "",
      branchId: auth.branchId.toString(),
      userId:  auth.empId.toString(),
      isRootNode: false,
      fillColor: "",
      fillTransparency: "",
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
        sendtoConfigurations(deviceNode);
        showNodes()
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const handleNewRowSubmit = () => {
    const payload = {
      deviceId: deviceId,
      nodeId: nodeId,
      branchId: auth.branchId.toString(),
      userId: auth.empId.toString(),
    }
    console.log(payload);
    axios
      .post(`${BASE_URL}/api/deviceMapping`, payload)
      .then((response) => {
        console.log('New row added successfully', response.data);
        toast.success(
          <span><strong>Successfully! </strong> Added.</span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: 'custom-toast' // Optional: Add custom CSS class
          }
        );
        setNewRowActive(false);
        handleCreateNode(nodeId, deviceId)
        showDeviceMapping()
        setDeviceId("");
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
    const filteredData = DeviceMapping.filter((item) => {
      const Id = String(item.Id).toLowerCase();
      const nodeId = String(item.nodeId).toLowerCase();
      const deviceId = String(getDeviceNameById(item.deviceId)).toLowerCase();
      return (
        Id.includes(searchValue.toLowerCase()) ||
        deviceId.includes(searchValue.toLowerCase()) ||
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
    <div
      className="container-fluid"
      style={{
        // height: tableHeight ? tableHeight : '200px',
        height:  height,
        overflowY: "scroll",
        overflowX :"hidden"
      }}
    >
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
        <div className="col-12">
          <table className="table table-bordered table-striped">
            <thead className="sticky-top">
              <tr>
                <th>Id</th>
                <th>Device Id</th>
                <th>Device Name</th>
                <th>Node Id</th>
                <th>Node Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {searchInput.length > 0
                ? filteredResults.map((item, index) => (
                  <tr>
                  <td>{item.Id}</td>
                  <td>
                    {editedIndex === index ? (
                      <select
                        value={item.deviceId}
                        onChange={(e) => {
                          const newData = [...DeviceMapping];
                          newData[index].deviceId = e.target.value;
                          setDeviceMapping(newData);
                        }}
                        style={{
                          border: "none",
                          width: "70px",
                          height: "20px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <option hidden>Device Id</option>
                        {Devices
                          .map((item) => (
                            <option>{item.deviceId}</option>
                          ))}
                      </select>
                    ) : (
                      <div>{item.deviceId}</div>
                    )}
                  </td>
                  <td>{getDeviceNameById(item.deviceId)}</td>
                  <td>
                    {editedIndex === index ? (
                      <select
                        value={item.nodeId}
                        onChange={(e) => {
                          const newData = [...DeviceMapping];
                          newData[index].nodeId = e.target.value;
                          setDeviceMapping(newData);
                        }}
                        style={{
                          border: "none",
                          width: "70px",
                          height: "20px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <option hidden>Node Id</option>
                        {nodesdata
                          .filter((item) => (item.nodeType === "Machine"))
                          .map((item) => (
                            <option>{item.nodeId}</option>
                          ))}
                      </select>
                    ) : (
                      <div>{item.nodeId}</div>
                    )}
                  </td>
                  <td>{getNodeNameById(item.nodeId)}</td>
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
                          onClick={() => handleClickdeletepopup(item.Id)}
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
                                width: '40%'
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
                                onClick={handleDeleteDeiceMapping}
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
                        onClick={() => handleEdit(index)}
                      >
                        <FaEdit id="FaEdit"/>
                      </button>
                    )}
                  </td>
                </tr>
                  ))
              :
              DeviceMapping.map((item, index) => (
                <tr>
                  <td>{item.Id}</td>
                  <td>
                    {editedIndex === index ? (
                      <select
                        value={item.deviceId}
                        onChange={(e) => {
                          const newData = [...DeviceMapping];
                          newData[index].deviceId = e.target.value;
                          setDeviceMapping(newData);
                        }}
                        style={{
                          border: "none",
                          width: "70px",
                          height: "20px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <option hidden>Device Id</option>
                        {Devices
                          .map((item) => (
                            <option>{item.deviceId}</option>
                          ))}
                      </select>
                    ) : (
                      <div>{item.deviceId}</div>
                    )}
                  </td>
                  <td>{getDeviceNameById(item.deviceId)}</td>
                  <td>
                    {editedIndex === index ? (
                      <select
                        value={item.nodeId}
                        onChange={(e) => {
                          const newData = [...DeviceMapping];
                          newData[index].nodeId = e.target.value;
                          setDeviceMapping(newData);
                        }}
                        style={{
                          border: "none",
                          width: "70px",
                          height: "20px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <option hidden>Node Id</option>
                        {nodesdata
                          .filter((item) => (item.nodeType === "Machine"))
                          .map((item) => (
                            <option>{item.nodeId}</option>
                          ))}
                      </select>
                    ) : (
                      <div>{item.nodeId}</div>
                    )}
                  </td>
                  <td>{getNodeNameById(item.nodeId)}</td>
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
                          onClick={() => handleClickdeletepopup(item.Id)}
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
                                width: '40%'
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
                                onClick={handleDeleteDeiceMapping}
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
                        onClick={() => handleEdit(index)}
                      >
                        <FaEdit id="FaEdit"/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {isNewRowActive && (
                <tr>
                  <td></td>
                  <td style={{}} colSpan={2}>
                    <select style={{
                      border: "none",
                      width: "200px",
                      height: "20px",
                      backgroundColor: "whitesmoke"
                    }}
                      value={deviceId}
                      onChange={handleDeviceId}
                    >
                      <option hidden>Device Id</option>
                      {Devices.map((item) => (
                        <option value={item.deviceId}>{item.deviceId} - {item.deviceName}</option>
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
                      value={nodeId}
                      onChange={handleNodeId}
                    >
                      <option hidden>Node Id</option>
                      {nodesdata
                        .filter((item) => (item.nodeType === "Machine"))
                        .map((item) => (
                          <option value={item.nodeId}>{item.nodeId} - {item.nodeName}</option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <button style={{ border: 'none', background: 'transparent' }}
                      onClick={handleNewRowSubmit}
                    >
                      <FaCheck style={{ color: 'green' }} />
                    </button> &nbsp;
                    <button style={{ border: 'none', background: 'transparent' }} onClick={() => setNewRowActive(false)}>
                      <FaXmark style={{ color: 'red' }} />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default DeviceMapping;
