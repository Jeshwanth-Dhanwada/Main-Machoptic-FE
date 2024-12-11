import React, { useState, useEffect, useContext } from "react";
import { FaMinus, FaPlus, FaXmark, FaCheck } from "react-icons/fa6";
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
import { getShifts } from "../api/shovelDetails";

function Shift({tableHeight}) {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [shiftName, setShiftName] = useState();
  const [shiftNumber, setShiftNumber] = useState();
  const [StartTime, setStartTime] = useState();
  const [EndTime, setEndTime] = useState();

  const showShiftData = async(key) =>{
    const responsedata = await getShifts()
    setData(responsedata,key)
  }
  useEffect(() => {
    showShiftData()
  }, [])

  const handleShiftNameChange = (event) => {
    setShiftName(event.target.value);
    console.log("shiftName", shiftName);
  };
  const handleShiftNumberChange = (event) => {
    setShiftNumber(event.target.value);
    console.log("shiftName", shiftNumber);
  };
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
    console.log("shiftstart", StartTime);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
    // console.log("shiftend", EndTime);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      branchId: auth.branchId.toString(),
      shiftName: shiftName,
      shiftNumber: shiftNumber,
      startTime: StartTime,
      endTime: EndTime,
      userId: auth.empId.toString(),
    };
    console.log(formData);

    axios
      .post(`${BASE_URL}/api/shift`, formData)
      .then((response) => {
        console.log(response.data);
        showShiftData();
        toast.success(
          <span>
            <strong>Successfully</strong> {shiftName} Shift Added.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        Emptyfields();
        setNewRowActive(false);
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  function Emptyfields() {
    setShiftName("");
    setStartTime("");
    setEndTime("");
    setShiftNumber("");
  }

  const [opendeletepopup, setOpenDelete] = React.useState(false);
  const [searchInput, setSearchInput] = useState([]);
  const [shiftId, setshiftId] = useState();
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const name = item.shiftName.toLowerCase();
      const Id = String(item.shiftId).toLowerCase();
      const Snumber = String(item.shiftNumber).toLowerCase();
      const STime = item.startTime.toLowerCase();
      const ETime = item.endTime.toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        Id.includes(searchValue.toLowerCase()) ||
        STime.includes(searchValue.toLowerCase()) ||
        Snumber.includes(searchValue.toLowerCase()) ||
        ETime.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setshiftId(Id);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  function handledelete() {
    axios
      .delete(`${BASE_URL}/api/shift/${shiftId}`)
      .then((response) => {
        console.log("Shift deleted successfully", response.data);
        showShiftData();
        setOpenDelete(false);
        toast.success(
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
  };


  function handleSave(event, Id) {
    const editedItem = data[editedIndex];
    event.preventDefault();
    const payload = {
      shiftName: editedItem.shiftName.toString(),
      shiftNumber: editedItem.shiftNumber.toString(),
      startTime: editedItem.startTime.toString(),
      endTime: editedItem.endTime.toString(),
      branchId: auth.branchId.toString(),
      userId: auth.empId.toString(),
    };
    console.log(payload, "payload");

    axios
      .put(`${BASE_URL}/api/shift/${Id}`, payload)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        toast.success(
          <span>
            <strong>successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        setEditedIndex(null);
        showShiftData();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
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
        <div className="col-12">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>Id</th>
                <th style={{ width: "20%" }}>Shift Name</th>
                <th style={{ width: "20%" }}>Shift Number</th>
                <th style={{ width: "20%" }}>Start Time</th>
                <th style={{ width: "20%" }}>End Time</th>
                <th style={{ width: "15%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isNewRowActive && (
                <tr>
                  <td></td>
                  <td>
                    <input
                      type="text"
                      id="ShiftName"
                      name="ShiftName"
                      placeholder="Enter ShiftName"
                      value={shiftName}
                      style={{ fontSize: "11px", height: "22px" }}
                      onChange={handleShiftNameChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      id="ShiftNumber"
                      name="ShiftNumber"
                      placeholder="Enter ShiftNumber"
                      value={shiftNumber}
                      style={{ fontSize: "11px" }}
                      onChange={handleShiftNumberChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      id="StartTime"
                      name="StartTime"
                      value={StartTime}
                      onChange={handleStartTimeChange}
                      required
                      style={{ fontSize: "11px" }}
                      step={1}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      id="EndTime"
                      name="EndTime"
                      value={EndTime}
                      style={{ fontSize: "11px" }}
                      onChange={handleEndTimeChange}
                      step={1}
                      required
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <FaCheck id="FaCheck" onClick={handleSubmit} />
                    &nbsp;&nbsp;&nbsp;
                    <FaXmark
                      id="FaMinus"
                      onClick={() => setNewRowActive(false)}
                    />
                  </td>
                </tr>
              )}
              {searchInput.length > 0
                ? filteredResults.map((item, index) => (
                    <tr>
                      <td>{item.shiftId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.shiftName}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].shiftName = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.shiftName}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.shiftNumber}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].shiftNumber = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.shiftNumber}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.startTime}
                            type="time"
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].startTime = e.target.value;
                              setData(newData);
                            }}
                            step={1}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.startTime}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.endTime}
                            type="time"
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].endTime = e.target.value;
                              setData(newData);
                            }}
                            step={1}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.endTime}</div>
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
                                handleClickdeletepopup(item.shiftNumber)
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
                          <FaCheck
                            id="FaCheck"
                            onClick={(e) => handleSave(e, item.shiftNumber)}
                          />
                        ) : (
                          <FaEdit
                            id="FaEdit"
                            onClick={() => handleEdit(index)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                : data.map((item, index) => (
                    <tr>
                      <td>{item.shiftId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.shiftName}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].shiftName = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.shiftName}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.shiftNumber}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].shiftNumber = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.shiftNumber}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.startTime}
                            type="time"
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].startTime = e.target.value;
                              setData(newData);
                            }}
                            step={1}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.startTime}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.endTime}
                            type="time"
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].endTime = e.target.value;
                              setData(newData);
                            }}
                            step={1}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.endTime}</div>
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
                                handleClickdeletepopup(item.shiftNumber)
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
                          <FaCheck
                            id="FaCheck"
                            onClick={(e) => handleSave(e, item.shiftNumber)}
                          />
                        ) : (
                          <FaEdit
                            id="FaEdit"
                            onClick={() => handleEdit(index)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
}

export default Shift;
