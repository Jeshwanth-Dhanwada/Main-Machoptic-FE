import React, { useState, useCallback, useEffect } from "react";
import { FaXmark, FaCheck, FaSistrix, FaMinus } from "react-icons/fa6";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

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
import { BASE_URL } from "../constants/apiConstants";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

function MaterialType() {
  const [routedata, setroutedata] = useState([]);
  const [data, setData] = useState([]);

  // Route Master ---------

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/routeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setroutedata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/materialType`;
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

  function getMaterialType() {
    const apiUrl = `${BASE_URL}/api/materialType`;
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

  const [TypeDescription, setTypeDescription] = useState("");
  const [MaterialCategoryID, setMaterialCategoryID] = useState("");
  const [RouteID, setRouteID] = useState("");
  const [Specification, setSpecification] = useState("");

  // Handle input changes

  const handleTypeDescription = (event) => {
    setTypeDescription(event.target.value);
  };
  const handleMaterialCategoryID = (event) => {
    setMaterialCategoryID(event.target.value);
  };
  const handleRouteID = (event) => {
    setRouteID(event.target.value);
  };
  const handleSpecification = (event) => {
    setSpecification(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      branchId: "1001",
      typeDescription: TypeDescription,
      materialCategoryId: MaterialCategoryID,
      routeId: RouteID,
      nodeId: "1",
      specification: Specification,
      userId: "1111",
    };
    console.log(payload);
    axios
      .post(`${BASE_URL}/api/materialType`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        getMaterialType();
        emptyfields();
        toast.success(
          <span>
            <strong>Successfully</strong> Added.
          </span>
        );
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const emptyfields = () => {
    setRouteID("");
    setSpecification("");
    setMaterialCategoryID("");
    setTypeDescription("");
    setShowForm1(true);
  };

  const [open, setOpen] = React.useState(false);
  const [opendeletepopup, setOpenDelete] = React.useState(false);

  const [searchInput, setSearchInput] = useState([]);
  const [materialTypeId, setmaterialTypeId] = useState();
  const [filteredResults, setFilteredResults] = useState([]);
  const [showForm1, setShowForm1] = useState(true);

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data.filter((item) => {
      const Id = String(item.id).toLowerCase();
      const branchId = item.branchId.toLowerCase();
      const unitDescription = item.typeDescription.toLowerCase();
      const conversionRate = item.routeId.toLowerCase();
      const refUnitId = item.nodeId.toLowerCase();
      const specification = item.specification.toLowerCase();
      const MaterialcatId = String(item.materialCategoryId).toLowerCase();
      const userId = item.userId.toLowerCase();
      return (
        branchId.includes(searchValue.toLowerCase()) ||
        Id.includes(searchValue.toLowerCase()) ||
        unitDescription.includes(searchValue.toLowerCase()) ||
        conversionRate.includes(searchValue.toLowerCase()) ||
        refUnitId.includes(searchValue.toLowerCase()) ||
        specification.includes(searchValue.toLowerCase()) ||
        MaterialcatId.includes(searchValue.toLowerCase()) ||
        userId.includes(searchValue.toLowerCase())
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

  function handleEdit(matcatId) {
    console.log(matcatId, "unitId");
    setmaterialTypeId(matcatId);
    setShowForm1(false);
    setOpen(false);
  }

  const [EditTypeDescription, setEditTypeDescription] = useState("");
  const [EditMaterialCategoryID, setEditMaterialCategoryID] = useState("");
  const [EditRouteID, setEditRouteID] = useState("");
  const [EditSpecification, setEditSpecification] = useState("");

  const handleEditTypeDescription = (event) => {
    setEditTypeDescription(event.target.value);
  };
  const handleEditMaterialCategoryID = (event) => {
    setEditMaterialCategoryID(event.target.value);
  };
  const handleEditRouteID = (event) => {
    setEditRouteID(event.target.value);
  };
  const handleEditSpecification = (event) => {
    setEditSpecification(event.target.value);
  };

  useEffect(() => {
    const description = data
      .filter((item) => item.id == materialTypeId)
      .map((item) => item.typeDescription);
    const MaterialcatId = data
      .filter((item) => item.id == materialTypeId)
      .map((item) => item.materialCategoryId);
    const routeId = data
      .filter((item) => item.id == materialTypeId)
      .map((item) => item.routeId);
    const specification = data
      .filter((item) => item.id == materialTypeId)
      .map((item) => item.specification);

    setEditTypeDescription(description);
    setEditMaterialCategoryID(MaterialcatId);
    setEditRouteID(routeId);
    setEditSpecification(specification);
  }, [data, materialTypeId]);

  function UpdateMaterialCatID(event) {
    event.preventDefault();
    const payload = {
      branchId: "1001",
      typeDescription: EditTypeDescription.toString(),
      materialCategoryId: parseInt(EditMaterialCategoryID),
      routeId: EditRouteID.toString(),
      nodeId: "1",
      specification: EditSpecification.toString(),
      userId: "1111",
    };
    console.log(payload);
    axios
      .put(`${BASE_URL}/api/materialType/${materialTypeId}`, payload)
      .then((response) => {
        console.log(response.data);
        console.log("New row added successfully");
        getMaterialType();
        emptyfields();
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>
        );
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  }

  function handleDelete(event) {
    event.preventDefault();
    axios
      .delete(`${BASE_URL}/api/materialType/${materialTypeId}`)
      .then((response) => {
        console.log("Shift deleted successfully", response.data);
        getMaterialType();
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

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <BootstrapDialog
        fullWidth
        maxWidth="lg"
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
                  <TableCell style={{ fontSize: "11px" }}>ID</TableCell>
                  <TableCell style={{ fontSize: "11px" }}>Branch ID</TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    Type Description
                  </TableCell>
                  <TableCell style={{ fontSize: "11px" }}>Route ID</TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    Node Id Unit Id
                  </TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    Specification
                  </TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    Material Category ID
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
                        <TableCell style={{ fontSize: "11px" }} scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.branchId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.typeDescription}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.routeId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.nodeId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.specification}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.materialCategoryId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.userId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          <input
                            type="radio"
                            // onClick={() => handleEdit(row.unitId)}
                          ></input>
                          {/* <button 
                        style={{border:'none',backgroundColor:'transparent'}}
                        onClick={() => handledelete(row.shiftNumber)}
                          >
                        <FaMinus/>
                      </button>  */}
                        </TableCell>
                      </TableRow>
                    ))
                  : data.map((row) => (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell style={{ fontSize: "11px" }} scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.branchId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.typeDescription}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.routeId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.nodeId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.specification}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.materialCategoryId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {row.userId}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", fontSize: "11px" }}
                        >
                          <input
                            type="radio"
                            onClick={() => handleEdit(row.id)}
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
              <Tooltip title="Search Material Type" placement="right-start">
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
                  <label htmlFor="RouteID">Route ID</label>
                  <select
                    id="RouteID"
                    name="RouteID"
                    className="form-control"
                    value={RouteID}
                    style={{ fontSize: "11px" }}
                    onChange={handleRouteID}
                    required
                  >
                    <option hidden>Please Select</option>
                    {routedata.map((item) => (
                      <option>{item.routeId}</option>
                    ))}
                  </select>
                </div>
                <div className="col-4">
                  <label htmlFor="Specification">Specification</label>
                  <input
                    type="text"
                    id="Specification"
                    name="Specification"
                    className="form-control"
                    value={Specification}
                    placeholder="Specification"
                    style={{ fontSize: "11px" }}
                    onChange={handleSpecification}
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="TypeDescription">Type Description</label>
                  <textarea
                    id="TypeDescription"
                    name="TypeDescription"
                    className="form-control"
                    value={TypeDescription}
                    style={{ fontSize: "11px" }}
                    placeholder="Enter Description"
                    onChange={handleTypeDescription}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="offset-0 row mt-2">
                <div className="col-4">
                  <label htmlFor="MaterialCategoryID">
                    Material Category ID
                  </label>
                  <input
                    type="number"
                    id="MaterialCategoryID"
                    name="MaterialCategoryID"
                    className="form-control"
                    placeholder="MaterialCategoryID"
                    value={MaterialCategoryID}
                    style={{ fontSize: "11px" }}
                    onChange={handleMaterialCategoryID}
                    required
                  />
                </div>
              </div>
              <br />
              <div className="offset-0 row">
                <div className="col-2">
                  <button
                    className="btn btn-sm"
                    type="submit"
                    id="Facheck"
                    // onClick={handleSubmit}
                  >
                    {/* <FaCheck /> */}Add
                  </button>
                  &nbsp;
                  <a className="btn btn-sm" id="FaXmark" onClick={emptyfields}>
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
              <button className="btn btn-primary btn-sm" onClick={emptyfields}>
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
                    <Button onClick={handleDelete} autoFocus>
                      Yes
                    </Button>
                    <Button onClick={handleDeleteClose}>No</Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
            </div>
            <div className="offset-0 row mt-3">
              <div className="col-4">
                <label htmlFor="RouteID">Material Type ID:</label>
                <input
                  id="RouteID"
                  name="RouteID"
                  className="form-control"
                  value={materialTypeId}
                  style={{ fontSize: "11px" }}
                  onChange={handleRouteID}
                  required
                  disabled
                />
              </div>
              <div className="col-4">
                <label htmlFor="RouteID">Route ID:</label>
                <select
                  id="RouteID"
                  name="RouteID"
                  className="form-control"
                  value={EditRouteID}
                  style={{ fontSize: "11px" }}
                  onChange={handleEditRouteID}
                  required
                >
                  <option hidden>Please Select</option>
                  {routedata.map((item) => (
                    <option>{item.routeId}</option>
                  ))}
                </select>
              </div>
              <div className="col-4">
                <label htmlFor="Specification">Specification</label>
                <input
                  type="text"
                  id="Specification"
                  name="Specification"
                  className="form-control"
                  value={EditSpecification}
                  style={{ fontSize: "11px" }}
                  placeholder="Specification"
                  onChange={handleEditSpecification}
                  required
                />
              </div>
            </div>
            <div className="offset-0 row mt-2">
              <div className="col-4">
                <label htmlFor="TypeDescription">Type Description:</label>
                <textarea
                  id="TypeDescription"
                  name="TypeDescription"
                  className="form-control"
                  value={EditTypeDescription}
                  style={{ fontSize: "11px" }}
                  placeholder="Enter Description"
                  onChange={handleEditTypeDescription}
                  required
                ></textarea>
              </div>
              <div className="col-4">
                <label htmlFor="MaterialCategoryID">
                  Material Category ID:
                </label>
                <input
                  type="number"
                  id="MaterialCategoryID"
                  name="MaterialCategoryID"
                  className="form-control"
                  placeholder="MaterialCategoryID"
                  value={EditMaterialCategoryID}
                  style={{ fontSize: "11px" }}
                  onChange={handleEditMaterialCategoryID}
                  required
                />
              </div>
            </div>
            <br />
            <div className="offset-0 row">
              <div className="col-2">
                <button
                  className="btn btn-sm"
                  type="submit"
                  id="Facheck"
                  onClick={UpdateMaterialCatID}
                >
                  {/* <FaCheck /> */}Add
                </button>
                &nbsp;
                <a className="btn  btn-sm"  nClick={emptyfields}>
                  {/* <FaXmark /> */}Cancel
                </a>
              </div>
            </div>
          </div>
        </form>
      )}

      <ToastContainer />
    </div>
  );
}

export default MaterialType;
