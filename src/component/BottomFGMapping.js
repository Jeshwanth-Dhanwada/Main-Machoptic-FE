import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaMinus} from "react-icons/fa6";
import { Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";

function BottomFGmapping({tableHeight}) {
  const { auth } = useContext(AuthContext)
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [ERPItems, setERPItems] = useState([]);
  const [routeMasterData, setrouteMasterData] = useState([]);
  const [fgdata, setFGMapping] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [NodesearchInput, setNodeSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [NodefilteredResults, setNodeFilteredResults] = useState([]);
  const [isNodeSearchVisible, setNodeSearchVisible] = useState(false);
  const [itemRefresh, setItemRefresh] = useState(false);
  const [inputData, setInputData] = useState([]);
  const [showPopup, setShowPopup] = useState(-1);
  const [rmType, setRMType] = useState();
  const [rmList, setRMList] = useState([]);

  // Fetch Nodemaster -----------------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        // console.log(response.data)
        setData(response.data);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetch FGMapping ----------------
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/mapping`;
    axios
      .get(apiUrl,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          }
        }
      )
      .then((response) => {
        setFGMapping(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function getFGMapping() {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/mapping`;
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        setFGMapping(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Fetch ItemMaster ----------------

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = `${BASE_URL}/api/itemmaster`;
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        // console.log("&&&", response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //Fetch ERP Item Master

  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/itemmaster2`; //need to call new ItemMaster
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        // console.log("&&&", response.data);
        setERPItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function getItemmaster2() {
    const apiUrl = `${BASE_URL}/api/itemmaster2`; //need to call new ItemMaster
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        // console.log("&&&", response.data);
        setERPItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function getItemmaster1() {
    const apiUrl = `${BASE_URL}/api/itemmaster`;
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        // console.log("&&&", response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function setFgMapping() {
    const apiUrl = `${BASE_URL}/api/mapping`;
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        setFGMapping(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Fetch routeMaster data
  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/routeMaster`;
    axios
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        console.log("route data", response.data);
        setrouteMasterData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    //const newItems = items.slice(0, -2); // needs to be changed
    const filteredItems = ERPItems.filter(
      (item) => !items.some((item1) => item1.IT_CODE === item.IT_CODE)
    );
    const updatedItems = filteredItems?.map((item) => ({
      ...item,
      itemMapping: [],
      NodeId: "",
      Route: "",
      ItemType:
        item?.Film_Name_ID && item?.Fabric_Name_ID
          ? "Finished Goods"
          : "Raw Material",
    }));
    setInputData(updatedItems);
  }, [ERPItems, itemRefresh, items]);

  const [droppedData, setDroppedData] = useState();
  const [selectedItems, setSelectedItems] = useState([]);

  const dragStarted = (e, itemCode, itemName, itemtype) => {
    const selectedItem = { e, itemCode, itemName, itemtype };
    setSelectedItems([...selectedItems, selectedItem]);
    // console.log(selectedItem);
  };

  const draggingOver = (event) => {
    event.preventDefault();
    // console.log("Dragging Over now");
  };

  const dragDropped = (event, RMcode, RMname, Rmtype, RMmachine, NodeId) => {
    event.preventDefault(); // Allows the drop
    selectedItems.forEach((selectedItem) => {
      const { itemCode, itemName, itemtype } = selectedItem;
      const existingData = droppedData || [];
      const newData = [
        ...existingData,
        {
          itemCode,
          itemName,
          itemtype,
          RMcode,
          RMname,
          Rmtype,
          RMmachine,
          NodeId,
        },
      ];
      // setDroppedData(newData);
      // Check if the combination of empId and nodeId exists in empNodeMap
      const existsInEmpNodeMap = fgdata.some(
        (item) =>
          String(item.nodeIdFG) === String(itemCode) &&
          String(item.nodeIdRM) === String(RMcode)
      );

      // const existsIndragdata = droppedData?.some(
      //   (item) =>
      //     String(item?.itemCode) === String(itemCode) &&
      //     String(item?.RMcode) === String(RMcode)
      // );
      const existsIndragdata = Array.isArray(droppedData) && droppedData.some(
        (item) =>
          String(item?.itemCode) === String(itemCode) &&
          String(item?.RMcode) === String(RMcode)
      );

      console.log(existsInEmpNodeMap, "RMcode");
      console.log(droppedData, "droppedData");

      if (!existsInEmpNodeMap && !existsIndragdata) {
        setDroppedData(newData);
      } else {
        // console.log("**************************", existsInEmpNodeMap);
        // Show a warning alert message
        toast.warning(
          <span>
            <strong>Aww No!</strong> already Assigned to FG Mapping.
          </span>
        );
      }
    });
    // Clear the selected items
    setSelectedItems([]);
    // setDroppedData()
  };
  console.log(droppedData);

  const handleNewRowSubmit = () => {
    const drop = {
      mapping: droppedData.map((item) => ({
        nodeIdFG: item?.itemCode?.toString(),
        nodeIdRM: item?.RMcode?.toString(),
        branchId: "1001",
        userId: auth?.empId?.toString(),
        nodeCategory: item.Rmtype,
        nodeId: item.NodeId,
      })),
    };
    // console.log(drop);
    axios
      .put(`${BASE_URL}/api/mapping/bulk`, drop, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        // console.log("Selected rows added successfully", response.data);
        toast.success(
          <span>
            <strong>successfully!</strong>Added.
          </span>
        );
        setDroppedData([]);
        const apiUrl = `${BASE_URL}/api/mapping`;
        axios.get(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          }
        })
          .then((response) => {
            setFGMapping(response.data);
            // console.log(response.data);
          });
      })
      .catch((error) => {
        toast.error(<span><strong>User</strong> is not authorized fot this action.</span>);
        setDroppedData(false)
        console.error("Error adding selected rows:", error);
      });
  };

  // Delete the table row

  const handleDeleteFGMapping = (FGMappingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${BASE_URL}/api/mapping/${FGMappingId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          }
        })
        .then((response) => {
          // console.log("Node deleted successfully", response.data);
          toast.error(
            <span>
              <strong>successfully!</strong>Deleted.
            </span>
          );
          // After successful deletion, update the empNodeMap state by filtering out the deleted item
          setFGMapping((prevEmpNodeMap) => {
            return prevEmpNodeMap.filter((item) => item.id !== FGMappingId);
          });
        })
        .catch((error) => {
          console.error("Error deleting node:", error);
          toast.error(<span><strong>User</strong> is not authorized fot this action.</span>);
        });
    }
  };

  function getNodeNameByIdFG(itemCode) {
    let a = itemCode;
    // console.log(a);
    const item = items.find((item) => item.IT_CODE === a);
    return item ? item.IT_NAME : "Node Not Found";
  }

  function getNodeNameByIdRM(nodeIdRM) {
    let a = nodeIdRM;
    // console.log(typeof a);
    const item = items.find((item) => item.IT_CODE === a);
    // console.log(item);
    return item ? item.IT_NAME : "Node Not Found";
  }

  function getNodeNameById(nodeId) {
    const nodename = data
      .filter((item) => item.nodeId == nodeId)
      .map((item) => item.nodeName);
    return nodename;
  }

  const [editedIndex, setEditedIndex] = useState(null);
  const [showbuttons, setshowbuttons] = useState(true);

  const handleEdit = (index) => {
    setEditedIndex(index);
    setshowbuttons(false);
  };

  const removeEdit = (index) => {
    setEditedIndex(null);
    setshowbuttons(true);
    getFGMapping();
  };

  const CancelSubmit = () => {
    setInputData([]);
    setItemRefresh(false);
  };

  const handleSave = (event) => {
    // event.preventDefault()
    const editedItem = fgdata[editedIndex];
    // console.log(editedItem);

    const edite = {
      nodeIdFG: editedItem?.nodeIdFG?.toString(),
      nodeIdRM: editedItem?.nodeIdRM?.toString(),
      branchId: "1001",
      userId: auth.empId?.toString(),
      nodeCategory: editedItem.nodeCategory,
      nodeId: editedItem.nodeId,
    };
    // console.log(edite,"edite")
    // console.log(editedItem,"editedItem")

    // Update the edited item with the new values
    // You can use axios.put or a similar method to send the data to your API
    axios
      .put(`${BASE_URL}/api/mapping/${editedItem.id}`, edite, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((response) => {
        // console.log('Data saved successfully',response.data);
        toast.success(
          <span>
            <strong>Successfully</strong> Updated.
          </span>
        );
        setEditedIndex(null);
        setshowbuttons(true);
        // getNodeNameById()
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setEditedIndex(null);
        setshowbuttons(true);
        getFGMapping();
        toast.error(<span><strong>User</strong> is not authorized fot this action.</span>);
      });
  };

  // Ramesh canges for filter & search
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = items.filter((item) => {
      const Itemname = String(item.IT_NAME).toLowerCase(); // Convert to string
      return Itemname.includes(searchValue.toLowerCase());
    });
    setFilteredResults(filteredData);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput("");
  };
  // Ramesh changes for filter & search
  const searchNodesItems = (searchValue) => {
    setNodeSearchInput(searchValue);
    const filteredData = items.filter((item) => {
      const Itemname = String(item.IT_NAME).toLowerCase();
      return Itemname.includes(searchValue.toLowerCase());
    });
    setNodeFilteredResults(filteredData);
  };

  const toggleNodeSearch = () => {
    setNodeSearchVisible(!isNodeSearchVisible);
    setNodeSearchInput("");
  };

  const onItemRefreshClick = () => {
    setItemRefresh(true);
  };

  const getNodeData = () => {
    const materialNodes = data?.filter((item) => item?.nodeType == "Material");
    return materialNodes;
  };

  const handleItemType = (event, item, index) => {
    const updatedInputData = [...inputData];
    updatedInputData[index] = {
      ...updatedInputData[index],
      ItemType: event.target.value,
    };
    setInputData(updatedInputData);
  };

  const handleNodeIdChange = (event, item, index) => {
    const updatedInputData = [...inputData];
    updatedInputData[index] = {
      ...updatedInputData[index],
      NodeId: event.target.value,
    };
    setInputData(updatedInputData);
  };

  const handleRouteId = (event, item, index) => {
    const updatedInputData = [...inputData];
    updatedInputData[index] = {
      ...updatedInputData[index],
      Route: event.target.value,
    };
    setInputData(updatedInputData);
  };

  const handleItemMapping = () => {
    console.log(rmList);
    const itemList = rmList.filter((item1) => item1?.isSelected == true);
    const updatedInputData = [...inputData];
    updatedInputData[showPopup] = {
      ...updatedInputData[showPopup],
      itemMapping: itemList,
    };
    setInputData(updatedInputData);
    setShowPopup(-1);
  };

  const cancelItemMapping = () => {
    setRMList([]);
    setShowPopup(-1);
  };
  const handleCheckBox = (event, item, type) => {
    const index = rmList.findIndex((item1) => item?.IT_CODE === item1?.IT_CODE);
    if (type === "select") {
      if (index === -1) {
        const newValue = {
          IT_CODE: item?.IT_CODE,
          ItemType: item?.ItemType,
          isSelected: event.target.checked,
        };
        setRMList([...rmList, newValue]);
      } else {
        const updatedList = [...rmList];
        updatedList[index] = {
          ...updatedList[index],
          isSelected: event.target.checked,
        };
        setRMList(updatedList);
      }
    } else {
      if (index === -1) {
        const newValue = {
          IT_CODE: item?.IT_CODE,
          ItemType: item?.ItemType,
          isDefault: event.target.checked,
        };
        setRMList([...rmList, newValue]);
      } else {
        const updatedList = rmList?.map((item1) => {
          if (item?.IT_CODE == item1?.IT_CODE) {
            return {
              ...item1,
              isDefault: true,
            };
          } else {
            return {
              ...item1,
              isDefault: item?.ItemType === rmType ? false : item?.isDefault,
            };
          }
        });
        setRMList(updatedList);
      }
    }
  };

  const isChecked = (data) => {
    const val = rmList.findIndex((val) => val.IT_CODE == data?.IT_CODE);
    return val == -1 ? false : rmList[val]?.isSelected;
  };

  const isRadioEnabled = (data) => {
    const val = rmList.findIndex((val) => val.IT_CODE == data?.IT_CODE);
    return val == -1 ? false : rmList[val]?.isDefault;
  };

  const setRMDetail = (value) => {
    const item = items?.filter(
      (data) =>
        data?.IT_CODE == value?.Film_Name_ID ||
        data?.IT_CODE == value?.Fabric_Name_ID
    );
    if (item?.length > 0) {
      const RMItems = item?.map((val) => ({
        IT_CODE: val?.IT_CODE,
        ItemType: val?.ItemType,
        isSelected: true,
        isDefault: true,
      }));
      setRMList(RMItems);
      return;
    }
    setRMList([]);
    return;
  };

  const handleSubmit = (singleRowSubmit, index) => {
    // const missedValues = inputData?.some((item) => item?.NodeId === '' || item?.ItemType === '' || (item?.ItemType === 'Finished Goods' ? (item?.itemMapping === '' || item?.RouteId === '') : false));
    // if (missedValues) {
    //   toast.error(
    //     <span>
    //       Please fill all details
    //     </span>
    //   );
    //   return;
    // }
    let updatedData = [];
    if (!singleRowSubmit) {
      const filledRows = inputData.filter(
        (item) =>
          item?.NodeId !== "" ||
          item?.ItemType !== "" ||
          (item?.ItemType === "Finished Goods"
            ? item?.itemMapping !== "" || item?.Route !== ""
            : false)
      );

      if (filledRows.length === 0) {
        toast.error(<span>Please fill at least one detail</span>);
        return;
      }

      //   updatedData = filledRows.map((item) => {
      //     const { itemMapping, DateTime, NodeId, ...newObject } = item;
      //     const splitdata = NodeId.split("-")[0];
      //     return { ...newObject, NodeId: splitdata };
      //   });
      // } else {
      //   const { itemMapping, DateTime, NodeId, ...newObject } = inputData[index];
      //   const splitdata = NodeId.split("-")[0];
      //   updatedData = [{ ...newObject, NodeId: splitdata }];
      // }

      updatedData = filledRows.map((item) => {
        const { itemMapping, DateTime, NodeId, Per_Bag_wgt, mtr_per_wgt, ...newObject } = item;
        const splitdata = NodeId.split("-")[0];
        const perBagWeightString = Per_Bag_wgt?.toString();
        const mtrPerWeight = mtr_per_wgt ? mtr_per_wgt.toString() : ''
        return { ...newObject, NodeId: splitdata, Per_Bag_wgt: perBagWeightString, mtr_per_wgt: mtrPerWeight };
      });
    } else {
      const { itemMapping, DateTime, NodeId, Per_Bag_wgt, mtr_per_wgt, ...newObject } = inputData[index];
      const splitdata = NodeId.split("-")[0];
      const perBagWeightString = Per_Bag_wgt?.toString();
      const mtrPerWeight = mtr_per_wgt ? mtr_per_wgt.toString() : ''
      updatedData = [{ ...newObject, NodeId: splitdata, Per_Bag_wgt: perBagWeightString, mtr_per_wgt: mtrPerWeight }];
    }

    const payload = {
      itemmaster: updatedData,
    };
    axios
      .put(`${BASE_URL}/api/itemmaster/bulk`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      .then((res) => {
        console.log(res);
        getItemmaster1();
        getItemmaster2();
      })
      .catch((err) => {
        console.log(err, "Error");
      });

    const fgItems = inputData.filter(
      (item) => item?.ItemType === "Finished Goods" && item?.NodeId && item?.Route
    );
    if (fgItems?.length > 0) {
      const updatedfg = fgItems.map((item) => {
        const rmDetail = item?.itemMapping?.map((item1) => {
          return {
            nodeIdFG: item?.IT_CODE?.toString(),
            nodeIdRM: item1?.IT_CODE?.toString(),
            branchId: "1001",
            userId: auth?.empId?.toString(),
            nodeCategory: item1?.ItemType,
            nodeId: item.NodeId.split("-")[0],
            isDefault: item1?.isDefault ? "Yes" : "No",
          };
        });
        return [...rmDetail];
      });
      const fgPayLoad = {
        mapping: [].concat(...updatedfg), //flattenning array
      };
      axios
        .put(`${BASE_URL}/api/mapping/bulk`, fgPayLoad, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          }
        })
        .then((res) => {
          console.log(res);
          if (!singleRowSubmit) setItemRefresh(false);
          singleRowSubmit
            ? setInputData((item) => {
              const updatedInputData = [...item];
              updatedInputData.splice(index, 1);
              return updatedInputData;
            })
            : setInputData([]);
          toast.success(<span>Details saved Successfully</span>);
          setFgMapping();
        })
        .catch((err) => {
          console.log(err, "Error");
        });
    } else {
      if (!singleRowSubmit) setItemRefresh(false);
      singleRowSubmit
        ? setInputData((item) => {
          const updatedInputData = [...item];
          updatedInputData.splice(index, 1);
          return updatedInputData;
        })
        : setInputData([]);
      toast.success(<span>Details saved Successfully</span>);
    }
    return;
  };

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
      {!itemRefresh ? (
        <div className="container-fluid">
          {/* <div className='d-flex flex-row justify-content-end m-1'>
            <Tooltip title="Add FG Mapping">
              <Button onClick={handleNewRowSubmit} id='addbutton' style={{ marginLeft: '5px' }}>
                <FaPlus />
              </Button>
            </Tooltip>
          </div> */}
          {/* <div className="d-flex justify-content-end">
            <button
              onClick={onItemRefreshClick}
              className="btn"
              id="addbutton"
              // style={{
              //   textDecoration: "underline",
              //   color: "blue",
              //   border: "none",
              //   background: "none",
              // }}
            >
              Items Refresh
            </button>
          </div> */}

          <div className="row p-2 d-flex felx-row justify-content-center">
            {/* <h6 style={{ textAlign: "center" }}>Finished Goods Mapping</h6> */}
            <br />
            <div className="col-12" style={{ height: "230px",overflow: "scroll" }}
            >
              <table className="table table-bordered table-striped">
                <thead class="sticky-top">
                  <tr>
                    <th>Item Code(FG)</th>
                    <th>Item Name</th>
                    <th>Item Code(RM)</th>
                    <th>Item Name</th>
                    <th>Item Type</th>
                    <th>%Of Waste</th>
                    <th>FgToRmRatio</th>
                    <th style={{width:'6%'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fgdata.map((item, index) => (
                    <tr>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.nodeIdFG}
                            onChange={(e) => {
                              const newData = [...fgdata];
                              newData[index].nodeIdFG = e.target.value;
                              setFGMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "135px",
                              height: "25px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>FG CODE</option>
                            {items
                              .filter(
                                (item) => item.ItemType === "Finished Goods"
                              )
                              .map((item) => (
                                <option>{item.IT_CODE}</option>
                              ))}
                          </select>
                        ) : (
                          <div>{item.nodeIdFG}</div>
                        )}
                      </td>
                      <td>{getNodeNameByIdFG(item.nodeIdFG)}</td>
                      <td>
                        {editedIndex === index ? (
                          <select
                            value={item.nodeIdRM}
                            onChange={(e) => {
                              const newData = [...fgdata];
                              newData[index].nodeIdRM = e.target.value;
                              setFGMapping(newData);
                            }}
                            style={{
                              border: "none",
                              width: "135px",
                              height: "25px",
                              backgroundColor: "whitesmoke",
                            }}
                          >
                            <option hidden>RM CODE</option>
                            {items
                              .filter(
                                (item) =>
                                  item.ItemType === "Raw Material" ||
                                  item.ItemType === "RM-Film" ||
                                  item.ItemType === "RM-Fabric"
                              )
                              .map((item) => (
                                <option>{item.IT_CODE}</option>
                              ))}
                          </select>
                        ) : (
                          <div>{item.nodeIdRM}</div>
                        )}
                      </td>
                      <td>{getNodeNameByIdRM(item.nodeIdRM)}</td>
                      <td>{item.nodeCategory}</td>
                      <td>
                        {editedIndex === index ? (
                          <Form.Control type="number" min={0} value={item.PercentOfWaste}
                            onChange={(e) => {
                              const newData = [...fgdata];
                              newData[index].PercentOfWaste = e.target.value;
                              setFGMapping(newData);
                            }}

                            style={{
                              border: "none",
                              width: "135px",
                              height: "25px",
                              backgroundColor: "whitesmoke",
                            }}
                          />

                        ) : (
                          <div>{item.PercentOfWaste}</div>
                        )}
                        </td>
                        <td>
                        {editedIndex === index ? (
                          <Form.Control type="number" min={0} value={item.FgToRmRatio}
                            onChange={(e) => {
                              const newData = [...fgdata];
                              newData[index].FgToRmRatio = e.target.value;
                              setFGMapping(newData);
                            }}

                            style={{
                              border: "none",
                              width: "135px",
                              height: "25px",
                              backgroundColor: "whitesmoke",
                            }}
                          />

                        ) : (
                          <div>{item.FgToRmRatio}</div>
                        )}
                        </td>
                        <td>
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
                              onClick={() => handleDeleteFGMapping(item.id)}
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
                                onClick={handleSave}
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
                        </td>
                    </tr>
                  ))}
                  {/* {droppedData
                    ? droppedData.map((item) => (
                      <tr>
                        <td>{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.RMcode}</td>
                        <td>{item.RMname}</td>
                        <td>{item.Rmtype}</td>
                        <td>
                          <button
                            disabled
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                          >
                            <FaMinus />
                          </button>
                          &nbsp;&nbsp;
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                            disabled
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))
                    : ""} */}
                </tbody>
              </table>
            </div>
            {/* <div className="row">
              <div className="p-1 col-3">
                {showbuttons ? (
                  <div>
                  </div>
                ) : (
                  <div>
                    <button
                      disabled
                      className="btn btn-success"
                      onClick={handleNewRowSubmit}
                    >
                      <FaCheck />
                    </button>
                    &nbsp;&nbsp;
                    <button
                      disabled
                      className="btn btn-danger"
                      onClick={() => setDroppedData([])}
                    >
                      <FaXmark />
                    </button>
                  </div>
                )}
              </div>
              <ToastContainer />
            </div> */}
          </div>
        </div>
      ) : (
        <div>
          {showPopup === -1 && (
            <>
              <button className="btn btn-primary" onClick={CancelSubmit}>
                Go Back
              </button>
              <div className="d-flex col-lg-12 col-md-8 col-sm-12 pt-3 justify-content-center">
                <table
                  class="table-bordered table-striped"
                  cellPadding={5}
                  cellSpacing={5}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "" }}>Item Code</th>
                      <th style={{ width: "" }}>Item Name </th>
                      <th style={{ width: "" }}>Item Type</th>
                      <th style={{ width: "" }}>Node Id</th>
                      <th style={{ width: "" }}>Routes</th>
                      <th style={{ width: "" }}>Item Mapping</th>
                      <th style={{ width: "" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputData?.map((item, index) => (
                      <tr key="">
                        <td>{item?.IT_CODE}</td>
                        <td>{item?.IT_NAME}</td>
                        <td>
                          <Form.Select
                            className="form-control mt-1"
                            id="itemType"
                            name="itemType"
                            onChange={(event) =>
                              handleItemType(event, item, index)
                            }
                            value={item?.ItemType}
                          >
                            <option
                              value={
                                item?.Film_Name_ID && item?.Fabric_Name_ID
                                  ? "Finished Goods"
                                  : "Raw Material"
                              }
                              hidden
                            >
                              {item?.Film_Name_ID && item?.Fabric_Name_ID
                                ? "Finished Goods"
                                : "Raw Material"}
                            </option>
                            <option>Raw Material</option>
                            <option>Finished Goods</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Select
                            className="form-control mt-1"
                            id="nodeId"
                            name="nodeId"
                            onChange={(event) =>
                              handleNodeIdChange(event, item, index)
                            }
                            value={item?.NodeId}
                            required
                          >
                            <option value="" hidden>
                              Please Select
                            </option>
                            {getNodeData().map((item) => (
                              <option>
                                {item.nodeId + "-" + item?.nodeName}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Select
                            className="form-control mt-1"
                            id="routeId"
                            name="routeId"
                            onChange={(event) =>
                              handleRouteId(event, item, index)
                            }
                            value={item?.Route}
                            required
                            disabled={item?.ItemType != "Finished Goods"}
                          >
                            <option value="" hidden>
                              Please Select
                            </option>
                            {routeMasterData.map((item) => (
                              <option>{item.routeId} - {item.productCategory}</option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ width: "150px", height: "40px" }}
                            onClick={() => {
                              setRMDetail(item);
                              setShowPopup(index);
                            }}
                            disabled={
                              item?.ItemType != "Finished Goods" ||
                              !item?.Route ||
                              !item?.NodeId
                            }
                          >
                            Item Mapping
                          </button>
                        </td>
                        <td>
                          <div style={{ display: "flex" }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleSubmit(true, index)}
                              disabled={
                                item?.ItemType === "Finished Goods"
                                  ? !item?.Route || !item?.NodeId
                                  : !item?.NodeId ||
                                    item?.ItemType === "Raw Material"
                                    ? !item?.NodeId
                                    : ""
                                // (item?.ItemType === 'Raw Material' && item?.NodeId === '')
                              }
                            >
                              <FaCheck />
                            </button>

                            {/* <button className="btn btn-danger btn-sm"><FaMinus/></button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <div className="bank-details-btn mt-4">
                <button
                  disabled
                  // type="submit"
                  onClick={() => handleSubmit(false, 0)}
                  className="btn btn-success"
                >
                  <FaCheck />
                </button>
                &nbsp;&nbsp;
                <button
                  disabled
                  // type="submit"
                  onClick={CancelSubmit}
                  className="btn btn-danger"
                >
                  <FaXmark />
                </button>
              </div> */}
              <ToastContainer />
            </>
          )}
        </div>
      )}
      {showPopup >= 0 && (
        <div>
          <div className="d-flex justify-content-between m-1">
            <label style={{ width: "380px" }}>{`Finished Product: ${inputData[showPopup]?.IT_CODE +
              "-" +
              inputData[showPopup]?.IT_NAME
              }`}</label>
            <label
              style={{ width: "230px" }}
            >{`Route ID: ${inputData[showPopup]?.Route}`}</label>
            <label className="mt-1">Raw material </label>
            <Form.Select
              className="form-control"
              id="itemMapping"
              name="itemMapping"
              style={{ width: "300px" }}
              onChange={(e) => setRMType(e.target.value)}
              value={rmType}
              required
            >
              <option value="" hidden>
                Please Select
              </option>
              {/* <option >Raw Material</option> */}
              <option>RM-Film</option>
              <option>RM-Fabric</option>
            </Form.Select>
          </div>
          <div className="d-flex col-lg-12 col-md-8 col-sm-12 pt-3 justify-content-center">
            <table
              class="table-bordered table-striped"
              cellPadding={5}
              cellSpacing={5}
            >
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Select </th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter((item) => item.ItemType === rmType)
                  .map((item, index) => (
                    <tr key="">
                      <td>{item?.IT_CODE + "-" + item?.IT_NAME}</td>
                      <td style={{ textAlign: "center" }}>
                        <Form.Check.Input
                          type="checkbox"
                          name="Select"
                          id="allocated"
                          style={{ border: "1px solid #808080" }}
                          checked={isChecked(item)}
                          onChange={(e) => handleCheckBox(e, item, "select")}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Form.Check.Input
                          type="radio"
                          name="Default"
                          id="allocated"
                          style={{ border: "1px solid #808080" }}
                          checked={isRadioEnabled(item)}
                          onClick={(e) => handleCheckBox(e, item, "radio")}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* <div className="bank-details-btn m-4">
            <button
              // type="submit"
              onClick={handleItemMapping}
              className="btn btn-success"
            >
              <FaCheck />
            </button>
            &nbsp;&nbsp;
            <button
              // type="submit"
              onClick={cancelItemMapping}
              className="btn btn-danger"
            >
              <FaXmark />
            </button>
          </div> */}
          <ToastContainer position="bottom-left" />
        </div>
      )}
    </div>
  );
}
export default BottomFGmapping;
