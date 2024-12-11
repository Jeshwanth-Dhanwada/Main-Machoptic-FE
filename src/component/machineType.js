import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
// Material UI for dialog box

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { MdDelete } from "react-icons/md";

import AuthContext from "../context/AuthProvider";

function MachineType() {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [machineCategory, setMachineCategory] = useState([]);
  const [MachineName, setMachineName] = useState();
  const [MachineCateId, setMachineCateIde] = useState();

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/machineType`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data, "machineType");
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/machineCategory`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setMachineCategory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function getmachineTypedata() {
    const apiUrl = `${BASE_URL}/api/machineType`;
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const handleMachineName = (event) => {
    setMachineName(event.target.value);
  };

  const handleMachineCategory = (event) => {
    setMachineCateIde(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      branchId: auth.branchId,
      machineName: MachineName,
      machineCategoryId: MachineCateId,
      userId: auth.empId.toString(),
    };
    console.log(formData);

    axios
      .post(`${BASE_URL}/api/machineType`, formData)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        getmachineTypedata();
        setAddRow(false);
        toast.success(
          <span>
            <strong>Successfully</strong> {MachineName} Added.
          </span>,
          {
            position: toast.POSITION.TOP_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        setMachineName("");
        setMachineCateIde("");
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  function Emptyfields() {
    setMachineName("");
    setMachineCateIde("");
    setAddRow(false);
  }

  const [opendeletepopup, setOpenDelete] = React.useState(false);
  const [searchInput, setSearchInput] = useState([]);
  const [machineTypeId, setmachineTypeId] = useState();
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const name = item.machineName.toLowerCase();
      const id = String(item.machineId).toLowerCase();
      const machineCatId = item.machineCategoryId.toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        machineCatId.includes(searchValue.toLowerCase()) ||
        id.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const HandleClose = () => {
    setEditedIndex(null);
  };

  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setmachineTypeId(Id);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const [editedIndex, setEditedIndex] = useState(null);
  function handleEdit(index) {
    setEditedIndex(index);
  }

  function handledelete(event) {
    event.preventDefault();
    axios
      .delete(`${BASE_URL}/api/machineType/${machineTypeId}`)
      .then((response) => {
        console.log("Shift deleted successfully", response.data);
        getmachineTypedata();
        handleDeleteClose();
        toast.error(
          <span>
            <strong>Deleted</strong> successfully.
          </span>,
          {
            position: toast.POSITION.TOP_RIGHT, // Set position to top center
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
            position: toast.POSITION.TOP_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      });
  }

  function UpdateMachineCategory(event, machineTypeId) {
    event.preventDefault();
    const editedItem = data[editedIndex];
    const payload = {
      machineName: editedItem.machineName.toString(),
      machineCategoryId: editedItem.machineCategoryId,
      branchId: auth.branchId.toString(),
      userId: auth.empId.toString(),
    };

    axios
      .put(`${BASE_URL}/api/machineType/${machineTypeId}`, payload)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        getmachineTypedata();
        setEditedIndex(null);
        toast.success(
          <span>
            <strong>successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.TOP_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }

  const [AddRow, setAddRow] = useState(false);
  const handleAddNewRow = () => {
    setAddRow(!AddRow);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 d-flex align-items-center">
            <input
              type="text"
              className="form-control"
              onChange={(e) => searchItems(e.target.value)}
              value={searchInput}
              style={{ flex: 1, height: "30px" }}
              placeholder="Search"
            />
            <Button
              onClick={handleAddNewRow}
              id="addbutton"
              style={{ marginLeft: "10px" }}
            >
              <FaPlus />
            </Button>
          </div>
        </div>
      </div>
      <div
        className="container-fluid"
        style={{ height: "194px", overflowY: "auto" }}
      >
        <div className="row">
          <div className="col-6">
            <table className="table table-bordered table-striped">
              <thead>
                <tr className="sticky-top">
                  <th>Id</th>
                  <th>Machine Name</th>
                  <th>Machine Category Id</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {AddRow === true && (
                  <tr>
                    <td></td>
                    <td>
                      <input
                        type="text"
                        id="MachineName"
                        name="MachineName"
                        className="form-control"
                        placeholder="Enter MachineName"
                        value={MachineName}
                        style={{ height: "30px" }}
                        onChange={handleMachineName}
                        required
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ height: "30px" }}
                        onChange={handleMachineCategory}
                        value={MachineCateId}
                      >
                        <option hidden>Machine Category ID</option>
                        {machineCategory?.map((item) => (
                          <option value={item?.CategoryId}>
                            {item?.CategoryId} - {item?.CategoryDescription}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button className="btn text-success btn-sm"
                        onClick={handleSubmit}>
                      <FaCheck/>
                      </button>
                      &nbsp;
                      <button className="btn text-danger btn-sm" onClick={Emptyfields}>
                      <FaXmark />
                      </button>
                    </td>
                  </tr>
                )}
                {searchInput.length > 0
                  ? filteredResults.map((item, index) => (
                      <tr>
                        <td>{item.machineId}</td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.machineName}
                              className="form-control"
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].machineName = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "30px",
                              }}
                            />
                          ) : (
                            <div>{item.machineName}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <select
                              value={item.machineCategoryId}
                              className="form-select"
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].machineCategoryId =
                                  e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "30px",
                              }}
                            >
                              <option hidden>Machine Category ID</option>
                              {machineCategory.map((item) => (
                                <option value={item?.CategoryId}>
                                  {item?.CategoryId} -{" "}
                                  {item?.CategoryDescription}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div>{item.machineCategoryId}</div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editedIndex === index ? (
                            <div>
                              <FaCheck
                                onClick={(event) =>
                                  UpdateMachineCategory(event, item.machineId)
                                }
                                className="text-success"
                                id="actionsIcons"
                              />
                              &nbsp;&nbsp;&nbsp;
                              <FaXmark
                                className="text-danger"
                                onClick={HandleClose}
                                id="actionsIcons"
                              />
                            </div>
                          ) : (
                            <div>
                              <FaEdit
                                className="text-primary"
                                onClick={() => handleEdit(index)}
                                id="actionsIcons"
                              />
                              &nbsp;&nbsp;&nbsp;
                              <MdDelete
                                className="text-danger"
                                onClick={() =>
                                  handleClickdeletepopup(item.machineId)
                                }
                                id="actionsIcons"
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  : data.map((item, index) => (
                      <tr>
                        <td>{item.machineId}</td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.machineName}
                              className="form-control"
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].machineName = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "30px",
                              }}
                            />
                          ) : (
                            <div>{item.machineName}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <select
                              value={item.machineCategoryId}
                              className="form-select"
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].machineCategoryId =
                                  e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "30px",
                              }}
                            >
                              <option hidden>Machine Category ID</option>
                              {machineCategory.map((item) => (
                                <option value={item?.CategoryId}>
                                  {item?.CategoryId} -{" "}
                                  {item?.CategoryDescription}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div>{item.machineCategoryId}</div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editedIndex === index ? (
                            <div>
                              <FaCheck
                                onClick={(event) =>
                                  UpdateMachineCategory(event, item.machineId)
                                }
                                className="text-success"
                                id="actionsIcons"
                              />
                              &nbsp;&nbsp;&nbsp;
                              <FaXmark
                                className="text-danger"
                                onClick={HandleClose}
                                id="actionsIcons"
                              />
                            </div>
                          ) : (
                            <div>
                              <FaEdit
                                className="text-primary"
                                onClick={() => handleEdit(index)}
                                id="actionsIcons"
                              />
                              &nbsp;&nbsp;&nbsp;
                              <MdDelete
                                className="text-danger"
                                onClick={() =>
                                  handleClickdeletepopup(item.machineId)
                                }
                                id="actionsIcons"
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
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
              <Button onClick={(event) => handledelete(event)} autoFocus>
                Yes
              </Button>
              <Button onClick={handleDeleteClose}>No</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MachineType;
