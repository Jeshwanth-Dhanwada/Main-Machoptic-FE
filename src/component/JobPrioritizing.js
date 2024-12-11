import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaXmark, FaCheck, FaSistrix } from "react-icons/fa6";
import Dropdown from 'react-bootstrap/Dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from "react-bootstrap";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
import TextField from "@mui/material/TextField";
import { Backdrop, CircularProgress } from "@mui/material";


function JobPrioritizing() {
    const { auth } = useContext(AuthContext)
    const [OA_DETdata, setOA_DETdata] = useState([]);
    const [itemMaster, setitemMaster] = useState([]);
    const [checkeddata, setcheck] = useState([]);
    const [deliveryDates, setDeliveryDates] = useState({});
    const [searchInput, setSearchInput] = useState('');
    const [searchDesc, setSearchDesc] = useState('');
    const [filteredDesc, setfilteredDesc] = useState([]);
    const [isjobdescSearchVisible, setjobdescSearchVisible] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [selectedStatus, setselectedStatus] = useState()

    const [OpenLoader, setOpenLoader] = useState(false)

    // OA_DET------
    useEffect(() => {
        setOpenLoader(true)
        // Fetch data from the API when the component mounts
        const apiUrl = `${BASE_URL}/api/OA_DETRoute/all`;
        axios
            .get(apiUrl)
            .then((response) => {
                console.log(response.data);
                setOA_DETdata(response.data);
                setOpenLoader(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Item Master ------
    useEffect(() => {
        // Fetch data from the API when the component mounts
        const apiUrl = `${BASE_URL}/api/itemmaster`;
        axios
            .get(apiUrl)
            .then((response) => {
                // console.log(response.data);
                setitemMaster(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    function getOADetails() {
        const apiUrl = `${BASE_URL}/api/OA_DETRoute/all`;
        axios
            .get(apiUrl)
            .then((response) => {
                // console.log(response.data);
                setOA_DETdata(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const getJobDescription = (Itcode) => {
        const name = itemMaster.filter((item) => item.IT_CODE == Itcode)
            .map(item => item.IT_NAME)
        return name
    }

    const selectAllJobs = (e) => {
        const isChecked = e.target.checked;
    };

    const handleCheckBox = (e, item, type) => {
        const isChecked = e.target.checked;
        console.log(isChecked);
        if (!isChecked) {
            const checkddata = checkeddata.filter((item1) => item1?.jobId !== item?.jobId);
            setcheck(checkddata)
        } else {
            setcheck([...checkeddata, item]);
            // console.log(item);
        }
    }

    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        const filteredData = OA_DETdata.filter((item) => {
            const jobid = String(item.jobId); // Convert to string
            // console.log(name)
            return jobid.includes(searchValue);
        });
        setFilteredResults(filteredData);
    }

    const toggleSearch = () => {
        setSearchVisible(!isSearchVisible);
        setSearchInput('')
    };

    const searchDescription = (searchdesc) => {
        setSearchDesc(searchdesc)
        const descData = itemMaster.filter((item) => {
            const jobDesc = String(item.IT_NAME).toLowerCase(); // Convert to string
            return jobDesc.includes(searchdesc.toLowerCase());
        });
        const filteredData = OA_DETdata.filter(item1 => descData.some(item2 => item1.IT_CODE === item2.IT_CODE));
        setfilteredDesc(filteredData);
    }

    const toggleSearchDesc = () => {
        setjobdescSearchVisible(!isjobdescSearchVisible);
        setSearchDesc('')
    };

    const handleMenuClick = (status) => {
        setselectedStatus(status)
        // Handle menu item click (e.g., perform actions based on the selected status)
        console.log(`Selected status: ${status}`);
    };

    function getFormattedToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
    }

    const getFormattedDate = (date) => {
        const formatted = date?.split("T")[0];
        return formatted;
    }

    const updateDeliveryDate = (e, index, jobId) => {
        const updatedDate = { ...deliveryDates };
        updatedDate[jobId] = e.target.value;
        setDeliveryDates(updatedDate);
    }

    const getTableBody = () => {
        if (searchInput.length > 0 && isSearchVisible) {
            return filteredResults;
        } else if (searchDesc.length > 0 && isjobdescSearchVisible) {
            return filteredDesc;
        } else if (selectedStatus === "Received" || selectedStatus === "Assigned") {
            return OA_DETdata.filter(item => item.Status == selectedStatus);
        } else {
            return OA_DETdata;
        }
    }
    const handleSubmitNewJob = () => {

        const selectedJobs = OA_DETdata.filter((item1) =>
            checkeddata.some((item2) => item2.jobId == item1.jobId));
        console.log(selectedJobs);

        if (selectedJobs.length > 0) {
            const updatedData = selectedJobs.map((item) => {
                const { DateTime, Delivery_Date, IT_NAME, ItemType, ...newObject } = item;
                const deliveryData = deliveryDates[item?.jobId];
                return { ...newObject, Delivery_Date: deliveryData, };
            })
            const payload = {
                "qadet": updatedData,
            }
            // console.log(payload);
            axios
                .put(`${BASE_URL}/api/OA_DETRoute/bulk`, payload)
                .then((res) => {
                    getOADetails()
                    toast.success(<p><strong>Added</strong>Successfully.</p>);
                    setcheck([]);
                })
                .catch((err) => {
                    console.log(err, "Error");
                    toast.error(<span><strong>User</strong> is not authorized fot this action.</span>);
                    setcheck([]);
                });
        }
        else {
            toast.warning(<p><strong>Jobs</strong> are up to date</p>);
        }
    }
    return (
        <>
            <div className="d-flex mt-1 container-fluid justify-content-center">
                <div className="row">
                    <div className="col-12" style={{ height: "84vh", overflowY: "auto" }}>
                        <table className="table table-bordered table-striped">
                            <thead class="thead-dark sticky-top">
                                <tr>
                                    <th style={{ width: '144px' }}>JobId
                                        {isSearchVisible ? (
                                            <div className="search-input-container" style={{ position: 'absolute', top: '0px', left: '0px', backgroundColor: 'white' }}>
                                                <TextField
                                                    type="text"
                                                    variant="outlined"
                                                    value={searchInput}
                                                    size="small"
                                                    style={{ width: '124px' }}
                                                    placeholder="search JobId"
                                                    onChange={(e) => searchItems(e.target.value)}

                                                />
                                                <span className="clear-button" style={{ position: 'absolute',top:'10px' }} onClick={toggleSearch}>
                                                    <FaXmark />
                                                </span>

                                            </div>) : (
                                            <span className="search-icon-button" style={{ marginLeft: "10px" }}>
                                                <FaSistrix onClick={toggleSearch} />
                                            </span>)}
                                    </th>
                                    <th style={{ width: '100px' }}>Date</th>
                                    <th>IT_CODE</th>
                                    <th style={{ width: '240px' }}>Item Description  {isjobdescSearchVisible ? (<div className="search-input-container" style={{ position: 'absolute', top: '0px', backgroundColor: 'white' }}>
                                        <TextField
                                            type="text"
                                            variant="outlined"
                                            value={searchDesc}
                                            size="small"
                                            style={{ width: '200px' }}
                                            placeholder="Search Item Description"
                                            onChange={(e) => searchDescription(e.target.value)}

                                        />
                                        <span className="clear-button" style={{ position: 'absolute',top:'10px' }} onClick={toggleSearchDesc}>
                                            <FaXmark />
                                        </span>

                                    </div>) : (
                                        <span className="search-icon-button" style={{ marginLeft: "10px" }}>
                                            <FaSistrix onClick={toggleSearchDesc} />
                                        </span>)}</th>
                                    <th>Quantity</th>
                                    <th>Delivery Date</th>
                                    <th>
                                        <Dropdown >Status
                                            <Dropdown.Toggle variant="white" size="sm" style={{ border: 'none' }} id="dropdown-basic">

                                            </Dropdown.Toggle>

                                            <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                <Dropdown.Item onClick={() => handleMenuClick('')}>Select All</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleMenuClick('Received')}>Received</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleMenuClick('Assigned')}>Assigned</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </th>
                                    <th></th>
                                    {/* <th>
                                        <Form.Check.Input
                                            type="checkbox"
                                            name="Select"
                                            id="allocated"
                                            style={{ border: "1px solid #808080" }}
                                            onChange={selectAllJobs}
                                        />
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {getTableBody().filter(
                                    (item) => item?.Status === "Received" || item?.Status === "Assigned")
                                    .map((item, index) =>
                                        <tr key={index}>
                                            <td>{item.jobId}</td>
                                            {/* <td>{"Job Description"}</td> */}
                                            <td>{item?.DateTime.split("T")[0]}</td>
                                            <td>{item.IT_CODE}</td>
                                            <td>{getJobDescription(item.IT_CODE)}</td>
                                            <td>{item?.ALT_QTY}</td>
                                            <td><input
                                                type="date"
                                                value={deliveryDates[item.jobId] || getFormattedDate(item?.Delivery_Date)}
                                                min={getFormattedToday()}
                                                onChange={(e) => {
                                                    updateDeliveryDate(e, index, item.jobId);
                                                }}
                                                style={{ border: 'none', width: '120px', height: '25px', backgroundColor: 'whitesmoke' }}
                                            /></td>
                                            <td>{item?.Status}</td>
                                            <td>
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    name="Select"
                                                    id="allocated"
                                                    style={{ border: "1px solid #808080" }}
                                                    //checked={checkeddata?.findIndex((item1) => item1?.Job_id === item?.Job_id) !== -1}
                                                    onChange={(e) => handleCheckBox(e, item, "select")}
                                                />
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12">
                    <button className="btn btn-success" onClick={handleSubmitNewJob}><FaCheck /></button> &nbsp;
                    <button className="btn btn-danger"><FaXmark /></button>
                    </div>
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
        </>
    );

}
export default JobPrioritizing;