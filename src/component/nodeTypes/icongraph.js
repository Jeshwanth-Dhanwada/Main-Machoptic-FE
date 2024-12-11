import React, { memo, useEffect, useRef } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { IconButton, Tooltip } from '@mui/material';
import { VscGraph } from "react-icons/vsc";

export default memo((props) => {

  // console.log("check icon nodes for graphs",props,props.onClick)
  const data = props.data;
  // console.log(props.onClick)

  return (
    <div style={data.style}>
      {/* <div onDoubleClick={(e) => data.onIconDoubbleClick(e,props)} style={data.style}> */}
      <Tooltip >
          <IconButton onClick={props.onClick} >
            <VscGraph title='Graph' size={32} />
          </IconButton>

      </Tooltip>
    </div>
  );
});

// const GraphNodeIcon = ({ data, onClick }) => {
//     // console.log("data:",data)
//     return (
//     <IconButton onClick={onClick} >
//         <VscGraph title='Graph' size={20} />
//     </IconButton>)

// }

// export default GraphNodeIcon;
