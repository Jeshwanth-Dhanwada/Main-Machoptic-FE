import React, { useContext, useEffect, useState } from "react";
import {
  getItemmaster,
  getNodeMaster,
  getOADetails,
  getShifts,
  getbatches,
} from "../api/shovelDetails";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthProvider";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import { FaXmark, FaPlus, FaMinus } from "react-icons/fa6";
import { FaArrowCircleRight } from "react-icons/fa";
import { Form } from "react-bootstrap";

function OperationsInput({ JobfromOperations,
                          inputdatafromActivity,
                          RecentActvitydata,
                          showRowboolean,
                          type = "New",
                          activityData = {},
                          onClick,
                          tableHeight
                        }) {
  const [Oadetails, setOadetails] = useState([]);
  const [batchdata, setbatchdata] = useState([]);
  console.log(RecentActvitydata,"RecentActvitydata")
  const showOA_details = async (key) => {
    const responsedata = await getOADetails();
    setOadetails(responsedata, key);
  };
  const showBatchs = async (key) => {
    const responsedata = await getbatches();
    setbatchdata(responsedata, key);
  };
  const showNodesdata = async (key) => {
    const responsedata = await getNodeMaster();
    setnodedata(responsedata, key);
  };
  const showItemmaster = async (key) => {
    const responsedata = await getItemmaster();
    setitemmaster(responsedata, key);
  };

  useEffect(() => {
    showOA_details();
    showBatchs();
    showNodesdata();
    showItemmaster();
  }, []);

  // Format the date and time
  const get24format = (date) => {
    const shiftStartTime = new Date(date);
    const formattedTime = shiftStartTime.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    });
    return formattedTime;
  };

  function getJobDescription(jobId) {
    const desc = Oadetails.find((item) => item.jobId == jobId);
    return desc ? desc.IT_NAME : "Node Not Found";
  }
  const getNodeDescbyId = (nodeId) => {
    const node = nodedata.find((item) => item.nodeId == nodeId);
    return node ? node.nodeName : "Node Not Found";
  };

  // Adding new Activityrow -----

  const { auth } = useContext(AuthContext);
  const [nodedata, setnodedata] = useState([]);
  const [itemmaster, setitemmaster] = useState([]);
  const [ActivityLog, setActivityLog] = useState([]);
  const [OA_details, setOA_details] = useState([]);
  const [batchdetails, setbatchdetails] = useState([]);
  const [batchMasterdetails, setbatchMasterdetails] = useState([]);
  const [jobId, setjobId] = useState();
  const [batchCount, setBatchCount] = useState(1);
  const [conversionRate, setConversionRate] = useState(0);
  const [consumedDisabled, setConsumedDisabled] = useState(false);


  // Fetching Activity Log ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/activitylog`;
    axios
      .get(apiUrl)
      .then((response) => {
        setActivityLog(response.data);
        // console.log("***********", ActivityLog);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching OA Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/OA_DETRoute`;
    axios
      .get(apiUrl)
      .then((response) => {
        setOA_details(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Batch or Item Mapping Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/batch`;
    axios
      .get(apiUrl)
      .then((response) => {
        setbatchdetails(response.data);
        // console.log(batchdetails, "Batchdetails");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [jobId]);

  // Default date ---------------

  console.log(inputdatafromActivity,"setInputRowActive")
  console.log(RecentActvitydata,"setInputRow")
  const [currentdate, setdate] = useState(getFormattedToday());
  const [inputsData, setInputsData] = useState(inputdatafromActivity);
  console.log(showRowboolean,"setInputRowActive")
  console.log(inputsData,"setInputRowActive")
  // Function to get today's date in the format 'YYYY-MM-DD'
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }

  const getBalanceQuantity = (value, materialId, index) => {
    const quantity = batchdetails.filter((item) => item.activityId == value && item.MaterialId == materialId);
    return index == 1 ? quantity[quantity.length - 1]?.Balancequantity1 : quantity[quantity.length - 1]?.Balancequantity2;
  }

  const isConsumedQtyEditable = (value, materialId) => {
    const quantity = batchdetails.filter((item) => item.activityId == value && item.MaterialId == materialId);
    return quantity[quantity.length - 1]?.consumedActivityId ? true : false;
  }

  const HandleItemCode = (event, materialId, index) => {
    const itemCode = itemmaster.filter((item) => item.IT_NAME === event.target.value)[0]?.IT_CODE
    const updatedData = inputsData.map((item) => {
      if (item?.materialId == materialId && item?.index - 1 == index) {
        return {
          ...item,
          batches: item?.batchDetails[event.target.selectedIndex - 1],
          itemCode: itemCode,
          availablequantity1: null,
          balanceQuantity1: null,
          consumedQty1: null,
        }
      }
      return item;
    });
    setInputsData(updatedData);
  }

  const HandleBatchId = (event, materialId, index) => {
    console.log(event)
    if (type === "edit") {
      if (isConsumedQtyEditable(event.target.value, materialId)) {
        toast.warning(<span>It cannot be editable as the batch is already consumed </span>);
        setConsumedDisabled(true);
      } else {
        setConsumedDisabled(false);
      }
    }
    const updatedData = inputsData.map((item) => {
      if (item?.materialId == materialId && item?.index - 1 == index) {
        return {
          ...item,
          //batchId: event?.target?.value,
          activityId: event?.target?.value,
          availablequantity1: getBalanceQuantity(event?.target?.value, materialId, 1),
          availablequantity2: getBalanceQuantity(event?.target?.value, materialId, 2),
          balanceQuantity1: getBalanceQuantity(event?.target?.value, materialId, 1),
          balanceQuantity2: getBalanceQuantity(event?.target?.value, materialId, 2),
        }
      }
      return item;
    });
    setInputsData(updatedData);
  }

  const HandleConsumedQty = (event, materialId, index, unitType) => {
    console.log(event, materialId, "consumed quantity");
    const updatedData = inputsData.map((item) => {
      if (item?.availablequantity - +event.target.value < 0) return item;
      if (item?.materialId == materialId && item?.index - 1 == index) {
        if (unitType == 1) {
          if (+event.target.value > item?.availablequantity1) return item;
          return {
            ...item,
            consumedQty1: +event.target.value,
            balanceQuantity1: item?.availablequantity1 - +event.target.value,
          }
        } else {
          if (+event.target.value > item?.availablequantity2) return item;
          if (isMeasurable(materialId, 2)) {
            let consumedQty1 = +event.target.value / getConversionRate(index);
            return {
              ...item,
              consumedQty1: +consumedQty1.toFixed(2),
              balanceQuantity1: +(item?.availablequantity1 - consumedQty1).toFixed(2),
              consumedQty2: +event.target.value,
              balanceQuantity2: (+item?.availablequantity2 - +event.target.value).toFixed(2),
            }
          }
          return {
            ...item,
            consumedQty2: +event.target.value,
            balanceQuantity2: (item?.availablequantity2 - +event.target.value).toFixed(2),
          }
        }
      }
      return item;
    });
    let totalConsumedQty1 = 0;
    let totalConsumedQty2 = 0;
    updatedData?.forEach((item) => totalConsumedQty1 += item?.consumedQty1);
    updatedData?.forEach((item) => totalConsumedQty2 += item?.consumedQty2);
    const conversionRate = totalConsumedQty2 / totalConsumedQty1;
    setInputsData(updatedData);
    setConversionRate(conversionRate ? conversionRate : 0);
  };

  const isMeasurable = (nodeId, unitType) => {
    if (unitType == 3) {
      const value = nodedata?.filter((item) => item?.nodeId == nodeId && item?.unit1Measurable === 'Yes' && item?.unit2Mandatory === 'Yes');
      return value.length > 0;
    } else if (unitType == 1) {
      const value = nodedata?.filter((item) => item?.nodeId == nodeId && item?.unit1Measurable === 'Yes')
      return value.length > 0;
    } else {
      const value = nodedata?.filter((item) => item?.nodeId == nodeId && item?.unit2Mandatory === 'Yes')
      return value.length > 0;
    }
  }

  const getProducedQtySameJob = () => {
    const batchDetail = batchdetails.filter((item) => item?.jobId == jobId && item?.Consumedquantity1 == 0);
    let totalProducedQty = 0;
    batchDetail.forEach((item) => {
      totalProducedQty += item?.Availablequantity1;
    })
    return totalProducedQty;
  }

  const getTargetQty = () => {
    const targetQty = OA_details?.filter((item) => item?.jobId == jobId && item?.IT_CODE == getProductName());
    return targetQty[0]?.TargetQty;
  }

  const getOutstandingQty = (quantity) => {
    const outstandingQty = (getTargetQty() * 1.08) - quantity + getProducedQtySameJob();
    return outstandingQty;
  }

  const CancelSubmit = () => {
    setBatchCount(1);
    setFilteredResults([]);
  };

  const getRecentActivity = () => {
    // console.log(ActivityLog);
    const activityArr = ActivityLog.filter(
      (item) =>
        parseInt(item.jobId) === parseInt(RecentActvitydata.jobId) &&
        parseInt(item.nodeId) === parseInt(RecentActvitydata.nodeId)
    ).map((item) => item.id);
    return activityArr[activityArr.length - 1];
  };

  const getDescription = (itemCode) => {
    const desc = itemmaster
      .filter((item) => item.IT_CODE === itemCode)
      .map((item) => (
        {
          'name': item.IT_NAME,
          'itemcode': item.IT_CODE
        }
      ));
    return desc;
  }

  const getProductName = () => {
    const product = OA_details.filter(
      (item) => item.jobId === RecentActvitydata.jobId)
    // .map((item) => item.IT_CODE )
    // console.log(product)
    return product[0]?.IT_CODE.toString()
  }

  const getInputBatchDetail = (batches, index) => {
    const filteredBatches = batches?.filter(batch =>
      !inputsData.some(inputData => inputData?.activityId === batch?.activityId && inputData?.index - 1 !== index)
    );
    return filteredBatches;
  }

  const getNodeDetail = (item) => {
    return nodedata.filter(item1 => item1.nodeId === item.targetNodeId)[0];
  }

  const getUnits = (nodeId, unitType) => {
    const nodeDetail = nodedata?.filter((item) => item?.nodeId == nodeId)[0];
    return unitType == 1 ? nodeDetail[0]?.units1 : nodeDetail[0]?.units2;
  }

  const getConversionRate = (index) => {
    const conversionRate = batchMasterdetails.filter((item) => item?.activityId == inputsData[index]?.activityId)[0]?.conversionRate;
    return conversionRate ? conversionRate : 0;

  }

  const handleOnAddClickForInput = (index) => {
    let inputValues = [...inputsData];
    inputValues[index] = { ...inputValues[index], isPlus: false, isMinus: false }
    const indexVal = inputValues[index]?.index;
    let newValue = { ...inputValues[index], itemCode: '', isPlus: true, isMinus: true, isPrimary: false, index: indexVal + 1, activityId: '', availablequantity1: '', availablequantity2: '', balanceQuantity1: '', balanceQuantity2: '', consumedQty1: null, consumedQty2: null }
    inputValues.splice(index + 1, 0, newValue);
    setInputsData(inputValues);
  }

  const handleOnMinusClickForInput = (index) => {
    const inputValues = [...inputsData];
    const isPrimary = inputValues[index - 1]?.isPrimary;
    const indexVal = inputValues[index - 1]?.index;
    inputValues[index - 1] = { ...inputValues[index - 1], isPlus: true, isMinus: isPrimary ? false : true, index: indexVal }
    inputValues.splice(index, 1)
    let totalConsumedQty1 = 0;
    let totalConsumedQty2 = 0;
    inputValues?.forEach((item) => totalConsumedQty1 += item?.consumedQty1);
    inputValues?.forEach((item) => totalConsumedQty2 += item?.consumedQty2);
    const conversionRate = totalConsumedQty2 / totalConsumedQty1;
    setInputsData(inputValues);
    setConversionRate(conversionRate ? conversionRate : 0);
  }

  const [isSearchVisible, setSearchVisible] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const itemcode = inputdatafromActivity.map((item, index) => item.item)
  const item = itemcode?.item?.map((value) => (getDescription(value)))
  const [height, setHeight] = useState();
  useEffect(() => {
    console.log(tableHeight,"heightt")
    if(tableHeight > '1' && tableHeight < '360'){
      setHeight(tableHeight-'100');
    }
    else{
      setHeight('350px')
    }
  }, []);
  return (
    <div>
      <div className="container-fluid" style={{
          // height: tableHeight ? tableHeight : '200px',
          height:  height,
          overflowY: "scroll",
          overflowX :"hidden"
        }}>
        <div className="row">
          <div className="col-12">
            <table className="table table-bordered table-striped">
              <thead className="sticky-top">
                <tr>
                  <th style={{ fontSize: "9px" }}>Id</th>
                  <th style={{ fontSize: "9px" }}>Activity Id</th>
                  <th style={{ fontSize: "9px" }}>Date</th>
                  <th style={{ fontSize: "9px" }}>Consumed Activity Id</th>
                  <th style={{ fontSize: "9px" }}>Shift</th>
                  <th style={{ fontSize: "9px" }}>Machine Node Id</th>
                  <th style={{ fontSize: "9px" }}>Job Id</th>
                  <th style={{ fontSize: "9px" }}>Job Description</th>
                  <th style={{ fontSize: "9px" }}>Finished Good Id</th>
                  {/* <th style={{ fontSize: "9px" }}>FG Description</th> */}
                  <th style={{ fontSize: "9px" }}>Item Code</th>
                  <th style={{ fontSize: "9px" }}>Batch Id</th>
                  <th style={{ fontSize: "9px" }}>Material Id</th>
                  <th style={{ fontSize: "9px" }}>Available quantity1 (Meters)</th>
                  <th style={{ fontSize: "9px" }}>Consumed quantity1 (Meters)</th>
                  <th style={{ fontSize: "9px" }}>Balance quantity1 (Meters)</th>
                  <th style={{ fontSize: "9px" }}>Available quantity2 (Kgs)</th>
                  <th style={{ fontSize: "9px" }}>Consumed quantity2 (Kgs)</th>
                  <th style={{ fontSize: "9px" }}>Balance quantity2 (Kgs)</th>
                </tr>
              </thead>
              <tbody>
                {batchdata
                  .filter(
                    (item) =>
                      item.jobId == JobfromOperations.item &&
                      item.consumedActivityId != null
                      && item.MachinenodeId == JobfromOperations.nodeId
                  )
                  .map((item) => (
                    <tr>
                      <td>{item.id}</td>
                      <td>{item.activityId}</td>
                      <td>
                        {get24format(item.date)}
                      </td>
                      <td>
                        {item.consumedActivityId}
                      </td>
                      <td>{item.shift}</td>
                      <td>{item.MachinenodeId}-{getNodeDescbyId(item.MachinenodeId)}</td>
                      <td>{item.jobId}</td>
                      <td>
                        {getJobDescription(item.jobId)}
                      </td>
                      <td>{item.FGID}</td>
                      <td>{item.ItemCode}</td>
                      <td></td>
                      <td>{item.MaterialId}-{getNodeDescbyId(item.MaterialId)}</td>
                      <td>
                        {item.Availablequantity1}
                      </td>
                      <td>
                        {item.Availablequantity2}
                      </td>
                      <td>
                        {item.Consumedquantity1}
                      </td>
                      <td>
                        {item.Consumedquantity2}
                      </td>
                      <td>
                        {item.Balancequantity1}
                      </td>
                      <td>
                        {item.Balancequantity2}
                      </td>
                    </tr>
                  ))}
                {showRowboolean == true && (
                  <>
                    {inputsData?.map((item, index) => (
                      <tr>
                        <td></td>
                        <td>{getRecentActivity()}</td>
                        <td></td>
                        <td></td>
                        <td>{RecentActvitydata.Shift}</td>
                        <td>{RecentActvitydata.nodeId} - {getNodeDescbyId(RecentActvitydata.nodeId)}</td>
                        <td colSpan={2}>{RecentActvitydata.jobId} - {getJobDescription(RecentActvitydata.jobId)}</td>
                        <td>{getProductName()}</td>
                        {item?.item ? <td>
                          <select
                            id="ItemCode"
                            name="ItemCode"
                            style={{ height: "20px", width: "90px" }}
                            onChange={(event) => HandleItemCode(event, item?.materialId, index)}
                            value={getDescription(item?.itemCode)[0]?.itemcode}
                            required
                          >
                            <option value="">Please Select</option>
                            {isSearchVisible || filteredResults.length > 0
                              ? filteredResults.map((value) => (
                                <option key={value} value={getDescription(value)[1]?.name}>
                                  {getDescription(value)[0]?.itemcode} - {getDescription(value)[0]?.name}
                                </option>
                              ))
                              : item?.item?.map((value) => (
                                <option key={value} value={getDescription(value)[1]?.name}>
                                  {getDescription(value)[0]?.itemcode} - {getDescription(value)[0]?.name}
                                </option>
                              ))}
                          </select>
                        </td> : <td></td>}
                        <td style={{ fontSize: '11px' }}>
                          <select
                            id="BatchId"
                            name="BatchId"
                            style={{ height: "20px", width: "80px" }}
                            onChange={(event) => HandleBatchId(event, item?.materialId, index)}
                            value={item?.activityId}
                            required
                          >
                            <option value="">Please Select</option>
                            {getInputBatchDetail(item?.batches, index)?.map((value) => (
                              <option key={value.activityId} value={value.activityId}>
                                {value.activityId}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{item.materialId}-{getNodeDescbyId(item.materialId)}</td>
                        {/* <td>{item?.itemCode}</td> */}
                        <td>{item?.availablequantity1}</td>
                        <td style={{ fontSize: '11px' }}>
                          <input
                            type="number"
                            name="consumed_qty"
                            onChange={(event) => HandleConsumedQty(event, item?.materialId, index, 1)}
                            value={item?.consumedQty1 ? item?.consumedQty1 : ''}
                            required
                            style={{ height: "20px", width: "60px" }}
                            onWheel={event => event.currentTarget.blur()}
                            disabled={isMeasurable(item?.materialId, 2) || consumedDisabled}
                          />
                        </td>
                        <td>{item?.balanceQuantity1}</td>
                        <td>{item?.availablequantity2}</td>
                        <td style={{ fontSize: '11px' }}>
                          <input
                            type="number"
                            name="consumed_qty"
                            onChange={(event) => HandleConsumedQty(event, item?.materialId, index, 2)}
                            value={item?.consumedQty2}
                            required
                            style={{ height: "20px", width: "60px", fontSize: "11px" }}
                            onWheel={event => event.currentTarget.blur()}
                            disabled={!isMeasurable(item?.materialId, 3) || consumedDisabled}
                          />
                        </td>
                        <td>{item?.balanceQuantity2}</td>
                        <td >
                          <div className="d-flex">
                            {item?.isPlus && <FaPlus onClick={(e) => handleOnAddClickForInput(index)} />}
                            &nbsp;&nbsp;
                            {item?.isMinus && <FaMinus onClick={(e) => handleOnMinusClickForInput(index)} />}
                          </div>
                        </td>
                        <button
                          style={{ border: "none", background: "transparent" }}
                          onClick={() => CancelSubmit()}
                        >
                          <FaXmark style={{ color: "red" }} />
                        </button>{" "}
                        &nbsp;
                        <button
                          style={{ border: "none", background: "transparent" }}
                          onClick={() => onClick({
                            setvalue: 7,
                            setrowActive: true
                          })}
                        >
                          <FaArrowCircleRight style={{ color: "green" }} />
                        </button>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationsInput;
