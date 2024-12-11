import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AiTwotoneCloseSquare } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import Parameters from './Parameters';
import Variable from './Variable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height:'500px',
  overflowY:'auto',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function ParameterVariable({container,onclick,selectnode}) {
  const [open, setOpen] = React.useState(container);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClose = () => {
    setOpen(false)
    onclick(false)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <GrClose id='CloseIcon' style={{cursor:'pointer',position:'relative',left:'95%',color:'red',fontSize:'20px'}} onClick={handleClose}/>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Paramerters" {...a11yProps(0)} />
            <Tab label="Variables" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
        <Parameters selectnode={selectnode}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Variable selectnode={selectnode}/>
        </CustomTabPanel>
      </Box>
      </Modal>
    </div>
  );
}
