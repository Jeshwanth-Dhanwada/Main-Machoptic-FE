import React, { useContext, useEffect, useState } from "react";
import { getAgentSupplies, getSpareparts } from "../api/shovelDetails";
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
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthProvider";
import { FaEdit } from "react-icons/fa";

function SpareParts({tableHeight}) {
  const { auth } = useContext(AuthContext);
  const [sparePartsData, setSparePartsData] = useState([]);
  const [agentSuppliesData, setAgentSuppliesData] = useState([]);
  const showAgentSupplies = async (key) => {
    const responsedata = await getAgentSupplies();
    setAgentSuppliesData(responsedata, key);
  };
  const showSpareParts = async (key) => {
    const responsedata = await getSpareparts();
    setSparePartsData(responsedata, key);
  };
  useEffect(() => {
    showSpareParts();
    showAgentSupplies();
  }, []);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState("");
  const [amount, setAmount] = useState("");
  const [agentId, setAgentId] = useState("");

  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(true);
  };

  const EmptyFields = () => {
    setCode("");
    setName("");
    setEquipment("");
    setAmount("");
    setAgentId("");
  };
  const handleNewRowSubmit = () => {
    const payload = {
      Code: code,
      Name: name,
      EquipmentCode: equipment,
      Amount: amount,
      AgentId: agentId,
      photo: "",
      userId: auth.empId.toString(),
    };
    console.log(payload);
    axios
      .post(`${BASE_URL}/api/spareparts`, payload)
      .then((response) => {
        console.log("New row added successfully", response.data);
        showSpareParts();
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
    const editedItem = sparePartsData[editedIndex];
    const edite = {
      Code: editedItem.Code,
      Name: editedItem.Name,
      EquipmentCode: editedItem.EquipmentCode,
      Amount: editedItem.Amount,
      AgentId: editedItem.AgentId,
      photo: editedItem.photo,
      userId: auth.empId.toString(),
    };
    axios
      .put(`${BASE_URL}/api/spareparts/${editedItem.Id}`, edite)
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
  const [sparepartsId, setSparePartsId] = useState();
  const handleClickdeletepopup = (Id) => {
    setSparePartsId(Id)
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDeleteSpareparts = (e, ) => {
    e.preventDefault();
    axios
      .delete(`${BASE_URL}/api/spareparts/${sparepartsId}`)
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
        showSpareParts();
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  };

  const [searchInput, setSearchInput] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = sparePartsData.filter((item) => {
      const id = String(item.Id).toLowerCase();
      const name = String(item.Name).toLowerCase();
      const code = String(item.Code).toLowerCase();
      const equipmentCode = String(item.EquipmentCode).toLowerCase();
      const amount = String(item.Amount).toLowerCase();
      const agentId = String(item.AgentId).toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        id.includes(searchValue.toLowerCase()) ||
        code.includes(searchValue.toLowerCase()) ||
        equipmentCode.includes(searchValue.toLowerCase()) ||
        amount.includes(searchValue.toLowerCase()) ||
        agentId.includes(searchValue.toLowerCase())
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
        <div className=" col-3 d-flex flex-row justify-content-end m-1">
          <input
            type="text"
            className="form-control"
            onChange={(e) => searchItems(e.target.value)}
            value={searchInput}
            style={{ flex: 1, height: "30px" }}
            placeholder="Search"
          />
          <Tooltip title="Add Spare Parts">
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
                <th style={{width:'13%'}}>Code</th>
                <th style={{width:'13%'}}>Name</th>
                <th style={{width:'13%'}}>Equipment</th>
                <th style={{width:'13%'}}>Amount</th>
                <th style={{width:'13%'}}>Agent Id</th>
                <th style={{width:'13%'}}>Photo</th>
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
                            value={item.Code}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].Code = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Code}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Name}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].Name = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Name}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.EquipmentCode}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].EquipmentCode = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.EquipmentCode}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Amount}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].Amount = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Amount}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.AgentId}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].AgentId = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              width: "150px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Please select</option>
                            {agentSuppliesData.map((item) => (
                              <option value={item.Id}>
                                {item.Id} - {item.FullName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>{item.AgentId}</div>
                        )}
                      </td>
                      <td>{item.photo}</td>
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
                                      handleDeleteSpareparts(e)
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
                : sparePartsData.map((item, index) => (
                    <tr>
                      <td>{item.Id}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Code}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].Code = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Code}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Name}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].Name = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Name}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.EquipmentCode}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].EquipmentCode = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.EquipmentCode}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.Amount}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].Amount = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              backgroundColor: "whitesmoke",
                            }}
                          />
                        ) : (
                          <div>{item.Amount}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.AgentId}
                            onChange={(e) => {
                              const newData = [...sparePartsData];
                              newData[index].AgentId = e.target.value;
                              setSparePartsData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "20px",
                              width: "150px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>Please select</option>
                            {agentSuppliesData.map((item) => (
                              <option value={item.Id}>
                                {item.Id} - {item.FullName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>{item.AgentId}</div>
                        )}
                      </td>
                      <td>{item.photo}</td>
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
                                      handleDeleteSpareparts(e)
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
                      type="text"
                      placeholder="code"
                      value={code}
                      id="code"
                      onChange={(e) => setCode(e.target.value)}
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
                      type="text"
                      id="name"
                      placeholder="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      type="text"
                      placeholder="equipment"
                      id="equipment"
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      style={{
                        border: "none",
                        height: "20px",
                        backgroundColor: "whitesmoke",
                      }}
                      type="text"
                      id="amount"
                      placeholder="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      style={{
                        border: "none",
                        height: "20px",
                        width: "150px",
                        backgroundColor: "whitesmoke",
                      }}
                      id="agentId"
                      placeholder="agentId"
                      value={agentId}
                      onChange={(e) => setAgentId(e.target.value)}
                    >
                      <option hidden>Please select</option>
                      {agentSuppliesData.map((item) => (
                        <option value={item.Id}>
                          {item.Id} - {item.FullName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td></td>
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

export default SpareParts;
