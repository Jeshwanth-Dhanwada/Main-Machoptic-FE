// import React from 'react';
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import {
  getMachineMaster,
  getMaterialMaster,
  getNodeMaster,
} from "../api/shovelDetails";
import { v4 as uuidv4 } from "uuid";
import { AiFillDelete } from "react-icons/ai";
import AuthContext from "../context/AuthProvider";

// Dialog box imports ---------
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { FaCheck } from "react-icons/fa6";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const NodesPopup = ({ node, onClose, onSave, onClick }) => {
  const { auth } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [data, setdata] = useState();
  const [nodeType, setNodeType] = useState(node?.nodeType);
  const [MachineType, setMachineType] = useState(node?.MachineType);
  const [nodeCategory, setNodeCategory] = useState(node?.nodeCategory);
  const [label, setLabel] = useState(node?.data.label);
  const [xPosition, setXPosition] = useState(node?.position.x);
  const [yPosition, setYPosition] = useState(node?.position.y);
  const [fontsize, setFontSize] = useState(node?.style.fontSize);
  const [width, setWidth] = useState(node?.width);
  const [height, setHeight] = useState(node?.height);
  const [borderRadius, setborderRadius] = useState(node?.style.borderRadius);
  const [itemDescription, setitemDescription] = useState(node?.itemDescription);
  const [unit1Measurable, setMeasurable] = useState(node?.unit1Measurable);
  const [unit2Mandatory, setMandatory] = useState(node?.unit2Mandatory);
  const [fontColor, setFontColor] = useState(node?.style.color);
  const [borderColor, setBorderColor] = useState(node?.style.borderColor);
  const [bgColor, setBgColor] = useState(node?.style.background);
  const [fontStyle, setFontStyle] = useState(node?.style.fontStyle);
  const [borderWidth, setBorderWidth] = useState(node?.style.borderWidth);
  const [borderStyle, setBorderStyle] = useState(node?.style.borderStyle);
  const [ImageStyle, setImageStyle] = useState(node?.type);
  const [file, setFile] = useState(node?.nodeImage);
  const [fileTODB, setFileTODB] = useState(node?.nodeImage);
  const [PNode, setparentNode] = useState(node?.parentNode);
  const [extent, setextent] = useState(node?.parentNode);
  const [sourcePosition, setsourcePosition] = useState(node?.sourcePosition);
  const [targetPosition, settargetPosition] = useState(node?.targetPosition);
  const [imagePreview, setPreview] = useState();

  // Machine Master ----------

  const [Id, setId] = useState();
  const [capacity, setCapacity] = useState();
  const [capacityUnitsId, setCapacityUnitsId] = useState();
  const [fuelUsed, setfuelUsed] = useState();
  const [fuelUnitsId, setfuelUnitsId] = useState();
  const [PerRejects, setPerRejects] = useState();
  const [allowExcessQty, setallowExcessQty] = useState();

  // Material master -----------

  const [materialId, setMaterialId] = useState();
  const [producedQuantity, setProducedQuantity] = useState();
  const [consumedQuantity, setConsumedQuantity] = useState();
  const [balanceQuantity, setBalancedQuantity] = useState();
  const [producingUnits, setProducingUnits] = useState();
  const [consumingUnits, setConsumingUnits] = useState();
  const [equvalentFGUnits, setEquvalentFGUnits] = useState();
  const [measurableUnits, setMeasurableUnits] = useState();
  const [ConversionRate, setConversionRate] = useState();

  const [Nodedata, setNodedata] = useState([]);
  const showNodesdata = async (key) => {
    const responsedata = await getNodeMaster();
    setNodedata(responsedata, key);
  };

  useEffect(() => {
    showNodesdata();
  }, []);

  useEffect(() => {
    setNodeType(node?.nodeType);
    setMachineType(node?.MachineType);
    setNodeCategory(node?.nodeCategory);
    setLabel(node?.data.label);
    setXPosition(node?.position.x);
    setYPosition(node?.position.y);
    setFontSize(node?.style.fontSize);
    setWidth(node?.width);
    setHeight(node?.height);
    setborderRadius(node?.style.borderRadius);
    setitemDescription(node?.itemDescription);
    setMeasurable(node?.unit1Measurable);
    setMandatory(node?.unit2Mandatory);
    setFontColor(node?.style.color);
    setBorderColor(node?.style.borderColor);
    setBgColor(node?.style.background);
    setFontStyle(node?.style.fontStyle);
    setBorderWidth(node?.style.borderWidth);
    setBorderStyle(node?.style.borderStyle);
    setImageStyle(node?.type);
    setFile(node?.nodeImage);
    setFileTODB(node?.nodeImage);
    settargetPosition(node?.targetPosition);
    setsourcePosition(node?.sourcePosition);
  }, [node]);

  // Function to handle input changes
  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handlesourcePosition = (event) => {
    if (nodeCategory === "Finished Goods") {
      setsourcePosition("");
    } else {
      setsourcePosition(event.target.value);
    }
  };

  const handletargetPosition = (event) => {
    if (nodeCategory === "Raw Material") {
      settargetPosition("");
    } else {
      settargetPosition(event.target.value);
    }
  };
  const handleItemDescription = (event) => {
    setitemDescription(event.target.value);
  };

  const handleMeasurable = (event) => {
    setMeasurable(event.target.value);
  };

  const handleMandatory = (event) => {
    setMandatory(event.target.value);
  };

  const handleNodeTypeChange = (event) => {
    setNodeType(event.target.value);
    // console.log(nodeType)
    // Add code here to update width and height based on the new nodeType
    if (event.target.value === "Material" && nodeCategory !== "Waste") {
      setWidth("80px"); // Set the default width for Material
      setHeight("80px"); // Set the default height for Material
      setborderRadius("50%");
      setBgColor("#35ca5c");
      setFontColor("#000000");
    } else if (event.target.value === "Machine") {
      setWidth("300px");
      if (file) {
        setHeight("220px");
      } else {
        setHeight("60px");
      }
      setborderRadius("10px");
      const color = "#CCCCCC";
      setBorderColor(color);
      setBorderWidth("1px");
      setMeasurable("No");
      setMandatory("No");
      setNodeCategory("");
      setBgColor("#EEEEEE");
      setFontColor("#000000");
    }
  };

  const handleNodeCategory = (event) => {
    const { value } = event.target; // Destructure value from event.target
    setNodeCategory(value);
    console.log(value, "Color");

    // Corrections made to if conditions
    if (nodeType === "Material" && value === "Waste") {
      setWidth("80px");
      setHeight("80px");
      setborderRadius("50%");
      const color = "#CCCCCC";
      setBorderColor(color);
      setBorderWidth("2px");
      setImageStyle("");
      setBgColor("#F97C1E");
      setFontColor("#000000");
    } else if (value === "Waste") {
      setWidth("80px");
      setHeight("80px");
      setborderRadius("50%");
      const color = "#CCCCCC";
      setBorderColor(color);
      setBorderWidth("2px");
      setImageStyle("");
      setBgColor("#03FC37");
      setFontColor("#000000");
    } else if (nodeType === "Material" && value === "Finished Goods") {
      const color = "#CCCCCC";
      setBorderColor(color);
      setWidth("80px");
      setHeight("80px");
      setborderRadius("50%");
      setBgColor("#FCDEDF");
      setFontColor("#000000");
      // setsourcePosition(""); // Moved inside this condition
      setImageStyle("output");
    } else if (nodeType === "Material" && value === "Raw Material") {
      const color = "#CCCCCC";
      setBorderColor(color);
      setWidth("80px");
      setHeight("80px");
      setborderRadius("50%");
      setBgColor("#9CDBB9");
      setFontColor("#000000");
      // settargetPosition(""); // Moved inside this condition
      // setsourcePosition("right")
      setImageStyle("input");
    } else if (nodeType === "Material" && value === "Work In Progress") {
      const color = "#CCCCCC"; // Consider adding specific color for this case
      setBorderColor(color);
      setWidth("80px");
      setHeight("80px");
      setborderRadius("50%");
      setImageStyle("");
      setBgColor("#9CDBB9");
      setFontColor("#000000");
    }
  };
  const handleMachineType = (event) => {
    setMachineType(event.target.value);
  };

  const handleborderWidth = (event) => {
    setBorderWidth(event.target.value);
  };
  const handleborderStyle = (event) => {
    setBorderStyle(event.target.value);
  };

  const handleXPositionChange = (event) => {
    setXPosition(Number(event.target.value));
  };
  const handleYPositionChange = (event) => {
    setYPosition(Number(event.target.value));
  };
  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };
  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };
  const handleHeightChange = (event) => {
    setHeight(event.target.value);
  };
  const handleFontColor = (event) => {
    setFontColor(event.target.value);
  };
  const handleBackGroud = (event) => {
    setBgColor(event.target.value);
  };

  const handleBorderCOlor = (event) => {
    setBorderColor(event.target.value);
    console.log(borderColor);
  };
  const handleFontstyle = (event) => {
    setFontStyle(event.target.value);
  };

  const HandleImage = (event) => {
    setFile(event.target.files[0].name);
    setFileTODB(event.target.files[0]);
    // setImageStyle("MachineIcon")
    setPreview(URL.createObjectURL(event.target.files[0]));

    if (event.target.files) {
      setHeight("220px");
      setWidth("300px");
    } else {
      setHeight("60px");
      setWidth("300px");
    }
  };
  const [assImageId, setPassImageId] = useState([]);

  const HandleremoveImage = (Id, nodeId, nodeImage) => {
    const getImageNode = Nodedata.filter(
      (item) => item.parentNode === Id && item.type === "MachineIcon"
    ).map((item1) => ({
      nodeId: item1.nodeId,
      nodeImage: item1.nodeImage,
    }));
    console.log(getImageNode);
    setPassImageId(getImageNode);
    setPreview();
    setHeight("60px");
    // axios
    //   .delete(`http://localhost:5001/image/${getImageNode[0].nodeImage}`, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response, "deleted Succesfully");
    //     setFile()
    //     setFileTODB()
    //     setHeight("60px");
    //   })
    //   .catch((err) => console.log(err, "save"));
  };
  console.log(imagePreview, "Incoming");
  console.log(height, "Incoming");

  // Machine master inputs

  const handlePerRejects = (event) => {
    setPerRejects(event.target.value);
  };
  const handleCapacity = (event) => {
    setCapacity(event.target.value);
  };

  const handleCapacityUnits = (event) => {
    setCapacityUnitsId(event.target.value);
  };

  const handleFuelConsumed = (event) => {
    setfuelUsed(event.target.value);
  };

  const handleFuelConsumedUnits = (event) => {
    setfuelUnitsId(event.target.value);
  };

  const handleAllowExcessQuntity = (event) => {
    setfuelUnitsId(event.target.value);
  };

  const HandleProducedQty = (e) => {
    setProducedQuantity(e.target.value);
  };
  const HandlesetBalancedQty = (e) => {
    setBalancedQuantity(e.target.value);
  };
  const HandlesetsetConsumedQty = (e) => {
    setConsumedQuantity(e.target.value);
  };
  const HandlesetProducingUnits = (e) => {
    setProducingUnits(e.target.value);
  };
  const HandlesetConsumingUnits = (e) => {
    setConsumingUnits(e.target.value);
  };
  const HandlesetEquvalentFGUnits = (e) => {
    setEquvalentFGUnits(e.target.value);
  };
  const HandlesetMeasurableUnits = (e) => {
    setMeasurableUnits(e.target.value);
  };
  const HandlesetConversionRate = (e) => {
    setConversionRate(e.target.value);
  };

  const handleSave = async (event) => {
    setparentNode(node.id);
    setextent("Parent");
    event.preventDefault();

    const fd = new FormData();
    fd.append("file", fileTODB);

    await axios
      .post("http://localhost:5001/upload-image", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response, "save");
      })
      .catch((err) => console.log(err, "save"));

    if (assImageId.length > 0) {
      axios
        .delete(`http://localhost:5001/image/${assImageId[0].nodeImage}`, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response, "deleted Succesfully");
          setFile();
          setFileTODB();
          setHeight("60px");
        })
        .catch((err) => console.log(err, "save"));
    }

    if (assImageId.length > 0) {
      axios
        .delete(`${BASE_URL}/api/nodeMaster/${assImageId[0].nodeId}`)
        .then((response) => {
          console.log("Node deleted successfully", response.data);
          setPreview();
          setHeight("60px");
        })
        .catch((error) => {
          console.error("Error deleting node:", error);
        });
    }

    // Calculate the center position for the label within the node
    const labelX = node.position.x + node.style.width / 2;
    const labelY = node.position.y + node.style.height / 2;
    // Call the onSave function with the updated no de object
    onSave({
      ...node,
      nodeType: nodeType,
      MachineType: MachineType,
      nodeCategory: nodeCategory,
      unit1Measurable: unit1Measurable,
      unit2Mandatory: unit2Mandatory,
      itemDescription: itemDescription,
      parentNode: PNode,
      extent: extent,
      type: ImageStyle,
      nodeImage: imagePreview,
      sourcePosition: sourcePosition,
      targetPosition: targetPosition,
      data: { ...node.data, label: label },
      position: { x: xPosition, y: yPosition },
      percentage_rejects: PerRejects,
      style: {
        fontSize: fontsize,
        width: width,
        height: height,
        color: fontColor,
        background: bgColor,
        borderColor: borderColor,
        fontStyle: fontStyle,
        borderWidth: borderWidth,
        borderStyle: borderStyle,
        borderRadius: borderRadius,
        // // textAlign:'center',
        // display: "flex",
        // justifyContent: "center" /* Horizontally center */,
        // alignItems: file ? '' : "center" /* Vertically center */,
      },
    });

    if (!Nodedata.some((item) => item.nodeImage === file) && file !== "") {
      console.log("filename Incoming");
      const NewImageNode = {
        parenId: "",
        id: uuidv4(),
        position: {
          x: Nodedata.some((item) => item.nodeId == node.nodeId) ? 60 : 75,
          y: 40,
        },
        nodeCategory: "",
        unit1Measurable: "",
        parentNode: node.id,
        extent: "parent",
        unit2Mandatory: "",
        itemDescription: "",
        nodeImage: file,
        nodeType: "MachineIcon",
        type: "MachineIcon",
        sourcePosition: "right",
        targetPosition: "left",
        iconId: "",
        percentage_rejects: 0,
        style: {
          zIndex: 1001,
          // width: node.style.width,
          width: node.style.width,
          height: node.style.height + 150,
          background: "",
          color: "",
          borderColor: "",
          borderStyle: "",
          borderWidth: "",
          fontSize: "",
          fontStyle: "",
          borderRadius: "10px",
          display: "",
          alignItems: "",
          fontColor: "",
          justifycontent: "center" /* Horizontally center */,
          alignitems: "center" /* Vertically center */,
          // textAlign:'start'
        },
        data: {
          label: file,
          node: {
            url: imagePreview,
          },
          onIconDoubbleClick: "",
        },
      };
      onClick(NewImageNode);
      console.log(NewImageNode, "imagePreview");
      console.log(node.nodeId, "imagePreview");
      console.log(
        Nodedata.filter((item) => item.nodeId == node.nodeId) ? 60 : 75,
        "imagePreview"
      );
    }

    // Set the position of the label to the center
    const updatedLabel = {
      ...node.data.label,
      position: { x: labelX, y: labelY },
    };
    setLabel(updatedLabel);
    onClose(); // Close the popup
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeTypes`;
    axios
      .get(apiUrl)
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [machineMaster, setMachineMaster] = useState([]);
  const [materialMaster, setMaterialMaster] = useState([]);

  const showMachineMaster = async () => {
    const responsedata = await getMachineMaster(); // Fetch data
    setMachineMaster(responsedata);
    // Filter data based on the condition
    const machineData = responsedata.find(
      (machine) => machine.MachineId == node.nodeId
    );
    console.log(machineData, "machineData");
    // If a match is found, set the states
    if (machineData) {
      setId(machineData.Id);
      setCapacity(machineData.capacity); // Set capacity
      setCapacityUnitsId(machineData.capacityUnits); // Set capacity units
      setfuelUsed(machineData.FuelConsumed); // Set fuel used
      setfuelUnitsId(machineData.FuelUnits); // Set fuel units
      setPerRejects(machineData.PercentagesRejects); // Set percentages rejects
      setallowExcessQty(machineData.AllowAccessQuantity); // Set allow excess quantity
    } else {
      console.log("No matching MachineId found");
    }
  };

  const showMaterialMaster = async () => {
    const responsedata = await getMaterialMaster();
    setMaterialMaster(responsedata);

    // Filter data based on the condition
    const materialData = responsedata.find(
      (machine) => machine.MaterialId == node.nodeId
    );
    console.log(materialData, "materialData?");
    // If a match is found, set the states
    if (materialData) {
      setMaterialId(materialData?.Id);
      setProducedQuantity(materialData?.ProducedQuntity);
      setConsumedQuantity(materialData?.ConsumedQuantity);
      setBalancedQuantity(materialData?.BalanceQuantity);
      setProducingUnits(materialData?.ProducingUnits);
      setConsumingUnits(materialData?.ConsumingUnits);
      setEquvalentFGUnits(materialData?.EquvalentFGUnits);
      setMeasurableUnits(materialData?.MeasurableUnits);
      setConversionRate(materialData?.ConversionRate);
    } else {
      console.log("No matching MaterialId found");
    }
  };

  useEffect(() => {
    showMachineMaster();
    showMaterialMaster();
  }, []);

  const HandleMachineMasterSubmit = () => {
    // Filter the canvasConfigData to find items with the matching modelid
    const filteredConfig = machineMaster.filter(
      (item) => item.MachineId == node.nodeId
    );

    let payload;
    console.log(filteredConfig);
    if (filteredConfig.length > 0) {
      console.log("getting to update");
      // If the filter finds matching items, prepare the payload for updating
      payload = {
        machinemaster: filteredConfig.map((item) => ({
          Id: Id || item.Id,
          MachineId: node.nodeId,
          capacity: capacity || item.capacity,
          capacityUnits: capacityUnitsId || item.capacityUnits,
          FuelConsumed: fuelUsed || item.FuelConsumed,
          FuelUnits: fuelUnitsId || item.FuelUnits,
          AllowAccessQuantity: allowExcessQty || item.AllowAccessQuantity,
          PercentagesRejects: PerRejects || item.PercentagesRejects,
          branchId: auth.branchId,
          userId: auth.empId.toString(),
        })),
      };
      console.log(payload);
    } else {
      console.log("getting to create");
      // If no matching items are found, prepare the payload for creating a new row
      payload = {
        machinemaster: [
          {
            MachineId: node.nodeId,
            capacity: capacity || "",
            capacityUnits: capacityUnitsId || "",
            FuelConsumed: fuelUsed || "",
            FuelUnits: fuelUnitsId || "",
            AllowAccessQuantity: allowExcessQty || "",
            PercentagesRejects: PerRejects || "",
            branchId: auth.branchId,
            userId: auth.empId.toString(),
          },
        ],
      };
    }
    console.log(payload, "getting to");
    // Uncomment below lines to send the request

    axios
      .put(`${BASE_URL}/api/MachineMaster/bulk`, payload)
      .then((response) => {
        // setOpenSnackbar(true);
        showMachineMaster();
        console.log("Record updated successfully", response.data);
      })
      .catch((error) => {
        console.error("Error updating record:", error);
      });
  };

  const HandleMaterialMasterSubmit = () => {
    // Filter the canvasConfigData to find items with the matching modelid
    const filteredConfig = materialMaster.filter(
      (item) => item.MaterialId == node.nodeId
    );
    let payload;

    if (filteredConfig.length > 0) {
      // If the filter finds matching items, prepare the payload for updating

      payload = {
        materialmaster: filteredConfig.map((item) => ({
          Id: materialId || item.Id,
          MaterialId: node.nodeId,
          ProducedQuntity: producedQuantity || item.ProducedQuntity,
          ProducingUnits: producingUnits || item.ProducingUnits,
          ConsumedQuantity: consumedQuantity || item.ConsumedQuantity,
          ConsumingUnits: consumingUnits || item.ConsumingUnits,
          BalanceQuantity: balanceQuantity || item.BalanceQuantity,
          EquvalentFGUnits: equvalentFGUnits || item.EquvalentFGUnits,
          ConversionRate: ConversionRate || item.ConversionRate,
          MeasurableUnits: measurableUnits || item.MeasurableUnits,
          branchId: auth.branchId,
          userId: auth.empId.toString(),
        })),
      };
      console.log(filteredConfig, "materialData");
    } else {
      // If no matching items are found, prepare the payload for creating a new row
      payload = {
        materialmaster: [
          {
            MaterialId: node.nodeId,
            ProducedQuntity: producedQuantity || null,
            ProducingUnits: producingUnits || null,
            ConsumedQuantity: consumedQuantity || null,
            ConsumingUnits: consumingUnits || null,
            BalanceQuantity: balanceQuantity || null,
            EquvalentFGUnits: equvalentFGUnits || null,
            ConversionRate: ConversionRate || null,
            MeasurableUnits: measurableUnits || null,
            branchId: auth.branchId,
            userId: auth.empId.toString(),
          },
        ],
      };
      console.log(payload, "materialData");
    }
    axios
      .put(`${BASE_URL}/api/MaterialMaster/bulk`, payload)
      .then((response) => {
        // setOpenSnackbar(true);
        showMaterialMaster();
        console.log("Record updated successfully", response.data);
      })
      .catch((error) => {
        console.error("Error updating record:", error);
      });
  };

  return (
    <div
      className="edge-popup container-fluid"
      style={{
        position: "absolute",
      }}
    >
      <form
        action=""
        method="post"
        enctype="multipart/form-data"
        style={{ fontSize: "11px" }}
      >
        <div className="container-fluid">
          <div className="row" style={{ fontSize: "11px" }}>
            <div className="col-1 p-2">
              <label>Node ID</label>
              <input
                type="text"
                className="form-control"
                value={node?.nodeId}
                style={{ height: "32px" }}
                disabled
              />
            </div>
            <div className="col-1 p-2">
              <label>Node Type</label>
              <select
                style={{ height: "32px" }}
                className="form-select"
                onChange={handleNodeTypeChange}
                value={nodeType}
              >
                <option hidden>Node Type</option>
                {data
                  ? data.map((item) => (
                      <option key={item.Type} value={item.Type}>
                        {item.Type}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="col-2 p-2">
              <label>Node Category</label>
              {nodeType === "Material" ? (
                <select
                  style={{ height: "32px" }}
                  onChange={handleNodeCategory}
                  value={nodeCategory}
                  className="form-control"
                >
                  <option hidden>Please Select</option>
                  <option>Finished Goods</option>
                  <option>Work In Progress</option>
                  <option>Raw Material</option>
                  <option>Waste</option>
                </select>
              ) : (
                <select
                  style={{ height: "32px" }}
                  onChange={handleNodeCategory}
                  value={nodeCategory}
                  className="form-control"
                  disabled
                >
                  <option disabled>Please Select</option>
                </select>
              )}
            </div>
            <div className="col-2 p-2">
              <label>Source Position</label>
              <select
                style={{ height: "32px" }}
                value={sourcePosition}
                className="form-select"
                onChange={handlesourcePosition}
              >
                <option value={sourcePosition} hidden>
                  {sourcePosition}
                </option>
                <option>right</option>
                <option>bottom</option>
                <option>left</option>
                <option>top</option>
              </select>
            </div>
            <div className="col-2 p-2">
              <label>Target Position</label>
              <select
                style={{ height: "32px" }}
                value={targetPosition}
                onChange={handletargetPosition}
                className="form-select"
              >
                <option value={targetPosition} hidden>
                  {targetPosition}
                </option>
                <option>left</option>
                <option>top</option>
                <option>right</option>
                <option>bottom</option>
              </select>
            </div>
            <div className="col-2 p-2">
              <label>Font-Color</label>
              <input
                type="color"
                value={fontColor}
                className="form-control"
                onChange={handleFontColor}
                style={{ height: "32px" }}
              />
            </div>
            <div className="col-2 p-2">
              <label>Upload Image</label>
              <div className="d-flex align-items-center">
                <input
                  type="file"
                  className="form-control"
                  style={{ height: "32px" }}
                  onChange={HandleImage}
                />{" "}
                &nbsp;&nbsp;
                {node?.nodeImage ? (
                  <AiFillDelete
                    className="icon"
                    style={{
                      cursor: "pointer",
                      color: "red",
                      fontSize: "20px",
                    }}
                    onClick={() => HandleremoveImage(node?.id)}
                  />
                ) : (
                  <AiFillDelete
                    className="icon"
                    style={{
                      opacity: 0.5,
                      pointerEvents: "none",
                      color: "red",
                      fontSize: "20px",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="row" style={{ fontSize: "11px" }}>
            <div className="col-1 p-2">
              <label>X-Position</label>
              <input
                type="text"
                className="form-control"
                value={xPosition}
                onChange={handleXPositionChange}
                style={{ height: "32px" }}
              />
            </div>
            <div className="col-1 p-2">
              <label>Y-Position</label>
              <input
                type="text"
                className="form-control"
                value={yPosition}
                onChange={handleYPositionChange}
                style={{ height: "32px" }}
              />
            </div>
            <div className="col-2 p-2">
              <label>Label:</label>
              <input
                type="text"
                className="form-control"
                value={label}
                style={{ height: "32px" }}
                onChange={handleLabelChange}
              />
            </div>
            <div className="col-2 p-2">
              <label>Item Description:</label>
              <input
                type="text"
                value={itemDescription}
                className="form-control"
                placeholder="description"
                style={{ height: "32px" }}
                onChange={handleItemDescription}
              />
            </div>
            <div className="col-2 p-2">
              <label>Unit1 Measurable</label>
              {nodeType === "Material" ? (
                <select
                  className="form-control"
                  onChange={handleMeasurable}
                  style={{ height: "32px" }}
                  value={unit1Measurable}
                >
                  <option hidden>Please Select</option>
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </select>
              ) : (
                <select
                  disabled
                  className="form-control"
                  onChange={handleMeasurable}
                  style={{ height: "32px" }}
                >
                  <option hidden>Please Select</option>
                </select>
              )}
            </div>

            <div className="col-2 p-2">
              <label>Bg-Color</label>
              <input
                type="color"
                style={{ height: "32px" }}
                className="form-control"
                value={bgColor}
                onChange={handleBackGroud}
              />
            </div>

            <div className="col-2 p-2">
              <label>Border Width</label>
              <select
                style={{ height: "32px" }}
                value={fontStyle}
                onChange={handleFontstyle}
                className="form-control"
              >
                <option value={fontStyle}>{fontStyle}</option>
                <option>italic</option>
                <option>normal</option>
                <option>oblique</option>
              </select>
            </div>
          </div>
          <div className="row" style={{ fontSize: "11px" }}>
            <div className="col-1 p-2">
              <label>Width</label>
              <input
                type="text"
                style={{ height: "32px" }}
                value={width}
                className="form-control"
                onChange={handleWidthChange}
              />
            </div>
            <div className="col-1 p-2">
              <label>Height</label>
              <input
                type="text"
                style={{ height: "32px" }}
                value={height}
                className="form-control"
                onChange={handleHeightChange}
              />
            </div>
            <div className="col-2 p-2">
              <label>Unit2 Mandatory</label>
              {nodeType === "Material" ? (
                <select
                  onChange={handleMandatory}
                  style={{ height: "32px" }}
                  value={unit2Mandatory}
                  className="form-control"
                >
                  <option hidden>Please Select</option>
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </select>
              ) : (
                <select
                  onChange={handleMandatory}
                  style={{ height: "32px" }}
                  value={unit2Mandatory}
                  className="form-control"
                  disabled
                >
                  <option hidden>Please Select</option>
                </select>
              )}
            </div>
            <div className="col-2 p-2">
              <label>Font Size</label>
              <input
                type="text"
                className="form-control"
                value={fontsize}
                onChange={handleFontSizeChange}
                style={{ height: "32px" }}
              />
            </div>
            <div className="col-2 p-2">
              <label>Border-Color</label>
              <input
                type="color"
                style={{ height: "32px" }}
                value={borderColor}
                className="form-control"
                onChange={handleBorderCOlor}
              />
            </div>
            <div className="col-2 p-2">
              <label>Border Style</label>
              <select
                style={{ height: "32px" }}
                value={borderStyle}
                onChange={handleborderStyle}
                className="form-control"
              >
                <option value={borderStyle}>{borderStyle}</option>
                <option>solid</option>
                <option>dashed</option>
                <option>dotted</option>
              </select>
            </div>
            <div className="col-2 p-2">
              <label>Font-Style</label>
              <input
                type="text"
                className="form-control"
                style={{ height: "32px" }}
                value={borderWidth}
                onChange={handleborderWidth}
              />
            </div>
          </div>
          <div className="row" style={{ fontSize: "11px" }}>
            <div className="col-3 p-2">
              <button className="btn" id="Facheck" onClick={handleSave}>
                {/* <FaCheck /> */}Submit
              </button>
              &nbsp;
              <button className="btn" id="FaXmark" onClick={onClose}>
                {/* <FaXmark /> */}Cancel
              </button>
            </div>
            <div className="offset-7 col-2 p-2">
              <div className="btn btn-warning" onClick={handleClickOpen}>
                More Details
              </div>
            </div>
          </div>
        </div>
      </form>
      {node.nodeType === "Machine" && (
        <React.Fragment>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
              "& .MuiDialog-paper": {
                maxWidth: "800px", // Set your desired width
                height: "300px", // Set your desired height
              },
            }}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <b>
                {node.nodeId} - {node.data.label}
              </b>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              <Typography gutterBottom>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-4">
                      <span>Machine Id</span>
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={node.nodeId}
                      />
                    </div>
                    <div className="col-4">
                      <span>Capacity</span>
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleCapacity}
                        value={capacity || ""}
                      />
                    </div>
                    <div className="col-4">
                      <span>Capacity Units</span>
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleCapacityUnits}
                        value={capacityUnitsId}
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-4">
                      <span>Fuel Consumed</span>
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleFuelConsumed}
                        value={fuelUsed}
                      />
                    </div>
                    <div className="col-4">
                      <span>Fuel Units</span>
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleFuelConsumedUnits}
                        value={fuelUnitsId}
                      />
                    </div>
                    <div className="col-4">
                      <span>Percentage Rejects</span>
                      <input
                        type="number"
                        className="form-control"
                        value={PerRejects}
                        onChange={handlePerRejects}
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-4">
                      <span>Allow Access Quantity</span>
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleAllowExcessQuntity}
                        value={allowExcessQty}
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="offset-11 col-1 btn btn-success">
                      <FaCheck onClick={HandleMachineMasterSubmit} />
                    </div>
                  </div>
                </div>
              </Typography>
            </DialogContent>
          </BootstrapDialog>
        </React.Fragment>
      )}
      {node.nodeType === "Material" && (
        <React.Fragment>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
              "& .MuiDialog-paper": {
                maxWidth: "1000px", // Set your desired width
                height: "320px", // Set your desired height
              },
            }}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <b>
                {node.nodeId} - {node.data.label}
              </b>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              {node.nodeType === "Material" && (
                <Typography gutterBottom>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-4">
                        <span>Material Id</span>
                        <input
                          type="text"
                          className="form-control"
                          value={node.nodeId}
                          disabled
                        />
                      </div>
                      <div className="col-4">
                        <span>Produced Quantity</span>
                        <input
                          type="text"
                          className="form-control"
                          onChange={HandleProducedQty}
                          value={producedQuantity}
                        />
                      </div>
                      <div className="col-4">
                        <span>Consumed Quantity</span>
                        <input
                          type="text"
                          className="form-control"
                          onChange={HandlesetsetConsumedQty}
                          value={consumedQuantity}
                        />
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-4">
                        <span>Balanced Quantity</span>
                        <input
                          type="text"
                          className="form-control"
                          onChange={HandlesetBalancedQty}
                          value={balanceQuantity}
                        />
                      </div>
                      <div className="col-4">
                        <span>Producing Units</span>
                        <input
                          type="text"
                          className="form-control"
                          onChange={HandlesetProducingUnits}
                          value={producingUnits}
                        />
                      </div>
                      <div className="col-4">
                        <span>Consuming Units</span>
                        <input
                          type="text"
                          className="form-control"
                          onChange={HandlesetConsumingUnits}
                          value={consumingUnits}
                        />
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-4">
                        <span>Equvalent FG Units</span>
                        <input
                          type="text"
                          className="form-control"
                          onChange={HandlesetEquvalentFGUnits}
                          value={equvalentFGUnits}
                        />
                      </div>
                      <div className="col-4">
                        <span>Measurable Units</span>
                        <input
                          type="text"
                          className="form-control"
                          onChange={HandlesetMeasurableUnits}
                          value={measurableUnits}
                        />
                      </div>
                      <div className="col-4">
                        <span>Conversion Rate</span>
                        <input
                          type="text"
                          className="form-control"
                          onChange={HandlesetConversionRate}
                          value={ConversionRate}
                        />
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="offset-11 col-1 btn btn-success">
                        <FaCheck onClick={HandleMaterialMasterSubmit} />
                      </div>
                    </div>
                  </div>
                </Typography>
              )}
            </DialogContent>
          </BootstrapDialog>
        </React.Fragment>
      )}
    </div>
  );
};

export default NodesPopup;
