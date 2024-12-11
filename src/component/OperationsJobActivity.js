import React, { useContext, useEffect, useState } from "react";
import { getActivities, getOADetails } from "../api/shovelDetails";
import { FaPlus, FaXmark } from "react-icons/fa6";
import Button from "@mui/material/Button";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
import { toast } from "react-toastify";
import { FaArrowCircleRight } from "react-icons/fa";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function OperationsJobActivity({
  JobfromOperations,
  type = "New",
  activityData = {},
  onClick,
  setActivitydatatoInput,
  setSendToInput,
  setSendToOutput,
  emptyrecentdata,
  tableHeight
}) {
  const [open, setOpen] = React.useState(false);
  const [openBreakDown, setOpenBreakDown] = React.useState(false);
  const [RecentActivitydata, setRecentActvityData] = useState();
  console.log(emptyrecentdata,"emptyrecentdata")
  const handleClickOpen = (data) => {
    setOpen(true);
    setRecentActvityData(data);
  };

  const handleClickOpenBreakDown = (data) => {
    setOpenBreakDown(true);
    setRecentActvityData(data);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseBreakDown = () => {
    setOpenBreakDown(false);
  };

  const [Activitydata, setActivity] = useState([]);
  const [Oadetails, setOadetails] = useState([]);
  console.log(JobfromOperations, "JobfromOperations");
  console.log(
    Activitydata.filter(
      (item1) => item1?.jobId == JobfromOperations?.item
      // && item?.nodeId == JobfromOperations?.JobfromOperations?.nodeId
    ).map((item) => item.id),
    "JobfromOperations"
  );
  const showActivities = async (key) => {
    const responsedata = await getActivities();
    setActivity(responsedata, key);
  };
  const showOA_details = async (key) => {
    const responsedata = await getOADetails();
    setOadetails(responsedata, key);
  };
  useEffect(() => {
    showActivities();
    showOA_details();
  }, []);

  console.log(Activitydata, "Activitydata");

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
  function getNodeDescription(nodeId) {
    const desc = nodedata.find((item) => item.nodeId == nodeId);
    return desc ? desc.nodeName : "Node Not Found";
  }
  // function getFormattedToday() {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, "0");
  //   const day = String(today.getDate()).padStart(2, "0");
  //   return `${day}-${month}-${year}`; // Correct format: YYYY-MM-DD
  // }
  // Function to get today's date in the format 'YYYY-MM-DD'
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }

  function formatIndianDate(dateString) {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    const indianDateFormat = "en-IN"; // Use 'en-IN' for Indian English locale

    // Convert the input date string to a JavaScript Date object
    const dateObject = new Date(dateString);

    // Format the date using toLocaleDateString with the Indian locale
    return dateObject.toLocaleDateString(indianDateFormat, options);
  }

  // Adding new Activityrow -----
  const [isNewRowActive, setNewRowActive] = useState(false);
  const handleAddNewRow = () => {
    setNewRowActive(true);
  };

  const { auth } = useContext(AuthContext);
  const [shiftdata, setShiftdata] = useState([]);
  const [NodeAllocation, setNodeAllocation] = useState([]);
  const [JobAssign, setJobAssign] = useState([]);
  const [nodedata, setnodedata] = useState([]);
  const [itemmaster, setitemmaster] = useState([]);
  const [ActivityLog, setActivityLog] = useState([]);
  const [OA_details, setOA_details] = useState([]);
  const [ITMapping, setITMapping] = useState([]);
  const [OA_detailsJob, setOA_detailsForJob] = useState([]);
  const [Edgedetails, setEdgedetails] = useState([]);
  const [Employeedata, setEmployeedata] = useState([]);
  const [showForm1, setShowForm1] = useState(true);
  const [batchdetails, setbatchdetails] = useState([]);
  const [batchMasterdetails, setbatchMasterdetails] = useState([]);
  const [jobId, setjobId] = useState();
  const [rollSlitEnabled, setRollSlitEnable] = useState(false);
  const [batchCount, setBatchCount] = useState(1);
  const [conversionRate, setConversionRate] = useState(0);

  // Fetching shift data ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/shift`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log("shift data",response.data);
        setShiftdata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Node data ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log("shift data",response.data);
        setnodedata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Item Master data ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/itemmaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log("shift data",response.data);
        setitemmaster(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Employee data ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/employee`;
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log("shift data",response.data);
        setEmployeedata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching NodeAllocation data --------

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeAllocation`;
    axios
      .get(apiUrl)
      .then((response) => {
        setNodeAllocation(response.data);
        console.log("node allocation data", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Job Assignment data --------

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

  // Fetching Activity Log ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/activitylog`;
    axios
      .get(apiUrl)
      .then((response) => {
        setActivityLog(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function getActivityLog() {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/activitylog`;
    axios
      .get(apiUrl)
      .then((response) => {
        setActivityLog(response.data);
        console.log("***********", ActivityLog);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  // Fetching OA Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/OA_DETRoute`;
    axios
      .get(apiUrl)
      .then((response) => {
        setOA_details(response.data);
        console.log(OA_details);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //Fetching OA details for jobId
  useEffect(() => {
    if (jobId) {
      const apiUrl = `${BASE_URL}/api/OA_DETRoute/${jobId}`;
      axios
        .get(apiUrl)
        .then((response) => {
          setOA_detailsForJob(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [jobId]);

  // Fetching FGMapping or Item Mapping Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/mapping`;
    axios
      .get(apiUrl)
      .then((response) => {
        setITMapping(response.data);
        // console.log(response.data,"ITMapping");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetching Edge Details ----------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/edgeMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setEdgedetails(response.data);
        console.log(Edgedetails);
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
        console.log(batchdetails, "Batchdetails");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [jobId]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/batchMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        setbatchMasterdetails(response.data);
        console.log(batchdetails, "Batchdetails");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [jobId]);

  // Default date ---------------

  const [currentdate, setdate] = useState(getFormattedToday());

  const [nodeId, setNodeId] = useState();
  const [activityType, setactivity] = useState("ON");
  const [startdate, setstartdate] = useState();
  const [enddate, setenddate] = useState();
  const [enddateCheck, setenddateCheck] = useState();
  const [mappedItemData, setMappedItemData] = useState([]);
  const [EndShiftData, setEndShiftData] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [fgId, setFgId] = useState([]);
  const [routeId, setRouteId] = useState([]);
  const [inputsData, setInputsData] = useState([]);
  const [quantityValues, setQuantityValues] = useState([]);

  const getEmployeeName = () => {
    const getName = Employeedata.find(
      (item) => item?.empId == auth.empId
    )?.userName;
    return getName;
  };
  const [Employee, setEmployee] = useState(getEmployeeName());
  console.log(currentdate,"payload")
  const Activity = {
    shiftNumber: shiftData, // selected shiftNumber
    currentdate: currentdate, //cuurent date is default machine date
    startShiftData:
      mappedItemData.length > 0
        ? `${currentdate} ${mappedItemData[0].startTime}`
        : "",
    // EmployeeID: Employee,            // from loggedin employee based on employee id
    EmployeeName: Employee, // from loggedin employee tabale
    nodeId: nodeId, //selected nodeid from nodeallocation
    // nodename: nodename,              //come from nodemaster
    activityType: activityType, // dropdown option
    enddate: enddate, // selected shift end date
    jobId: jobId,
    EndShiftData:
      mappedItemData.length > 0
        ? `${currentdate} ${mappedItemData[0].startTime}`
        : "", // after finging max of endshifttime
    // startShiftData: "",                 // shift startDateTime
  };

  function getFormatCurrentEndTime(dateString) {
    const currentDate = dateString ? new Date(dateString) : new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const getJobAssignId = () => {
    const jobs = JobAssign.filter(
      (item) =>
        item.shift.shiftNumber === shiftData &&
        item.node.nodeId === parseInt(nodeId) &&
        new Date(item.date).getTime() === new Date(currentdate).getTime() &&
        item.date.split("T")[0] === currentdate
    );
    //setjobId(jobs[0]);
    return jobs[0];
  };

  const HandleDate = (event) => {
    const dateString = event.target.value; // Assuming event.target.value is a valid date string
    setenddate(getFormatCurrentEndTime(dateString));
    setdate(dateString);
  };

  useEffect(() => {
    if (activityType == "ON" && type !== "edit") {
      setjobId(getJobAssignId()?.jobId);
    }
  }, [nodeId, activityType]);

  useEffect(() => {
    setenddate(
      getFormatCurrentEndTime(currentdate) || getFormatCurrentEndTime()
    );
  }, [currentdate]);

  useEffect(() => {
    handlequantityBasedOnRollSlit();
  }, [rollSlitEnabled]);

  useEffect(() => {
    if (type === "edit") {
      setShiftData(activityData?.Shift);
      setNodeId(activityData?.nodeId);
      setactivity(activityData?.activityType);
      setenddate(activityData?.shiftEndTime);
      setenddateCheck(activityData?.shiftEndTime);
      setjobId(activityData?.jobId);
    }
  }, []);

  const HandlenodeId = (event) => {
    console.log(event.target.value.split("&&")[0], "nodeDescription");
    console.log(typeof event.target.value, "nodeDescription");
    let nodeid = nodedata?.filter(
      (item) => item?.nodeName == event.target.value.split("&&")[0]
    )[0]?.nodeId;
    let lastOccurrenceOfShift = [];
    ActivityLog.forEach((item, index) => {
      if (
        item?.Shift == shiftData &&
        item?.nodeId == nodeid &&
        item?.date.split("T")[0] == currentdate
      ) {
        lastOccurrenceOfShift = [item, index];
      }
    });
    if (lastOccurrenceOfShift?.length > 0) {
      const index = lastOccurrenceOfShift[1];
      const endTime = formatShiftEnddate()[index];
      let actualShiftEndTime = "";
      if (shiftData == 1) {
        actualShiftEndTime = `${currentdate} ${
          shiftdata.filter((item) => item?.shiftNumber == "1")[0]?.endTime
        }`;
      } else {
        const currentDate = new Date(currentdate);
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);

        const nextDayFormatted = nextDay.toISOString().split("T")[0];
        actualShiftEndTime = `${nextDayFormatted} ${
          shiftdata.filter((item) => item?.shiftNumber == "2")[0]?.endTime
        }`;
      }
      if (endTime > actualShiftEndTime) {
        toast.warning(
          <span>
            <strong>Cannot</strong> assign the Node for currrent Shift as it
            already crossed shift End time
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            className: "custom-toast", // Optional: Add custom CSS class
          }
        );
        setNodeId("");
        setjobId(getJobAssignId()?.jobId);
        return;
      }
    }
    setNodeId(nodeid?.toString());
  };

  const HandleActivity = (event) => {
    if (event.target.value != "ON") {
      setjobId("");
    }
    setactivity(event.target.value);
  };

  const HandleEndDate = (event) => {
    setenddate(event.target.value);
    setenddateCheck(event.target.value);
  };
  // //console.log("before refreshed",enddate,"after refreshed",enddateCheck)
  const HandleJobId = (event) => {
    setjobId(event.target.value);
  };
  console.log("$$$", new Date(Activity.EndShiftData));

  // Assuming Updateddata is an array
  const Updateddata = [];
  // Push the Activity object to the array
  Updateddata.push(Activity);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      branchId: auth.branchId,
      activityType: activityType,
      date: currentdate.split("T")[0],
      Shift: shiftData,
      // shiftStartTime: new Date(`${currentdate}T${mappedItemData[0].startTime}`),
      shiftStartTime: new Date(Activity.EndShiftData),
      shiftEndTime: new Date(enddate),
      nodeId: nodeId.toString(),
      employeeName: getEmployeeName(),
      jobId: jobId,
      userId : auth.empId.toString()
    };
    console.log(data, "payload");

    axios
      .post(`${BASE_URL}/api/activitylog`, data)
      .then((res) => {
        console.log(res);
        getActivityLog();
        getRecentActivity();
      })
      .catch((err) => {
        console.log(err, "Error");
      });
    if (activityType === "BreakDown") {
      // handleClickOpenBreakDown(data);
      onClick({
        setvalue: 4,
      });
      setActivitydatatoInput(data);
      return;
    } 
    if (activityType === "Maintenance") {
      // handleClickOpen(data);
      onClick({
        setvalue: 3,
      });
      setActivitydatatoInput(data);
      return;
    } 
    if(activityType === "ON") {
      onClick({
        // setvalue: 1,
        setvalue: 5,
        setrowActive: true,
      });
      setActivitydatatoInput(data);
    }
  };

  console.log(Activity.enddate, "enddate");

  const CancelSubmit = () => {
    setNewRowActive(false);
    setShiftData("");
    setenddate(getFormatCurrentEndTime(currentdate) || "");
    // setEmployee("")
    setNodeId("");
    setactivity("ON");
    setjobId("");
    setQuantityValues([]);
    setInputsData([]);
    setShowForm1(true);
    setRollSlitEnable(false);
    setBatchCount(1);
    setOpen(false)
    setNewRowActive(false)
    setOpenBreakDown(false)
  };
  console.log("enddate:", new Date(enddate));

  // const [currentDate, setCurrentDate] = useState([])
  const handleShiftData = (e) => {
    setShiftData(e.target.value);
  };

  // console.log(today);

  const filteredItems = shiftdata.filter(
    (item) => String(item.shiftNumber) === shiftData
  );

  const filtered = ActivityLog.filter(
    (item) =>
      item.nodeId === Activity.nodeId &&
      item?.date?.split("T")[0] == Activity.currentdate // item.date.split("T")[0] === currentdate &&
  );
  console.log("?????", filtered);

  const formatShiftEnddate = () => {
    const shiftEndDate = ActivityLog.map((item) => {
      // Assuming that item.shiftstarttime is in ISO 8601 format, e.g., "2023-10-13T13:30:09.000Z"
      const originalDatetime = new Date(item.shiftEndTime);

      // Subtract 5 hours and 30 minutes
      originalDatetime.setHours(
        originalDatetime.getHours() + 5,
        originalDatetime.getMinutes() + 30
      );

      // Convert the result back to ISO 8601 format
      const adjustedShiftStartTime = originalDatetime.toISOString();
      const inputDate = new Date(adjustedShiftStartTime); // Parse the input string as a Date
      // console.log("shift enddate:", inputDate)

      const year = inputDate.getUTCFullYear();
      const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
      const day = inputDate.getUTCDate().toString().padStart(2, "0");
      const hours = inputDate.getUTCHours().toString().padStart(2, "0");
      const minutes = inputDate.getUTCMinutes().toString().padStart(2, "0");
      const seconds = inputDate.getUTCSeconds().toString().padStart(2, "0");

      const formattedDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${inputDate.getMilliseconds()}`;

      return formattedDateTimeString;
    });
    return shiftEndDate;
  };

  const ShiftEndDate = formatShiftEnddate();

  if (ShiftEndDate.length > 0) {
    const maxShiftEndTime = ShiftEndDate.reduce((maxDate, currentDate) => {
      return currentDate > maxDate ? currentDate : maxDate;
    }, ShiftEndDate[0]);

    console.log(maxShiftEndTime);
    Activity.EndShiftData = maxShiftEndTime;
    // maxShiftEndTime is the maximum date in ShiftEndDate array
  }

  useEffect(() => {
    // if(shiftEndTime.length > 1){
    setEndShiftData(ShiftEndDate);
  }, []);

  console.log("shiftenddate", EndShiftData);

  useEffect(() => {
    getInputsData();
    setOutputQuantityValues();
  }, [fgId, routeId, nodeId]);

  useEffect(() => {
    const OADetail = OA_details.filter((item) => item.jobId === jobId);
    console.log(OADetail, "OADetail");
    setFgId(OADetail[0]?.IT_CODE);
  }, [jobId, OA_details]);

  useEffect(() => {
    const routeId = itemmaster.filter((item) => item.IT_CODE == fgId)[0]?.Route;
    setRouteId(routeId);
  }, [fgId]);

  useEffect(() => {
    setMappedItemData(filteredItems);
  }, [shiftData]);

  const JobBatchArr = [];

  JobBatchArr["shiftNumber"] = shiftData;
  JobBatchArr["startShiftData"] =
    mappedItemData.length > 0
      ? `${currentdate} ${mappedItemData[0].startTime}`
      : "";
  JobBatchArr["currentdate"] = currentdate;
  JobBatchArr["nodeId"] = nodeId;
  JobBatchArr["activityType"] = activityType;
  JobBatchArr["enddate"] = enddate;
  JobBatchArr["jobId"] = jobId;
  JobBatchArr["jobId"] =
    mappedItemData.length > 0
      ? `${currentdate} ${mappedItemData[0].startTime}`
      : "";
  JobBatchArr["ActivityLog"] = ActivityLog;
  console.log(JobBatchArr);

  const IT_CODE = itemmaster
    .filter((item) => parseInt(item.nodeId) === parseInt(nodeId))
    .map((item) => item.nodeName);

  console.log(IT_CODE);

  const getMaxStartTime = () => {
    //const activityDetail = ActivityLog.filter((item) => item?.)
    const lastShiftNumber = filtered[filtered.length - 1]?.Shift;
    const currrentShift = Activity?.shiftNumber;

    let lastOccurrenceOfShift = [];
    ActivityLog.forEach((item, index) => {
      if (
        item?.Shift == currrentShift &&
        item?.date?.split("T")[0] == Activity?.currentdate &&
        item?.nodeId == nodeId
      ) {
        lastOccurrenceOfShift = [item, index];
      }
    });
    if (lastOccurrenceOfShift?.length > 0) {
      const index = lastOccurrenceOfShift[1];
      return formatShiftEnddate()[index];
    }
    if (lastShiftNumber < currrentShift) {
      return Activity.startShiftData > Activity.EndShiftData
        ? Activity.startShiftData
        : Activity.EndShiftData;
    } else {
      return Activity.startShiftData;
    }
  };

  const getOutputsData = () => {
    console.log(Edgedetails);
    return Edgedetails.filter(
      (item) => item.sourceNodeId == nodeId && item.routeId == routeId
    );
  };

  const setDataForInputs = () => {
    const inputValue = Edgedetails.filter(
      (item) => item.targetNodeId == nodeId && item.routeId == routeId
    );
    const inputNodesFromEdge = inputValue.map((item) => item.sourceNodeId);
    let inputQty = inputNodesFromEdge.map((item) => {
      const matchingItems = ITMapping.filter(
        (item1) => item1.nodeIdFG == fgId && item1.nodeId == item
      );
      return matchingItems.length > 0 ? matchingItems : item;
    });
    inputQty = inputQty[0]?.length ? inputQty[0] : inputQty;
    const inputsData = inputQty?.map((item) =>
      batchdetails.filter(
        (item1) =>
          item?.nodeIdRM == item1.ItemCode ||
          (item == item1?.MaterialId && jobId == item1?.jobId)
      )
    );
    const lastOccurrences = {};
    let inputData = inputsData.map((item) =>
      item.reverse().filter((item) => {
        if (!lastOccurrences[item.activityId]) {
          lastOccurrences[item.activityId] = item;
          if (item?.Balancequantity1 > 0 || item?.Balancequantity2 > 0)
            return true;
        }
        return false;
      })
    );

    if (
      inputQty[0]?.nodeCategory == "Raw Material" ||
      inputQty[0]?.nodeCategory === "RM-Film" ||
      inputQty[0]?.nodeCategory === "RM-Fabric"
    ) {
      inputData = inputData.filter((item) => item.length);
      inputData[0][0]["item"] = inputQty?.map((item) => item?.nodeIdRM);
      return [inputData];
    }
    return inputData;
  };

  const getInputsData = () => {
    const inputData = setDataForInputs();
    if (inputData[0]?.length && inputData[0][0]?.length) {
      setInputsData(
        inputData?.map((item) => ({
          materialId: item[0][0]?.MaterialId,
          item: item[0][0]?.item,
          itemCode: "",
          batchDetails: item,
          isPlus: true,
          isMinus: false,
          isPrimary: true,
          index: 1,
        }))
      );
      setSendToInput(
        inputData?.map((item) => ({
          materialId: item[0][0]?.MaterialId,
          item: item[0][0]?.item,
          itemCode: "",
          batchDetails: item,
          isPlus: true,
          isMinus: false,
          isPrimary: true,
          index: 1,
        }))
      );
    } else {
      setInputsData(
        inputData?.map((item) => ({
          materialId: item[0]?.MaterialId,
          itemCode: item[0]?.item,
          batches: item,
          isPlus: true,
          isMinus: false,
          isPrimary: true,
          index: 1,
        }))
      );
      setSendToInput(
        inputData?.map((item) => ({
          materialId: item[0]?.MaterialId,
          itemCode: item[0]?.item,
          batches: item,
          isPlus: true,
          isMinus: false,
          isPrimary: true,
          index: 1,
        }))
      );
    }
    // setInputsForCurrentNode(inputData);
  };

  const getNodeDetail = (item) => {
    return nodedata.filter((item1) => item1.nodeId === item.targetNodeId)[0];
  };
  const nodesBasedonShift = () => {
    const filteredItems = JobAssign.filter(
      (item) =>
        item?.shift?.shiftNumber == shiftData &&
        item.date.split("T")[0] === currentdate
    ).map((item) => ({
      nodes: item.node.nodeName,
      NODEID: item.node.nodeId,
    }));
    let unique = {};
    let uniqueItems = [];
    // const uniqueItems = filteredItems.forEach((item,index) => filteredItems.indexOf(item) === index);
    filteredItems.forEach((item) => {
      if (!unique[item.NODEID]) {
        uniqueItems.push(item);
        unique[item.NODEID] = item.NODEID;
      }
    });
    return uniqueItems;
  };

  const getUnits = (nodeId, unitType) => {
    const nodeDetail = nodedata?.filter((item) => item?.nodeId == nodeId);
    return unitType == 1 ? nodeDetail[0]?.units1 : nodeDetail[0]?.units2;
  };

  const setOutputQuantityValues = () => {
    const getNodeCategory = (item) =>
      getNodeDetail({ targetNodeId: item?.targetNodeId })?.nodeCategory;
    // const quantities = getOutputsData();
    const initialQuantityValues = getOutputsData().map((item, index) => ({
      nodeId: item?.targetNodeId,
      nodeCategory: getNodeCategory(item),
      //isPlus: getNodeCategory(item) != 'Waste' ? true : false,
      //isMinus: false, isPrimary: true,
      nodeName: getNodeDetail(item)?.nodeName,
      index: 1, //tells the no of batches added
      position: index, // tells the position of item in current array
      units1: getUnits(item?.targetNodeId, 1),
      units2: getUnits(item?.targetNodeId, 2),
      outputType: index + 1, // tells the no of outputs
    })); // Initialize with 0 for each row
    setQuantityValues(initialQuantityValues);
    setSendToOutput(initialQuantityValues);
  };

  const handlequantityBasedOnRollSlit = () => {
    let updatedQuantityValues = [...quantityValues];
    //let conversionRate = getConversionRate();
    let conversionrate = rollSlitEnabled ? conversionRate / 2 : conversionRate;
    updatedQuantityValues = updatedQuantityValues?.map((item) => {
      if (item?.nodeCategory != "Waste" && item?.outputType == 1) {
        return {
          ...item,
          quantity1: (item?.quantity2 / conversionrate).toFixed(2),
        };
      } else if (item?.nodeCategory != "Waste") {
        return {
          ...item,
          quantity1: "",
          quantity2: "",
        };
      }
      return item;
    });
    setQuantityValues(updatedQuantityValues);
  };

  function getNodeName(nodeId) {
    const node = nodedata.find((item) => item.nodeId == nodeId);
    return node ? node.nodeName : "Not Found";
  }

  const [MaintenanceDesc, setMaintenanceDesc] = useState();
  const HandleDescription = (e) => {
    setMaintenanceDesc(e.target.value);
  };
  const [BreakDownDesc, setBreakDownDesc] = useState();
  const HandleBreakDownDescription = (e) => {
    setBreakDownDesc(e.target.value);
  };

  const getRecentActivity = () => {
    // console.log(ActivityLog);
    const activityArr = ActivityLog.filter(
      (item) => parseInt(item.nodeId) === parseInt(Activity.nodeId)
    ).map((item) => item.id);
    return activityArr[activityArr.length - 1];
  };

  const HandleSubmitMaintenance = () => {
    const payload = {
      MaintenanceId: getRecentActivity().toString(),
      MachineId: Activity?.nodeId,
      Description: MaintenanceDesc,
      StartDate: Activity?.startShiftData,
      EndDate: Activity?.EndShiftData,
      userId: auth?.empId.toString(),
    };
    console.log(payload, "payload");
    axios
      .post(`${BASE_URL}/api/maintenance`, payload)
      .then((res) => {
        console.log(res, "payload");
        CancelSubmit()
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  const HandleSubmitBreakDown = () => {
    const payload = {
      BreakDowneId : getRecentActivity().toString(),
      Reason : BreakDownDesc,
      date : currentdate,
      Department : "",
      Equipment : Activity?.nodeId,
      userId: auth?.empId.toString(),
    };
    console.log(payload, "payload");
    axios
      .post(`${BASE_URL}/api/breakdown`, payload)
      .then((res) => {
        console.log(res, "payload");
        CancelSubmit()
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

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
      <div className="container-fluid">
        <div className="row" style={{
          // height: tableHeight ? tableHeight : '200px',
          height:  height,
          overflowY: "scroll",
          overflowX :"hidden"
        }}>
          <div className="col-12">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Activity Id</th>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Node Id</th>
                  <th>Description</th>
                  <th style={{ width: "150px" }}>Activity Start Time</th>
                  <th>Activity End Time</th>
                  <th>Activity type</th>
                  <th>Job Id</th>
                  <th>Job Description</th>
                  <th>Employee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Activitydata.filter(
                  (item) =>
                    item?.jobId == JobfromOperations?.item &&
                    item?.nodeId == JobfromOperations?.nodeId
                ).map((item) => (
                  <tr>
                    <td>{item.id}</td>
                    <td>{formatIndianDate(item.date)}</td>
                    <td>{item.Shift}</td>
                    <td>{item.nodeId}</td>
                    <td>{getNodeDescription(item.nodeId)}</td>
                    <td>{get24format(item.shiftStartTime)}</td>
                    <td>{get24format(item.shiftEndTime)}</td>
                    <td>{item.activityType}</td>
                    <td>{item.jobId}</td>
                    <td>{getJobDescription(item.jobId)}</td>
                    <td>{item.employeeName}</td>
                    <td></td>
                  </tr>
                ))}
                {isNewRowActive && (
                  <tr>
                    <td></td>
                    <td>
                      <input
                        type="date"
                        value={currentdate.split("T")[0]}
                        style={{ height: "20px", width: "90px" }}
                        onChange={HandleDate}
                        disabled={type === "edit" ? true : false}
                      />
                    </td>
                    <td>
                      <select
                        // className="form-control mt-1"
                        id="shift"
                        name="shift"
                        style={{ height: "20px", width: "50px" }}
                        onChange={handleShiftData}
                        value={shiftData}
                        disabled={type === "edit" ? true : false}
                        required
                      >
                        <option value="" hidden>
                          Shift
                        </option>
                        {shiftdata.map((item) => (
                          <option>{item.shiftNumber}</option>
                        ))}
                      </select>
                    </td>
                    <td colSpan={2}>
                      <select
                        // className="form-control mt-1"
                        id="NodeId"
                        name="NodeId"
                        onChange={HandlenodeId}
                        value={getNodeName(Activity.nodeId || nodeId)}
                        required
                        style={{ width: "130px", height: "20px" }}
                        disabled={type === "edit" ? true : false}
                      >
                        <option value="" hidden>
                          Node
                        </option>
                        {nodesBasedonShift()?.map((item) => (
                          <option key={item.nodes} value={item.nodes}>
                            {item.NODEID} - {item.nodes}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ width: "100px" }}>
                      {filtered.length > 0 ? (
                        // filtered
                        //   .map((item) => (
                        <input
                          // className="form-control mt-1"
                          disabled
                          value={getMaxStartTime()}
                          step={1}
                          style={{
                            border: "none",
                            color: "black",
                            width: "125px",
                            backgroundColor: "transparent",
                          }}
                        />
                      ) : (
                        // ))
                        // mappedItemData.length >0?
                        mappedItemData.map((item) => (
                          <input
                            name="shiftStartTime"
                            disabled
                            // value={EndShiftData}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "black",
                              width: "125px",
                            }}
                            value={
                              Activity.startShiftData ||
                              activityData?.shiftStartTime
                            }
                            step={1}
                          />
                        ))
                      )}
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        name="shiftEndTime"
                        id="enddate"
                        onChange={HandleEndDate}
                        value={enddate ? enddate : getFormatCurrentEndTime()}
                        step={1}
                        style={{ width: "148px", height: "20px" }}
                        disabled={type === "edit" ? true : false}
                      />
                    </td>
                    <td>
                      <select
                        id="activityType"
                        name="activityType"
                        onChange={HandleActivity}
                        style={{ width: "80px", height: "20px" }}
                        value={activityType}
                        disabled={type === "edit" ? true : false}
                        required
                      >
                        <option value="" hidden>
                          Please Select
                        </option>
                        <option value="ON">ON</option>
                        <option value="OFF">OFF</option>
                        <option value="Maintenance">MAINTENANCE</option>
                        <option value="BreakDown">BREAKDOWN</option>
                        <option value="Holiday">HOLIDAY</option>
                      </select>
                    </td>
                    <td colSpan={2}>
                      <select
                        type="number"
                        id="jobId"
                        name="jobId"
                        style={{ width: "80px", height: "20px" }}
                        onChange={HandleJobId}
                        disabled={type === "edit" ? true : false}
                        value={activityType == "ON" ? jobId || "" : ""}
                      >
                        <option value="" hidden>
                          Job Id
                        </option>
                        {JobAssign.filter(
                          (item) =>
                            item?.shift?.shiftNumber === shiftData &&
                            item.node.nodeId === parseInt(nodeId) &&
                            new Date(item.date).getTime() ===
                              new Date(currentdate).getTime() &&
                            item.date.split("T")[0] === currentdate
                        ).map((item) => (
                          <option key={item.jobId} value={item.jobId}>
                            {item.jobId} - {getJobDescription(item.jobId)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{getEmployeeName(auth.empId)}</td>

                    <td>
                      <button
                        style={{ border: "none", background: "transparent" }}
                        onClick={() => CancelSubmit()}
                      >
                        <FaXmark style={{ color: "red" }} />
                      </button>{" "}
                      &nbsp;
                      <button
                        style={{ border: "none", background: "transparent" }}
                        onClick={handleSubmit}
                      >
                        <FaArrowCircleRight style={{ color: "green" }} />
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="">
              <Button
                onClick={handleAddNewRow}
                style={{ marginLeft: "5px" }}
                id="addbutton"
              >
                <FaPlus /> &nbsp; Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          sx={{
            "& .MuiDialog-paper": {
              width: "80%", // Set desired width
              maxWidth: "none", // Disable default maxWidth
              height: "40%", // Set desired height
              maxHeight: "none", // Disable default maxHeight
            },
          }}
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            {RecentActivitydata?.activityType}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Maintenance Id</th>
                    <th>Machine Id</th>
                    <th>Description</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{getRecentActivity()}</td>
                    <td>{RecentActivitydata?.nodeId}</td>
                    <td>
                      <textarea
                        onChange={HandleDescription}
                        value={MaintenanceDesc}
                        style={{ width: "100%", height: "20px" }}
                      ></textarea>
                    </td>
                    <td>{Activity?.startShiftData}</td>
                    <td>{Activity?.EndShiftData}</td>
                  </tr>
                </tbody>
              </table>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={HandleSubmitMaintenance}>Submit</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <React.Fragment>
        <Dialog
          open={openBreakDown}
          onClose={handleCloseBreakDown}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          sx={{
            "& .MuiDialog-paper": {
              width: "80%", // Set desired width
              maxWidth: "none", // Disable default maxWidth
              height: "40%", // Set desired height
              maxHeight: "none", // Disable default maxHeight
            },
          }}
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            {RecentActivitydata?.activityType}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>BreakDown Id</th>
                    <th>Machine Id</th>
                    <th>Description</th>
                    <th>date</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{getRecentActivity()}</td>
                    <td>{RecentActivitydata?.nodeId}</td>
                    <td>
                      <textarea
                        onChange={HandleBreakDownDescription}
                        value={BreakDownDesc}
                        style={{ width: "100%", height: "20px" }}
                      ></textarea>
                    </td>
                    <td>{currentdate}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={HandleSubmitBreakDown}>Submit</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}

export default OperationsJobActivity;
