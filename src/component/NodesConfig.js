import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./configuration.css";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
// import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import { getNodesConfig } from "../api/allsolutiions";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export let nodesdata = []
function NodesConfig() {
  //Snackbar code--------------
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [borderRadius, setBorderRadius] = useState();
  const [borderColor, setBorderColor] = useState();
  const [borderThickness, setBorderThickness] = useState();
  const [borderPattern, setBorderPattern] = useState();
  const [nodeBgColor, setNodeBgColor] = useState();
  const [label, setLabel] = useState();
  const [labelStyle, setLabelStyle] = useState();
  const [labelSize, setLabelSize] = useState();
  const [labelPosition, setLabelPosition] = useState();
  const [labelColor, setLabelColor] = useState();

  const HandleWidth = (event) => {
    setWidth(event.target.value);
  };
  const HandleHeight = (event) => {
    setHeight(event.target.value);
  };
  const HandleBorderRadius = (event) => {
    setBorderRadius(event.target.value);
  };
  const HandleBorderColor = (event) => {
    setBorderColor(event.target.value);
  };
  const HandleBorderThickness = (event) => {
    setBorderThickness(event.target.value);
  };
  const HandleBorderPattern = (event) => {
    setBorderPattern(event.target.value);
  };
  const HandleNodeBgColor = (event) => {
    setNodeBgColor(event.target.value);
  };
  const HandleLabel = (event) => {
    setLabel(event.target.value);
  };
  const HandleLabelStyle = (event) => {
    setLabelStyle(event.target.value);
  };
  const HandleLabelSize = (event) => {
    setLabelSize(event.target.value);
  };
  const HandleLabelPosition = (event) => {
    setLabelPosition(event.target.value);
  };
  const HandleLabelColor = (event) => {
    setLabelColor(event.target.value);
  };

  const [nodesCongiguration, setNodesConfig] = useState([]);
  const [recordId, setRecordId] = useState(null); // To store the existing record ID
  // Fetch canvas config data
  const showgetNodeConfig = async () => {
    const responsedata = await getNodesConfig();
    nodesdata.push(responsedata)
    if (responsedata.length > 0) {
      const existingConfig = responsedata[0];
      setNodesConfig(responsedata);
      // Assuming `id` is the unique identifier in the response
      setRecordId(existingConfig.Id);
      setWidth(existingConfig.width);
      setHeight(existingConfig.height);
      setBorderRadius(existingConfig.borderRadius);
      setBorderColor(existingConfig.borderColor);
      setBorderThickness(existingConfig.borderThickness);
      setBorderPattern(existingConfig.borderPattern);
      setNodeBgColor(existingConfig.nodeColor);
      setLabel(existingConfig.nodeLabel);
      setLabelStyle(existingConfig.labelStyle);
      setLabelSize(existingConfig.labelSize);
      setLabelPosition(existingConfig.labelPosition);
      setLabelColor(existingConfig.labelColor);
    }
  };

  useEffect(() => {
    showgetNodeConfig();
  }, []);

  const HanldeSubmit = (e) => {
    e.preventDefault();
    const payload = {
      // nodeconfig: nodeConfigData.map((item) => ({
      width: width,
      height: height,
      borderRadius: borderRadius,
      borderColor: borderColor,
      borderThickness: borderThickness,
      borderPattern: borderPattern,
      nodeColor: nodeBgColor,
      nodeLabel: label,
      labelStyle: labelStyle,
      labelSize: labelSize,
      labelPosition: labelPosition,
      labelColor: labelColor,
      userId: "1111",
      // })),
    };
    console.log(payload);
    if (recordId) {
      axios
        .put(`${BASE_URL}/api/nodesConfig/${recordId}`, payload)
        .then((response) => {
          setOpenSnackbar(true);
          nodesdata=[]
          nodesdata.push(response.data)
          console.log("Record updated successfully", response.data);
        })
        .catch((error) => {
          console.error("Error updating record:", error);
        });
    } else {
      axios
        .post(`${BASE_URL}/api/nodesConfig`, payload)
        .then((response) => {
          setOpenSnackbar(true);
          nodesdata=[]
          nodesdata.push(response.data)
          console.log(response.data);
          console.log("New row added successfully");
        })
        .catch((error) => {
          console.error("Error adding new row:", error);
        });
    }
  };

  console.log("New**************")

  return (
    <div className="container-fluid">
      <div className="row">
      <div className="col-2">
          Node Name:
          <input
            type="text"
            onChange={HandleLabel}
            value={label}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Width:
          <input
            type="text"
            id="Inputfield"
            onChange={HandleWidth}
            value={width}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Height:
          <input
            type="text"
            id="Inputfield"
            onChange={HandleHeight}
            value={height}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Border Radius:
          <input
            type="number"
            id="Inputfield"
            onChange={HandleBorderRadius}
            value={borderRadius}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Border Color:
          <input
            type="color"
            id="Inputfield"
            onChange={HandleBorderColor}
            value={borderColor}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Border Thickness:
          <input
            type="number"
            id="Inputfield"
            onChange={HandleBorderThickness}
            value={borderThickness}
            className="form-control"
            min={0}
            max={5}
          />
        </div>
        {/* <div className="col-2">
          Border Pattern:
          <input
            type="text"
            id="Inputfield"
            onChange={HandleBorderPattern}
            value={borderPattern}
            className="form-control"
          />
        </div> */}
      </div>
      <div className="row">
        <div className="col-2">
          Text Color:
          <input
            type="color"
            onChange={HandleNodeBgColor}
            value={nodeBgColor}
            className="form-control"
          />
        </div>
       
        <div className="col-2">
          Text Style:
          <select
            onChange={HandleLabelStyle}
            value={labelStyle}
            className="form-select"
          >
            <option hidden>Select style</option>
            <option>Normal</option>
            <option>Italic</option>
          </select>
        </div>
        <div className="col-2">
          Text Size:
          <input
            type="number"
            onChange={HandleLabelSize}
            value={labelSize}
            className="form-control"
            min={0}
          />
        </div>
        {/* <div className="col-2">
          Text Position:
          <select
            type="number"
            onChange={HandleLabelPosition}
            value={labelPosition}
            className="form-select"
          >
            <option hidden>Select Position</option>
            <option>Left</option>
            <option>Right</option>
            <option>Top</option>
            <option>Bottom</option>
          </select>
        </div> */}
        {/* <div className="col-2">
          Label-Color:
          <input
            type="color"
            onChange={HandleLabelColor}
            value={labelColor}
            className="form-control"
          />
        </div> */}
      </div>
      <div className="row mt-2">
        <div className="col-3">
          {recordId ? (
            <button className="btn btn-success btn-lg" onClick={HanldeSubmit}>
              <FaCheck />
            </button>
          ) : (
            <button className="btn btn-success btn-lg" onClick={HanldeSubmit}>
              <FaCheck />
            </button>
          )}
          &nbsp;
          <button className="btn btn-danger btn-lg">
            <FaXmark />
          </button>
        </div>
      </div>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  // This positions it at the bottom-right
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{ width: "100%",}}
          >
            Saved Successfully!
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default NodesConfig;
