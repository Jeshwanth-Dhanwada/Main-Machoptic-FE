import React, { useContext, useEffect, useState } from "react";
import { getActivities } from "../api/shovelDetails";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";

function BreakDown({ RecentActvityData,onsubmit }) {

          console.log(typeof RecentActvityData,"RecentActvityData")
  const { auth } = useContext(AuthContext);
  const [BreakDownDesc, setBreakDownDesc] = useState();
  const HandleBreakDownDescription = (e) => {
    setBreakDownDesc(e.target.value);
  };

  const [ActivityLog, setActivityLog] = useState([]);

  const showActivityData = async (key) => {
    const responsedata = await getActivities();
    setActivityLog(responsedata, key);
  };
  useEffect(() => {
    showActivityData();
  }, []);

  const getRecentActivity = () => {
    // console.log(ActivityLog);
    const activityArr = ActivityLog.filter(
      (item) => parseInt(item.nodeId) === parseInt(RecentActvityData?.nodeId)
    ).map((item) => item.id);
    return activityArr[activityArr.length - 1];
  };

  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }

  const [currentdate, setdate] = useState(getFormattedToday());

  const HandleSubmitBreakDown = () => {
    const payload = {
      BreakDowneId: getRecentActivity().toString(),
      Reason: BreakDownDesc,
      date: RecentActvityData?.date,
      Department: "",
      Equipment: RecentActvityData?.nodeId,
      userId: auth?.empId.toString(),
    };
    console.log(payload, "payload");
    axios
      .post(`${BASE_URL}/api/breakdown`, payload)
      .then((res) => {
        console.log(res, "payload");
        RecentActvityData = {}
        const activetab = 1
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
                <th>BreakDown Id</th>
                <th>Machine Id</th>
                <th>Description</th>
                <th>date</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
                  <tr>
                    <td>{getRecentActivity()}</td>
                    <td>{RecentActvityData?.nodeId}</td>
                    <td>
                      <textarea
                        onChange={HandleBreakDownDescription}
                        value={BreakDownDesc}
                        style={{ width: "100%", height: "20px" }}
                      ></textarea>
                    </td>
                    <td>{RecentActvityData?.date}</td>
                    <td></td>
                  </tr>
                </tbody>
          </table>
        </div>
      </div>
      <div className="row">
          <div className="col-2">
            <div className="btn btn-danger">Cancel</div> &nbsp;
            <div className="btn btn-success" onClick={HandleSubmitBreakDown}>
              Submit
            </div>
          </div>
        </div>
    </div>
  );
}

export default BreakDown;
