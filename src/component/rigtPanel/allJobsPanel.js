import "./rightpanel.css";
import React from "react";
import { useState, useEffect } from "react";
import { getOADetails } from "../../api/shovelDetails";

const AllJobs = ({ Oadetails }) => {
  console.log(Oadetails,"30004")
  const onDragStart = (event, job) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(job));
    event.dataTransfer.effectAllowed = "move";
  };
  console.log(Oadetails, "onDragStart");
  return (
    <aside>
      <div className="employee-list-container">
        <table className="table table-bordered table-striped">
          <thead className="sticky-top">
            <tr>
              <th>Job</th>
              <th>Job Description</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {Oadetails
            .filter((data) => data.OA_Status === 'Approved')
            .map(
              (item) => (
                <tr
                  className="dndnode input employee-list-item"
                  onDragStart={(event) => onDragStart(event, item)}
                  draggable
                >
                  <td style={{width:"80px"}}>{item.jobId}</td>
                  <td>{item.IT_NAME}</td>
                  <td style={{ width:"70px"}}>{item?.Delivery_Date?.split("T")[0]}</td>
                </tr> 
              )
            )}
          </tbody>
        </table>
      </div>
    </aside>
  );
};

export default AllJobs;
