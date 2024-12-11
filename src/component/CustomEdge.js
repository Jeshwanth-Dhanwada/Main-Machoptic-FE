// CustomEdge.js
import React from 'react';
import { getBezierPath, getEdgeCenter, getMarkerEnd } from 'reactflow';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Manually calculate the edge center
  const edgeCenterX = (sourceX + targetX) / 2;
  const edgeCenterY = (sourceY + targetY) / 2;

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={getMarkerEnd(markerEnd)} />
      <foreignObject width={40} height={40} x={edgeCenterX - 20} y={edgeCenterY - 20} className="edgebutton-foreignobject">
        <div>
          <button className="edgebutton" onClick={() => data.onAdd(id)}>+</button>
          <button className="edgebutton" onClick={() => data.onRemove(id)}>-</button>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
