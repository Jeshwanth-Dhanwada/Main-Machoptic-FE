import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaXmark, FaCheck, FaMinus, FaSistrix } from "react-icons/fa6";
import "./sidebar.css"
import { FaEdit } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from "react-bootstrap";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from "../context/AuthProvider";
import Select from 'react-select';

function RMFabricUpload() {

    const { auth } = useContext(AuthContext)
    //const sourceData = ['SSSPP', 'KI', 'SI', 'MULTI'];
    const [inputSourceData, setInputSourceData] = useState([]);
    const [inputsData, setInputsData] = useState([]);
    const [showForm1, setShowForm1] = useState(true);
    const [showForm2, setShowForm2] = useState(false);
    const [itemMaster, setitemMaster] = useState([]);

    // Item Master ------
    useEffect(() => {
        // Fetch data from the API when the component mounts
        const apiUrl = `${BASE_URL}/api/itemmaster`;
        axios
            .get(apiUrl)
            .then((response) => {
                // console.log(response.data);
                setitemMaster(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleRollsChange = (e) => {
        const tempData = [...inputSourceData];
        tempData[0] = {
            ...tempData[0],
            rolls: e.target.value,
        }
        setInputSourceData(tempData);
    };

    const handleCancelClick = () => {
        setInputSourceData([]);
    }

    const HandleDate = (e) => {
        const tempData = [...inputSourceData];
        tempData[0] = {
            ...tempData[0],
            date: e.target.value,
        }
        setInputSourceData(tempData);
    };

    const handleSourceId = (e) => {
        const tempData = [...inputSourceData];
        tempData[0] = {
            ...tempData[0],
            sourceId: e.target.value,
        }
        setInputSourceData(tempData);
    };

    const getFormattedToday = (date) => {
        const formatDate = date.split('-');
        return `${formatDate[2]}${formatDate[1]}${formatDate[0].slice(-2)}`;
    };

    const handleSubmitRolls = () => {
        setShowForm1(false);
        const inputs = [];
        inputSourceData.forEach((item, index) => {
            const rollsCount = parseInt(item.rolls);
            if (rollsCount) {
                for (let i = 0; i < rollsCount; i++) {
                    const inputObj = {
                        date: item.date, // You can set the date dynamically
                        rollId: item.sourceId === "SSSPP" ? item.sourceId + getFormattedToday(item?.date) + "-" + (i + 1) : "",
                        itemName: "",
                        itemCode: "",
                        meter: "",
                        weight: "",
                        wPerm: "",
                    };
                    inputs.push(inputObj);
                }
            }
        });
        setInputsData(inputs);
    };

    return (
        <>
            {showForm1 && (
                <div className="d-flex mt-2 container-fluid justify-content-center">
                    <div className="row">
                        <div className="col-12 mt-3">
                            <table className="table table-bordered tablestriped">
                                <thead>
                                    <tr>
                                        <th>Source</th>
                                        <th style={{ width: '100px' }}>Date</th>
                                        <th>No. of Rolls</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ width: '100px' }}>
                                        <Form.Select
                                            className="form-control mt-1"
                                            id="source"
                                            name="source"
                                            onChange={(e) => handleSourceId(e)}
                                            value={inputSourceData[0]?.sourceId}
                                            style={{ width: '150px' }}
                                            required
                                        >
                                            <option value="" hidden>Please Select</option>
                                            <option value="SSSPP">SSSPP</option>
                                            <option value="KI">KI</option>
                                            <option value="SI">SI</option>
                                            <option value="MULTI">MULTI</option>
                                        </Form.Select>
                                        <td>
                                            <input
                                                type="date"
                                                name="date"
                                                className="form-control mt-1"
                                                value={inputSourceData[0]?.date?.split("T")[0]}
                                                onChange={(e) => HandleDate(e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                id="rolls"
                                                name="rolls"
                                                className="form-control"
                                                value={inputSourceData[0]?.rolls}
                                                onChange={(e) => handleRollsChange(e)}
                                                required
                                            />
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                            <button 
                                className="btn btn-success" 
                                onClick={handleSubmitRolls}
                                style={{backgroundColor:'#034661',color:'#ffffff'}}
                                >
                                {/* <FaCheck /> */}Add
                            </button> &nbsp;
                            <button 
                                className="btn btn-danger" 
                                onClick={handleCancelClick}
                                style={{backgroundColor:'#ffffff',color:'#034661',border:'1px solid #034661'}}
                                >
                                {/* <FaXmark /> */}Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!showForm1 && <FabricUpload
                inputsData={inputsData}
                setInputsData={setInputsData}
                showForm1={showForm1}
                setShowForm1={setShowForm1}
                itemMaster={itemMaster}
                setInputSourceData={setInputSourceData}
                showForm2={showForm2}
                setShowForm2={setShowForm2} />}
            <ToastContainer />
        </>
    );
}


const FabricUpload = (props) => {

    const { showForm1, inputsData, setInputsData, itemMaster, setShowForm1, setInputSourceData, showForm2, setShowForm2 } = props;

    const getItemCode = (itemName) => {
        const itemCode = itemMaster.filter((item) => item?.IT_NAME == itemName)[0]?.IT_CODE;
        return itemCode;
    };

    const handleMeterChange = (e, index) => {
        const tempData = [...inputsData];
        tempData[index]['meter'] = e.target.value;
        setInputsData(tempData);
        if (tempData[index]['meter']?.length && tempData[index]['weight']?.length) {
            getWeightPerMeter(index)
        }
    };

    const handleWeightChange = (e, index) => {
        const tempData = [...inputsData];
        tempData[index]['weight'] = e.target.value;
        setInputsData(tempData);
        if (tempData[index]['meter']?.length && tempData[index]['weight']?.length) {
            getWeightPerMeter(index)
        }
    };

    const getWeightPerMeter = (index) => {
        const tempData = [...inputsData];
        tempData[index]['wPerm'] = (+tempData[index]['weight'] * 1000 / +tempData[index]['meter']).toFixed(2);
        setInputsData(tempData);
    };

    const handleRollIdChange = (e, index) => {
        const tempData = [...inputsData];
        tempData[index]['rollId'] = e.target.value;
        setInputsData(tempData);
    };

    const handleItemNameChange = (e, index) => {
        const itemName = e.value;
        const tempData = [...inputsData];
        tempData[index]['itemName'] = itemName;
        tempData[index]['itemCode'] = getItemCode(itemName);
        setInputsData(tempData);
    };

    const getFormattedToday = (date) => {
        const formatDate = date.split('-');
        return `${formatDate[2]}-${formatDate[1]}-${formatDate[0]}`;
    };

    const handleCancelClick = () => {
        setInputsData([]);
        setShowForm1(true);
    };

    const checkValidation = () => {
        return inputsData.every(obj => Object.values(obj).every(value => value));
    };

    const handleCheckClick = () => {
        const validation = checkValidation();
        if (!validation) {
            toast.error('Please fill all details');
            return;
        }
        setShowForm2(true);
    };

    const getOptions = () => {
        const options = [];

        itemMaster.forEach((item, index) => {
            options.push({ value: item?.IT_NAME, label: item?.IT_NAME })
        })
        return options;
    }

    // const createBatchMasterData = async () => {
    //     const payload = [];

    //     inputsData.forEach((item) => {
    //         payload.push({
    //             branchId: '1001',
    //             activityId: inputsData?.rollId,
    //             nodeId: '8',
    //             producedQty1: inputsData?.meter,
    //             consumedQty1: 0,
    //             balanceQty1: inputsData?.meter,
    //             units1: "1",//quantity.units1, need to be changed
    //             producedQty2: inputsData?.weight,
    //             consumedQty2: 0,
    //             balanceQty2: inputsData?.weight,
    //             units2: "2",//quantity.units2,
    //             lastConsumedAt: null,
    //             conversionRate: inputsData?.wPerm,
    //             userId: '',
    //         })
    //     })

    //     const inputPayLoad = {
    //         newBatch: payload
    //     }

    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${auth.accessToken}`,
    //     }
    //     try {
    //         // Use async/await to wait for each request to complete
    //         const response = await axios.put(`${BASE_URL}/api/batchMaster`, inputPayLoad, { headers });
    //         setInputsData([]);
    //         setShowForm1(true);
    //         setInputSourceData([]);
    //         toast.success(<p><strong>Data Saved</strong> Successfully.</p>);
    //     } catch (error) {
    //         console.log('Error while submitting the Data', error);
    //         console.log('Error while submitting for row', error);
    //         return;
    //         // You can choose to handle errors as needed
    //     }
    // };

    return (
        <>
            {!showForm1 && !showForm2 && (
                <div className="d-flex container-fluid justify-content-center">
                    <div className="row">
                        <div className="col-12 mt-5">
                            <table className="m-2 table table-bordered tablestriped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Roll ID</th>
                                        <th>Item Name</th>
                                        <th>Item Code</th>
                                        <th>Meter</th>
                                        <th>Weight</th>
                                        <th>Weight/Meter</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inputsData?.map((item, index) =>
                                        <tr key={index}>
                                            <td>{getFormattedToday(item?.date)}</td>
                                            <td>{item?.rollId.includes('SSSPP') ? item?.rollId :
                                                <input
                                                    type="text"
                                                    id="sourceId"
                                                    name="sourceId"
                                                    className="form-control"
                                                    value={item?.rollId}
                                                    onChange={(e) => handleRollIdChange(e, index)}
                                                    required
                                                />}</td>
                                            <td style={{ width: '180px' }}>
                                                <Select options={getOptions()} onChange={(e) => handleItemNameChange(e, index)} />
                                            </td>
                                            <td>{item?.itemCode}</td>
                                            <td><input
                                                type="text"
                                                id="itemName"
                                                name="itemName"
                                                className="form-control"
                                                value={item?.meter}
                                                onChange={(e) => handleMeterChange(e, index)}
                                                required
                                            /></td>
                                            <td><input
                                                type="text"
                                                id="itemName"
                                                name="itemName"
                                                className="form-control"
                                                value={item?.weight}
                                                onChange={(e) => handleWeightChange(e, index)}
                                                required
                                            /></td>
                                            <td>{item?.wPerm}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-end">
                                <button 
                                        className="btn btn-success" 
                                        onClick={handleCheckClick} 
                                        style={{backgroundColor:'#034661',color:'#ffffff'}}>
                                    {/* <FaCheck /> */}Add
                                    </button> &nbsp;
                                <button 
                                        className="btn btn-danger" 
                                        onClick={handleCancelClick}
                                        style={{backgroundColor:'#ffffff',color:'#034661',border:'1px solid #034661'}}>

                                    {/* <FaXmark /> */}Cancel
                                    </button>
                            </div>
                        </div>
                    </div>
                </div>)}
            {showForm2 && <ShowFabricDetails inputsData={inputsData} setInputsData={setInputsData} setInputSourceData={setInputSourceData} setShowForm2={setShowForm2} setShowForm1={setShowForm1} />}
        </>
    );
};

const ShowFabricDetails = ({ inputsData, setInputsData, setInputSourceData, setShowForm2, setShowForm1 }) => {

    const { auth } = useContext(AuthContext)

    const handleBackClick = () => {
        setShowForm2(false);
    };

    const getFormattedToday = (date) => {
        const formatDate = date.split('-');
        return `${formatDate[2]}-${formatDate[1]}-${formatDate[0]}`;
    };


    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            const payLoad = [];
            inputsData.forEach((item) => {
                payLoad.push({
                    date: item?.date,
                    activityId: item?.rollId,
                    ItemCode: item?.itemCode,
                    MaterialId: '60',
                    Availablequantity1: item?.meter,
                    Balancequantity1: item?.meter,
                    Availablequantity2: item?.weight,
                    Balancequantity2: item?.weight,
                })
            })

            const inputPayLoad = {
                newBatch: payLoad
            }

            const response = await axios.put(`${BASE_URL}/api/batch/bulk`, inputPayLoad);
            //createBatchMasterData();
            setInputsData([]);
            setShowForm1(true);
            setShowForm2(false);
            setInputSourceData([]);
            toast.success(<p><strong>Data Saved</strong> Successfully.</p>);
            console.log(response);
            console.log('Data saved Successfully');
            return;

        } catch (error) {
            console.log('Error while submitting the Data', error);
            toast.error('Error while submitting the Data');
            return;
        }
    };
    return (<>
        <div className="d-flex container-fluid justify-content-center">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-success" onClick={handleSubmitData}><FaCheck /></button> &nbsp;
                        <button className="btn btn-primary" onClick={handleBackClick}>Go Back</button>
                    </div>
                    <table className="m-2 table table-bordered tablestriped">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Roll ID</th>
                                <th>Item Name</th>
                                <th>Item Code</th>
                                <th>Meter</th>
                                <th>Weight</th>
                                <th>Weight/Meter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inputsData?.map((item, index) =>
                                <tr key={index}>
                                    <td>{getFormattedToday(item?.date)}</td>
                                    <td>{item?.rollId}</td>
                                    <td>{item?.itemName}</td>
                                    <td>{item?.itemCode}</td>
                                    <td>{item?.meter}</td>
                                    <td>{item?.weight}</td>
                                    <td>{item?.wPerm}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>)
    </>);

};

export default RMFabricUpload;