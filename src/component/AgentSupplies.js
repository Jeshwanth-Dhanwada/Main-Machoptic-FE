import React, { useContext, useEffect, useState } from "react";
import { getAgentSupplies } from "../api/shovelDetails";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { FaCheck, FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
import AuthContext from "../context/AuthProvider";
import { BASE_URL } from "../constants/apiConstants";
import { FaEdit } from "react-icons/fa";

function AgentSupplies({tableHeight}) {
  const { auth } = useContext(AuthContext);
  const [agentSuppliesData, setAgentSuppliesData] = useState([]);
  const showAgentSupplies = async (key) => {
    const responsedata = await getAgentSupplies();
    setAgentSuppliesData(responsedata, key);
  };
  useEffect(() => {
    showAgentSupplies();
  }, []);

  const [fullName, setFullName] = useState();
  const [Address, setAddress] = useState();
  const [Phone, setPhone] = useState();
  const [Email, setEmail] = useState();
  const [Notes, setNotes] = useState();
  const HandleFullName = (e) => {
    setFullName(e.target.value);
  };
  const HandleAddress = (e) => {
    setAddress(e.target.value);
  };
  const HandlePhone = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Checks if the input is numeric
      setPhone(value);
    }
  };
  const HandleEmail = (e) => {
    setEmail(e.target.value);
  };
  const HandleNotes = (e) => {
    setNotes(e.target.value);
  };
  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(true);
  };

  const EmptyFields = () => {
    setFullName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setNotes("");
  };

  const handleNewRowSubmit = () => {
    const payload = {
      FullName: fullName,
      Address: Address,
      Phone: Phone,
      Email: Email,
      Notes: Notes,
      userId: auth.empId.toString(),
    };
    console.log(payload);
    axios
      .post(`${BASE_URL}/api/agentsupplies`, payload)
      .then((response) => {
        console.log("New row added successfully", response.data);
        showAgentSupplies();
        EmptyFields();
        toast.success(
          <span>
            <strong>Successfully! </strong> Added.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        setNewRowActive(false);
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const [editedIndex, setEditedIndex] = useState(null);
  const handleEdit = (index) => {
    setEditedIndex(index);
  };

  const removeEdit = (index) => {
    setEditedIndex(null);
  };

  const handleSave = () => {
    const editedItem = agentSuppliesData[editedIndex];
    const edite = {
      FullName: editedItem.FullName,
      Address: editedItem.Address,
      Phone: editedItem.Phone,
      Email: editedItem.Email,
      Notes: editedItem.Notes,
      userId: auth.empId.toString(),
    };
    axios
      .put(`${BASE_URL}/api/agentsupplies/${editedItem.Id}`, edite)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(null);
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setEditedIndex(null);
      });
  };

  const [opendeletepopup, setOpenDelete] = useState(false);
  const [agentSuppliesId,setAgentSuppliesId] = useState()
  const handleClickdeletepopup = (Id) => {
    setAgentSuppliesId(Id)
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDeleteAgentSupplies = (e) => {
    e.preventDefault();
    axios
      .delete(`${BASE_URL}/api/agentsupplies/${agentSuppliesId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        toast.success(
          <span>
            <strong>Deleted</strong> successfully.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        setOpenDelete(false);
        showAgentSupplies();
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  };

  const [searchInput, setSearchInput] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = agentSuppliesData.filter((item) => {
      const id = String(item.Id).toLowerCase();
      const name = String(item.FullName).toLowerCase();
      const address = String(item.Address).toLowerCase();
      const email = String(item.Email).toLowerCase();
      const notes = String(item.Notes).toLowerCase();
      const phone = String(item.Phone).toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        id.includes(searchValue.toLowerCase()) ||
        address.includes(searchValue.toLowerCase()) ||
        email.includes(searchValue.toLowerCase()) ||
        notes.includes(searchValue.toLowerCase()) ||
        phone.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
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
            <thead>
              <tr>
                <th style={{width:'10%'}}>Id</th>
                <th style={{width:'15%'}}>Full Name</th>
                <th style={{width:'15%'}}>Address</th>
                <th style={{width:'15%'}}>Phone</th>
                <th style={{width:'15%'}}>Email</th>
                <th style={{width:'15%'}}>Notes</th>
                <th style={{width:'10%'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchInput.length > 0
                ? filteredResults.map((item, index) => (
                    <tr>
                      <td>{item.Id}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.FullName}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].FullName = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.FullName}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Address}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].Address = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Address}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Phone}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].Phone = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Phone}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Email}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].Email = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Email}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Notes}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].Notes = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Notes}</div>
                        )}
                      </td>
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
                              onClick={() => handleClickdeletepopup(item.Id)}
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
                                      handleDeleteAgentSupplies(e)
                                    }
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
                : agentSuppliesData.map((item, index) => (
                    <tr>
                      <td>{item.Id}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.FullName}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].FullName = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.FullName}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Address}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].Address = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Address}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Phone}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].Phone = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Phone}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Email}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].Email = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Email}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Notes}
                            onChange={(e) => {
                              const newData = [...agentSuppliesData];
                              newData[index].Notes = e.target.value;
                              setAgentSuppliesData(newData);
                            }}
                            style={{
                              border: "none",
                              //       width: "100px",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Notes}</div>
                        )}
                      </td>
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
                              onClick={() => handleClickdeletepopup(item.Id)}
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
                                      handleDeleteAgentSupplies(e)
                                    }
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
              {isNewRowActive && (
                <tr>
                  <td></td>
                  <td>
                    <input
                      style={{
                        border: "none",
                        //   width: "200px",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                      placeholder="fullName"
                      value={fullName}
                      id="fullName"
                      onChange={HandleFullName}
                    />
                  </td>
                  <td>
                    <input
                      style={{
                        border: "none",
                        //   width: "200px",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                      id="Address"
                      placeholder="Address"
                      value={Address}
                      onChange={HandleAddress}
                    />
                  </td>
                  <td>
                    <input
                      style={{
                        border: "none",
                        //   width: "200px",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                      type="tel"
                      placeholder="phone"
                      id="phone"
                      value={Phone}
                      onChange={HandlePhone}
                      maxLength={10}
                      pattern="0-9"
                    />
                  </td>
                  <td>
                    <input
                      style={{
                        border: "none",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                      placeholder="Email"
                      value={Email}
                      onChange={HandleEmail}
                    />
                  </td>
                  <td>
                    <input
                      style={{
                        border: "none",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                      placeholder="Notes"
                      value={Notes}
                      onChange={HandleNotes}
                    />
                  </td>
                  <td>
                    <button
                      style={{ border: "none", background: "transparent" }}
                      onClick={handleNewRowSubmit}
                    >
                      <FaCheck style={{ color: "green" }} />
                    </button>{" "}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AgentSupplies;
