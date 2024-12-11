import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import NodesPopup from "./NodePopup";
import EdgePopup from "./edgePopup";
import Shift from "./shift";
import Employee from "./Employees";
import DepartmentForm from "./department";
import Branch from "./branch";
import EmployeeType from "./EmployeeType";
import MaterialCategory from "./materailcategory";
import MaterialType from "./materialType";
import Units from "./units";
import Section from "./section";
import MaterialNodeType from "./materialNnodeType";
import SpareParts from "./SpareParts";
import AgentSupplies from "./AgentSupplies";
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
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
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

export default function BasicTabs({
  node,
  edge,
  onSaveEdge,
  onClose,
  onSaveNode,
  onCloseNode,
  setsendtoRoutes,
  selectedMenuItem,
  tableHeight
}) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNewImageNode = (newNode) => {
    setsendtoRoutes(newNode)
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 m-0 p-0">
          <Box sx={{ position: "relative" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              {(selectedMenuItem === "" ||
                selectedMenuItem === "Administration") && (
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  style={{background:'#FFFFFF'}}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#FFFFFF"}}
                    label="Properties"
                    {...a11yProps(0)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 1 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Shift"
                    {...a11yProps(1)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 2 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Employee"
                    {...a11yProps(2)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 3 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Department"
                    {...a11yProps(3)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 4 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Branch"
                    {...a11yProps(4)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 5 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Employee Category"
                    {...a11yProps(5)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 6 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Material Category"
                    {...a11yProps(6)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 7 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Material Node"
                    {...a11yProps(7)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 8 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Units"
                    {...a11yProps(8)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 9 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Section"
                    {...a11yProps(9)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 10 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Agent Suppliers"
                    {...a11yProps(10)}
                  />
                  <Tab
                    style={{ fontSize: "10.5px", fontWeight: "bold",color:'#727272', backgroundColor: value === 11 ? "#E6ECEF" : "#FFFFFF" }}
                    label="Spare parts"
                    {...a11yProps(11)}
                  />
                </Tabs>
              )}
              {/* {selectedMenuItem === "Configuration" && (
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Properties" {...a11yProps(0)} />
              <Tab label="Shift" {...a11yProps(1)} />
              <Tab label="Employee" {...a11yProps(2)} />
              <Tab label="Department" {...a11yProps(3)} />
              <Tab label="Branch" {...a11yProps(4)} />
              <Tab label="Employee Category" {...a11yProps(5)} />
              <Tab label="Material" {...a11yProps(6)} />
              <Tab label="Material Category" {...a11yProps(7)} />
              <Tab label="Material Type" {...a11yProps(8)} />
              <Tab label="Units" {...a11yProps(9)} />
              <Tab label="Section" {...a11yProps(10)} />
        </Tabs>
          )} */}
            </Box>

            <CustomTabPanel
              value={value}
              index={0}
              style={{ overflowY: "scroll" }}
            >
              {node ? (
                <NodesPopup
                  node={node}
                  onSave={onSaveNode}
                  onClose={onCloseNode}
                  onClick={handleNewImageNode}
                />
              ) : edge ? (
                <EdgePopup edge={edge} onSave={onSaveEdge} onClose={onClose} />
              ) : (
                ""
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Shift tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Employee tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <DepartmentForm tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <Branch tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
              <EmployeeType tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={6}>
              <MaterialCategory tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={7}>
              {/* <Material /> */}
              <MaterialNodeType tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={8}>
              <Units tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={9}>
              <Section tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={10}>
              <AgentSupplies tableHeight={tableHeight}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={11}>
              <SpareParts tableHeight={tableHeight}/>
            </CustomTabPanel>
          </Box>
        </div>
       </div>
      </div>
  );
}
