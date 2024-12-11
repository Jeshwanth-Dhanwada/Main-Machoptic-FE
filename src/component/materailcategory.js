import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaPlus, FaMinus } from "react-icons/fa6";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BASE_URL } from "../constants/apiConstants";


import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import AuthContext from "../context/AuthProvider";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function MaterialCategory({tableHeight}) {

  const [data, setData] = useState([]);
  const {auth} = useContext(AuthContext)
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl =
      `${BASE_URL}/api/materialCategory`;
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

  function getMaterialCategory(){
    const apiUrl =
      `${BASE_URL}/api/materialCategory`;
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
  const [searchInput, setSearchInput] = useState([])
  const [MaterailCatId, setMaterailCatId] = useState()
  const [filteredResults, setFilteredResults] = useState([]);
  
  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    const filteredData = data.filter((item) => {
      const Id = String(item.id).toLowerCase()
      const productTypeDescription = item.productTypeDescription.toLowerCase()
      return Id.includes(searchValue.toLowerCase())
            || productTypeDescription.includes(searchValue.toLowerCase())
            
    });
    setFilteredResults(filteredData);
  }

  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setMaterailCatId(Id)
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const [productDesc, setproductDesc] = useState("")
  
  const handleproductDesc = (event) => {
    setproductDesc(event.target.value)
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      branchId : auth.branchId,
      userId: auth.empId.toString(),
      productTypeDescription:productDesc
    }
      
      axios
      .post(`${BASE_URL}/api/materialCategory`, payload)
      .then((response) => {
        console.log(response.data)
        console.log('New row added successfully');
        toast.success(
        <p><strong>Successfully</strong> Updated</p>,
        {
          position: toast.POSITION.TOP_RIGHT, // Set position to top center
          // autoClose: 3000, // Optional: Set auto close time in milliseconds
          // closeButton: false, // Optional: Hide close button
          className: 'custom-toast' // Optional: Add custom CSS class
        }
      );
        getMaterialCategory()
        Emptyfields()
      })
      .catch((error) => {
        console.error('Error adding new row:', error);
      });
  };

  function Emptyfields(){
    setproductDesc("")
    setAddRow(false)
    setEditedIndex(null)
  }


  function updateFields(event,MaterailCatId){
    event.preventDefault();  
    const editedItem = data[editedIndex];
    const payload = {
      branchId : auth.branchId,
      userId: auth.empId.toString(),
      productTypeDescription:editedItem.productTypeDescription.toString()
    }
      
      axios
      .put(`${BASE_URL}/api/materialCategory/${MaterailCatId}`, payload)
      .then((response) => {
        console.log(response.data)
        console.log('New row added successfully');
        toast.success(
        <p><strong>Successfully</strong> Updated</p>,
        {
          position: toast.POSITION.TOP_RIGHT, // Set position to top center
          className: 'custom-toast' // Optional: Add custom CSS class
        }
      );
        getMaterialCategory()
        Emptyfields()
      })
      .catch((error) => {
        console.error('Error adding new row:', error);
      });
  }

  function handledelete(){
    axios
          .delete(`${BASE_URL}/api/materialCategory/${MaterailCatId}`)
          .then((response) => {
            console.log("Shift deleted successfully", response.data);
            getMaterialCategory()
            handleDeleteClose()
            toast.error(
            <span><strong>Deleted</strong> successfully.</span>,
            {
              position: toast.POSITION.TOP_RIGHT, // Set position to top center
              // autoClose: 3000, // Optional: Set auto close time in milliseconds
              // closeButton: false, // Optional: Hide close button
              className: 'custom-toast' // Optional: Add custom CSS class
            }
          );
          })
          .catch((error) => {
            console.error("Error deleting node:", error);
            toast.error(
            <span><strong>Cannot be</strong> deleted.</span>,
            {
              position: toast.POSITION.TOP_RIGHT, // Set position to top center
              // autoClose: 3000, // Optional: Set auto close time in milliseconds
              // closeButton: false, // Optional: Hide close button
              className: 'custom-toast' // Optional: Add custom CSS class
            }
          );
          });
  }

  const [editedIndex, setEditedIndex] = useState(null);
  function handleEdit(index) {
    setEditedIndex(index);
  }

  const HandleClose = () => {
    setEditedIndex(null);
  };

  const [AddRow, setAddRow] = useState(false);
  const handleAddNewRow = () => {
    setAddRow(!AddRow);
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
      <div className="container-fluid"
         style={{
          // height: tableHeight ? tableHeight : '200px',
          height:  height,
          overflowY: "scroll",
          overflowX :"hidden"
        }}
      >
        <div className="row">
          <div className="col-4">
            <table className="table table-bordered table-striped">
              <thead className="sticky-top">
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
                      id="MaterialCategory"
                      name="MaterialCategory"
                      value={productDesc}
                      placeholder="Enter MaterialCategory"
                      onChange={handleproductDesc}
                      required
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button className="btn text-success btn-sm" onClick={handleSubmit}>
                        <FaCheck id="FaCheck"/>
                      </button>
                        {/* &nbsp; */}
                        <button className="btn text-danger btn-sm" onClick={Emptyfields}>
                        <FaXmark id="FaMinus"/>
                        </button>
                      </td>
                  </tr>
                )}
                {searchInput.length > 0
                  ? filteredResults.map((item, index) => (
                      <tr>
                    <td>{item.id}</td>
                    <td>
                    {editedIndex === index ? (
                            <input
                              value={item.productTypeDescription}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].productTypeDescription = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                              }}
                            />
                          ) : (
                            <div>{item.productTypeDescription}</div>
                          )}
                      </td>
                    <td style={{ textAlign: "center" }}>
                    {editedIndex === index ? (
                            <div>
                              <FaCheck
                                onClick={(event) =>
                                  updateFields(event, item.id)
                                }
                                id="FaCheck"
                              />
                              &nbsp;&nbsp;&nbsp;
                              <FaXmark
                                onClick={HandleClose}
                                 id="FaMinus"
                              />
                            </div>
                          ) : (
                            <div>
                              <FaEdit
                                onClick={() => handleEdit(index)}
                                 id="FaEdit"
                              />
                              &nbsp;&nbsp;&nbsp;
                              <FaMinus
                                onClick={() =>
                                  handleClickdeletepopup(item.id)
                                }
                                id="FaMinus"
                              />
                            </div>
                          )}
                    </td>
                      </tr>
                    ))
                :data.map((item,index)=>(
                <tr>
                  <td>{item.id}</td>
                  <td>
                  {editedIndex === index ? (
                          <input
                            value={item.productTypeDescription}
                            onChange={(e) => {
                              const newData = [...data];
                              newData[index].productTypeDescription = e.target.value;
                              setData(newData);
                            }}
                            style={{
                              border: "none",
                              height: "22px",
                            }}
                          />
                        ) : (
                          <div>{item.productTypeDescription}</div>
                        )}
                    </td>
                  <td style={{ textAlign: "center" }}>
                  {editedIndex === index ? (
                          <div>
                            <FaCheck
                              onClick={(event) =>
                                updateFields(event, item.id)
                              }
                              id="FaCheck"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <FaXmark
                              onClick={HandleClose}
                              id="FaMinus"
                            />
                          </div>
                        ) : (
                          <div>
                            
                            <FaMinus
                              onClick={() =>
                                handleClickdeletepopup(item.id)
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
      <ToastContainer/>
    </div>
  );
}

export default MaterialCategory;
