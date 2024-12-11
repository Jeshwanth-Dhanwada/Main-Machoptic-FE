import "./rightpanel.css";
import React from "react";

const StaffAllocation = ({ employees, Employeedata }) => {
  const onDragStart = (event, empData) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(empData)
    );
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <aside>
      <div className="employee-list-container">
        {/* <div style={{ height: "350px", overflowY: "auto" }}> */}
        <table className="table table-bordered table-striped">
          <thead className="sticky-top">
            <tr style={{ fontSize: "small" }}>
              <th style={{ width: "55%",fontSize: "11px" }}>Employee</th>
              <th style={{fontSize: "11px"}}>Designation</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "small" }}>
            {Employeedata.map((item) => (
              <tr
                onDragStart={(event) => onDragStart(event, item)}
                draggable
              >
                <td>
                  {item.empId} - {item.employeeName}
                </td>
                <td>{item.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* </div> */}
        {/* {Employeedata.map(emp => 
      <div
        className="dndnode input employee-list-item"
        onDragStart={(event) => onDragStart(event, emp)}
        draggable
      >
          {emp.userName}
      </div>
        )} */}
      </div>
    </aside>
  );
};

export default StaffAllocation;
