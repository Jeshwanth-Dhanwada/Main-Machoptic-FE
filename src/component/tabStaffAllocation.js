import React, { useContext, useEffect, useState } from "react";
import {
  getEmpNodeMapping,
  getEmployees,
  getNodeMaster,
} from "../api/shovelDetails";
import { FaCheck, FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Backdrop, CircularProgress, Tooltip } from "@mui/material";
import AuthContext from "../context/AuthProvider";

function StaffAllocation({ tableHeight, sendtoConfigurations }) {
  const { auth } = useContext(AuthContext);
  const [EmpNodeMapping, setEmpNodeMapping] = useState([]);
  const [Employeedata, setEmployeedata] = useState([]);
  const [nodedata, setnodedata] = useState([]);

  const [OpenLoader, setOpenLoader] = useState(false);

  const showEmpNodeMapping = async (key) => {
    setOpenLoader(true);
    const responsedata = await getEmpNodeMapping();
    setEmpNodeMapping(responsedata, key);
    setOpenLoader(false);
  };
  const showEmployees = async (key) => {
    const responsedata = await getEmployees();
    setEmployeedata(responsedata, key);
  };
  const showNodes = async (key) => {
    const responsedata = await getNodeMaster();
    setnodedata(responsedata, key);
  };

  useEffect(() => {
    showEmpNodeMapping();
    showEmployees();
    showNodes();
  }, []);

  const getEmployeeNamebyId = (empId) => {
    const emp = Employeedata.find((item) => item.empId == empId);
    return emp ? emp.employeeName : "Node Not Found";
  };

  const getParentNode = (nodeId) => {
    const node = nodedata.find((item) => item.nodeId == nodeId);
    return node ? node.id : "Node Not Found";
  };

  const getNodeDescbyId = (nodeId) => {
    const node = nodedata.find((item) => item.nodeId == nodeId);
    return node ? node.nodeName : "Node Not Found";
  };

  const [editedIndex, setEditedIndex] = useState(null);
  const handleEdit = (index) => {
    setEditedIndex(index);
  };
  const removeEdit = (index) => {
    setEditedIndex(null);
  };

  const handleSave = () => {
    const editedItem = EmpNodeMapping[editedIndex];
    const edite = {
      empnodemapId: editedItem.empnodemapId,
      emp: editedItem.emp.empId,
      node: editedItem.node.nodeId,
      branchId: auth.branchId.toString(),
      isActive: editedItem.isActive,
      userId: auth.empId.toString(),
      nodeType: editedItem.nodeType,
      default: editedItem.default,
      primary: editedItem.primary,
      date:getDate()
    };
    console.log(edite);
    axios
      .put(`${BASE_URL}/api/employeeNodeMapping/${editedItem.empnodemapId}`,edite)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(null);
        toast.success(
          <span><strong>Successfully</strong> Updated.</span>,
          {position: toast.POSITION.BOTTOM_RIGHT,className: "custom-toast"}
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
        showNodes()
        console.log("deleted successfully", response.data);
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  };

  const handleDeleteStaffMapping = () => {
    console.log(empNodeId,"checkstaff");
    const findEmpId = EmpNodeMapping.filter(
      (item) => item.empnodemapId == empNodeId
    ).map((item) => item.emp.empId);
    console.log(findEmpId,"checkstaff");
    const findNodeId = nodedata
    .filter((item) => item.nodeType === 'employee' && item.iconId == findEmpId)
      .map((item) => item.nodeId);
    console.log(findNodeId,"checkstaff");
    deleteNode(findNodeId);
    axios
      .delete(`${BASE_URL}/api/employeeNodeMapping/${empNodeId}`)
      .then((response) => {
        showEmpNodeMapping()
        console.log("Node deleted successfully", response.data);
        sendtoConfigurations(empNodeId);
        toast.success(
          <span><strong>Deleted</strong> successfully.</span>,
          {position: toast.POSITION.BOTTOM_RIGHT,className: "custom-toast"}
        );
        setOpenDelete(false);
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
        // toast.error(<span><strong>User</strong> is not authorized fot this action.</span>);
      });
  };

  const [opendeletepopup, setOpenDelete] = useState(false);
  const [empNodeId, setEmpNodeId] = useState([])
  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setEmpNodeId(Id)
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(!isNewRowActive);
  };

  const [empId, setempId] = useState("");
  const [nodeId, setnodeId] = useState("");

  const handleEmpId = (e) => {
    setempId(e.target.value);
  };
  const handlenodeId = (e) => {
    setnodeId(e.target.value);
  };

  const getEmployeeNodePosition = (nodeId) => {
    const Parentnodeid = nodedata.find((node) => node.nodeId == nodeId);
    console.log("parent node:", Parentnodeid, nodeId);
    const lastChildNode = nodedata.filter(
      (node) => node.parentNode == Parentnodeid.id
    );
    const childNodeCount = lastChildNode.length;
    const newY = childNodeCount > 0 ? -41 - childNodeCount * 20 : -41;
    console.log("parent node:", newY, lastChildNode);
    return newY;
  };

  const handleCreateNode = (nodeId, empId) => {
    const employeeNode = {
      id: uuidv4(), //empData.deviceName + "",
      nodeCategory: "",
      nodeCategoryId: "203",
      unit1Measurable: "",
      unit2Mandatory: "",
      itemDescription: "",
      nodeType: "employee",
      nodeName: getEmployeeNamebyId(empId),
      xPosition: -48,
      // yPosition: getEmployeeNodePosition(nodeId),
      yPosition: -41,
      type: "iconNode",
      parentNode: getParentNode(nodeId),
      extent: "parent",
      sourcePosition: "right",
      targetPosition: "left",
      iconId: empId,
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
      userId: auth.empId.toString(),
      isRootNode: false,
      fillColor: "",
      fillTransparency: "",
      isParent: false,
      formula: "Formula Value",
      fuelUsed: "Fuel Used Value",
      fuelUnitsId: "Fuel Units ID",
      capacity: "Capacity Value",
      capacityUnitsId: "Capacity Units ID",
      date: getDate(),
    };
    console.log(employeeNode);
    axios
      .post(`${BASE_URL}/api/nodeMaster`, employeeNode)
      .then((response) => {
        console.log(response.data);
        showNodes()
        sendtoConfigurations(employeeNode);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // find current date
  const getDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const EmptyFields = () => {
    setnodeId("");
    setempId("");
    setNewRowActive(false);
  };

  const handleNewRowSubmit = () => {
    const payload = {
      emp: empId,
      node: nodeId,
      branchId: auth.branchId.toString(),
      isActive: true,
      userId: auth.empId.toString(),
      nodeType: "Machine",
      default: "Yes",
      primary: "Yes",
      date: getDate(),
    };
    console.log("new row data:", payload);
    axios
      .post(`${BASE_URL}/api/employeeNodeMapping`, payload)
      .then((response) => {
        console.log("New row added successfully", response.data);
        toast.success(
          <span>
            <strong>Successfully! </strong> Added
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "custom-toast",
          }
        );
        handleCreateNode(nodeId, empId);
        EmptyFields();
        showEmpNodeMapping();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const [searchInput, setSearchInput] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = EmpNodeMapping.filter((item) => {
      const Id = String(item.empnodemapId).toLowerCase();
      const nodeId = String(item.node.nodeId).toLowerCase();
      const nodeName = String(getNodeDescbyId(item.node.nodeId)).toLowerCase();
      const empId = String(item.emp.empId).toLowerCase();
      const empName = String(getEmployeeNamebyId(item.emp.empId)).toLowerCase();
      return (
        Id.includes(searchValue.toLowerCase()) ||
        empId.includes(searchValue.toLowerCase()) ||
        empName.includes(searchValue.toLowerCase()) ||
        nodeId.includes(searchValue.toLowerCase()) ||
        nodeName.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const [height, setHeight] = useState();
  useEffect(() => {
    console.log(tableHeight, "heightt");
    if (tableHeight > "1" && tableHeight < "360") {
      setHeight(tableHeight - "100");
    } else {
      setHeight("350px");
    }
  }, []);
  return (
    <div
      className="container-fluid"
      style={{
        // height: tableHeight ? tableHeight : '200px',
        height: height,
        overflowY: "scroll",
        overflowX: "hidden",
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
        <div className="col-10">
          <table className="table table-bordered table-striped">
            <thead className="sticky-top table-head">
              <tr>
                <th style={{ width: "10%" }}>Id</th>
                <th style={{ width: "10%" }}>Employee Id</th>
                <th style={{ width: "10%" }}>Employee Name</th>
                <th style={{ width: "10%" }}>Node Id</th>
                <th style={{ width: "20%" }}>Node Description</th>
                <th style={{ width: "10%" }}>Default</th>
                <th style={{ width: "10%" }}>Primary</th>
                <th style={{ width: "10%" }}>Node Type</th>
                <th style={{ width: "10%" }}>Actions</th>
              </tr>
            </thead>
            <tbody className=" overflowY:'auto'">
              {isNewRowActive === true && (
                <tr>
                  <td></td>
                  <td colSpan={2}>
                    <select
                      value={empId}
                      onChange={handleEmpId}
                      style={{
                        border: "none",
                        width: "200px",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                    >
                      <option hidden>Employee Id</option>
                      {Employeedata?.map((item) => (
                        <option value={item?.empId}>
                          {item?.empId} - {item?.employeeName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td colSpan={2}>
                    <select
                      style={{
                        border: "none",
                        width: "200px",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                      value={nodeId}
                      onChange={handlenodeId}
                    >
                      <option hidden>Node Id</option>
                      {nodedata
                        .filter((item) => item.nodeType === "Machine")
                        .map((item) => (
                          <option value={item.nodeId}>
                            {item.nodeId} - {item.nodeName}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      style={{ border: "none", background: "transparent" }}
                      onClick={handleNewRowSubmit}
                    >
                      <FaCheck style={{ color: "green" }} />
                    </button>
                    &nbsp;
                    <button
                      style={{ border: "none", background: "transparent" }}
                      onClick={() => setNewRowActive(false)}
                    >
                      <FaXmark style={{ color: "red" }} />
                    </button>
                  </td>
                </tr>
              )}
              {searchInput.length > 0
                ? filteredResults.map((item, index) => (
                    <tr>
                      <td>{item.empnodemapId}</td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.emp.empId}
                            onChange={(e) => {
                              const newData = [...EmpNodeMapping];
                              newData[index].emp.empId = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "70px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Edge Style</option>
                            {Employeedata.map((item) => (
                              <option>{item.empId}</option>
                            ))}
                          </select>
                        ) : (
                          <div>{item.emp.empId}</div>
                        )}
                      </td>
                      <td>{getEmployeeNamebyId(item.emp.empId)}</td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.node.nodeId}
                            onChange={(e) => {
                              const newData = [...EmpNodeMapping];
                              newData[index].node.nodeId = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "70px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Node Id</option>
                            {nodedata.map((item) => (
                              <option>{item.nodeId}</option>
                            ))}
                          </select>
                        ) : (
                          <div>{item.node.nodeId}</div>
                        )}
                      </td>
                      <td>{getNodeDescbyId(item.node.nodeId)}</td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.primary}
                            onChange={(e) => {
                              const newData = [...EmpNodeMapping];
                              newData[index].primary = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "70px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Primary</option>
                            <option value="True">Primary</option>
                            <option value="False">Secondary</option>
                          </select>
                        ) : (
                          <div>{item.primary}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.default}
                            onChange={(e) => {
                              const newData = [...EmpNodeMapping];
                              newData[index].default = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "70px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Primary</option>
                            <option value="True">Yes</option>
                            <option value="False">No</option>
                          </select>
                        ) : (
                          <div>{item.default}</div>
                        )}
                      </td>
                      <td>{item.nodeType}</td>
                      <td style={{ textAlign: "center" }}>
                        {editedIndex === index ? (
                          <>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                              onClick={removeEdit}
                            >
                              <FaXmark id="FaMinus" />
                            </button>
                          </>
                        ) : (
                          <span>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                              onClick={() => handleClickdeletepopup(item.empnodemapId)}
                            >
                              <FaMinus id="FaMinus" />
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
                                    onClick={handleDeleteStaffMapping}
                                  >
                                    Yes
                                  </Button>
                                  <Button onClick={handleDeleteClose}>
                                    No
                                  </Button>
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
                              <FaCheck id="FaCheck" />
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
                            <FaEdit id="FaEdit" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                : EmpNodeMapping.map((item, index) => (
                    <tr>
                      <td>{item.empnodemapId}</td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.emp.empId}
                            onChange={(e) => {
                              const newData = [...EmpNodeMapping];
                              newData[index].emp.empId = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "70px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Edge Style</option>
                            {Employeedata.map((item) => (
                              <option>{item.empId}</option>
                            ))}
                          </select>
                        ) : (
                          <div>{item.emp.empId}</div>
                        )}
                      </td>
                      <td>{getEmployeeNamebyId(item.emp.empId)}</td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.node.nodeId}
                            onChange={(e) => {
                              const newData = [...EmpNodeMapping];
                              newData[index].node.nodeId = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "70px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Node Id</option>
                            {nodedata.map((item) => (
                              <option>{item.nodeId}</option>
                            ))}
                          </select>
                        ) : (
                          <div>{item.node.nodeId}</div>
                        )}
                      </td>
                      <td>{getNodeDescbyId(item.node.nodeId)}</td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.primary}
                            onChange={(e) => {
                              const newData = [...EmpNodeMapping];
                              newData[index].primary = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "70px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Default</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : (
                          <div>{item.primary}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.default}
                            onChange={(e) => {
                              const newData = [...EmpNodeMapping];
                              newData[index].default = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "70px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Primary</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : (
                          <div>{item.default}</div>
                        )}
                      </td>
                      <td>{item.nodeType}</td>
                      <td style={{ textAlign: "center" }}>
                        {editedIndex === index ? (
                          <>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                              onClick={removeEdit}
                            >
                              <FaXmark id="FaMinus" />
                            </button>
                          </>
                        ) : (
                          <span>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                              onClick={() => handleClickdeletepopup(item.empnodemapId)}
                            >
                              <FaMinus id="FaMinus" />
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
                                    onClick={handleDeleteStaffMapping}
                                  >
                                    Yes
                                  </Button>
                                  <Button onClick={handleDeleteClose}>
                                    No
                                  </Button>
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
                              <FaCheck id="FaCheck" />
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
                            <FaEdit id="FaEdit" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {OpenLoader && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={OpenLoader}
              // onClick={handleClose}
            >
              <CircularProgress size={80} color="inherit" />
            </Backdrop>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffAllocation;
