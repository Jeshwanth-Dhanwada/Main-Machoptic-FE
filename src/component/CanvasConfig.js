import React, { useEffect, useState } from "react";
import "./configuration.css";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import { getCanvasConfig } from "../api/allsolutiions";
import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Custom hook to export canvasConfigData
export let canvasdata = []

// export const saveCanvasConfig = true;

function CanvasConfig() {
  //Snackbar code--------------
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const [BackGround, setBackGround] = useState();
  const [pattern, setPattern] = useState();
  const [textSize, setTextSize] = useState();
  const [fontStyle, setFontStyle] = useState();
  const [canvasConfigData, setCanvasConfigData] = useState([]);
  const [recordId, setRecordId] = useState(null); // To store the existing record ID

  const HandleBackGroundChange = (e) => {
    setBackGround(e.target.value);
  };
  const HandlePatterenChange = (e) => {
    setPattern(e.target.value);
  };
  const HandleTextSizeChange = (e) => {
    setTextSize(e.target.value);
  };
  const HandleFontStyleChange = (e) => {
    setFontStyle(e.target.value);
  };
  
  // Fetch canvas config data
  const showgetCanvasConfig = async () => {
    const responsedata = await getCanvasConfig();
    setCanvasConfigData(responsedata)
    canvasdata.push(responsedata)
    if (responsedata.length > 0) {
      const existingConfig = responsedata[0];
      setRecordId(existingConfig.Id); // Assuming `id` is the unique identifier in the response
      setBackGround(existingConfig.BackgroundColor);
      setPattern(existingConfig.Pattern);
      setTextSize(existingConfig.TextSize);
      setFontStyle(existingConfig.FontStyle);
    }
  };

  useEffect(() => {
    showgetCanvasConfig();
  }, []);

  function getCanvasConfigdata(){
    const apiUrl = `${BASE_URL}/api/canvasConfig`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setCanvasConfigData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Submit handler
  const HanldeSubmit = (e) => {
    e.preventDefault();
    const payload = {
      BackgroundColor: BackGround,
      Pattern: pattern,
      TextSize: textSize,
      FontStyle: fontStyle,
      userId: "1111",
    };

    // If there's an existing record, update it using PUT
    if (recordId) {
      axios
        .put(`${BASE_URL}/api/canvasConfig/${recordId}`, payload)
        .then((response) => {
          setOpenSnackbar(true);
          getCanvasConfigdata()
          canvasdata=[]
          canvasdata.push(response.data)
          console.log("Record updated successfully", response.data);
        })
        .catch((error) => {
          console.error("Error updating record:", error);
        });
    } else {
      // Otherwise, create a new record using POST
      axios
        .post(`${BASE_URL}/api/canvasConfig`, payload)
        .then((response) => {
          setOpenSnackbar(true);
          getCanvasConfigdata()
          canvasdata=[]
          canvasdata.push(response.data)
          console.log("New row added successfully", response.data);
        })
        .catch((error) => {
          console.error("Error adding new row:", error);
        });
    }
  };
  const HandleCancel = () => {
    setBackGround('')
    setPattern('')
    setTextSize('')
    setFontStyle('')
  }

  

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2">
          Pattern Color:
          <input
            type="color"
            onChange={HandleBackGroundChange}
            value={BackGround || ""}
            className="form-control"
          />
        </div>

        <div className="col-2">
          Pattern:
          <select
            onChange={HandlePatterenChange}
            value={pattern || ""}
            className="form-select"
          >
            <option hidden>Select Option</option>
            <option>Plain background</option>
            <option>Lines</option>
            <option>Dots</option>
            <option>cross</option>
          </select>
        </div>
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
          <button className="btn btn-danger btn-lg" onClick={HandleCancel}>
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

export default CanvasConfig;