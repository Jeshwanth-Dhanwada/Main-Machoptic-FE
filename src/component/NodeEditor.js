import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
// import { Background } from 'reactflow';
import { FaXmark, FaCheck } from "react-icons/fa6";
import axios from 'axios';


const NodeEditor = ({ node, onSave, onCancel }) => {
  const [data, setdata] = useState();
  const [nodeType, setNodeType] = useState(node.nodeType);
  const [editedLabel, setEditedLabel] = useState(node.data.label);
  const [xPosition, setXPosition] = useState(node.position.x);
  const [yPosition, setYPosition] = useState(node.position.y);
  const [fontsize, setFontSize] = useState(node.style.fontSize)
  const [width, setWidth] = useState(node.style.width)
  const [height, setHeight] = useState(node.style.height)
  
  const [fontColor, setFontColor] = useState(node.style.color);
  const [borderColor, setBorderColor] = useState(node.style.borderColor);
  const [bgColor, setBgColor] = useState(node.style.background);
  const [fontStyle, setFontStyle] = useState(node.style.fontStyle);
  const [borderWidth, setBorderWidth] = useState(node.style.borderWidth)
  const [borderStyle, setBorderStyle] = useState(node.style.borderStyle)
  const [nodeCategory, setNodeCategory] = useState(node.nodeCategory);



  const handleLabelChange = (event) => {
    setEditedLabel(event.target.value);
    console.log("+++++")
  };

  const handleNodeTypeChange = (event) => {
    setNodeType(event.target.value);
    // console.log(nodeType)
    // Add code here to update width and height based on the new nodeType
    if (event.target.value === "Material") {
      setWidth('40px'); // Set the default width for Material
      setHeight('100px'); // Set the default height for Material
    }
    else{
      setWidth(node.style.width)
      setHeight(node.style.height)
    }
  };

  const handleborderWidth = (event) =>{
    setBorderWidth(event.target.value)
  }
  const handleborderStyle = (event) =>{
    setBorderStyle(event.target.value)
  }
  const handleXPositionChange = (event) => {
    setXPosition(Number(event.target.value));
  };
  const handleYPositionChange = (event) => {
    setYPosition(Number(event.target.value));
  };
  const handleFontSizeChange = (event) =>{
    setFontSize((event.target.value))
  }
  const handleWidthChange = (event) =>{
    setWidth((event.target.value))
  }
  const handleHeightChange = (event) =>{
    setHeight((event.target.value))
  }
  const handleFontColor = (event) =>{
    setFontColor(event.target.value)
  }
  const handleBackGroud = (event) =>{
    setBgColor(event.target.value)
  }
  const handleBorderCOlor = (event) =>{
    setBorderColor(event.target.value)
    console.log(borderColor)
  }
  const handleFontstyle = (event) =>{
    setFontStyle(event.target.value)
  }

  const handleNodeCategory = (event) => {
    setNodeCategory(event.target.value)
  }

  const handleSave = () => {
    // Call the onSave function with the updated node object
    onSave({
      ...node,
      nodeType:nodeType,
      nodeCategory:nodeCategory,
      data: { ...node.data, label: editedLabel },
      position: { x: xPosition, y: yPosition },
      style:{ fontSize:fontsize,
              width:width,
              height:height,
              color:fontColor,
              background:bgColor,
              borderColor:borderColor,
              fontStyle:fontStyle,
              borderWidth:borderWidth,    
              borderStyle:borderStyle  
      },
      
    });
    onCancel(); // Close the popup
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = "http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/nodeTypes";
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setdata(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="node-editor" style={{backgroundColor:'whitesmoke'}}>
      
      <div
        style={{
          width: "220px",
          height: "578px",
          position: "absolute",
          top: "7px",
          right: "0px",
          padding: "10px",
          backgroundColor: "whitesmoke",
          boxShadow: "2px 2px 20px 1px black"
        }}
      >
        {/* <label htmlFor="label">Label:</label>
        <input
          type="text"
          id="label"
          value={editedLabel}
          onChange={handleLabelChange}
          style={{
            width: "80px",
            // height: "449px",
          }}
        /> */}
        <h5>Edit Node</h5>
        <table>
        <tr>
            <td>Node Id:</td>
           
            <td>
              {node.nodeId}
            </td>
          </tr>
          <tr>
            <td>Label:</td>
            <td>
              <input
                type="text"
                style={{ width: "80px" }}
                value={editedLabel}
                onChange={handleLabelChange}
              />
            </td>
          </tr>
          <tr>
            <td>Node Type</td>
            <td>
              <select 
                  style={{ width: "80px",height:'30px' }}
                  onChange={handleNodeTypeChange}
                  value={nodeType}
                  >
                  <option disabled>Node Type</option>
                  {data 
                      ? data.map((item)=>(
                          <option key={item.Type} value={item.Type}>
                            {item.Type}
                          </option>
                    ))
                  :''}
              </select>
            </td>
          </tr>
          <tr>
              <td>Node Category</td>
              <td>
              {nodeType === "Material" ? (
                <select 
                    style={{ width: "80px",height:'30px' }}
                    onChange={handleNodeCategory}
                    value={nodeCategory}
                    >
                    <option hidden>
                      Please Select
                    </option>
                    <option>Finished Goods</option>
                    <option>Work In Progress</option>
                    <option>Raw Material</option>
                    <option>Waste</option>
                </select>
                ):
                <select 
                  style={{ width: "80px",height:'30px' }}
                  onChange={handleNodeCategory}
                  value={nodeCategory}
                  disabled
                  >
                  <option disabled>
                    {node.nodeCategory}
                  </option>
                  <option>Finished Goods</option>
                  <option>Work In Progress</option>
                  <option>Raw Material</option>
                </select>
                }
              </td>
            </tr>
          <tr>
            <td>X-Position:</td>
            <td>
              <input
                type="text"
                value={xPosition}
                onChange={handleXPositionChange}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
          <tr>
            <td>Y-Position:</td>
            <td>
              <input
                type="text"
                value={yPosition}
                onChange={handleYPositionChange}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
          <tr>
            <td>Font-Size:</td>
            <td>
              <input type="text"
              value={fontsize}
              onChange={handleFontSizeChange}
              style={{ width: "80px" }} />

            </td>
          </tr>
          <tr>
            <td>Font-Style:</td>
            <td>
              <select style={{ width: "80px" }}
              value={fontStyle}
              onChange={handleFontstyle}
              >
                <option 
                value={fontStyle}
                >
                  {fontStyle}
                  </option>
                <option>italic</option>
                <option>normal</option>
                <option>oblique</option>
                {/* {/* <option>Forte</option>
                <option>Verdana</option> */}
              </select>
            </td>
          </tr>
          <tr>
            <td>Font-Color:</td>
            <td>
              <input type="color" 
              value={fontColor}
              onChange={handleFontColor}
              style={{ width: "80px" }} />
            </td>
          </tr>
          <tr>
            <td>Border-Color:</td>
            <td>
              <input
                type="color"
                style={{ width: "80px" }}
                value={borderColor}
                onChange={handleBorderCOlor}
              />
            </td>
          </tr>
          <tr>
            <td>Bg-Color:</td>
            <td>
              <input type="color"
              style={{ width: "80px" }} 
              value={bgColor}
              onChange={handleBackGroud}
              />
            </td>
          </tr>
          <tr>
            <td>Width:</td>
            <td>
              <input
                type="text"
                style={{ width: "80px" }}
                value={width}
                onChange={handleWidthChange}
              />
            </td>
          </tr>
          <tr>
            <td>Height:</td>
            <td>
              <input
                type="text"
                style={{ width: "80px" }}
                value={height}
                onChange={handleHeightChange}
              />
            </td>
          </tr>
          <tr>
            <td>Border Width:</td>
            <td>
              <input
                type="text"
                style={{ width: "80px" }}
                value={borderWidth}
                onChange={handleborderWidth}
              />
            </td>
          </tr>
          <tr>
            <td>Border Color:</td>
            <td>
              {/* <input
                type="text"
                style={{ width: "80px" }}
                value={borderStyle}
                onChange={handleborderStyle}
              /> */}
              <select 
              value={borderStyle} onChange={handleborderStyle}
              >
                <option 
                value={borderStyle}
                >
                  {borderStyle}
                </option>
                <option>solid</option>
                <option>dashed</option>
                <option>dotted</option>
              </select>
            </td>
          </tr>
        </table>
        <Button className='mt-1' variant="success" onClick={handleSave}>
        <FaCheck />
        </Button>
          &nbsp;
        <Button className='mt-1' variant="danger" onClick={onCancel}>
        <FaXmark />
        </Button>
      </div>&nbsp;
    </div>
  );
};


export default NodeEditor




