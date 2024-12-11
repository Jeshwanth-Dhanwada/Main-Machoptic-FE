import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

export default function DrawerComponent({ anchor, selectedNode, drawerCallBacks }) {
    console.log(selectedNode, "selected node");
    const {data: {id}={}} = selectedNode || {};
    return (
        <React.Fragment>
            <Drawer
                anchor={anchor}
                open={!!selectedNode}
                onClose={() => drawerCallBacks("closeDrawer")}
            >
                <Box
                    sx={{ width: 550 }}
                    role="presentation"
                //   onClick={toggleDrawer(anchor, false)}
                //   onKeyDown={toggleDrawer(anchor, false)}
                >
                <Button onClick={() => drawerCallBacks("closeDrawer")}>{"Close"}</Button>
                    <h2> {id.split("-")[1]} Node details</h2>
                    <Divider />
                    Content of the drawer
                </Box>
            </Drawer>
        </React.Fragment>
    );
}