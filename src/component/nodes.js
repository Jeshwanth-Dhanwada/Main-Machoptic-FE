import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import axios from 'axios';

// import { initialNodes, initialEdges } from '../nodes-edges.js';
import 'reactflow/dist/style.css';
// import { json } from 'd3';


const getLayoutedElements = (nodes, edges) => {
  return { nodes, edges };
};
const NodesComponent = () => {
  const [initialNodes, setNodeData] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const [data, setData] = useState([]);
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const apiUrl = 'http://taxonalytica-dev.ap-south-1.elasticbeanstalk.com:8080/api/nodeMaster';

    axios.get(apiUrl)
      .then((response) => {
        setData(response.data); 
        let x = []
        for (let index = 0; index < response.data.length; index++) {
          const data = response.data[index];
          x.push({
            nodeId: data.nodeId.toString(),
            id:data.id.toString(),
            sourcePosition: 'right',
            type: 'input',
            data: { label: data.label },
            position: { x: data.xPosition, y: data.yPosition },
            style: {
              background: data.fillColor, // Set background color
              color: '#000',     // Set text color
              borderColor: data.borderColor,
              borderStyle: data.borderStyle,
              borderWidth: data.borderWidth,
              fontSize: '14', // Set the font size
              fontStyle: data.fontStyle, // Set the font style
              width:data.width,
              height:data.height,
              justifycontent: 'center', /* Horizontally center */
              alignitems:'center'/* Vertically center */
              
            },
          })
        }
        console.log(x);
        setNodes(x)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [setNodes]);
      
      console.log(initialNodes,"initial nodes")
  
  const { fitView } = useReactFlow();
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

 
  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges, setNodes, setEdges, fitView]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div style={{ height: 565, width: '100%', overflow: 'hidden' }}>
      <div>
      {/* {data.map((node) => ({
          id: node.id,
          type: node.type,
          data: { label: node.nodeName },
          position: { x: node.x, y: node.y },
          style: {
            width: node.width,
            height: node.height,
            borderColor: node.borderColor,
          },
        }))} */}
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        onConnect={onConnect}
      />
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <NodesComponent />
    </ReactFlowProvider>
  );
}