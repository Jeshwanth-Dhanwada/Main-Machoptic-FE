import React, { useEffect, useState } from "react";
import { getActivities, getJobAssign, getNodeMaster, getOADetails, getbatch_master } from "../api/shovelDetails";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FaSistrix, FaXmark } from "react-icons/fa6";
import { TextField } from "@mui/material";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function JobPrioritytabs({JobIdtoJobPriority,MultipleJobIdtoJobPriority}) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(MultipleJobIdtoJobPriority,"multipleJobs")
  const [JobAssigndata, setJobAssigndata] = useState([]);
  const [Activitydata, setActivitydata] = useState([]);
  const [Batchmasterdata, setBatchmasterdata] = useState([]);
  const [OA_DETdata, setOA_DETdata] = useState([]);
  const [Nodemasterdata, setNodemasterdata] = useState([]);

  const showJobAssignMapping = async (key) => {
    const responsedata = await getJobAssign();
    setJobAssigndata(responsedata, key);
  };

  const showActivitydata = async (key) => {
    const responsedata = await getActivities();
    setActivitydata(responsedata, key);
  };
  const showBatchmasterdata = async (key) => {
    const responsedata = await getbatch_master();
    setBatchmasterdata(responsedata, key);
  };

  const showsetOA_DETdata = async (key) => {
    const responsedata = await getOADetails();
    setOA_DETdata(responsedata, key);
  };
  const showNodemasterdata = async (key) => {
    const responsedata = await getNodeMaster();
    setNodemasterdata(responsedata, key);
  };

  useEffect(() => {
    showJobAssignMapping();
    showActivitydata();
    showsetOA_DETdata();
    showBatchmasterdata();
    showNodemasterdata();
  }, []);

  function formatIndianDate(dateString) {
          const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
          const indianDateFormat = 'en-IN'; // Use 'en-IN' for Indian English locale
        
          // Convert the input date string to a JavaScript Date object
          const dateObject = new Date(dateString);
        
          // Format the date using toLocaleDateString with the Indian locale
          return dateObject.toLocaleDateString(indianDateFormat, options);
        }

        const getDateTime = (dateTime) => {
          const date = new Date(dateTime);
          const formattedDate = date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Use 24-hour format
          });
          return formattedDate;
        }

        const [isSearchVisible, setSearchVisible] = useState(false);
        const [searchInput, setSearchInput] = useState('');
        const [filteredResults, setFilteredResults] = useState([]);
        const searchItems = (searchValue) => {
          setSearchInput(searchValue)
          const filteredData = OA_DETdata.filter((item) => {
            const jobid = String(item.jobId); // Convert to string
            return jobid.includes(searchValue);
          });
          setFilteredResults(filteredData);
        }

        const toggleSearch = () => {
          setSearchVisible(!isSearchVisible);
          setSearchInput('')
        };

      function handleCommonNodeswithJobs(){
        const commonNodeIds = Batchmasterdata?.filter((item) =>
          JobIdtoJobPriority?.SendDatatoJobPriority?.map((jobItem) => jobItem?.iconId == item?.nodeId)
        );
        const commonNodewithjobs = commonNodeIds?.filter((item) => item?.producedJobId == JobIdtoJobPriority?.JobIdtoJobPriority)
        console.log(commonNodewithjobs,"andddd")
        return commonNodewithjobs
      }

      const uniqueNodes = handleCommonNodeswithJobs()
      .reduce((acc, item) => {
        // Group items by nodeId
        acc[item.nodeId] = acc[item.nodeId] || [];
        acc[item.nodeId].push(item);
        return acc;
      }, {});
    
    const filteredNodes = Object.values(uniqueNodes)
      .map((nodeItems) => {
        // Find the item with the highest producedJobId and totalProducedQty
        const maxProducedJobIdItem = nodeItems.reduce((prev, curr) => (
          prev.producedJobId > curr.producedJobId ? prev : curr
        ));
        const maxTotalProducedQtyItem = nodeItems.reduce((prev, curr) => (
          prev.totalProducedQty > curr.totalProducedQty ? prev : curr
        ));
        // Return the item with the highest producedJobId and totalProducedQty
        return maxProducedJobIdItem.producedJobId > maxTotalProducedQtyItem.totalProducedQty
          ? maxProducedJobIdItem
          : maxTotalProducedQtyItem;
      });

  function getNodeNameById(nodeId) {
    const node = Nodemasterdata.find((item) => String(item.nodeId) === nodeId);
    return node ? node.nodeName : 'Node Not Found';
  }

  function getJobDescription(jobId) {
    const node = OA_DETdata.find((item) => item.jobId === jobId);
    return node ? node.IT_NAME : "Node Not Found";
  }
      
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 m-0 p-0">
        <Box sx={{ position: "relative" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              style={{background:'#FFFFFF'}}
            >
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#FFFFFF"}} label="Jobs Planned" {...a11yProps(0)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 1 ? "#E6ECEF" : "#FFFFFF"}} label="Jobs Completed" {...a11yProps(1)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 2 ? "#E6ECEF" : "#FFFFFF"}} label="Materials" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
          <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th style={{ fontSize: "11px" }}>Id</th>
                        <th style={{ fontSize: "11px" }}>Job Id
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
                            {/* <FaSistrix onClick={toggleSearch} /> */}
                          </span>
                        )}
                        </th>
                        <th style={{ fontSize: "11px" }}>Node Id</th>
                        <th style={{ fontSize: "11px" }}>Shift Id</th>
                        <th style={{ fontSize: "11px" }}>Total Produced Quantity</th>
                        <th style={{ fontSize: "11px" }}>Out Standing Quantity</th>
                        <th style={{ fontSize: "11px" }}>Target Quantity</th>
                        <th style={{ fontSize: "11px" }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                    {searchInput.length > 0 ? (
                        filteredResults.map((item, index) => (
                          <tr>
                          <td>{item.id}</td>
                          <td>{item.jobId}</td>
                          <td>{item.node.nodeId}</td>
                          <td>
                            {item.shift.shiftNumber}
                          </td>
                          <td>
                            {item.totalProducedQty}
                          </td>
                          <td>
                            {item.outstandingQty}
                          </td>
                          <td>{item.targetQty}</td>
                          <td>{formatIndianDate(item.date)}</td>
                        </tr>
                        ))):
                      JobAssigndata.filter(
                        (item) =>
                          item.jobId == JobIdtoJobPriority.JobIdtoJobPriority &&
                          item.status === "Assigned"
                      ).map((item) => (
                        <tr>
                          <td>{item.id}</td>
                          <td>{item.jobId}</td>
                          <td>{item.node.nodeId}</td>
                          <td>
                            {item.shift.shiftNumber}
                          </td>
                          <td>
                            {item.totalProducedQty}
                          </td>
                          <td>
                            {item.outstandingQty}
                          </td>
                          <td>{item.targetQty}</td>
                          <td>{formatIndianDate(item.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div className="container-fluid" style={{height:'400px',overflowY:'auto'}}>
              <div className="row">
                <div className="col-12">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th style={{ fontSize: "11px" }}>Id</th>
                        <th style={{ fontSize: "11px" }}>Job Id</th>
                        <th style={{ fontSize: "11px" }}>Activity Start Time</th>
                        <th style={{ fontSize: "11px" }}>Activity End Time</th>
                        <th style={{ fontSize: "11px" }}>Node Id</th>
                        <th style={{ fontSize: "11px" }}>Shift Id</th>
                        <th style={{ fontSize: "11px" }}>Date</th>
                        {/* <th style={{ fontSize: "small" }}>totalProducedQty</th>
                        <th style={{ fontSize: "small" }}>outstandingQty</th>
                        <th style={{ fontSize: "small" }}>targetQty</th>
                        <th style={{ fontSize: "small" }}>Date</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {Activitydata
                      .filter(
                        (item) =>
                          item.jobId == JobIdtoJobPriority.JobIdtoJobPriority 
                        //   && item.status === "Assigned"
                      )
                      .map((item) => (
                        <tr>
                          <td>{item.id}</td>
                          <td>{item.jobId}</td>
                          <td>{getDateTime(item.shiftStartTime)}</td>
                          <td>
                            {getDateTime(item.shiftEndTime)}
                          </td>
                          <td>
                            {item.nodeId}
                          </td>
                          <td>
                            {item.Shift}
                          </td>
                          <td>{formatIndianDate(item.date)}</td>
                          {/* <td style={{ fontSize: "small" }}>{item.date}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div className="container-fluid" style={{height:'400px',overflowY:'auto'}}>
              <div className="row">
                <div className="col-12">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th style={{ fontSize: "11px" }}>Id</th>
                        <th style={{ fontSize: "11px" }}>Job Id</th>
                        <th style={{ fontSize: "11px" }}>Job Description</th>
                        <th style={{ fontSize: "11px" }}>Node Id</th>
                        <th style={{ fontSize: "11px" }}>Node Description</th>
                        <th style={{ fontSize: "11px" }}>Finished Good</th>
                        <th style={{ fontSize: "11px" }}>Total Produced Quantity</th>
                        <th style={{ fontSize: "11px" }}>Target Quantity</th>
                        <th style={{ fontSize: "11px" }}>Balance Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNodes
                      .filter(
                        (item) =>
                          item.producedJobId == JobIdtoJobPriority.JobIdtoJobPriority
                          && item.totalProducedQty !== null
                          && item.targetQty !== null
                          && item.outstandingQty !== null
                      ) 
                      .map((item) => (
                        <tr>
                          <td>{item.id}</td>
                          <td>{item.producedJobId}</td>
                          <td>{getJobDescription(item.producedJobId)}</td>
                          <td>{item.nodeId}</td>
                          <td>{getNodeNameById(item.nodeId)}</td>
                          <td>
                            {item.fgId}
                          </td>
                          <td>
                            {item.totalProducedQty}
                          </td>
                          <td>
                            {item.targetQty}
                          </td>
                          <td>{item.outstandingQty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CustomTabPanel>
        </Box>
        </div>
      </div>
    </div>
  );
}

export default JobPrioritytabs;
