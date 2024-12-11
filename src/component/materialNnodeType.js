import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaPlus, FaMinus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";

// Material UI for dialog box

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { MdDelete } from "react-icons/md";

import AuthContext from "../context/AuthProvider";

function MaterialNodeType({tableHeight}) {
  const  {auth} = useContext(AuthContext)
  const [data, setData] = useState([]);
  const [MaterialCateData, setMaterialCateData] = useState([]);
  const [MaterialName, setMaterialName] = useState();
  const [MaterialCateID, setMaterialCateID] = useState();

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/materialnodetype`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data, "materialnodetype");
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/materialCategory`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data, "materialnodetype");
        setMaterialCateData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function getMaterialTypedata() {
    const apiUrl = `${BASE_URL}/api/materialnodetype`;
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const handleMaterialName = (event) => {
    setMaterialName(event.target.value);
  };

  const handleMaterialCateID = (event) => {
    setMaterialCateID(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      branchId: auth.branchId.toString(),
      materialName: MaterialName,
      materialCategoryId: MaterialCateID,
      userId: auth.empId.toString(),
    };
    axios
      .post(`${BASE_URL}/api/materialnodetype`, formData)
      .then((response) => {
        console.log(response.data);
        getMaterialTypedata();
        Emptyfields();
        toast.success(
          <span>
            <strong>Successfully</strong> {MaterialName} Added.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  function Emptyfields() {
    setMaterialName("");
    setMaterialCateID("");
    setAddRow(false);
  }

  const [opendeletepopup, setOpenDelete] = React.useState(false);
  const [materialTypeId, setmaterialTypeId] = useState();
  const [searchInput, setSearchInput] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const name = item.materialName.toLowerCase();
      const materialCategoryId = String(item.materialCategoryId).toLowerCase();
      const materialId = String(item.materialId).toLowerCase();
      return name.includes(searchValue.toLowerCase()) ||
      materialCategoryId.includes(searchValue.toLowerCase()) ||
      materialId.includes(searchValue.toLowerCase()) 
    });
    setFilteredResults(filteredData);
  };

  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setmaterialTypeId(Id)
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  function handledelete(event) {
    event.preventDefault();
    axios
      .delete(`${BASE_URL}/api/materialnodetype/${materialTypeId}`)
      .then((response) => {
        console.log("Shift deleted successfully", response.data);
        getMaterialTypedata();
        handleDeleteClose()
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
            position: toast.POSITION.TOP_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      });
  }


  function UpdateMaterailCategory(event,materialTypeId) {
    event.preventDefault();
    const editedItem = data[editedIndex];
    console.log(editedItem)
    console.log(data)
    const payload = {
      materialName: editedItem.materialName.toString(),
      materialCategoryId : editedItem.materialCategoryId.toString(),
      branchId: auth.branchId.toString(),
      userId: auth.empId.toString(),
    };

    axios
      .put(`${BASE_URL}/api/materialnodetype/${materialTypeId}`, payload)
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
        getMaterialTypedata();
        setEditedIndex(null)
      })
      .catch((error) => {
        console.error("Error saving data:", error);
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
    <div>
      <div className="container-fluid p-2">
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
          style={{
            // height: tableHeight ? tableHeight : '200px',
            height:  height,
            overflowY: "scroll",
            overflowX :"hidden"
          }}
        >
          <div className="row">
            <div className="col-6">
              <table className="table table-bordered table-striped">
                <thead className="sticky-top">
                  <tr>
                    <th>Id</th>
                    <th>Material Name</th>
                    <th>Material Category Id</th>
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
                          id="MaterialName"
                          name="MaterialName"
                          placeholder="Enter MaterialName"
                          value={MaterialName}
                          onChange={handleMaterialName}
                          required
                          style={{height:'22px'}}
                        />
                      </td>
                      <td>
                        <select
                          onChange={handleMaterialCateID}
                          value={MaterialCateID}
                          style={{height:'22px'}}
                        >
                          <option hidden>Material Category ID</option>
                          {MaterialCateData?.map((item) => (
                            <option value={item?.id}>
                              {item?.id} - {item?.productTypeDescription}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{textAlign:'center'}}>
                        <button className="btn text-success btn-sm" onClick={handleSubmit}>
                        <FaCheck id="FaCheck"/>
                        </button>
                        &nbsp;
                        <button className="btn text-danger btn-sm"  onClick={Emptyfields}>
                        <FaXmark id="FaMinus"/>
                        </button>
                      </td>
                    </tr>
                  )}
                  {searchInput.length > 0
                  ? filteredResults.map((item, index) => (
                    <tr>
                    <td>{item.materialId}</td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={item.materialName}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].materialName = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "30px",
                          }}
                        />
                      ) : (
                        <div>{item.materialName}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <select
                          value={item.materialCategoryId}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].materialCategoryId = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "30px",
                          }}
                        >
                          <option hidden>Machine Category ID</option>
                          {MaterialCateData.map((item) => (
                            <option value={item.id}>
                              {item.id} - {item.productTypeDescription}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div>{item.materialCategoryId}</div>
                      )}
                    </td>
                    <td style={{textAlign:'center'}}>
                      {editedIndex === index ? (
                        <div>
                          <FaCheck
                            onClick={(event) =>
                              UpdateMaterailCategory(event, item.materialId)
                            }
                            className="text-success"
                            id="FaCheck"
                          />
                          &nbsp;&nbsp;&nbsp;
                          <FaXmark
                            className="text-danger"
                            onClick={HandleClose}
                            id="FaMinus"
                          />
                        </div>
                      ) : (
                        <div>
                          <MdDelete
                            className="text-danger"
                            onClick={() =>
                              handleClickdeletepopup(item.materialId)
                            }
                            id="FaMinus"
                          /> &nbsp;&nbsp;&nbsp;
                          <FaEdit
                            className="text-primary"
                            onClick={() => handleEdit(index)}
                            id="FaEdit"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                    ))
                  :data.map((item, index) => (
                    <tr>
                      <td>{item.materialId}</td>
                      <td>
                        {editedIndex === index ? (
                          <input
                            value={item.materialName}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].materialName = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "22px",
                            }}
                          />
                        ) : (
                          <div>{item.materialName}</div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.materialCategoryId}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].materialCategoryId = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "22px",
                            }}
                          >
                            <option hidden>Machine Category ID</option>
                            {MaterialCateData.map((item) => (
                              <option value={item.id}>
                                {item.id} - {item.productTypeDescription}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>{item.materialCategoryId}</div>
                        )}
                      </td>
                      <td style={{textAlign:'center'}}>
                        {editedIndex === index ? (
                          <div>
                            <FaCheck
                              onClick={(event) =>
                                UpdateMaterailCategory(event, item.materialId)
                              }
                              id="FaCheck"
                              className="text-success"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <FaXmark
                              className="text-danger"
                              onClick={HandleClose}
                              id="FaMinus"
                            />
                          </div>
                        ) : (
                          <div>
                            <FaMinus
                              onClick={() =>
                                handleClickdeletepopup(item.materialId)
                              }
                              id="FaMinus"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <FaEdit
                              onClick={() => handleEdit(index)}
                              id="FaEdit"
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

export default MaterialNodeType;
