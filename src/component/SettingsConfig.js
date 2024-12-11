import * as React from "react";
import { Box, Tooltip } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import { Accordion, AccordionItem as Item, useAccordionItem } from '@szhsin/react-accordion';
import chevronDown from "./chevron-down.svg";
import styles from "./styles.module.css";
import { FaXmark } from "react-icons/fa6";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import NodesConfig from "./NodesConfig";
import EdgeConfig from "./EdgeConfig";
import CanvasConfig from "./CanvasConfig";
import AggregationProperties from "./AggregationSettings";


import './configuration.css'

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const SettingsConfigurationPanel = ({ open, setopenConfig, node, calculateLeafNodesValues, nodes, setNodes, setTree }) => {
    const [value, setValue] = React.useState(0);
    const [expanded, setExpanded] = React.useState(true);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [state, setState] = React.useState({
        bottom: true,
    });

    const [aggregationType, setAggregationType] = React.useState();

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState(open);
        setopenConfig(false);
        // saveCanvasConfig(false)
    };

    const list = (anchor) => (
        <div>

            <Box sx={{ width: '100%', height: '380px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab style={{ fontWeight: 'bolder' }} label="General" {...a11yProps(0)} />
                        <Tab style={{ fontWeight: 'bolder' }} label="Default Settings" {...a11yProps(1)} />
                        <Tab style={{ fontWeight: 'bolder' }} label="Aggregation" {...a11yProps(2)} />

                        {/* <Tab style={{ fontWeight: 'bolder' }} label="Edges" {...a11yProps(2)} />
                        <Tab style={{ fontWeight: 'bolder' }} label="Canvas" {...a11yProps(3)} /> */}
                    </Tabs>
                </Box>
                <List className="ml-3" style={{ position: 'absolute', top: '0px', right: '0px' }}>
                    <div className="flex-row d-flex ml-3">
                        <ListItem>
                            <ListItemText primary="" />
                            <Tooltip title="Close" placement="right" arrow>
                                <button color="error" variant="" className="close-icon-x" onClick={toggleDrawer(false)}>
                                    <FaXmark size={20} />
                                </button>
                            </Tooltip>
                        </ListItem>
                    </div>
                </List>
                <CustomTabPanel value={value} index={0}>
                    <FormControl>
                        <FormLabel className="ml-3" id="demo-row-radio-buttons-group-label">
                            Alignment
                        </FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            className="ml-3"
                            defaultValue="Left To Right"
                        >
                            <FormControlLabel
                                value="Left To Right"
                                control={<Radio />}
                                label="Left To Right"
                            />
                            <FormControlLabel
                                value="Top To Bottom"
                                checkedIcon
                                control={<Radio />}
                                label="Top To Bottom"
                            />
                        </RadioGroup>
                    </FormControl>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <Accordion>
                        <Item
                            className={styles.item}
                            header={
                                <>
                                    {"Node "}
                                    <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
                                </>
                            }
                            buttonProps={{
                                className: ({ isEnter }) =>
                                    `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
                            }}
                            initialEntered
                            onToggle={() => setExpanded(!expanded)}
                        >
                            <NodesConfig /> {/* Move NodesConfig inside AccordionItem */}
                        </Item>
                    </Accordion>
                    <Accordion style={{ marginTop: "10px" }}>
                        <Item
                            className={styles.item}
                            header={
                                <>
                                    {"Edge "}
                                    <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
                                </>
                            }
                            buttonProps={{
                                className: ({ isEnter }) =>
                                    `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
                            }}
                            initialEntered
                            onToggle={() => setExpanded(!expanded)}
                        >
                            <EdgeConfig />
                        </Item>
                    </Accordion>
                    <Accordion style={{ marginTop: "10px" }}>
                        <Item
                            className={styles.item}
                            header={
                                <>
                                    {"Canvas "}
                                    <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
                                </>
                            }
                            buttonProps={{
                                className: ({ isEnter }) =>
                                    `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
                            }}
                            initialEntered
                            onToggle={() => setExpanded(!expanded)}
                        >
                            <CanvasConfig />
                        </Item>
                    </Accordion>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <AggregationProperties node={node} calculateLeafNodesValues={calculateLeafNodesValues} nodes={nodes} setNodes={setNodes} setTree={setTree} />
                </CustomTabPanel>
            </Box>
        </div>
    );

    return (
        <div style={{ height: "250px" }}>
            <React.Fragment>
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}

                    onClose={toggleDrawer("bottom", false)}
                //   onOpen={toggleDrawer('bottom', open)}
                >
                    {list("bottom")}
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
};

export default SettingsConfigurationPanel;
