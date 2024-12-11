import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";

function MachineGraphs({AllJobs,AllNodes}) {
  const [batchmasterdata, setBatchMasterdata] = useState([]);
  const [splitdate, setSplitDate] = useState([]);
  const [Assignedsplitdate, setAssignedSplitDate] = useState([]);
  const [color, setColor] = useState([]);
  const [Assignedcolor, setAssignedcolor] = useState([]);
  const [Combinedjobs, setCombinedjobs] = useState([]);
  
  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/batchMaster`;
    axios
      .get(apiUrl)
      .then((response) => {
        
        setBatchMasterdata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const NodeCompletedJobs = AllJobs.filter((item) => item?.nodeId == AllNodes)
  const NodeAssignedJobs = AllJobs.filter((item) => item?.node?.nodeId == AllNodes)

  useEffect(() => {
    // Update splitdate array whenever dateandNode changes
    setSplitDate(NodeCompletedJobs.map((item) => item.date.split("-")[2]));
    setAssignedSplitDate(NodeAssignedJobs.map((item) => item.date.split("-")[2]));
    // Update color array whenever dateandNode changes
    setColor(NodeCompletedJobs.map((item) => (item.status === "Assigned" ? "blue" : "green")));
    setAssignedcolor(NodeAssignedJobs.map((item) => (item.activityType === "ON" ? "green" : "blue")));
  }, []);


  // Create an object to store y values for each unique job ID on each day
  const yValuesMap = {};
  const yValuesAssifnedMap = {};

  NodeCompletedJobs.forEach((item) => {
    const nodeId = item?.nodeId;
    const jobId = item.jobId;
    const day = item.date.split("-")[2];
    const y = item.jobId;
  
  if (!yValuesMap[nodeId]) {
    yValuesMap[nodeId] = {};
  }

  if (!yValuesMap[nodeId][day]) {
    yValuesMap[nodeId][day] = {};
  }

  if (!yValuesMap[nodeId][day][jobId]) {
    yValuesMap[nodeId][day][jobId] = [y];
  } else {
    yValuesMap[nodeId][day][jobId].push(y + yValuesMap[nodeId][day][jobId].length * 0.15); // Add a small offset
  }
});

// Flatten the y values for plotting
const flattenedYValues = Object.values(yValuesMap).flatMap((node) =>
  Object.values(node).flatMap((day) =>
    Object.values(day).flatMap((job) => job)
  )
);

NodeAssignedJobs.forEach((item) => {
  const nodeId = item?.node?.nodeId;
  const jobId = item.jobId;
  const day = item.date.split("-")[2];
  const y = item.jobId;

if (!yValuesAssifnedMap[nodeId]) {
  yValuesAssifnedMap[nodeId] = {};
}

if (!yValuesAssifnedMap[nodeId][day]) {
  yValuesAssifnedMap[nodeId][day] = {};
}

if (!yValuesAssifnedMap[nodeId][day][jobId]) {
  yValuesAssifnedMap[nodeId][day][jobId] = [y];
} else {
  yValuesAssifnedMap[nodeId][day][jobId].push(y + yValuesAssifnedMap[nodeId][day][jobId].length * 0.15); // Add a small offset
}
});

// Flatten the y values for plotting
const flattenedYAssignedValues = Object.values(yValuesAssifnedMap).flatMap((node) =>
Object.values(node).flatMap((day) =>
  Object.values(day).flatMap((job) => job)
)
);

// Check if flattenedYValues and flattenedYAssignedValues arrays are empty
// const showXAxis = flattenedYValues.length > 0;
// const showYAxis = flattenedYAssignedValues.length > 0;

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
        config={{ displaylogo: false, displayModeBar: false }}
        data={[
          {
            x: splitdate,
            y: flattenedYValues,
            width: 1,
            mode: "markers", // Display only markers without lines
            marker: {
              size: 8, // Adjust the size of markers as per your preference
              color: color,
              
            },
            type: "scatter",
          },
        ]}
        layout={{
          width: 80, // Set width to 200px
          height: 75, // Set height to
          title: "",
          margin: { t: 0, r: 0, b: 18, l: 0 }, // Set margins to 0
          xaxis: {
            title: {
              text: "Date",
              font: {
                size: 4, // Specify font size for x-axis title
              },
            },
            tickfont: {
              size: 6, // Specify font size for x-axis ticks
            },
            tickangle: 0, // Specify the tick angle for x-axis values
            tickvals: splitdate, // Show tick values only where x values are present
            // visible:showXAxis
          },
          yaxis: {
            title: {
              text: "", // No title for y-axis
              showline: false, // Hide y-axis line
            },
            // visible:showYAxis
          },
          hoverlabel: {
            font: { size: 6 },
          },
          dragmode: false, // Disable zooming and panning
        }}
      />
      <Plot
        config={{ displaylogo: false, displayModeBar: false }}
        data={[
          {
            x: Assignedsplitdate,
            y: flattenedYAssignedValues,
            width: 1,
            mode: "markers", // Display only markers without lines
            marker: {
              size: 8, // Adjust the size of markers as per your preference
              color: Assignedcolor,
            },
            type: "scatter",
          },
        ]}
        layout={{
          width: 80, // Set width to 200px
          height: 75, // Set height to
          title: "",
          margin: { t: 0, r: 0, b: 18, l: 0 }, // Set margins to 0
          xaxis: {
            title: {
              text: "Date",
              font: {
                size: 4, // Specify font size for x-axis title
              },
            },
            tickfont: {
              size: 6, // Specify font size for x-axis ticks
            },
            tickangle: 0, // Specify the tick angle for x-axis values
            tickvals: Assignedsplitdate, // Show tick values only where x values are present
            // visible:showXAxis
          },
          yaxis: {
            title: {
              text: "", // No title for y-axis
              showline: false, // Hide y-axis line
            },
            // visible:showYAxis
          },
          hoverlabel: {
            font: { size: 6 },
          },
          dragmode: false, // Disable zooming and panning
        }}
      />
    </div>
  );
}

export default MachineGraphs;
