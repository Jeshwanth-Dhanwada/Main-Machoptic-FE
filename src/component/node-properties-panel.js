
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
import { saveNodes } from '../api/allsolutiions';
import { buildTree, convertArrayToObject, convertTreeToNodes, convertTreeToEdges } from '../utilities/buildTree';
import { MdOutlineLabel } from "react-icons/md";
import { MdOutlineHeight } from "react-icons/md";
import { RiExpandWidthFill } from "react-icons/ri";
import { AiOutlineRadiusSetting } from "react-icons/ai";
import { RxFontFamily } from "react-icons/rx";
import { BiFontSize } from "react-icons/bi";
import { FaTable } from "react-icons/fa";
import { FaColumns } from "react-icons/fa";
import styles from "./styles.module.css";
import { Accordion, AccordionItem as Item, useAccordionItem } from '@szhsin/react-accordion';
import chevronDown from "./chevron-down.svg";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
// import { saveNodes } from './api/allsolutiions';

const MindMapNodePropertiess = ({ node, nodes, setNodes, setEdges, calculateLeafNodesValues, setTree, tablenames, onClose, }) => {
    const [show, setShow] = useState(true);
    const [labelval, setLabelval] = useState(node.nodeName
        ? node.nodeName
        : node.data.label.props?.children?.props?.children[0]); // controlled input
    const [heightval, setHeightval] = useState(node.style?.height || '');
    const [widthval, setWidthval] = useState(node.style?.width || '');
    const [borderRadiusval, setBorderRadiusValue] = useState(node.style.borderRadius);
    const [fontFamilyValue, setFontFamilyValue] = useState(node.style?.FontFamily || '');
    const [fontColor, setFontColorValue] = useState(node.style?.color || '#000000');
    const [fontSize, setFontSize] = useState(node.style?.fontSize || "6px");
    const [constant, setConstantValue] = useState(node?.constant);
    const [value, setValue] = useState(Number(node?.value));
    const [selectedTable, setSelectedTable] = useState(node?.datatable)
    const [selectedColumn, setSelectedColumn] = useState(node?.datacolumn)
    const sketchPickerRef = useRef(null);
    const [showSketchPicker, setShowSketchPicker] = useState(false);
    const [disableConstant, setDisableConstant] = useState();
    const [disableValue, setDisableValue] = useState();
    const [disableTable, setDisableTable] = useState();
    const [disableColumn, setDisableColumn] = useState();
    const [key, setKey] = useState('home');
    const [expanded, setExpanded] = useState(true);
    const [expandedData, setDataExpanded] = useState(true);
    const [showdata, setshowdata] = useState(true);
    // const [selectedTable, setSelectedTable] = useState('');
    // const [selectedColumn, setSelectedColumn] = useState('');
    const [columns, setColumns] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // const { ref } = useAccordionItem();
    // const [fontcolor, setColorHEX] = useState('6466f1');
    const handleClose = () => {
        setShow(false);
        onClose();
    };
    const inputFieldsize = "6"
    const labelFieldsize = "6"

    const handleLabelChange = (event) => setLabelval(event.target.value);
    const handleHeightChange = (event) => setHeightval(event.target.value);
    const handleWidthChange = (event) => setWidthval(event.target.value);
    const handleBorderRadiusChange = (event) => setBorderRadiusValue(event.target.value);
    const handleConstantChange = (event) => { setConstantValue(event.target.value); };
    const handleValueChange = (event) => {
        console.log("value:", event.target.value)
        setValue(event.target.value);
    };
    const handleClick = (event) => {
        event.preventDefault();
        setShowSketchPicker(true);
    };
    const handleSketchPickerClose = () => { setShowSketchPicker(false); };
    useEffect(() => {
        const nodedata = nodes.find((n) => n.id === node.id);
        if (nodedata) {
            // eslint-disable-next-line no-mixed-operators
            if (nodedata && nodedata.parent === "" || null) {
                setDisableConstant(false)
                setDisableValue(false)
                setDisableTable(false)
                setDisableColumn(false)
            }
            else if (nodedata && nodedata.childLength == 0) {
                setDisableConstant(true)
                setDisableValue(true)
                setDisableTable(true)
                setDisableColumn(true)
            }
            else {
                setDisableConstant(true)
                setDisableValue(false)
                setDisableColumn(false)
                setDisableTable(false)
            }
        }
    }, [node, nodes])


    const updatedNodesToShow = (data) => {
        let initialTree = buildTree(data)
        // console.log("initialTree:",initialTree)
        calculateLeafNodesValues(initialTree)
        setTree(initialTree);
        const Convertednodes = convertTreeToNodes(convertArrayToObject(initialTree)); // Convert tree to nodes
        const edges = convertTreeToEdges(convertArrayToObject(initialTree)); // Convert tree to edges
        setNodes(Convertednodes); // Set nodes in the state for ReactFlow
        setEdges(edges); // Set edges in the state for ReactFlow
    }
    useEffect(() => {
        if (selectedTable) {
          const fetchColumns = () => {
            const apiUrl = `${BASE_URL}/api/datasettings/getTableColumns/${selectedTable}`;
            return new Promise((resolve, reject) => {
              axios.post(apiUrl)
                .then((response) => {
                  setColumns([])
                  resolve(response.data)
                  setColumns(response.data.columns);
                })
                .catch((error) => {
                  console.log(error, "Error ");
                  reject(error)
                });
            })
          };
          fetchColumns();
        }
      }, [selectedTable])

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };
    const handleSaveNodes = async () => {
        const updatedNode = {
            ...node,
            nodeName: labelval,
            height: heightval,
            width: widthval,
            style: {
                ...node.style,
                borderRadius: borderRadiusval,
                fontSize: fontSize,
                fontStyle: fontFamilyValue,
                color: fontColor,
            },
            constant: constant,
            value: Number(value),
            datatable: selectedTable,
            datacolumn: selectedColumn,
            checkFlag: showdata,
        };

        const updatedNodes = nodes.map((n) => (n.id === node.id ? updatedNode : n));
        const getNodes = await saveNodes(generateJSONDataForNodes(updatedNodes))
        console.log("values:", getNodes)
        updatedNodesToShow(getNodes)
        setOpenSnackbar(true)
        // window.location.reload();
    }

    const handleCancel = () => {
        setFontSize(`${node?.style?.fontSize}` || '12');
        setLabelval(node.nodeName
            ? node.nodeName
            : node.data?.label?.props?.children?.[0]?.props?.children?.[0]);
        setHeightval(node.style.height);
        setWidthval(node.width);
        setBorderRadiusValue(node.style.borderRadius);
        setFontFamilyValue(node.style.fontStyle);
        setFontColorValue(node.style.color);
        setConstantValue(node.constant);
        setValue(node.value);
        // setTextColor("");
        // setDisplayColorPicker(false);
        // setDisplayTextColorPicker(false);
    };
    const fontFamilies = [
        'Arial',
        'Calibri',
        'Cambria',
        'Courier New',
        'Georgia',
        'Helvetica',
        'Tahoma',
        'Times New Roman',
        'Verdana',
        'sans serif'
    ];
    const fontSizeOptions = [
        2,
        4,
        6,
        8,
        10,
        12,
        14,
        16,
    ];

    const selectedColumnValue = columns.includes(selectedColumn) ? selectedColumn : '';


    return (
        <div>
            <Offcanvas style={{ width: '290px' }} show={show} onHide={handleClose} placement="end">
                {/* <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Node Properties</Offcanvas.Title>
                </Offcanvas.Header> */}
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    transition="false"
                    onSelect={(k) => setKey(k)}
                    className="mb-1 active-tab"
                >
                    <Tab eventKey="home" title="Node Details" className={key === 'home' ? 'active-tab' : 'inactive-tab'}>
                        <Accordion>
                            <Item
                                className={styles.item}
                                header={
                                    <>
                                        {"General"}
                                        <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
                                    </>
                                }
                                buttonProps={{
                                    className: ({ isEnter }) =>
                                        `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
                                }}
                                initialEntered onToggle={() => setExpanded(!expanded)}>
                                {/* <Item  header="General" initialEntered onToggle={() => setExpanded(!expanded)}> */}
                                <Form className='text-size'>
                                    <Form.Group as={Row} className="m-1 text-size" >
                                        <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                                            <MdOutlineLabel style={{ marginRight: '5px', display: 'inline-block' }} />
                                            Label
                                        </Form.Label>
                                        <Col sm={inputFieldsize}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Label"
                                                className='text-size'
                                                value={labelval}
                                                onChange={handleLabelChange}
                                                tabIndex={1}

                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="m-1 text-size" >
                                        <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                                            <MdOutlineHeight style={{ marginRight: '5px', display: 'inline-block' }} />
                                            Height
                                        </Form.Label>
                                        <Col sm={inputFieldsize}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Height"
                                                className='text-size'
                                                min={0}
                                                value={heightval}
                                                onChange={handleHeightChange}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="m-1 text-size" >
                                        <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                                            <RiExpandWidthFill style={{ marginRight: '5px', display: 'inline-block' }} />
                                            Width
                                        </Form.Label>
                                        <Col sm={inputFieldsize}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Width"
                                                className='text-size'
                                                value={widthval}
                                                min={0}
                                                onChange={handleWidthChange}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="m-1 mt-0 text-size" >
                                        <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                                            <AiOutlineRadiusSetting style={{ marginRight: '5px', display: 'inline-block' }} />
                                            Border Radius
                                        </Form.Label>
                                        <Col sm={inputFieldsize}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Border Radius"
                                                className='text-size'
                                                value={borderRadiusval}
                                                min={0}
                                                onChange={handleBorderRadiusChange}
                                            />
                                        </Col>
                                    </Form.Group>
                                    {/* <Form.Group as={Row} className="m-1 text-size" controlId="fontcolorControl">
                                        <Form.Label column sm={labelFieldsize}>Font Color</Form.Label>
                                        <Col sm="6">
                                            <button
                                                style={{
                                                    width: '100%',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: fontColorValue,
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={handleClick}
                                            >
                                                {' '}
                                            </button>
                                            {showSketchPicker && (
                                                <SketchPicker
                                                    ref={sketchPickerRef}
                                                    color={fontColorValue}
                                                    style={{ height: "20px" }} // Decreased height to 20px
                                                    onChange={handleFontColorChange}
                                                    onClose={handleSketchPickerClose}
                                                />
                                            )}
                                        </Col>
                                    </Form.Group> */}
                                    <Form.Group as={Row} className="m-1 text-size">
                                        <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>

                                            <RxFontFamily style={{ marginRight: '5px', display: 'inline-block' }} />
                                            Font Style
                                        </Form.Label>
                                        <Col sm={inputFieldsize}>
                                            <Form.Select size="sm" value={fontFamilyValue} onChange={(e) => setFontFamilyValue(e.target.value)}>
                                                <option>Select Font Style</option>
                                                {fontFamilies.map((fontFamilyValue, index) => (
                                                    <option key={index} value={fontFamilyValue}>
                                                        {fontFamilyValue}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="m-1 text-size" >
                                        <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                                            <BiFontSize style={{ marginRight: '5px', display: 'inline-block' }} />
                                            Font Size
                                        </Form.Label>
                                        <Col sm={inputFieldsize}>

                                            <Form.Select size="sm" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                                                <option>Select Font Size</option>
                                                {fontSizeOptions.map((font, index) => (
                                                    <option key={index} value={font}>
                                                        {font}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {/* <Form.Control
                                                type="text"
                                                className='text-size'
                                                placeholder="Font Size"
                                                value={fontSize}
                                                onChange={handleFontSizeChange}
                                            /> */}
                                        </Col>
                                    </Form.Group>

                                </Form>
                            </Item>
                            {/* </Accordion> */}

                            {/* Data Connection Panel */}
                            <Item
                                className={styles.item}
                                header={
                                    <>
                                        {"Data Settings"}
                                        <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
                                    </>
                                }
                                buttonProps={{
                                    className: ({ isEnter }) =>
                                        `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
                                }}
                                initialEntered onToggle={() => setExpanded(!expanded)}>
                                {/* <AccordionItem header="Data Connection" initialEntered onToggle={() => setDataExpanded(!expandedData)}> */}
                                {/* <Form.Group as={Row} key="radio" className="m-1 text-size" >
                                    <Col sm={inputFieldsize}>
                                        <Form.Label>Data To Show</Form.Label>
                                    </Col>
                                    <Col sm={inputFieldsize}>
                                        <Form.Check
                                            // reverse
                                            // label="Data to Show"
                                            name="group1"
                                            type="radio"
                                            id={`reverse-radio-1`}
                                            onChange={(e) => setshowdata(true)}
                                            checked={showdata}
                                            style={{
                                                width: "20px",
                                                height: "20px"
                                            }}
                                        />
                                    </Col>
                                </Form.Group> */}
                                <Form.Group as={Row} className="m-1 text-size">

                                    <Form.Label column sm={labelFieldsize}>Constant</Form.Label>
                                    <Col sm={inputFieldsize}>
                                        <Form.Control
                                            type="number"
                                            className='text-size'
                                            placeholder="constant"
                                            value={constant}
                                            onChange={handleConstantChange}
                                            disabled={!disableConstant}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="m-1 text-size">
                                    <Form.Label column sm={labelFieldsize}>Value</Form.Label>
                                    <Col sm={inputFieldsize}>
                                        <Form.Control
                                            type="number"
                                            className='text-size'
                                            placeholder="value"
                                            value={value}
                                            onChange={handleValueChange}
                                            disabled={!disableValue}
                                        />
                                    </Col>
                                </Form.Group>
                                <hr />
                                <Form.Group as={Row} className="m-1 text-size" >
                                    <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>

                                        <FaTable style={{ marginRight: '5px', display: 'inline-block' }} />
                                        Table
                                    </Form.Label>
                                    <Col sm={inputFieldsize}>
                                        <Form.Select size="sm" value={selectedTable} onChange={(e) => {
                                            setSelectedTable(e.target.value);
                                            // fetchColumns(e.target.value);
                                        }}
                                            disabled={!disableTable}>
                                            <option>Select Table</option>
                                            {tablenames.map((tableName, index) => (
                                                <option key={index} value={tableName}>
                                                    {tableName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="m-1 text-size">
                                    <Form.Label column sm={labelFieldsize} style={{ display: 'inline-block' }}>
                                        <FaColumns style={{ marginRight: '5px', display: 'inline-block' }} />
                                        Column
                                    </Form.Label>
                                    <Col sm={inputFieldsize}>
                                        <Form.Select size="sm" value={selectedColumn}
                                            disabled={!disableColumn}
                                            onChange={(e) => setSelectedColumn(e.target.value)}>
                                            <option>Select Column</option>
                                            {columns.map((column, index) => (
                                                <option key={index} value={column}>
                                                    {column}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                            </Item>
                            <div as={Row} className="m-3 text-size justify-content-end" controlId="buttonControl" arrow>
                                <Tooltip title="Apply" placement="bottom">
                                    <Button style={{ minWidth: "40px", minHeight: "30px" }} variant='contained' color='success' onClick={handleSaveNodes} ><FaCheck /></Button>
                                </Tooltip>
                                <Tooltip title="Cancel" placement="bottom">
                                    <Button style={{ marginLeft: '10px', minWidth: "40px", minHeight: "30px" }} variant='contained' color='error' onClick={handleCancel} ><FaXmark /></Button>
                                </Tooltip>
                            </div>
                        </Accordion>
                    </Tab>
                    <Tab >
                        <Tooltip title="Close" placement="right" arrow>
                            <button color="error" variant="" className="close-icon" onClick={handleClose}>
                                <FaXmark size={20} />
                            </button>
                        </Tooltip>
                    </Tab>
                </Tabs>
                {/* </Accordion.Body>
                    </Accordion.Item> */}

                {/* <Accordion.Item eventKey="1">
                        <Accordion.Header className='text-size'>Other Properties</Accordion.Header>
                        <Accordion.Body>
                            <p>Additional settings can go here.</p>
                        </Accordion.Body>
                    </Accordion.Item> */}
                {/* </Accordion> */}
            {openSnackbar && (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={2000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  // This positions it at the bottom-right
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity="success"
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        Saved Successfully!
                    </Alert>
                </Snackbar>
            )} 
            </Offcanvas>
        </div >
    );
};

export default MindMapNodePropertiess;

