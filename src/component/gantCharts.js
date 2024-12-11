import React, { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";

const GanttChart = () => {
  const ganttContainer = useRef(null);
  const ganttInstance = useRef(null);

  useEffect(() => {
    const tasks = [
      {
        id: "Task 1",
        name: "Redesign website",
        start: "2024-04-01",
        end: "2024-04-04",
        progress: 20,
        dependencies: "",
      },
      {
        id: "Task 2",
        name: "Write new content",
        start: "2024-04-02",
        end: "2024-04-05",
        progress: 40,
        dependencies: "Task 1",
      },
      {
        id: "Task 3",
        name: "Review content",
        start: "2024-04-06",
        end: "2024-04-07",
        progress: 0,
        dependencies: "Task 2",
      },
      {
        id: "Task 4",
        name: "Approve content",
        start: "2024-04-09",
        end: "2024-04-10",
        progress: 0,
        dependencies: "Task 3",
      },
      {
        id: "Task 5",
        name: "Launch website",
        start: "2024-04-12",
        end: "2024-04-15",
        progress: 100,
        dependencies: "Task 4",
      },
    ];



    ganttInstance.current = new Gantt(ganttContainer.current, tasks, {
          custom_popup_html: function (task) {
              return `
                  <div class="details-container">
                      <h4>${task.name}</h4>
                      <p>Start: ${task.start}</p>
                      <p>End: ${task.end}</p>
                      <p>Progress: ${task.progress}%</p>
                  </div>
              `;
          },
          on_click: function (task) {
              console.log(task);
          },
          on_date_change: function(task, start, end) {
              console.log(task, start, end);
          },
          on_progress_change: function(task, progress) {
              console.log(task, progress);
          },
          on_view_change: function(mode) {
                    console.log(mode,"7474")
          //     update_view_scale(mode);
          }
      });
      
//       function update_view_scale(view_mode) {
//           console.log(view_mode,"7474")
//           // if (view_mode === 'Day') {
//           //           console.log("Day")
//           // ganttInstance.current.change_view_mode('Week');
//           // }
//           // else if (view_mode === 'Hour') {
//           //           console.log("Hour")
//           //     ganttInstance.current.options.step = 24 / 24;
//           //     ganttInstance.current.options.column_width = 38;
//           // } else if (view_mode === 'Minute') {
//           //           console.log("Minute")
//           //     ganttInstance.current.options.step = 24 / 1440;
//           //     ganttInstance.current.options.column_width = 38;
//           // } else if (view_mode === 'Week') {
//           //           console.log("Week")
//           //     ganttInstance.current.options.step = 24 * 7;
//           //     ganttInstance.current.options.column_width = 140;
//           // } else if (view_mode === 'Month') {
//           //           console.log("Month")
//           //     ganttInstance.current.options.step = 24 * 30;
//           //     ganttInstance.current.options.column_width = 120;
//           // } else if (view_mode === 'Year') {
//           //           console.log("Year")
//           //     ganttInstance.current.options.step = 24 * 365;
//           //     ganttInstance.current.options.column_width = 120;
//           // }
//       }
      

let currentViewMode = 'Day'; // Default view mode
let PreviousViewMode = null; // Default view mode

// const handleMouseScroll = (event) => {
// // Increase or decrease visible time range based on scroll direction
// const delta = Math.max(-1, Math.min(1, (event.deltaY || -event.detail)));

// if (delta > 0) {
// // Zoom in
// switch (currentViewMode) {
//           case 'Day':
//           ganttInstance.current.change_view_mode('Week');
//           currentViewMode = 'Week';
//           PreviousViewMode = 'Day';
//           break;
//           case 'Week':
//           ganttInstance.current.change_view_mode('Month');
//           currentViewMode = 'Month';
//           PreviousViewMode = 'Week';
//           break;
//           // Add more cases for finer zoom levels if needed
//           default:
//           break;
// }
// } else {
// // Zoom out
// switch (currentViewMode) {
//           case 'Month':
//           ganttInstance.current.change_view_mode('Week');
//           currentViewMode = 'Week';
//           PreviousViewMode = 'Month';
//           break;
//           case 'Week':
//           ganttInstance.current.change_view_mode('Half Day');
//           currentViewMode = 'Half Day';
//           PreviousViewMode = 'Week';
//           break;
//           case 'Half Day':
//           ganttInstance.current.change_view_mode('Quarter Day');
//           currentViewMode = 'Quater Day';
//           PreviousViewMode = 'Half Day';
//           break;
//           // Add more cases for finer zoom levels if needed
//           default:
//           break;
// }
// }

// // Prevent default scroll behavior to avoid page scroll
// event.preventDefault();
// };

const handleMouseScroll = (event) => {
          // Increase or decrease visible time range based on scroll direction
          const delta = Math.max(-1, Math.min(1, (event.deltaY || -event.detail)));
          console.log(delta,"7674")
          if (delta === 1) {
                    console.log(delta,"7674")
              // Zoom in
              switch (currentViewMode) {
                  case 'Day':
                    if(currentViewMode === 'Day' && PreviousViewMode === null)
                      ganttInstance.current.change_view_mode('Week');
                      currentViewMode = 'Week';
                      PreviousViewMode = 'Day';
                      break;
                  case 'Week':
                      ganttInstance.current.change_view_mode('Month');
                      currentViewMode = 'Month';
                      PreviousViewMode = 'Week';
                      break;
                  // Add more cases for finer zoom levels if needed
                  default:
                      break;
              }
          } else if(delta === -1){
                    console.log(delta,"7674")
              // Zoom out
              switch (currentViewMode) {
                  case 'Month':
                      ganttInstance.current.change_view_mode('Week');
                      currentViewMode = 'Week';
                      PreviousViewMode = 'Month';
                      break;
                  case 'Week':
                      ganttInstance.current.change_view_mode('Day');
                      currentViewMode = 'Day';
                      PreviousViewMode = 'Week';
                      break;
                  case 'Day':
                    if(currentViewMode === 'Day' && PreviousViewMode === 'Week')
                      ganttInstance.current.change_view_mode('Half Day');
                      currentViewMode = 'Half Day';
                      PreviousViewMode = 'Day';
                      break;
                  case 'Half Day':
                      ganttInstance.current.change_view_mode('Quarter Day');
                      currentViewMode = 'Quarter Day'; // corrected spelling
                      PreviousViewMode = 'Half Day';
                      break;
                  case 'Quarter Day':
                      ganttInstance.current.change_view_mode('Quarter Day');
                      currentViewMode = 'Quarter Day'; // corrected spelling
                      PreviousViewMode = 'Half Day';
                      break;
                  // Add more cases for finer zoom levels if needed
                  default:
                      break;
              }
          }
      
          // Prevent default scroll behavior to avoid page scroll
          event.preventDefault();
      };
      

// const handleMouseScroll = (event) => {
//     // Increase or decrease visible time range based on scroll direction
//     const delta = Math.max(-1, Math.min(1, event.deltaY || -event.detail));

//     // Save the current view mode as the previous view mode before changing it
//     // previousViewMode = currentViewMode;

//     if (delta > 0) {
//         // Zoom in
//         switch (currentViewMode) {
//             case "Day":
//                 ganttInstance.current.change_view_mode("Week");
//                 currentViewMode = "Week";
//                 break;
//             case "Week":
//                 ganttInstance.current.change_view_mode("Month");
//                 currentViewMode = "Month";
//                 break;
//             // Add more cases for finer zoom levels if needed
//             default:
//                 break;
//         }
//     } else {
//         // Zoom out
//         switch (currentViewMode) {
//             case "Month":
//                 ganttInstance.current.change_view_mode("Week");
//                 currentViewMode = "Week";
//                 break;
//             case "Week":
//                 ganttInstance.current.change_view_mode("Day");
//                 currentViewMode = "Day";
//                 break;
//             // case "Day":
//             //     ganttInstance.current.change_view_mode("Half Day");
//             //     currentViewMode = "Half Day";
//             //     break;
//             // case "Half Day":
//             //   ganttInstance.current.change_view_mode("Quater Day");
//             //   currentViewMode = "Quater Day";
//             //   break;
//             // case "Quater Day":
//             //   ganttInstance.current.change_view_mode("Hour");
//             //   currentViewMode = "Hour";
//             //   break;
//             // Add more cases for finer zoom levels if needed
//             default:
//                 break;
//         }
//     }

//     // Prevent default scroll behavior to avoid page scroll
//     event.preventDefault();
// };


    // Add event listener for mouse scroll to the Gantt chart container
    ganttContainer.current.addEventListener("wheel", handleMouseScroll, {
      passive: false,
    });

    return () => {
      // Remove event listener when component is unmounted
      ganttContainer.current.removeEventListener("wheel", handleMouseScroll);
      ganttInstance.current.unload();
    };
  }, []);

  return <div ref={ganttContainer} />;
};

export default GanttChart;
