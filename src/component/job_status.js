import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaXmark, FaSistrix } from "react-icons/fa6";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
import { Backdrop, CircularProgress } from "@mui/material";

const JobStatus = () => {
  const { auth } = useContext(AuthContext)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [OpenLoader, setOpenLoader] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState);
    console.log(sidebarCollapsed);
  };

  const [OA_details, setOA_details] = useState([]);
  const [itemmaster, setitemmaster] = useState([]);
  const [batchmaster, setbatchmaster] = useState([]);
  const [nodemaster, setnodemaster] = useState([]);
  const [OA_detailsByID, setOA_detailsByID] = useState([]);
  const [jobAssignData, setJobAssignData] = useState([]);
  const [jobId, setjobId] = useState();

  // Fetching OA Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/OA_DETRoute`;
    axios
      .get(apiUrl)
      .then((response) => {
        setOA_details(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // jobassign--------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = " http://localhost:5000/api/jobassign";
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        const data = response.data?.map((item, index) => ({ ...item, index: index }));
        setJobAssignData(data);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Itemmaster Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/itemmaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setitemmaster(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching nodemaster Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setnodemaster(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching batchmaster Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    setOpenLoader(true)
    const apiUrl = `${BASE_URL}/api/batchMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setbatchmaster(response.data);
        setOpenLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching OA Details by Id ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    if (jobId) {
      const apiUrl = `${BASE_URL}/api/OA_DETRoute/${jobId}`;
      axios
        .get(apiUrl)
        .then((response) => {
          setOA_detailsByID(response.data);
          // console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [jobId]);

  function handlejobdetails(jobId, index) {
    setjobId(jobId);
  }

  function getItem_description(it_code) {
    const getIt_code = itemmaster
      .filter((item) => item.IT_CODE == it_code)
      .map((item) => item.IT_NAME);
    return getIt_code;
  }

  function getNodeName(nodeId) {
    const getIt_code = nodemaster
      .filter((item) => item.nodeId == nodeId)
      .map((item) => item.nodeName);
    return getIt_code;
  }

  const getJobStatus = (jobId) => {
    const status = OA_details.filter((item) => item?.jobId === jobId)[0];
    // console.log(status);
    return status?.Status;
  }

  const getTotalQuantities = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const nodeId = item.nodeId;
      if (!groupedData[nodeId]) {
        groupedData[nodeId] = { ...item, totalProduced: item.producedQty, totalBalance: item?.balanceQty };
      } else {
        groupedData[nodeId].totalProduced += item.producedQty;
        groupedData[nodeId].totalBalance += item.balanceQty;
      }
    });
    const result = Object.values(groupedData);
    return result;
  };

  function getActivityId(jobId) {
    const getIt_code = batchmaster
      .filter((item) => item.producedJobId == jobId)
      .map((item) => ({
        activityId: item.activityId,
        materialId: item.materialId,
        nodeId: item.nodeId,
        targetQty: item.targetQty,
        totalProducedQty: item.totalProducedQty,
        outstandingQty: item.outstandingQty,
        balanceQty: item.balanceQty1,
        producedQty: item.producedQty1,
      }))
      .filter((item) => {
        // Exclude items where targetQty, totalProducedQty, and outstandingQty are null, undefined, or empty
        return (
          item.targetQty !== null &&
          item.totalProducedQty !== null &&
          item.outstandingQty !== null &&
          item.targetQty !== undefined &&
          item.totalProducedQty !== undefined &&
          item.outstandingQty !== undefined &&
          item.targetQty !== '' &&
          item.totalProducedQty !== '' &&
          item.outstandingQty !== ''
        );
      });
    // console.log(getIt_code);
    const result = getTotalQuantities(getIt_code);
    return result;
  }

  function jobs() {
    const getjobs = OA_details.map(item => item.jobId)
    return getjobs
  }

  const [selectedStatus, setselectedStatus] = useState()

  const handleMenuClick = (status) => {
    setselectedStatus(status, "status")
    // Handle menu item click (e.g., perform actions based on the selected status)
    console.log(`Selected status: ${status}`);
    const filtereddata = OA_details.filter(item => item.Status == status)
      .map(item => item.jobId)
    console.log(filtereddata);
    return filtereddata
  };

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const handleMenuClickForJobId = (jobId) => {
    // Handle menu item click (e.g., perform actions based on the selected status)
    setSelectedJobId(jobId)
    console.log(`Selected status: ${jobId}`);
    const filtereddata = OA_details.filter(item => item.jobId == jobId)
      .map(item => item.jobId)
    console.log(filtereddata);
    return filtereddata
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput('')
  };

  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    const filteredData = OA_details.filter((item) => {
      const name = String(item.IT_NAME).toLowerCase()
      const jobId = String(item.jobId).toLowerCase()
      return jobId.includes(searchValue.toLowerCase()) || name.includes(searchValue.toLowerCase());

    });
    setFilteredResults(filteredData);
  }

  const getOutstandingQty = (target, totalProd) => {
    return (target * 1.08) - totalProd;
  };

  const [selectedRow, setSelectedRow] = useState(null);

  const handleColor = (index) => {
    setSelectedRow(index);
  };

  return (
    <div style={{ display: "flex" }}>
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
        <div className="col-12 pt-2" style={{ textAlign: "center" }}>
          <h5>Job Status</h5>
        </div>
        <div
          className="col-12"
          style={{ height: "191px", overflowY: "auto" }}
        >
          <table className={"table table-bordered table-striped"}>
            {/* className="table table-bordered table-striped" */}
            <thead class="sticky-top">
              <tr>
                <th style={{fontSize: "11px",display:'flex'}}>Job ID
                  {isSearchVisible ? (
                    <div className="search-input-container" style={{ position: 'absolute', top: '0px', left: '0px', backgroundColor: 'white',display:'flex'}}>
                      <TextField
                        type="text"
                        variant="outlined"
                        value={searchInput}
                        size="small"
                        style={{ width: '100px', fontSize: '10px' }}
                        placeholder="search JobId"
                        onChange={(e) => searchItems(e.target.value)}

                      ></TextField>
                      <span className="clear-button" onClick={toggleSearch}>
                        <FaXmark />
                      </span>

                    </div>) : (
                    <span className="search-icon-button" style={{ marginLeft: "10px" }}>
                      <FaSistrix onClick={toggleSearch} className="mt-1"/>
                    </span>)}
                </th>
                <th>Item Description</th>
                <th>IT CODE</th>
                <th>Job Qty (m)</th>
                <th>Perimeter</th>
                <th>Target Qty (m)</th>
                <th>Delivery Date</th>
                {/* <th style={{cursor:'pointer'}}>Status<IoMdArrowDropdown onClick={opendropdown}/></th> */}
                <th style={{fontSize: "11px"}}>
                  <Dropdown >Status
                    <Dropdown.Toggle variant="white" size="sm" style={{ border: 'none' }} id="dropdown-basic">

                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <Dropdown.Item onClick={() => handleMenuClick('')}>Select All</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleMenuClick('Received')}>Received</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleMenuClick('Assigned')}>Assigned</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleMenuClick('In Progress')}>In-Progress</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </th>
              </tr>
            </thead>
            <tbody style={{ cursor: "pointer" }}>

              {searchInput.length > 0 ? (
                filteredResults.map((item, index) => (
                  <tr key={index}>
                    <td onClick={() => handlejobdetails(item.jobId, index)}>
                      {item.jobId}
                    </td>
                    <td
                      style={{ width: '20%' }}
                      onClick={() => handlejobdetails(item.jobId, index)}>
                      {getItem_description(item.IT_CODE)}
                    </td>
                    <td onClick={() => handlejobdetails(item.jobId, index)}>
                      {item.IT_CODE}
                    </td>
                    <td
                      style={{ textAlign: 'right' }}
                      onClick={() => handlejobdetails(item.jobId, index)}>
                      {item.ALT_QTY}
                    </td>
                    <td onClick={() => handlejobdetails(item.jobId, index)}>
                      {item.Film_Type}
                    </td>
                    <td
                      style={{ textAlign: 'right' }}
                      onClick={() => handlejobdetails(item.jobId, index)}>
                      {item.TargetQty}
                    </td>
                    <td onClick={() => handlejobdetails(item.jobId, index)}>
                      {item?.Delivery_Date ? new Date(item.Delivery_Date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) : ""}
                    </td>
                    <td onClick={() => handlejobdetails(item.jobId, index)}>
                      {getJobStatus(item.jobId)}
                    </td>
                  </tr>
                )))
                : (
                  selectedStatus ? (
                    OA_details
                      .filter(item => item.Status === selectedStatus)
                      .map((item, index) => (
                        <tr key={index}>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.jobId}
                          </td>
                          <td
                            style={{ width: '20%' }}
                            onClick={() => handlejobdetails(item.jobId, index)}>
                            {getItem_description(item.IT_CODE)}
                          </td>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.IT_CODE}
                          </td>
                          <td
                            style={{ textAlign: 'right' }}
                            onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.ALT_QTY}
                          </td>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.Film_Type}
                          </td>
                          <td
                            style={{ textAlign: 'right' }}
                            onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.TargetQty}
                          </td>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {item?.Delivery_Date ? new Date(item.Delivery_Date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) : ""}
                          </td>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {getJobStatus(item.jobId)}
                          </td>
                        </tr>
                      )))
                    :
                    OA_details
                      // .filter(item => item.Status === selectedStatus)
                      .map((item, index) => (
                        <tr
                          key={index}
                          onClick={() => handleColor(index)}
                          className={`${selectedRow === index ? "lightgreen" : ''}`}
                        // style={{ backgroundColor: selectedRow === index ? "lightgreen" : '' }}
                        // className={selectedRow === index ? "bg-lightgreen" : ""}
                        >
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.jobId}
                          </td>
                          <td
                            style={{ width: '20%' }}
                            onClick={() => handlejobdetails(item.jobId, index)}>
                            {getItem_description(item.IT_CODE)}
                          </td>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.IT_CODE}
                          </td>
                          <td
                            style={{ textAlign: 'right' }}
                            onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.ALT_QTY}
                          </td>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.Film_Type}
                          </td>
                          <td
                            style={{ textAlign: 'right' }}
                            onClick={() => handlejobdetails(item.jobId, index)}>
                            {item.TargetQty}
                          </td>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {item?.Delivery_Date ? new Date(item.Delivery_Date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) : ""}
                          </td>
                          <td onClick={() => handlejobdetails(item.jobId, index)}>
                            {getJobStatus(item.jobId)}
                          </td>
                        </tr>
                      ))
                )}

            </tbody>
          </table>
        </div>
        <br />
        <div className="col-12" style={{ textAlign: "center" }}>
          <h5>Job Details</h5>
        </div>
        <div
          className="col-12"
          style={{ height: "163px", overflowY: "auto" }}
        >
          <table className="table table-bordered table-striped">
            <thead class="sticky-top">
              <tr>
                {/* <th style={{width:'10%'}}>Activity ID</th> */}
                <th style={{ width: '17.5%' }}>Material Name</th>
                {/* <th>Item Description</th> */}
                {/* <th style={{width:'8%'}}>Job Quantity</th> */}
                <th style={{ width: '13.4%' }}>Target Qty (m)</th>
                <th style={{ width: '20%' }}>Total Produced Qty (m)</th>
                <th style={{ width: '20.3%' }}>Outstanding Qty (m)</th>
                <th style={{ width: '14.5%' }}>Balance Qty (m)</th>
                {/* <th style={{width:'10%'}}>Item Type</th> */}
              </tr>
            </thead>
            <tbody>
              {getActivityId(OA_detailsByID?.jobId).map(item =>
                <tr>
                  {/* <td>{item.activityId}</td> */}
                  <td>{getNodeName(item.nodeId)}</td>
                  <td style={{ textAlign: 'right' }}>{item.targetQty}</td>
                  <td style={{ textAlign: 'right' }}>{item.totalProduced}</td>
                  <td style={{ textAlign: 'right' }}>{getOutstandingQty(item.targetQty, item.totalProduced)}</td>
                  <td style={{ textAlign: 'right' }}>{item.totalBalance}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
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
  );
};
export default JobStatus;
