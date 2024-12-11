// AnotherComponent.js
import React, { useState } from "react";
import { FaXmark, FaCheck } from "react-icons/fa6";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import {
  FaPlus,
  FaTrash,
  // FaRulerVertical,
  FaRulerHorizontal,
  // FaEdit,
  FaSave,
} from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";
import ReactFlow, {
  Panel,
  // useNodesState,
  // useEdgesState,
  // useReactFlow,
  // // Controls,
  // Background,
  // addEdge,
  // MarkerType
} from "reactflow";

function Edge() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState);
    console.log(sidebarCollapsed);
  };

  return (
    <div>
      <div
        style={{
          width: sidebarCollapsed ? "5%" : "20%",
          transition: "width 0.1s",
          zIndex: 2,
          overflow: "hidden",
          backgroundColor: "red",
        }}
      >
      </div>
      <div
        className="container-fluid"
        style={{ width: "100%", height: "100%" }}
      >
        <div>
        <Panel position="top-right">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "fixed",
                  right: 10,
                  top:'60px'
                }}
              >

              <OverlayTrigger
                      delay={{ hide: 450, show: 300 }}
                      overlay={(props) => <Tooltip {...props}>Toggle Layout</Tooltip>}
                      placement="left"
                    >
                  <Button style={{ width: "50px" }} >
                  {/* onClick={onLayout} */}
                    <FaRulerHorizontal />
                  </Button>
              </OverlayTrigger>
              {/* Other components */}
                <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => <Tooltip {...props}>Add Node</Tooltip>}
                  placement="left"
                >
                  <Button
                    style={{ width: "50px" }}
                    className="mt-2"
                    variant="primary"
                    // onClick={onAddNode}
                  >
                    <FaPlus />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => <Tooltip {...props}>Delete Node</Tooltip>}
                  placement="left"
                >
                  <Button
                    style={{ width: "50px" }}
                    className="mt-2"
                    variant="danger"
                    // onClick={deleteSelectedElements}
                  >
                    {" "}
                    <FaTrash />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => <Tooltip {...props}>Save</Tooltip>}
                  placement="left"
                >
                  <Button
                    style={{ width: "50px" }}
                    className="mt-2"
                    variant="primary"
                    // onClick={handleSave}
                  >
                    {" "}
                    <FaSave/>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => <Tooltip {...props}>Help</Tooltip>}
                  placement="left"
                >
                  <Button
                    style={{ width: "50px" }}
                    className="mt-2"
                    variant="primary"
                  >
                    {" "}
                    <BsQuestionCircleFill/>
                  </Button>
                </OverlayTrigger>
              </div>
              <div>
                <div style={{ position: "absolute", top: 220, right: 0 }}>
                  {/* {nodes.map((node) => (
                    <div key={node.id} className="node">
                      
                      {node.selected && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "5px",
                            marginRight: "-5px",
                          }}
                        >
                          <OverlayTrigger
                            delay={{ hide: 450, show: 300 }}
                            overlay={(props) => (
                              <Tooltip {...props}>Update Node</Tooltip>
                            )}
                            placement="left"
                          >
                            <Button
                              className="edit-button mt-2"
                              variant="primary"
                              // size="sm"
                              style={{ width: "50px" }}
                              onClick={() => handleEditNode(node)}
                            >
                              <FaEdit></FaEdit>
                            </Button>
                          </OverlayTrigger>
                        </div>
                      )}
                    </div>
                  ))} */}
                </div>
                <div style={{ position: "absolute", top: 230, right: 0 }}>
                  {/* {selectedNodeForEdit && (
                    <NodeEditor
                      node={selectedNodeForEdit}
                      onCancel={handleNodeCancel}
                      onSave={handleNodeSave}
                    />
                  )} */}
                </div>
              </div>
      </Panel>
        </div>
        <div className="col-12">
          
          <h4 className="offset-0 pl-5">Edge Form</h4>
          <br />
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="offset-0 col-3">
                  <label htmlFor="SequenceID">Sequence ID:</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    id="SequenceID"
                    name="SequenceID"
                    className="form-control"
                    // value={formData.userName}
                    // onChange={handleInputChange}
                    // style={{border:'0.5px solid black'}}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-3">
                  <label htmlFor="RouteID">Route ID:</label>
                </div>
                <div className="col-7">
                  <input
                    type="text"
                    id="RouteID"
                    name="RouteID"
                    className="form-control"
                    // value={formData.userID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="offset-0 col-3">
                  <label htmlFor="EdgeID">Edge ID:</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    id="EdgeID"
                    name="EdgeID"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-3">
                  <label htmlFor="SourceNodeID">Source Node ID:</label>
                </div>
                <div className="col-7">
                  <input
                    type="text"
                    id="SourceNodeID"
                    name="SourceNodeID"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="offset-0 col-3 ">
                  <label htmlFor="SourceNodeID">Source Node ID:</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    id="SourceNodeID"
                    name="SourceNodeID"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-3 ">
                  <label htmlFor="ProductCategory">Product Category:</label>
                </div>
                <div className="col-7">
                  <input
                    type="text"
                    id="ProductCategory"
                    name="ProductCategory"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="offset-0 col-3 ">
                  <label htmlFor="EdgeStyle">Edge Style:</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    id="EdgeStyle"
                    name="EdgeStyle"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-3 ">
                  <label htmlFor="EdgeColor">Edge Color:</label>
                </div>
                <div className="col-7">
                  <input
                    type="text"
                    id="EdgeColor"
                    name="EdgeColor"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="offset-0 col-3 ">
                  <label htmlFor="EdgeThickness">Edge Thickness:</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    id="EdgeThickness"
                    name="EdgeThickness"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="offset-0 col-3 ">
                  <label htmlFor="Animation">Animation:</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    id="Animation"
                    name="Animation"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="offset-0 col-3 ">
                  <label htmlFor="Arrow">Arrow:</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    id="Arrow"
                    name="Arrow"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            {/* <div className="col-6">
              <div className="row">
                <div className="offset-0 col-3 ">
                  <label htmlFor="Animation">Animation:</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    id="Animation"
                    name="Animation"
                    className="form-control"
                    // value={formData.branchID}
                    // onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div> */}
          </div>
          <br />
          <div className=" row">
            <div className="col-6">
            <div className=" offset-0 col-2">
              <button className=" btn btn-success" type="submit">
                <FaCheck />
              </button>
              &nbsp;
              <button className="btn btn-danger" type="submit">
                <FaXmark />
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edge;
