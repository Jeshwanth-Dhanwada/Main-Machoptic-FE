// export default AttendancePanel;
import React, { useState, useCallback, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaSistrix } from "react-icons/fa6";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { FaSave } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../constants/apiConstants";
import AuthContext from "../../context/AuthProvider";
import { Backdrop, CircularProgress } from "@mui/material";

function NodeState() {
  const {auth} = useContext(AuthContext)
  const [data, setData] = useState([]);
  const [AttendanceData, setAttendance] = useState([]);
  const [Shiftdata, setShiftData] = useState([]);
  const [empId, setEmpId] = useState([]);
  const [empNode, setEmpNode] = useState([]);
  const [defaultvalue, getEMPAllocation] = useState([]);
  // const [selectedEmployee, setSelectedEmployee] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchVisible, setSearchVisible] = useState(false);
 const [OpenLoader,setOpenLoader] = useState(false)

  useEffect(() => {
    // Fetch data from the API when the component mounts
    setOpenLoader(true)
    const apiUrl =
      `${BASE_URL}/api/employee`;
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        setOpenLoader(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    setOpenLoader(true)
    const apiUrl =
      `${BASE_URL}/api/employeeNodeMapping`;
    axios
      .get(apiUrl)
      .then((response) => {
        setEmpNode(response.data);
        setOpenLoader(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl =
      `${BASE_URL}/api/shift`;
    axios
      .get(apiUrl)
      .then((response) => {
        setShiftData(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Attnedance data ------------
  useEffect(() => {
    setOpenLoader(true)
    // Fetch data from the API when the component mounts
    const apiUrl =
      `${BASE_URL}/api/attendance`;
    axios
      .get(apiUrl)
      .then((response) => {
        setAttendance(response.data);
        setOpenLoader(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function getAttendancedata() {
    const apiUrl =
      `${BASE_URL}/api/attendance`;
    axios
      .get(apiUrl)
      .then((response) => {
        setAttendance(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [date, setdate] = useState(getFormattedToday());
  const [shiftId, setShiftId] = useState();

  // Function to get today's date in the format 'YYYY-MM-DD'
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update the current time every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  // const formattedTime = '18:01:00'

  // console.log(formattedTime);

  const shiftST = Shiftdata.map((item) => item.startTime);
  const shiftET = Shiftdata.map((item) => item.endTime);

  function getShiftNumber() {
    if (formattedTime >= shiftST[0] && shiftET[0] >= formattedTime) {
      const firstShift = Shiftdata.map((item) => item.shiftNumber);
      // setShiftId(firstShift[0]); // Update the shiftId state
      return firstShift[0];
    } else {
      const SecondShift = Shiftdata.map((item) => item.shiftNumber);
      // setShiftId(SecondShift[1]); // Update the shiftId state
      return SecondShift[1];
    }
  }
  getShiftNumber();

  const HandleDate = (event) => {
    setdate(event.target.value);
  };
  const HandleShiftID = (event) => {
    setShiftId(event.target.value);
  };

  const handleCheckboxChange = (empId) => {
    setEmpId(empId);
    // Find the selected employee based on empId
    // const selectedEmp = data.find((item) => item.empId === empId);
    // Update the selected employee state
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      if (prevSelectedCheckboxes.includes(empId)) {
        return prevSelectedCheckboxes.filter((id) => id !== empId);
      } else {
        return [...prevSelectedCheckboxes, empId];
      }
    });
    // setSelectedEmployee(selectedEmp);
  };

  let Attend = [];
  let X = 0;
  for (let i = 0; i < data.length; i++) {
    const empNodeVal = empNode.filter((item) => data[i].empId == item?.emp?.empId)
    Attend.push({
      ...data[i],
      ...empNodeVal[0]
    });
    Attend[i].date = date;
    // Attend[i].shiftId = 2;
    Attend[i].shiftId = getShiftNumber();
    Attend[i].attended = selectedCheckboxes;
    // const selectedEmployees = data.filter((item) => selectedCheckboxes.includes(item.empId));
    // console.log(Attend,"Attenddata")

    if (
      Attend[i].default === "Yes" &&
      selectedCheckboxes.some((val) => val === Attend[i].empId)
    ) {
      Attend[i].allocated = "Yes";
    } else {
      Attend[i].allocated = "No";
    }
  }

  const handleNewRowSubmit = (event) => {
    event.preventDefault();
    const checkedEmployees = [];
    for (let i = 0; i < Attend.length; i++) {
      const item = Attend[i];

      for (let j = 0; j < item.attended.length; j++) {
        if (parseInt(item.empId) === parseInt(item.attended[j])) {
          // console.log("Incoming")
          // If the condition is met, add this item to the 'checkedEmployees' array
          checkedEmployees.push({
            attendanceId: item.attendanceId,
            branchId: auth.branchId.toString(),
            empId: item.empId.toString(),
            date: date,
            allocated: item.allocated,
            default: item.default ? item.default : "No",
            shiftId: getShiftNumber(),
            userId: auth.empId.toString(),
          });
        }
      }
    }
    console.log(checkedEmployees,"checkedEmployees")
    // Check if there are any checked employees before sending the request
    if (checkedEmployees.length > 0) {
      const drop = {
        attendance: checkedEmployees,
      };
      const nodeallocation = {
        nodeAllocation: Attend.filter(
          (item) => item.allocated === "Yes" && item.default === "Yes"
        ).map((item) => ({
          empId: item.empId.toString(),
          nodeId: item.node.nodeId.toString(),
          shiftNumber: getShiftNumber(),
          branchId: auth.branchId.toString(),
          date: date,
          userId: auth.empId.toString(),
        })),
      };
      axios
        .put(
          `${BASE_URL}/api/attendance/bulk`,
          drop)
        .then((response) => {
          getAttendancedata();
          setSelectedCheckboxes([]);
          toast.success(
            <span>
              <strong>Successfully </strong>Attended.
            </span>,
            {
              position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
              className: "custom-toast", // Optional: Add custom CSS class
            }
          );
        })
        .catch((error) => {
          console.error("Error adding selected rows:", error);
        });

      axios
        .put(
          `${BASE_URL}/api/nodeAllocation/bulk`,nodeallocation)
        .then((response) => {
          console.log("Selected rows added successfully", response.data);
        })
        .catch((error) => {
          console.error("Error adding selected rows:", error);
        });
    }
    // window.location.reload();
  };

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);

    const filteredData = data.filter((item) => {
      const name = item.employeeName.toLowerCase();
      return name.includes(searchValue.toLowerCase());
    });

    setFilteredResults(filteredData);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput("");
  };

  // const [checkdata, setcheckdata] = useState([])
  function getEMPAllocationId(empId) {

    const enp = empNode.forEach((item) => {});
    return enp ? enp.default : "Node Not Found";
  }


  // Create an array to hold the new Attend data
  const newAttendData = [];
  // Iterate through the Attend data
  Attend.forEach((item) => {
    // Check if the empId is not present in the AttendanceData
    if (
      !AttendanceData.some(
        (dataItem) => parseInt(dataItem.empId) === parseInt(item.empId) && dataItem.shiftId == item.shiftId 
      )
    ) {
      // If it doesn't match, add it to the newAttendData
      newAttendData.push(item);
    }
  });
  return (
<aside>
<div className="row sticky-top">
          <div className="col-12">
            <form>
              <div className="container p-0">
                <div className="row">
                  <div className="col-5">
                    {/* Date : */}
                    <input
                      type="date"
                      onChange={HandleDate}
                      className="form-control"
                      name="date"
                      value={date}
                      min={getFormattedToday()}
                      max={getFormattedToday()}
                    />
                  </div>
                  <div className="col-3">
                    <label style={{fontSize:'13px'}}>Shift : {getShiftNumber()}</label>
                  </div>
                  <div className=" col-4">
                    <button
                      className="btn btn-sm"
                      // style={{ border: "none" }}
                      id="Facheck"
                      onClick={handleNewRowSubmit}
                    >
                      <FaCheck />
                    </button>
                    &nbsp;
                    <button className="btn btn-sm" id="FaXmark">
                      <FaXmark />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
  <div className="employee-list-container">
        <div className="row">
          <div className="col-12">
            <table
              className="table table-bordered table-striped"
              cellPadding={"10px"}
            >
              <thead className="sticky-top">
                <tr>
                  <th style={{fontSize:'11px'}}>ID</th>
                  {/* <th>Employee Name</th> */}
                  <th style={{ width: "200px",whiteSpace: "nowrap", position: "relative",fontSize:'11px' }}>
                    Employee Name
                    {isSearchVisible ? (
                      <div
                        className="search-input-container"
                        style={{
                          position: "absolute",
                          top: "-5px",
                          left: "0",
                          backgroundColor: "white",
                        }}
                      >
                        <TextField
                          type="text"
                          variant="outlined"
                          // value={NodesearchInput}
                          size="small"
                          style={{ width: "180px" }}
                          placeholder="Search Employee Name"
                          onChange={(e) => searchItems(e.target.value)}
                        />
                        <span
                          className="clear-button"
                          style={{ position: "absolute" }}
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
                        {/* <FaSistrix onClick={toggleSearch} /> */}
                      </span>
                    )}
                  </th>
                  <th style={{fontSize:'11px'}}>Desgination</th>
                  <th style={{fontSize:'11px'}}>Default</th>
                  {/* <th>Allocated</th> */}
                  <th style={{fontSize:'11px'}}>Attended</th>
                </tr>
              </thead>
              <tbody>
                {searchInput.length > 0
                  ? filteredResults.map((item, index) => (
                      <tr key={item.empId}>
                        <td>{item.empId}</td>
                        <td>{item.employeeName}</td>
                        <td>{item.designation}</td>
                        <td style={{ textAlign: "center",}}>
                          <Form.Check.Input
                            type="checkbox"
                            name="allocated"
                            // className="form-control"
                            id="allocated"
                            checked={getEMPAllocationId(item.empId)}
                          />
                        </td>
                        <td style={{ textAlign: "center", }}>
                          <Form.Check.Input
                            type="checkbox"
                            name="attendance"
                            // className="form-control"
                            id=""
                            onChange={() => handleCheckboxChange(item.empId)}
                          />
                        </td>
                      </tr>
                    ))
                  : newAttendData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.empId}</td>
                        <td>{item.employeeName}</td>
                        <td>{item.designation}</td>
                        <td style={{ textAlign: "center",}}>
                          {item.default || "No"}
                        </td>
                        {/* <td></td> */}
                        <td style={{ textAlign: "center",}}>
                          <Form.Check.Input
                            type="checkbox"
                            name="attendance"
                            // className="form-control"
                            id=""
                            style={{border:'1px solid black'}}
                            onChange={() => handleCheckboxChange(item.empId)}
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
        <ToastContainer />
        {OpenLoader && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={OpenLoader}
          // onClick={handleClose}
        >
          <CircularProgress size={80} color="inherit" />
        </Backdrop>
        )}
      </div>
</aside>
  );
}

export default NodeState;
