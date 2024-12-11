import React, { useState, useEffect, useContext } from "react";
import { FaSistrix, FaMinus, FaPlus, FaXmark, FaCheck } from "react-icons/fa6";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../constants/apiConstants";
import Tooltip from "@mui/material/Tooltip";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { getUnitsdata } from "../api/shovelDetails";

import AuthContext from "../context/AuthProvider";
import { FaEdit } from "react-icons/fa";

function Units({tableHeight}) {
  const { auth } = useContext(AuthContext);
  const [unitDescription, setUnitDescription] = useState("");
  const [conversionRate, setconversionRate] = useState("");
  const [refUnitId, setrefUnitId] = useState("");
  const [unitsdata, setunitsdata] = useState([]);

  const showUnitsData = async (key) => {
    const responsedata = await getUnitsdata();
    setunitsdata(responsedata, key);
  };

  useEffect(() => {
    showUnitsData();
  }, []);

  const handleunitDescription = (e) => {
    setUnitDescription(e.target.value);
    // setSubmitted(false);
  };

  // Handling the handleunitconversionRate change
  const handleunitconversionRate = (e) => {
    setconversionRate(e.target.value);
  };
  // Handling the handlerefUnitId change
  const handlerefUnitId = (e) => {
    setrefUnitId(e.target.value);
  };

  function setDefault() {
    setUnitDescription("");
    setconversionRate("");
    setrefUnitId("");
    setShowForm1(true);
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const drop = {
      branchId: auth.branchId.toString(),
      unitDescription: unitDescription,
      conversionRate: conversionRate,
      refUnitId: refUnitId,
      userId: auth.empId.toString(),
    };

    axios
      .post(`${BASE_URL}/api/unitMaster`, drop)
      .then((response) => {
        console.log("New row added successfully");
        showUnitsData();
        setNewRowActive(false);
        toast.success(
          <p>
            <strong>Successfully</strong> Added Units.
          </p>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        setDefault();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const [opendeletepopup, setOpenDelete] = React.useState(false);
  const [searchInput, setSearchInput] = useState([]);
  const [unitId, setUnitId] = useState();
  const [filteredResults, setFilteredResults] = useState([]);
  const [showForm1, setShowForm1] = useState(true);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = unitsdata.filter((item) => {
      const Id = String(item.unitId).toLowerCase();
      const branchId = item.branchId.toLowerCase();
      const unitDescription = item.unitDescription.toLowerCase();
      const conversionRate = item.conversionRate.toLowerCase();
      const refUnitId = item.refUnitId.toLowerCase();
      return (
        branchId.includes(searchValue.toLowerCase()) ||
        Id.includes(searchValue.toLowerCase()) ||
        unitDescription.includes(searchValue.toLowerCase()) ||
        conversionRate.includes(searchValue.toLowerCase()) ||
        refUnitId.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const handleClickdeletepopup = (Id) => {
    setUnitId(Id);
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  function handleSave(event, Id) {
    const editedItem = unitsdata[editedIndex];
    event.preventDefault();
    const payload = {
      branchId: auth.branchId.toString(),
      unitDescription: editedItem.unitDescription.toString(),
      conversionRate: editedItem.conversionRate.toString(),
      refUnitId: editedItem.refUnitId.toString(),
      userId: auth.empId.toString(),
    };
    console.log(payload);

    axios
      .put(`${BASE_URL}/api/unitMaster/${Id}`, payload)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(false);
        showUnitsData();
        toast.success(
          <span>
            <strong>successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }

  function handledelete() {
    axios
      .delete(`${BASE_URL}/api/unitMaster/${unitId}`)
      .then((response) => {
        console.log("Shift deleted successfully", response.data);
        showUnitsData();
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
        <div className="col-8">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Units Id</th>
                <th style={{ width: "20%" }}>Units descripton</th>
                <th style={{ width: "20%" }}>Conversion rate</th>
                <th style={{ width: "20%" }}>Reference Unit ID</th>
                <th style={{ width: "15%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isNewRowActive && (
                <tr>
                  <td></td>
                  <td>
                    <input
                      onChange={handleunitDescription}
                      placeholder=" Enter Unit Description"
                      value={unitDescription}
                      type="text"
                      required
                    />
                  </td>

                  <td>
                    <input
                      onChange={handleunitconversionRate}
                      placeholder="Enter Conversion Rate"
                      value={conversionRate}
                      type="text"
                      required
                    />
                  </td>
                  <td>
                    <input
                      onChange={handlerefUnitId}
                      placeholder="Enter Reference Unit ID"
                      value={refUnitId}
                      type="number"
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
                      <td>{item.unitId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.unitDescription}
                            onChange={(e) => {
                              const newData = [...unitsdata];
                              newData[index].unitDescription = e.target.value;
                              setunitsdata(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.unitDescription}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.conversionRate}
                            onChange={(e) => {
                              const newData = [...unitsdata];
                              newData[index].conversionRate = e.target.value;
                              setunitsdata(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.conversionRate}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.refUnitId}
                            onChange={(e) => {
                              const newData = [...unitsdata];
                              newData[index].refUnitId = e.target.value;
                              setunitsdata(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.refUnitId}</div>
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
                                handleClickdeletepopup(item.unitId)
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
                              onClick={(e) => handleSave(e, item.unitId)}
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
                : unitsdata.map((item, index) => (
                    <tr>
                      <td>{item.unitId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.unitDescription}
                            onChange={(e) => {
                              const newData = [...unitsdata];
                              newData[index].unitDescription = e.target.value;
                              setunitsdata(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.unitDescription}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.conversionRate}
                            onChange={(e) => {
                              const newData = [...unitsdata];
                              newData[index].conversionRate = e.target.value;
                              setunitsdata(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.conversionRate}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.refUnitId}
                            onChange={(e) => {
                              const newData = [...unitsdata];
                              newData[index].refUnitId = e.target.value;
                              setunitsdata(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.refUnitId}</div>
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
                                handleClickdeletepopup(item.unitId)
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
                              onClick={(e) => handleSave(e, item.unitId)}
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

export default Units;
