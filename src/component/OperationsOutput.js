import React, { useEffect, useState, useContext } from "react";
import {
  getActivities,
  getItemmaster,
  getNodeMaster,
  getOADetails,
  getbatch_master,
  getbatches,
} from "../api/shovelDetails";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
import { toast } from "react-toastify";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";

function OperationsOutput({ JobfromOperations, RecentActvityData, outputDatafromActivity, inputdatafromActivity,onclicksend,tableHeight }) {
  console.log(JobfromOperations,"JobfromOperations");
  const { auth } = useContext(AuthContext);
  const [Activity, setActivity] = useState([]);
  const [Oadetails, setOadetails] = useState([]);
  const [OadetailsForJob, setOAdetailsForJob] = useState([]);
  const [JobAssign, setJobAssign] = useState([]);
  const [batchdata, setbatchdata] = useState([]);
  const [batch_masterData, setbatch_masterData] = useState([]);
  const [nodedata, setNodedata] = useState([]);
  const [Itemmaster, setItemmaster] = useState([]);
  const [quantityValues, setQuantityValues] = useState(outputDatafromActivity);
  console.log(Activity,"Activityyyyy")
  console.log(outputDatafromActivity,"outputDatafromActivity")
  const showActivities = async (key) => {
    const responsedata = await getActivities();
    setActivity(responsedata, key);
  };
  const showOA_details = async (key) => {
    const responsedata = await getOADetails();
    setOadetails(responsedata, key);
  };
  const showNodesdata = async (key) => {
    const responsedata = await getNodeMaster();
    setNodedata(responsedata, key);
  };

  const showBatchs = async (key) => {
    const responsedata = await getbatches();
    setbatchdata(responsedata, key);
  };
  const showBatch_master = async (key) => {
    const responsedata = await getbatch_master();
    setbatch_masterData(responsedata, key);
  };
  const showItemmaster = async (key) => {
    const responsedata = await getItemmaster();
    setItemmaster(responsedata, key);
  };

  useEffect(() => {
    showActivities();
    showOA_details();
    showBatch_master();
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

  useEffect(() => {
    if (RecentActvityData.jobId) {
      const apiUrl = `${BASE_URL}/api/OA_DETRoute/${RecentActvityData.jobId}`;
      axios
        .get(apiUrl)
        .then((response) => {
          setOAdetailsForJob(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
    }
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/jobassign`;
    axios
      .get(apiUrl)
      .then((response) => {
        setJobAssign(response.data);
        console.log("**********", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log(Oadetails);
  console.log(Activity);
  function getJobDescription(jobId) {
    const desc = Oadetails.find((item) => item.jobId == jobId);
    return desc ? desc.IT_NAME : "Node Not Found";
  };

  const getFormattedToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  };

  const CancelSubmit = () => {

  };
  const getNodeDescbyId = (nodeId) => {
    const node = nodedata.find((item) => item?.nodeId == nodeId);
    return node ? node.nodeName : "Node Not Found";
  };

  const getIT_NameById = (it_code) => {
    const name = Itemmaster.find((item) => item.IT_CODE == it_code);
    return name ? name.IT_NAME : "Node Not Found";
  };

  const getNodeDetail = (item) => {
    return nodedata.filter(item1 => item1.nodeId === item.targetNodeId)[0];
  };

  const getRecentActivity = () => {
    // console.log(ActivityLog);
    const activityArr = Activity.filter(
      (item) =>
        parseInt(item.jobId) === parseInt(RecentActvityData.jobId) &&
        parseInt(item.nodeId) === parseInt(RecentActvityData.nodeId)
    ).map((item) => item.id);
    return activityArr[activityArr.length - 1];
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
    const batchDetail = batchdata.filter((item) => item?.jobId == RecentActvityData.jobId && item?.Consumedquantity1 == 0);
    let totalProducedQty = 0;
    batchDetail.forEach((item) => {
      totalProducedQty += item?.Availablequantity1;
    })
    return totalProducedQty;
  };

  const getTargetQty = () => {
    const targetQty = Oadetails?.filter((item) => item?.jobId == RecentActvityData.jobId && item?.IT_CODE == getProductName());
    return targetQty[0]?.TargetQty;
  };

  const getOutstandingQty = (quantity) => {
    const outstandingQty = (getTargetQty() * 1.08) - quantity - getProducedQtySameJob();
    return outstandingQty;
  };

  const isDisableForOutput = (item, unitType) => {
    if (getNodeDescbyId(RecentActvityData.nodeId)?.includes("Slitting Machine") && item?.outputType != 1 && item?.nodeCategory != 'Waste') {
      return true;
    } else if (unitType == 1) {
      return item?.nodeCategory == 'Waste' || !isMeasurable(item.nodeId, 1)
    } else if (unitType == 2) {
      return item?.nodeCategory != 'Waste' && !isMeasurable(item.nodeId, 2)
    }
  };

  const getProductName = () => {
    const product = Oadetails.filter(
      (item) => item.jobId === RecentActvityData.jobId)
    return product[0]?.IT_CODE.toString()
  };
  const handlequantity = (event, item, unitType, index) => {

    const updatedQuantityValues = [...quantityValues];
    // Update the quantity value for the specific row
    const rowIndex = index;
    const nodeCategory = getNodeDetail({ targetNodeId: item?.nodeId })?.nodeCategory
    let quantity1;
    let quantity2;
    if (isMeasurable(item.nodeId, 3)) {
      if (unitType == 1) {    //needs to be changed
        quantity1 = +event.target.value;
        quantity2 = updatedQuantityValues[rowIndex]?.quantity2;
      } else {
        quantity2 = +event.target.value;
        quantity1 = updatedQuantityValues[rowIndex]?.quantity1;
      }
    } else if (nodeCategory == 'Waste') {
      quantity1 = ''; //needs to be changed
      quantity2 = +event.target.value;
    } else {
      let value = +event.target.value
      quantity1 = getNodeDetail(item)?.nodeCategory != 'Waste' ? value.toFixed(2) : null;
      quantity2 = +event.target.value;
    }
    //updatedQuantityValues.forEach((item, index) => item?.nodeCategory == 'Waste' ? updatedQuantityValues[index] = { nodeId: item?.nodeId, quantity: wasteQty, nodeCategory: item?.nodeCategory } : '')
    updatedQuantityValues[rowIndex] = { ...updatedQuantityValues[rowIndex], quantity1: quantity1, quantity2: quantity2 }; // needs to be changed
    setQuantityValues(updatedQuantityValues);
  };

  console.log(quantityValues,"quantityValues")
  const handleBatchSubmit = async (event) => {
    event.preventDefault();
    // Check if there is any row with a quantity greater than 0
    // const hasQuantity = quantityValues.some((quantity) => quantity?.quantity2 > 0 || quantity?.quantity1 > 0) && inputdatafromActivity.some((item) => item?.consumedQty1 > 0);

    // if (!hasQuantity) {
    //   console.log('No quantity entered for any row. Aborting submission.');
    //   return;
    // }

    submitInputData();
    // Iterate through the rows and submit for each row with quantity
    for (let index = 0; index < quantityValues.length; index++) {
      const quantity = quantityValues[index];

      if (quantity) {
        const data = {
          branchId: auth.branchId,
          MachinenodeId: parseInt(RecentActvityData.nodeId),
          jobId: RecentActvityData.jobId,
          shift: Activity.shiftNumber,
          MaterialId: quantity.nodeId.toString(),
          ItemCode: '',
          activityId: getRecentActivity().toString() + '-' + quantity?.index?.toString(),
          units1: "1",//quantity.units1, needs to be changed
          units2: "2",//quantity.units2,
          FGID: getProductName(),
          date: Activity.enddate,
          // MaterialId: getOutputsData()[index].toString(),
          Availablequantity1: quantity?.quantity1 ? quantity?.quantity1 : 0,
          Consumedquantity1: 0,
          Balancequantity1: quantity?.quantity1 ? quantity?.quantity1 : 0,
          Availablequantity2: quantity?.quantity2 ? quantity?.quantity2 : 0,
          Consumedquantity2: 0,
          Balancequantity2: quantity?.quantity2 ? quantity?.quantity2 : 0,
          userId: auth.empId.toString()
        };

        const headers = {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${auth.accessToken}`,
        }

        try {
          // Use async/await to wait for each request to complete
          const response = await axios.post(`${BASE_URL}/api/batch`, data, { headers });
          console.log('Data saved successfully for row', index, response.data);
          createBatchMasterData(quantity);
        } catch (error) {
          console.log('Error while submitting for row', index, error);
          return;
          // You can choose to handle errors as needed
        }
      }
    }
    toast.success(
          <span><strong>Saved </strong>Successfully.</span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            // autoClose: 3000, // Optional: Set auto close time in milliseconds
            // closeButton: false, // Optional: Hide close button
            className: 'custom-toast' // Optional: Add custom CSS class
          }
          );
  };

  const createBatchMasterData = async (quantity) => {
    const payload = {
      branchId: auth.branchId,
      activityId: getRecentActivity().toString() + '-' + quantity?.index?.toString(),
      nodeId: quantity?.nodeId?.toString(),
      //producedAt: new Date(currentdate),
      producedQty1: quantity?.quantity1 ? quantity?.quantity1 : null,
      consumedQty1: 0,
      balanceQty1: quantity?.quantity1 ? quantity?.quantity1 : 0,
      units1: "1",//quantity.units1, need to be changed
      producedQty2: quantity?.quantity2 ? quantity?.quantity2 : 0,
      consumedQty2: 0,
      balanceQty2: quantity?.quantity2 ? quantity?.quantity2 : 0,
      units2: "2",//quantity.units2,
      lastConsumedAt: null,
      fgId: getProductName(),
      producedJobId: RecentActvityData.jobId,
      lastConsumedJobId: '',
      consumedActivityId: '',
      conversionRate: isMeasurable(quantity?.nodeId, 3) ? quantity?.quantity2 / quantity?.quantity1 : null,
      totalProducedQty: quantity?.nodeCategory != 'Waste' ? quantity?.quantity1 + getProducedQtySameJob() : null,
      targetQty: quantity?.nodeCategory != 'Waste' ? getTargetQty() : null,
      outstandingQty: quantity?.nodeCategory != 'Waste' ? getOutstandingQty(quantity?.quantity1) : null,
      userId: auth.empId.toString(),
    }

    const headers = {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${auth.accessToken}`,
    }
    try {
      // Use async/await to wait for each request to complete
      const response = await axios.post(`${BASE_URL}/api/batchMaster`, payload, { headers });
      //updateOADETTable(quantity);
      // if (payload?.outstandingQty <= 0 && quantity?.nodeCategory != 'Waste') {
      updateJobAssign(payload);
      // }
      CancelSubmit()
      const value = 0
      onclicksend(value)
    } catch (error) {
      console.log('Error while submitting for row', error);
      return;
      // You can choose to handle errors as needed
    }
  }

  const getBatchMasterData = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${auth.accessToken}`,
      }
      // Use async/await to wait for each request to complete
      const response = await axios.get(`${BASE_URL}/api/batchMaster`, { headers });
      console.log('Data saved successfully for row', response.data);
      return response.data;
    } catch (error) {
      console.log('Error while submitting for row', error);
      return []
    }
  }

  const updateJobAssign = async (quantity) => {
    let jobAssignData = JobAssign?.filter((item) => item?.node?.nodeId == RecentActvityData.nodeId && item?.jobId == quantity?.producedJobId && item?.shift?.shiftNumber == Activity?.shiftNumber && item?.date == getFormattedToday() && item?.status == 'Assigned');
    if (jobAssignData?.length > 0) {
      let { DateTime, shift, node, id, ...updatedObj } = jobAssignData[0];
      updatedObj = {
        ...updatedObj,
        node: RecentActvityData.nodeId,
        shift: Activity?.shiftNumber,
        status: "Completed",
      }
      const headers = {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${auth.accessToken}`,
      }
      try {
        // Use async/await to wait for each request to complete
        const response = await axios.put(`${BASE_URL}/api/jobAssign/${id}`, updatedObj, { headers });
        updateOADETTable()
      } catch (error) {
        console.log('Error while submitting for row', error);
        return;
        // You can choose to handle errors as needed
      }
    }
  }

  const updateOADETTable = async () => {
    const { DateTime, ...newObject } = OadetailsForJob;
    const payLoad = {
      ...newObject,
      Status: 'In Progress',
    }
    const headers = {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${auth.accessToken}`,
    }
    try {
      // Use async/await to wait for each request to complete
      const response = await axios.put(`${BASE_URL}/api/OA_DETRoute/${RecentActvityData.jobId}`, payLoad, { headers });
      CancelSubmit()
    } catch (error) {
      console.log('Error while submitting for row', error);
      return;
      // You can choose to handle errors as needed
    }
  }

  const submitInputData = async () => {
    for (let index = 0; index < inputdatafromActivity.length; index++) {

      const payLoad = {
        branchId: auth.branchId,
        MachinenodeId: parseInt(RecentActvityData.nodeId),
        jobId: RecentActvityData.jobId,
        shift: Activity.shiftNumber,
        MaterialId: inputdatafromActivity[index]?.materialId,
        ItemCode: inputdatafromActivity[index]?.itemCode ? inputdatafromActivity[index]?.itemCode : '',
        activityId: inputdatafromActivity[index]?.activityId?.toString(),
        units1: "1", // need to be changed
        units2: "2",
        FGID: getProductName(),
        date: Activity.enddate,
        // MaterialId: inputdatafromActivity[index]?.materialId,
        Availablequantity1: inputdatafromActivity[index]?.availablequantity1,
        Consumedquantity1: inputdatafromActivity[index]?.consumedQty1,
        Balancequantity1: inputdatafromActivity[index]?.balanceQuantity1,
        Availablequantity2: inputdatafromActivity[index]?.availablequantity2,
        Consumedquantity2: inputdatafromActivity[index]?.consumedQty2,
        Balancequantity2: inputdatafromActivity[index]?.balanceQuantity2,
        consumedActivityId: getRecentActivity().toString(),
        userId: auth.empId.toString()
      }

      const headers = {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${auth.accessToken}`,
      }

      try {
        // Use async/await to wait for each request to complete
        const response = await axios.post(`${BASE_URL}/api/batch`, payLoad, { headers });
        console.log('Data saved successfully for row', index, response.data);
        updateBatchMasterData(inputdatafromActivity[index]);
      } catch (error) {
        console.log('Error while submitting for row', index, error);
        // You can choose to handle errors as needed
      }
    }
  }

  const updateBatchMasterData = async (inputValue) => {
    const getbatchMaster = await getBatchMasterData();
    const batchData = getbatchMaster.filter((item) => item?.activityId == inputValue?.activityId?.toString() && item?.nodeId == inputValue?.materialId)
    if (batchData?.length > 0) {
      const { createdDateTime, ...restBatchData } = batchData[0];
      const payLoad = {
        ...restBatchData,
        consumedQty1: inputValue?.consumedQty1,
        balanceQty1: inputValue?.balanceQuantity1,
        consumedQty2: inputValue?.consumedQty2,
        balanceQty2: inputValue?.balanceQuantity2,
        consumedActivityId: getRecentActivity().toString().split("-")[0],
        lastConsumedJobId: RecentActvityData.jobId,
      }

      const headers = {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${auth.accessToken}`,
      }

      const id = batchData[0]?.id
      try {
        // Use async/await to wait for each request to complete
        const response = await axios.put(`${BASE_URL}/api/batchMaster/${id}`, payLoad, { headers });
      } catch (error) {
        console.log('Error while submitting for row', error);
        return;
        // You can choose to handle errors as needed
      }
    }
  }

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
                  <th style={{ fontSize: "9px" }}>Date</th>
                  <th style={{ fontSize: "9px" }}>Consumed Activity Id</th>
                  <th style={{ fontSize: "9px" }}>Shift</th>
                  <th style={{ fontSize: "9px" }}>Machine Node Id</th>
                  <th style={{ fontSize: "9px" }}>Job Id</th>
                  <th style={{ fontSize: "9px" }}>Job Description</th>
                  <th style={{ fontSize: "9px" }}>Finished Good Id</th>
                  <th style={{ fontSize: "9px" }}>Item Code</th>
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
                  ?.filter(
                    (item) =>
                      item.jobId == JobfromOperations.item 
                      && item.consumedActivityId !== null
                      && item.MachinenodeId == JobfromOperations.nodeId
                  )
                  ?.map((item) => (
                    <tr>
                      <td>{item.id}</td>
                      <td>
                        {get24format(item.date)}
                      </td>
                      <td>{item.activityId}</td>
                      <td>
                        {item.consumedActivityId}
                      </td>
                      <td>{item.shift}</td>
                      <td>
                        {item.MachinenodeId}-
                        {getNodeDescbyId(item.MachinenodeId)}
                      </td>
                      <td>{item.jobId}</td>
                      <td>
                        {getJobDescription(item.jobId)}
                      </td>
                      <td>{item.FGID}</td>
                      {/* <td>
                        {getIT_NameById(item.FGID)}
                      </td> */}
                      <td>{item.ItemCode}</td>
                      <td>
                        {item.MaterialId}-{getNodeDescbyId(item.MaterialId)}
                      </td>
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
                {quantityValues?.map((item, index) => (
                  <tr>
                    <td></td>
                    <td>{getRecentActivity()}</td>
                    <td></td>
                    <td></td>
                    <td>{RecentActvityData.Shift}</td>
                    <td>{RecentActvityData.nodeId} - {getNodeDescbyId(RecentActvityData.nodeId)}</td>
                    <td colSpan={2}>{RecentActvityData.jobId} - {getJobDescription(RecentActvityData.jobId)}</td>
                    <td></td>
                    <td></td>
                    <td>{getNodeDescbyId(item?.nodeId)}</td>
                    <td>
                      <input
                        type="number"
                        onChange={(event) => handlequantity(event, item, 1, index)} //needs to be changed
                        value={quantityValues[index]?.quantity1}
                        onWheel={event => event.currentTarget.blur()}
                        disabled={item?.nodeCategory == 'Waste' || isDisableForOutput(item, 1)} //needs to be changed
                      />
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      <input
                        type="number"
                        onChange={(event) => handlequantity(event, item, 2, index)} //needs to be changed
                        value={quantityValues[index]?.quantity2}
                        disabled={isDisableForOutput(item, 2)}
                        onWheel={event => event.currentTarget.blur()}
                      />
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button
          style={{ border: "none", background: "transparent" }}
          onClick={() => CancelSubmit()}
        >
          <FaXmark style={{ color: "red" }} />
        </button>
        &nbsp;
        <button
          style={{ border: "none", background: "transparent" }}
          onClick={handleBatchSubmit}
        >
          <FaArrowCircleRight style={{ color: "green" }} />
        </button>
      </div>
    </div>
  );
}

export default OperationsOutput;
