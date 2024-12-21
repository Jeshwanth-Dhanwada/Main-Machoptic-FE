import React, { memo, useEffect, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Tooltip } from "@mui/material";
import { BiSolidCalendarCheck } from "react-icons/bi";
import { MdDeviceHub } from "react-icons/md";
import { BsMinecartLoaded } from "react-icons/bs";
import {
  getOADetails,
  getEmployees,
  getItemmaster,
  getDeviceMaster,
} from "../../api/shovelDetails";


export default memo((props) => {
  const data = props.data;
  const [Oadetails, setOadetails] = React.useState([]);
  const [Employees, setEmployees] = React.useState([]);
  const [ItemMaster, setItemMaster] = React.useState([]);
  const [deviceMaster, setdeviceMaster] = React.useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    let resizeObserverEntries = [];
    const observer = new ResizeObserver((entries) => {
      resizeObserverEntries = entries;
    });

    if (inputRef.current) observer.observe(inputRef.current);

    return () => {
      resizeObserverEntries.forEach((entry) => entry.target.remove());
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    showOA_details();
    showEMployess();
    showItemMaster();
    showDeviceMaster();
  }, []);
  const showOA_details = async (key) => {
    const responsedata = await getOADetails();
    setOadetails(responsedata, key);
  };
  const showEMployess = async (key) => {
    const responsedata = await getEmployees();
    setEmployees(responsedata, key);
  };
  const showItemMaster = async (key) => {
    const responsedata = await getItemmaster();
    setItemMaster(responsedata, key);
  };
  const showDeviceMaster = async (key) => {
    const responsedata = await getDeviceMaster();
    setdeviceMaster(responsedata, key);
  };
  const isEmployee = Employees.some((item) => item.userName === data.label);
  const isJobs = Oadetails.some((item) => String(item.IT_NAME) === String(data.label))

  
  return (
    <div style={data.style}>
      <Tooltip title={data.label}>
        <span>
          {Oadetails.find((item) => String(item.IT_NAME) === String(data.label)) && (
            <div className="btn" id="IconNodeButton">
              <BiSolidCalendarCheck id="IconNodeColor" />
            </div>
          )}
        </span>
      </Tooltip>

      <Tooltip title={data.label}>
        <span>

          {Employees.some((item) => item.userName === data.label) && (
            <div className="btn" id="IconNodeButton">
              <PersonIcon id="IconNodeColor"  />
            </div>
            // <Box sx={{ color: 'action.active' }}>
            //   <Badge color="secondary" variant="dot" 
            //      sx={{'.MuiBadge-dot': {backgroundColor: '#F18821',}}}>
            //     <div className="btn" id="IconNodeButton">
            //       <PersonIcon id="IconNodeColor" />
            //     </div>
            //   </Badge>
            // </Box>

          )}
        </span>
      </Tooltip>
      <Tooltip title={data.label}>
        <span>

          {deviceMaster.some((item) => item.deviceName === data.label) && (
            <div className="btn" id="IconNodeButton">
              <MdDeviceHub id="IconNodeColor"/>
            </div>
          )}
          </span>
        </Tooltip>
        <Tooltip title={data.label}>
        <span>
          {ItemMaster.some(
            (item) =>
              item.IT_NAME === data.label &&
              (item.Film_Name_ID === "" || item.Fabric_Name_ID === "")
          ) && (
            <div className="btn" id="IconNodeButton">
              <BsMinecartLoaded id="IconNodeColor" />
            </div>
          )}
        </span>
        </Tooltip>
        
    </div>
  );
});
