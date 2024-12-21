import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import { FaEdit, FaCheck, FaSistrix } from "react-icons/fa";
import "./sidebar.css";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../constants/apiConstants";
import { HiPlus } from "react-icons/hi2";
import { IoArrowUpSharp } from "react-icons/io5";

import { MarkerType, useNodesState, useEdgesState } from "reactflow";
import { AiFillDelete } from "react-icons/ai";
import { Backdrop, CircularProgress } from "@mui/material";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { getItemmaster } from "../api/shovelDetails";

import { FcNumericalSorting12 } from "react-icons/fc";
import { FcNumericalSorting21 } from "react-icons/fc";
import AuthContext from "../context/AuthProvider.js";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const RoutePopup = ({
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onClick,
  setDataCallback,
}) => {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [editedIndex, setEditedIndex] = useState(null);
  const [editedRouteIndex, setEditedRouteIndex] = useState(null);
  const [isNewRowActive, setNewRowActive] = useState(false);
  const [OpenLoader, setOpenLoader] = useState(false);
  // const [isChecked, setIsClicked] = useState(Boolean(false));
  const [newRowData, setNewRowData] = useState({
    routeDescription: "",
    productCategory: "",
  });
  const [initialNodes] = useState([]);
  const [initialEdges] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Fetch -----------------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    setOpenLoader(true);
    const apiUrl = `${BASE_URL}/api/routeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data)
        setData(response.data);
        setOpenLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [checked, setRadioCheck] = useState(false);
  const sendDataToParent = (routeid) => {
    setRadioCheck(true);
    var Routedata = routeid;
    const apiUrl = `${BASE_URL}/api/edgeMaster?routeId=${routeid}&_=${Date.now()}`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data, "--");
        const dataArray = response.data.map((data) => ({
          id: data.id,
          edgeId: data.edgeId,
          routeid: data.routeId,
          source: data.sourceId,
          target: data.targetId,
          type: data.edgeStyle,
          animated: data.animation,
          sourceNodeId: data.sourceNodeId,
          targetNodeId: data.targetNodeId,
          label: data.label,
          style: { strokeWidth: data.edgeThickness, stroke: data.edgeColor },
          // style: { strokeWidth: data.edgeThickness, stroke: data.edgeColor },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: "#1C9C9B",
            arrow: data.arrow,
          },
        }));
        setEdges(dataArray);
        console.log("Incoming");
        onClick(dataArray, Routedata); // Pass the array of objects to the onClick function
        // onCancel()
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleEdit = (index) => {
    setEditedIndex(index);
  };

  // Edit ------------------

  const handleSave = () => {
    // Make an API request to save the edited data here
    // Assuming you have an API endpoint to update the data
    const editedItem = data[editedIndex];
    const edite = {
      branchId: editedItem.branchId,
      routeDescription: editedItem.routeDescription,
      optional: editedItem.optional,
      productCategory: editedItem.productCategory,
      userId: auth.empId.toString(),
    };
    console.log(edite.routeId, "edite");
    console.log(editedItem, "editedItem");

    // Update the edited item with the new values
    // You can use axios.put or a similar method to send the data to your API
    axios
      .put(`${BASE_URL}/api/routeMaster/${editedItem.routeId}`, edite)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        // Clear the edited index
        setEditedIndex(null);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const handleCancel = () => {
    // Clear the edited index to cancel editing
    setEditedIndex(null);
  };

  // Delete ---------------------

  const handleDelete = (index) => {
    const itemToDelete = data[index];
    const apiUrl = `${BASE_URL}/api/routeMaster/${itemToDelete.routeId}`;

    axios
      .delete(apiUrl)
      .then((response) => {
        console.log("Data deleted successfully", response.data);
        // Remove the deleted item from the data array
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        console.log("AWS checking");
      });
  };

  // ADD -----------------

  const handleAddNewRow = () => {
    setNewRowActive(true);
  };

  const handleNewRowInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData({ ...newRowData, [name]: value });
  };

  const handleNewRowSubmit = () => {
    // Prepare the data payload to send to the API
    const newDataPayload = {
      // Fields entered by the user
      // routeId: 2, // Example: Generate a new routeId
      branchId: auth.branchId,
      routeDescription: newRowData.routeDescription,
      optional: "Optional Data",
      productCategory: newRowData.productCategory,
      userId: auth.empId.toString(),
    };
    // Make an API request to add the new row data to the database
    // Assuming you have an API endpoint to create new rows
    axios
      .post(`${BASE_URL}/api/routeMaster`, newDataPayload)
      .then((response) => {
        console.log("New row added successfully", response.data);
        toast.success(
          <span>
            <strong>Successfully! </strong> Added.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            // autoClose: 3000, // Optional: Set auto close time in milliseconds
            // closeButton: false, // Optional: Hide close button
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );

        // Add the new row to the data array
        setData([...data, response.data]);
        // Clear the new row form and deactivate new row mode
        setNewRowData({
          routeDescription: "",
          productCategory: "",
        });
        setNewRowActive(false);
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [ItemMasterData, setItemMaster] = useState([]);

  const showItemmaster = async (key) => {
    setOpenLoader(true);
    const responsedata = await getItemmaster();
    setItemMaster(responsedata, key);
    setOpenLoader(false);
  };

  useEffect(() => {
    showItemmaster();
  }, []);

  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchVisible, setSearchVisible] = useState(false);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = ItemMasterData.filter((item) => {
      const Itemname = String(item.IT_NAME).toLowerCase(); // Convert to string
      return Itemname.includes(searchValue.toLowerCase());
    });
    setFilteredResults(filteredData);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput("");
  };

  const [routesorting, setRouteSorting] = useState(false);
  const [routesorting1, setRouteSorting1] = useState(true);

  const [ITCODEsorting, setITCODEsorting] = useState(false);
  const [ITCODEsorting1, setITCODEsorting1] = useState(true);
  const HandleAscSorting = (field) => {
    const sortData = (data) => {
      return data.sort((a, b) => {
        if (field === "RouteASC") {
          setRouteSorting1(false);
          setRouteSorting(true);
          const routeA = Number(a.Route);
          const routeB = Number(b.Route);
          return routeA - routeB;
        }
        if (field === "ITCODEASC") {
          setITCODEsorting1(false);
          setITCODEsorting(true);
          const itcodeA = a.IT_CODE;
          const itcodeB = b.IT_CODE;
          // return itcodeA - itcodeB;
          // Handle IT_CODE as strings, using localeCompare for proper string sorting
          return itcodeA.localeCompare(itcodeB);
        }
        console.log(a[field] - b[field]);
        return a[field] - b[field];
      });
    };
    if (filteredResults?.length > 0) {
      setFilteredResults(sortData([...filteredResults]));
    } else {
      setItemMaster(sortData([...ItemMasterData]));
    }
  };

  const HandleDscSorting = (field) => {
    const sortData = (data) => {
      return data.sort((a, b) => {
        if (field === "RouteDSC") {
          setRouteSorting1(true);
          setRouteSorting(false);
          const routeA = a.Route;
          const routeB = b.Route;
          return routeB - routeA;
        }
        if (field === "ITCODEDSC") {
          setITCODEsorting1(true);
          setITCODEsorting(false);
          const itcodeA = a.IT_CODE;
          const itcodeB = b.IT_CODE;
          return itcodeB - itcodeA;
        }
        return b[field] - a[field];
      });
    };
    if (filteredResults?.length > 0) {
      setFilteredResults(sortData([...filteredResults]));
    } else {
      setItemMaster(sortData([...ItemMasterData]));
    }
  };

  const HandleEditRoute = (index) => {
    setEditedRouteIndex(index);
  };
  const HandleCloseEdit = () => {
    setEditedRouteIndex(null);
  };

  const getItemmasterdata = () => {
    axios
      .get(`${BASE_URL}/api/itemmaster`)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        // Clear the edited index
        setItemMaster(response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  // const handleSaveItemMaster = () => {
  //   // const editedItem = ItemMasterData[editedRouteIndex];
  //   const { DateTime, ...itemWithoutDateTime } = ItemMasterData[editedRouteIndex];
  //   // Assign new userId value
  //   const updatedItem = { ...itemWithoutDateTime, userId: auth.empId.toString(), branchId : auth.branchId};
  //   console.log(updatedItem.IT_CODE)
  //   axios
  //    .put(`${BASE_URL}/api/itemmaster/${updatedItem.IT_CODE}`, updatedItem)
  //     .then((response) => {
  //       console.log("Data saved successfully", response.data);
  //       getItemmasterdata()
  //       setEditedRouteIndex(null);
  //     })
  //     .catch((error) => {
  //       console.error("Error saving data:", error);
  //     });
  // }

  const handleSaveItemMaster = (IT_CODE) => {
    const editedItem = ItemMasterData.find((item) => item.IT_CODE === IT_CODE);

    const { DateTime, ...itemWithoutDateTime } = editedItem;
    // Assign new userId and branchId values
    const updatedItem = {
      ...itemWithoutDateTime,
      userId: auth.empId.toString(),
      branchId: auth.branchId,
    };

    axios
      .put(`${BASE_URL}/api/itemmaster/${updatedItem.IT_CODE}`, updatedItem)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        getItemmasterdata(); // Refresh the data
        setEditedRouteIndex(null); // Clear the edited index
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };
  return (
    <div>
      <div className="container-fluid mt-2">
        <div className="row">
          <div className="col-1">
            <button
              className="btn btn-white"
              id="addbutton"
              title="Add Route"
              onClick={handleAddNewRow}
            >
              <HiPlus style={{ fontSize: "16px" }} />
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
        <table className="table table-bordered table-striped">
          <thead style={{ fontSize: "small" }}>
            <tr>
              <th>&nbsp;</th>
              <th>Route ID</th>
              <th>Route Name</th>
              <th>Material Type</th>
              <th style={{ width: "80px" }}>Actions</th>
            </tr>
          </thead>
          <tbody border={"1px"}>
            {data.map((item, index) => (
              <tr key={item.routeId} style={{ cursor: "pointer" }}>
                <td>
                  <input
                    type="radio"
                    name="radio"
                    value={item.routeId}
                    onChange={() => sendDataToParent(item.routeId)}
                  />
                </td>
                <td>{item.routeId}</td>
                <td>
                  {editedIndex === index ? (
                    <input
                      type="text"
                      value={item.routeDescription}
                      onChange={(e) => {
                        // Update the edited item with the new value
                        const newData = [...data];
                        newData[index].routeDescription = e.target.value;
                        setData(newData);
                      }}
                      style={{
                        width: "100px",
                        border: "none",
                        backgroundColor: "whitesmoke",
                      }}
                    />
                  ) : (
                    <div>{item.routeDescription}</div>
                  )}
                </td>
                <td>
                  {editedIndex === index ? (
                    <input
                      type="text"
                      value={item.productCategory}
                      onChange={(e) => {
                        // Update the edited item with the new value
                        const newData = [...data];
                        newData[index].productCategory = e.target.value;
                        setData(newData);
                      }}
                      style={{
                        width: "100px",
                        border: "none",
                        backgroundColor: "whitredesmoke",
                      }}
                    />
                  ) : (
                    <div>{item.productCategory}</div>
                  )}
                </td>
                <td
                  className=" align-items-center"
                  style={{ textAlign: "center" }}
                >
                  {editedIndex === index ? (
                    <FaXmark id="FaMinus"  onClick={handleCancel}/>
                  ) : (
                    <AiFillDelete id="FaMinus" onClick={() => handleDelete(index)}/>
                  )}
                  &nbsp;&nbsp;
                  {editedIndex === index ? (
                      <FaCheck id="FaCheck" onClick={handleSave}/>
                  ) : (
                      <FaEdit id="FaEdit" onClick={() => handleEdit(index)}/>
                  )}
                  <button
                    style={{
                      width: "20px",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    onClick={handleClickOpen}
                  >
                    <IoArrowUpSharp />
                  </button>
                </td>
              </tr>
            ))}
            {isNewRowActive && (
              <tr>
                <td></td>
                <td></td>
                <td style={{ textAlign: "left" }}>
                  <input
                    type="text"
                    name="routeDescription"
                    placeholder="Route Name"
                    required
                    value={newRowData.routeDescription}
                    onChange={handleNewRowInputChange}
                    style={{
                      border: "none",
                      width: "100px",
                      backgroundColor: "whitesmoke",
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="productCategory"
                    placeholder="Product Category"
                    required
                    value={newRowData.productCategory}
                    onChange={handleNewRowInputChange}
                    style={{
                      border: "none",
                      width: "100px",
                      backgroundColor: "whitesmoke",
                    }}
                  />
                </td>
                <td>
                    <FaXmark id="FaMinus" onClick={() => setNewRowActive(false)}/>
                  &nbsp;&nbsp;
                    <FaCheck id="FaCheck" onClick={handleNewRowSubmit}/>
                </td>
              </tr>
            )}
          </tbody>
        </table>
          </div>
        </div>
      </div>
      {/* <div className=''>
        
      </div> */}
      <ToastContainer />
      {OpenLoader && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={OpenLoader}
          // onClick={handleClose}
        >
          <CircularProgress size={80} color="inherit" />
        </Backdrop>
      )}
      {open && (
        <React.Fragment>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth="md" // You can change this to "sm", "md", "lg", "xl" for different sizes
            maxHeight="100%"
            fullWidth={true} // This makes the dialog use the full width of the screen based on maxWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Finished Goods
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              <Typography>
                <table className="table table-bordered table-striped">
                  <thead className="sticky-top">
                    <tr>
                      <th>
                        IT CODE &nbsp;
                        {ITCODEsorting === true && (
                          <FcNumericalSorting21
                            onClick={() => HandleDscSorting("ITCODEDSC")}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                        {ITCODEsorting1 === true && (
                          <FcNumericalSorting12
                            onClick={() => HandleAscSorting("ITCODEASC")}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </th>
                      <th className="d-flex align-items-center">
                        IT NAME &nbsp;
                        {isSearchVisible ? (
                          <div
                            className="search-input-container d-flex align-items-center"
                            style={{
                              position: "relative",
                              top: "0px",
                              // backgroundColor: "white",
                            }}
                          >
                            <input
                              type="text"
                              variant="outlined"
                              className="form-control"
                              value={searchInput}
                              size="small"
                              style={{
                                width: "160px",
                                height: "20px",
                                fontSize: "10px",
                                marginTop: "0px",
                              }}
                              placeholder="search Finished Goods"
                              onChange={(e) => searchItems(e.target.value)}
                            />
                            <span
                              className="clear-button"
                              style={{
                                position: "absolute",
                                right: "10px",
                                cursor: "pointer",
                              }}
                              onClick={toggleSearch}
                            >
                              <FaXmark />
                            </span>
                          </div>
                        ) : (
                          <span
                            className="search-icon-button"
                            style={{ marginLeft: "10px" }}
                          >
                            <FaSistrix onClick={toggleSearch} />
                          </span>
                        )}
                      </th>
                      <th>Item Type</th>
                      <th>
                        Route &nbsp;
                        {routesorting === true && (
                          <FcNumericalSorting21
                            onClick={() => HandleDscSorting("RouteDSC")}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                        {routesorting1 === true && (
                          <FcNumericalSorting12
                            onClick={() => HandleAscSorting("RouteASC")}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </th>
                      <th>Item Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchInput.length > 0
                      ? filteredResults
                          .filter((item) => item.ItemType === "Finished Goods")
                          .map((item1) => (
                            <tr key={item1.IT_CODE}>
                              <td>{item1.IT_CODE}</td>
                              <td>{item1.IT_NAME}</td>
                              <td>{item1.ItemType}</td>
                              <td>
                                {editedRouteIndex === item1.IT_CODE ? (
                                  <select
                                    value={item1.Route}
                                    onChange={(e) => {
                                      // Find the item by IT_CODE and update its Route
                                      const newData = filteredResults.map(
                                        (item) =>
                                          item.IT_CODE === item1.IT_CODE
                                            ? { ...item, Route: e.target.value }
                                            : item
                                      );
                                      setItemMaster(newData);
                                    }}
                                    style={{ height: "18px" }}
                                  >
                                    {data.map((item) => (
                                      <option key={item.routeId}>
                                        {item.routeId}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <div>{item1.Route}</div>
                                )}
                              </td>
                              <td>{item1.Item_status}</td>
                              <td style={{ textAlign: "center" }}>
                                {editedRouteIndex === item1.IT_CODE ? (
                                  <div>
                                    <FaCheck
                                      id="FaCheck"
                                      onClick={() =>
                                        handleSaveItemMaster(item1.IT_CODE)
                                      }
                                    />{" "}
                                    &nbsp;
                                    <FaXmark
                                      style={{
                                        color: "red",
                                        cursor: "pointer",
                                      }}
                                      onClick={HandleCloseEdit}
                                    />
                                  </div>
                                ) : (
                                  <FaEdit
                                    id="FaEdit"
                                    onClick={() =>
                                      HandleEditRoute(item1.IT_CODE)
                                    }
                                  />
                                )}
                              </td>
                            </tr>
                          ))
                      : // ItemMasterData.filter(
                        //     (item) => item.ItemType === "Finished Goods"
                        //   ).map((item1, index) => (
                        //     <tr>
                        //       <td>{item1.IT_CODE}</td>
                        //       <td>{item1.IT_NAME}</td>
                        //       <td>{item1.ItemType}</td>
                        //       <td>
                        //         {editedRouteIndex === index ? (
                        //           <select
                        //             value={item1.Route}
                        //             onChange={(e) => {
                        //               const newData = [...ItemMasterData];
                        //               newData[index].Route = e.target.value;
                        //               setItemMaster(newData);
                        //             }}
                        //             style={{ height: "18px" }}
                        //           >
                        //             {data.map((item) => (
                        //               <option>{item.routeId}</option>
                        //             ))}
                        //           </select>
                        //         ) : (
                        //           <div>{item1.Route}</div>
                        //         )}
                        //       </td>
                        //       <td>{item1.Item_status}</td>
                        //       <td style={{ textAlign: "center" }}>
                        //         {editedRouteIndex === index ? (
                        //           <div>
                        //             <FaCheck id="FaCheck" onClick={()=>handleSaveItemMaster()}/> &nbsp;
                        //             <FaXmark style={{color:'red',cursor:'pointer'}} onClick={HandleCloseEdit}/>
                        //           </div>
                        //         ) : (
                        //             <FaEdit id="FaEdit" onClick={() => HandleEditRoute(index)}/>
                        //         )}
                        //       </td>
                        //     </tr>
                        //   ))}
                        ItemMasterData.filter(
                          (item) => item.ItemType === "Finished Goods"
                        ).map((item1) => (
                          <tr key={item1.IT_CODE}>
                            <td>{item1.IT_CODE}</td>
                            <td>{item1.IT_NAME}</td>
                            <td>{item1.ItemType}</td>
                            <td>
                              {editedRouteIndex === item1.IT_CODE ? (
                                <select
                                  value={item1.Route}
                                  onChange={(e) => {
                                    // Find the item by IT_CODE and update its Route
                                    const newData = ItemMasterData.map((item) =>
                                      item.IT_CODE === item1.IT_CODE
                                        ? { ...item, Route: e.target.value }
                                        : item
                                    );
                                    setItemMaster(newData);
                                  }}
                                  style={{ height: "18px" }}
                                >
                                  {data.map((item) => (
                                    <option key={item.routeId}>
                                      {item.routeId}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <div>{item1.Route}</div>
                              )}
                            </td>
                            <td>{item1.Item_status}</td>
                            <td style={{ textAlign: "center" }}>
                              {editedRouteIndex === item1.IT_CODE ? (
                                <div>
                                  <FaCheck
                                    id="FaCheck"
                                    onClick={() =>
                                      handleSaveItemMaster(item1.IT_CODE)
                                    }
                                  />{" "}
                                  &nbsp;
                                  <FaXmark
                                    style={{ color: "red", cursor: "pointer" }}
                                    onClick={HandleCloseEdit}
                                  />
                                </div>
                              ) : (
                                <FaEdit
                                  id="FaEdit"
                                  onClick={() => HandleEditRoute(item1.IT_CODE)}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Save changes
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </React.Fragment>
      )}
    </div>
  );
};

export default RoutePopup;
