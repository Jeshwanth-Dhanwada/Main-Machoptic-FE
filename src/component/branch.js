import React, { useState, useCallback, useEffect, useContext } from "react";
import { FaSistrix, FaMinus, FaXmark, FaCheck, FaPlus } from "react-icons/fa6";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaRegEdit } from "react-icons/fa";
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
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { EditLocation } from "@mui/icons-material";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { MdDelete } from "react-icons/md";

import AuthContext from "../context/AuthProvider";
import { getBranchs } from "../api/shovelDetails";

function Branch({tableHeight}) {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [OrgID, setOrgID] = useState();
  const [BranchName, setBranchName] = useState();
  const [Location, setLocation] = useState();
  const [Address, setAddress] = useState();
  const [ContactPerson, setContactPerson] = useState();
  const [ContactEmailID, setContactEmailID] = useState();
  const [Industry, setIndustry] = useState();
  const [ContactNumber, setContactNumber] = useState();

  // Branch data ------------

  const showBranchesData = async(key) =>{
    const responsedata = await getBranchs()
    setData(responsedata,key)
  }
  useEffect(() => {
    showBranchesData()
  }, [])

  // Handle input changes

  const handleOrgIdChange = (e) => {
    setOrgID(e.target.value);
  };
  const handleBranchName = (e) => {
    setBranchName(e.target.value);
  };

  const handleLocation = (e) => {
    setLocation(e.target.value);
  };

  const handlesetAddress = (e) => {
    setAddress(e.target.value);
  };

  const handlesetContactperson = (e) => {
    setContactPerson(e.target.value);
  };

  const handlesetContactEmail = (e) => {
    setContactEmailID(e.target.value);
  };

  const handlesetIndustry = (e) => {
    setIndustry(e.target.value);
  };

  const handlesetContactNumber = (e) => {
    setContactNumber(e.target.value);
  };

  function emptyfields(event) {
    setOrgID("");
    setBranchName("");
    setLocation("");
    setAddress("");
    setContactPerson("");
    setContactEmailID("");
    setIndustry("");
    setContactNumber("");
    setAddRow(false);
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const drop = {
      orgId: OrgID,
      branchName: BranchName,
      location: Location,
      address: Address,
      contactPerson: ContactPerson,
      contactNumber: ContactNumber,
      contactEmail: ContactEmailID,
      industry: Industry,
      userId: auth.empId.toString(),
    };
    console.log(drop);

    axios
      .post(`${BASE_URL}/api/branch`, drop)
      .then((response) => {
        console.log(response.data);
        toast.success(
          <span>
            <strong>successfully</strong> Added.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        emptyfields();
        showBranchesData();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const [open, setOpen] = React.useState(false);
  const [opendeletepopup, setOpenDelete] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const HandleClose = () => {
    setEditedIndex(null);
  };

  const handleClickdeletepopup = (Id) => {
    setOpenDelete(true);
    setbranchId(Id);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const [branchId, setbranchId] = useState([]);
  const [searchInput, setSearchInput] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const name = item.branchName.toLowerCase();
      const Id = String(item.branchId).toLowerCase();
      const orgId = item.orgId.toLowerCase();
      const location = item.location.toLowerCase();
      const address = item.address.toLowerCase();
      const contactPerson = item.contactPerson.toLowerCase();
      const contactNumber = item.contactNumber.toLowerCase();
      const contactEmail = item.contactEmail.toLowerCase();
      const industry = item.industry.toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        Id.includes(searchValue.toLowerCase()) ||
        orgId.includes(searchValue.toLowerCase()) ||
        location.includes(searchValue.toLowerCase()) ||
        address.includes(searchValue.toLowerCase()) ||
        contactPerson.includes(searchValue.toLowerCase()) ||
        contactNumber.includes(searchValue.toLowerCase()) ||
        contactEmail.includes(searchValue.toLowerCase()) ||
        industry.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const [editedIndex, setEditedIndex] = useState(null);
  function handleEdit(index) {
    setEditedIndex(index);
    setOpen(false);
  }

  function UpdateBranch(event, branchId) {
    event.preventDefault();
    const editedItem = data[editedIndex];
    const payload = {
      orgId: editedItem.orgId.toString(),
      branchName: editedItem.branchName.toString(),
      location: editedItem.location.toString(),
      address: editedItem.address.toString(),
      contactPerson: editedItem.contactPerson.toString(),
      contactNumber: editedItem.contactNumber.toString(),
      contactEmail: editedItem.contactEmail.toString(),
      industry: editedItem.industry.toString(),
      userId: auth.empId.toString(),
    };
    console.log(payload, "payload");

    axios
      .put(`${BASE_URL}/api/branch/${branchId}`, payload)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        emptyfields();
        showBranchesData();
        setEditedIndex(null);
        toast.success(
          <span>
            <strong>successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }

  function handledelete(event) {
    event.preventDefault();
    axios
      .delete(`${BASE_URL}/api/branch/${branchId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        showBranchesData();
        setOpenDelete(false);
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
      <div className="container-fluid p-2" >
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
          height: tableHeight ? tableHeight : '200px',
          overflowY: "auto",
        }}
      >
        <table className="table table-bordered table-striped">
          <thead className="sticky-top">
            <tr>
              <th>Id</th>
              <th>Industry</th>
              <th>Organisation ID</th>
              <th>Branch Name</th>
              <th>Location</th>
              <th>Address</th>
              <th>Contact Person</th>
              <th>Contact Number</th>
              <th>Contact Email</th>
              <th style={{width:'100px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {AddRow === true && (
              <tr>
                <td></td>
                <td>
                  <input
                    type="text"
                    id="Industry"
                    name="Industry"
                    value={Industry}
                    onChange={handlesetIndustry}
                    required
                    placeholder="Enter Industry"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="OrgID"
                    name="OrgID"
                    value={OrgID}
                    onChange={handleOrgIdChange}
                    required
                    placeholder="Enter Organisation ID"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="BranchName"
                    name="BranchName"
                    value={BranchName}
                    style={{ fontSize: "11px" }}
                    onChange={handleBranchName}
                    required
                    placeholder="Enter Branch Name"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="Location"
                    name="Location"
                    value={Location}
                    onChange={handleLocation}
                    required
                    placeholder="Enter Location"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="Address"
                    name="Address"
                    value={Address}
                    onChange={handlesetAddress}
                    required
                    placeholder="Enter Address"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="ContactPerson"
                    name="ContactPerson"
                    value={ContactPerson}
                    onChange={handlesetContactperson}
                    required
                    placeholder="Enter Person Name"
                  />
                </td>
                <td>
                  <input
                    type="tel"
                    id="ContactNumber"
                    name="ContactNumber"
                    value={ContactNumber}
                    onChange={handlesetContactNumber}
                    required
                    placeholder="Enter Contact Number"
                  />
                </td>
                <td>
                  <input
                    type="email"
                    id="emailId"
                    name="emailId"
                    value={ContactEmailID}
                    onChange={handlesetContactEmail}
                    required
                    placeholder="Enter Email"
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                    {/* <button className="btn text-success btn-sm" > */}
                    <FaCheck id="FaCheck" onClick={handleSubmit}/>
                    {/* </button> */}
                  &nbsp;&nbsp;
                  {/* <button className="btn text-danger btn-sm" > */}
                  <FaXmark id="FaMinus" onClick={emptyfields}/>
                  {/* </button> */}
                </td>
              </tr>
            )}
            {searchInput.length > 0
              ? filteredResults.map((row, index) => (
                  <tr>
                    <td>{row.branchId}</td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.industry}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].industry = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.industry}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.orgId}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].orgId = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.orgId}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.branchName}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].branchName = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.branchName}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.location}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].location = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.location}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.address}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].address = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.address}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.contactPerson}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].contactPerson = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.contactPerson}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.contactNumber}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].contactNumber = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.contactNumber}</div>
                      )}
                    </td>
                    {/* {row.contactNumber?.split("T")[0]}</td> */}
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.contactEmail}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].contactEmail = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.contactEmail}</div>
                      )}
                    </td>
                    <td style={{textAlign:'center'}}>
                      {editedIndex === index ? (
                        <div>
                          <FaCheck
                            onClick={(event) =>
                              UpdateBranch(event, row.branchId)
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
                          <FaMinus
                            onClick={() => handleClickdeletepopup(row.branchId)}
                            id="FaMinus"
                            />
                            &nbsp;&nbsp;&nbsp;
                          <FaEdit
                            onClick={() => handleEdit(index)}
                            id="FaEdit"
                          />
                        </div>
                      )}
                      <div></div>
                    </td>
                  </tr>
                ))
              : data.map((row, index) => (
                  <tr>
                    <td>{row.branchId}</td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.industry}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].industry = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.industry}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.orgId}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].orgId = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.orgId}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.branchName}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].branchName = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.branchName}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.location}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].location = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.location}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.address}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].address = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.address}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.contactPerson}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].contactPerson = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.contactPerson}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.contactNumber}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].contactNumber = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.contactNumber}</div>
                      )}
                    </td>
                    {/* {row.contactNumber?.split("T")[0]}</td> */}
                    <td>
                      {editedIndex === index ? (
                        <input
                          value={row.contactEmail}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].contactEmail = e.target.value;
                            setData(newData);
                          }}
                          style={{
                            border: "none",
                            height: "22px",
                          }}
                        />
                      ) : (
                        <div>{row.contactEmail}</div>
                      )}
                    </td>
                    <td style={{textAlign:'center'}}>
                      {editedIndex === index ? (
                        <div>
                          <FaCheck
                            onClick={(event) =>
                              UpdateBranch(event, row.branchId)
                            }
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
                          <FaMinus
                            onClick={() => handleClickdeletepopup(row.branchId)}
                            id="FaMinus"
                            />
                            &nbsp;&nbsp;&nbsp;
                          <FaEdit
                            onClick={() => handleEdit(index)}
                            id="FaEdit"
                          />
                        </div>
                      )}
                      <div></div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
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
      {/* <ToastContainer /> */}
    </div>
  );
}

export default Branch;
