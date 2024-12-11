import React, { useContext, useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import { FaCheck, FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import AuthContext from "../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import { getNodeVariable } from "../api/shovelDetails";
import { FaEdit } from "react-icons/fa";

function Variable({ selectnode }) {
  const { auth } = useContext(AuthContext);
  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(true);
  };
  const [variableDescription, setVariableDescription] = useState();
  const [variableValue, setVariableValue] = useState();
  const [variableMinValue, setVariableMinValue] = useState();
  const [variableMaxValue, setVariableMaxValue] = useState();
  const [variableUnits, setVariableUnits] = useState();

  const HandleDescription = (e) => {
    setVariableDescription(e.target.value);
  };
  const HandleVariableValue = (e) => {
    setVariableValue(e.target.value);
  };
  const HandleVariableMinValue = (e) => {
    setVariableMinValue(e.target.value);
  };
  const HandleVariableMaxValue = (e) => {
    setVariableMaxValue(e.target.value);
  };
  const HandleVariableUnits = (e) => {
    setVariableUnits(e.target.value);
  };


  const [NodeVariables, setNodeVariables] = useState([]);

  const showNodeVariable = async (key) => {
    const responsedata = await getNodeVariable();
    setNodeVariables(responsedata, key);
  };

  useEffect(() => {
    showNodeVariable();
  }, []);

  const handlegetNodeVariables = () => {
    axios
      .get(`${BASE_URL}/api/NodeVariable`)
      .then((response) => {
        console.log("New row added successfully", response.data);
        setNodeVariables(response.data);
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const EmptyFields = () =>{
    setVariableDescription()
    setVariableValue()
    setVariableMinValue()
    setVariableMaxValue()
    setVariableUnits()
    setNewRowActive(false)
  }
  const handleNewRowSubmit = () => {
    if (!variableDescription) {
      document.getElementById("variableDescription").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the Description</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    if (!variableValue) {
      document.getElementById("variableValue").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the variableValue</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    if (!variableMinValue) {
      document.getElementById("variableMinValue").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the variableMinValue</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    if (!variableMaxValue) {
      document.getElementById("variableMaxValue").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the variableMaxValue</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    if (!variableUnits) {
      document.getElementById("variableUnits").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the variableUnits</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    const payload = {
      branchId: selectnode.branchId,
      nodeId: selectnode.nodeId,
      description: variableDescription,
      variableValue: variableValue,
      variableMinValue: variableMinValue,
      variableMaxValue: variableMaxValue,
      variableUnits: variableUnits,
      userId: auth.empId,
    };
    axios
      .post(`${BASE_URL}/api/NodeVariable`, payload)
      .then((response) => {
        console.log("New row added successfully", response.data);
        toast.success(
          <span>
            <strong>Successfully! </strong> Added.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "custom-toast",
          }
        );
        EmptyFields();
        handlegetNodeVariables();
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

  const [opendeletepopup, setOpenDelete] = useState(false);
  const handleClickdeletepopup = () => {
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleSave = () => {
    const editedItem = NodeVariables[editedIndex];
    const edite = {
      branchId: editedItem.branchId,
      nodeId: editedItem.nodeId,
      description: editedItem.description,
      variableValue: editedItem.variableValue,
      variableMinValue: editedItem.variableMinValue,
      variableMaxValue: editedItem.variableMaxValue,
      variableUnits: editedItem.variableUnits,
      userId: editedItem.userId,
    };
    axios
      .put(`${BASE_URL}/api/NodeVariable/${editedItem.variableId}`, edite)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(null);
        handlegetNodeVariables()
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "custom-toast",
          }
        );
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setEditedIndex(null);
      });
  };


  const handleDeleteNodeVariable = (variableId) => {
    axios
      .delete(`${BASE_URL}/api/NodeVariable/${variableId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        toast.error(
          <span>
            <strong>Deleted</strong> successfully.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "custom-toast",
          }
        );
        handlegetNodeVariables()
        setOpenDelete(false);
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="d-flex flex-row justify-content-end">
          <Tooltip title="Add Variables">
            <Button
              id="addbutton"
              onClick={handleAddNewRow}
              style={{ marginLeft: "5px" }}
            >
              <FaPlus />
            </Button>
          </Tooltip>
        </div>
        <div className="col-12">
          <table className="table table-bordered table-striped">
            <thead className="sticky-top">
              <tr>
                <th>Variable Id</th>
                <th>Branch Id</th>
                <th>Node Id</th>
                <th>Variable Description</th>
                <th>Variable Value</th>
                <th>Variable Min Value</th>
                <th>Variable Max Value</th>
                <th>Variable Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {NodeVariables.filter((item1) => item1.nodeId === selectnode.nodeId).map((item, index) => (
                <tr>
                  <td>{item.variableId}</td>
                  <td>{item.branchId}</td>
                  <td>{item.nodeId}</td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.description}
                        onChange={(e) => {
                          const newData = [...NodeVariables];
                          newData[index].description = e.target.value;
                          setNodeVariables(newData);
                        }}
                        className="Addborder"
                        style={{
                          height: "20px",
                        }}
                      />
                    ) : (
                      <div>{item.description}</div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.variableValue}
                        onChange={(e) => {
                          const newData = [...NodeVariables];
                          newData[index].variableValue = e.target.value;
                          setNodeVariables(newData);
                        }}
                        type="number"
                        className="Addborder"
                        style={{
                          height: "20px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <div>{item.variableValue}</div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.variableMinValue}
                        onChange={(e) => {
                          const newData = [...NodeVariables];
                          newData[index].variableMinValue = e.target.value;
                          setNodeVariables(newData);
                        }}
                        type="number"
                        className="Addborder"
                        style={{
                          height: "20px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <div>{item.variableMinValue}</div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.variableMaxValue}
                        onChange={(e) => {
                          const newData = [...NodeVariables];
                          newData[index].variableMaxValue = e.target.value;
                          setNodeVariables(newData);
                        }}
                        type="number"
                        className="Addborder"
                        style={{
                          height: "20px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <div>{item.variableMaxValue}</div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.variableUnits}
                        onChange={(e) => {
                          const newData = [...NodeVariables];
                          newData[index].variableUnits = e.target.value;
                          setNodeVariables(newData);
                        }}
                        type="text"
                        className="Addborder"
                        style={{
                          height: "20px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <div>{item.variableUnits}</div>
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
                          <FaXmark id="FaMinus"/>
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
                          <FaMinus id="FaMinus"/>
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
                                onClick={() =>
                                        handleDeleteNodeVariable(item.variableId)
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
                          onClick={(event) => handleSave()}
                        >
                          <FaCheck id="FaCheck"/>
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
                        <FaEdit id="FaEdit"/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {isNewRowActive && (
                <tr>
                  <td></td>
                  <td>{selectnode.branchId}</td>
                  <td>{selectnode.nodeId}</td>
                  <td>
                    <input
                      type="text"
                      onChange={HandleDescription}
                      value={variableDescription}
                      className="Addborder"
                      id="variableDescription"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      onChange={HandleVariableValue}
                      value={variableValue}
                      className="Addborder"
                      id="variableValue"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      onChange={HandleVariableMinValue}
                      value={variableMinValue}
                      className="Addborder"
                      id="variableMinValue"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      onChange={HandleVariableMaxValue}
                      value={variableMaxValue}
                      className="Addborder"
                      id="variableMaxValue"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      onChange={HandleVariableUnits}
                      value={variableUnits}
                      className="Addborder"
                      id="variableUnits"
                    />
                  </td>
                  <td style={{textAlign:'center'}}>
                    <button
                      style={{ border: "none", background: "transparent" }}
                      onClick={handleNewRowSubmit}
                    >
                      <FaCheck style={{ color: "green" }} />
                    </button>
                    &nbsp;
                    <button
                      style={{ border: "none", background: "transparent" }}
                      onClick={() => EmptyFields()}
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
      <ToastContainer />
    </div>
  );
}

export default Variable;
