import React, { useContext, useEffect, useState } from "react";
import { getActivities } from "../api/shovelDetails";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";

function Maintenance({ RecentActvityData,onsubmit }) {
  const { auth } = useContext(AuthContext);
  const [MaintenanceDesc, setMaintenanceDesc] = useState();
  const HandleDescription = (e) => {
    setMaintenanceDesc(e.target.value);
  };

  console.log(typeof RecentActvityData,"RecentActvityData")
  const [ActivityLog, setActivityLog] = useState([]);

  const showActivityData = async (key) => {
    const responsedata = await getActivities();
    setActivityLog(responsedata, key);
  };
  useEffect(() => {
    showActivityData();
  },[]);

  const getRecentActivity = () => {
    // console.log(ActivityLog);
    const activityArr = ActivityLog.filter(
      (item) => parseInt(item.nodeId) === parseInt(RecentActvityData?.nodeId)
    ).map((item) => item.id);
    return activityArr[activityArr.length - 1];
  };

  function getFormatCurrentTime(dateString) {
    const currentDate = dateString ? new Date(dateString) : new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const HandleSubmitMaintenance = () => {
    const payload = {
      MaintenanceId: getRecentActivity().toString(),
      MachineId: RecentActvityData?.nodeId,
      Description: MaintenanceDesc,
      StartDate: getFormatCurrentTime(RecentActvityData?.shiftStartTime),
      EndDate: getFormatCurrentTime(RecentActvityData?.shiftEndTime),
      userId: auth?.empId.toString(),
    };
    console.log(payload, "payload");
    axios
      .post(`${BASE_URL}/api/maintenance`, payload)
      .then((res) => {
        console.log(res, "payload");
        RecentActvityData = {}
        const activetab = 0
        onsubmit({RecentActvityData,activetab})
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-8">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Maintenance Id</th>
                <th>Machine Id</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{getRecentActivity()}</td>
                <td>{RecentActvityData?.nodeId}</td>
                <td>
                  <textarea
                    onChange={HandleDescription}
                    value={MaintenanceDesc}
                    style={{ width: "100%", height: "20px" }}
                  ></textarea>
                </td>
                <td>
                  {getFormatCurrentTime(RecentActvityData?.shiftStartTime)}
                </td>
                <td>
                  {getFormatCurrentTime(RecentActvityData?.shiftEndTime)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="btn btn-danger">Cancel</div> &nbsp;
            <div className="btn btn-success" onClick={HandleSubmitMaintenance}>
              Submit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
