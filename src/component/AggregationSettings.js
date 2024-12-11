
import React, { useState, useEffect, useRef } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { BASE_URL } from "../constants/apiConstants";
import axios from "axios";
// import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './nodes-styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ColorPicker } from 'primereact/colorpicker';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import Button from '@mui/material/Button';
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Tooltip } from '@mui/material'
import { generateJSONDataForNodes } from '../utilities/generateJSONDataForNodes';
import { fetchTableData, saveNodes } from '../api/allsolutiions';
import { buildTree, convertArrayToObject, convertTreeToNodes, convertTreeToEdges } from '../utilities/buildTree';
import { FaFilter } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { GrAggregate } from "react-icons/gr";
import { PiClockUserFill } from "react-icons/pi";
import styles from "./styles.module.css";
import { Accordion, AccordionItem as Item, useAccordionItem } from '@szhsin/react-accordion';
import chevronDown from "./chevron-down.svg";
import { Table } from 'react-bootstrap';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import MuiAlert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import FormLabel from '@mui/material/FormLabel';
import { ConstructionOutlined } from '@mui/icons-material';
// import { saveNodes } from './api/allsolutiions';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AggregationProperties = ({ node, calculateLeafNodesValues, nodes, setNodes, setTree }) => {

    const [selectedColumn, setSelectedColumn] = useState(node?.datacolumn);
    const [showdata, setshowdata] = useState(node?.checkFlag);
    const [shiftValue, setShiftValue] = useState('');
    const [expanded, setExpanded] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [tableDetailsData, setTableDetailsData] = useState([]);
    const [shiftIds, setSHiftIDs] = useState([]);
    const [aggregateValue, setAggregateValue] = useState([]);
    const [filteredShiftData, setfilteredShiftData] = useState([]);
    const [calculatedvalue, setCalculatedvalue] = useState([]);
    const [data, setData] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [nodeId, setNodeId] = useState(node?.nodeId);


    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleOpenSnackbar = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const inputFieldsize = "10"
    const labelFieldsize = "10"

    const getTableDetails = async () => {
        if (node?.datatable) {
            const TablesData = await fetchTableData(node?.datatable)
            setTableDetailsData(TablesData.data)
        }
    }
    useEffect(() => {
        getTableDetails();
    }, []);

    const handleCalculate = async (aggregateValue) => {
        const result = calculateaggregateData(filteredShiftData, aggregateValue);
        console.log("result:", result)
        setCalculatedvalue(result)
    }

    const handleSaveNodes = async () => {
        const updatedNode = {
            ...node,
            // checkFlag: showdata,
            dateselected: selectedDate,
            shiftid: shiftValue,
            aggregatedvalue: String(calculatedvalue.toFixed(2)),
        };
        setData([updatedNode])
        // console.log("values:", updatedNode)
        const updatedNodes = nodes.map((n) => (n.id === node.id ? updatedNode : n));
        console.log("updatedNodes", updatedNodes)
        const getNodes = await saveNodes(generateJSONDataForNodes(updatedNodes))
        updatedNodesToShow(getNodes)
        handleOpenSnackbar('Data saved successfully!');
        // window.location.reload();
    }

    const updatedNodesToShow = (data) => {
        let initialTree = buildTree(data)
        // console.log("initialTree:",initialTree)
        calculateLeafNodesValues(initialTree)
        setTree(initialTree);
        const Convertednodes = convertTreeToNodes(convertArrayToObject(initialTree)); // Convert tree to nodes
        // const edges = convertTreeToEdges(convertArrayToObject(initialTree)); // Convert tree to edges
        setNodes(Convertednodes); // Set nodes in the state for ReactFlow
        // setEdges(edges); // Set edges in the state for ReactFlow
        // console.log(Convertednodes)
    }

    const handleCancel = () => {
        // setFontSize(`${node?.style?.fontSize}` || '12');
        // setLabelval(node.nodeName
        //     ? node.nodeName
        //     : node.data?.label?.props?.children?.[0]?.props?.children?.[0]);
        // setHeightval(node.style.height);
        // setWidthval(node.width);
        // setBorderRadiusValue(node.style.borderRadius);
        // setFontFamilyValue(node.style.fontStyle);
        // setFontColorValue(node.style.color);
        // setConstantValue(node.constant);
        // setValue(node.value);
        // setTextColor("");
        // setDisplayColorPicker(false);
        // setDisplayTextColorPicker(false);
    };

    const getShifts = (selectDate) => {
        const filteredData = tableDetailsData.filter((row) => {
            const rowDate = new Date(row.date);
            const selectedDateObj = new Date(selectDate);
            return rowDate.toDateString() === selectedDateObj.toDateString();
        });
        setfilteredShiftData(filteredData); // the filtered data array
        const distinctShiftIds = [...new Set(filteredData.map((row) => row.Shift))];
        setSHiftIDs(distinctShiftIds)
    }

    const AggregationOptions = [
        "SUM",
        "AVERAGE",
        "MINIMUM",
        "MAXIMUM",
        "COUNT",
        "DISTINCT",
        "ORDER BY(Ascending)",
        "ORDER BY(Descending)"
    ];

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // console.log(nodes)
    const handleUpdateCheckFlag = async (checkFlag) => {
        try {

            const response = await axios.put(`http://localhost:5001/api/nodeMaster/${nodeId}/checkFlag`,
                {
                    checkFlag,
                }
            );
            console.log('CheckFlag updated:', response.data);
            handleOpenSnackbar(`${checkFlag ? "Successfully applied Value Data" : "Successfully applied Aggregated Data"}!`);
        } catch (error) {
            console.error('Error updating checkFlag:', error, checkFlag);
            alert('Error updating checkFlag');
        }
    };

    const calculateaggregateData = (filteredData, selectedAggregateOption) => {
        switch (selectedAggregateOption) {
            case "SUM":
                return filteredData.reduce((acc, row) => acc + Number(row[selectedColumn]), 0);
            case "AVERAGE":
                return filteredData.reduce((acc, row) => acc + Number(row[selectedColumn]), 0) / filteredData.length;
            case "MINIMUM":
                return Math.min(...filteredData.map((row) => Number(row[selectedColumn])));
            case "MAXIMUM":
                return Math.max(...filteredData.map((row) => Number(row[selectedColumn])));
            case "COUNT":
                return filteredData.length;
            case "DISTINCT":
                return [...new Set(filteredData.map((row) => row[selectedColumn]))];
            // case "ORDER BY(Ascending)":
            //     return filteredData.sort((a, b) => a.value - b.value);
            // case "ORDER BY(Descending)":
            //     return filteredData.sort((a, b) => b.value - a.value);
            default:
                return null;
        }
    };

    console.log("node:", node);

    return (
        <div className="container-fluid">
            {node && (<div className="row">
                <div className="col-5">
                    <Accordion>
                        <Item
                            className={styles.item}
                            header={
                                <>
                                    {"Filters"} <FaFilter style={{ marginLeft: "4px" }} />
                                    <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
                                </>
                            } buttonProps={{
                                className: ({ isEnter }) =>
                                    `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
                            }} initialEntered onToggle={() => setExpanded(!expanded)}>

                            <div className="row">
                                <div className="col-5">

                                    <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                                        <MdDateRange style={{ marginRight: '5px', display: 'inline-block' }} />
                                        Date
                                    </Form.Label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            handleDateChange(e.target.value)
                                            getShifts(e.target.value)
                                        }}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-5">
                                    <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>

                                        <PiClockUserFill style={{ marginRight: '5px', display: 'inline-block' }} />
                                        Shift
                                    </Form.Label>
                                    <select
                                        value={shiftValue} onChange={(e) => setShiftValue(e.target.value)}
                                        className="form-select"
                                    >
                                        <option>Select Shift</option>
                                        {shiftIds.map((shiftid, index) => (
                                            <option key={index} value={shiftid}>
                                                {shiftid}
                                            </option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-5">
                                    <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                                        <GrAggregate style={{ marginRight: '5px', display: 'inline-block' }} />
                                        Aggregation
                                    </Form.Label>
                                    <select
                                        value={aggregateValue} onChange={(e) => {
                                            setAggregateValue(e.target.value)
                                            handleCalculate(e.target.value)
                                        }}
                                        className="form-select"
                                    >
                                        <option>Select Aggregation Type</option>
                                        {AggregationOptions.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>
                            <div className="row mt-2">
                                <div as={Row} className="m-3 text-size justify-content-end" controlId="labelControl" arrow>
                                    <Tooltip title="Apply" placement="bottom">
                                        <Button style={{ minWidth: "40px", minHeight: "30px" }} variant='contained' color='success' onClick={handleSaveNodes} ><FaCheck /></Button>
                                    </Tooltip>
                                    <Tooltip title="Cancel" placement="bottom">
                                        <Button style={{ marginLeft: '10px', minWidth: "40px", minHeight: "30px" }} variant='contained' color='error' onClick={handleCancel} ><FaXmark /></Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </Item>
                    </Accordion>
                </div>
                <div className="col-2">
                    <div className="aggregate-container">
                        <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                            {/* <GrAggregate style={{ marginRight: '5px', display: 'inline-block' }} /> */}
                            Select Option to Show Data
                        </Form.Label>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel
                                value={showdata}
                                control={<Radio />}
                                onChange={(e) => {
                                    setshowdata(true);
                                    handleUpdateCheckFlag(true);  // Call API with true
                                }}
                                checked={showdata}
                                label="Value"
                            />
                            <FormControlLabel
                                value={!showdata}
                                control={<Radio />}
                                onChange={(e) => {
                                    setshowdata(false);
                                    handleUpdateCheckFlag(false);  // Call API with false
                                }}
                                checked={!showdata}
                                label="Aggregate Value"
                            />
                        </RadioGroup>
                    </div>
                </div>

                <div className="col-md-3 col-3">
                    <div className="aggregation-container">
                        <Table striped bordered hover style={{ width: '200px', height: '' }}>
                            <thead>
                                <tr>
                                    <th style={{ minWidth: '150px' }}>Date</th>
                                    <th style={{ minWidth: '100px' }}>Shift</th>
                                    <th style={{ minWidth: '100px' }}>Node ID</th>
                                    <th style={{ minWidth: '150px' }}>Aggregate Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ minWidth: '150px' }}>{row.dateselected}</td>
                                        <td style={{ minWidth: '100px' }}>{row.shiftid}</td>
                                        <td style={{ minWidth: '100px' }}>{row.nodeId}</td>
                                        <td style={{ minWidth: '150px' }}>{row.aggregatedvalue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>)}
            {!node && (
                <div className="row">
                    <div className="col-6">
                        <Alert severity="info">
                            No node value available. Please select a node to configure.
                        </Alert>
                    </div>
                </div>
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  // Position at bottom-right
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>

    );
};

export default AggregationProperties;

