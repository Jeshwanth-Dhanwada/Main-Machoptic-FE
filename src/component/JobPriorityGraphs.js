import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { getbatch_master } from "../api/shovelDetails";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";

function JobPriorityGraphs({ data ,node, allnodes, prodQty, tarQty, outQty}) {
  const [nodedata, setNodeData] = useState([]);

  const [batchmasterdata, setBatchMasterdata] = useState([]);
  const [batchdata, setBatchdata] = useState([]);
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
  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/batch`;
    axios
      .get(apiUrl)
      .then((response) => {
        
        setBatchdata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

    const proQTY = batchmasterdata
            .filter((item)=>item.producedJobId == data && item.nodeId == node)
            .map((item)=>item.totalProducedQty)
    const ProducedQty = (Math.max(...proQTY))
    const target = batchmasterdata
          .filter((item) => item.producedJobId == data && item.nodeId == node)
          .map((item) => item.targetQty);
    const targetQty = (Math.max(...target))
    const outstanding = targetQty*1.08 - ProducedQty

    const outstandingValue = batchmasterdata
    .filter((item) => (item.producedJobId == data && item.nodeId == node) && (item.totalProducedQty == ProducedQty || item.targetQty == targetQty))
    .map((item) => item.outstanding);

    const outstandingQtyValue = Math.max(...outstandingValue);

    console.log(data ,node, allnodes, prodQty, tarQty, outQty,"1504")
    
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
      {/* {data.lenght === 1 && node ? (
        <Plot
        config={{ displaylogo: false, displayModeBar: false }}
        data={[
          {
            x: ["Produced", "Consumed", "Avaliability"],
            y: [ProducedQty, targetQty, outstanding],
            width: 0.5,
            marker: {
              color: ["black", "blue", "green"], // Specify colors for each bar
            },
            type: "bar"
          },
        ]}
        layout={{
          width: 75, // Set width to 200px
          height: 75, // Set height to 200px
          margin: { t: 0, r: 0, b: 0, l: 0 }, // Set margins to 0
          xaxis: {
            tickfont: {
              size: 0, // Adjust the size of the x-axis labels
            },
            showticklabels: false, // Hide x-axis tick labels
          },
          yaxis: {
            tickfont: {
              size: 0, // Adjust the size of the x-axis labels
            },
            showticklabels: false, // Hide x-axis tick labels
          },
          bargap: 0, // Set gap between bars to 0
          bargroupgap: 0, // Set gap between groups of bars to 0
          hovermode: 'x+y', // Set hover mode to 'x' for horizontal overflow
          dragmode: false, // Disable zooming and panning
          hoverlabel: {
            font: { size: 6},
          },
          shapes: [
            {
              type: 'line',
              xref: 'paper',
              x0: 0,
              x1: 1,
              yref: 'y',
              y0: targetQty,
              y1: targetQty,
              line: {
                color: 'red',
                width: 2,
                dash: 'line',
              },
            },
          ],
        }}
      />
      ) 
      : */}
      <Plot
      config={{ displaylogo: false, displayModeBar: false }}
      data={[
        {
          x: ["Produced", "Consumed", "Avaliability"],
          y: [prodQty, tarQty, outQty],
          width: 0.5,
          marker: {
            color: ["black", "blue", "green"], // Specify colors for each bar
          },
          type: "bar"
        },
      ]}
      layout={{
        width: 75, // Set width to 200px
        height: 75, // Set height to 200px
        margin: { t: 0, r: 0, b: 0, l: 0 }, // Set margins to 0
        xaxis: {
          tickfont: {
            size: 10, // Adjust the size of the x-axis labels
          },
          showticklabels: false, // Hide x-axis tick labels
        },
        yaxis: {
          tickfont: {
            size: 10, // Adjust the size of the x-axis labels
          },
          showticklabels: true, // Hide x-axis tick labels
        },
        bargap: 0, // Set gap between bars to 0
        bargroupgap: 0, // Set gap between groups of bars to 0
        hovermode: 'x+y', // Set hover mode to 'x' for horizontal overflow
        dragmode: false, // Disable zooming and panning
        hoverlabel: {
          font: { size: 6},
        },
        shapes: [
          {
            type: 'line',
            xref: 'paper',
            x0: 0,
            x1: 1,
            yref: 'y',
            y0: targetQty,
            y1: targetQty,
            line: {
              color: 'red',
              width: 2,
              dash: 'line',
            },
          },
        ],
      }}
    />
    {/* } */}
    </div>
  );}
export default JobPriorityGraphs;
