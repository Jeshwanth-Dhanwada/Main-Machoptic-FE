import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import BasicTabs from './tabs';
import "./dashboard.css"
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
export default function DashboardDrawer({ drawerOption, openDrawer, closeDrawer }) {
  const [isExpandedFull, setIsExpandedFull] = React.useState(false)

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
  };

  const list = (anchor, fullHeight) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, height: fullHeight ? "60vh" : "23vh"}}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {isExpandedFull ? 
      // <KeyboardDoubleArrowDownIcon className='drawer-arrow-icon' onClick={() => setIsExpandedFull(false)} /> 
      <CloseIcon className='drawer-arrow-icon' onClick={closeDrawer} />:
        <KeyboardDoubleArrowUpIcon className='drawer-arrow-icon' onClick={() => setIsExpandedFull(true)} />}
      <BasicTabs />
      <Divider />
    </Box>
  );

  return (
    <React.Fragment >
      <Drawer
        anchor={drawerOption}
        open={openDrawer}
      >
        {list(drawerOption, isExpandedFull)}
      </Drawer>
    </React.Fragment>
  );
}