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
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants.js";
import { v4 as uuidv4 } from "uuid";
import { RiFilter3Fill } from "react-icons/ri";
import { IoCloseCircle } from "react-icons/io5";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaSistrix } from "react-icons/fa6";
import { format } from "date-fns";
import "./svelteCharts.css";

const SveltaWithDB = () => {
  const [newTaskDataa, setNewtaskData] = useState([]);
  const [Nodesdata, setNodesdata] = useState([]);
  const [batchdata, setBatchdata] = useState([]);
  const ganttRef = useRef(null); // Reference to store the Gantt chart instance

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/batch`)
      .then((response) => {
        setBatchdata(response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  }, []);

  // Time
  function time(input) {
    return moment(input, "HH:mm");
  }

  function getOutputQunatity(activtyId) {
    console.log(activtyId, "OOO");
    const act = batchdata.find((act) => act.consumedActivityId == activtyId);
    return act ? act.consumedActivityId : " ";
  }

  const createDateTime = (dateString, timeString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };
  const createDateTime1 = (dateString, timeString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const currentStart = time("05:00");
  const currentEnd = time("24:00");

  // Time ranges
  const timeRanges = [{}];

  // Datas to load
  const ganttdata = {
    rows: [],
    tasks: [],
    dependencies: [],
  };

  const zoomLevels = [
    {
      headers: [
        // { unit: "week", format: "w" },
        // { unit: "hour", format: "ddd D/MMMM, H" },
        { unit: "month", format: "MMMM YYYY" }, // Added month unit
        { unit: "day", format: "DD-MM-YYYY" },
      ],
      minWidth: 1000,
      fitWidth: false,
    },
    {
      headers: [
        { unit: "day", format: "MMMM Do" },
        { unit: "hour", format: "HH:mm" },
      ],
      minWidth: 10000,
      fitWidth: false,
    },
    // {
    //   headers: [
    //     { unit: "day", format: "MMMM Do" },
    //     // { unit: "hour", format: "ddd D/M, H" }
    //     { unit: "hour", format: "ddd, H" },
    //   ],
    //   minWidth: 800,
    //   fitWidth: false,
    // },
    // {
    //   headers: [
    //     { unit: "hour", format: "ddd D/MMMM" },
    //     { unit: "minute", format: "H:m" },
    //   ],
    //   minWidth: 800000,
    //   fitWidth: false,
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
    columnOffset: 30,
    magnetOffset: 150,
    rowHeight: 35,
    rowPadding: 5,
    fitWidth: true,
    // minWidth: 500000,
    minWidth: 10000,
    from: currentStart,
    to: currentEnd,
    tableHeaders: [
      {
        title: "Machines",
        property: "label",
        width: 140,
        type: "tree",
        color: "red",
      },
    ],
    tableWidth: 160,
    ganttTableModules: [SvelteGanttTable],
    ganttBodyModules: [SvelteGanttDependencies],
    zoomLevels: zoomLevels,
    headers: [
      // { unit: "day", format: "dd" },
      // { unit: "day", format: "DD" },
      // { unit: "hour", format: "hh" },
      // {unit:'',format:''},
      { unit: "month", format: "MMMM YYYY" }, // Added month unit
      { unit: "day", format: "DD-MM-YYYY" },
      // { unit: 'week', format: 'w' },
      // { unit: 'hour', format: 'HH:MM' }
    ],
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
      console.log("Task created:", task);
      setNewtaskData([...newTaskDataa, task]);
    },
    //     onTaskButtonClick : OntaskClick,
    taskElementHook: taskHoverAction, // Use the custom action here
  };

  const [tooltipdata, setTooltipData] = useState();
  const [showDropdown, setshowDropdown] = useState(false);
  const [showJobDropdown, setshowJobDropdown] = useState(false);
  const [xPosition, setxPosition] = useState();
  const [yPosition, setyPosition] = useState();
  const [YPositionContext, setYPositionContext] = useState();
  const [XPositionContext, setXPositionContext] = useState();
  const [updateIdData, setUpdatelist] = useState();
  const [legenddata, setLegend] = useState([]);

  function taskHoverAction(node, task, row) {
    function handleMouseEnter(event) {
      const tooltipWidth = 220; // adjust according to your tooltip content width
      const tooltipHeight = 225; // adjust according to your tooltip content height

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

    return {
      destroy() {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
        node.removeEventListener("contextmenu", handleContextClick);
      },
    };
  }

  let counter = 0;

  function generateUniqueId() {
    return ++counter;
  }

  const [data1, setData1] = useState([]);
  const [ganttRowData, setGanttRowdata] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [maxTime, setMaxTime] = useState([]);
  const [minTime, setMinTime] = useState([]);
  const [mindate, setMinDate] = useState();
  const [maxdate, setMaxDate] = useState();
  const [date, setDate] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [checkedJobItems, setCheckedJobItems] = useState(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState(true);
  const [selectAllJobChecked, setSelectAllJobChecked] = useState(true);

  const getNodeNames = (nodeId) => {
    const node = Nodesdata.find((node) => node?.nodeId == nodeId);
    return node ? node.nodeName : "Node not found";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        // const date = minDate.toLocaleDateString("en-IN").replace(/\//g, "-"); // 'en-IN' for India Standard Time format
        const date = minDate.toLocaleDateString("en-GB").replace(/\//g, "-");
        // const date1 = maxDate.toLocaleDateString("en-IN").replace(/\//g, "-"); // 'en-IN' for India Standard Time format
        const date1 = maxDate.toLocaleDateString("en-GB").replace(/\//g, "-");

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

        setDate(date);
        setMaxTime(Maxtime);
        setMinTime(Mintime);
        setMinDate(date);
        setMaxDate(date1);

        console.log(Maxtime, "checkdateandTime");
        console.log(Mintime, "checkdateandTime");
        console.log(date, "checkdateandTime");
        console.log(date1, "checkdateandTime");

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
            activityType: data1.activityType,
          }));

        console.log(rowsData, "checkingrowdata");
        console.log(ActivityLog.data, "checkingrowdata");
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
            classes: "RowClass",
          }));
        setData1(rowsData);
        setGanttRowdata(rowsData);
        setData3(jobsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [RowFilteredData, setRowFilteredData] = useState([]);
  useEffect(() => {
    const uniqueData = [...new Set(checkedItems)];
    // Filtering Tasks to show in the charts --------
    let filteredRowsdata = [];
    uniqueData.forEach((item) => {
      const filteredrows = ganttRowData.filter(
        (item1) => String(item1.id) === String(item)
      );
      filteredRowsdata.push(...filteredrows);
    });
    setRowFilteredData(filteredRowsdata);
  }, [checkedItems, ganttRowData]);
  useEffect(() => {
    updateGanttChart(
      data1,
      data2,
      checkedItems,
      checkedJobItems,
      minTime,
      maxTime,
      mindate,
      maxdate,
      RowFilteredData
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
    RowFilteredData,
  ]);

  const updateGanttChart = (
    rowsData,
    parsedData2,
    checkedItems,
    checkedJobItems,
    minTime,
    maxTime,
    mindate,
    maxdate,
    dataaaa
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
        let allFilteredTasks = [];
        let filteredRowsdata = [];
        const legendData = []; // Array to hold jobId and color for legend
        let fromTime;
        let toTime;

        console.log(data2,"data2data2")
        // Filtering Tasks to show in the charts --------
        uniqueData.forEach((item) => {
          const filteredrows = data2.filter((item1) => String(item1.nodeId) === String(item));
          filteredRowsdata.push(...filteredrows);
        });

        const getNodeNames = (nodeId) => {
          const node = Nodesdata.find((node) => node?.nodeId == nodeId);
          return node ? node.nodeName : "Node not found";
        };

        console.log(filteredRowsdata,"filteredRowsdata")
        const uniqueAgentIDs = new Set();
        const rowsData1 = filteredRowsdata
          .filter((data) => {
            if (uniqueAgentIDs.has(data.nodeId)) return false;
            uniqueAgentIDs.add(data.nodeId);
            return true;
          })
          .map((data1) => ({
            id: data1.nodeId,
            // label: data1.nodeId,
            label: data1.nodeId + " - " + getNodeNames(data1.nodeId),
            jobId: data1.jobId,
            activityType: data1.activityType,
          }));
       

        uniqueJobData.forEach((uniqueItem) => {
          const filteredData = filteredRowsdata.filter(
            (item) => String(item.jobId) === String(uniqueItem)
          );
          // Function to generate a unique color
          function generateColor() {
            const letters = "0123456789ABCDEFGHIJLMNOPRSTUVWXYZ";
            let color = "#";
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }

          // Map to store jobId to color mapping
          const jobIdToColorMap = new Map();

          // Create a style element
          const styleElement = document.createElement("style");
          document.head.appendChild(styleElement);
          const styleSheet = styleElement.sheet;
          const tasksData = filteredData
            .map((data) => {
              try {
                if (!data.shiftStartTime || !data.shiftEndTime)
                  throw new Error("Missing StartTime or EndTime");

                // ------------------------------
                const startT = new Date(data.shiftStartTime)
                const endT = new Date(data.shiftEndTime)

                // Find the minimum date
                const minDate = new Date(Math.min(startT.getTime()));
                const maxDate = new Date(Math.max(endT.getTime()));

                // Format the date and time
                // const date = minDate.toLocaleDateString("en-IN").replace(/\//g, "-"); // 'en-IN' for India Standard Time format
                const datee = minDate.toLocaleDateString("en-IN").replace(/\//g, "-");
                // const date1 = maxDate.toLocaleDateString("en-IN").replace(/\//g, "-"); // 'en-IN' for India Standard Time format
                const datee1 = maxDate.toLocaleDateString("en-IN").replace(/\//g, "-");

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
                // ------------------------------

                // Find Max Endtime and Min Starttime
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

                fromTime = createDateTime1(datee, ST);
                toTime = createDateTime1(datee1, ET);

                console.log(fromTime,"settingup")
                console.log(toTime,"settingup")

                // Retrieve color for the jobId or generate a new one
                let color;
                let borderRadius;
                let border;
                let className;
                if (jobIdToColorMap.has(data.jobId)) {
                  color = jobIdToColorMap.get(data.jobId).color;
                  borderRadius = "100%";
                  border = "1px solid red";
                  className = jobIdToColorMap.get(data.jobId).className;
                } else {
                  color = generateColor();
                  className = `jobId-${data.jobId}`;
                  borderRadius = "100%";
                  border = "1px solid red";
                  jobIdToColorMap.set(data.jobId, { color, className });

                   // Add to legend data
                  legendData.push({ jobId: data.jobId, color });
                   setLegend(legendData);

                  // Add the CSS rule for the new class
                  styleSheet.insertRule(
                    `.${className} { background-color: ${color}; border-radius:${borderRadius}; }`,
                    styleSheet.cssRules.length
                  );
                  styleSheet.insertRule(
                    `.${className}:hover { background-color: ${color}; }`,
                    styleSheet.cssRules.length
                  );
                }

                const task = {
                  id: uuidv4(),
                  resourceId: data.nodeId,
                  label: " ",
                  from: createDateTime1(datee, ST),
                  to: createDateTime1(datee1, ET),
                  classes: className,
                  enableResize: false,
                  enableDragging: false,
                  missionId: data.MissionID,
                  jobId: data.jobId,
                  ActivutyId: data.id,
                  activityType:data.activityType
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

        console.log(allFilteredTasks);

        const tasksData = data2
          .map((data) => {
            try {
              if (!data.shiftStartTime || !data.shiftEndTime)
                throw new Error("Missing StartTime or EndTime");

              // Find Max Endtime and Min Starttime
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

              fromTime = createDateTime(mindate, ST);
              toTime = createDateTime(maxdate, ET);

              // Retrieve color for the jobId or generate a new one
              // let color;
              // let borderRadius;
              // let border;
              // let className;
              // if (jobIdToColorMap.has(data.jobId)) {
              //   color = jobIdToColorMap.get(data.jobId).color;
              //   borderRadius = "100%";
              //   border = "1px solid red";
              //   className = jobIdToColorMap.get(data.jobId).className;
              // } else {
              //   color = generateColor();
              //   className = `jobId-${data.jobId}`;
              //   borderRadius = "100%";
              //   border = "1px solid red";
              //   jobIdToColorMap.set(data.jobId, { color, className });

              //   // Add the CSS rule for the new class
              //   styleSheet.insertRule(
              //     `.${className} { background-color: ${color}; border-radius:${borderRadius}; }`,
              //     styleSheet.cssRules.length
              //   );
              //   styleSheet.insertRule(
              //     `.${className}:hover { background-color: ${color}; }`,
              //     styleSheet.cssRules.length
              //   );
              // }

              const task = {
                id: uuidv4(),
                resourceId: data.nodeId,
                label: " ",
                from: fromTime,
                to: toTime,
                // classes: className,
                enableResize: false,
                enableDragging: false,
                missionId: data.MissionID,
                jobId: data.jobId,
                ActivutyId: data.id,
              };
              return task;
            } catch (error) {
              console.error("Error processing task data:", data, error);
              return null;
            }
          })
          .filter((task) => task !== null);

        const { rows, tasks, from, to, ...restOptions } = options;
        ganttRef.current = new SvelteGantt({
          target: document.getElementById("example-gantt"),
          props: {
            ...restOptions,
            rows: rowsData1,
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

  const handledropdown = () => {
    setshowDropdown(!showDropdown);
    setshowJobDropdown(false);
  };

  const handleJobdropdown = () => {
    setshowJobDropdown(!showJobDropdown);
    setshowDropdown(false);
  };

  const handleClose = () => {
    setshowDropdown(false);
  };

  const handleJobClose = () => {
    setshowJobDropdown(false);
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

  // Handler for individual checkboxes
  const handleJobCheckboxChange = (e, itemId) => {
    const newCheckedItems = new Set(checkedJobItems);
    if (e.target.checked) {
      newCheckedItems.add(itemId);
    } else {
      newCheckedItems.delete(itemId);
    }
    setCheckedJobItems(newCheckedItems);
    setSelectAllJobChecked(false);
  };

  // Handler for the "select all" checkbox
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      // Add all item IDs to the checkedItems set
      setCheckedItems(new Set(data1.map((item) => item.id)));
    } else {
      // Clear the checkedItems set
      setCheckedItems(new Set());
    }
    setSelectAllChecked(!selectAllChecked);
  };

  // Handler for the "select all" checkbox
  const handleSelectAllJobChange = (e) => {
    if (e.target.checked) {
      // Add all item IDs to the checkedJobsItems set
      setCheckedJobItems(new Set(data3.map((item) => item.jobId)));
    } else {
      // Clear the checkedJobItems set
      setCheckedJobItems(new Set());
    }
    setSelectAllJobChecked(!selectAllJobChecked);
  };

  // Update usestate variables ------

  const [label, setLabel] = useState(updateIdData?.label);
  const [TaskId, settaskid] = useState(updateIdData?.TaskId);

  // Log checkedItems whenever it changes
  useEffect(() => {
    setLabel(updateIdData?.label);
    settaskid(updateIdData?.TaskId);
  }, [updateIdData]);

  const ConvertIntotime = (item) => {
    const Mintime = item.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Set to true if you want 12-hour format
    });
    return Mintime;
  };

  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchVisible, setSearchVisible] = useState(false);

  const [NodesearchInput, setNodeSearchInput] = useState("");
  const [NodefilteredResults, setNodeFilteredResults] = useState([]);
  const [isNodeSearchVisible, setNodeSearchVisible] = useState(false);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = data1.filter((item) => {
      const Itemname = String(item.id).toLowerCase(); // Convert to string
      const nodename = String(getNodeNames(item.id)).toLowerCase(); // Convert to string
      console.log(nodename, "search");
      console.log(searchValue, "search");
      return (
        Itemname.includes(searchValue.toLowerCase()) ||
        nodename.includes(searchValue.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  // Ramesh changes for filter & search
  const searchNodesItems = (searchValue) => {
    setNodeSearchInput(searchValue);
    const filteredData = data3.filter((item) => {
      const Itemname = String(item.jobId).toLowerCase();
      return Itemname.includes(searchValue.toLowerCase());
    });
    setNodeFilteredResults(filteredData);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput("");
  };

  const toggleNodeSearch = () => {
    setNodeSearchVisible(!isNodeSearchVisible);
    setNodeSearchInput("");
  };
  console.log(legenddata, "legenddata");
  return (
    <div className="">
      <div className="row mt-3" style={{ borderBottom: "1px solid #E8E8EB" }}>
        <div
          className="col-12 d-flex justify-content-end"
          style={{ position: "relative", opacity: 1 }}
        >
          <div
            className="btn mb-1"
            style={{ border: "1px solid #ECECEF", display: "flex" }}
            onClick={handledropdown}
          >
            Machine &nbsp;
            <RiFilter3Fill className="mt-1" />
          </div>
          &nbsp;&nbsp;
          <div
            className="btn mb-1"
            style={{ border: "1px solid #ECECEF", display: "flex" }}
            onClick={handleJobdropdown}
          >
            Job &nbsp;
            <RiFilter3Fill className="mt-1" />
          </div>
        </div>
      </div>
      <div id="legend">
        <div style={{ textAlign: "left" }}>
          <table>
            <tbody>
              <tr>
                {legenddata.map((item) => (
                  <td>&nbsp;&nbsp;
                    <input
                      type="color"
                      value={item.color}
                      style={{
                        width: "15px",
                        height: "12px",
                        border: "hidden",
                      }}
                      disabled
                    />
                    &nbsp;{item.jobId ? item.jobId : "No Job"}
                  </td> 
                ))}
              </tr>
            </tbody>
          </table>
          {/* <ul class="list-group">
                    <li class="list-group-item" style={{border:'none'}}>
                      <input type="color" value={item.color} style={{width:'15px',height:'12px',border:'hidden'}} disabled/>&nbsp;{item.jobId ? item.jobId : "null"}
                    </li>
                  </ul> */}
        </div>
      </div>
      {/* <hr/> */}
      <div id="example-gantt" style={{ borderTop: "1px solid #E8E8EB" }}></div>

      {tooltipdata && (
        <div
          style={{
            width: "350px",
            position: "absolute",
            display: "inline-flex",
            top: yPosition - 50,
            zIndex: 1000,
            left: xPosition,
            textAlign: "left",
          }}
        >
          <ul class="list-group list-group-item-secondary">
            <li class="list-group-item">Job Id:&nbsp;{tooltipdata.jobId}</li>
            <li class="list-group-item">
              Activity Type:&nbsp;{tooltipdata.activityType}
            </li>
            <li class="list-group-item">
              Output Quantity:&nbsp;{getOutputQunatity(tooltipdata.ActivutyId)}
            </li>
            <li class="list-group-item">
              Start:&nbsp;{ConvertIntotime(tooltipdata.from)}
              {}
            </li>
            <li class="list-group-item">
              End:&nbsp;{ConvertIntotime(tooltipdata.to)}
            </li>
          </ul>
        </div>
      )}
      {showDropdown && (
        <div
          style={{
            width: "220px",
            height: "auto",
            border: "1px solid black",
            overflow: "auto",
            position: "absolute",
            top: "60px",
            right: "10px",
            fontSize: "14px",
            boxShadow: "0px 0px 10px",
            zIndex: 100,
          }}
        >
          <div>
            <ul class="list-group sticky-top">
              <li class="list-group-item" style={{ textAlign: "left" }}>
                Search &nbsp;&nbsp;
                {isSearchVisible ? (
                  <div
                    className="search-input-container"
                    style={{
                      position: "absolute",
                      top: "0px",
                      backgroundColor: "white",
                    }}
                  >
                    <input
                      type="text"
                      variant="outlined"
                      className=""
                      value={searchInput}
                      size="small"
                      style={{
                        width: "150px",
                        height: "28px",
                        fontSize: "10px",
                        borderRadius: "5px",
                        background: "whitesmoke",
                        marginLeft: "-10px",
                        marginTop: "2px",
                      }}
                      placeholder="Search Machine"
                      onChange={(e) => searchItems(e.target.value)}
                    />
                    <span
                      className="clear-button"
                      style={{
                        position: "absolute",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={toggleSearch}
                    >
                      <AiFillCloseSquare />
                    </span>
                  </div>
                ) : (
                  <span
                    className="search-icon-button"
                    style={{
                      marginLeft: "0px",
                      position: "absolute",
                    }}
                  >
                    <FaSistrix onClick={toggleSearch} className="mt-1" />
                  </span>
                )}
                <div
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "5px",
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={handleClose}
                >
                  {/* <IoCloseCircle /> */}
                  <AiFillCloseSquare />
                </div>
              </li>
              <li class="list-group-item">
                <span style={{ position: "absolute", left: "17px" }}>
                  Select All &nbsp;&nbsp;&nbsp;
                </span>
                <input
                  style={{ position: "relative", left: "65px" }}
                  type="checkbox"
                  onChange={handleSelectAllChange}
                  checked={checkedItems.size === data1.length}
                />
              </li>
            </ul>
            {searchInput.length > 0
              ? filteredResults.map((item, index) => (
                  <li class="list-group-item">
                    {item.id + " - " + getNodeNames(item.id)} &nbsp;
                    <input
                      type="checkbox"
                      value={item.id}
                      checked={checkedItems.has(item.id)}
                      onChange={(e) => handleCheckboxChange(e, item.id)}
                    />
                  </li>
                ))
              : data1.map((item) => (
                  <div style={{ textAlign: "left" }}>
                    <ul class="list-group">
                      <li class="list-group-item">
                        {item.id + " - " + getNodeNames(item.id)} &nbsp;
                        <input
                          type="checkbox"
                          value={item.id}
                          checked={checkedItems.has(item.id)}
                          onChange={(e) => handleCheckboxChange(e, item.id)}
                        />
                      </li>
                    </ul>
                  </div>
                ))}
          </div>
        </div>
      )}
      {showJobDropdown && (
        <div
          style={{
            width: "auto",
            height: "155px",
            border: "1px solid black",
            overflow: "auto",
            position: "absolute",
            top: "60px",
            right: "10px",
            fontSize: "14px",
            boxShadow: "0px 0px 10px",
            zIndex: 100,
          }}
        >
          <div>
            <ul class="list-group sticky-top">
              <li
                class="list-group-item"
                style={{ textAlign: "left", display: "flex" }}
              >
                Search
                {isNodeSearchVisible ? (
                  <div
                    className="search-input-container"
                    style={{
                      position: "absolute",
                      top: "0px",
                      backgroundColor: "white",
                    }}
                  >
                    <input
                      type="text"
                      variant="outlined"
                      value={NodesearchInput}
                      size="small"
                      style={{
                        width: "80px",
                        height: "30px",
                        fontSize: "10px",
                        borderRadius: "5px",
                        background: "whitesmoke",
                        marginLeft: "-10px",
                        marginTop: "2px",
                      }}
                      placeholder="search Job"
                      onChange={(e) => searchNodesItems(e.target.value)}
                    />
                    <span
                      className="clear-button"
                      onClick={toggleNodeSearch}
                      style={{
                        position: "absolute",
                        color: "red",
                        cursor: "pointer",
                      }}
                    >
                      <AiFillCloseSquare />
                    </span>
                  </div>
                ) : (
                  <span
                    className="search-icon-button"
                    style={{ marginLeft: "10px" }}
                  >
                    <FaSistrix onClick={toggleNodeSearch} className="mt-1" />
                  </span>
                )}
                <div
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "5px",
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={handleJobClose}
                >
                  <AiFillCloseSquare />
                </div>
              </li>
              <li class="list-group-item">
                <span style={{ position: "absolute", left: "17px" }}>
                  Select All &nbsp;&nbsp;&nbsp;
                </span>
                <input
                  style={{ position: "relative", left: "65px" }}
                  type="checkbox"
                  onChange={handleSelectAllJobChange}
                  checked={checkedJobItems.size === data3.length}
                />
              </li>
            </ul>
            {NodesearchInput.length > 0
              ? NodefilteredResults.map((item, index) => (
                  <ul class="list-group" style={{ textAlign: "left" }}>
                    <li class="list-group-item">
                      {item.jobId ? item.jobId : "No Job"} &nbsp;
                      <input
                        type="checkbox"
                        value={item.jobId}
                        checked={checkedJobItems.has(item.jobId)}
                        onChange={(e) => handleJobCheckboxChange(e, item.jobId)}
                      />
                    </li>
                  </ul>
                ))
              : data3.map((item) => (
                  <div style={{ textAlign: "left" }}>
                    <ul class="list-group">
                      <li class="list-group-item">
                        {item.jobId ? item.jobId : "No Job"} &nbsp;
                        <input
                          type="checkbox"
                          value={item.jobId}
                          checked={checkedJobItems.has(item.jobId)}
                          onChange={(e) =>
                            handleJobCheckboxChange(e, item.jobId)
                          }
                        />
                      </li>
                    </ul>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SveltaWithDB;
