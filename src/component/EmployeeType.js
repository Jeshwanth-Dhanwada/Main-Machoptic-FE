import { FaXmark, FaCheck, FaMinus, FaPlus } from "react-icons/fa6";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";

import Tooltip from "@mui/material/Tooltip";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { FaEdit } from "react-icons/fa";
import AuthContext from "../context/AuthProvider";

function EmployeeType({tableHeight}) {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/empType`;
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

  function getUnitsdata() {
    const apiUrl = `${BASE_URL}/api/empType`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const [EmpType, setEmpType] = useState();

  // Handle input changes
  const handleEmpType = (event) => {
    setEmpType(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      branchId: auth.branchId.toString(),
      userId: auth.empId.toString(),
      empType: EmpType,
    };

    axios
      .post(`${BASE_URL}/api/empType`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        toast.success(
          <p>
            <strong>Successfully</strong> Added
          </p>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        getUnitsdata();
        // Reset the form after submission
        Emptyfields();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  function Emptyfields() {
    setEmpType("");
    setNewRowActive(false);
    setEditedIndex(null);
  }

  const [opendeletepopup, setOpenDelete] = React.useState(false);
  const [EmployeeTypeId, setEmpTypeId] = useState();
  const [searchInput, setSearchInput] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const Id = String(item.empTypeId).toLowerCase();
      const emptype = item.empType.toLowerCase();
      return (
        Id.includes(searchValue.toLowerCase()) ||
        emptype.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setEmpTypeId(Id);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  function handleSave(event, Id) {
    const editedItem = data[editedIndex];
    event.preventDefault();
    const payload = {
      branchId: auth.branchId.toString(),
      userId: auth.empId.toString(),
      empType: editedItem.empType.toString(),
    };

    axios
      .put(`${BASE_URL}/api/empType/${Id}`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        toast.success(
          <p>
            <strong>Successfully</strong> Updated
          </p>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        getUnitsdata();
        Emptyfields();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  }

  function handledelete(event) {
    event.preventDefault();
    axios
      .delete(`${BASE_URL}/api/empType/${EmployeeTypeId}`)
      .then((response) => {
        console.log("Shift deleted successfully", response.data);
        getUnitsdata();
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
                <th style={{ width: "70%" }}>Employee Type</th>
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
                      id="EmpType"
                      name="EmpType"
                      placeholder="Type of Employee"
                      onChange={handleEmpType}
                      value={EmpType}
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
                      <td>{item.empTypeId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.empType}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].empType = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.empType}</div>
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
                              onClick={(e) => handleSave(e, item.empTypeId)}
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
                      <td>{item.empTypeId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.empType}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].empType = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.empType}</div>
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
                                handleClickdeletepopup(item.empTypeId)
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
                              onClick={(e) => handleSave(e, item.empTypeId)}
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

export default EmployeeType;
