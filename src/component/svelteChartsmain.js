import {
  MomentSvelteGanttDateAdapter,
  SvelteGantt,
  SvelteGanttDependencies,
  SvelteGanttTable,
} from "svelte-gantt";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants.js";
import { v4 as uuidv4 } from "uuid";
import { FaCheck } from "react-icons/fa";
import { AiFillCloseSquare } from "react-icons/ai";
import "./svelteCharts.css";

import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../context/AuthProvider.js";
import { IoFilterSharp } from "react-icons/io5";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SveltaWithDropDown = () => {
  const { auth } = React.useContext(AuthContext);
  const [newTaskDataa, setNewtaskData] = useState([]);
  const [Nodesdata, setNodesdata] = useState([]);
  const [locationdata, setLocationdata] = useState([]);
  const [colorConfigdata, setColorConfigdata] = useState([]);
  const [FilteredTruckHistory, setFilteredTruckHistory] = useState([]);
  const [FilteredExcavatorHistory, setFilteredExcavatorHistory] = useState([]);
  const ganttRef = useRef(null); // Reference to store the Gantt chart instance
  const ganttRef1 = useRef(null); // Reference to store the Gantt chart instance
  const [OpenLoader1, setOpenLoader1] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/locations`)
      .then((response) => {
        const filteredData = response.data.filter(
          (dbitem) => String(dbitem.branchId) === String(auth.branchId)
        );
        setLocationdata(filteredData);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/colorconfig`)
      .then((response) => {
        const filteredData = response.data.filter(
          (dbitem) => String(dbitem.branchId) === String(auth.branchId)
        );
        setColorConfigdata(filteredData);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }, []);

  // Time
  function time(input) {
    return moment(input, "HH:mm");
  }

  function getLocationName(item) {
    const location = locationdata.find((loc) => loc.location_id == item);
    return location ? location.location_name : " ";
  }

  const createDateTime = (dateString, timeString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };
  const createDateTime1 = (dateString, timeString) => {
    const [month, day, year] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const currentStart = time("05:00");
  const currentEnd = time("24:00");

  // Time ranges
  const timeRanges = [
    // {
    //   id: 0,
    //   from: time("13:00"),
    //   to: time("14:00"),
    //   classes: null,
    //   label: "Lunch",
    //   resizable: false,
    // },
    // {
    //   id: 1,
    //   from: time("21:00"),
    //   to: time("22:00"),
    //   classes: null,
    //   label: "Dinner",
    // },
  ];

  // Datas to load
  const ganttdata = {
    rows: [],
    tasks: [],
    dependencies: [],
  };

  const zoomLevels = [
    {
      headers: [
        { unit: "week", format: "w" },
        { unit: "day", format: "ddd - MMMM" },
        // { unit: "week", format: "w" },
        // { unit: "hour", format: "ddd, H" },
      ],
      minWidth: 3500,
      fitWidth: false,
    },
    {
      headers: [
        { unit: "week", format: "w" },
        { unit: "day", format: "MMMM Do" },
      ],
      minWidth: 5000,
      fitWidth: false,
    },
    {
      headers: [
        { unit: "day", format: "MMMM Do" },
        // { unit: "hour", format: "ddd D/M, H" }
        { unit: "hour", format: "H:00" },
      ],
      minWidth: 50000,
      fitWidth: false,
    },
    {
      headers: [
        { unit: "hour", format: "ddd D/MMMM" },
        { unit: "minute", format: "H:m" },
      ],
      minWidth: 1000000,
      fitWidth: false,
    },
    // {
    //   headers: [
    //     { unit: "minute",  format: "H:m", },
    //     { unit: "second", format: "m:s", classes: "gantt-header" },
    //   ],
    //   minWidth: 3000000,
    //   fitWidth: true,
    // },
  ];

  // Gantt options
  const options = {
    dateAdapter: new MomentSvelteGanttDateAdapter(moment),
    rows: ganttdata.rows,
    tasks: ganttdata.tasks,
    dependencies: ganttdata.dependencies,
    classes: "gantt-header",
    timeRanges,
    columnOffset: 15,
    magnetOffset: 15,
    rowHeight: 35,
    rowPadding: 5,
    fitWidth: true,
    minWidth: 1000,
    from: currentStart,
    headers: [
      // { unit: "month", format: "m" },
      // { unit: "day", format: "dd" },
      // { unit: 'week', format: 'w' },
      { unit: "day", format: "DD" },
    ],
    to: currentEnd,
    // layout:'pack',
    tableHeaders: [
      {
        title: "Machines",
        property: "label",
        width: 100,
        type: "tree",
        color: "red",
      },
    ],
    tableWidth: 150,
    ganttTableModules: [SvelteGanttTable],
    ganttBodyModules: [SvelteGanttDependencies],
    zoomLevels: zoomLevels,
    zoomFactor: 50, // Increase or decrease this value to control zoom speed
    // enableCreateTask: true,
    onCreateTask: ({ from, to, resourceId }) => {
      // Return the new task model
      return {
        id: uuidv4(), // Generate a unique ID
        resourceId,
        label: "New Task",
        from,
        to,
        classes: "new-task-class",
      };
    },
    onCreatedTask: (task) => {
      // Handle the newly created task
      setNewtaskData([...newTaskDataa, task]);
    },
    //     onTaskButtonClick : OntaskClick,
    taskElementHook: taskHoverAction, // Use the custom action here
  };

  const [tooltipdata, setTooltipData] = useState();
  const [showDropdown, setshowDropdown] = useState(false);
  const [xPosition, setxPosition] = useState();
  const [yPosition, setyPosition] = useState();
  const [YPositionContext, setYPositionContext] = useState();
  const [XPositionContext, setXPositionContext] = useState();
  const [updateIdData, setUpdatelist] = useState();

  function taskHoverAction(node, task, row) {
    function handleMouseEnter(event) {
      const tooltipWidth = 220; // adjust according to your tooltip content width
      const tooltipHeight = 145; // adjust according to your tooltip content height

      let x = event.clientX;
      let y = event.clientY;

      // Check if the tooltip will overflow the right side of the viewport
      if (x + tooltipWidth > window.innerWidth) {
        x = window.innerWidth - tooltipWidth;
      }

      // Check if the tooltip will overflow the bottom side of the viewport
      if (y + tooltipHeight > window.innerHeight) {
        y = window.innerHeight - tooltipHeight;
      }

      setxPosition(x);
      setyPosition(y);
      setTooltipData(task);
      setUpdatelist("");
    }

    function handleMouseLeave() {
      // Handle the mouse leave event if needed (e.g., hiding a tooltip)
      setTooltipData("");
    }

    function handleContextClick(event) {
      const ContainerWidth = 400; // adjust according to your tooltip content width
      const ContainerHeight = 450; // adjust according to your tooltip content height

      let x = event.clientX;
      let y = event.clientY;

      // Check if the tooltip will overflow the right side of the viewport
      if (x + ContainerWidth > window.innerWidth) {
        x = window.innerWidth - ContainerWidth;
      }

      // Check if the tooltip will overflow the bottom side of the viewport
      if (y + ContainerHeight > window.innerHeight) {
        y = window.innerHeight - ContainerHeight;
      }
      // Prevent the default context menu from appearing
      event.preventDefault();
      setTooltipData("");
      setYPositionContext(x);
      setXPositionContext(y);
      setUpdatelist(task);
    }

    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);
    node.addEventListener("contextmenu", handleContextClick);
    // node.addEventListener("click", handlePassid);

    return {
      destroy() {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
        node.removeEventListener("contextmenu", handleContextClick);
        // node.removeEventListener("click", handlePassid);
      },
    };
  }

  let counter = 0;

  function generateUniqueId() {
    return ++counter;
  }

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const [data3, setData3] = useState([]);

  const [maxTime, setMaxTime] = useState([]);
  const [minTime, setMinTime] = useState([]);
  const [mindate, setMinDate] = useState();
  const [maxdate, setMaxDate] = useState();
  const [showmindate, setShowMinDate] = useState([]);
  const [showmaxdate, setShowMaxDate] = useState([]);

  const [Mergeddata, setMergeddata] = useState([]);
  const [SortedData, setSortedData] = useState([]);

  const [exadata1, setExaData1] = useState([]);
  const [exadata2, setExaData2] = useState([]);

  const [examaxTime, setExaMaxTime] = useState([]);
  const [examinTime, setExaMinTime] = useState([]);
  const [examindate, setExaMinDate] = useState([]);
  const [examaxdate, setExaMaxDate] = useState([]);

  const [minFilteringdate, setMinFilteringDate] = useState();
  const [maxFilteringdate, setMaxFilteringDate] = useState();

  const [checkedItems, setCheckedItems] = useState(new Set());
  const [checkedJobItems, setCheckedJobItems] = useState(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState(true);
  const [selectAllJobChecked, setSelectAllJobChecked] = useState(true);

  const getNodeNames = (nodeId) => {
    const node = Nodesdata.find((node) => node?.nodeId == nodeId);
    return node ? node.nodeName : "Node not found";
  };

  const [filtereddate, setfiltereddate] = useState("");
  const handleFilterDate = (event) => {
    const dateValue = event.target.value;

    if (!dateValue) {
      // If the date is cleared, set the filtered date to an empty string
      setfiltereddate("");
    } else {
      // Parse the date string
      const [year, month, day] = dateValue.split("-");
      // Format the date to DD-MM-YYYY
      const indianDateFormat = `${day}-${month}-${year}`;
      setfiltereddate(indianDateFormat);
      setshowDropdown(false);
    }
  };

  useEffect(() => {
    if (filtereddate) {
      setfiltereddate(filtereddate);
    }
  }, [filtereddate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setOpenLoader1(true);
        // Fetch data from the API
        const [ActivityLog, nodesdata] = await Promise.all([
          axios.get(`${BASE_URL}/api/activitylog`),
          axios.get(`${BASE_URL}/api/nodemaster`),
        ]);
        setNodesdata(nodesdata.data);
        const getNodeName = (nodeId) => {
          const node = nodesdata.data.find((node) => node?.nodeId == nodeId);
          return node ? node?.nodeName : "Node not found";
        };

        // Sort the parsed data by AgentID and StartTime

        ActivityLog.data.sort((a, b) => {
          if (a.nodeId < b.nodeId) return -1;
          if (a.nodeId > b.nodeId) return 1;
          return 0;
        });

        setData2(ActivityLog.data);

        const startT = ActivityLog.data.map(
          (item) => new Date(item.shiftStartTime)
        );
        const endT = ActivityLog.data.map(
          (item) => new Date(item.shiftEndTime)
        );

        // Find the minimum date
        const minDate = new Date(
          Math.min(...startT.map((date) => date.getTime()))
        );
        const maxDate = new Date(
          Math.max(...endT.map((date) => date.getTime()))
        );

        // Format the date and time
        const date = minDate.toLocaleDateString("en-IN").replace(/\//g, "-"); // 'en-IN' for India Standard Time format
        const date1 = maxDate.toLocaleDateString("en-IN").replace(/\//g, "-"); // 'en-IN' for India Standard Time format

        const Mintime = minDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Set to true if you want 12-hour format
        });
        const Maxtime = maxDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Set to true if you want 12-hour format
        });

        setMaxTime(Maxtime);
        setMinTime(Mintime);
        setMinDate(date);
        setMaxDate(date1);

        const uniqueAgentIDs = new Set();
        const rowsData = ActivityLog.data
          .filter((data) => {
            if (uniqueAgentIDs.has(data.nodeId)) return false;
            uniqueAgentIDs.add(data.nodeId);
            return true;
          })
          .map((data1) => ({
            id: data1.nodeId,
            label: data1.nodeId + " - " + getNodeName(data1.nodeId),
            jobId: data1.jobId,
          }));

        const uniqueJobIDs = new Set();
        const jobsData = ActivityLog.data
          .filter((data) => {
            if (uniqueJobIDs.has(data.jobId)) return false;
            uniqueJobIDs.add(data.jobId);
            return true;
          })
          .map((data1) => ({
            id: data1.nodeId,
            label: data1.nodeId + " - " + getNodeName(data1.nodeId),
            jobId: data1.jobId,
            nodeName: getNodeName(data1.nodeId),
          }));

        setData1(rowsData);
        setData3(jobsData);
        // updateGanttChart(rowsData, parsedData2, checkedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filtereddate]);

  useEffect(() => {
    updateGanttChart(
      data1,
      data2,
      checkedItems,
      checkedJobItems,
      minTime,
      maxTime,
      mindate,
      maxdate
    );
  }, [
    checkedItems,
    data1,
    data2,
    checkedJobItems,
    minTime,
    maxTime,
    mindate,
    maxdate,
  ]);

  const updateGanttChart = (
    rowsData,
    parsedData2,
    checkedItems,
    checkedJobItems,
    minTime,
    maxTime,
    mindate,
    maxdate
  ) => {
    if (rowsData?.length > 0 && parsedData2?.length > 0) {
      const uniqueData = [...new Set(checkedItems)];
      const uniqueJobData = [...new Set(checkedJobItems)];
      if (ganttRef && ganttRef.current) {
        ganttRef.current.$destroy();
      }
      if (
        uniqueData.length === checkedItems.size &&
        uniqueJobData.length === checkedJobItems.size
      ) {
        setOpenLoader1(true);
        let allFilteredTasks = [];
        let filteredRowsdata = [];
        let fromTime;
        let toTime;

        // Filtering Tasks to show in the charts --------
        uniqueData.forEach((uniquItem) => {
          setOpenLoader1(true);
          const filteredData = data2.filter(
            (item) => String(item.nodeId) === String(uniquItem)
          );
          console.log(data2, "checkchartss");
          console.log(filteredData, "checkchartss");

          const tasksData = filteredData
            .map((data) => {
              try {
                const date = new Date(data.shiftStartTime);
                const date1 = new Date(data.shiftEndTime);

                const options = {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                };
                const options1 = {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                };

                const ST = date.toLocaleTimeString([], options);
                const ET = date1.toLocaleTimeString([], options1);

                fromTime = createDateTime1(mindate, ST);
                toTime = createDateTime1(maxdate, ET);

                const task = {
                  id: uuidv4(),
                  resourceId: data.nodeId,
                  label: " ",
                  from: fromTime,
                  to: toTime,
                  classes: "",
                  enableResize: false,
                  enableDragging: false,
                  missionId: data.MissionID,
                  jobId: data.jobId,
                  ActivutyId: data.id,
                };
                console.log(task, "sveltee");
                return task;
              } catch (error) {
                console.error("Error processing task data:", data, error);
                return null;
              }
            })
            .filter((task) => task !== null);
            allFilteredTasks = allFilteredTasks.concat(tasksData);
          });
          console.log(allFilteredTasks, "checkcharts");

        setOpenLoader1(false); // Stop loader after array operations
        const { rows, tasks, from, to, ...restOptions } = options;
        ganttRef.current = new SvelteGantt({
          target: document.getElementById("example-gantt"),
          props: {
            ...restOptions,
            rows: rowsData,
            tasks: allFilteredTasks,
            from: createDateTime(mindate, minTime),
            to: createDateTime(maxdate, maxTime),
          },
        });
      } else if (!uniqueData?.length) {
        const tasksData = parsedData2
          .filter((item) => item?.id !== null)
          .map((data) => {
            try {
              if (!data.StartTime || !data.EndTime)
                throw new Error("Missing StartTime or EndTime");

              const startTime = data.StartTime.split(" ")[1];
              const endTime = data.EndTime.split(" ")[1];
              const fromTime = createDateTime("16-04-2024", startTime);
              const toTime = createDateTime("16-04-2024", endTime);

              if (!fromTime || !toTime) throw new Error("Invalid time format");

              let taskClass = "";
              switch (data.OperationType) {
                case "update":
                  taskClass = "task-update";
                  break;
                case "create":
                  taskClass = "task-create";
                  break;
                case "delete":
                  taskClass = "task-delete";
                  break;
                default:
                  taskClass = "";
              }

              const task = {
                id: generateUniqueId(),
                resourceId: data.AgentID,
                label: data.OperationType,
                from: fromTime,
                to: toTime,
                classes: taskClass,
                enableResize: false,
                enableDragging: false,
                missionId: data.MissionID,
              };
              return task;
            } catch (error) {
              console.error("Error processing task data:", data, error);
              return null;
            }
          })
          .filter((task) => task !== null);

        const { rows, tasks, ...restOptions } = options;

        ganttRef.current = new SvelteGantt({
          target: document.getElementById("example-gantt"),
          props: { ...restOptions, rows: rowsData, tasks: tasksData },
        });
      }
    }
  };

  useEffect(() => {
    if (selectAllChecked) {
      setCheckedItems(new Set(data1?.map((item) => item.id)));
    }
  }, [data1]);

  useEffect(() => {
    if (selectAllJobChecked) {
      setCheckedJobItems(new Set(data3?.map((item) => item.jobId)));
    }
  }, [data3]);

  const handleClose = () => {
    setshowDropdown(false);
  };

  // Handler for individual checkboxes
  const handleCheckboxChange = (e, itemId) => {
    const newCheckedItems = new Set(checkedItems);
    if (e.target.checked) {
      newCheckedItems.add(itemId);
    } else {
      newCheckedItems.delete(itemId);
    }
    setCheckedItems(newCheckedItems);
    setSelectAllChecked(false);
  };

  // Handler for the "select all" checkbox
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      // Add all item IDs to the checkedItems set
      setCheckedItems(new Set(data2.map((item) => item.shift_id)));
    } else {
      // Clear the checkedItems set
      setCheckedItems(new Set());
    }
    setSelectAllChecked(!selectAllChecked);
  };

  return (
    <div className="container-fluid mt-3">
      <div id="example-gantt"></div>
      {OpenLoader1 && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={OpenLoader1}
          // onClick={handleClose}
        >
          <CircularProgress size={80} color="inherit" />
        </Backdrop>
      )}
    </div>
  );
};

export default SveltaWithDropDown;
