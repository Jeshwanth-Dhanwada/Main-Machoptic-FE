import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import Button from "@mui/material/Button";
import { FaCheck, FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import AuthContext from "../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import { getNodeParameter } from "../api/shovelDetails";
import { FaEdit } from "react-icons/fa";

function Parameters({ selectnode }) {
  const { auth } = useContext(AuthContext);
  const [opendeletepopup, setOpenDelete] = useState(false);
  const handleClickdeletepopup = () => {
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(true);
  };

  const [paraDescription, setParaDescription] = useState();
  const [paraValue, setParaValue] = useState();
  const [paraMinValue, setParaMinValue] = useState();
  const [paraMaxValue, setParaMaxValue] = useState();
  const [paraUnits, setParaUnits] = useState();

  const HandleDescription = (e) => {
    setParaDescription(e.target.value);
  };
  const HandleParaValue = (e) => {
    setParaValue(e.target.value);
  };
  const HandleParaMinValue = (e) => {
    setParaMinValue(e.target.value);
  };
  const HandleParaMaxValue = (e) => {
    setParaMaxValue(e.target.value);
  };
  const HandleParaUnits = (e) => {
    setParaUnits(e.target.value);
  };

  const [NodeParameters, setNodeParameters] = useState([]);

  const showNodeParameter = async (key) => {
    const responsedata = await getNodeParameter();
    setNodeParameters(responsedata, key);
  };

  useEffect(() => {
    showNodeParameter();
  }, []);
  const handlegetNodeParameters = () => {
    axios
      .get(`${BASE_URL}/api/NodeParameter`)
      .then((response) => {
        console.log("New row added successfully", response.data);
        setNodeParameters(response.data);
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const EmptyFields = () =>{
    setParaDescription()
    setParaValue()
    setParaMinValue()
    setParaMaxValue()
    setParaUnits()
    setNewRowActive(false)
  }

  const handleNewRowSubmit = () => {
    if (!paraDescription) {
      document.getElementById("description").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the description</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    if (!paraValue) {
      document.getElementById("paraValue").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the paraValue</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    if (!paraMinValue) {
      document.getElementById("paraMinValue").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the paraMinValue</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    if (!paraMaxValue) {
      document.getElementById("paraMaxValue").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the paraMaxValue</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'custom-toast'
        }
      );
      return; // Stop execution if shiftId is missing
    }
    if (!paraUnits) {
      document.getElementById("paraUnits").focus()
      toast.warning(
        <span><strong>Please</strong>Enter the paraUnits</span>,
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
      description: paraDescription,
      parameterValue: paraValue,
      parameterMinValue: paraMinValue,
      parameterMaxValue: paraMaxValue,
      parameterUnits: paraUnits,
      userId: auth.empId,
    };
    axios
      .post(`${BASE_URL}/api/NodeParameter`, payload)
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
        EmptyFields()
        handlegetNodeParameters();
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
    const editedItem = NodeParameters[editedIndex];
    const edite = {
      branchId: editedItem.branchId,
      nodeId: editedItem.nodeId,
      description: editedItem.description,
      parameterValue: editedItem.parameterValue,
      parameterMinValue: editedItem.parameterMinValue,
      parameterMaxValue: editedItem.parameterMaxValue,
      parameterUnits: editedItem.parameterUnits,
      userId: editedItem.userId,
    };
    axios
      .put(`${BASE_URL}/api/NodeParameter/${editedItem.parameterId}`, edite)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(null);
        handlegetNodeParameters()
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

  const handleDeleteNodeParameter = (paraId) => {
    axios
      .delete(`${BASE_URL}/api/NodeParameter/${paraId}`)
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
        getNodeParameter()
        setOpenDelete(false);
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-row justify-content-end">
            <Tooltip title="Add Parameters">
              <Button
                onClick={handleAddNewRow}
                id="addbutton"
                style={{ marginLeft: "5px" }}
              >
                <FaPlus />
              </Button>
            </Tooltip>
          </div>
          <table className="table table-bordered table-striped">
            <thead className="sticky-top">
              <tr>
                <th>Parameter Id</th>
                <th>Branch Id</th>
                <th>Node Id</th>
                <th>Parameter Description</th>
                <th>Paramerter Value</th>
                <th>Paramerter Min Value</th>
                <th>Paramerter Max Value</th>
                <th>Paramerter Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {NodeParameters.filter((item1) => item1.nodeId === selectnode.nodeId).map((item, index) => (
                <tr>
                  <td>{item.parameterId}</td>
                  <td>{item.branchId}</td>
                  <td>{item.nodeId}</td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.description}
                        onChange={(e) => {
                          const newData = [...NodeParameters];
                          newData[index].description = e.target.value;
                          setNodeParameters(newData);
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
                        value={item.parameterValue}
                        onChange={(e) => {
                          const newData = [...NodeParameters];
                          newData[index].parameterValue = e.target.value;
                          setNodeParameters(newData);
                        }}
                        type="number"
                        className="Addborder"
                        style={{
                          height: "20px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <div>{item.parameterValue}</div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.parameterMinValue}
                        onChange={(e) => {
                          const newData = [...NodeParameters];
                          newData[index].parameterMinValue = e.target.value;
                          setNodeParameters(newData);
                        }}
                        type="number"
                        className="Addborder"
                        style={{
                          height: "20px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <div>{item.parameterMinValue}</div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.parameterMaxValue}
                        onChange={(e) => {
                          const newData = [...NodeParameters];
                          newData[index].parameterMaxValue = e.target.value;
                          setNodeParameters(newData);
                        }}
                        type="number"
                        className="Addborder"
                        style={{
                          height: "20px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <div>{item.parameterMaxValue}</div>
                    )}
                  </td>
                  <td>
                    {editedIndex === index ? (
                      <input
                        value={item.parameterUnits}
                        onChange={(e) => {
                          const newData = [...NodeParameters];
                          newData[index].parameterUnits = e.target.value;
                          setNodeParameters(newData);
                        }}
                        type="text"
                        className="Addborder"
                        style={{
                          height: "20px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <div>{item.parameterUnits}</div>
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
                                        handleDeleteNodeParameter(item.parameterId)
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
                      value={paraDescription}
                      className="Addborder"
                      id="description"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      onChange={HandleParaValue}
                      value={paraValue}
                      className="Addborder"
                      id="paraValue"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      onChange={HandleParaMinValue}
                      value={paraMinValue}
                      className="Addborder"
                      id="paraMinValue"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      onChange={HandleParaMaxValue}
                      value={paraMaxValue}
                      className="Addborder"
                      id="paraMaxValue"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      onChange={HandleParaUnits}
                      value={paraUnits}
                      className="Addborder"
                      id="paraUnits"
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
                      onClick={() => 
                        // setNewRowActive(false)
                        EmptyFields()
                      }
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

export default Parameters;
