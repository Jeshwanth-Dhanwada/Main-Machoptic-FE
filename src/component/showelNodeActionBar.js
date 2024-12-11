import Button from "react-bootstrap/Button";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as React from 'react';

import "./shovelNode.css"
import { CHART_TABS, FILTER_OPTIONS, PARAMETER_types } from "../constants/chartlConstants";
import { Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import InputSelect from "./commonComponents/inputSelect";
import { generateNums } from "../utils/commonFunctions";
const ShowelNodeAction = ({ solutionOptions, mineSelected = "", actionCallBack, memeOptions = [], 
selectedSolutions = ["", ""], tabSelected, filterOption, nodesCount, parameterType }) => {
  const isReadyToGo = selectedSolutions.every((a) => a) && mineSelected;
  const handleChangeMeme = (e) => {
    actionCallBack("changeMine", e.target.value);
  }

  const handleChangeRadio = (event) => {
    actionCallBack("updateParameterType", event.target.value);
  };

  const handleChange = (event, newValue) => {
    actionCallBack("updateTab", newValue);
  };

  return (
    <div className="main-nav" style={{"display": "flex","background-color": "#f22222;"}} class="col-12">
      <div className="actionContainer" class="col-8" style={{"padding-left": "8px"}}>
        <InputSelect
         labelId="demo-simple-select-label"
         label="Mine" 
         className="memeTypeSelect"
         placeholder="Select Mine"
         selectedVal={mineSelected}
         handleSelect={handleChangeMeme}
         options={memeOptions.map(a => a.MineName)}
        />
        <InputSelect
         labelId="demo-simple-select-option1"
         label="Solution 1" 
         className="memeTypeSelect"
         placeholder="Select solution 1"
         selectedVal={selectedSolutions[0] || ""}
         handleSelect={(e) => actionCallBack("selectSolution", e.target.value, 0)}
         options={solutionOptions.filter(sol => selectedSolutions[1] !== sol)}
        />
        <InputSelect 
         labelId="demo-simple-select-option2"
         label="Solution 2"
         className="memeTypeSelect"
         placeholder="Select solution 2"
         selectedVal={selectedSolutions[1] || ""}
         handleSelect={(e) => actionCallBack("selectSolution", e.target.value, 1)}
         options={solutionOptions.filter(sol => selectedSolutions[0] !== sol)}
        />

        {Object.values(FILTER_OPTIONS).map((filter) =>
          <FormControlLabel key={filter} control={<Checkbox checked={filterOption.includes(filter)} onClick={() => actionCallBack("updateFilter", filter)} />} label={filter} />
          )}
        <Button disabled={!isReadyToGo} style={{ backgroundColor: "#1976d2" }} className="go_action_button"
          onClick={() => actionCallBack("Go", filterOption)} >Go</Button>
        <Button className="clear_action_button"
          onClick={() => actionCallBack("clearsolution")} >Clear</Button>
      </div>
      <div class="col-4">
        <Box sx={{ mt: 1, minWidth: 120 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabSelected} onChange={handleChange} className="tabs-class" aria-label="basic tabs example">
            {Object.values(CHART_TABS).map(tabVal =>  <Tab disabled={!isReadyToGo} label={tabVal} style={{ "font-weight": "bold" }} />)}
            </Tabs>
          </Box>
        </Box>
      </div>
      {tabSelected === 3 && <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        className="radio-group-container"
        value={parameterType}
        onChange={handleChangeRadio}
      >
        {Object.keys(PARAMETER_types).map(option => 
          <FormControlLabel value={option} control={<Radio />} label={PARAMETER_types[option]} />
          )}        
      </RadioGroup>}
    </div>

  )
}

export default ShowelNodeAction;