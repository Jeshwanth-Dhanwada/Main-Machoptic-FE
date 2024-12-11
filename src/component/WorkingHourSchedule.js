import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

import { getWorkingHourSchedule } from "../api/shovelDetails";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";

function WorkingHourSchedule() {
  const [WorkingHourScheduledata, setWorkingHourScheduledata] = useState([]);
  const showgetWorkingHourSchedule = async (key) => {
    const responsedata = await getWorkingHourSchedule();
    setWorkingHourScheduledata(responsedata, key);
  };

  useEffect(() => {
          showgetWorkingHourSchedule();
  }, []);

  
  console.log(WorkingHourScheduledata, "2604");

  const shiftX_axis = WorkingHourScheduledata.map((item)=>item.ShiftName)
  const shiftX_axisTiming = WorkingHourScheduledata.map((item)=>({
    starttime : item.StartTime,
    endtime : item.EndTime,
    shiftname : item.ShiftName,

  }))
  console.log(shiftX_axisTiming,"26-04")
  const UniqueshiftY_axis = [...new Set(shiftX_axis)]
  console.log(shiftX_axisTiming.map((item)=>item.starttime),"2604")
  
  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Plot
        // config={{ displaylogo: false, displayModeBar: false }}
        config={{ 
          displaylogo: false, 
          modeBarButtonsToRemove: [
              // 'zoom2d', // Remove zoom button
              'pan2d', // Remove pan button
              'lasso2d', // Remove lasso select
              'select2d', // Remove box select
          ],
         }}
        data={[
          {
            x_start:shiftX_axisTiming.map((item)=>item.starttime),
            x_end:shiftX_axisTiming.map((item)=>item.endtime),
            y: ['','','','','','','','','','',''],
            width: 0.5,
            marker: {
              color: WorkingHourScheduledata.map((item) => {
                return item.Working === "Yes" ? "green" : "red";
              })
            },
            type: "bar",
            orientation: "h",
          },
        ]}
        // data={WorkingHourScheduledata}
        layout={{
          dragmode: 'zoom', // Enable contextual zooming
          width: 1000, // Set width to 200px
          height: 300, // Set height to 200px
          margin: { t: 0, r: 0, b: 70, l: 20 }, // Set margins to 0
          
          xaxis: {
            type: 'date',  // Specify the x-axis type as 'date'
            tickformat: "%H:%M:%S", // Format the time ticks to show only hours and minutes
            tickfont: {
                size: 10, // Adjust the size of the x-axis labels
            },
            showticklabels: true, // Show x-axis tick labels
            dtick: 3600000, // Set the tick interval to one hour in milliseconds (1000 milliseconds * 60 seconds * 60 minutes)
            range: [shiftX_axisTiming[0].starttime, shiftX_axisTiming[shiftX_axisTiming.length - 1].endtime] // Set the range of x-axis values
        },
        
          yaxis: {
            tickfont: {
              size: 0, // Adjust the size of the x-axis labels
            },
            showticklabels: true, // Hide x-axis tick labels
          },
          bargap: 0, // Set gap between bars to 0
          bargroupgap: 0, // Set gap between groups of bars to 0
          hovermode: "x_start+x_end", // Set hover mode to 'x' for horizontal overflow
          dragmode: false, // Disable zooming and panning
          hoverlabel: {
            font: { size: 6 },
          },
              annotations: [
                    {
                      x: 0.1,
                      y: -0.20,
                      xref: 'paper',
                      yref: 'paper',
                      text: 'Stopped',
                      showarrow: false,
                      font: {
                        family: 'Arial',
                        size: 12,
                        color: 'black'
                      },
                      xanchor: 'center',
                      yanchor: 'center',
                      xshift: 0,
                      yshift: 0,
                      bgcolor: 'red',
                      bordercolor: 'black',
                      borderwidth: 1,
                      borderpad: 4,
                      opacity: 0.8
                    },
                    {
                      x: 0.2,
                      y: -0.20,
                      xref: 'paper',
                      yref: 'paper',
                      text: 'Worked',
                      showarrow: false,
                      font: {
                        family: 'Arial',
                        size: 12,
                        color: 'black'
                      },
                      xanchor: 'center',
                      yanchor: 'center',
                      xshift: 0,
                      yshift: 0,
                      bgcolor: 'green',
                      bordercolor: 'black',
                      borderwidth: 1,
                      borderpad: 4,
                      opacity: 0.8
                    }
                  ]
        }}
      />
    </div>
  );
}

export default WorkingHourSchedule;



// xaxis: {
          //   type: 'date',  // Specify the x-axis type as 'date'
          //   tickformat: "%H:%M:%S", // Format the time ticks to show only hours, minutes, and seconds
          //   tickfont: {
          //     size: 10, // Adjust the size of the x-axis labels
          //   },
          //   showticklabels: true, // Hide x-axis tick labels
          // },

// shapes: [
          //   {
          //     type: "line",
          //     xref: "paper",
          //     x0: 0,
          //     x1: 1,
          //     yref: "y",
          //     y0: "",
          //     y1: "",
          //     line: {
          //       color: "red",
          //       width: 2,
          //       dash: "line",
          //     },
          //   },
          // ],

          // useEffect(() => {
  //   const apiUrl = `${BASE_URL}/api/workinghourschedule`;
  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       console.log(response.data,"2604")
  //       setWorkingHourScheduledata([
  //         {
  //           x_start:response.data.map((item)=> item.StartTime),
  //           x_end:response.data.map((item)=> item.EndTime),
  //           y: ['','',''],
  //           mode: "markers",
  //           type: "bar",
  //           orientation: "h",
  //           // hovertemplate: '%{customdata[0]} to %{customdata[1]}', // Use customdata to access x_start and x_end
  //           // hovertemplate: '%{customdata[0]}', // Use customdata to access x_start and x_end
  //           // customdata: response.data
  //           //   .filter((item) => item.date == dateChange && item.shiftStartTime !== null && item.shiftEndTime !== null)
  //           //   .map((item) => [item.shiftStartTime, item.shiftEndTime]),
  //           marker: {
  //                   color: WorkingHourScheduledata.map((item) => {
  //                     return item.Working === "Yes" ? "green" : "red";
  //                   })
  //                 }
  //           // color_discrete_map:state_colors,
            
  //         },
  //       ])
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

