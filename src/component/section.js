import React, { useState, useEffect, useContext } from "react";
import {FaMinus, FaPlus, FaXmark, FaCheck } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";

import "./sidebar.css";
import Tooltip from "@mui/material/Tooltip";
// Material UI for dialog box

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import AuthContext from "../context/AuthProvider";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { getSectiondata } from "../api/shovelDetails";

function Section({tableHeight}) {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [department, setdepartment] = useState([]);
  
  const showSectionData = async(key) =>{
    const responsedata = await getSectiondata()
    setData(responsedata,key)
  }

  const showDepartmentData = async(key) =>{
    const responsedata = await getSectiondata()
    setdepartment(responsedata,key)
  }

  useEffect(() => {
    showSectionData()
    showDepartmentData()
  }, []);

  const [sectionName, setsectionName] = useState("");
  const [deptId, setdeptId] = useState("");

  const handlesectionName = (e) => {
    setsectionName(e.target.value);
  };
  const handledeptId = (e) => {
    setdeptId(e.target.value);
  };

  const [opendeletepopup, setOpenDelete] = React.useState(false);
  const [searchInput, setSearchInput] = useState([]);
  const [sectionId, setsectionId] = useState();
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const name = item.sectionName.toLowerCase();
      const Id = String(item.sectionId).toLowerCase();
      const deptId = String(item.deptId).toLowerCase();
      const userId = item.userId.toLowerCase();
      const branch = item.branchId.toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        Id.includes(searchValue.toLowerCase()) ||
        name.includes(searchValue.toLowerCase()) ||
        userId.includes(searchValue.toLowerCase()) ||
        branch.includes(searchValue.toLowerCase()) ||
        deptId.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const handleClickdeletepopup = (Id) => {
    console.log(Id,"check")
    setsectionId(Id)
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  function Emptyfields() {
    setsectionName("");
    setdeptId("");
  }

  function handleSave(event,Id) {
    const editedItem = data[editedIndex];
    event.preventDefault();
    const payload = {
      userId: auth.empId.toString(),
      branchId: auth.branchId.toString(),
      deptId: editedItem.deptId.toString(),
      sectionName: editedItem.sectionName.toString(),
    };

    axios
      .put(`${BASE_URL}/api/section/${Id}`, payload)
      .then((response) => {
        console.log("New row added successfully");
        showSectionData();
        setEditedIndex(null)
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        Emptyfields();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  }

  function handledelete(event) {
    event.preventDefault();
    axios
      .delete(`${BASE_URL}/api/section/${sectionId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        showSectionData();
        setOpenDelete(false);
        toast.error(
          <span>
            <strong>Deleted</strong> successfully.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
        toast.error(
          <span>
            <strong>{error}</strong>.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      });
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      userId: auth.empId.toString(),
      branchId: auth.branchId.toString(),
      deptId: deptId,
      sectionName: sectionName,
    };

    axios
      .post(`${BASE_URL}/api/section`, payload)
      .then((response) => {
        console.log("New row added successfully");
        showSectionData();
        setNewRowActive(false)
        toast.success(
          <span>
            <strong>Successfully</strong> Added.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        Emptyfields();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(true);
  };

  const [editedIndex, setEditedIndex] = useState(null);
  const handleEdit = (index) => {
    setEditedIndex(index);
  };

  const removeEdit = (index) => {
    setEditedIndex(null);
  };
  
  const [height, setHeight] = useState();
  useEffect(() => {
    console.log(tableHeight,"heightt")
    if(tableHeight > '1' && tableHeight < '360'){
      setHeight(tableHeight);
    }
    else{
      setHeight('350px')
    }
  }, []);
  return (
    <div className="container-fluid" style={{
      // height: tableHeight ? tableHeight : '200px',
      height:  height,
      overflowY: "scroll",
      overflowX :"hidden"
    }}>
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
      <div className="row">
        <div className="col-6">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th style={{width:'15%'}}>Section Id</th>
                <th style={{width:'25%'}}>Department Id</th>
                <th style={{width:'30%'}}>Section Name</th>
                <th style={{width:'15%'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isNewRowActive && (
                <tr>
                  <td></td>
                  <td>
                    <select
                      id="DeptID"
                      name="DeptID"
                      value={deptId}
                      onChange={handledeptId}
                      style={{ height: "22px" }}
                    >
                      <option hidden>Please Select</option>
                      {department.map((item) => (
                        <option>{item.deptId}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="SectionName"
                      name="SectionName"
                      value={sectionName}
                      onChange={handlesectionName}
                      placeholder="Enter Section Name"
                      required
                      style={{ height: "22px" }}
                    />
                  </td>
                  <td style={{textAlign:'center'}}>
                    <button
                      style={{ border: "none", background: "transparent" }}
                      onClick={handleSubmit}
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
                  <td>{item.sectionId}</td>
                  <td>
                  {editedIndex === index ? (
                    <select
                      value={item.deptId}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index].deptId = e.target.value;
                        setData(newData);
                      }}
                      style={{
                        border: "none",
                        //       width: "100px",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                    >
                      <option hidden>Please Select</option>
                      {department.map((item) => (
                        <option>{item.deptId}</option>
                      ))}
                    </select>
                    ) : (
                      <div>
                        {item.deptId}
                      </div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.sectionName}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index].sectionName = e.target.value;
                          setData(newData);
                        }}
                        style={{
                          border: "none",
                          //       width: "100px",
                          height: "20px",
                          backgroundColor: "whitesmoke",
                        }}
                      />
                    ) : (
                      <div>{item.sectionName}</div>
                    )}
                  </td>
                  <td style={{textAlign:'center'}}>
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
                          onClick={handleClickdeletepopup}
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
                              onClick={(e) =>
                                handledelete(e)
                              }
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
                          onClick={(e) => handleSave(e,item.sectionId)}
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
                :
              data.map((item, index) => (
                <tr>
                  <td>{item.sectionId}</td>
                  <td>
                  {editedIndex === index ? (
                    <select
                      value={item.deptId}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index].deptId = e.target.value;
                        setData(newData);
                      }}
                      style={{
                        border: "none",
                        //       width: "100px",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                    >
                      <option hidden>Please Select</option>
                      {department.map((item) => (
                        <option>{item.deptId}</option>
                      ))}
                    </select>
                    ) : (
                      <div>
                        {item.deptId}
                      </div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.sectionName}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index].sectionName = e.target.value;
                          setData(newData);
                        }}
                        style={{
                          border: "none",
                          //       width: "100px",
                          height: "20px",
                          backgroundColor: "whitesmoke",
                        }}
                      />
                    ) : (
                      <div>{item.sectionName}</div>
                    )}
                  </td>
                  <td style={{textAlign:'center'}}>
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
                          onClick={() => handleClickdeletepopup(item.sectionId)}
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
                              onClick={(e) =>
                                handledelete(e)
                              }
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
                          onClick={(e) => handleSave(e,item.sectionId)}
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
        </div>
      </div>
    </div>
  );
}

export default Section;
