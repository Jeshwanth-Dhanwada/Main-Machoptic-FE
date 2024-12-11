// AnotherComponent.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaXmark, FaCheck, FaMinus, FaSistrix } from "react-icons/fa6";
import Sidebar from "./sidebar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "@mui/material/Tooltip";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
function RouteMapping() {
  const { auth } = useContext(AuthContext);
  console.log(auth.empId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState);
    console.log(sidebarCollapsed);
  };
  const [data, setData] = useState([]);
  const [routeMasterData, setrouteMasterData] = useState([]);
  const [ItemMasterData, setItemMasterData] = useState([]);
  const [shiftdata, setShiftdata] = useState([]);
  const [empNodeMap, setEmpNodeMapping] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchEquipmet, setSearchEquipmet] = useState("");
  const [searchIT_Name, setSearchIT_Name] = useState("");
  const [searchRouteType, setSearchRouteType] = useState("");

  const [filteredResults, setFilteredResults] = useState([]);
  const [equipmentResults, setEquipmentResults] = useState([]);
  const [IT_NameResults, setIT_NameResults] = useState([]);
  const [RouteTypeResults, setRouteTypeResults] = useState([]);

  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isSearchEquipment, issetSearchEquipmet] = useState(false);
  const [isSearchIT_Name, SetissetSearchIT_Name] = useState(false);
  const [isSearchRouteType, SetIsSearchRouteType] = useState(false);

  // Fetch data from the routeMaster API when the component mounts
  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/routeMaster`;
    // const apiUrl = `${BASE_URL}/api/routeMaster`;
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        console.log("route data", response.data);
        setrouteMasterData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetch data from the Item master API when the component mounts
  useEffect(() => {
    const apiUrl = `${BASE_URL}/api/itemmaster`;
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        console.log("itemaster data", response.data);
        const itemMasterData = response.data.map((item, index) => ({
          ...item,
          index: index,
        }));
        setItemMasterData(itemMasterData);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function getItemMaster() {
    const apiUrl = `${BASE_URL}/api/itemmaster`;
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        console.log("itemaster data", response.data);
        const itemMasterData = response.data.map((item, index) => ({
          ...item,
          index: index,
        }));
        setItemMasterData(itemMasterData);
        // const routedata.push(response.data)
        // console.log(routedata,"passing to the variable")
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // const [Employeesdata, setEmployees] = useState()
  const [droppedData, setDroppedData] = useState();
  // const dragStarted = (e, empId, empName) => {
  //   e.dataTransfer.setData("empId",empId)
  //   e.dataTransfer.setData("empName", empName)
  //   console.log( empId,empName);
  // }

  const [selectedItems, setSelectedItems] = useState([]);

  const dragStarted = (e, routeId, routeDescription) => {
    const selectedItem = { routeId, routeDescription };
    setSelectedItems([...selectedItems, selectedItem]);
  };
  console.log("****", selectedItems);

  const draggingOver = (event) => {
    event.preventDefault();
    console.log("Dragging Over now");
  };

  const [PopupEmp, setEmpPopup] = useState(false);

  const dragDropped = (
    event,
    IT_CODE,
    IT_NAME,
    ItemType,
    branchId,
    userId,
    Machine,
    id,
    CO_CODE,
    ALT_NAME,
    Production_Type,
    Production_section_ID,
    IG_CODE,
    ALT_UNIT,
    Otherchrage_Code,
    UR_Code,
    CUR_DATE,
    CUR_TIME,
    Item_status,
    Unit_Code,
    Tarrif_No_Code,
    Packing_Type_Code,
    SALT_RATE,
    Lead_Period,
    Reason,
    Normal,
    Size,
    Per_PackIng_Qty,
    Net_Weight,
    Tolerance,
    Old_Item_Code,
    Minimum,
    Stock_Effect,
    Cost,
    Minimum_Order_Qty,
    Storage_Location_ID,
    Ramco_Code,
    Service_Item,
    Consumable_HSN,
    Long_Desc,
    SP_PTNO,
    CUST_PTNO,
    PALT_RATE,
    UseQty_Alt,
    REOALT_QTY,
    Color_Value,
    Party_Name_ID,
    Refe_NO,
    BOM_Import_Yes_No,
    Import_Yes_No,
    Not_allow_fifo_Inpackingtick,
    Circumference_ID,
    Film_Type_ID,
    Liner_Type_ID,
    Gauge_ID,
    Width_ID,
    Color_ID,
    Denier_ID,
    Single_Double_Up,
    Handle,
    Handle_Type,
    Fabric_Type,
    Film_ID,
    Special_Remark,
    Party,
    No_of_colors,
    mtr_per_wgt,
    Film_Name_ID,
    Fabric_Name_ID,
    Per_Bag_wgt,
    Metalize_Film,
    Route
  ) => {
    event.preventDefault(); // Allows the drop
    selectedItems.forEach((selectedItem) => {
      const { routeId, routeDescription } = selectedItem;
      const existingData = droppedData || [];
      const newData = [
        ...existingData,
        {
          routeId,
          routeDescription,
          IT_CODE,
          IT_NAME,
          ItemType,
          branchId,
          userId,
          Machine,
          id,
          CO_CODE,
          ALT_NAME,
          Production_Type,
          Production_section_ID,
          IG_CODE,
          ALT_UNIT,
          Otherchrage_Code,
          UR_Code,
          CUR_DATE,
          CUR_TIME,
          Item_status,
          Unit_Code,
          Tarrif_No_Code,
          Packing_Type_Code,
          SALT_RATE,
          Lead_Period,
          Reason,
          Normal,
          Size,
          Per_PackIng_Qty,
          Net_Weight,
          Tolerance,
          Old_Item_Code,
          Minimum,
          Stock_Effect,
          Cost,
          Minimum_Order_Qty,
          Storage_Location_ID,
          Ramco_Code,
          Service_Item,
          Consumable_HSN,
          Long_Desc,
          SP_PTNO,
          CUST_PTNO,
          PALT_RATE,
          UseQty_Alt,
          REOALT_QTY,
          Color_Value,
          Party_Name_ID,
          Refe_NO,
          BOM_Import_Yes_No,
          Import_Yes_No,
          Not_allow_fifo_Inpackingtick,
          Circumference_ID,
          Film_Type_ID,
          Liner_Type_ID,
          Gauge_ID,
          Width_ID,
          Color_ID,
          Denier_ID,
          Single_Double_Up,
          Handle,
          Handle_Type,
          Fabric_Type,
          Film_ID,
          Special_Remark,
          Party,
          No_of_colors,
          mtr_per_wgt,
          Film_Name_ID,
          Fabric_Name_ID,
          Per_Bag_wgt,
          Metalize_Film,
          Route,
        },
      ];

      console.log(newData);
      setDroppedData(newData);
      console.log(droppedData, "****");
    });
    console.log("dropped data", droppedData);
    // Show the popup after setting the dropped data
    setEmpPopup(true);
    // Clear the selected items
    setSelectedItems([]);
  };

  const [shift, setShift] = useState(""); // State for the selected Shift
  const [nodeType, setNodeType] = useState(""); // State for the selected Shift
  const [startDate, setStartDate] = useState(getFormattedToday()); // State for the Start Date

  const handleShiftChange = (e) => {
    setShift(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleNodeType = (e) => {
    setNodeType(e.target.value);
  };

  // Function to get today's date in the format 'YYYY-MM-DD'
  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Correct format: YYYY-MM-DD
  }

  const a = droppedData
    ? parseInt(droppedData.map((item) => item.routeId))
    : "";

  console.log(typeof a);
  // const [showToast, setShowToast] = useState(false)
  const handleNewRowSubmit = (event) => {
    event.preventDefault();
    console.log("dropped data....", droppedData);
    if (!droppedData || droppedData.length === 0) {
      console.log("No data to save.");
      toast.warning(
        <p>
          <strong>Warning</strong> Please Assigned to Route mapping.
        </p>
      );

      return; // Exit the function
    }
    const drop = {
      itemmaster: droppedData.map((item) => ({
        id: item.id,
        IT_CODE: item.IT_CODE,
        branchId: item.branchId,
        userId: String(auth.empId),
        IT_NAME: item.IT_NAME,
        ItemType: item.ItemType,
        Machine: item.Machine,
        Route: parseInt(item.routeId),
        // Route: droppedData ? droppedData.map((item) => item.routeId).join(', ') : "",
        CO_CODE: item.CO_CODE,
        ALT_NAME: item.ALT_NAME,
        Production_Type: item.Production_Type,
        Production_section_ID: item.Production_section_ID,
        IG_CODE: item.IG_CODE,
        ALT_UNIT: item.ALT_UNIT,
        Otherchrage_Code: item.Otherchrage_Code,
        UR_Code: item.UR_Code,
        CUR_DATE: item.CUR_DATE,
        CUR_TIME: item.CUR_TIME,
        Item_status: item.Item_status,
        Unit_Code: item.Unit_Code,
        Tarrif_No_Code: item.Tarrif_No_Code,
        Packing_Type_Code: item.Packing_Type_Code,
        SALT_RATE: item.SALT_RATE,
        Lead_Period: item.Lead_Period,
        Reason: item.Reason,
        Normal: item.Normal,
        Size: item.Size,
        Per_PackIng_Qty: item.Per_PackIng_Qty,
        Net_Weight: item.Net_Weight,
        Tolerance: item.Tolerance,
        Old_Item_Code: item.Old_Item_Code,
        Minimum: item.Minimum,
        Stock_Effect: item.Stock_Effect,
        Cost: item.Cost,
        Minimum_Order_Qty: item.Minimum_Order_Qty,
        Storage_Location_ID: item.Storage_Location_ID,
        Ramco_Code: item.Ramco_Code,
        Service_Item: item.Service_Item,
        Consumable_HSN: item.Consumable_HSN,
        Long_Desc: item.Long_Desc,
        SP_PTNO: item.SP_PTNO,
        CUST_PTNO: item.CUST_PTNO,
        PALT_RATE: item.PALT_RATE,
        UseQty_Alt: item.UseQty_Alt,
        REOALT_QTY: item.REOALT_QTY,
        Color_Value: item.Color_Value,
        Party_Name_ID: item.Party_Name_ID,
        Refe_NO: item.Refe_NO,
        BOM_Import_Yes_No: item.BOM_Import_Yes_No,
        Import_Yes_No: item.Import_Yes_No,
        Not_allow_fifo_Inpackingtick: item.Not_allow_fifo_Inpackingtick,
        Circumference_ID: item.Circumference_ID,
        Film_Type_ID: item.Film_Type_ID,
        Liner_Type_ID: item.Liner_Type_ID,
        Gauge_ID: item.Gauge_ID,
        Width_ID: item.Width_ID,
        Color_ID: item.Color_ID,
        Denier_ID: item.Denier_ID,
        Single_Double_Up: item.Single_Double_Up,
        Handle: item.Handle,
        Handle_Type: item.Handle_Type,
        Fabric_Type: item.Fabric_Type,
        Film_ID: item.Film_ID,
        Special_Remark: item.Special_Remark,
        Party: item.Party,
        No_of_colors: item.No_of_colors,
        mtr_per_wgt: item.mtr_per_wgt,
        Film_Name_ID: item.Film_Name_ID,
        Fabric_Name_ID: item.Fabric_Name_ID,
        Per_Bag_wgt: item.Per_Bag_wgt,
        Metalize_Film: item.Metalize_Film,
      })),
    };
    console.log(drop);
    axios
      .put(`${BASE_URL}/api/itemmaster/bulk`, drop, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        console.log("New row added successfully", response.data);
        setData([...data, response.data]);
        toast.success(
          <p>
            <strong>successfully</strong> Added Employee node map.
          </p>
        );
        setshowbuttons(true);
        setDroppedData(false);

        const apiUrl = `${BASE_URL}/api/itemmaster`;
        axios
          .get(apiUrl, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            const itemMasterData = response.data.map((item, index) => ({
              ...item,
              index: index,
            }));
            setItemMasterData(itemMasterData);
          });
      })
      .catch((error) => {
        setDroppedData(false);
        toast.error(
          <span>
            {error?.response?.data?.message}
          </span>
        );
        console.error("Error adding new row:", error);
      });
  };

  // Delete the table row

  const handleDeleteEmployeeMap = (IT_CODE) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${BASE_URL}/api/itemmaster/${IT_CODE}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        })
        .then((response) => {
          console.log("Node deleted successfully", response.data);
          // After successful deletion, update the empNodeMap state by filtering out the deleted item
          setItemMasterData((prevEmpNodeMap) => {
            return prevEmpNodeMap.filter((item) => item.IT_CODE !== IT_CODE);
          });
          toast.error(
            <span>
              <strong>Deleted</strong> successfully.
            </span>
          );
        })
        .catch((error) => {
          console.error("Error deleting node:", error);
        });
    } else {
    }
  };

  // Update the row -----------

  const [editedIndex, setEditedIndex] = useState(null);
  const [showbuttons, setshowbuttons] = useState(true);

  const handleEdit = (index) => {
    setEditedIndex(index);
    setshowbuttons(false);
  };

  const removeEdit = (index) => {
    setEditedIndex(null);
    setshowbuttons(true);
    getItemMaster();
  };

  const handleSave = (event, index) => {
    event.preventDefault();
    // Make an API request to save the edited data here
    // Assuming you have an API endpoint to update the data
    const editedItem = ItemMasterData[index];
    console.log(editedItem);
    // console.log(droppedData)
    if (!editedItem || editedItem.length === 0) {
      console.log("No data to save.");
      // toast.warning(<p><strong>Warning</strong> Please Assigned to Employee node map.</p>);

      return; // Exit the function
    }
    const edite = {
      id: editedItem.id,
      IT_CODE: editedItem.IT_CODE,
      branchId: editedItem.branchId,
      userId: auth.empId.toString(),
      IT_NAME: editedItem.IT_NAME,
      ItemType: editedItem.ItemType,
      Machine: editedItem.Machine,
      // Route:droppedData ? droppedData.map((item) => (item.routeId)) : "",
      Route: editedItem.Route,
      CO_CODE: editedItem.CO_CODE,
      ALT_NAME: editedItem.ALT_NAME,
      Production_Type: editedItem.Production_Type,
      Production_section_ID: editedItem.Production_section_ID,
      IG_CODE: editedItem.IG_CODE,
      ALT_UNIT: editedItem.ALT_UNIT,
      Otherchrage_Code: editedItem.Otherchrage_Code,
      UR_Code: editedItem.UR_Code,
      CUR_DATE: editedItem.CUR_DATE,
      CUR_TIME: editedItem.CUR_TIME,
      Item_status: editedItem.Item_status,
      Unit_Code: editedItem.Unit_Code,
      Tarrif_No_Code: editedItem.Tarrif_No_Code,
      Packing_Type_Code: editedItem.Packing_Type_Code,
      SALT_RATE: editedItem.SALT_RATE,
      Lead_Period: editedItem.Lead_Period,
      Reason: editedItem.Reason,
      Normal: editedItem.Normal,
      Size: editedItem.Size,
      Per_PackIng_Qty: editedItem.Per_PackIng_Qty,
      Net_Weight: editedItem.Net_Weight,
      Tolerance: editedItem.Tolerance,
      Old_Item_Code: editedItem.Old_Item_Code,
      Minimum: editedItem.Minimum,
      Stock_Effect: editedItem.Stock_Effect,
      Cost: editedItem.Cost,
      Minimum_Order_Qty: editedItem.Minimum_Order_Qty,
      Storage_Location_ID: editedItem.Storage_Location_ID,
      Ramco_Code: editedItem.Ramco_Code,
      Service_Item: editedItem.Service_Item,
      Consumable_HSN: editedItem.Consumable_HSN,
      Long_Desc: editedItem.Long_Desc,
      SP_PTNO: editedItem.SP_PTNO,
      CUST_PTNO: editedItem.CUST_PTNO,
      PALT_RATE: editedItem.PALT_RATE,
      UseQty_Alt: editedItem.UseQty_Alt,
      REOALT_QTY: editedItem.REOALT_QTY,
      Color_Value: editedItem.Color_Value,
      Party_Name_ID: editedItem.Party_Name_ID,
      Refe_NO: editedItem.Refe_NO,
      BOM_Import_Yes_No: editedItem.BOM_Import_Yes_No,
      Import_Yes_No: editedItem.Import_Yes_No,
      Not_allow_fifo_Inpackingtick: editedItem.Not_allow_fifo_Inpackingtick,
      Circumference_ID: editedItem.Circumference_ID,
      Film_Type_ID: editedItem.Film_Type_ID,
      Liner_Type_ID: editedItem.Liner_Type_ID,
      Gauge_ID: editedItem.Gauge_ID,
      Width_ID: editedItem.Width_ID,
      Color_ID: editedItem.Color_ID,
      Denier_ID: editedItem.Denier_ID,
      Single_Double_Up: editedItem.Single_Double_Up,
      Handle: editedItem.Handle,
      Handle_Type: editedItem.Handle_Type,
      Fabric_Type: editedItem.Fabric_Type,
      Film_ID: editedItem.Film_ID,
      Special_Remark: editedItem.Special_Remark,
      Party: editedItem.Party,
      No_of_colors: editedItem.No_of_colors,
      mtr_per_wgt: editedItem.mtr_per_wgt,
      Film_Name_ID: editedItem.Film_Name_ID,
      Fabric_Name_ID: editedItem.Fabric_Name_ID,
      Per_Bag_wgt: editedItem.Per_Bag_wgt,
      Metalize_Film: editedItem.Metalize_Film,
    };
    console.log(edite, "edite");
    // console.log(editedItem,"editedItem")

    // Update the edited item with the new values
    // You can use axios.put or a similar method to send the data to your API
    axios
      .put(`${BASE_URL}/api/itemmaster/${editedItem.IT_CODE}`, edite, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        console.log("Data saved successfully", response.data);
        setEditedIndex(null);
        toast.success(
          <span>
            <strong>successfully</strong> Updated.
          </span>
        );
        setshowbuttons(true);
        // getEmpNameById()
        // getNodeNameById()
      })
      .catch((error) => {
        setEditedIndex(null);
        setshowbuttons(true);
        getItemMaster();
        toast.error(
          <span>
            {error?.response?.data?.message}
          </span>
        );
        console.error("Error saving data:", error);
      });
  };

  const [showpopup, setshowpopup] = useState(true);
  const handleRoute = (IT_CODE) => {
    setshowpopup(true);
    if (window.confirm("Are you sure you want to delete?")) {
      const updatedItem = ItemMasterData.find(
        (item) => item.IT_CODE === IT_CODE
      );
      // Make sure the item was found
      if (!updatedItem) {
        console.error("Item not found for IT_CODE:", IT_CODE);
        return;
      }
      // Prepare the updated data
      const itemMasterupdate = {
        IT_CODE: updatedItem.IT_CODE,
        branchId: updatedItem.branchId,
        userId: auth?.empId.toString(),
        IT_NAME: updatedItem.IT_NAME,
        ItemType: updatedItem.ItemType,
        Machine: updatedItem.Machine,
        Route: null,
        CO_CODE: updatedItem.CO_CODE,
        ALT_NAME: updatedItem.ALT_NAME,
        Production_Type: updatedItem.Production_Type,
        Production_section_ID: updatedItem.Production_section_ID,
        IG_CODE: updatedItem.IG_CODE,
        ALT_UNIT: updatedItem.ALT_UNIT,
        Otherchrage_Code: updatedItem.Otherchrage_Code,
        UR_Code: updatedItem.UR_Code,
        CUR_DATE: updatedItem.CUR_DATE,
        CUR_TIME: updatedItem.CUR_TIME,
        Item_status: updatedItem.Item_status,
        Unit_Code: updatedItem.Unit_Code,
        Tarrif_No_Code: updatedItem.Tarrif_No_Code,
        Packing_Type_Code: updatedItem.Packing_Type_Code,
        SALT_RATE: updatedItem.SALT_RATE,
        Lead_Period: updatedItem.Lead_Period,
        Reason: updatedItem.Reason,
        Normal: updatedItem.Normal,
        Size: updatedItem.Size,
        Per_PackIng_Qty: updatedItem.Per_PackIng_Qty,
        Net_Weight: updatedItem.Net_Weight,
        Tolerance: updatedItem.Tolerance,
        Old_Item_Code: updatedItem.Old_Item_Code,
        Minimum: updatedItem.Minimum,
        Stock_Effect: updatedItem.Stock_Effect,
        Cost: updatedItem.Cost,
        Minimum_Order_Qty: updatedItem.Minimum_Order_Qty,
        Storage_Location_ID: updatedItem.Storage_Location_ID,
        Ramco_Code: updatedItem.Ramco_Code,
        Service_Item: updatedItem.Service_Item,
        Consumable_HSN: updatedItem.Consumable_HSN,
        Long_Desc: updatedItem.Long_Desc,
        SP_PTNO: updatedItem.SP_PTNO,
        CUST_PTNO: updatedItem.CUST_PTNO,
        PALT_RATE: updatedItem.PALT_RATE,
        UseQty_Alt: updatedItem.UseQty_Alt,
        REOALT_QTY: updatedItem.REOALT_QTY,
        Color_Value: updatedItem.Color_Value,
        Party_Name_ID: updatedItem.Party_Name_ID,
        Refe_NO: updatedItem.Refe_NO,
        BOM_Import_Yes_No: updatedItem.BOM_Import_Yes_No,
        Import_Yes_No: updatedItem.Import_Yes_No,
        Not_allow_fifo_Inpackingtick: updatedItem.Not_allow_fifo_Inpackingtick,
        Circumference_ID: updatedItem.Circumference_ID,
        Film_Type_ID: updatedItem.Film_Type_ID,
        Liner_Type_ID: updatedItem.Liner_Type_ID,
        Gauge_ID: updatedItem.Gauge_ID,
        Width_ID: updatedItem.Width_ID,
        Color_ID: updatedItem.Color_ID,
        Denier_ID: updatedItem.Denier_ID,
        Single_Double_Up: updatedItem.Single_Double_Up,
        Handle: updatedItem.Handle,
        Handle_Type: updatedItem.Handle_Type,
        Fabric_Type: updatedItem.Fabric_Type,
        Film_ID: updatedItem.Film_ID,
        Special_Remark: updatedItem.Special_Remark,
        Party: updatedItem.Party,
        No_of_colors: updatedItem.No_of_colors,
        mtr_per_wgt: updatedItem.mtr_per_wgt,
        Film_Name_ID: updatedItem.Film_Name_ID,
        Fabric_Name_ID: updatedItem.Fabric_Name_ID,
        Per_Bag_wgt: updatedItem.Per_Bag_wgt,
        Metalize_Film: updatedItem.Metalize_Film,
      };
      axios
        .put(
          `${BASE_URL}/api/itemmaster/${updatedItem.IT_CODE}`,
          itemMasterupdate,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log("Data saved successfully", response.data);
          getItemMaster();
          toast.error(
            <span>
              <strong>successfully</strong> Deleted.
            </span>
          );
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          toast.error(
            <span>
              <strong>User</strong> is not authorized fot this action.
            </span>
          );
        });
    }
  };

  function getNodeNameById(nodeId) {
    const node = ItemMasterData.find((item) => item.IT_CODE === nodeId);
    return node ? node.IT_NAME : "Node Not Found";
  }

  function getRouteNameById(routeId) {
    const emp = routeMasterData.find(
      (item) => parseInt(item.routeId) === parseInt(routeId)
    );
    return emp ? emp.routeDescription : "Node Not Found";
  }
  function getRouteTypeById(routeId) {
    const emp = routeMasterData.find(
      (item) => parseInt(item.routeId) === parseInt(routeId)
    );
    return emp ? emp.productCategory : "Node Not Found";
  }

  // Ramesh changes for filter & search
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    const filteredData = routeMasterData.filter((item) => {
      const name = item.routeDescription.toLowerCase();
      return name.includes(searchValue.toLowerCase());
    });
    setFilteredResults(filteredData);
  };

  const searchequipmet = (searchValue) => {
    setSearchEquipmet(searchValue);

    const filteredData = ItemMasterData.filter((item) => {
      const name = String(item.IT_NAME).toLowerCase();
      return name.includes(searchValue.toLowerCase());
    });
    setEquipmentResults(filteredData);
  };
  const HandlesearchIT_Name = (searchValue) => {
    SetIsSearchRouteType(false)
    setSearchIT_Name(searchValue, "searchValue");
    const filteredData = ItemMasterData.filter((item) => {
      const name = String(item.IT_NAME).toLowerCase();
      return name.includes(searchValue.toLowerCase());
    });
    setIT_NameResults(filteredData);
  };
  const HandlesearchRouteType = (searchValue) => {
    setSearchRouteType(searchValue);
    const filteredData = ItemMasterData.filter((item) => {
      const name = String(item.Route).toLowerCase();
      const routename = getRouteTypeById(name)
      return routename.includes(searchValue.toLowerCase());
    });
    setRouteTypeResults(filteredData);
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchInput("");
  };

  const toggleSearchEquipment = () => {
    issetSearchEquipmet(!isSearchEquipment);
    setSearchEquipmet("");
  };

  const toggleSearchIT_Name = () => {
    SetIsSearchRouteType(false)
    SetissetSearchIT_Name(!isSearchIT_Name);
    setSearchIT_Name("");
  };
  const toggleSearchRouteType = () => {
    SetissetSearchIT_Name(false)
    SetIsSearchRouteType(!isSearchRouteType);
    setSearchRouteType("");
  };

  // Testing for route checking
  const route = empNodeMap.filter((item) => item.Route != null);
  console.log("routecheck", ItemMasterData);

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: sidebarCollapsed ? "95%" : "0%",
          transition: "width 0.1s",
          zIndex: 2,
          overflow: "hidden",
        }}
      ></div>
      <div
        className="container-fluid"
        style={{ width: "100%", height: "100%" }}
      >
        <div className="row p-2 d-flex flex-row justify-content-center">
          <div className="col-6">
            <h6 style={{ textAlign: "center", fontWeight: "revert-layer" }}>
              Route List
            </h6>
          </div>
          <div className="col-6">
            <h6 style={{ textAlign: "center", fontWeight: "revert-layer" }}>
              Finished Goods
            </h6>
          </div>
          <div className="col-6" style={{ height: "146px", overflowY: "auto" }}>
            <table className="table table-bordered table-striped">
              <thead class="sticky-top">
                <tr>
                  <th>Route ID </th>
                  <th>Route Name</th>
                  <th style={{ width: "60%" }}>
                    Route Type
                    {isSearchVisible ? (
                      <div
                        className="search-input-container"
                        style={{
                          position: "absolute",
                          top: "0px",
                          backgroundColor: "white",
                        }}
                      >
                        <TextField
                          type="text"
                          variant="outlined"
                          value={searchInput}
                          size="small"
                          style={{ width: "170px", fontSize: "10px" }}
                          placeholder="search Route"
                          onChange={(e) => searchItems(e.target.value)}
                        />
                        <span className="clear-button" onClick={toggleSearch}>
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
                  ? filteredResults.map((item, index) => (
                    <tr
                      draggable
                      onDragStart={(e) =>
                        dragStarted(e, item.routeId, item.routeDescription)
                      }
                    >
                      <td style={{ textAlign: "center" }}>{item.routeId}</td>
                      <td>{item.productCategory}</td>
                      <td>{item.routeDescription}</td>
                    </tr>
                  ))
                  : routeMasterData.map((item, index) => (
                    <tr
                      draggable
                      onDragStart={(e) =>
                        dragStarted(e, item.routeId, item.routeDescription)
                      }
                    >
                      <td style={{ textAlign: "center" }}>{item.routeId}</td>
                      <td>{item.productCategory}</td>
                      <td>{item.routeDescription}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="col-6" style={{ height: "146px", overflowY: "auto" }}>
            <table className="table table-bordered table-striped">
              <thead class="sticky-top">
                <tr>
                  <th>IT Code</th>
                  <th style={{ width: "75%" }}>
                    IT Name
                    {isSearchEquipment ? (
                      <div
                        className="search-input-container"
                        style={{
                          position: "absolute",
                          top: "0px",
                          backgroundColor: "white",
                        }}
                      >
                        <TextField
                          type="text"
                          variant="outlined"
                          value={searchEquipmet}
                          size="small"
                          style={{ width: "180px", fontSize: "10px" }}
                          placeholder="search Finished Goods"
                          onChange={(e) => searchequipmet(e.target.value)}
                        />
                        <span
                          className="clear-button"
                          onClick={toggleSearchEquipment}
                        >
                          <FaXmark />
                        </span>
                      </div>
                    ) : (
                      <span
                        className="search-icon-button"
                        style={{ marginLeft: "10px" }}
                      >
                        <FaSistrix onClick={toggleSearchEquipment} />
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchEquipmet.length > 0
                  ? equipmentResults
                    .filter(
                      (item) =>
                        item.ItemType === "Finished Goods" &&
                        item.Route === null
                    )
                    .map((item, index) => (
                      <tr
                        key={item.IT_CODE}
                        onDragOver={(e) => draggingOver(e)}
                        onDrop={(e) =>
                          dragDropped(
                            e,
                            item.IT_CODE,
                            item.IT_NAME,
                            item.ItemType,
                            item.branchId,
                            item.userId,
                            item.Machine,
                            item.id,
                            item.CO_CODE,
                            item.ALT_NAME,
                            item.Production_Type,
                            item.Production_section_ID,
                            item.IG_CODE,
                            item.ALT_UNIT,
                            item.Otherchrage_Code,
                            item.UR_Code,
                            item.CUR_DATE,
                            item.CUR_TIME,
                            item.Item_status,
                            item.Unit_Code,
                            item.Tarrif_No_Code,
                            item.Packing_Type_Code,
                            item.SALT_RATE,
                            item.Lead_Period,
                            item.Reason,
                            item.Normal,
                            item.Size,
                            item.Per_PackIng_Qty,
                            item.Net_Weight,
                            item.Tolerance,
                            item.Old_Item_Code,
                            item.Minimum,
                            item.Stock_Effect,
                            item.Cost,
                            item.Minimum_Order_Qty,
                            item.Storage_Location_ID,
                            item.Ramco_Code,
                            item.Service_Item,
                            item.Consumable_HSN,
                            item.Long_Desc,
                            item.SP_PTNO,
                            item.CUST_PTNO,
                            item.PALT_RATE,
                            item.UseQty_Alt,
                            item.REOALT_QTY,
                            item.Color_Value,
                            item.Party_Name_ID,
                            item.Refe_NO,
                            item.BOM_Import_Yes_No,
                            item.Import_Yes_No,
                            item.Not_allow_fifo_Inpackingtick,
                            item.Circumference_ID,
                            item.Film_Type_ID,
                            item.Liner_Type_ID,
                            item.Gauge_ID,
                            item.Width_ID,
                            item.Color_ID,
                            item.Denier_ID,
                            item.Single_Double_Up,
                            item.Handle,
                            item.Handle_Type,
                            item.Fabric_Type,
                            item.Film_ID,
                            item.Special_Remark,
                            item.Party,
                            item.No_of_colors,
                            item.mtr_per_wgt,
                            item.Film_Name_ID,
                            item.Fabric_Name_ID,
                            item.Per_Bag_wgt,
                            item.Metalize_Film,
                            item.userId,
                            item.Route
                          )
                        }
                      >
                        <td>{item.IT_CODE}</td>
                        <td>{item.IT_NAME}</td>
                      </tr>
                    ))
                  : ItemMasterData.filter(
                    (item) =>
                      item.ItemType === "Finished Goods" &&
                      item.Route === null
                  ).map((item, index) => (
                    <tr
                      key={item.nodeId}
                      onDragOver={(e) => draggingOver(e)}
                      onDrop={(e) =>
                        dragDropped(
                          e,
                          item.IT_CODE,
                          item.IT_NAME,
                          item.ItemType,
                          item.branchId,
                          item.userId,
                          item.Machine,
                          item.id,
                          item.CO_CODE,
                          item.ALT_NAME,
                          item.Production_Type,
                          item.Production_section_ID,
                          item.IG_CODE,
                          item.ALT_UNIT,
                          item.Otherchrage_Code,
                          item.UR_Code,
                          item.CUR_DATE,
                          item.CUR_TIME,
                          item.Item_status,
                          item.Unit_Code,
                          item.Tarrif_No_Code,
                          item.Packing_Type_Code,
                          item.SALT_RATE,
                          item.Lead_Period,
                          item.Reason,
                          item.Normal,
                          item.Size,
                          item.Per_PackIng_Qty,
                          item.Net_Weight,
                          item.Tolerance,
                          item.Old_Item_Code,
                          item.Minimum,
                          item.Stock_Effect,
                          item.Cost,
                          item.Minimum_Order_Qty,
                          item.Storage_Location_ID,
                          item.Ramco_Code,
                          item.Service_Item,
                          item.Consumable_HSN,
                          item.Long_Desc,
                          item.SP_PTNO,
                          item.CUST_PTNO,
                          item.PALT_RATE,
                          item.UseQty_Alt,
                          item.REOALT_QTY,
                          item.Color_Value,
                          item.Party_Name_ID,
                          item.Refe_NO,
                          item.BOM_Import_Yes_No,
                          item.Import_Yes_No,
                          item.Not_allow_fifo_Inpackingtick,
                          item.Circumference_ID,
                          item.Film_Type_ID,
                          item.Liner_Type_ID,
                          item.Gauge_ID,
                          item.Width_ID,
                          item.Color_ID,
                          item.Denier_ID,
                          item.Single_Double_Up,
                          item.Handle,
                          item.Handle_Type,
                          item.Fabric_Type,
                          item.Film_ID,
                          item.Special_Remark,
                          item.Party,
                          item.No_of_colors,
                          item.mtr_per_wgt,
                          item.Film_Name_ID,
                          item.Fabric_Name_ID,
                          item.Per_Bag_wgt,
                          item.Metalize_Film,
                          item.userId,
                          item.Route
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
        </div>
        <h6 style={{ textAlign: "center" }}>Route Mapping</h6>
        <div className="row p-2 d-flex flex-row justify-content-center">
          <div className="col-12 justofy-content-center">
            <div style={{ height: "190px", overflowY: "auto" }}>
              <table className="table table-striped table-bordered">
                <thead class="sticky-top">
                  <tr>
                    <th style={{ width: "90px" }}>Route ID</th>
                    <th style={{ width: "120px" }}>
                      Route Name
                      {isSearchRouteType ? (
                        <div
                          className="search-input-container"
                          style={{
                            position: "absolute",
                            top: "0px",
                            // left:'0px',
                            backgroundColor: "white",
                          }}
                        >
                          <input
                            type="text"
                            value={searchRouteType}
                            style={{ width: "100px", height: '35px', fontSize: "" }}
                            placeholder="search Route Type"
                            onChange={(e) => HandlesearchRouteType(e.target.value)}
                          />
                          <span
                            className="clear-button"
                            onClick={toggleSearchRouteType}
                          >
                            <FaXmark />
                          </span>
                        </div>
                      )
                        : (
                          <span
                            className="search-icon-button"
                            style={{ marginLeft: "10px" }}
                          >
                            {/* <FaSistrix onClick={toggleSearchRouteType} /> */}
                          </span>
                        )}
                    </th>
                    <th style={{ width: "120px" }}>Route Type</th>
                    <th style={{ width: "120px" }}>IT Code</th>
                    <th>
                      IT Name
                      {isSearchIT_Name ? (
                        <div
                          className="search-input-container"
                          style={{
                            position: "absolute",
                            top: "0px",
                            backgroundColor: "white",
                          }}
                        >
                          <input
                            type="text"
                            value={searchIT_Name}
                            style={{ width: "180px", height: '35px', fontSize: "" }}
                            placeholder="search IT NAME"
                            onChange={(e) => HandlesearchIT_Name(e.target.value)}
                          />
                          <span
                            className="clear-button"
                            onClick={toggleSearchIT_Name}
                          >
                            <FaXmark />
                          </span>
                        </div>
                      )
                        : (
                          <span
                            className="search-icon-button"
                            style={{ marginLeft: "10px" }}
                          >
                            <FaSistrix onClick={toggleSearchIT_Name} />
                          </span>
                        )}
                    </th>
                    <th style={{ width: "120px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchIT_Name.length > 0 ? IT_NameResults.filter((item) => item.Route !== null)
                    .map((item, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "left" }}>
                          {/* <td>{item.routeId}</td> */}
                          {editedIndex === index ? (
                            <select
                              value={item.Route}
                              onChange={(e) => {
                                const newData = [...ItemMasterData];
                                newData[item?.index].Route = e.target.value;
                                setItemMasterData(newData);
                              }}
                              style={{
                                border: "none",
                                width: "85px",
                                height: "25px",
                                backgroundColor: "whitesmoke",
                              }}
                            >
                              <option hidden>Route ID</option>
                              {routeMasterData.map((item) => (
                                <option>{item.routeId}</option>
                              ))}
                            </select>
                          ) : (
                            <div>{item.Route}</div>
                          )}
                        </td>
                        <td>{getRouteTypeById(item.Route)}</td>
                        <td>{getRouteNameById(item.Route)}</td>

                        <td style={{ textAlign: "left" }}>
                          <div>{item.IT_CODE}</div>
                        </td>
                        <td>{item.IT_NAME}</td>
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
                                <FaXmark />
                              </button>
                            </>
                          ) : (
                            <span>
                              <button
                                // type="button"
                                // class="btn btn-primary"
                                // data-toggle="modal"
                                // data-target="#exampleModal"
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                                onClick={() => handleRoute(item.IT_CODE)}
                              >
                                <FaMinus />
                              </button>
                              {showpopup ? (
                                <div
                                  class="modal fade"
                                  id="exampleModal"
                                  tabindex="-1"
                                  role="dialog"
                                  aria-labelledby="exampleModalLabel"
                                  aria-hidden="true"
                                >
                                  <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                      <div class="modal-header">
                                        <h5
                                          class="modal-title"
                                          id="exampleModalLabel"
                                        >
                                          Modal title
                                        </h5>
                                        <button
                                          type="button"
                                          class="close"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          <span aria-hidden="true">
                                            &times;
                                          </span>
                                        </button>
                                      </div>
                                      <div class="modal-body">...</div>
                                      <div class="modal-footer">
                                        <button
                                          type="button"
                                          class="btn btn-secondary"
                                          data-dismiss="modal"
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="button"
                                          class="btn btn-primary"
                                        >
                                          Save changes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </span>
                          )}
                          &nbsp;&nbsp;
                          {editedIndex === index ? (
                            <>
                              <Tooltip
                                title="Delete"
                                arrow
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                                onClick={(e) => handleSave(e, item?.index)}
                              >
                                <FaCheck />
                              </Tooltip>
                            </>
                          ) : (
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                              onClick={() => handleEdit(index)}
                            >
                              <FaEdit />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                    )
                    : (searchRouteType.length > 0 ? RouteTypeResults.filter((item) => item.Route !== null)
                      .map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "left" }}>
                            {editedIndex === index ? (
                              <select
                                value={item.Route}
                                onChange={(e) => {
                                  const newData = [...ItemMasterData];
                                  newData[item?.index].Route = e.target.value;
                                  setItemMasterData(newData);
                                }}
                                style={{
                                  border: "none",
                                  width: "85px",
                                  height: "25px",
                                  backgroundColor: "whitesmoke",
                                }}
                              >
                                <option hidden>Route ID</option>
                                {routeMasterData.map((item) => (
                                  <option>{item.routeId}</option>
                                ))}
                              </select>
                            ) : (
                              <div>{item.Route}</div>
                            )}
                          </td>
                          <td>{getRouteTypeById(item.Route)}</td>
                          <td>{getRouteNameById(item.Route)}</td>
                          <td style={{ textAlign: "left" }}>
                            <div>{item.IT_CODE}</div>
                          </td>
                          <td>{item.IT_NAME}</td>
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
                                  <FaXmark />
                                </button>
                              </>
                            ) : (
                              <span>
                                <button
                                  // type="button"
                                  // class="btn btn-primary"
                                  // data-toggle="modal"
                                  // data-target="#exampleModal"
                                  style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() => handleRoute(item.IT_CODE)}
                                >
                                  <FaMinus />
                                </button>
                                {showpopup ? (
                                  <div
                                    class="modal fade"
                                    id="exampleModal"
                                    tabindex="-1"
                                    role="dialog"
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                  >
                                    <div class="modal-dialog" role="document">
                                      <div class="modal-content">
                                        <div class="modal-header">
                                          <h5
                                            class="modal-title"
                                            id="exampleModalLabel"
                                          >
                                            Modal title
                                          </h5>
                                          <button
                                            type="button"
                                            class="close"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                          >
                                            <span aria-hidden="true">
                                              &times;
                                            </span>
                                          </button>
                                        </div>
                                        <div class="modal-body">...</div>
                                        <div class="modal-footer">
                                          <button
                                            type="button"
                                            class="btn btn-secondary"
                                            data-dismiss="modal"
                                          >
                                            Close
                                          </button>
                                          <button
                                            type="button"
                                            class="btn btn-primary"
                                          >
                                            Save changes
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </span>
                            )}
                            &nbsp;&nbsp;
                            {editedIndex === index ? (
                              <>
                                <Tooltip
                                  title="Delete"
                                  arrow
                                  style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={(e) => handleSave(e, item?.index)}
                                >
                                  <FaCheck />
                                </Tooltip>
                              </>
                            ) : (
                              <button
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                                onClick={() => handleEdit(index)}
                              >
                                <FaEdit />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                      )
                      :
                      (
                        ItemMasterData.filter((item) => item.Route !== null).map(
                          (item, index) => (
                            <tr key={index}>
                              <td style={{ textAlign: "left" }}>
                                {/* <td>{item.routeId}</td> */}
                                {editedIndex === index ? (
                                  <select
                                    value={item.Route}
                                    onChange={(e) => {
                                      const newData = [...ItemMasterData];
                                      newData[item?.index].Route = e.target.value;
                                      setItemMasterData(newData);
                                    }}
                                    style={{
                                      border: "none",
                                      width: "85px",
                                      height: "25px",
                                      backgroundColor: "whitesmoke",
                                    }}
                                  >
                                    <option hidden>Route ID</option>
                                    {routeMasterData.map((item) => (
                                      <option>{item.routeId}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <div>{item.Route}</div>
                                )}
                              </td>
                              <td>{getRouteTypeById(item.Route)}</td>
                              <td>{getRouteNameById(item.Route)}</td>

                              <td style={{ textAlign: "left" }}>
                                <div>{item.IT_CODE}</div>
                              </td>
                              <td>{item.IT_NAME}</td>
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
                                      <FaXmark />
                                    </button>
                                  </>
                                ) : (
                                  <span>
                                    <button
                                      // type="button"
                                      // class="btn btn-primary"
                                      // data-toggle="modal"
                                      // data-target="#exampleModal"
                                      style={{
                                        border: "none",
                                        backgroundColor: "transparent",
                                      }}
                                      onClick={() => handleRoute(item.IT_CODE)}
                                    >
                                      <FaMinus />
                                    </button>
                                    {showpopup ? (
                                      <div
                                        class="modal fade"
                                        id="exampleModal"
                                        tabindex="-1"
                                        role="dialog"
                                        aria-labelledby="exampleModalLabel"
                                        aria-hidden="true"
                                      >
                                        <div class="modal-dialog" role="document">
                                          <div class="modal-content">
                                            <div class="modal-header">
                                              <h5
                                                class="modal-title"
                                                id="exampleModalLabel"
                                              >
                                                Modal title
                                              </h5>
                                              <button
                                                type="button"
                                                class="close"
                                                data-dismiss="modal"
                                                aria-label="Close"
                                              >
                                                <span aria-hidden="true">
                                                  &times;
                                                </span>
                                              </button>
                                            </div>
                                            <div class="modal-body">...</div>
                                            <div class="modal-footer">
                                              <button
                                                type="button"
                                                class="btn btn-secondary"
                                                data-dismiss="modal"
                                              >
                                                Close
                                              </button>
                                              <button
                                                type="button"
                                                class="btn btn-primary"
                                              >
                                                Save changes
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                )}
                                &nbsp;&nbsp;
                                {editedIndex === index ? (
                                  <>
                                    <Tooltip
                                      title="Delete"
                                      arrow
                                      style={{
                                        border: "none",
                                        backgroundColor: "transparent",
                                      }}
                                      onClick={(e) => handleSave(e, item?.index)}
                                    >
                                      <FaCheck />
                                    </Tooltip>
                                  </>
                                ) : (
                                  <button
                                    style={{
                                      border: "none",
                                      backgroundColor: "transparent",
                                    }}
                                    onClick={() => handleEdit(index)}
                                  >
                                    <FaEdit />
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        )
                      ))}
                  {droppedData
                    ? droppedData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.routeId}</td>
                        <td>{item.routeDescription}</td>
                        <td>{item.IT_CODE}</td>
                        <td>{item.IT_NAME}</td>
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
                            disabled
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))
                    : ""}
                </tbody>
              </table>
            </div>
            <div className="p-1">
              {showbuttons ? (
                <div>
                  <button
                    className="btn btn-success"
                    onClick={handleNewRowSubmit}
                  >
                    <FaCheck />
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-danger"
                    onClick={() => setDroppedData(false)}
                  >
                    <FaXmark />
                  </button>
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
                    onClick={() => setDroppedData(false)}
                  >
                    <FaXmark />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
        <div></div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default RouteMapping;
