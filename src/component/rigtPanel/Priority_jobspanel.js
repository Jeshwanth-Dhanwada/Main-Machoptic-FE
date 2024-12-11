import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { getJobAssign, getOADetails } from "../../api/shovelDetails";
import { Backdrop, Card, TextField } from "@mui/material";
import { FaSistrix, FaXmark } from "react-icons/fa6";

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
        <Box sx={{ p: 3 }}>
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

function Priorityjobspanel({ onClick, onDoubleClick }) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [expanded, setExpanded] = useState(false);
  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  const [jobAssigndata, setjobAssigndata] = useState([]);
  const [Oa_detailsdata, setOa_detailsdata] = useState([]);

  const showjobAssigndata = async (key) => {
    const responsedata = await getJobAssign();
    setjobAssigndata(responsedata, key);
  };

  useEffect(() => {
    showjobAssigndata();
    showOa_detailsdata();
  }, []);

  function getJobNameById(jobId) {
    const job = Oa_detailsdata.find((item) => item.jobId == jobId);
    return job ? job.IT_NAME : "Node Not Found";
  }

  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const [isDateVisible, setDateVisible] = useState(false);
  const [DateInput, setDateInput] = useState("");
  const [filteredDateResults, setFilteredDateResults] = useState([]);

  const [OpenLoader, setOpenLoader] = useState(false);
  const showOa_detailsdata = async (key) => {
    setOpenLoader(true);
    const responsedata = await getOADetails();
    setOa_detailsdata(responsedata, key);
    setOpenLoader(false);
  };

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = Oa_detailsdata.filter((item) => {
      const jobid = String(item.jobId); // Convert to string
      return jobid.includes(searchValue);
    });
    setFilteredResults(filteredData);
  };

  const searchDateItems = (searchValue) => {
    setDateInput(searchValue);
    const filteredData = Oa_detailsdata.filter((item) => {
      const jobid = item.Delivery_Date; // Convert to string
      return jobid.includes(searchValue);
    });
    setFilteredDateResults(filteredData);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput("");
  };

  const toggleSearchDate = () => {
    setDateVisible(!isDateVisible);
    setDateInput("");
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleColor = (index, jobId) => {
    console.log("Incoming,---- 1604");
    setSelectedRow(index);
    HandletoJobPriority(jobId);
    handleDoubleClick(jobId, index);
  };

  const HandletoJobPriority = (jobId) => {
    console.log(jobId);
    onClick(jobId);
    console.log(jobId,"hello")
  };
  const [multipleJobs, setMultipleJobs] = useState([]);
  // const handleDoubleClick = (jobId,index) => {
  // setSelectedRow(index);
  //   // setMultipleJobs(jobId)
  //   console.log('Double clicked!',jobId);
  //   if (!multipleJobs.includes(jobId)) {
  //     setMultipleJobs((prevJobs) => [ jobId, ...prevJobs]);
  //     onDoubleClick(multipleJobs);
  //   }
  // };

  const handleDoubleClick = (jobId, index) => {
    console.log(jobId, "16044");
    setMultipleJobs((prevJobs) => {
      // Check if jobId already exists in multipleJobs
      const alreadyExists = prevJobs.includes(jobId);
      if (alreadyExists) {
        // If jobId exists, filter it out to remove it
        return prevJobs.filter((id) => id !== jobId);
      } else {
        // If jobId doesn't exist, add it to the beginning of the array
        return [jobId, ...prevJobs];
      }
    });
    // Call onDoubleClick with the updated multipleJobs
    onDoubleClick(multipleJobs);
  };

  const handleRowsColor = (index, jobId) => {
    console.log(index, "index");
    setSelectedRows((prevIndex) => [index, ...prevIndex]);
  };

  console.log(multipleJobs, "Double");
  useEffect(() => {
    const handleMouseDown = (event) => {
      // Check if Ctrl key and 0 key are pressed
      console.log("Incoming");
      if (event.ctrlKey && event.button === 0) {
        console.log("Control + click 1604");
        // Perform your action here
        console.log("Ctrl + 0 pressed");
        handleDoubleClick();
        handleRowsColor();
      }
    };
    // Attach event listener when component mounts
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousedown", handleRowsColor);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousedown", handleRowsColor);
    };
  }, []);

  const [isExpandedFull, setIsExpandedFull] = React.useState(false);

  const [size, setSize] = useState();
  const HandleIcon = (item) => {
    console.log(item, "KKKK");
    setSize(item);
  };
  return (
    //   expanded ? (
    //   <div>
    //     <Card
    //       id="dasboard-right-container"
    //       style={{ position: "fixed", top: "45px" }}
    //       className={`dashboard-right-container sticky-top ${
    //         expanded ? "expanded" : "partial"
    //       }`}
    //     >
    //       <RightSlider
    //         isExpandedFull={isExpandedFull}
    //         setIsExpandedFull={setIsExpandedFull}
    //         onclick={HandleIcon}
    //       />
    //       <KeyboardDoubleArrowRightIcon
    //         style={{
    //           cursor: "pointer",
    //           backgroundColor: "#09587C",
    //           color: "#ffffff",
    //           position: "fixed",
    //           right: size ? size : '30%',
    //           width: "25",
    //           height: "47px",
    //           top: "46px",
    //           display: "inline",
    //         }}
    //         onClick={handleExpandToggle}
    //       />
    //       {/* </div> */}
    //       {/* <RightSlider isExpandedFull={isExpandedFull} setIsExpandedFull={setIsExpandedFull}/> */}
    //       <Box sx={{ position: "relative" }}>
    //         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    //           <Tabs
    //             value={value}
    //             onChange={handleChange}
    //             aria-label="basic tabs example"
    //             style={{ background: "#FFFFFF" }}
    //           >
    //             <Tab
    //               label="Jobs"
    //               style={{
    //                 fontSize: "10.5px",
    //                 fontWeight: "bold",
    //                 color: "#727272",
    //                 backgroundColor: value === 0 ? "#E6ECEF" : "#FFFFFF",
    //               }}
    //               {...a11yProps(0)}
    //             />
    //           </Tabs>
    //         </Box>
    //         <CustomTabPanel value={value} index={0}>
    //           <aside>
    //             <div className="employee-list-container">
    //               <table className="table table-bordered table-striped">
    //                 <thead className="sticky-top">
    //                   <tr>
    //                     <th
    //                       style={{
    //                         fontSize: "11px",
    //                         width: "90px",
    //                         height: "40px",
    //                       }}
    //                     >
    //                       Job
    //                       {isSearchVisible ? (
    //                         <div
    //                           className="search-input-container"
    //                           style={{
    //                             position: "absolute",
    //                             top: "0px",
    //                             left: "0px",
    //                             backgroundColor: "white",
    //                           }}
    //                         >
    //                           <TextField
    //                             type="text"
    //                             variant="outlined"
    //                             value={searchInput}
    //                             size="small"
    //                             style={{ width: "80px" }}
    //                             placeholder="search JobId"
    //                             onChange={(e) => searchItems(e.target.value)}
    //                           />
    //                           <span
    //                             className="clear-button"
    //                             style={{ position: "absolute" }}
    //                             onClick={toggleSearch}
    //                           >
    //                             <FaXmark />
    //                           </span>
    //                         </div>
    //                       ) : (
    //                         <span
    //                           className="search-icon-button"
    //                           style={{ marginLeft: "10px" }}
    //                         >
    //                           <FaSistrix onClick={toggleSearch} />
    //                         </span>
    //                       )}
    //                     </th>
    //                     <th style={{ fontSize: "11px" }}>Job Description</th>
    //                     <th style={{ fontSize: "11px", width: "80px" }}>
    //                       Date
    //                       {isDateVisible ? (
    //                         <div
    //                           className="search-input-container"
    //                           style={{
    //                             position: "absolute",
    //                             top: "0px",
    //                             right: "10px",
    //                             backgroundColor: "white",
    //                           }}
    //                         >
    //                           <TextField
    //                             type="date"
    //                             variant="outlined"
    //                             value={DateInput}
    //                             size="small"
    //                             style={{ width: "70px" }}
    //                             placeholder="search JobId"
    //                             onChange={(e) => searchDateItems(e.target.value)}
    //                           />
    //                           <span
    //                             className="clear-button"
    //                             style={{ position: "absolute" }}
    //                             onClick={toggleSearchDate}
    //                           >
    //                             <FaXmark />
    //                           </span>
    //                         </div>
    //                       ) : (
    //                         <span
    //                           className="search-icon-button"
    //                           style={{ marginLeft: "10px" }}
    //                         ></span>
    //                       )}
    //                     </th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {searchInput.length > 0
    //                     ? filteredResults.map((item, index) => (
    //                         <tr
    //                           style={{ cursor: "pointer" }}
    //                           onClick={() => handleColor(index, item.jobId)}
    //                           className={`${
    //                             selectedRow === index ? "lightgreen" : ""
    //                           }`}
    //                         >
    //                           <td>{item.jobId}</td>
    //                           <td>{item.IT_NAME}</td>
    //                           <td>{item?.Delivery_Date?.split("T")[0]}</td>
    //                         </tr>
    //                       ))
    //                     : DateInput.length > 0
    //                     ? filteredDateResults.map((item, index) => (
    //                         <tr
    //                           style={{ cursor: "pointer" }}
    //                           onClick={() => handleColor(index, item.jobId)}
    //                           // onDoubleClick={() => handleDoubleClick( item.jobId)}
    //                           className={`${
    //                             selectedRow === index ? "lightgreen" : ""
    //                           }`}
    //                         >
    //                           <td>{item.jobId}</td>
    //                           <td>{item.IT_NAME}</td>
    //                           <td>{item?.Delivery_Date?.split("T")[0]}</td>
    //                         </tr>
    //                       ))
    //                     : Oa_detailsdata.map((item, index) => (
    //                         <tr
    //                           style={{ cursor: "pointer" }}
    //                           onClick={() => handleColor(index, item.jobId)}
    //                           // onDoubleClick={() => handleDoubleClick(item.jobId)}
    //                           className={`${
    //                             selectedRow === index || selectedRows.includes(index)  ? "lightgreen" : ""
    //                           }`}
    //                         >
    //                           <td>{item.jobId}</td>
    //                           <td>{item.IT_NAME}</td>
    //                           <td>{item?.Delivery_Date?.split("T")[0]}</td>
    //                         </tr>
    //                       ))}
    //                 </tbody>
    //               </table>
    //             </div>
    //           </aside>
    //         </CustomTabPanel>
    //       </Box>
    //     </Card>
    //   </div>
    // ) : (
    //   <div
    //     id="dasboard-right-container"
    //     style={{ position: "fixed", top: "45px" }}
    //     className={`dashboard-right-container sticky-top partial`}
    //   >
    //     <div className="pt-2" onClick={handleExpandToggle}>
    //       <KeyboardDoubleArrowLeftIcon
    //         style={{
    //           cursor: "pointer",
    //           position: "fixed",
    //           right: "0%",
    //           width: "25",
    //           height: "47px",
    //           backgroundColor: "#09587C",
    //           color: "#ffffff",
    //         }}
    //         onClick={handleExpandToggle}
    //       />
    //     </div>
    //     {OpenLoader && (
    //       <Backdrop
    //         sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    //         open={OpenLoader}
    //         // onClick={handleClose}
    //       >
    //         <CircularProgress size={80} color="inherit" />
    //       </Backdrop>
    //     )}
    //   </div>
    // );}

    <div>
      <Box sx={{ position: "relative" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            style={{ background: "#FFFFFF" }}
          >
            <Tab
              label="Jobs"
              style={{
                fontSize: "10.5px",
                fontWeight: "bold",
                color: "#727272",
                backgroundColor: value === 0 ? "#E6ECEF" : "#FFFFFF",
              }}
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <aside>
          <div className="employee-list-container">
            <table className="table table-bordered table-striped">
              <thead className="sticky-top">
                <tr>
                  <th
                    style={{
                      fontSize: "11px",
                      width: "90px",
                      height: "40px",
                    }}
                  >
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
                          style={{ width: "80px" }}
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
                  <th style={{ fontSize: "11px", width: "80px" }}>
                    Date
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
                          style={{ width: "70px" }}
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
                    ) : (
                      <span
                        className="search-icon-button"
                        style={{ marginLeft: "10px" }}
                      ></span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchInput.length > 0
                  ? filteredResults.map((item, index) => (
                      <tr
                        style={{ cursor: "pointer" }}
                        onClick={() => handleColor(index, item.jobId)}
                        className={`${
                          selectedRow === index ? "lightgreen" : ""
                        }`}
                      >
                        <td>{item.jobId}</td>
                        <td>{item.IT_NAME}</td>
                        <td>{item?.Delivery_Date?.split("T")[0]}</td>
                      </tr>
                    ))
                  : DateInput.length > 0
                  ? filteredDateResults.map((item, index) => (
                      <tr
                        style={{ cursor: "pointer" }}
                        onClick={() => handleColor(index, item.jobId)}
                        // onDoubleClick={() => handleDoubleClick( item.jobId)}
                        className={`${
                          selectedRow === index ? "lightgreen" : ""
                        }`}
                      >
                        <td>{item.jobId}</td>
                        <td>{item.IT_NAME}</td>
                        <td>{item?.Delivery_Date?.split("T")[0]}</td>
                      </tr>
                    ))
                  : Oa_detailsdata.map((item, index) => (
                      <tr
                        style={{ cursor: "pointer" }}
                        onClick={() => handleColor(index, item.jobId)}
                        // onDoubleClick={() => handleDoubleClick(item.jobId)}
                        className={`${
                          selectedRow === index || selectedRows.includes(index)
                            ? "lightgreen"
                            : ""
                        }`}
                      >
                        <td>{item.jobId}</td>
                        <td>{item.IT_NAME}</td>
                        <td>{item?.Delivery_Date?.split("T")[0]}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </aside>
      </CustomTabPanel>
    </div>
  );
}
export default Priorityjobspanel;
