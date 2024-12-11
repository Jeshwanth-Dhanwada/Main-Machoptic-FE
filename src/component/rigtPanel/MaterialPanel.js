import "./rightpanel.css";
import React from "react";

const MaterialsPanel = ({ ItemMaster }) => {
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
            <tr style={{ fontSize: "smaller" }}>
              <th style={{ width: "35%",fontSize: "11px"  }}>Item Code</th>
              <th style={{ fontSize: "11px"  }}>Item Description</th>
            </tr>
          </thead>
          <tbody>
            {ItemMaster
            .filter((item) => item.ItemType === "RM-Film" 
                              || item.ItemType === "RM-Fabric" 
                              || item.ItemType === "Raw Material")
            .map((item) => (
              <tr
                onDragStart={(event) => onDragStart(event, item)}
                draggable
              >
                <td>
                  {item.IT_CODE}
                </td>
                <td>{item.IT_NAME}</td>
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

export default MaterialsPanel;
