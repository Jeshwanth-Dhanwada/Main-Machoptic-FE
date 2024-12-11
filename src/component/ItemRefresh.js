import React, { useState, useEffect, useContext } from "react";
import { FaXmark, FaCheck, FaMinus, FaSistrix } from "react-icons/fa6";
import { Form } from "react-bootstrap";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";

function ItemRefresh() {

    const { auth } = useContext(AuthContext)

    const [data, setData] = useState([]);
    const [items, setItems] = useState([]);
    const [ERPItems, setERPItems] = useState([]);
    const [routeMasterData, setrouteMasterData] = useState([]);
    const [fgdata, setFGMapping] = useState([]);
    const [inputData, setInputData] = useState([]);
    const [showPopup, setShowPopup] = useState(-1);
    const [rmType, setRMType] = useState();
    const [rmList, setRMList] = useState([]);

    // Fetch Nodemaster -----------------
    useEffect(() => {
        // Fetch data from the API when the component mounts
        const apiUrl = `${BASE_URL}/api/nodeMaster`;
        axios
            .get(apiUrl)
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
            .get(apiUrl)
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
            .get(apiUrl)
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
            .get(apiUrl)
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
            .get(apiUrl)
            .then((response) => {
                console.log("&&&", response.data);
                setERPItems(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Fetch routeMaster data
    useEffect(() => {
        const apiUrl = `${BASE_URL}/api/routeMaster`;
        axios
            .get(apiUrl)
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
    }, [ERPItems, items]);

    const CancelSubmit = () => {
        setInputData([]);
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
        console.log(updatedInputData)
        setInputData(updatedInputData);
    };
    const HandleWastePercentage = (event, item ,index) => {

        const updateInputData = [...inputData];
        updateInputData[index] = {
            ...updateInputData[index],
            percentageWaste:event.target.value,
        }
        setInputData(updateInputData);

    }
    console.log(inputData,"input")
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
            console.log(singleRowSubmit,"filter")
            const filledRows = inputData.filter(
                (item) =>
                    item?.NodeId !== "" ||
                    item?.ItemType !== "" ||
                    (item?.ItemType === "Finished Goods"
                        ? item?.itemMapping !== "" || item?.Route !== ""
                        : false)
            );
            console.log("input")
            if (filledRows.length === 0) {
                toast.error(<span>Please fill at least one detail</span>);
                return;
            }

            //     updatedData = filledRows.map((item) => {
            //         const { itemMapping, DateTime, NodeId, ...newObject } = item;
            //         const splitdata = NodeId.split("-")[0];
            //         return { ...newObject, NodeId: splitdata };
            //     });
            // } else {
            //     const { itemMapping, DateTime, NodeId, ...newObject } = inputData[index];
            //     const splitdata = NodeId.split("-")[0];
            //     updatedData = [{ ...newObject, NodeId: splitdata }];
            // }
            updatedData = filledRows.map((item) => {
                const { itemMapping, DateTime, NodeId, Per_Bag_wgt, mtr_per_wgt, ...newObject } = item;
                const splitdata = NodeId.split("-")[0];
                // return { ...newObject, NodeId: splitdata };
                const perBagWeightString = Per_Bag_wgt.toString();
                const mtrPerWeight = mtr_per_wgt ? mtr_per_wgt.toString() : ''
                return { ...newObject, NodeId: splitdata, Per_Bag_wgt: perBagWeightString, mtr_per_wgt: mtrPerWeight};
            });
            
        } else {
            console.log(inputData,"filter") 
            const { itemMapping, DateTime, NodeId, Per_Bag_wgt, mtr_per_wgt, ...newObject } = inputData[index];
            const splitdata = NodeId.split("-")[0];
            // updatedData = [{ ...newObject, NodeId: splitdata }];
            const perBagWeightString = Per_Bag_wgt.toString();
            const mtrPerWeight = mtr_per_wgt ? mtr_per_wgt.toString() : ''
            updatedData = [{ ...newObject, NodeId: splitdata, Per_Bag_wgt: perBagWeightString, mtr_per_wgt: mtrPerWeight}];
        }
        const payload = {
            itemmaster: updatedData,
        };
        console.log(payload,"itempayload")
        axios
            .put(`${BASE_URL}/api/itemmaster/bulk`, payload)
            .then((res) => {
                console.log(res);
                setInputData([]);
            })
            .catch((err) => {
                console.log(err, "Error");
                toast.error(
                <span><strong>User</strong> is not authorized fot this action.</span>,
                {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
                    className: 'custom-toast' // Optional: Add custom CSS class
                  }
            );
            });

        const fgItems = inputData.filter(
            (item) => item?.ItemType === "Finished Goods" && item?.NodeId && item?.Route
        );
        if (fgItems?.length > 0) {
            const updatedfg = fgItems.map((item) => {
                const rmDetail = item?.itemMapping?.map((item1) => {
                    return {
                        nodeIdFG: item.IT_CODE.toString(),
                        nodeIdRM: item1.IT_CODE.toString(),
                        branchId: "1001",
                        userId: "1111",
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
                .put(`${BASE_URL}/api/mapping/bulk`, fgPayLoad)
                .then((res) => {
                    console.log(res);
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
                })
                .catch((err) => {
                    console.log(err, "Error");
                    toast.error(
                    <span><strong>User</strong> is not authorized fot this action.</span>,
                    {
                        position: toast.POSITION.BOTTOM_RIGHT, // Set position to top center
                        // autoClose: 3000, // Optional: Set auto close time in milliseconds
                        // closeButton: false, // Optional: Hide close button
                        className: 'custom-toast' // Optional: Add custom CSS class
                      }
                );
                });
        } else {
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
        setInputData([]);
        }
        return;
    };
    return (
        <div>
            {showPopup === -1 && (
                <>
                    <div className="d-flex col-lg-12 col-md-8 col-sm-12 pt-3 justify-content-center">
                        <table
                            class="table-bordered tablestriped"
                            cellPadding={5}
                            cellSpacing={5}
                        >
                            <thead>
                                <tr>
                                    <th>Item Code</th>
                                    <th>Item Name </th>
                                    <th>Item Type</th>
                                    <th style={{width:'100px'}}>% Waste</th>
                                    <th>Node Id</th>
                                    <th>Routes</th>
                                    <th>Item Mapping</th>
                                    <th></th>
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
                                            <input type="number" className="form-control" 
                                                disabled={item?.ItemType !== "Finished Goods"}
                                                onChange={(event) => HandleWastePercentage(event, item, index)}
                                                value={item.percentageWaste}
                                                />
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
                    <div className="d-flex col-lg-12 col-md-8 col-sm-12 pt-3 justify-content-center" style={{height:'450px',overflow:'hidden'}}>
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
    );
}
export default ItemRefresh;