import React, { useState } from "react";
import { FaXmark, FaCheck } from "react-icons/fa6";
import NodeEditor from "./NodeEditor.js";
import { useNodesState } from "react-flow-renderer";
import { initialNodes } from "../nodes-edges.js";

const NodePopup = ({ node, onClose, onSave }) => {
  const [editedLabel, setEditedLabel] = useState(node.data.label);
  const [selectedNodeForEdit, setSelectedNodeForEdit] = useState(null);
  const [setNodes] = useNodesState(initialNodes);
  //   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


  const handleLabelChange = (event) => {
    setEditedLabel(event.target.value);
    console.log("+++++");
  };
  const handleNodeSave = (editedNode) => {
    const updatedNodes = node.map((node) =>
      node.id === editedNode.id ? editedNode : node
    );
    setNodes(updatedNodes);
    setSelectedNodeForEdit(null);
  };

  const handleNodeCancel = () => {
    setSelectedNodeForEdit(null);
  };
  return (
    <div
      className="node-popup"
      style={{
        width: "200px",
        height: "390px",
        position: "absolute",
        top: "200px",
        padding: "10px",
        backgroundColor: "whitesmoke",
        boxShadow: "2px 2px 20px 1px black",
      }}
    >
      <div className="popup-content">
        {/* <h2>Node Information</h2>
        <p>ID: {node.id}</p>
        <p>Label: {node.data.label}</p>*/}
        
        {/* <button
          onClick={onClose}
          style={{ position: "absolute", right: "2px" }}
        >
          &times;
        </button> */}
        <table>
          <tr>
            <td>Label:</td>
            <td>
              <input
                type="text"
                value={editedLabel}
                onChange={handleLabelChange}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
          <tr>
            <td>X-Position:</td>
            <td>
              <input
                type="number"
                value={node.position.x}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
          <tr>
            <td>Y-Position:</td>
            <td>
              <input
                type="number"
                value={node.position.y}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
          <tr>
            <td>Font-Size:</td>
            <td>
              <input type="tel"
              value={node.style.fontSize || '14'}
              style={{ width: "80px" }} />

            </td>
          </tr>
          <tr>
            <td>Font-Style:</td>
            <td>
              {/* <input type="text"
              value={node.style.fontStyle}
              style={{ width: "80px" }} /> */}
              <select style={{ width: "80px" }}>
                <option value={node.style.fontStyle}></option>
                <option>Calibri</option>
                <option>Arial</option>
                <option>Comic Sans MS</option>
                <option>Forte</option>
                <option>Verdana</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Font-Color:</td>
            <td>
              <input type="color" 
              value={node.style.color}
              style={{ width: "80px" }} />
            </td>
          </tr>
          <tr>
            <td>Border-Color:</td>
            <td>
              <input
                type="color"
                style={{ width: "80px" }}
                value={`2px solid ${node.style.border || 'black'}`}
              />
            </td>
          </tr>
          <tr>
            <td>Bg-Color:</td>
            <td>
              <input type="color"
              value={node.style.background}
              style={{ width: "80px" }} />
            </td>
          </tr>
          <tr>
            <td>Width:</td>
            <td>
              <input
                type="number"
                style={{ width: "80px" }}
                value={node.style.width}
              />
            </td>
          </tr>
          <tr>
            <td>Height:</td>
            <td>
              <input
                type="number"
                style={{ width: "80px" }}
                value={node.style.height}
              />
            </td>
          </tr>
        </table>
        <br />
        <tr>
          <td>
            <button
              className="btn btn-success"
              onClick={() => onSave(node)}
              
            >
              <FaCheck />
            </button>{" "}
            &nbsp;&nbsp;
            <button className="btn btn-danger" onClick={onClose}>
              <FaXmark />
            </button>
            {selectedNodeForEdit && (
              <NodeEditor
                node={selectedNodeForEdit}
                // onSave={handleNodeSave}
                onCancel={handleNodeCancel}
              />
            )}
          </td>
        </tr>
        <br />
      </div>
    </div>
  );
};

export default NodePopup;
