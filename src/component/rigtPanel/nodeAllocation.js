// AnotherComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaXmark, FaSistrix } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import "react-toastify/dist/ReactToastify.css";

import { BASE_URL } from "../../constants/apiConstants";
import { Backdrop, CircularProgress } from "@mui/material";

function NodeAllocation() {
  const onDragStart = (event, job) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(job));
    event.dataTransfer.effectAllowed = "move";
  };
 const [OpenLoader,setOpenLoader] = useState(false)
  const [data, setData] = useState([]);
  const [Employee, setEmployeeData] = useState([]);
  const [shiftdata, setShiftdata] = useState([]);
  const [NodeAllocation, setNodeAllocation] = useState([]);
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState([]);
  const [droppedData, setDroppedData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [updatedfilterEmployeeData, setFilteredEmployeeData] = useState([]); //ramesh changes

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/attendance`;
    axios
      .get(apiUrl)
      .then((response) => {
//         console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/employee`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/shift`;
    axios
      .get(apiUrl)
      .then((response) => {
        setShiftdata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    setOpenLoader(true)
    let updated = data.filter(
      (item) =>
        !NodeAllocation.some(
          (secondItem) =>
            item.empId === secondItem.empId &&
            item.shiftId === secondItem.shiftNumber
        )
    );

    if (Array.isArray(droppedData)) {
      updated = [
        ...updated.filter(
          (item) =>
            !droppedData.some(
              (secondItem) =>
                item.empId === secondItem.empId &&
                item.shiftId === secondItem.shiftId
            )
        ),
      ];
      setUpdatedEmployeeData(updated);
      setOpenLoader(false);
    } else {
      console.error("droppedData is not an array.");
    }
  }, [NodeAllocation, droppedData]);

  // Ramesh updated attendance data for with filter & search
  useEffect(() => {
    let updated = filteredResults.filter(
      (item) =>
        !NodeAllocation.some(
          (secondItem) =>
            item.empId === secondItem.empId &&
            item.shiftId === secondItem.shiftNumber
        )
    );
    updated = [
      ...updated.filter(
        (item) =>
          !droppedData.some(
            (secondItem) =>
              item.empId === secondItem.empId &&
              item.shiftId === secondItem.shiftId
          )
      ),
    ];
    setFilteredEmployeeData(updated);
  }, [NodeAllocation, droppedData, filteredResults]);

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
  // const formattedTime = '20:01:00'

//   console.log(formattedTime);
  // console.log(formattedTime);

  const shiftST = shiftdata.map((item) => item.startTime);
  const shiftET = shiftdata.map((item) => item.endTime);

  function getShiftTime() {
    if (formattedTime >= shiftST[0] && shiftET[0] >= formattedTime) {
      const firstShift = shiftdata.map((item) => item.shiftNumber);
//       console.log(firstShift);
      // setShiftId(firstShift[0]); // Update the shiftId state
      return firstShift[0];
    } else {
      const SecondShift = shiftdata.map((item) => item.shiftNumber);
      console.log(SecondShift[1]);
      // setShiftId(SecondShift[1]); // Update the shiftId state
      return SecondShift[1];
    }
  }
  getShiftTime();
//   console.log(getShiftTime(), "getshifttime");

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeAllocation`;
    axios
      .get(apiUrl)
      .then((response) => {
//         console.log(response.data);
        setNodeAllocation(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const initializeStartDateArray = (length) => {
    return Array(length).fill(getFormattedToday());
  };
  const [startDate, setStartDate] = useState(
    initializeStartDateArray(droppedData ? droppedData.length : 0)
  ); // State for the Start Date

  // Function to get today's date in the format 'YYYY-MM-DD'
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }
  // Ramesh changes on filter & search
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredEmpIds = Employee.filter((item) =>
      item.employeeName.toLowerCase().includes(searchValue.toLowerCase())
    ).map((item) => String(item.empId));
    // const attendance = data
    //   .filter(item => item.empId == String(filteredEmpIds)&&item.allocated === "No" )
    const attendance = data.filter((item) => {
      return filteredEmpIds.includes(String(item.empId));
    });
    setFilteredResults(attendance);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput("");
  };
  // end ramesh filter & search
  function getEmpNameById(empId) {
    const emp = Employee.find((item) => item.empId == empId);
    return emp ? emp.employeeName : "Node Not Found";
  }

  return (
    <aside>
      <div className="employee-list-container">
        <table className="table table-bordered table-striped">
          <thead class="sticky-top">
            <tr>
              {/* <th>Attendance ID</th> */}
              <th style={{ width: "30%",fontSize: "11px" }}>Employee ID</th>
              <th style={{fontSize: "11px"}}>
                Employee Name
                {isSearchVisible ? (
                  <div
                    className="search-input-container"
                    style={{
                      position: "absolute",
                      top: "0px",
                      backgroundColor: "white",
                    }}
                  >
                    <TextField
                      type="text"
                      variant="outlined"
                      value={searchInput}
                      size="small"
                      style={{ width: "170px", fontSize: "12px" }}
                      placeholder="Search Employee"
                      onChange={(e) => searchItems(e.target.value)}
                    />
                    <span className="clear-button" onClick={toggleSearch}>
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
            </tr>
          </thead>

          <tbody>
            {searchInput.length > 0
              ? // filteredResults

                updatedfilterEmployeeData // Ramesh changes for filter & search
                  .filter((item) => item.allocated === "No")

                  .map((item, index) => (
                    <tr
                      draggable
                      onDragStart={(event) => onDragStart(event, item)}
                    >
                      <td style={{ textAlign: "center" }}>{item.empId}</td>
                      <td>{getEmpNameById(item.empId)}</td>
                    </tr>
                  ))
              : updatedEmployeeData
                  .filter((item) => item.allocated === "No")
                  .map((item, index) => (
                    <tr
                      onDragStart={(event) => onDragStart(event, item)}
                      draggable
                    >
                      <td style={{ textAlign: "center" }}>{item.empId}</td>
                      <td>{getEmpNameById(item.empId)}</td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
      {OpenLoader && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={OpenLoader}
        >
          <CircularProgress size={80} color="inherit" />
        </Backdrop>
        )}
    </aside>
  );
}

export default NodeAllocation;
