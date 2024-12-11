import React, { memo, useEffect, useState } from 'react';
import MachineGraphs from '../MachineGraph';
export default memo((props) => {
  const [data, setData] = useState(props.data);
  const AllJobs = data.data
  const nodes = data.nodeId

  console.log(nodes,"15044")
  useEffect(() => {
    setData(props.data)
  }, [props.data]);
  return (
    <div style={data.style}>
          <MachineGraphs  AllJobs={AllJobs} AllNodes={nodes}/>
    </div>
  );
});
