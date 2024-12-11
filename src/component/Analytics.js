import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { getActivities, getNodeMaster } from "../api/shovelDetails";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import * as d3 from "d3";

function Analyticstab() {
  const [Activitydata, setActivitydata] = useState([]);
  const [FilterNodedata, setFilternodedata] = useState([]);
  const [nodesdata, setNodesdata] = useState([]);
  const [dateChange,setDateChange] = useState([])
  const [NodeSelect,setNodeSelect] = useState([])

  const HandleDateChange = (e) => {
    setDateChange(e.target.value);
  }

  const HandleNodeChange = (e) => {
    setNodeSelect(e.target.value);
  }
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }

  const showNodesdata = async (key) => {
    const responsedata = await getNodeMaster()
    setNodesdata(responsedata, key)
  }
  useEffect(() => {
    showNodesdata();
  },[])

  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/activitylog`;
    axios
      .get(apiUrl)
      .then((response) => {
        let nodes
        nodes = response.data.filter((item) => item.date == dateChange && item.shiftStartTime !== null).map((item) => item.nodeId);
        const uniqueNodes = [...new Set(nodes)];
        setFilternodedata(uniqueNodes)
        // const state_colors = {'6': '#0000FF', '11': '#29A829', 'Stopped': '#ff0000','size':5}
        // const selectedNode = uniqueNodes.forEach((item)=> item == selectedNode)
        const selectedNode = uniqueNodes.find(item => item == NodeSelect);
        console.log(uniqueNodes,"2404")
        console.log(selectedNode,"2404")
        setActivitydata([
          {
            x_start:response.data.filter((item)=>item.date == dateChange).map((item)=> item.shiftStartTime),
            x_end:response.data.filter((item)=>item.date == dateChange).map((item)=> item.shiftEndTime),
            y: selectedNode ? [selectedNode] : nodes,
            mode: "markers",
            type: "bar",
            orientation: "h",
            hovertemplate: '%{customdata[0]} to %{customdata[1]}', // Use customdata to access x_start and x_end
            // hovertemplate: '%{customdata[0]}', // Use customdata to access x_start and x_end
            customdata: response.data
              .filter((item) => item.date == dateChange && item.shiftStartTime !== null && item.shiftEndTime !== null)
              .map((item) => [item.shiftStartTime, item.shiftEndTime]),
            color:'State',
            // color_discrete_map:state_colors,
            
          },
        ])
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [NodeSelect, dateChange]);


  console.log(FilterNodedata)

  return (
    <div>
      <div>
        <input type="date" 
            placeholder="Date" 
            name="" 
            className="m-1 form-control"
            onChange={HandleDateChange}
            style={{width:'110px',fontSize:'13px'}}
            value={dateChange} 
            />
      </div>
      <div>
        <select className="m-1 form-control" onChange={HandleNodeChange} value={NodeSelect} style={{width:'110px'}}>
          <option hidden>NodeId</option>
          {FilterNodedata
            .map((item) =>
              <option>{item}</option>
            )}
        </select>
      </div>
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        height: "100vh",
      }}
    >
      <Plot
      data={Activitydata}
      config={{ 
          displaylogo: false, 
          modeBarButtonsToRemove: [
              'zoom2d', // Remove zoom button
              'pan2d', // Remove pan button
              'lasso2d', // Remove lasso select
              'select2d', // Remove box select
          ],
         }}
        
        layout={{
          title: "Activity Start and End Time",
          xaxis: {
            title: "Start & End Time",
            type: 'date',  // Specify the x-axis type as 'date'
            tickformat: "%H:%M:%S", // Format the time ticks to show only hours, minutes, and seconds
          },
          yaxis: {
            title: "Nodes",
          },
          
        }}
      />
    </div>
    </div>
  );
}

export default Analyticstab;
