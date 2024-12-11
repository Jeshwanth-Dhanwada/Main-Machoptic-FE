import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import { getEdgesConfig } from "../api/allsolutiions";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const label = { inputProps: { "aria-label": "Switch demo" } };
export let Edgesdata = []
function EdgeConfig() {
  //Snackbar code--------------
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const [edgeColor, setEdgeColor] = useState();
  const [edgeThickness, setEdgeThickness] = useState();
  const [edgeArrow, setEdgeArrow] = useState();
  const [edgeStyle, setEdgeStyle] = useState();
  const [edgeAnimation, setEdgeAnimation] = useState();
  const [edgeShape, setEdgeShape] = useState();
  const [edgeTitle, setEdgeTitle] = useState();
  const [edgeTitleSize, setEdgeTitleSize] = useState();
  const [edgeTitleAlign, setEdgeTitleAlign] = useState();
  const [edgeTitleColor, setEdgeTitleColor] = useState();
  const [edgeTitleFont, setEdgeTitleFont] = useState();
  const [edgeTitlePosition, setEdgeTitlePosition] = useState();
  const [edgeType, setEdgeType] = useState();

  // Handle onChange for all inputs
  const handleEdgeColor = (e) => {
    setEdgeColor(e.target.value);
  };
  const handleEdgeThickness = (e) => {
    setEdgeThickness(e.target.value);
  };
  const handleEdgeArrow = (e) => {
    setEdgeArrow(e.target.value);
  };
  const handleEdgeStyle = (e) => {
    setEdgeStyle(e.target.value);
  };
  const handleEdgeAnimation = (e) => {
    setEdgeAnimation(e.target.checked);
    console.log(e.target.checked);
  };
  const handleEdgeShape = (e) => {
    setEdgeShape(e.target.value);
  };
  const handleEdgeTitle = (e) => {
    setEdgeTitle(e.target.value);
  };
  const handleEdgeTitleSize = (e) => {
    setEdgeTitleSize(e.target.value);
  };
  const handleEdgeTitleAlign = (e) => {
    setEdgeTitleAlign(e.target.value);
  };
  const handleEdgeTitleColor = (e) => {
    setEdgeTitleColor(e.target.value);
  };
  const handleEdgeTitleFont = (e) => {
    setEdgeTitleFont(e.target.value);
  };
  const handleEdgeTitlePosition = (e) => {
    setEdgeTitlePosition(e.target.value);
  };

  const HandleEdgeType = (e) => {
    setEdgeType(e.target.value)
  }

  const [edgesCongiguration, setEdgesConfig] = useState([]);
  const [recordId, setRecordId] = useState(null); // To store the existing record ID

  // Fetch canvas config data
  const showgetEdgesConfig = async () => {
    const responsedata = await getEdgesConfig();
    Edgesdata.push(responsedata)
    if (responsedata.length > 0) {
      const existingConfig = responsedata[0];
      setEdgesConfig(responsedata);
      // Assuming `id` is the unique identifier in the response
      setRecordId(existingConfig.Id);
      setEdgeColor(existingConfig.EdgeColor);
      setEdgeThickness(existingConfig.EdgeThickness);
      setEdgeArrow(existingConfig.EdgeArrow);
      setEdgeStyle(existingConfig.EdgeStyle);
      setEdgeAnimation(existingConfig.EdgeAnimation);
      setEdgeShape(existingConfig.EdgeShape);
      setEdgeTitle(existingConfig.EdgeTitle);
      setEdgeTitleSize(existingConfig.EdgeTitleSize);
      setEdgeTitleAlign(existingConfig.EdgeTitleAglinment);
      setEdgeTitleColor(existingConfig.EdgeTitleColor);
      setEdgeTitleFont(existingConfig.EdgeTitleFontStyle);
      setEdgeTitlePosition(existingConfig.EdgeTitlePosition);
      setEdgeType(existingConfig.EdgeType);
    }
  };

  useEffect(() => {
    showgetEdgesConfig();
  }, []);

  const HanldeSubmit = (e) => {
    e.preventDefault();
    const payload = {
      // nodeconfig: nodeConfigData.map((item) => ({
      EdgeColor: edgeColor,
      EdgeThickness: edgeThickness,
      EdgeArrow: edgeArrow,
      EdgeStyle: edgeStyle,
      EdgeAnimation: edgeAnimation,
      EdgeShape: edgeShape,
      EdgeTitle: edgeTitle,
      EdgeTitleSize: edgeTitleSize,
      EdgeTitleAglinment: edgeTitleAlign,
      EdgeTitleColor: edgeTitleColor,
      EdgeTitleFontStyle: edgeTitleFont,
      EdgeTitlePosition: edgeTitlePosition,
      EdgeType: edgeType,
      userId: "1111",
    };
    console.log(payload);
    if (recordId) {
      axios
        .put(`${BASE_URL}/api/edgesConfig/${recordId}`, payload)
        .then((response) => {
          setOpenSnackbar(true);
          Edgesdata=[]
          Edgesdata.push(response.data)
          console.log("Record updated successfully", response.data);
        })
        .catch((error) => {
          console.error("Error updating record:", error);
        });
    } else {
      axios
        .post(`${BASE_URL}/api/edgesConfig`, payload)
        .then((response) => {
          setOpenSnackbar(true);
          Edgesdata=[]
          Edgesdata.push(response.data)
          console.log(response.data);
          console.log("New row added successfully");
        })
        .catch((error) => {
          console.error("Error adding new row:", error);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2">
          Edge-Color:
          <input
            type="color"
            onChange={handleEdgeColor}
            value={edgeColor}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Edge-Thickness:
          <input
            type="number"
            onChange={handleEdgeThickness}
            value={edgeThickness}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Edge-Arrow:
          <input
            type=""
            onChange={handleEdgeArrow}
            value={edgeArrow}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Edge-Type
          <select className="form-select" onChange={HandleEdgeType} value={edgeType}>
            <option hidden>Select Option</option>
            <option>straight</option>
            <option>step</option>
            <option>Smoothstep</option>
            <option>BezierEdge</option>
          </select>
        </div>
        <div className="col-2">
          Edge-Animation:
          <br />
          <Switch
            {...label}
            onChange={handleEdgeAnimation}
            checked={edgeAnimation}
          />
        </div>
        <div className="col-2">
          Edge-Shape:
          <input
            type="number"
            onChange={handleEdgeShape}
            value={edgeShape}
            className="form-control"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          Edge-Title:
          <input
            type="text"
            onChange={handleEdgeTitle}
            value={edgeTitle}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Edge-Title-Size:
          <input
            type="number"
            onChange={handleEdgeTitleSize}
            value={edgeTitleSize}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Edge-Title-Alignment:
          <select
            type="text"
            onChange={handleEdgeTitleAlign}
            value={edgeTitleAlign}
            className="form-control"
          >
            <option>Select Alignment</option>
            <option>Top</option>
            <option>Corner</option>
          </select>
        </div>
        <div className="col-2">
          Edge-Title-Color:
          <input
            type="color"
            onChange={handleEdgeTitleColor}
            value={edgeTitleColor}
            className="form-control"
          />
        </div>
        <div className="col-2">
          Edge-Title-FontStyle:
          <select
            type="text"
            onChange={handleEdgeTitleFont}
            value={edgeTitleFont}
            className="form-select"
          >
            <option>Select Option</option>
            <option>Bold</option>
            <option>Italic</option>
          </select>
        </div>
        <div className="col-2">
          Edge-Title-Position:
          <select
            onChange={handleEdgeTitlePosition}
            value={edgeTitlePosition}
            className="form-select"
          >
            <option hidden>Select Option</option>
            <option>Top</option>
            <option>Corner</option>
          </select>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-2">
          Edge-Type
          <select className="form-select" onChange={HandleEdgeType} value={edgeType}>
            <option hidden>Select Option</option>
            <option>straight</option>
            <option>step</option>
            <option>Smoothstep</option>
            <option>BezierEdge</option>
          </select>
        </div>
      </div> */}
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
            sx={{ width: "100%"}}
          >
            Saved Successfully!
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default EdgeConfig;
