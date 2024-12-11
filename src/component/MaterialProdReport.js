import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaXmark, FaSistrix } from "react-icons/fa6";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
import TextField from "@mui/material/TextField";

const MaterialProductionReport = () => {
  const { auth } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState);
    console.log(sidebarCollapsed);
  };

  const [itemmaster, setitemmaster] = useState([]);
  const [batchData, setbatchData] = useState([]);
  const [nodemaster, setnodemaster] = useState([]);
  const [reportData, setReportsData] = useState([]);

  const [searchItemCode, setSearchItemCode] = useState("");
  const [searchItemDesc, setSearchItemDesc] = useState("");
  const [searchNodeDesc, setSearchNodeDesc] = useState("");
  const [itemCodeSearchVisible, setItemCodeSearchVisible] = useState(false);
  const [itemDescSearchVisible, setItemDescSearchVisible] = useState(false);
  const [nodeDescSearchVisible, setNodeDescSearchVisible] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState([]);

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
    const apiUrl = `${BASE_URL}/api/batch`;
    axios
      .get(apiUrl)
      .then((response) => {
        setbatchData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    setReportData();
  }, [batchData, itemmaster, nodemaster, fromDate, toDate]);

  const getNodeDesc = (value) => {
    const data = nodemaster.filter((item) => item?.nodeId == value);
    return data[0]?.nodeName;
  };

  const isNotWaste = (value) => {
    const data = nodemaster.filter((item) => item?.nodeId == value);
    return data[0]?.nodeCategory !== "Waste";
  };

  const getItemDesc = (value) => {
    const data = itemmaster.filter((item) => item?.IT_CODE == value);
    return data[0]?.IT_NAME;
  };

  const getFormattedToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getFilteredData = () => {
    if (itemCodeSearchVisible && searchItemCode.length > 0) {
      console.log(reportData);
      const filteredData = reportData.filter((item) => {
        const itemCode = String(item["FG Id"]).toLowerCase(); // Convert to string
        console.log(itemCode);
        return itemCode.includes(searchItemCode?.toLowerCase());
      });
      return filteredData;
    } else if (itemDescSearchVisible && searchItemDesc.length > 0) {
      const filteredData = reportData.filter((item) => {
        const itemDesc = String(item["FG Description"]).toLowerCase(); // Convert to string
        // console.log(name)
        return itemDesc.includes(searchItemDesc?.toLowerCase());
      });
      return filteredData;
    } else if (nodeDescSearchVisible && searchNodeDesc.length > 0) {
      const filteredData = reportData.filter((item) => {
        const nodeDesc = String(item["Material Name"]).toLowerCase(); // Convert to string
        // console.log(name)
        return nodeDesc.includes(searchNodeDesc?.toLowerCase());
      });
      return filteredData;
    }
    return reportData;
  };

  const formatReportData = (filteredBatchData) => {
    const formattedData = filteredBatchData.map((item) => {
      return {
        Date: item?.date?.split("T")[0],
        "FG Id": item?.FGID,
        "FG Description": getItemDesc(item?.FGID),
        "Job Id": item?.jobId,
        "Material Id": item?.MaterialId,
        "Material Name": getNodeDesc(item?.MaterialId),
        "Batch Id": item?.activityId,
        "Available Qty 1": item?.Availablequantity1,
        "Consumed Qty 1": item?.Consumedquantity1,
        "Balance Qty 1": item?.Balancequantity1,
        "Units 1": "meters",
        "Units 2": "kgs",
        "Available Qty 2": item?.Availablequantity2,
        "Consumed Qty 2": item?.Consumedquantity2,
        "Balance Qty 2": item?.Balancequantity2,
      };
    });
    return formattedData;
  };

  const setReportData = () => {
    const filteredBatchData = batchData.filter(
      (item) =>
        item?.FGID &&
        item?.date?.split("T")[0] >= fromDate &&
        item?.date?.split("T")[0] <= toDate
    );
    setReportsData(formatReportData(filteredBatchData));
  };

  const getTotalProducedQty = (val) => {
    const totalProducedQty = getFilteredData().reduce((accm, value) => {
      return val === 1
        ? accm + value["Available Qty 1"]
        : accm + value["Available Qty 2"];
    }, 0);
    return totalProducedQty;
  };

  const getTotalConsumedQty = (val) => {
    const totalConsumedQty = getFilteredData().reduce((accm, value) => {
      return val === 1
        ? accm + value["Consumed Qty 1"]
        : accm + value["Consumed Qty 2"];
    }, 0);
    return totalConsumedQty;
  };

  const getTotalBalanceQty = (val) => {
    const totalBalanceQty = getFilteredData().reduce((accm, value) => {
      return val === 1
        ? accm + value["Balance Qty 1"]
        : accm + value["Balance Qty 2"];
    }, 0);
    return totalBalanceQty;
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row pt-3">
          <div className="col-3 d-flex align-items-center">
          <span>FromDate </span>:
            <input
              type="date"
              value={fromDate}
              max={getFormattedToday()}
              className="form-control"
              onChange={(e) => {
                setFromDate(e.target.value);
              }}
              // style={{ border: 'none', width: '120px', height: '25px', backgroundColor: 'whitesmoke', paddingRight: "10px" }}
            />
          </div>
          <div className="col-3 d-flex align-items-center">
          <span>ToDate </span>:
            <input
              type="date"
              value={toDate}
              className="form-control"
              max={getFormattedToday()}
              disabled={fromDate ? false : true}
              onChange={(e) => {
                setToDate(e.target.value);
              }}
              // style={{ border: 'none', width: '120px', height: '25px', backgroundColor: 'whitesmoke' }}
            />
          </div>
        </div>
      </div>
      {/* <div className="d-flex justify-content-between">
                <div className="d-flex m-2 justify-content-center">
                    <h6 style={{ padding: "4px", marginRight: "10px" }}>From Date :</h6>
                    <input
                        type="date"
                        value={fromDate}
                        max={getFormattedToday()}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                        }}
                        style={{ border: 'none', width: '120px', height: '25px', backgroundColor: 'whitesmoke', paddingRight: "10px" }}
                    />
                    <h6 style={{ padding: "4px", marginRight: "10px" }}>To Date :</h6>
                    <input
                        type="date"
                        value={toDate}
                        max={getFormattedToday()}
                        disabled={fromDate ? false : true}
                        onChange={(e) => {
                            setToDate(e.target.value);
                        }}
                        style={{ border: 'none', width: '120px', height: '25px', backgroundColor: 'whitesmoke' }}
                    />
                </div>
            </div> */}
      <div style={{ display: "flex" }} className="pt-4">
        <div
          className="container-fluid d-flex"
          style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <div
            className="col-12"
            style={{ height: "350px", overflowY: "auto", overflowX: "auto" }}
          >
            <table className={"table table-bordered tablestriped"}>
              <thead className="sticky-top">
                <tr>
                  <th>Date</th>
                  <th
                    style={{
                      width: "100px",
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                    }}
                  >
                    {itemCodeSearchVisible ? (
                      <div
                        className="search-input-container"
                        style={{
                          position: "relative",
                          top: "0px",
                          left: "0px",
                          backgroundColor: "white",
                          display:'flex'
                        }}
                      >
                        <input
                          type="text"
                          value={searchItemCode}
                          className="form-control"
                          style={{ width: "100px" }}
                          placeholder="Code"
                          onChange={(e) => setSearchItemCode(e.target.value)}
                        />
                        <span
                          className="clear-button"
                          style={{ position: "relative" }}
                          onClick={(e) => {
                            setItemCodeSearchVisible(!itemCodeSearchVisible);
                            setSearchItemCode("");
                          }}
                        >
                          <FaXmark />
                        </span>
                      </div>
                    ) : (
                      <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>FG Id</span>
                        <span
                          className="search-icon-button"
                          style={{ marginLeft: "10px" }}
                      >
                          <FaSistrix
                            onClick={(e) =>
                              setItemCodeSearchVisible(!itemCodeSearchVisible)
                            }
                          />
                        </span>
                        </div>
                      </>
                    )}
                  </th>
                  <th
                    style={{
                      width: "120px",
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                    }}
                  >
                    {itemDescSearchVisible ? (
                      <div
                        className="search-input-container"
                        style={{
                          position: "relative",
                          top: "0px",
                          backgroundColor: "white",
                          display:'flex'
                        }}
                      >
                        <input
                          type="text"
                          value={searchItemDesc}
                          className="form-control"
                          style={{ width: "120px" }}
                          placeholder="search Item"
                          onChange={(e) => setSearchItemDesc(e.target.value)}
                        />
                        <span
                          className="clear-button"
                          style={{ position: "relative" }}
                          onClick={(e) => {
                            setItemDescSearchVisible(!itemDescSearchVisible);
                            setSearchItemDesc("");
                          }}
                        >
                          <FaXmark />
                        </span>
                      </div>
                    ) : (
                      <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>FG Description</span>
                        <span
                          className="search-icon-button"
                          style={{ marginLeft: "10px" }}
                        >
                          <FaSistrix
                            onClick={(e) =>
                              setItemDescSearchVisible(!itemDescSearchVisible)
                            }
                          />
                        </span>
                        </div>
                      </>
                    )}
                  </th>
                  <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    Job Id
                  </th>
                  {/* <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>Material ID</th> */}
                  <th
                    style={{
                      width: "130px",
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                    }}
                  >
                    {nodeDescSearchVisible ? (
                      <div
                        className="search-input-container"
                        style={{
                          position: "absolute",
                          top: "0px",
                          backgroundColor: "white",
                          display:'flex'
                        }}
                      >
                        <input
                          type="text"
                          value={searchNodeDesc}
                          className="form-control"
                          style={{ width: "110px" }}
                          placeholder="search Nodes"
                          onChange={(e) => setSearchNodeDesc(e.target.value)}
                        />
                        <span
                          className="clear-button"
                          style={{ position: "relative" }}
                          onClick={(e) => {
                            setNodeDescSearchVisible(!nodeDescSearchVisible);
                            setSearchNodeDesc("");
                          }}
                        >
                          <FaXmark />
                        </span>
                      </div>
                    ) : (
                      <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Material Name</span>
                        <span
                          className="search-icon-button"
                          style={{ marginLeft: "10px" }}
                        >
                          <FaSistrix
                            onClick={(e) =>
                              setNodeDescSearchVisible(!nodeDescSearchVisible)
                            }
                          />
                        </span>
                        </div>
                      </>
                    )}
                  </th>
                  <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    Batch Id
                  </th>
                  <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    Available (Meters)
                  </th>
                  <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    Consumed (Meters)
                  </th>
                  <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    Balance (Meters)
                  </th>
                  {/* <th>Units</th> */}
                  <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    Available (Kgs)
                  </th>
                  <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    Consumed (Kgs)
                  </th>
                  <th style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    Balance (Kgs)
                  </th>
                  {/* <th>Units</th> */}
                </tr>
              </thead>
              <tbody style={{ cursor: "pointer" }}>
                {getFilteredData()?.map((item, index) => (
                  <tr key={index}>
                    <td style={{ whiteSpace: "nowrap" }}>{item["Date"]}</td>
                    <td>{item["FG Id"]}</td>
                    <td>{item["FG Description"]}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{item["Job Id"]}</td>
                    {/* <td>
                                            {item['Material Id']}
                                        </td> */}
                    <td>{item["Material Name"]}</td>
                    <td>{item["Batch Id"]}</td>
                    <td>{item["Available Qty 1"]}</td>
                    <td>{item["Consumed Qty 1"]}</td>
                    <td>{item["Balance Qty 1"]}</td>
                    <td>{item["Available Qty 1"]}</td>
                    <td>{item["Consumed Qty 2"]}</td>
                    <td>{item["Balance Qty 2"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <br />
      </div>
      <div className="col-12">
        <h6>
          Total Produced qty (m): {getTotalProducedQty(1)?.toFixed(2)}, Total
          Produced qty (kgs): {getTotalProducedQty(2)?.toFixed(2)}
        </h6>
        <h6>
          Total Consumed qty (m): {getTotalConsumedQty(1)?.toFixed(2)}, Total
          Consumed qty (kgs): {getTotalConsumedQty(2)?.toFixed(2)}
        </h6>
        <h6>
          Total Balance qty (m): {getTotalBalanceQty(1)?.toFixed(2)}, Total
          Balance qty (kgs): {getTotalBalanceQty(2)?.toFixed(2)}
        </h6>
      </div>
    </div>
  );
};
export default MaterialProductionReport;
