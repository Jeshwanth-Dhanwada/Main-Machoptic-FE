import React, { useContext, useEffect, useState } from "react";
import { getEdges, getNodeMaster, getRoutes } from "../api/shovelDetails";
import { FaArrowUp, FaCheck, FaMinus, FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import AuthContext from "../context/AuthProvider";
import ParameterVariable from "./ParameterVariable";

function Nodesdata({tableHeight}) {
  const {auth} = useContext(AuthContext)
  const [edgesdata, setedgesdata] = useState([]);
  const [Nodedata, setNodedata] = useState([]);
  const [Routedata, setRoutedata] = useState([]);

  const showEdges = async (key) => {
    const responsedata = await getEdges();
    setedgesdata(responsedata, key);
    // console.log(edgesdata,nodeIdselected)

  };

  useEffect(() => {
    console.log(Nodedata); // Log updated Nodedata
  }, [Nodedata]);

  const showNodes = async (key) => {
    const responsedata = await getNodeMaster();
    setNodedata(responsedata, key);
  };

  const showRoutes = async (key) => {
    const responsedata = await getRoutes();
    setRoutedata(responsedata, key);
  };

  useEffect(() => {
    showEdges();
    showNodes();
    showRoutes();
  }, []);

  const [editedIndex, setEditedIndex] = useState(null);
  const handleEdit = (index) => {
    setEditedIndex(index);
    console.log();
  };
  const removeEdit = (index) => {
    setEditedIndex(null);
  };
  const handleSave = () => {
    const editedItem = Nodedata[editedIndex];
    console.log(editedItem);
    const edite = {
      id : editedItem.id,
      branchId : editedItem.branchId,
      nodeCategory : editedItem.nodeCategory,
      unit1Measurable : editedItem.unit1Measurable,
      parentNode : editedItem.parentNode,
      extent : editedItem.extent,
      type : editedItem.type,
      unit2Mandatory : editedItem.unit2Mandatory,
      iconId : editedItem.iconId,
      itemDescription : editedItem.itemDescription,
      nodeImage : editedItem.nodeImage,
      percentage_rejects : editedItem.percentage_rejects,
      nodeCategoryId : editedItem.nodeCategoryId,
      nodeType : editedItem.nodeType,
      nodeName : editedItem.nodeName,
      width : editedItem.width,
      height : editedItem.height,
      borderRadius : editedItem.borderRadius,
      xPosition : editedItem.xPosition,
      yPosition : editedItem.yPosition,
      borderColor : editedItem.borderColor,
      borderWidth : editedItem.borderWidth,
      borderStyle : editedItem.borderStyle,
      fillColor : editedItem.fillColor,
      fillTransparency : editedItem.fillTransparency,
      isRootNode : editedItem.isRootNode,
      isParent : editedItem.isParent,
      formula : editedItem.formula,
      fuelUsed : editedItem.fuelUsed,
      fuelUnitsId : editedItem.fuelUnitsId,
      capacity : editedItem.capacity,
      capacityUnitsId : editedItem.capacityUnitsId,
      sourcePosition : editedItem.sourcePosition,
      targetPosition : editedItem.targetPosition,
      FontColor : editedItem.FontColor,
      FontStyle : editedItem.FontStyle,
      FontSize : editedItem.FontSize,
      userId : editedItem.userId,
    };
    console.log(edite);
    axios
      .put(`${BASE_URL}/api/nodeMaster/${editedItem.nodeId}`, edite)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(null);
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'custom-toast'
          }
        );
        showNodes();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setEditedIndex(null);
      });
  };
  function getNodeNameById(nodeId) {
    const node = Nodedata.find((item) => item.nodeId === nodeId);
    return node ? node.nodeName : "Node Not Found";
  }

  const [container,setContainer] = useState(false)
  const [selectnode,setSelectnode] = useState()
  const handleOpen = (nodeId) => {
    setContainer(!container)
    setSelectnode(nodeId)
    // onClick(nodeId)
  }
  const HanldeModalContainer = () => {
    setContainer(false)
  }
  const [height, setHeight] = useState();
  useEffect(() => {
    console.log(tableHeight,"heightt")
    if(tableHeight > '1' && tableHeight < '360'){
      setHeight(tableHeight-'100');
    }
    else{
      setHeight('350px')
    }
  }, []);
  return (
    <div>
      {container === true && (
        <ParameterVariable container={container} selectnode={selectnode} onclick={HanldeModalContainer}/>
      )}
      <div className="container-fluid" style={{
          // height: tableHeight ? tableHeight : '200px',
          height:  height,
          overflowY: "scroll",
          overflowX :"hidden"
        }}>
        <div className="row">
          <div className="col-12">
            <table className="table table-bordered table-striped">
              <thead className="sticky-top">
                <tr>
                  <th>Node Id</th>
                  <th>Node Name</th>
                  <th>Node type</th>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Border Color</th>
                  <th>Border Width</th>
                  <th>Border Style</th>
                  <th>Font Color</th>
                  <th>Font Style</th>
                  <th>Font Size</th>
                  <th>unit1 Measurable</th>
                  <th>unit2 Mandatory</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Nodedata.filter((exe)=> exe.nodeType !== "device" && exe.nodeType !== "employee").
                map((item, index) => (
                  <tr style={{ cursor: "pointer" }}>
                    <td>{item.nodeId}</td>
                    <td>{item.nodeName}</td>
                    <td>{item.nodeType}</td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          type="text"
                          value={item.width}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].width = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "40px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        ></input>
                      ) : (
                        <div>{item.width}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          type="text"
                          value={item.height}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].height = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "40px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        ></input>
                      ) : (
                        <div>{item.height}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          type="color"
                          value={item.borderColor}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].borderColor = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "40px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        ></input>
                      ) : (
                        <div>{item.borderColor}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          type="text"
                          value={item.borderWidth}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].borderWidth = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "40px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        ></input>
                      ) : (
                        <div>{item.borderWidth}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <select
                          value={item.borderStyle}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].borderStyle = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "40px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        >
                          <option hidden>FontStyle</option>
                          <option value={"solid"}>solid</option>
                          <option value={"dashed"}>dashed</option>
                          <option value={"dotted"}>dotted</option>
                        </select>
                      ) : (
                        <div>{item.borderStyle}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          type="color"
                          value={item.FontColor}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].FontColor = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "40px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        ></input>
                      ) : (
                        <div>{item.FontColor}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <select
                          value={item.FontStyle}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].FontStyle = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "50px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        >
                          <option hidden>FontStyle</option>
                          <option>italic</option>
                          <option>normal</option>
                          <option>oblique</option>
                        </select>
                      ) : (
                        <div>{item.FontStyle}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <input
                          type="text"
                          value={item.FontSize}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].FontSize = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "40px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        ></input>
                      ) : (
                        <div>{item.FontSize}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <select
                          value={item.unit1Measurable}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].unit1Measurable = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "70px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        >
                          <option hidden>unit1Measurable</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      ) : (
                        <div>{item.unit1Measurable}</div>
                      )}
                    </td>
                    <td>
                      {editedIndex === index ? (
                        <select
                          value={item.unit2Mandatory}
                          onChange={(e) => {
                            const newData = [...Nodedata];
                            newData[index].unit2Mandatory = e.target.value;
                            setNodedata(newData);
                          }}
                          style={{
                            border: "none",
                            width: "70px",
                            height: "20px",
                            backgroundColor: "whitesmoke",
                          }}
                        >
                          <option hidden>unit2Mandatory</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      ) : (
                        <div>{item.unit2Mandatory}</div>
                      )}
                    </td>
                    <td>
                      <td>
                        <div style={{ display: "flex" }}>
                          {editedIndex === index ? (
                            <>
                              <button
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                                onClick={removeEdit}
                              >
                                <FaXmark id="FaMinus"/>
                              </button>
                            </>
                          ) : (
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            //         onClick={() => handleDeleteFGMapping(item.id)}
                            >
                              <FaMinus id="FaMinus"/>
                            </button>
                          )}
                          &nbsp;&nbsp;
                          {editedIndex === index ? (
                            <>
                              <button
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                                onClick={(event) => handleSave()}
                              >
                                <FaCheck id="FaCheck"/>
                              </button>
                            </>
                          ) : (
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                              onClick={() => handleEdit(index)}
                            >
                              <FaEdit id="FaEdit"/>
                            </button>
                          )}
                          &nbsp;&nbsp;
                          <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                              // type="button" 
                              // class="btn btn-primary"
                              data-toggle="modal" 
                              data-target="#exampleModalCenter"
                              onClick={() => handleOpen(item)}
                            >
                             <FaArrowUp />
                            </button>
                        </div>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nodesdata;
