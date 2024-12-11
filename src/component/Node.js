// AnotherComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaXmark, FaCheck, FaMinus, FaSistrix } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from '@mui/material/Tooltip';


function Node() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState);
    console.log(sidebarCollapsed);
  };
  const [data, setData] = useState([]);
  const [NodeType, setNodeTypeData] = useState([]);
  const [Nodedata, setNodeData] = useState([]);
  const [shiftdata, setShiftdata] = useState([]);
  const [empNodeMap, setEmpNodeMapping] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [searchEquipmet, setSearchEquipmet] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [equipmentResults, setEquipmentResults] = useState([]);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isSearchEquipment, issetSearchEquipmet] = useState(false);


  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = "http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/employee";
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
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = "http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/nodeMaster";
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setNodeData(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = "http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/shift";
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        setShiftdata(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = "http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/employeeNodeMapping";
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setEmpNodeMapping(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = "http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/nodeTypes";
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        setNodeTypeData(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // const [Employeesdata, setEmployees] = useState()
  const [droppedData, setDroppedData] = useState();
  // const dragStarted = (e, empId, empName) => {
  //   e.dataTransfer.setData("empId",empId)
  //   e.dataTransfer.setData("empName", empName)
  //   console.log( empId,empName);
  // }

  const [selectedItems, setSelectedItems] = useState([]);

  const dragStarted = (e, empId, empName) => {
    const selectedItem = { empId, empName };
    setSelectedItems([...selectedItems, selectedItem]);
    console.log(selectedItems);
  };

  const draggingOver = (event) => {
    event.preventDefault();
    console.log("Dragging Over now");
  };

  const [PopupEmp, setEmpPopup] = useState(false);
  // const dragDropped = (event,nodeId) => {
  //   event.preventDefault(); // Allows the drop
  //   let dataTransferedData = event.dataTransfer.getData('empId'); // Use the same data type as set in dragStarted
  //   let dataTransfered = event.dataTransfer.getData('empName'); // Use the same data type as set in dragStarted
  //   setDroppedData({ empId: dataTransferedData, empName: dataTransfered,nodeId: nodeId })
  //   // Show the popup after setting the dropped data
  //   setEmpPopup(true)
  // }

  const dragDropped = (event, nodeId, nodeName, branchId) => {
    event.preventDefault(); // Allows the drop
    selectedItems.forEach((selectedItem) => {
      const { empId, empName } = selectedItem;
      const existingData = droppedData || [];
      const newData = [...existingData, { empId, empName, nodeId, nodeName, branchId }];

      // Check if the combination of empId and nodeId exists in empNodeMap
      const existsInEmpNodeMap = empNodeMap.some((item) => item.emp.empId === empId && item.node.nodeId === nodeId);

      if (!existsInEmpNodeMap) {
        setDroppedData(newData);
        const selectedData = [];
        empNodeMap.forEach((item, index) => {
          selectedData[index] = selects?.length > index ? selects[index] === "Yes" ? "Yes" : "No" : "No";
        })
        selectedData[empNodeMap?.length] = "No";
        setSelects(selectedData);
      } else {
        // Show a warning alert message
        toast.warning(<span><strong>Aww No!</strong> {empName} already Assigned to Employee node map.</span>);
      }

      // console.log(newData);
    });


    // Show the popup after setting the dropped data
    setEmpPopup(true);
    // Clear the selected items
    setSelectedItems([]);
  };

  const [shift, setShift] = useState(""); // State for the selected Shift
  const [nodeType, setNodeType] = useState(""); // State for the selected Shift
  const [startDate, setStartDate] = useState(getFormattedToday()); // State for the Start Date

  const handleShiftChange = (e) => {
    setShift(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleNodeType = (e) => {
    setNodeType(e.target.value);
  };

  // Function to get today's date in the format 'YYYY-MM-DD'
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }

  // const [showToast, setShowToast] = useState(false)
  const handleNewRowSubmit = (event) => {
    event.preventDefault()
    // console.log(droppedData)
    console.log(selects, selects.length);
    if (!droppedData || droppedData.length === 0) {
      console.log("No data to save.");
      toast.warning(<p><strong>Warning</strong> Please Assigned to Employee node map.</p>);

      return; // Exit the function
    }
    const drop = {
      employeeNodeMapping: droppedData.map((item, index) => (
        {
          emp: item.empId,
          node: item.nodeId,
          // shift: "1", 
          branchId: item.branchId,
          isActive: true,
          date: '2023-09-30 13:19:56.6000000',
          userId: "1111",
          nodeType: "Machine",
          default: selects[index]?.toString() ? selects[index].toString() : "No",
          primary: keys.toString()
        }
      ))
    };
    console.log(drop)
    axios
      .put("http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/employeeNodeMapping/bulk", drop)
      .then((response) => {
        console.log("New row added successfully", response.data);
        setData([...data, response.data]);
        toast.success(<p><strong>successfully</strong> Added Employee node map.</p>);
        setDroppedData(false);
        const apiUrl = "http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/employeeNodeMapping";
        axios
          .get(apiUrl)
          .then((response) => {
            console.log(response.data);
            setEmpNodeMapping(response.data);
          })
        // setShowToast(true); // Display the toast
        // // Automatically hide the toast after 3 seconds
        // setTimeout(() => {
        //   setShowToast(false);
        // }, 1000);
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
      });
  };

  // Delete the table row

  const handleDeleteEmployeeMap = (empnodemapId) => {

    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(`http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/employeeNodeMapping/${empnodemapId}`)
        .then((response) => {
          console.log("Node deleted successfully", response.data);
          // After successful deletion, update the empNodeMap state by filtering out the deleted item
          setEmpNodeMapping((prevEmpNodeMap) => {
            return prevEmpNodeMap.filter((item) => item.empnodemapId !== empnodemapId);
          });
          toast.error(<span><strong>Deleted</strong> successfully.</span>);
          const selectedDefault = [...selects];
          empNodeMap.forEach((item, index) => {
            selectedDefault[index] = item.empnodemapId === empnodemapId ? "No" : selectedDefault[index];
          });
          setSelects(selectedDefault);
        })
        .catch((error) => {
          console.error("Error deleting node:", error);
        });
    }
    else {

    }
  };

  // Update the row -----------

  const [editedIndex, setEditedIndex] = useState(null);

  const handleEdit = (index) => {
    setEditedIndex(index);
  };

  const removeEdit = (index) => {
    setEditedIndex(null)
  }

  const handleSave = (event) => {
    event.preventDefault()
    // Make an API request to save the edited data here
    // Assuming you have an API endpoint to update the data
    const editedItem = empNodeMap[editedIndex];
    console.log(editedItem)
    // console.log(droppedData)
    if (!editedItem || editedItem.length === 0) {
      console.log("No data to save.");
      // toast.warning(<p><strong>Warning</strong> Please Assigned to Employee node map.</p>);

      return; // Exit the function
    }
    const edite = {
      empnodemapId: editedItem.empnodemapId,
      emp: editedItem.emp.empId,
      node: editedItem.node.nodeId.toString(),
      // shift: editedItem.shift.shiftId.toString(),
      branchId: editedItem.branchId,
      isActive: true,
      date: editedItem.date,
      userId: "1111",
      nodeType: editedItem.nodeType,
      default: editedItem.default.toString(),
      primary: editedItem.primary.toString()
    }
    console.log(edite, "edite")
    // console.log(editedItem,"editedItem")

    // Update the edited item with the new values
    // You can use axios.put or a similar method to send the data to your API
    axios.put(`http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/employeeNodeMapping/${editedItem.empnodemapId}`, edite)
      .then((response) => {
        console.log('Data saved successfully', response.data);
        setEditedIndex(null);
        toast.success(<span><strong>successfully</strong> Updated.</span>);

        // getEmpNameById()
        // getNodeNameById()
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };


  function getNodeNameById(nodeId) {
    const node = Nodedata.find((item) => item.nodeId === parseInt(nodeId));
    return node ? node.nodeName : 'Node Not Found';
  }

  function getEmpNameById(empId) {
    const emp = data.find((item) => item.empId == empId);
    return emp ? emp.employeeName : 'Node Not Found';
  }

  // Ramesh changes for filter & search
  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    const filteredData = data.filter((item) => {
      const name = item.employeeName.toLowerCase()
      return name.includes(searchValue.toLowerCase());
    });
    setFilteredResults(filteredData);
  }

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput('')

  };

  const searchequipmet = (searchValue) => {
    setSearchEquipmet(searchValue)
    const filteredData = Nodedata.filter((item) => {
      const name = item.nodeName.toLowerCase()
      return name.includes(searchValue.toLowerCase());
    });
    setEquipmentResults(filteredData);
  }

  const toggleSearchEquipment = () => {
    issetSearchEquipmet(!isSearchEquipment);
    setSearchEquipmet('')

  };

  // end search &filter 

  const [selects, setSelects] = useState(["No"]); // Maintain an array for select values
  const [keys, setKeys] = useState(["Secondary"]); // Maintain an array for key values

  // const handleDefaultChange = (event, index) => {
  //   const updatedSelects = [...selects];
  //   updatedSelects[index] = event.target.value;
  //   setSelects(updatedSelects);
  // };

  // const handleKeyChange = (event, index) => {
  //   const updatedKeys = [...keys];
  //   updatedKeys[index] = event.target.value;
  //   setKeys(updatedKeys);
  // };

  // console.log(key)

  const handleDefaultChange = (event, index) => {
    const updatedSelects = [...selects]; // Create a copy of the selects array
    console.log(updatedSelects)
    updatedSelects[index] = event.target.checked ? "Yes" : "No"; // Update the value based on the checkbox state
    setSelects(updatedSelects); // Update the selects state variable
  };
  console.log(selects)

  const handleKeyChange = (event, index) => {
    const updatedSelects = [...keys]; // Create a copy of the selects array
    updatedSelects[index] = event.target.checked ? "Primary" : "Secondary"; // Update the value based on the checkbox state
    setKeys(updatedSelects); // Update the selects state variable
  };
  console.log(keys)


  return (
    <div style={{ display: "flex" }} >
      <div
        style={{
          width: sidebarCollapsed ? "95%" : "0%",
          transition: "width 0.1s",
          zIndex: 2,
          overflow: "hidden",
        }}
      ></div>
      <div
        className="container-fluid"
        style={{ width: "100%", height: "100%" }}
      >
        <div className="row p-2 d-flex flex-row justify-content-center">
          <div className="col-6">
            <h6 style={{ textAlign: 'center', fontWeight: 'revert-layer' }}>Operators List</h6>
          </div>
          <div className="col-6">
            <h6 style={{ textAlign: 'center', fontWeight: 'revert-layer' }}>Equipments</h6>
          </div>
          <div className="col-6" style={{ height: '170px', overflowY: 'auto' }}>
            <table className="table table-bordered table-striped">
              <thead class="sticky-top">
                <tr>
                  <th>Employee ID  </th>
                  <th style={{ width: '65%' }}>
                    Employee Name  {isSearchVisible ? (

                      <div className="search-input-container" style={{ position: 'absolute', top: '0px', backgroundColor: 'white' }}>
                        <TextField
                          type="text"
                          variant="outlined"
                          value={searchInput}
                          size="small"
                          style={{ width: '', fontSize: '10px' }}
                          placeholder="search employee"
                          onChange={(e) => searchItems(e.target.value)}

                        />
                        <span className="clear-button" style={{ position: 'absolute' }} onClick={toggleSearch}>
                          <FaXmark />
                        </span>

                      </div>) : (
                      <span className="search-icon-button" style={{ marginLeft: "10px" }}>
                        <FaSistrix onClick={toggleSearch} />
                      </span>)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchInput.length > 0 ? (
                  filteredResults.map((item, index) => (
                    <tr
                      draggable
                      onDragStart={(e) =>
                        dragStarted(e, item.empId, item.employeeName)
                      }
                    >
                      <td>{item.empId}</td>
                      <td>{item.employeeName}</td>
                    </tr>
                  )))
                  : (data.map((item, index) => (
                    <tr
                      draggable
                      onDragStart={(e) =>
                        dragStarted(e, item.empId, item.employeeName)
                      }
                    >
                      <td>{item.empId}</td>
                      <td>{item.employeeName}</td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>
          <div className="col-6" style={{ height: '170px', overflowY: 'auto' }}>
            <table className="table table-bordered table-striped">
              <thead class="sticky-top">
                <tr>
                  <th>Equipment ID</th>
                  <th style={{ width: '65%' }}>
                    Equipment Name  {isSearchEquipment ? (

                      <div className="search-input-container" style={{ position: 'absolute', top: '0px', backgroundColor: 'white' }}>
                        <TextField
                          type="text"
                          variant="outlined"
                          value={searchEquipmet}
                          size="small"
                          style={{ fontSize: '10px', width: '180px' }}

                          placeholder="search equipment"
                          onChange={(e) => searchequipmet(e.target.value)}

                        />
                        <span className="clear-button" style={{ position: 'absolute' }} onClick={toggleSearchEquipment}>
                          <FaXmark />
                        </span>

                      </div>) : (
                      <span className="search-icon-button" style={{ marginLeft: "30px" }}>
                        <FaSistrix onClick={toggleSearchEquipment} />
                      </span>)}
                  </th>
                  {/* <th style={{width:"90px"}}>Default</th>
                  <th>Key</th> */}
                </tr>
              </thead>
              <tbody>

                {searchEquipmet.length > 0 ? (
                  equipmentResults
                    .filter(item => item.nodeType === "Machine")
                    .map((item, index) => (
                      <tr
                        key={item.nodeId}
                        onDragOver={(e) => draggingOver(e)}
                        onDrop={(e) => dragDropped(e, item.nodeId, item.nodeName, item.branchId,)}
                      >
                        <td>{item.nodeId}</td>
                        <td>{item.nodeName}</td>
                      </tr>
                    )))
                  : (Nodedata
                    .filter(item => item.nodeType === "Machine")
                    .map((item, index) => (
                      <tr
                        key={item.nodeId}
                        onDragOver={(e) => draggingOver(e)}
                        onDrop={(e) => dragDropped(e, item.nodeId, item.nodeName, item.branchId,)}
                      >
                        <td>{item.nodeId}</td>
                        <td>{item.nodeName}</td>
                      </tr>
                    )))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row p-2 d-flex flex-row justify-content-center">
          <h6 style={{ captionSide: 'top', textAlign: 'center' }}>Employee Node Mapping</h6>
          <div className="col-12 justofy-content-center">
            <div style={{ height: '170px', overflowY: 'auto' }} >
              <table className="table table-striped table-bordered">
                <thead class="sticky-top">
                  <tr>
                    <th>id</th>
                    {/* <th>BranchId</th> */}
                    <th>Equipment ID</th>
                    <th>Equipment Name</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Default</th>
                    <th>Primary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {empNodeMap.map((item, index) => (
                    <tr key={index}>
                      <td>{item.empnodemapId}</td>
                      {/* <td>{item.branchId}</td> */}
                      <td style={{ textAlign: 'left' }}>
                        {editedIndex === index ? (
                          <select
                            value={item.node.nodeId}
                            onChange={(e) => {
                              // Update the edited item with the new value
                              const newData = [...empNodeMap];
                              newData[index].node.nodeId = e.target.value;
                              setEmpNodeMapping(newData);
                              getNodeNameById(newData.nodeId)
                            }}
                            style={{ border: 'none', width: '60px', height: '25px', backgroundColor: 'whitesmoke' }}

                          >
                            <option>NodeId</option>
                            {Nodedata
                              .filter(item => item.nodeType === "Machine")
                              .map((item) => (
                                <option>{item.nodeId}</option>
                              ))}
                          </select>
                        ) : (
                          <div>
                            {item.node.nodeId}
                          </div>
                        )}
                      </td>
                      <td>{getNodeNameById(item.node.nodeId)}</td>
                      <td style={{ textAlign: 'left' }}>
                        {editedIndex === index ? (
                          <select
                            value={item.emp.empId}
                            onChange={(e) => {
                              // Update the edited item with the new value
                              const newData = [...empNodeMap];
                              newData[index].emp.empId = e.target.value;
                              setEmpNodeMapping(newData);
                            }}
                            style={{ border: 'none', width: '60px', height: '25px', backgroundColor: 'whitesmoke' }}

                          >
                            <option>Employee ID</option>
                            {data.map((item) => (
                              <option>{item.empId}</option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            {item.emp.empId}
                          </div>
                        )}
                      </td>
                      <td>{getEmpNameById(item.emp.empId)}</td>
                      <td style={{ textAlign: 'center' }}>
                        {editedIndex === index ? (
                          <input
                            type="checkbox"
                            checked={item.default}
                            onChange={(e) => {
                              // Update the edited item with the new value
                              const newData = [...empNodeMap];
                              newData[index].default = e.target.checked;
                              setEmpNodeMapping(newData);
                            }}
                            style={{ border: 'none', backgroundColor: 'whitesmoke' }}
                          />
                        ) : (
                          <div>
                            <input type="checkbox" checked={item.default === "Yes"} />
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {editedIndex === index ? (
                          <input
                            type="checkbox"
                            checked={item.primary}
                            onChange={(e) => {
                              // Update the edited item with the new value
                              const newData = [...empNodeMap];
                              newData[index].primary = e.target.checked;
                              setEmpNodeMapping(newData);
                            }}
                            style={{ border: 'none', backgroundColor: 'whitesmoke' }}
                          />
                        ) : (
                          <div>
                            <input type="checkbox" checked={item.primary === "Primary"} />
                          </div>
                        )}
                      </td>
                      <td>
                        {editedIndex === index ? (
                          <>
                            <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={removeEdit}><FaXmark /></button>
                          </>
                        ) : (
                          <button
                            style={{ border: "none", backgroundColor: 'transparent' }}
                            onClick={() => handleDeleteEmployeeMap(item.empnodemapId)}
                          >
                            <FaMinus />
                          </button>
                        )}
                        &nbsp;&nbsp;
                        {editedIndex === index ? (
                          <>
                            <Tooltip title="Delete" arrow style={{ border: 'none', backgroundColor: 'transparent' }} onClick={handleSave}><FaCheck /></Tooltip>
                          </>
                        ) : (
                          <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={() => handleEdit(index)}><FaEdit /></button>
                        )}
                      </td>

                    </tr>
                  ))}
                  {droppedData ? droppedData.map((item, index) => (
                    <tr key={index}>
                      <td></td>
                      {/* <td>{item.branchId}</td> */}
                      <td>{item.nodeId}</td>
                      <td>{item.nodeName}</td>
                      <td>{item.empId}</td>
                      <td>{item.empName}</td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          onChange={(e) => handleDefaultChange(e, index)}
                          checked={selects[index] === "Yes"}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          onChange={(e) => handleKeyChange(e, index)}
                          checked={keys[index] === "Primary"}
                        />
                      </td>
                      <td>
                        <button disabled style={{ border: "none", backgroundColor: 'transparent' }}>
                          <FaMinus />
                        </button>&nbsp;&nbsp;
                        <button disabled style={{ border: "none", backgroundColor: 'transparent' }}>
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  )) : ''}
                </tbody>
              </table>
            </div>
            <div className="p-1">
              <button className="btn btn-success" onClick={handleNewRowSubmit}>
                <FaCheck />
              </button>
              &nbsp;&nbsp;
              <button
                className="btn btn-danger"
                onClick={() => setDroppedData(false)}
              >
                <FaXmark />
              </button>
            </div>

          </div>
        </div>
        <br />
        <div>
          {/* Your component content */}
          {/* Include ToastContainer at the top level */}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Node;
