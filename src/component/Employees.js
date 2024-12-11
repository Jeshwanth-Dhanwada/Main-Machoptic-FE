// AnotherComponent.js
import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaPlus, FaMinus } from "react-icons/fa6";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { BASE_URL } from "../constants/apiConstants";

// Material UI for dialog box

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import AuthContext from "../context/AuthProvider";
import { getEmployees } from "../api/shovelDetails";

function Employee({tableHeight}) {
  const { auth } = useContext(AuthContext);

  const [empTypeId, setempTypeId] = useState();
  const [branchId, setbranchId] = useState();
  const [employeeName, setemployeeName] = useState();
  const [designation, setdesignation] = useState();
  const [grade, setgrade] = useState();
  const [dateOfJoining, setdateOfJoining] = useState();
  const [lastDate, setlastDate] = useState();
  const [user, setuser] = useState();
  const [userName, setuserName] = useState();
  const [password, setpassword] = useState();
  const [empId, setempId] = useState([]);

  const [data, setData] = useState([]);
  // Employee data ------------

  const showEmployeeData = async(key) =>{
    const responsedata = await getEmployees()
    setData(responsedata,key)
  }
  useEffect(() => {
    showEmployeeData()
  }, [])


  const handleempType = (event) => {
    setempTypeId(event.target.value);
    console.log("branch", empTypeId);
  };
  const handlbranchId = (event) => {
    setbranchId(event.target.value);
    console.log("branch", branchId);
  };
  const handleempName = (event) => {
    setemployeeName(event.target.value);
    console.log("branch", employeeName);
  };
  const handlDesignation = (event) => {
    setdesignation(event.target.value);
    console.log("branch", designation);
  };
  const handlgrade = (event) => {
    setgrade(event.target.value);
    console.log("branch", grade);
  };
  const handldateOfJoining = (event) => {
    setdateOfJoining(event.target.value);
    console.log("branch", dateOfJoining);
  };
  const handlelastDate = (event) => {
    setlastDate(event.target.value);
    console.log("branch", lastDate);
  };
  const handleuser = (event) => {
    setuser(event.target.value);
    console.log("branch", user);
  };
  const handleuserName = (event) => {
    setuserName(event.target.value);
    console.log("branch", userName);
  };
  const handlepassword = (event) => {
    setpassword(event.target.value);
    console.log("branch", password);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // You can perform actions like API calls or local storage here
    // Reset the form after submission
    const formData = {
      empTypeId: empTypeId,
      branchId: auth.branchId,
      employeeName: employeeName,
      designation: designation,
      grade: grade,
      dateOfJoining: dateOfJoining.split("T")[0],
      lastDate: lastDate,
      isActive: true,
      // user:user,
      userName: userName,
      password: password,
      userId: auth.empId.toString(),
    };
    axios
      .post(`${BASE_URL}/api/employee`, formData)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        showEmployeeData();
        toast.success(
          <span>
            <strong>Successfully</strong> Employee Added.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        setempTypeId("");
        setbranchId("");
        setemployeeName("");
        setdesignation("");
        setgrade("");
        setdateOfJoining("");
        setlastDate("");
        setuser("");
        setuserName("");
        setpassword("");
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  function emptyfields() {
    setempTypeId("");
    setbranchId("");
    setemployeeName("");
    setdesignation("");
    setgrade("");
    setdateOfJoining("");
    setlastDate("");
    setuser("");
    setuserName("");
    setpassword("");
    setAddRow(false);
  }

  // Function to get today's date in the format 'YYYY-MM-DD'
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const [open, setOpen] = React.useState(false);
  const [opendeletepopup, setOpenDelete] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setSearchInput("");
  };

  const handleClickdeletepopup = (id) => {
    setOpenDelete(true);
    console.log(id);
    setempId(id);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const [editedIndex, setEditedIndex] = useState(null);

  function handleEdit(index) {
    setEditedIndex(index);
    console.log(index);
    setOpen(false);
  }
  function UpdateEmployee(event, empId) {
    event.preventDefault();
    const editedItem = data[editedIndex];
    const payload = {
      empTypeId: editedItem.empTypeId.toString(),
      branchId: auth.branchId,
      employeeName: editedItem.employeeName.toString(),
      designation: editedItem.designation.toString(),
      grade: editedItem.grade.toString(),
      dateOfJoining: editedItem.dateOfJoining,
      lastDate: new Date(editedItem.lastDate),
      isActive: true,
      userName: editedItem.userName.toString(),
      password: editedItem.password.toString(),
      userId: auth.empId.toString(),
    };
    console.log(payload, "payload");

    axios
      .put(`${BASE_URL}/api/employee/${empId}`, payload)
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
        showEmployeeData();
        setEditedIndex(null);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }

  function handledelete(event) {
    event.preventDefault();
    axios
      .delete(`${BASE_URL}/api/employee/${empId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        showEmployeeData();
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

  // search facility -------
  // Ramesh changes for filter & search

  const [searchInput, setSearchInput] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const name = item.employeeName.toLowerCase();
      const Id = String(item.empId).toLowerCase();
      const designation = item.designation.toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        Id.includes(searchValue.toLowerCase()) ||
        designation.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };
  // const useStyles = makeStyles(() => ({
  //   paper: { minWidth: "500px" },
  // }));

  const [AddRow, setAddRow] = useState(false);
  const handleAddNewRow = () => {
    setAddRow(!AddRow);
  };
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
          <div className="col-12">
            <table className="table table-bordered table-striped">
              <thead className="sticky-top">
                <tr>
                  <th style={{ width: "5%" }}>Id</th>
                  <th style={{ width: "10%" }}>Employee Type Id</th>
                  <th style={{ width: "10%" }}>Employee Name</th>
                  <th style={{ width: "10%" }}>Designation</th>
                  <th style={{ width: "10%" }}>Grade</th>
                  <th style={{ width: "10%" }}>DOJ</th>
                  <th style={{ width: "10%" }}>Last Date</th>
                  <th style={{ width: "10%" }}>User Name</th>
                  <th style={{ width: "10%" }}>Password</th>
                  <th style={{ width: "5%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {AddRow === true && (
                  <tr>
                    <td></td>
                    <td>
                      <input
                        type="number"
                        id="EmployeeID"
                        name="EmployeeID"
                        value={empTypeId}
                        onChange={handleempType}
                        required
                        style={{ width: "100px", height: "22px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id="EmpName"
                        name="EmpName"
                        style={{ height: "22px" }}
                        value={employeeName}
                        onChange={handleempName}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id="Designation"
                        name="Designation"
                        style={{ width: "100px", height: "22px" }}
                        value={designation}
                        onChange={handlDesignation}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id="Grade"
                        name="Grade"
                        style={{ width: "100px", height: "22px" }}
                        value={grade}
                        onChange={handlgrade}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        id="DOJ"
                        name="DOJ"
                        value={dateOfJoining}
                        style={{ fontSize: "11px" }}
                        onChange={handldateOfJoining}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        id="LastDate"
                        name="LastDate"
                        value={lastDate ? lastDate : ""}
                        onChange={handlelastDate}
                        style={{ fontSize: "11px" }}
                        min={getFormattedToday()}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={userName}
                        onChange={handleuserName}
                        style={{ width: "100px", height: "22px" }}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        style={{ width: "100px", height: "22px" }}
                        onChange={handlepassword}
                        required
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <FaCheck id="FaCheck" onClick={handleSubmit} />
                      &nbsp;&nbsp;&nbsp;
                      <FaXmark id="FaMinus" onClick={emptyfields} />
                    </td>
                  </tr>
                )}
                {searchInput.length > 0
                  ? filteredResults.map((item, index) => (
                      <tr>
                        <td>{item.empId}</td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.empTypeId}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].empTypeId = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.empTypeId}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.employeeName}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].employeeName = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.employeeName}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.designation}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].designation = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.designation}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.grade}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].grade = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.grade}</div>
                          )}
                        </td>
                        <td>{item.dateOfJoining?.split("T")[0]}</td>
                        <td>{item.lastDate}</td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.employeeName}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].employeeName = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.employeeName}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.password}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].password = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.password}</div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editedIndex === index ? (
                            <div>
                              <FaCheck
                                onClick={(event) =>
                                  UpdateEmployee(event, item.empId)
                                }
                                id="FaCheck"
                              />
                              &nbsp;&nbsp;&nbsp;
                              <FaXmark id="FaMinus" onClick={HandleClose} />
                            </div>
                          ) : (
                            <div>
                              
                              <FaMinus
                                id="FaMinus"
                                onClick={() =>
                                  handleClickdeletepopup(item.empId)
                                }
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
                    ))
                  : data.map((item, index) => (
                      <tr>
                        <td>{item.empId}</td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.empTypeId}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].empTypeId = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.empTypeId}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.employeeName}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].employeeName = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.employeeName}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.designation}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].designation = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.designation}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.grade}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].grade = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.grade}</div>
                          )}
                        </td>
                        <td>{item.dateOfJoining?.split("T")[0]}</td>
                        <td>{item.lastDate}</td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.employeeName}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].employeeName = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.employeeName}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              value={item.password}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[index].password = e.target.value;
                                setData(newData);
                              }}
                              style={{
                                border: "none",
                                height: "22px",
                                backgroundColor: "whitesmoke",
                              }}
                            />
                          ) : (
                            <div>{item.password}</div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editedIndex === index ? (
                            <div>
                              <FaCheck
                                onClick={(event) =>
                                  UpdateEmployee(event, item.empId)
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
                                  handleClickdeletepopup(item.empId)
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
              <Button onClick={handledelete} autoFocus>
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

export default Employee;
