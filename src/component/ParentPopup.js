// import React from 'react';
import React, { useState,useEffect } from 'react';
import { FaXmark, FaCheck } from "react-icons/fa6";
import axios from 'axios';
import { Menu,MenuItem, SubMenu } from 'react-pro-sidebar';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


const ParentPopup = ({ node, onClose, onSave }) => {

  const [data, setdata] = useState();
  const [nodeType, setNodeType] = useState(node.nodeType);
  const [nodeCategory, setNodeCategory] = useState(node.nodeCategory);
  const [label, setLabel] = useState(node.data.label);
  const [xPosition, setXPosition] = useState(node.position.x);
  const [yPosition, setYPosition] = useState(node.position.y);
  const [fontsize, setFontSize] = useState(node.style.fontSize)
  const [width, setWidth] = useState( node.style.width)
  const [height, setHeight] = useState(node.style.height)
  const [borderRadius, setborderRadius] = useState(node.style.borderRadius)

  
  const [fontColor, setFontColor] = useState(node.style.color);
  const [borderColor, setBorderColor] = useState(node.style.borderColor);
  const [bgColor, setBgColor] = useState(node.style.background);
  const [fontStyle, setFontStyle] = useState(node.style.fontStyle);
  const [borderWidth, setBorderWidth] = useState(node.style.borderWidth)
  const [borderStyle, setBorderStyle] = useState(node.style.borderStyle)
  const [table_names, setTables] = useState([])
  const [selectedTable, setTablename] = useState()
  const [selectedColumns, setColumns] = useState([])
  const [ColumnName, setColumnName] = useState()
  const [QueryName, setQueryName] = useState()
  const [QueryBasic, setQueryBasic] = useState(false)
  const [QueryAdvanced, setQueryAdvanced] = useState(false)
  const [SqlQueryData, setResponseData] = useState([])
  const [ErrorMessage, setErrorMessage] = useState()




  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = 'http://localhost:5000/api/nodeMaster/tables';
    axios.get(apiUrl)
      .then((response) => {
        setTables(response.data)
        // console.log("all tables data...",response.data)  
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedTable){
    // Fetch data from the API when the component mounts
    const apiUrl = `http://localhost:5000/api/nodeMaster/tables/${selectedTable}`;
    axios.get(apiUrl)
      .then((response) => {
        setColumns(response.data)
        // console.log("selected table data...",response.data)  
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  }, [selectedTable]);


  useEffect(() => {
    if (QueryName){
    // Fetch data from the API when the component mounts
    setResponseData([])
   
      const apiUrl = `http://localhost:5000/api/nodeMaster/Query?Table=${selectedTable}&column=${ColumnName} &queryname=${QueryName}`;
      axios.get(apiUrl)
        .then((response) => {
          setResponseData(response.data)
          // console.log("selected table data...",response.data)  
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setErrorMessage(error.response.data.message)
        });
      }
      
    }, [QueryName]);

    console.log(SqlQueryData);
    
  // Function to handle input changes
  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handleborderRadiusChange = (event) => {
    setborderRadius(event.target.value);
  };


  const handleNodeTypeChange = (event) => {
    setNodeType(event.target.value);
    // console.log(nodeType)
    // Add code here to update width and height based on the new nodeType
    if (event.target.value === "Material") {
      setWidth('80px'); // Set the default width for Material
      setHeight('80px'); // Set the default height for Material
      setborderRadius('50%')
      // setLabel('Material')
    }
    else if(event.target.value === "Machine"){
      // console.log(node.style.width,"Machine");
      setWidth('150px')
      setHeight('40px')
      setborderRadius('0%')
      const color = "#000000"
      setBorderColor(color)
      setBorderWidth("1px")
      // setLabel('Machine')
    }
  };

  const handleNodeCategory = (event) => {
    setNodeCategory(event.target.value)
    // console.log(event.target.value,"Color")
    if (event.target.value === "Waste") {
      setWidth('80px'); // Set the default width for Material
      setHeight('80px'); // Set the default height for Material
      setborderRadius('50%')
      // setLabel('Material')
      const color = "#FF0000"
      setBorderColor(color)
      setBorderWidth("2px")
    }
    else if(event.target.value === "Finished Goods" 
            || event.target.value === "Raw Material" 
            || event.target.value === "Work In Progress"){
              const color = "#000"
              setBorderColor(color)
              setWidth('80px'); // Set the default width for Material
              setHeight('80px'); // Set the default height for Material
              setborderRadius('50%')
            }
  }

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
    // console.log(borderColor)
  }
  const handleFontstyle = (event) =>{
    setFontStyle(event.target.value)
  }

  const HandleActivity = (event) => {
    setTablename(event.target.value);
  };

  const HandleColumn = (event) => {
    setColumnName(event.target.value);
  };

  const HandleQuery = (event) => {
    setQueryName(event.target.value);

  };
  const HandleQueryBasic = (event) => {
    setQueryBasic(true);
    setQueryAdvanced(false);
    
  };
  const HandleQueryAdvanced = (event) => {
    setQueryAdvanced(true);
    setQueryBasic(false);
  };
 
  const handleSave = () => {
    // Calculate the center position for the label within the node
    const labelX = node.position.x + node.style.width / 2;
    const labelY = node.position.y + node.style.height / 2;
    // Call the onSave function with the updated node object
    onSave({
      ...node,
      nodeType:nodeType,
      nodeCategory:nodeCategory,
      data: { ...node.data, label: label  },
      // data: { ...node.data, label: `${label} ${sqlQueryData}` },
      position: { x: xPosition, y: yPosition },
      style:{ fontSize:fontsize,
              width:width ,
              height:height,
              color:fontColor,
              background:bgColor,
              borderColor:borderColor,
              fontStyle:fontStyle,
              borderWidth:borderWidth,    
              borderStyle:borderStyle,
              borderRadius:borderRadius,
              // textAlign:'center',
              display:'flex',
              justifyContent: 'center', /* Horizontally center */
              alignItems:'center',/* Vertically center */
      },
      
    });

    // Set the position of the label to the center
    const updatedLabel = { ...node.data.label, position: { x: labelX, y: labelY } };
    setLabel(updatedLabel);
    onClose(); // Close the popup
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = "http://localhost:5000/api/nodeTypes";
    axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        setdata(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  


  return (
    
    <div 
      className="edge-popup"
      style={{
            width: "250px",
            height: "578px",
            position: "absolute",
            top: "48px",
            right: "0px",
            cursor:"pointer",
            padding:"10px",
            overflow:'hidden',
            backgroundColor: "white",
            border:'1px solid black',
            boxShadow: "2px 2px 10px 0.1px black"
          }}
        >
        <div 
        onClick={onClose}
        style={{backgroundColor:'red',
                color:'whitesmoke',
                width:'20px',
                height:'20px',
                textAlign:'center',
                lineHeight:1,
                position:'absolute',
                right:'1px',
                top:'1px'
                }}>
                <FaXmark />
        </div>
        <div className='pt-2'>
          <Menu>
          <SubMenu style={{paddingLeft:'0px'}} label="Edit">
          <table style={{backgroundColor:'whitesmoke'}}>
            <tr key={node.nodeId}>
              <td>Node Id:</td>
            
              <td>
                {node.nodeId}
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
                    <option hidden>Node Type</option>
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
              <td>Label:</td>
              <td>
                <input
                  type="text"
                  value={label}
                  style={{ width: "80px" }}
                  onChange={handleLabelChange}
                />
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
                  <option value={fontStyle}>{fontStyle}</option>
                  <option>italic</option>
                  <option>normal</option>
                  <option>oblique</option>
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
              {/* {nodeType === "Machine" ? ( */}
                <input
                  type="text"
                  style={{ width: "80px" }}
                  value={width}
                  onChange={handleWidthChange}
                />
              {/* ) : ( */}
                {/* <input
                  type="text"
                  style={{ width: "80px" }}
                  value={'40px'}
                  onChange={handleWidthChange}  
                /> */}
              {/* )} */}
            </td>
          </tr>
          <tr>
            <td>Height:</td>
            <td>
              {/* {nodeType === "Machine" ? ( */}
                <input
                  type="text"
                  style={{ width: "80px" }}
                  value={height}
                  onChange={handleHeightChange}
                />
              {/* ) : (
                <input
                  type="text"
                  style={{ width: "80px" }}
                  value={'100px'}
                  onChange={handleHeightChange}
                />
              )} */}
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
                <select 
                    style={{height:'30px',width:'80px'}} 
                    value={borderStyle} 
                    onChange={handleborderStyle}
                    >
                  <option value={borderStyle}>{borderStyle}</option>
                  <option>solid</option>
                  <option>dashed</option>
                  <option>dotted</option>
                </select>
              </td>
            </tr>
          </table>
          <div className="button-container">
            <button className='btn btn-success' onClick={handleSave}><FaCheck /></button>&nbsp;
            <button className='btn btn-danger' onClick={onClose}><FaXmark /></button>
          </div>
          </SubMenu>         
         </Menu>
        </div>
      {/* <h5>Node Details</h5> */}
      
    </div>
  );
};

export default ParentPopup;
