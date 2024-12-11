import "./rightpanel.css";
import React from "react";
import { useState, useEffect } from "react";
import {
  getActivities,
  getItemmaster,
  getOADetails,
} from "../../api/shovelDetails";
import { TextField } from "@mui/material";
import { FaSistrix, FaXmark } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";

const AssignedJobs = ({ JobAssigndata, SendSidetoBottomPanel, getNodeId }) => {
  const [Oadetails, setOadetails] = useState([]);
  const [Itemmaster, setItemmaster] = useState([]);
  const [ActivityLogData, setActivityLogData] = useState([]);

  console.log(getNodeId,"hello")
  const showOA_details = async (key) => {
    const responsedata = await getOADetails();
    setOadetails(responsedata, key);
  };

  const showItemMaster = async (key) => {
    const responsedata = await getItemmaster();
    setItemmaster(responsedata, key);
  };
  const showActivityLogdata = async (key) => {
    const responsedata = await getActivities();
    setActivityLogData(responsedata, key);
  };

  useEffect(() => {
    showOA_details();
    showItemMaster();
    showActivityLogdata();
  }, []);

  function getJobNameById(jobId) {
    const job = Oadetails.find((item) => item.jobId == jobId);
    return job ? job.IT_NAME : "Node Not Found";
  }

  function formatIndianDate(dateString) {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    const indianDateFormat = "en-IN"; // Use 'en-IN' for Indian English locale

    // Convert the input date string to a JavaScript Date object
    const dateObject = new Date(dateString);

    // Format the date using toLocaleDateString with the Indian locale
    return dateObject.toLocaleDateString(indianDateFormat, options);
  }

  const handleJobIdpass = (jobId) => {
    SendSidetoBottomPanel(jobId,getNodeId);
  };

  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredDateResults, setFilteredDateResults] = useState([]);
  const [isDateVisible, setDateVisible] = useState(false);
  const [DateInput, setDateInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);


  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    const filteredData = ActivityLogData.filter((item) => {
      const jobid = String(item.jobId); // Convert to string
      return jobid.includes(searchValue);
    });
    setFilteredResults(filteredData);
  }

  const searchDateItems = (searchValue) => {
    setDateInput(searchValue)
    const filteredData = ActivityLogData.filter((item) => {
      const jobid = item.date; // Convert to string
      return jobid.includes(searchValue);
    });
    setFilteredDateResults(filteredData);
  }

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput('')
  };
  const toggleSearchDate = () => {
    setDateVisible(!isDateVisible);
    setDateInput('')
  };

  const [selectedRow, setSelectedRow] = useState(null);

    const handleColor = (index,jobId) => {
        setSelectedRow(index);
        handleJobIdpass(jobId)
    };
  
  return (
    <aside>
      <div className="employee-list-container">
        <table className="table table-bordered table-striped p-0">
          <thead className="sticky-top">
            <tr>
              <th style={{ fontSize: "11px", width: "90px",height:'40px' }}>
                Job
                {isSearchVisible ? (
                  <div
                    className="search-input-container"
                    style={{
                      position: "absolute",
                      top: "0px",
                      left: "0px",
                      backgroundColor: "white",
                    }}
                  >
                    <TextField
                      type="text"
                      variant="outlined"
                      value={searchInput}
                      size="small"
                      style={{ width: "80px"}}
                      placeholder="search JobId"
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
                    <FaSistrix onClick={toggleSearch} />
                  </span>
                )}
              </th>
              <th style={{ fontSize: "11px" }}>Job Description</th>
              <th style={{ fontSize: "11px", width: "100px" }}>
                Assigned
                {isDateVisible ? (
                <div
                    className="search-input-container"
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <TextField
                      type="date"
                      variant="outlined"
                      value={DateInput}
                      size="small"
                      style={{ width: "90px"}}
                      placeholder="search JobId"
                      onChange={(e) => searchDateItems(e.target.value)}
                    />
                    <span
                      className="clear-button"
                      style={{ position: "absolute" }}
                      onClick={toggleSearchDate}
                    >
                      <FaXmark />
                    </span>
                </div>
                ):(
                  <span
                    className="search-icon-button"
                    style={{ marginLeft: "10px" }}
                  >
                    <CiCalendarDate onClick={toggleSearchDate} />
                  </span>
                )}
                </th>
            </tr>
          </thead>
          <tbody>
          {searchInput.length > 0 ? (
                    filteredResults.map((item, index) => (
                      <tr
                      onClick={() => handleColor(index,item.jobId)}
                      className={`${selectedRow === index ? "lightgreen" : ''}`}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{item.jobId}</td>
                        <td>
                          {getJobNameById(item.jobId)}
                        </td>
                        <td>
                          {formatIndianDate(item.date)}
                        </td>
                      </tr>
                    )))
                    : DateInput.length > 0 ? filteredDateResults.map((item, index) =>(
                      <tr
                        onClick={() => handleColor(index,item.jobId)}
                        className={`${selectedRow === index ? "lightgreen" : ''}`}
                        // onClick={() => handleJobIdpass(item.jobId)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{item.jobId}</td>
                        <td>
                          {getJobNameById(item.jobId)}
                        </td>
                        <td>
                          {formatIndianDate(item.date)}
                        </td>
                      </tr>
                    ))
                    :
                    (
                    ActivityLogData.filter(
                      (item) => item.nodeId === String(getNodeId)
                    ).map((item,index) => (
                      <tr
                        onClick={() => handleColor(index,item.jobId)}
                        className={`${selectedRow === index ? "lightgreen" : ''}`}
                        // className="dndnode input employee-list-item"
                        // onClick={() => }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{item.jobId}</td>
                        <td>
                          {getJobNameById(item.jobId)}
                        </td>
                        <td>
                          {formatIndianDate(item.date)}
                        </td>
                      </tr>
                    )))}
          </tbody>
        </table>
      </div>
    </aside>
  );
};

export default AssignedJobs;
