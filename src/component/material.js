import React, { useState, useCallback, useEffect } from "react";
import { FaXmark, FaCheck, FaSistrix, FaMinus } from "react-icons/fa6";
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

function Material() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/material`;
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

  function getMaterialdata() {
    const apiUrl = `${BASE_URL}/api/material`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const [MaterialName, setMaterialName] = useState();
  const [MaterialUnitID, setMaterialUnitID] = useState();

  const [EditMaterialName, setEditMaterialName] = useState();
  const [EditMaterialUnitID, setEditMaterialUnitID] = useState();

  const handleMaterialName = (e) => {
    setMaterialName(e.target.value);
  };
  const handleMaterialUnitID = (e) => {
    setMaterialUnitID(e.target.value);
  };

  const handleEditMaterialName = (e) => {
    setEditMaterialName(e.target.value);
  };
  const handleEditMaterialUnitID = (e) => {
    setEditMaterialUnitID(e.target.value);
  };

  const Emptyfields = (e) => {
    setMaterialName("");
    setMaterialUnitID("");
    setShowForm1(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      branchId: "1001",
      userId: "1111",
      unitId: MaterialUnitID,
      materialName: MaterialName,
    };

    axios
      .post(`${BASE_URL}/api/material`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        getMaterialdata();
        toast.success(
          <span>
            <strong>Successfully</strong> Added.
          </span>
        );
        Emptyfields();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

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
  const [searchInput, setSearchInput] = useState([]);
  const [materialId, setmaterialId] = useState();
  const [filteredResults, setFilteredResults] = useState([]);
  const [showForm1, setShowForm1] = useState(true);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const name = item.materialName.toLowerCase();
      const Id = String(item.materialId).toLowerCase();
      const unitId = item.unitId.toLowerCase();
      const userId = item.userId.toLowerCase();
      const branch = item.branchId.toLowerCase();
      return (
        name.includes(searchValue.toLowerCase()) ||
        Id.includes(searchValue.toLowerCase()) ||
        name.includes(searchValue.toLowerCase()) ||
        unitId.includes(searchValue.toLowerCase()) ||
        userId.includes(searchValue.toLowerCase()) ||
        branch.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickdeletepopup = () => {
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  function handleEdit(materialId) {
    console.log(materialId, "shiftId");
    setmaterialId(materialId);
    setShowForm1(false);
    setOpen(false);
  }

  function Updatefields(event) {
    event.preventDefault();
    const payload = {
      branchId: "1001",
      userId: "1111",
      unitId: EditMaterialUnitID.toString(),
      materialName: EditMaterialName.toString(),
    };

    axios
      .put(`${BASE_URL}/api/material/${materialId}`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        getMaterialdata();
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>
        );
        Emptyfields();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  }

  function handledelete(event) {
    event.preventDefault();
    axios
      .delete(`${BASE_URL}/api/material/${materialId}`)
      .then((response) => {
        console.log("Node deleted successfully", response.data);
        getMaterialdata();
        setShowForm1(true);
        toast.error(
          <span>
            <strong>Deleted</strong> successfully.
          </span>
        );
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
        toast.error(
          <span>
            <strong>Cannot be</strong> deleted.
          </span>
        );
      });
  }

  useEffect(() => {
    const name = data
      .filter((item) => item.materialId == materialId)
      .map((item) => item.materialName);
    const unitId = data
      .filter((item) => item.materialId == materialId)
      .map((item) => item.unitId);

    setEditMaterialName(name);
    setEditMaterialUnitID(unitId);
  }, [data, materialId]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <BootstrapDialog
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {/* Employee List */}

          <TextField
            id="filled-basic"
            label="Search"
            onChange={(e) => searchItems(e.target.value)}
            value={searchInput}
            variant="filled"
          />
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Paper sx={{ minWidth: "70px", overflowY: "scroll" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 465 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: "11px" }}>
                    Material ID
                  </TableCell>
                  <TableCell style={{ fontSize: "11px" }}>Branch ID</TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    Material Name
                  </TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    Material Unit Id
                  </TableCell>
                  <TableCell style={{ fontSize: "11px" }}>User Id</TableCell>
                  <TableCell style={{ width: "100px", fontSize: "11px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchInput.length > 0
                  ? filteredResults.map((row) => (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.materialId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.branchId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.materialName}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.unitId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.userId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          <input
                            type="radio"
                            onClick={() => handleEdit(row.materialId)}
                          ></input>
                        </TableCell>
                      </TableRow>
                    ))
                  : data.map((row) => (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.materialId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.branchId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.materialName}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.unitId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.userId}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", fontSize: "11px" }}
                        >
                          <input
                            type="radio"
                            onClick={() => handleEdit(row.materialId)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <DialogActions>
          <Button autoFocus class="btn btn-danger btn-sm" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {showForm1 ? (
        <form onSubmit={handleSubmit} style={{ fontSize: "11px" }}>
          <div className="container">
            <div className="col-12 p-2">
              <Tooltip title="Search Material" placement="right-start">
                <Button
                  variant="contained"
                  class="btn btn-primary btn-sm"
                  onClick={handleClickOpen}
                >
                  <FaSistrix />
                </Button>
              </Tooltip>
              <div className="offset-0 row mt-3">
                <div className="col-4">
                  <label htmlFor="MaterialName">Material Name</label>
                  <input
                    type="text"
                    id="MaterialName"
                    name="MaterialName"
                    className="form-control"
                    value={MaterialName}
                    placeholder="Enter Material Name"
                    style={{ fontSize: "11px" }}
                    onChange={handleMaterialName}
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="MaterialUnitID">Material Unit ID</label>
                  <input
                    type="number"
                    id="MaterialUnitID"
                    name="MaterialUnitID"
                    className="form-control"
                    placeholder="Enter Material Unit ID"
                    value={MaterialUnitID}
                    style={{ fontSize: "11px" }}
                    onChange={handleMaterialUnitID}
                    required
                  />
                </div>
              </div>

              <br />
              <div className="offset-0 row">
                <div className="col-2">
                  <button className=" btn btn-sm" id="Facheck" type="submit">
                    Add
                  </button>
                  &nbsp;
                  <a
                    onClick={Emptyfields}
                    className="btn btn-sm"
                    type="submit"
                    id="FaXmark"
                  >
                    {/* <FaXmark /> */}Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form>
          <div className="container">
            <div className="col-12 p-2">
              <button className="btn btn-primary btn-sm" onClick={Emptyfields}>
                Go Back
              </button>
              <Button
                class="btn btn-danger btn-sm"
                onClick={handleClickdeletepopup}
                style={{ position: "absolute", right: "10px", width: "50px" }}
              >
                <FaMinus />
              </Button>
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
            <div className="offset-0 row mt-3">
              <div className="col-4">
                <label htmlFor="MaterialName">Material ID</label>
                <input
                  type="text"
                  id="MaterialName"
                  name="MaterialName"
                  className="form-control"
                  value={materialId}
                  style={{ fontSize: "11px" }}
                  placeholder="Enter Material Name"
                  // onChange={handleEditMaterialName}
                  disabled
                />
              </div>
              <div className="col-4">
                <label htmlFor="MaterialName">Material Name</label>
                <input
                  type="text"
                  id="MaterialName"
                  name="MaterialName"
                  className="form-control"
                  value={EditMaterialName}
                  style={{ fontSize: "11px" }}
                  placeholder="Enter Material Name"
                  onChange={handleEditMaterialName}
                  required
                />
              </div>
              <div className="col-4">
                <label htmlFor="MaterialUnitID">Material Unit ID:</label>
                <input
                  type="number"
                  id="MaterialUnitID"
                  name="MaterialUnitID"
                  className="form-control"
                  placeholder="Enter Material Unit ID"
                  value={EditMaterialUnitID}
                  style={{ fontSize: "11px" }}
                  onChange={handleEditMaterialUnitID}
                  required
                />
              </div>
            </div>
            <br />
            <div className="offset-0 row">
              <div className="col-2">
                <button
                  onClick={Updatefields}
                  className=" btn btn-sm"
                  id="Facheck"
                  type="submit"
                >
                  Update
                </button>
                &nbsp;
                <button
                  onClick={handledelete}
                  className="btn btn-sm"
                  id="FaXmark"
                >
                  {/* <FaXmark /> */}Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      <ToastContainer />
    </div>
  );
}

export default Material;
