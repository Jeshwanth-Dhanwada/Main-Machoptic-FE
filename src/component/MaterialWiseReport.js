import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaXmark, FaSistrix } from "react-icons/fa6";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
import { MaterialWiseHeader } from "../constants/ReportsHeader";
import TextField from "@mui/material/TextField";
import Dropdown from 'react-bootstrap/Dropdown';

const MaterialWiseReport = () => {
    const { auth } = useContext(AuthContext)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const toggleSidebar = () => {
        setSidebarCollapsed((prevState) => !prevState);
        console.log(sidebarCollapsed);
    };

    const [itemmaster, setitemmaster] = useState([]);
    const [batchMasterData, setbatchMasterData] = useState([]);
    const [nodemaster, setnodemaster] = useState([]);
    const [reportData, setReportsData] = useState([]);

    const [searchItemCode, setSearchItemCode] = useState('');
    const [searchItemDesc, setSearchItemDesc] = useState('');
    const [searchNodeDesc, setSearchNodeDesc] = useState('');
    const [itemCodeSearchVisible, setItemCodeSearchVisible] = useState(false);
    const [itemDescSearchVisible, setItemDescSearchVisible] = useState(false);
    const [nodeDescSearchVisible, setNodeDescSearchVisible] = useState(false);
    const [selectedQuantityVal, setSelectedQuantity] = useState("Available");

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

    // Fetching batch Details ----------
    useEffect(() => {
        // Fetch data from the API when the component mounts
        const apiUrl = `${BASE_URL}/api/batchMaster`;
        axios
            .get(apiUrl)
            .then((response) => {
                setbatchMasterData(response.data);
                // console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        setReportData();
    }, [batchMasterData, itemmaster, nodemaster, selectedQuantityVal])

    const getNodeDesc = (value) => {
        const data = nodemaster.filter((item) => item?.nodeId == value);
        return data[0]?.nodeName;
    };

    const isNotWaste = (value) => {
        const data = nodemaster.filter((item) => item?.nodeId == value);
        return data[0]?.nodeCategory !== 'Waste';
    };

    const getBalanceQty = (item) => {
        if (selectedQuantityVal === "Available") {
            return item?.balanceQty1 > 0 ? true : false;
        } else if (selectedQuantityVal === "Consumed") {
            return item?.balanceQty1 ? false : true;
        }
        return true;
    }

    const getItemDesc = (value) => {
        const data = itemmaster.filter((item) => item?.IT_CODE == value);
        return data[0]?.IT_NAME;
    };

    const getFormattedToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
    }

    const getFilteredData = () => {
        if (itemCodeSearchVisible && searchItemCode.length > 0) {
            const filteredData = reportData.filter((item) => {
                const itemCode = String(item['Item Code']).toLowerCase(); // Convert to string
                // console.log(name)
                return itemCode.includes(searchItemCode?.toLowerCase());
            });
            return filteredData
        } else if (itemDescSearchVisible && searchItemDesc.length > 0) {
            const filteredData = reportData.filter((item) => {
                const itemDesc = String(item['Item Description']).toLowerCase(); // Convert to string
                // console.log(name)
                return itemDesc.includes(searchItemDesc?.toLowerCase());
            });
            return filteredData
        } else if (nodeDescSearchVisible && searchNodeDesc.length > 0) {
            const filteredData = reportData.filter((item) => {
                const nodeDesc = String(item['Node Description'].toLowerCase()); // Convert to string
                // console.log(name)
                return nodeDesc.includes(searchNodeDesc?.toLowerCase());
            });
            return filteredData
        }
        return reportData;
    };

    const formatReportData = (filteredBatchData) => {
        const formattedData = filteredBatchData.map((item) => {
            return {
                "Item Code": item?.fgId,
                "Item Description": getItemDesc(item?.fgId),
                "Node ID": item?.nodeId,
                "Node Description": getNodeDesc(item?.nodeId),
                "Batch Id": item?.activityId,
                "Produced Qty 1": item?.producedQty1,
                "Produced Qty 2": item?.producedQty2,
                "Consumed Qty 1": item?.consumedQty1,
                "Consumed Qty 2": item?.consumedQty2,
                "Balance Qty 1": item?.balanceQty1,
                "Balance Qty 2": item?.balanceQty2,
            }
        })
        return formattedData;
    };

    const setReportData = () => {
        const filteredBatchData = batchMasterData.filter((item) => isNotWaste(item?.nodeId) && getBalanceQty(item));
        setReportsData(formatReportData(filteredBatchData));
    };

    const downloadReport = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/downloadMaterialExcel`, { MaterialWiseHeader, reportData }, {
                responseType: 'arraybuffer',
            });
            console.log(response);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            console.log("BLOB", blob);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'data.xlsx';
            link.click();
        } catch (error) {
            console.log('Error downloading report', error);
            return;
        }
    }

    return (
        <>
        <div className="container-fluid">
            <div className="row pt-3">
                <div className="col-2 d-flex align-items-center">
                    <span>Date:</span>
                    {/* <label>Date : </label> */}
                    <input
                        type="text"
                        className="form-control"
                        value={getFormattedToday()}
                        style={{width: '130px',height:'30px'}}
                        disabled
                    />
                </div>
                <div className="col-4 d-flex align-items-center">
                    <label>Balance Quantity 1:</label>
                    <select
                        style={{width: '150px', margin: '1px' }}
                        className="form-control"
                        value={selectedQuantityVal}
                        onChange={(e) => setSelectedQuantity(e.target.value)}
                    >
                        <option>Select Both</option>
                        <option>Available</option>
                        <option>Consumed</option>
                    </select>
                </div>
                <div className="offset-4 col-2 pt-0">
                        <button style={{backgroundColor:'#022A3A',color:'#ffffff'}} className="btn" onClick={downloadReport}> Download Report</button>
                </div>
            </div>
            <div className="row">
                        <div className="col-12" style={{ height: "430px", overflow: "auto" }}>
                            <table className={"table table-bordered table-striped"}>
                                <thead className="sticky-top">
                                    <tr>
                                        <th style={{whiteSpace: "nowrap",fontSize: "11px",width:"100px"}}>
                                            {itemCodeSearchVisible ? (
                                                <div className="search-input-container" 
                                                    style={{ position: 'relative', 
                                                             top: '2px', 
                                                             left: '0px', 
                                                             display:'flex',
                                                             backgroundColor: 'white'}}>
                                                    <input
                                                        type="text"
                                                        value={searchItemCode}
                                                        className="form-control"
                                                        style={{ width: '80px' }}
                                                        placeholder="search Code"
                                                        onChange={(e) => setSearchItemCode(e.target.value)}

                                                    />
                                                    <span className="clear-button" style={{ position: 'relative' }} onClick={(e) => {
                                                        setItemCodeSearchVisible(!itemCodeSearchVisible)
                                                        setSearchItemCode('')
                                                    }}>
                                                        <FaXmark />
                                                    </span>

                                                </div>) : (<>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <span>Item Code</span>
                                                        <span
                                                            className="search-icon-button"
                                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                            onClick={(e) => setItemCodeSearchVisible(!itemCodeSearchVisible)}
                                                        >
                                                            <FaSistrix />
                                                        </span>
                                                        </div>
                                                </>)}
                                        </th>
                                        <th style={{ width: '200px',whiteSpace: "nowrap",fontSize: "11px"}}>
                                            {itemDescSearchVisible ? (
                                                <div className="search-input-container" 
                                                    style={{ position: 'relative', 
                                                    top: '0px', 
                                                    backgroundColor: 'white',
                                                    display:'flex' 
                                                    }}>
                                                    <input
                                                        type="text"
                                                        value={searchItemDesc}
                                                        className="form-control"
                                                        style={{ width: '124px' }}
                                                        placeholder="search Item"
                                                        onChange={(e) => setSearchItemDesc(e.target.value)}

                                                    />
                                                    <span className="clear-button" style={{ position: 'relative' }} onClick={(e) => {
                                                        setItemDescSearchVisible(!itemDescSearchVisible)
                                                        setSearchItemDesc('')
                                                    }}>
                                                        <FaXmark />
                                                    </span>

                                                </div>) : (<>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span>Item Description</span>
                                                    <span className="search-icon-button" style={{ marginLeft: "10px" }}>
                                                        <FaSistrix onClick={(e) => setItemDescSearchVisible(!itemDescSearchVisible)} />
                                                    </span>
                                                    </div>
                                                </>)}
                                        </th>
                                        {/* <th style={{ width: '68px', }}>Node ID</th> */}
                                        <th style={{ width: '151px',whiteSpace: "nowrap",fontSize: "11px" }}>
                                            {nodeDescSearchVisible ? (
                                            <div className="search-input-container" 
                                                        style={{ 
                                                                position: 'relative', 
                                                                top: '0px', 
                                                                backgroundColor: 'white', 
                                                                display:'flex'
                                                                }}>
                                                <input
                                                    type="text"
                                                    value={searchNodeDesc}
                                                    className="form-control"
                                                    style={{ width: '124px',height:'25px'}}
                                                    placeholder="search Nodes"
                                                    onChange={(e) => setSearchNodeDesc(e.target.value)}

                                                />
                                                <span className="clear-button" style={{ position: 'relative'}} onClick={(e) => {
                                                    setNodeDescSearchVisible(!nodeDescSearchVisible)
                                                    setSearchNodeDesc('')
                                                }}>
                                                    <FaXmark />
                                                </span>

                                            </div>) : (<>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span>Node Description</span>
                                                <span className="search-icon-button" style={{ marginLeft: "10px" }}>
                                                    <FaSistrix onClick={(e) => setNodeDescSearchVisible(!nodeDescSearchVisible)} />
                                                </span>
                                                </div>
                                            </>)}
                                            </th>
                                        <th style={{ width: '68px',whiteSpace: "nowrap",fontSize: "11px" }}>Batch Id</th>
                                        <th style={{ width: '68px',whiteSpace: "nowrap",fontSize: "11px" }}>Produced (Meters)</th>
                                        <th style={{ width: '68px',whiteSpace: "nowrap",fontSize: "11px" }}>Produced (Kgs)</th>
                                        <th style={{ width: '68px',whiteSpace: "nowrap",fontSize: "11px" }}>Consumed (Meters)</th>
                                        <th style={{ width: '68px',whiteSpace: "nowrap",fontSize: "11px" }}>Consumed (Kgs)</th>
                                        <th style={{ width: '68px',whiteSpace: "nowrap",fontSize: "11px" }}>Balance (Meters)</th>
                                        <th style={{ width: '68px',whiteSpace: "nowrap",fontSize: "11px" }}>Balance (Kgs)</th>
                                    </tr>
                                </thead>
                                <tbody style={{ cursor: "pointer" }}>
                                    {getFilteredData()?.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {item['Item Code']}
                                            </td>
                                            <td>
                                                {item['Item Description']}
                                            </td>
                                            {/* <td style={{ textAlign: 'center' }}>
                                                {item['Node ID']}
                                            </td> */}
                                            <td >
                                                {item['Node Description']}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {item['Batch Id']}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {item['Produced Qty 1']}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {item['Produced Qty 2']}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {item['Consumed Qty 1']}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {item['Consumed Qty 2']}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {item['Balance Qty 1']}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {item['Balance Qty 2']}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
        </div>
            {/* <div className="d-flex justify-content-between">
                <div className="d-flex m-2 justify-content-center">
                    <h6 style={{ padding: "4px", marginRight: "10px" }}>Date :</h6>
                    <input
                        type="text"
                        value={getFormattedToday()}
                        style={{ border: 'none', width: '120px', height: '25px', backgroundColor: 'transparent' }}
                    />
                </div>
                <div className="d-flex m-2 justify-content-center">
                    <h6 style={{ padding: "4px", marginRight: "10px" }}>Balance Quantity 1 :</h6>
                    <select
                        style={{ height: '25px', width: '150px', margin: '1px' }}
                        value={selectedQuantityVal}
                        onChange={(e) => setSelectedQuantity(e.target.value)}
                    >
                        <option>Select Both</option>
                        <option>Available</option>
                        <option>Consumed</option>
                    </select>
                </div>
                <div className="d-flex justify-content-end"> <button style={{ textDecoration: 'underline', color: 'blue', border: "none", background: "none" }} onClick={downloadReport}> Download Report</button> </div>
            </div> */}
        </>
    );
};
export default MaterialWiseReport;
