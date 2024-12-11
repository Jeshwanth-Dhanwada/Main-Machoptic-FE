import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaMinus, FaPlus } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";

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
import { getDepartments } from "../api/shovelDetails";
function DepartmentForm({tableHeight}) {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([]);

  const showDepartmentData = async(key) =>{
    const responsedata = await getDepartments()
    setData(responsedata,key)
  }
  useEffect(() => {
    showDepartmentData()
  }, [])


  // Initialize state variables for form fields
  const [deptName, setdeptName] = useState();

  // Handle input changes
  const handledeptName = (e) => {
    setdeptName(e.target.value);
  };

  function Emptyfields() {
    setdeptName("");
    setNewRowActive(false);
    setEditedIndex(null);
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      userId: auth.empId.toString(),
      branchId: auth.branchId.toString(),
      deptName: deptName,
    };

    axios
      .post(`${BASE_URL}/api/department`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        showDepartmentData();
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

  const [opendeletepopup, setOpenDelete] = React.useState(false);
  const [departmentId, setdepartmentId] = useState();
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const name = item.deptName.toLowerCase();
      const Id = String(item.deptId).toLowerCase();
      const userId = item.userId.toLowerCase();
      const branch = item.branchId.toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        Id.includes(searchValue.toLowerCase()) ||
        name.includes(searchValue.toLowerCase()) ||
        userId.includes(searchValue.toLowerCase()) ||
        branch.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setdepartmentId(Id);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  function handleSave(event, Id) {
    const editedItem = data[editedIndex];
    event.preventDefault();
    const payload = {
      userId: auth.empId.toString(),
      branchId: auth.branchId.toString(),
      deptName: editedItem.deptName.toString(),
    };

    axios
      .put(`${BASE_URL}/api/department/${Id}`, payload)
      .then((response) => {
        console.log(response.data);
        showDepartmentData();
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
      .delete(`${BASE_URL}/api/department/${departmentId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        showDepartmentData();
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
            <strong>Cannot be</strong> deleted.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      });
  }
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
    <div className="container-fluid p-2" style={{
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
        <div className="col-4">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Id</th>
                <th style={{ width: "70%" }}>Department Name</th>
                <th style={{ width: "20%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isNewRowActive && (
                <tr>
                  <td></td>
                  <td>
                    <input
                      type="text"
                      id="departmentName"
                      name="departmentName"
                      value={deptName}
                      placeholder="Enter Department Name"
                      onChange={handledeptName}
                      required
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
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
                      <td>{item.deptId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.deptName}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].deptName = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.deptName}</div>
                        )}
                      </td>
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
                              onClick={() =>
                                handleClickdeletepopup(item.deptId)
                              }
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
                                  <Button onClick={(e) => handledelete(e)}>
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
                              onClick={(e) => handleSave(e, item.deptId)}
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
                : data.map((item, index) => (
                    <tr>
                      <td>{item.deptId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.deptName}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].deptName = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.deptName}</div>
                        )}
                      </td>
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
                              onClick={() =>
                                handleClickdeletepopup(item.deptId)
                              }
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
                                  <Button onClick={(e) => handledelete(e)}>
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
                              onClick={(e) => handleSave(e, item.deptId)}
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

export default DepartmentForm;
