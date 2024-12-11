import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaSistrix } from "react-icons/fa6";
import { Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
import CloseButton from 'react-bootstrap/CloseButton';



function FGmapping() {
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
  const [PercentWaste, setPercentWaste] = useState([]);
  const [FgToRmRatiovalue, setFgToRmRatiovalue] = useState([]);

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
          </span>, {
          position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
          // autoClose: 3000, // Optional: Set auto close time in milliseconds
          // closeButton: false, // Optional: Hide close button
          className: 'custom-toast' // Optional: Add custom CSS class
        }
        );
      }
    });
    // Clear the selected items
    setSelectedItems([]);
    // setDroppedData()
  };
  console.log(droppedData);

  const handleNewRowSubmit = () => {

    if (PercentWaste.length === 0) {
      alert("Please Enter a PercentWaste value!") 
      return
    }

    const drop = {
      mapping: droppedData.map((item) => ({
        nodeIdFG: item?.itemCode?.toString(),
        nodeIdRM: item?.RMcode?.toString(),
        branchId: "1001",
        userId: auth?.empId?.toString(),
        nodeCategory: item.Rmtype,
        nodeId: item.NodeId,
        PercentOfWaste: PercentWaste
      })),
    };
   
    // console.log("FG mapping drop data:", drop);
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
          </span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            // autoClose: 3000, // Optional: Set auto close time in milliseconds
            // closeButton: false, // Optional: Hide close button
            className: 'custom-toast' // Optional: Add custom CSS class
          }
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
        toast.error(
          <span><strong>User</strong> is not authorized fot this action.</span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            // autoClose: 3000, // Optional: Set auto close time in milliseconds
            // closeButton: false, // Optional: Hide close button
            className: 'custom-toast' // Optional: Add custom CSS class
          });
        setDroppedData(false)
        console.error("Error adding selected rows:", error);
      });
  };



  function getNodeNameById(nodeId) {
    const nodename = data
      .filter((item) => item.nodeId == nodeId)
      .map((item) => item.nodeName);
    return nodename;
  }

  const [showbuttons, setshowbuttons] = useState(true);

  const CancelSubmit = () => {
    setInputData([]);
    setItemRefresh(false);
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

  const getNodeData = () => {
    const materialNodes = data?.filter((item) => item?.nodeType === "Material");
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
    const itemList = rmList.filter((item1) => item1?.isSelected === true);
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
        toast.error(
          <span>Please fill at least one detail</span>,
          {
            position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
            // autoClose: 3000, // Optional: Set auto close time in milliseconds
            // closeButton: false, // Optional: Hide close button
            className: 'custom-toast' // Optional: Add custom CSS class
          }
        );
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
          toast.success(
            <span>Details saved Successfully</span>,
            {
              position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
              // autoClose: 3000, // Optional: Set auto close time in milliseconds
              // closeButton: false, // Optional: Hide close button
              className: 'custom-toast' // Optional: Add custom CSS class
            }
          );
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
      toast.success(
        <span>Details saved Successfully</span>,
        {
          position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
          // autoClose: 3000, // Optional: Set auto close time in milliseconds
          // closeButton: false, // Optional: Hide close button
          className: 'custom-toast' // Optional: Add custom CSS class
        }
      );
    }
    return;
  };

  const [error, setError] = useState(null);

  // Ramesh added
  const handlePercentOfwaste = (event) => {
    setPercentWaste(event.target.value)
  }
  const handleFgToRmRatio = (event) => {
    setFgToRmRatiovalue(event.target.value)
  }

  const clearInput = ()=>{
    setPercentWaste([])
    setFgToRmRatiovalue([])
  }

  const handleBlur = () => {
    if (!PercentWaste) {
      setError("Please enter a value for Percent Waste");
    } else {
      setError(null);
    }
  };

  return (
    <aside>
    <div className="employee-list-container">
      {!itemRefresh ? (
        <div className="container-fluid">
          {/* <div className='d-flex flex-row justify-content-end m-1'>
            <Tooltip title="Add FG Mapping">
              <Button onClick={handleNewRowSubmit} id='addbutton' style={{ marginLeft: '5px' }}>
                <FaPlus />
              </Button>
            </Tooltip>
          </div> */}

          <div className="row p-2 d-flex felx-row justify-content-center">
            <div className="col-6">
              <h6 style={{ textAlign: "center", fontWeight: "revert-layer" }}>
                Finished Goods
              </h6>
            </div>
            <div className="col-6">
              <h6 style={{ textAlign: "center", fontWeight: "revert-layer" }}>
                Raw Material
              </h6>
            </div>
            <div
              className="col-6"
              style={{ height: "130px", overflowY: "auto" }}
            >
              <table className="table table-bordered table-striped">
                <thead class="sticky-top">
                  <tr>
                    <th>Item Code</th>
                    <th style={{ width: "70%" }}>
                      Item Name
                      {isSearchVisible ? (
                        <div
                          className="search-input-container"
                          style={{
                            position: "absolute",
                            top: "0px",
                            // backgroundColor: "white",
                          }}
                        >
                          <input
                            type="text"
                            variant="outlined"
                            value={searchInput}
                            size="small"
                            style={{ width: "160px",height:'25px', fontSize: "10px",marginTop:'3px'}}
                            placeholder="search Finished Goods"
                            onChange={(e) => searchItems(e.target.value)}
                          />
                          <span
                            className="clear-button"
                            style={{ position: "absolute" }}
                            onClick={toggleSearch}
                          >
                            <FaXmark />
                          </span>
                        </div>
                      ) : (
                        <span
                          className="search-icon-button"
                          style={{ marginLeft: "10px" }}
                        >
                          <FaSistrix onClick={toggleSearch} />
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchInput.length > 0
                    ? filteredResults
                      .filter(
                        (item) => item.ItemType === "Finished Goods"
                        // && !Removedroppeddata.includes(item.IT_CODE)
                        // && !RemoveExistingdata.includes(item.IT_CODE)
                      )
                      .map((item, index) => (
                        <tr
                          draggable
                          onDragStart={(e) =>
                            dragStarted(
                              e,
                              item.IT_CODE,
                              item.IT_NAME,
                              item.ItemType,
                              item.Machine
                            )
                          }
                        >
                          <td>{item.IT_CODE}</td>
                          <td>{item.IT_NAME}</td>
                        </tr>
                      ))
                    : items
                      .filter(
                        (item) => item.ItemType === "Finished Goods"
                        // && !Removedroppeddata.includes(item.IT_CODE)
                        // && !RemoveExistingdata.includes(item.IT_CODE)
                      )
                      .map((item, index) => (
                        <tr
                          draggable
                          onDragStart={(e) =>
                            dragStarted(
                              e,
                              item.IT_CODE,
                              item.IT_NAME,
                              item.ItemType,
                              item.Machine
                            )
                          }
                        >
                          <td>{item.IT_CODE}</td>
                          <td>{item.IT_NAME}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div
              className="col-6"
              style={{ height: "130px", overflowY: "auto" }}
            >
              <table className="table table-bordered table-striped">
                <thead class="sticky-top">
                  <tr>
                    <th style={{ width: "20%" }}>Item Code</th>
                    <th style={{ width: "45%" }}>
                      Item Name
                      {isNodeSearchVisible ? (
                        <div
                          className="search-input-container"
                          style={{
                            position: "absolute",
                            top: "0px",
                            // backgroundColor: "white",
                          }}
                        >
                          <input
                            type="text"
                            variant="outlined"
                            value={NodesearchInput}
                            size="small"
                            style={{ width: "155px",height:'25px', fontSize: "10px",marginTop:'3px' }}
                            placeholder="search Raw Material"
                            onChange={(e) => searchNodesItems(e.target.value)}
                          />
                          <span
                            className="clear-button"
                            onClick={toggleNodeSearch}
                          >
                            <FaXmark />
                          </span>
                        </div>
                      ) : (
                        <span
                          className="search-icon-button"
                          style={{ marginLeft: "10px" }}
                        >
                          <FaSistrix onClick={toggleNodeSearch} />
                        </span>
                      )}
                    </th>
                    <th>Node Name</th>
                  </tr>
                </thead>
                <tbody>
                  {NodesearchInput.length > 0
                    ? NodefilteredResults.filter(
                      (item) =>
                        item.ItemType === "Raw Material" ||
                        item.ItemType === "RM-Film" ||
                        item.ItemType === "RM-Fabric"
                    ).map((item, index) => (
                      <tr
                        onDragOver={(e) => draggingOver(e)}
                        onDrop={(e) =>
                          dragDropped(
                            e,
                            item.IT_CODE,
                            item.IT_NAME,
                            item.ItemType,
                            item.Machine,
                            item.NodeId
                          )
                        }
                        key={item.IT_CODE}
                      >
                        <td>{item.IT_CODE}</td>
                        <td>{item.IT_NAME}</td>
                        <td>{getNodeNameById(item.NodeId)}</td>
                      </tr>
                    ))
                    : items
                      .filter(
                        (item) =>
                          item.ItemType === "Raw Material" ||
                          item.ItemType === "RM-Film" ||
                          item.ItemType === "RM-Fabric"
                      )
                      .map((item, index) => (
                        <tr
                          onDragOver={(e) => draggingOver(e)}
                          onDrop={(e) =>
                            dragDropped(
                              e,
                              item.IT_CODE,
                              item.IT_NAME,
                              item.ItemType,
                              item.Machine,
                              item.NodeId
                            )
                          }
                          key={item.IT_CODE}
                        >
                          <td>{item.IT_CODE}</td>
                          <td>{item.IT_NAME}</td>
                          <td>{getNodeNameById(item.NodeId)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row p-2 d-flex felx-row justify-content-center">
            <br />
            <div className="col-6">
              <h6 style={{ textAlign: "center", fontWeight: "revert-layer" }}>
                Finished Goods Mapping
              </h6>
            </div>
            <div
              className="col-12"
              style={{ height: "130px", overflowY: "auto" }}
            >
              <table className="table table-bordered table-striped">
                <thead class="sticky-top">
                  <tr>
                    <th style={{ width: "135px" }}>Item Code(FG)</th>
                    <th style={{ width: "220px" }}>Item Name</th>
                    <th style={{ width: "135px" }}>Item Code(RM)</th>
                    <th style={{ width: "220px" }}>Item Name</th>
                    <th style={{ width: "140px" }}>Item Type</th>
                    <th style={{ width: "220px" }}>%Of Waste</th>
                    <th style={{ width: "140px" }}>FgToRmRatio</th>
                    <th style={{ width: "130px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {droppedData
                    ? droppedData.map((item) => (
                      <tr>
                        <td>{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.RMcode}</td>
                        <td>{item.RMname}</td>
                        <td>{item.Rmtype}</td>
                        <td>
                          <Form.Control min={0} onBlur={handleBlur}
                           required type="number" value={PercentWaste}
                            onChange={handlePercentOfwaste}  />
                        </td>
                        <td>
                          <Form.Control type="number" min={0} value={FgToRmRatiovalue} onChange={handleFgToRmRatio} />
                        </td>
                        <td style={{textAlign:'center'}} className="justify-items-center">
                          {/* <div className="d-flex justify-items-center"> */}
                            {/* <button onClick={() => setDroppedData([])} style={{ border: "none",background:'transparent' }}><CloseButton onClick={()=> clearInput()} title="Cancel" variant="blue" /></button> */}
                            <FaXmark onClick={()=> clearInput()} title="Cancel" id="FaMinus"/> &nbsp;
                            {/* <button onClick={() => { handleNewRowSubmit() }} style={{ border: "none", background: "transparent" }}><FaCheck title="Save" color="green" /></button> */}
                            <FaCheck title="Save" id="FaCheck" />
                          {/* </div> */}
                        </td>
                      </tr>
                    ))
                    : ""}
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="p-1 col-12">
                {showbuttons ? (
                  <div>
                    {/* <button
                      className="btn"
                      style={{backgroundColor:'#034661',color:'#ffffff'}}
                      onClick={handleNewRowSubmit}
                    >
                      Add
                    </button>
                    &nbsp;&nbsp;
                    <button
                      className="btn"
                      onClick={() => setDroppedData([])}
                      style={{backgroundColor:'#ffffff',color:'#034661',border:'1px solid #034661'}}
                    >
                      Cancel
                    </button> */}
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
            </div>
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
                  class="table-bordered tablestriped"
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
              <div className="bank-details-btn mt-4">
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
              </div>
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
              class="table-bordered tablestriped"
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
          <div className="bank-details-btn m-4">
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
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
    </aside>
  );
}
export default FGmapping;
