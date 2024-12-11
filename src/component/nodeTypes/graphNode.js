import React, { memo, useEffect, useState } from 'react';
import { IconButton,Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

import JobPriorityGraphs from '../JobPriorityGraphs';
export default memo((props) => {
  const [data, setData] = useState(props.data);
  console.log(data,"1504")
  // This effect will run whenever props.data changes
  useEffect(() => {
    setData(props.data);
  }, [props.data]);
  return (
    <div style={data.style}>
        <Tooltip title={data.label}>
          <JobPriorityGraphs data={data.label} node={data.node} allnodes={data.allnodes} prodQty={data.producedQty} tarQty={data.targetQty} outQty={data.outQty}/>
        </Tooltip>
    </div>
  );
});
