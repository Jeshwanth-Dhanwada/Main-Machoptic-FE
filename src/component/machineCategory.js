import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaPlus } from "react-icons/fa6";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import AuthContext from "../context/AuthProvider";

function MachineCategory() {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/machineCategory`;
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

  function getMachineCategory() {
    const apiUrl = `${BASE_URL}/api/machineCategory`;
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

  const [opendeletepopup, setOpenDelete] = React.useState(false);
  const [searchInput, setSearchInput] = useState([]);
  const [MachineCateId, setMachineCateId] = useState();
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const Id = String(item.CategoryId).toLowerCase();
      const CategoryDescription = item.CategoryDescription.toLowerCase();
      return (
        Id.includes(searchValue.toLowerCase()) ||
        CategoryDescription.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setMachineCateId(Id);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const [CategoryDesc, setCategoryDesc] = useState("");

  const handleMachineCategoryDesc = (event) => {
    setCategoryDesc(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      branchId: auth.branchId,
      userId: auth.empId.toString(),
      CategoryDescription: CategoryDesc,
    };
    axios
      .post(`${BASE_URL}/api/machineCategory`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        toast.success(
          <p>
            <strong>Successfully</strong> Updated
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        getMachineCategory();
        Emptyfields();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  function Emptyfields() {
    setCategoryDesc("");
    setAddRow(false);
    setEditedIndex(null);
  }

  function updateFields(event, MachineCateId) {
    event.preventDefault();
    const editedItem = data[editedIndex];
    const payload = {
      branchId: auth.branchId,
      userId: auth.empId.toString(),
      CategoryDescription: editedItem.CategoryDescription.toString(),
    };
    axios
      .put(`${BASE_URL}/api/machineCategory/${MachineCateId}`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        toast.success(
          <p>
            <strong>Successfully</strong> Updated
          </p>,
          {
            position: toast.POSITION.TOP_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        getMachineCategory();
        Emptyfields();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  }

  function handledelete() {
    axios
      .delete(`${BASE_URL}/api/machineCategory/${MachineCateId}`)
      .then((response) => {
        console.log("machineCategory deleted successfully", response.data);
        getMachineCategory();
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

  const [AddRow, setAddRow] = useState(false);
  const handleAddNewRow = () => {
    setAddRow(!AddRow);
  };

  const [editedIndex, setEditedIndex] = useState(null);
  function handleEdit(index) {
    setEditedIndex(index);
  }

  const HandleClose = () => {
    setEditedIndex(null);
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

      <div className="container-fluid"
         style={{ height: "194px", overflowY: "auto" }}
      >
        <div className="row">
          <div className="col-4">
            <table className="table table-bordered table-striped">
              <thead className="Sticy-top">
                <tr>
                  <th>Id</th>
                  <th>Machine Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {AddRow === true && (
                  <tr>
                    <td></td>
                    <td>
                      <input
                        id="MachineCategory"
                        name="MachineCategory"
                        className="form-control"
                        value={CategoryDesc}
                        placeholder="Enter MachineCategory"
                        onChange={handleMachineCategoryDesc}
                        required
                        style={{ height: "30px" }}
                      ></input>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn text-success btn-sm"
                        onClick={handleSubmit}
                      >
                        <FaCheck />
                      </button>
                      &nbsp;
                      <button
                        className="btn text-danger btn-sm"
                        onClick={Emptyfields}
                      >
                        <FaXmark />
                      </button>
                    </td>
                  </tr>
                )}
                {searchInput.length > 0
                  ? filteredResults.map((item, index) => (
                      <tr>
                        <td>{item.CategoryId}</td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.CategoryDescription}
                              className="form-control"
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].CategoryDescription =
                                  e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "30px",
                              }}
                            />
                          ) : (
                            <div>{item.CategoryDescription}</div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editedIndex === index ? (
                            <div>
                              <FaCheck
                                onClick={(event) =>
                                  updateFields(event, item.CategoryId)
                                }
                                className="text-success"
                                id="actionsIcons"
                              />
                              &nbsp;
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
                                  handleClickdeletepopup(item.CategoryId)
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
                        <td>{item.CategoryId}</td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.CategoryDescription}
                              className="form-control"
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].CategoryDescription =
                                  e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "30px",
                              }}
                            />
                          ) : (
                            <div>{item.CategoryDescription}</div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editedIndex === index ? (
                            <div>
                              <FaCheck
                                onClick={(event) =>
                                  updateFields(event, item.CategoryId)
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
                                  handleClickdeletepopup(item.CategoryId)
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
            <Button onClick={handledelete} autoFocus>
              Yes
            </Button>
            <Button onClick={handleDeleteClose}>No</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <ToastContainer />
    </div>
  );
}

export default MachineCategory;
