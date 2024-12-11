import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import OperationsJobActivity from "./OperationsJobActivity";
import OperationsInput from "./OperationsInput";
import OperationsOutput from "./OperationsOutput";
import Maintenance from "./Maintenance";
import BreakDown from "./BreakDown";
import Updateparameters from "./Updateparameters";
import UpdateVariables from "./UpdateVariable";
import MaterialSpecifications from "./MaterialSpecifications";
// import Node
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

export default function BottomOperationsTabs({
  node,
  JobfromOperations,
  tableHeight
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [showRowboolean, setshowRowbooleanValue] = useState([]);
  const [RecentActvitydata, setRecentActvityData] = useState([]);
  const hanldeTabValue = (tabvalue) => {
    setValue(tabvalue.setvalue);
    setshowRowbooleanValue(tabvalue.setrowActive);
  }

  const HanldeActivityInput = (RecentActvityData) => {
    console.log(RecentActvityData,"RecentActvitydata");
    setRecentActvityData(RecentActvityData)
  }

  const [inputdatafromActivity, SetinputdatafromActivity] = useState([]);
  const [outputDatafromActivity, setOutputdatafromActivity] = useState([]);
  const HandlesetSendToInput = (inputdata) => {
    SetinputdatafromActivity(inputdata)
  }

  const HandlesetSendToOutput = (outputData) => {
    setOutputdatafromActivity(outputData);
  };

  const handleFromUpdateParameter = (value) => {
    setValue(value)
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 m-0 p-0">
        <Box sx={{ position: "relative" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              style={{background:'#FFFFFF'}}
            >
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 0 ? "#E6ECEF" : "#FFFFFF"}} label="Activity Jobs" {...a11yProps(0)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 1 ? "#E6ECEF" : "#FFFFFF"}} label="Inputs" {...a11yProps(1)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 2 ? "#E6ECEF" : "#FFFFFF"}} label="Outputs" {...a11yProps(2)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 3 ? "#E6ECEF" : "#FFFFFF"}} disabled label="Maintenance" {...a11yProps(3)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 4 ? "#E6ECEF" : "#FFFFFF"}} disabled label="Break Down" {...a11yProps(4)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 5 ? "#E6ECEF" : "#FFFFFF"}} disabled label="Parameters" {...a11yProps(5)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 6 ? "#E6ECEF" : "#FFFFFF"}} disabled label="Variables" {...a11yProps(6)} />
              <Tab style={{fontSize:'10.5px',fontWeight:'bold',color:'#727272', backgroundColor: value === 7 ? "#E6ECEF" : "#FFFFFF"}} disabled label="Specifications" {...a11yProps(7)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <OperationsJobActivity
              JobfromOperations={JobfromOperations}
              setActivitydatatoInput={HanldeActivityInput}
              onClick={hanldeTabValue}
              setSendToInput={HandlesetSendToInput}
              setSendToOutput={HandlesetSendToOutput}
              tableHeight = {tableHeight}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1} style={{ overflowY: "scroll" }}>
            <OperationsInput
              JobfromOperations={JobfromOperations}
              showRowboolean={showRowboolean}
              onClick={hanldeTabValue}
              RecentActvitydata={RecentActvitydata}
              inputdatafromActivity={inputdatafromActivity} />
              tableHeight = {tableHeight}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2} style={{ overflowY: "scroll" }}>
            <OperationsOutput
              JobfromOperations={JobfromOperations}
              RecentActvityData={RecentActvitydata}
              outputDatafromActivity={outputDatafromActivity}
              inputdatafromActivity={inputdatafromActivity}
              onclicksend={handleFromUpdateParameter}
              tableHeight = {tableHeight}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Maintenance RecentActvityData={RecentActvitydata} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <BreakDown RecentActvitydata={RecentActvitydata} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <Updateparameters RecentActvitydata={RecentActvitydata} onclicksend={handleFromUpdateParameter}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
            <UpdateVariables RecentActvitydata={RecentActvitydata} onclicksend={handleFromUpdateParameter}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
            <MaterialSpecifications RecentActvitydata={RecentActvitydata} onclicksend={handleFromUpdateParameter}/>
          </CustomTabPanel>
        </Box>
        </div>
      </div>
    </div>
  );
}
