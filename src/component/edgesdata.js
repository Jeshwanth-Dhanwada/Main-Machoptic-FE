import React, { useContext, useEffect, useState } from "react";
import { getEdges, getNodeMaster, getRoutes } from "../api/shovelDetails";
import { FaCheck, FaMinus, FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
import { Form } from "react-bootstrap";
import AuthContext from "../context/AuthProvider";

function Edgesdata({ RoutedatafromEdge, onClick, tableHeight,sendtoConfigurations}) {
  const {auth} = useContext(AuthContext)
  const [edgesdata, setedgesdata] = useState([]);
  const [Nodedata, setNodedata] = useState([]);
  const [Routedata, setRoutedata] = useState([]);
  const [PercentInput, setPercentInput] = useState([]);

  const showEdges = async (key) => {
    const responsedata = await getEdges();
    const edges = responsedata.filter((item1, index) => item1.routeId == RoutedatafromEdge?.routeid)
    setedgesdata(edges, key);
  };

  const showNodes = async (key) => {
    const responsedata = await getNodeMaster();
    setNodedata(responsedata, key);
  };

  const showRoutes = async (key) => {
    const responsedata = await getRoutes();
    setRoutedata(responsedata, key);
  };

  useEffect(() => {
    if(RoutedatafromEdge){
      showEdges();
      showNodes();
      showRoutes();
    }
  }, [RoutedatafromEdge]);

  const sendDataToParent = (selectededge) => {
    onClick(selectededge)
  };


  const [editedIndex, setEditedIndex] = useState(null);
  const handleEdit = (index,Id) => {
    setEditedIndex(index);
    console.log(index,Id,"idcheck")
  };
  const removeEdit = (index) => {
    setEditedIndex(null);
    setPercentInput([])
  };
  const handleSave = () => {
    const editedItem = edgesdata[editedIndex];
    const edite = {
      id: editedItem.id,
      edgeId: editedItem.edgeId,
      routeId: editedItem.routeId,
      edgeStyle: editedItem.edgeStyle,
      sourceId: editedItem.sourceId,
      targetId: editedItem.targetId,
      animation: editedItem.animation,
      sourceNodeId: editedItem.sourceNodeId,
      targetNodeId: editedItem.targetNodeId,
      label: editedItem.label,
      edgeColor: editedItem.edgeColor,
      edgeThickness: editedItem.edgeThickness,
      arrow: editedItem.arrow,
      branchId: auth.branchId.toString(),
      sequenceId: "sequenceId",
      sourceNodeType: editedItem.sourceNodeType,
      targetNodeType: editedItem.targetNodeType,
      edgeDescription: "edgeDescription",
      unitsId: "unitsId",
      materialType: "materialType",
      userId: auth.empId.toString(),
      // PercentOfInput: PercentInput
      
    };
    console.log(edite,"idcheck");
    axios
      .put(`${BASE_URL}/api/edgeMaster/${editedItem.edgeId}`, edite)
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(null);
        sendtoConfigurations(editedItem.edgeId);
        toast.success(
          <span><strong>Successfully</strong> Updated.</span>,
          {position: toast.POSITION.BOTTOM_RIGHT,className: 'custom-toast'}
        );
        showEdges();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setEditedIndex(null);
      });
  };
  function getNodeNameById(nodeId) {
    const node = Nodedata.find((item) => item.nodeId === nodeId);
    return node ? node.nodeName : 'Node Not Found';
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

  // Ramesh added
  const handlePercentInput = (event) => {
    console.log("percent value",event.target.value)
    setPercentInput(event.target.value)
  }


  return (
    <div className="container-fluid" style={{
      height:  height,
      overflowY: "scroll",
      overflowX :"hidden"
    }}>
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="sticky-top">
                <tr>
                  <th>EdgeId</th>
                  <th>Description</th>
                  <th>Route</th>
                  <th>Source Node</th>
                  <th>Source Description</th>
                  <th>Target Node</th>
                  <th>Target Description</th>
                  <th>Style</th>
                  <th>Color</th>
                  <th>Thickness</th>
                  <th>Animation</th>
                  <th>Arrow</th>
                  <th>% Of Input</th>
                  <th>Actions</th>
                </tr>
              </thead>
                <tbody>
                {RoutedatafromEdge && RoutedatafromEdge.routeid? (
                  console.log("edgesdata:", edgesdata.filter(
                    (item1, index) =>
                      item1.routeId == RoutedatafromEdge?.routeid)),
                  edgesdata
                    .filter(
                      (item1, index) =>
                        item1.routeId == RoutedatafromEdge?.routeid)
                    .map((item, index) => (
                      <tr
                        key={item.edgeId}
                        style={{ cursor: "pointer", }}
                        onClick={() => sendDataToParent(item.id)}
                      >
                        <td style={{ textAlign: "center", }}>{item.edgeId}</td>
                        <td style={{}}>
                          {editedIndex === index ? (
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const newData = [...edgesdata];
                                newData[index].label = e.target.value;
                                setedgesdata(newData);
                              }}
                              style={{
                                border: "none",
                                width: "60px",
                                height: "20px",
                                backgroundColor: "whitesmoke",
                              }}
                            ></input>
                          ) : (
                            <div>{item.label}</div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editedIndex === index ? (
                            <select
                              value={item.routeId}
                              onChange={(e) => {
                                const newData = [...edgesdata];
                                newData[index].routeId = e.target.value;
                                setedgesdata(newData);
                              }}
                              style={{
                                border: "none",
                                width: "45px",
                                height: "20px",
                                backgroundColor: "whitesmoke",
                              }}
                            >
                              <option hidden>Route Id</option>
                              {Routedata.map((item) => (
                                <option value={item.routeId}>{item.routeId}</option>
                              ))}
                            </select>
                          ) : (
                            <div>{item.routeId}</div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>{item.sourceNodeId}</td>
                        <td style={{ textAlign: "center" }}>{getNodeNameById(item.sourceNodeId)}</td>
                        <td style={{ textAlign: "center" }}>{item.targetNodeId}</td>
                        <td style={{ textAlign: "center" }}>{getNodeNameById(item.targetNodeId)}</td>
                        <td>
                          {editedIndex === index ? (
                            <select
                              value={item.edgeStyle}
                              onChange={(e) => {
                                const newData = [...edgesdata];
                                newData[index].edgeStyle = e.target.value;
                                setedgesdata(newData);
                              }}
                              style={{
                                border: "none",
                                width: "70px",
                                height: "20px",
                                backgroundColor: "whitesmoke",
                              }}
                            >
                              <option hidden>Edge Style</option>
                              <option value="smoothstep">smoothstep</option>
                              <option value="step">step</option>
                              <option value="straight">straight</option>
                              <option value="bezier">bezier</option>
                            </select>
                          ) : (
                            <div>{item.edgeStyle}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              type="color"
                              value={item.edgeColor}
                              onChange={(e) => {
                                const newData = [...edgesdata];
                                newData[index].edgeColor = e.target.value;
                                setedgesdata(newData);
                              }}
                              style={{
                                border: "none",
                                width: "35px",
                                height: "20px",
                                backgroundColor: "whitesmoke",
                              }}
                            ></input>
                          ) : (
                            <div>{item.edgeColor}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <input
                              type="number"
                              value={item.edgeThickness}
                              onChange={(e) => {
                                const newData = [...edgesdata];
                                newData[index].edgeThickness = e.target.value;
                                setedgesdata(newData);
                              }}
                              style={{
                                border: "none",
                                width: "60px",
                                height: "20px",
                                backgroundColor: "whitesmoke",
                              }}
                            ></input>
                          ) : (
                            <div>{item.edgeThickness}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <select
                              value={item.animation}
                              onChange={(e) => {
                                const newData = [...edgesdata];
                                newData[index].animation = e.target.value;
                                setedgesdata(newData);
                              }}
                              style={{
                                border: "none",
                                width: "50px",
                                height: "20px",
                                backgroundColor: "whitesmoke",
                              }}
                            >
                              <option hidden>Animation</option>
                              <option value="True">True</option>
                              <option value="False">False</option>
                            </select>
                          ) : (
                            <div>{item.animation}</div>
                          )}
                        </td>
                        <td>
                          {editedIndex === index ? (
                            <select
                              value={item.arrow}
                              onChange={(e) => {
                                const newData = [...edgesdata];
                                newData[index].arrow = e.target.value;
                                setedgesdata(newData);
                              }}
                              style={{
                                border: "none",
                                width: "35px",
                                height: "20px",
                                backgroundColor: "whitesmoke",
                              }}
                            >
                              <option hidden>Arrow</option>
                              <option value="True">True</option>
                              <option value="False">False</option>
                            </select>
                          ) : (
                            <div>{item.arrow}</div>
                          )}
                        </td>
                        <td>
                        {editedIndex === index && item.sourceNodeType == 'Machine' && item.targetNodeType == 'Material' ? (
                        <Form.Control type="number" style={{width:"90px",height:"30px"}} min={0} value={item.PercentOfInput} onChange={handlePercentInput} />
                        ):(
                          <div>{item.PercentOfInput !== null && item.PercentOfInput !== undefined ? item.PercentOfInput : "NA"}</div>)}
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
                                  onClick={() => handleEdit(index,item.edgeId)}
                                >
                                  <FaEdit  id="FaEdit"/>
                                </button>
                              )}
                            </div>
                          </td>
                        </td>
                      </tr>
                    ))
                  ) : (
                      <tr>
                      <td colSpan={16} style={{ textAlign: "center" }}>
                        <div style={{ fontSize:"16px", color: "red" }}>Please select a route </div>
                       </td>
                       </tr> )}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edgesdata;
