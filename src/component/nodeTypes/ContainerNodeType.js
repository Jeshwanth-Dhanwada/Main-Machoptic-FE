import React, {memo, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import axios from 'axios';
import { Rnd } from 'react-rnd';
import { IconButton } from '@mui/material';
import { VscChromeMinimize } from "react-icons/vsc";
import { FiMaximize2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

// Ramesh added code for popup container
export default memo((props) => {
  const data = props.data
  const [isHovered, setIsHovered] = useState(false);

  const truncateText = (text, maxLength = 28) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  // console.log("data:",data)
  // console.log("data:",data.onPositionChange(data.id, 100,200))
  
  return (
    <Rnd
      default={{
        x: data.position.x,
        y: data.position.y,
        width: data.width,
        height: data.height,
      }}
      size={{
        width: data.width,
        height: data.height,
      }}
      // position={{
      //     x: data.position.x,
      //     y: data.position.y,
      // }}
      onDragStop={(e, d) => data.onPositionChange(data.id, d.x, d.y)}
      onResizeStop={(e, direction, ref, delta, position) => {
        data.onResize(data.id, ref.offsetWidth, ref.offsetHeight);
        data.onPositionChange(data.id, position.x, position.y);
      }}
      enableResizing={true}
      // enableResizing={!data.isMinimized}
      style={{
        border: '1px solid #ddd',
        borderRadius: '5px',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        position: 'relative',
      }}
      disableDragging={false}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 10px',
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}> {truncateText(data.name, 28)}</p>
        <div>
          <IconButton onClick={data.onMinimizeMaximize} size="small">
            {data.isMaximized ? <VscChromeMinimize size={16} /> : <FiMaximize2 size={16} />}
          </IconButton>
          <IconButton onClick={data.onClose} size="small">
            <IoMdClose color='error' size={20} />
          </IconButton>
        </div>
      </div>
      {!data.isMinimized && (
        <iframe src={data.iframeLink} title={`iframe-${data.id}`} style={{ width: '100%', height: '100%', border: 'none' }} />
      )}

    </Rnd>
  );
});


// export default function App() {
//   return (
//     <ReactFlowProvider>
//       <NodesComponent />
//     </ReactFlowProvider>
//   );
// }