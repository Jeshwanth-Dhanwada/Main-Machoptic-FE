import React, { useContext, useEffect, useState } from "react";
import { getActivities, getNodeMaster, getNodeVariable } from "../api/shovelDetails";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import { toast } from "react-toastify";

function UpdateVariables({ RecentActvitydata, onclicksend }) {
  const { auth } = useContext(AuthContext);
  const [nodeParaValue, setNodeValue] = useState([]);

  const [NodeVariableData, setNodeVariableData] = useState([]);
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
      (item) => parseInt(item.nodeId) === parseInt(RecentActvitydata?.nodeId)
    ).map((item) => item.id);
    return activityArr[activityArr.length - 1];
  };
  const ShowNodeVariablesData = async (key) => {
    const responsedata = await getNodeVariable();
    const nodedata = await getNodeMaster();
    // const filterdata = responsedata.filter(
    //   (item) => String(item.nodeId) === String(RecentActvitydata?.nodeId)
    // );
    // console.log(filterdata, "RecentActvitydata");
    // Extract all nodeIds from nodedata
    const nodeIdsInMaster = new Set(nodedata.filter((item)=>item.nodeType === "Machine").map((node) => String(node.nodeId)));
  
    const filterdata = responsedata.filter(
      (item) =>
       nodeIdsInMaster.has(String(item.nodeId))
    );
    setNodeVariableData(filterdata, key);
  };
  useEffect(() => {
    ShowNodeVariablesData();
  }, []);

  const HandleNodeVarValue = (value, index) => {
    setNodeValue((preValues) => {
      const updateValue = [...preValues];
      updateValue[index] = value;
      return updateValue;
    });
  };

  const HandleSubmitVarDetails = () => {
    NodeVariableData.forEach((item, index) => {
      if (!nodeParaValue[index]) {
        return; // Skip to the next iteration
      }
        const payload = {
          Value: nodeParaValue[index],
          ActivityId: getRecentActivity(),
          userId: auth.empId.toString(),
          nodeId: item.nodeId,
        };
        console.log(payload, "submitpay");
        axios
          .post(`${BASE_URL}/api/nodevardetails`, payload)
          .then((res) => {
            console.log(res, "payload");
            const value = 1;
            onclicksend(value);
            setNodeVariableData([])
          })
          .catch((err) => {
            console.log(err, "Error");
          });
    });
    toast.success(
      <span>
        <strong>Submitted Succesfully</strong>
      </span>,
      {
        position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
        className: "custom-toast", // Optional: Add custom CSS class
      }
    );
  };
  const HandleNextScreen = () => {
    const value = 1;
    onclicksend(value);
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-8">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Variable Id</th>
                <th>Node Id</th>
                <th>Parameter Value</th>
                <th>Activity Id</th>
              </tr>
            </thead>
            <tbody>
              {NodeVariableData.map((item, index) => (
                <tr>
                  <td>{item.variableId}</td>
                  <td>{item.nodeId}</td>
                  <td>
                    <input
                      type="text"
                      onChange={(e) =>
                        HandleNodeVarValue(e.target.value, index)
                      }
                      value={nodeParaValue[index] || ""}
                    />
                  </td>
                  <td>{getRecentActivity()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="offset-6 col-2" style={{textAlign:'right'}}>
          <div className="btn btn-success" onClick={HandleSubmitVarDetails}>
            Submit
          </div>
          &nbsp;
          <div className="btn btn-primary" onClick={HandleNextScreen}>
            Next
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateVariables;
