import React, { useState, useEffect } from "react";
import { FaXmark, FaCheck } from "react-icons/fa6";

const EdgePopup = ({ edge, onClose, onSave }) => {
  const [color, setColor] = useState(edge?.style.stroke);
  const [thickness, setThickness] = useState(edge?.style.strokeWidth);
  const [style, setStyle] = useState(edge?.type);
  const [showAnimation, setShowAnimation] = useState(edge?.animated);
  const [showArrows, setShowArrows] = useState(edge?.markerEnd.arrow); // Default value can be true or false based on your use case
  const [ArrowFont, setArrowFont] = useState(edge?.markerEnd.color);
  const [labels, setLabels] = useState(edge?.label);

  useEffect(() => {
    setColor(edge?.style.stroke);
    setThickness(edge?.style.strokeWidth);
    setStyle(edge?.type);
    setShowAnimation(edge?.animated);
    setShowArrows(edge?.markerEnd.arrow);
    setArrowFont(edge?.markerEnd.color);
    setLabels(edge?.label);
  }, [edge]);

  const handleColorChange = (event) => {
    setColor(event.target.value);
    // console.log(edge.stroke,edge.strokeWidth,edge.type,'*******')
  };

  const handleThicknessChange = (event) => {
    setThickness(Number(event.target.value));
  };

  const handleStyleChange = (event) => {
    setStyle(event.target.value);
  };

  const handleArrowToggle = () => {
    setShowArrows(!showArrows);
    console.log(showArrows, "boolean");
  };

  const handleArrowColor = (event) => {
    setArrowFont(event.target.value);
  };

  const handleAnimationToggle = () => {
    setShowAnimation(!showAnimation);
  };

  const handleLabel = (event) => {
    setLabels(event.target.value);
  };

  const handleSave = () => {
    // Construct the updated edge object
    const updatedEdge = {
      ...edge,
      style: {
        ...edge.style,
        stroke: color,
        strokeWidth: thickness,
      },
      animated: showAnimation,
      label: labels,
      type: style,
      markerEnd: showArrows
        ? {
            type: "ArrowClosed",
            width: 30,
            height: 30,
            color: color,
            arrow: true,
          }
        : { arrow: false }, // Set to null to hide the arrows
      color: ArrowFont,
    };

    console.log(updatedEdge, "updated_data");

    // Call the onSave callback with the updated edge
    onSave(updatedEdge);

    // Close the popup
    // onClose();
  };

  return (
    <div
      className="edge-popup container-fluid"
      style={{
        width: "500px",
        height: "230px",
        position: "absolute",
        // top: "48px",
        // //  right: "0px",
        // padding: "10px",
        // backgroundColor: "whitesmoke",
        // boxShadow: "2px 2px 20px 1px black",
      }}
    >
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-6 p-3">
              <table style={{ fontSize: "11px" }}>
                <tr>
                  <td>EdgeId:</td>
                  <td>{edge?.edgeId}</td>
                </tr>
                <tr>
                  <td>Source:</td>
                  <td>
                    <input
                      style={{ width: "80px" }}
                      type="text"
                      value={edge?.source}
                      // onChange={handleThicknessChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Target:</td>
                  <td>
                    <input
                      style={{ width: "80px" }}
                      type="text"
                      value={edge?.target}
                      // onChange={handleThicknessChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Color:</td>
                  <td>
                    <input
                      style={{ width: "80px" }}
                      type="color"
                      value={color}
                      onChange={handleColorChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Thickness:</td>
                  <td>
                    <input
                      style={{ width: "80px" }}
                      type="number"
                      value={thickness}
                      onChange={handleThicknessChange}
                    />
                  </td>
                </tr>
              </table>
              <div className="button-container pt-2">
                <button className="btn btn-success" onClick={handleSave}>
                  <FaCheck />
                </button>
                &nbsp;
                <button className="btn btn-danger" onClick={onClose}>
                  <FaXmark />
                </button>
              </div>
            </div>
            <div className="col-6 p-3">
              <table style={{ fontSize: "11px" }}>
                <tr>
                  <td>Style:</td>
                  <td>
                    <select
                      style={{ width: "80px" }}
                      value={style}
                      onChange={handleStyleChange}
                    >
                      <option value={style}>{style}</option>
                      <option value="smoothstep">smoothstep</option>
                      <option value="step">step</option>
                      <option value="straight">straight</option>
                      <option value="bezier">bezier</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Arrow:</td>
                  <td>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        checked={showArrows}
                        onChange={handleArrowToggle}
                      />
                      {showArrows ? "On" : "Off"}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Arrow Color:</td>
                  <td>
                    <input
                      type="color"
                      value={ArrowFont}
                      onChange={handleArrowColor}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Animation:</td>
                  <td>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="animationCheckbox"
                        checked={showAnimation}
                        onChange={handleAnimationToggle}
                      />
                      {showAnimation ? "On" : "Off"}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Label</td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "80px" }}
                      value={labels}
                      onChange={handleLabel}
                    />
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgePopup;
