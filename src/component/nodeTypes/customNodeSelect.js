import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, isConnectable, ...rest }) => {
  const {sourcePosition, targetPosition} = rest || {}
  return (
    <>
      <Handle
        type="target"
        position={sourcePosition}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div onDoubleClick={() => data.onDoubbleClick(data)} style={data.style}>
        {data.label}
      </div>
      <Handle
        type="source"
        position={targetPosition}
        id="a"
        isConnectable={isConnectable}
      />
    </>
  );
});
