import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { List, TextField, InputAdornment, MenuItem, IconButton, Menu, Select, FormControl, InputLabel, Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import "bootstrap/dist/css/bootstrap.min.css"

import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import Grid from '@mui/material/Grid';

const NodeFormulaPopup = ({ node, onClose }) => {
    const [open, setOpen] = React.useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [operator, setOperator] = useState('+');
    const [result, setResult] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenMenu(false)
    };

    const handleOpenDrawer = () => {
        setOpen(true);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
        onClose();
    };

    const handleValue1Change = (event) => {
        setValue1(event.target.value);
    };

    const handleValue2Change = (event) => {
        setValue2(event.target.value);
    };

    const handleOperatorChange = (event) => {
        setOperator(event.target.value);
    };

    const handleSubmit = () => {
        let result;
        if (operator === '+') {
            result = parseFloat(value1) + parseFloat(value2);
        } else if (operator === '-') {
            result = parseFloat(value1) - parseFloat(value2);
        }
        setResult(result);
        node.label = result.toString();
    };

    console.log("result:", result);

    const fontSizeOptions = [
        "8",
        "10",
        "12",
        "14",
        "16",
    ];

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
        onClose()
        setAnchorEl(null)
        // setEditNodeProperties(newOpen)
    };

    const DrawerList = (
        <Box sx={{ width: 400 }} role="presentation" className='font-sans font-normal'>
            <Grid xs={1}>
                <div className="h-12 bg-[#060270] text-white flex justify-center items-center font-sans font-normal">
                    <div className="font-bold text-lg">
                        Data Connection Formula
                    </div>
                    <div className=' d-flex flex-row place-content-end' >
                        <Tooltip title="Close" placement="right" arrow>
                            <Button color='error' className='btn btn-close ' style={{ right: '-355px' }} >
                                <CloseTwoToneIcon onClick={handleCloseDrawer} />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </Grid>

            <List>
                <div className='d-flex flex-row justify-space-between' style={{ margin:"5px 5px", fontSize: '12px'}} >
                    <TextField id="value1" label="Value 1" variant="standard" value={value1} onChange={handleValue1Change} />
                    <FormControl variant="standard" sx={{ ml: 1,mr:1, minWidth: 120 }}>
                        <InputLabel id="operator-label">Operator</InputLabel>
                        <Select
                            labelId="operator-label"
                            id="operator"
                            value={operator}
                            onChange={handleOperatorChange}
                        >
                            <MenuItem value="+">SUM</MenuItem>
                            <MenuItem value="-">SUB</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField id="value2" label="Value 2" variant="standard" value={value2} onChange={handleValue2Change} />
                </div>

                <Button style={{ margin:"5px 5px", fontSize: '12px'}} color="success" variant='contained' onClick={handleSubmit}>Submit</Button>

            </List>
        </Box>
    );

    return (
        <div>
            <Stack spacing={1}>
                {/* <Button onClick={handleOpenDrawer}>Open drawer</Button> */}
                <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
                {DrawerList}
            </Drawer>
            </Stack>
        </div>
    );
}

export default NodeFormulaPopup;