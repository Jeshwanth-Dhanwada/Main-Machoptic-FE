import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge, Panel, MarkerType, Background, applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './updatenode.css';
import '../index.css'
// import NodesPopup from './components/NodePopup';
import ModelDrawer from './modal';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
// import EditIcon from '@mui/material/EditIcon';

import { v4 as uuidv4 } from 'uuid';
import CustomNode from './CustomNode.jsx';
import { getAllEdges, getAllNodes, deleteNode, saveNodes, saveEdges, deleteEdge, getCanvasConfig, getEdgesConfig, getNodesConfig, getAllTables } from '../api/allsolutiions';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { hover } from '@testing-library/user-event/dist/hover.js';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { FaEdit } from 'react-icons/fa';
// import NodePopup from './nodePropertiesPanel'
import MindMapNodeProperties from './node-properties-panel.js';
import NodesComponent from '../initialiseNodes.js'
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ResetTvOutlinedIcon from '@mui/icons-material/ResetTvOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TableViewSharpIcon from '@mui/icons-material/TableViewSharp';
import { Refresh } from 'react-refresh';
import SettingsConfigurationPanel from './SettingsConfig.js'
import AlertTitle from '@mui/material/AlertTitle';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { generateJSONDataForNodes,generateJSONDataForEdges } from '../utilities/generateJSONDataForNodes.js';
import NodeProperties from './node-properties-panel.js'
import { buildTree, convertTreeToNodes, convertTreeToEdges, convertArrayToObject } from '../utilities/buildTree.js';
import { canvasdata } from './CanvasConfig.js';
import { Edgesdata } from './EdgeConfig.js';
import { nodesdata } from './NodesConfig.js';
import { NavbarHeader } from './NavbarPanel.js';
import NodeFormulaPopup from './NodeformulaForm.js';


// const nodeTypes = {
//   custom: CustomNode,
// };

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultViewport = { x: 15, y: 280, zoom: 100 };

let labelid = 2;
const getId = () => `${labelid++}`;

const HORIZONTAL_OFFSET = 120; // Horizontal distance between parent and child
const VERTICAL_OFFSET = 32; // Vertical distance between sibling nodes

const initialNodes = [
  {
    id: uuidv4(),
    data: {
      label: (
        <div className=" flex flex-col justify-center items-center font-sans font-normal ">
          <span>RootNode<span></span></span>
          {/* <div className='bg-gray-200 rounded-sm' style={{ padding: '1px' }}>(50-30)</div> */}
          {/* <EditIcon/> */}
        </div>
      ),
    },
    sourcePosition: "right",
    targetPosition: "left",
    position: { x: 0, y: 0 },
    level: 0,
    Collapsed: false,
    parent: "",
    // width: 80,
    // height: 20,
    constant: "0",
    value: 0,
    datatable: "",
    datacolumn: "",
    style: {
      width: 80,
      height: 20,
      borderRadius: '50px',
      fontSize: "6px",
      background: '#3D52A0',
      fillColor: "#08A64F",
      color: 'black',
      borderColor: '#CECECE',
      borderWidth: '1px',
    },
    children: [],
  },
];

const MainMindMap = () => {

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tree, setTree] = useState([]);
  const [tablenames, setTableNames] = useState([]);
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const defaultFontFamily = 'sans-serif';
  const [fontFamily, setFontFamily] = React.useState(defaultFontFamily);
  const [deleteopen, setdeleteOpen] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeName, setNodeName] = useState('Node1');
  const [nodeBg, setNodeBg] = useState('#eee');
  const [nodeHidden, setNodeHidden] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showNodePopup, setNodeShowPopup] = useState(true);
  const [selectedNodess, setSelectedNodes] = useState(null);
  const [Open, setOpen] = useState(null);
  const [expandNodestate, setExpandNodestate] = useState(true);
  // Add hover state to nodes
  const [hoveredNodeId, setHoveredNodeId] = useState([]);
  const expandNodestateRef = React.createRef(false);
  const [buttonClicked, setButtonClicked] = useState(true);
  const [openConfig, setopenConfig] = useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [SelectedNodeDelete, setSelectedNodeDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [nodeformulapop, setNodeFormulapop] = useState(false)
  const [nodedata, setNodedata] = useState([])
  // Edit node properties panel
  const [editNodeProperties, setEditNodeProperties] = useState(false);
  const [editedNode, setEditedNode] = useState(null);
  const [nodesConfig, setNodesConfig] = useState([])
  const [edgesConfiguration, setEdgesConfig] = useState([])
  const [canvasConfiguration, setCanvasConfig] = useState([])
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  // const theme = useTheme();

  const toggleDrawer = (newOpen) => () => {
    setdeleteOpen(newOpen);
  };

  const proOptions = { hideAttribution: true };

  const handleNodeMouseOver = (event, node) => {
    // console.log("node:", node)
    setHoveredNodeId(node);

  };

  const handleNodeMouseOut = () => {
    // console.log("nodeid removed",hoveredNodeId)
    setHoveredNodeId(null);
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily,
        },
      }),
    [fontFamily],
  );

  useEffect(() => {
    setNodes(nodes)
    setTree(tree)
  }, [nodes, setNodes, setTree, tree])

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const showCanvasConfigdata = async (key) => {
    const responsedata = await getCanvasConfig();
    setCanvasConfig(responsedata[0], key);
  };

  useEffect(() => {
    // showNodeConfigdata()
    // showEdgesConfigdata()
    showCanvasConfigdata()
  }, [])

  const handleOpenSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };


  // Recursive function to calculate positions for affected nodes only
  const calculateAffectedPositions = (node, x = 0, y = 0, level = 0) => {
    if (node.Collapsed || node.children.length === 0) {
      node.position = { x, y };    // Position leaf nodes or collapsed nodes
      node.heightpos = 1;             // Assign height for collapsed or leaf node
      return;
    }

    let currentY = y;
    const childrenHeights = [];

    // Calculate the positions for each child node
    node.children.forEach((child) => {
      calculateAffectedPositions(
        child,
        x + HORIZONTAL_OFFSET, // Move children to the right of their parent
        currentY, // Position children vertically
        level + 1
      );
      // After positioning each child, increase the vertical position for the next child
      currentY += child.heightpos * VERTICAL_OFFSET;
      childrenHeights.push(child.heightpos);
    });

    // Calculate the total height of the current node based on its children
    node.heightpos = childrenHeights.reduce((a, b) => a + b, 0);

    // Center parent node vertically relative to its children
    const midPoint = y + (node.heightpos * VERTICAL_OFFSET) / 2;
    node.position = { x, y: midPoint - (VERTICAL_OFFSET / 2) };
  };

  const handleEditNodeProperties = (node) => {
    setEditNodeProperties(true);
    setEditedNode(node);
  };

  console.log(initialNodes,"initialNodes")
  const handleSaveEditedNode = (node) => {
    setEditNodeProperties(false);
    setEditedNode(null);
    // Update node properties here
  };

  const getNodeDetails = async () => {
    try {
      const response = await getAllNodes();  // Fetch all nodes from the database
      const edgesResponse = await getEdgesConfig();
      const nodesResponse = await getNodesConfig();
      setEdgesConfig(edgesResponse[0])
      setNodesConfig(nodesResponse[0])
      let initialTree

      if (response && response.length > 0) {
        // If response from the database has nodes, build the tree from that data
        initialTree = buildTree(response);
      } else {
        initialTree = initialNodes
      }
      setTree(initialTree);
      const checktree = await calculateLeafNodesValues(initialTree);
      const nodes = convertTreeToNodes(convertArrayToObject(initialTree)); // Convert tree to nodes
      const edges = convertTreeToEdges(convertArrayToObject(initialTree)); // Convert tree to edges
      setNodes(nodes); // Set nodes in the state for ReactFlow
      setEdges(edges); // Set edges in the state for ReactFlow

      // Optionally update tree in the application state
      updateTree(initialTree);
      const AllTables = await getAllTables()
      setTableNames(AllTables.tablenames)
    } catch (error) {
      console.error("Error fetching initial APIs:", error);
    }
  };



  // const getEdgeDetails = async () => {
  //     const responseEdge = await getAllEdges();
  //     // if (responseEdge.length) {  }
  //     if (responseEdge.length) { ConvertToEdges(responseEdge) }
  // }

  useEffect(() => {
    // Fetch data from the API when the component mounts
    getNodeDetails();
    // getEdgeDetails();
  }, []);


  const restoreNodes = () => {
    if (window.confirm) {
      getNodeDetails();
      // getEdgeDetails();
    }
  }

  let nodesToHide = [];

  const getChildNodes = (nodeId) => {
    const childNodes = edges.filter(edge => edge.source === nodeId).map(edge => edge.target);
    if (childNodes.length) {
      for (const child of childNodes) {
        nodesToHide.push(child);
        getChildNodes(child);
      }
    }
  };



  const updateTree = useCallback((tree) => {
    calculateAffectedPositions(convertArrayToObject(tree));   // Recalculate positions for all nodes
    calculateLeafNodesValues(tree)
    setNodes(convertTreeToNodes(convertArrayToObject(tree), nodesConfig));  // Convert tree to nodes and update
    setEdges(convertTreeToEdges(convertArrayToObject(tree), edgesConfiguration));  // Convert tree to edges and update
  }, [setNodes, setEdges, , edgesConfiguration, nodesConfig]);

  const onNodeContextMenu = (event, node) => {
    event.preventDefault(); // Prevent the default context menu
    setOpen(true)
  };
  const onCloseNodePopup = () => {
    setNodeShowPopup(false);
    setSelectedNodes(null);
  };

  const onSaveNodePopup = (node) => {
    const updateNodes = nodes.map(existingNode =>
      existingNode.id === node.id ? { ...existingNode, ...node } : existingNode
    )
    setNodes(updateNodes)
    onCloseNodePopup();
  };


  const onConnect = useCallback((params, setEdges) => {
    // reset the start node on connections
    connectingNodeId.current = null;
    try {
      setEdges((eds) => addEdge(params, eds));
    }
    catch (e) {
      alert("Can't add more than one edge!")
    }
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, [nodes]);

  useEffect(() => {
    setNodes(nodes);
    //console.log("Connect:", nodes)
  }, [nodes, setNodes]);

  const findNodeById = (nodes, id) => {
    for (let node of nodes) {
      // Check if the current node's id matches the given id
      if (node.id === id) return node;

      // Safely check if the node has children and they are an array
      if (Array.isArray(node.children) && node.children.length > 0) {
        const found = findNodeById(node.children, id);
        if (found) return found;  // Return the node if found
      }
    }
    return null;  // Return null if no node with the given id is found
  };


  const findParentNode = (nodes, targetNodeId) => {
    // Iterate over the array of root nodes
    for (let node of nodes) {
      // Check if any child node matches the targetNodeId
      if (node.children) {
        for (let child of node.children) {
          if (child.id === targetNodeId) {
            return node; // Return the current node if it is the parent
          }
          // Recursively search for the parent in the subtree
          const found = findParentNode(node.children, targetNodeId);
          if (found) {
            return found; // If found in subtree, return the parent node
          }
        }
      }
    }
    return null; // Return null if no parent node is found
  };


  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onConnectEnd = useCallback(
    (event, node) => {
      if (!connectingNodeId.current) return;
      const parentNode = findNodeById(tree, connectingNodeId.current);
      // const parentnodeID = nodes.find(n => n.id === parentNode.id);
      if (parentNode) {
        const randomNumber = Math.floor(100 + Math.random() * 900);
        const id = uuidv4();
        const newNode = {
          id: id,
          nodeName: nodesConfig? (
            `${nodesConfig?.nodeLabel}`
          ):"ChildNode",
          sourcePosition: "right",
          targetPosition: "left",
          height: 20,
          width: 80,
          parent: connectingNodeId.current,
          // level: (Number(parentnode.map(a => a.level)) + 1),
          Collapsed: false,
          style: {
            width: 110, height: 30, borderRadius: `${nodesConfig?.borderRadius}px`, fontSize: `${nodesConfig?.labelSize}px`,
            background: 'white', // Set background color
            color: '#3D52A0',     // Set text color
            borderColor: '#CECECE',
            BackgroundColor: "#3D52A0",
            borderWidth: '1px',
            fillColor: '#3D52A0',
            fontStyle: `${nodesConfig?.labelStyle}`,
          },
          constant: "1",
          value: 0,
          datatable: "",
          datacolumn: "",
          checkFlag: true,
          children: []
        };
        parentNode.children.push(newNode);
        updateTree(tree, setNodes, setEdges);
      }
    }, [tree, setNodes, setEdges]);

  const handleSaveNodes = async () => {

    const nodesSavedData = await saveNodes(generateJSONDataForNodes(nodes))
    const edgesSavedData = await saveEdges(generateJSONDataForEdges(edges))
    handleOpenSnackbar('Data saved successfully!');
    const initialTree = buildTree(nodesSavedData);
    setTree(initialTree);
    calculateLeafNodesValues(initialTree)
    const Treenodes = convertTreeToNodes(convertArrayToObject(initialTree)); // Use the initialTree variable directly instead of tree
    const Treeedges = convertTreeToEdges(convertArrayToObject(initialTree));
    setNodes(Treenodes);
    setEdges(Treeedges);
    // await window.location.reload();
  };



  // const handleSelect = (event, node) => {
  //   setSelectedNodeId(node);
  // };
  const handleSelect = useCallback((event, node) => {
    // Update the selected node ID when a node is clicked
    setSelectedNodeId(node.id === selectedNodeId ? null : node);
  }, [selectedNodeId, setSelectedNodeId]);

  const handleDelete = (item) => {
    if (item) {
      setdeleteOpen(true);
      setSelectedNodeDelete(item)

    } else {
      alert("Please select a node to delete")
    }
  };

  const handleClose = () => {
    setdeleteOpen(false);
  };
  const handleYes = () => {
    if (selectedNodeId) {
      const childNodes = edges.filter(edge => edge.source == SelectedNodeDelete).map(edge => edge.nodeId)
      const CNodes = nodes.filter(node => childNodes.includes(node.id))

      let edg = edges.filter(edge => edge.target === SelectedNodeDelete).map(edge => edge.edgeId);
      setNodes((prevNodes) => prevNodes.filter((n) => n.id !== SelectedNodeDelete));
      deleteNode(nodes.filter((n) => n.id == SelectedNodeDelete).map(node => node.nodeId))
      const parentNode = findParentNode(tree, SelectedNodeDelete);
      if (parentNode) {
        parentNode.children = parentNode.children.filter(
          (child) => child.id !== SelectedNodeDelete
        );
      }
      deleteEdge(edg)
      setSelectedNodeId(null);
      setdeleteOpen(false);
      // window.location.reload();
      updateTree(tree);
    }
  };

  const onClosePopupPanel = () => {
    setEditNodeProperties(false);
  }

  const handleConfig = () => {
    setopenConfig(true)
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Double-click handler to expand/collapse child nodes
  const expandCollapse = useCallback((node) => {
    const foundNode = findNodeById(tree, node);
    if (foundNode) {
      foundNode.Collapsed = !foundNode.Collapsed; // Toggle collapse state
      updateTree(tree); // Recalculate the tree and positions
    }
  }, [tree, updateTree]);

  // const onNodeDoubleClick = useCallback((event, node) => {
  //   const foundNode = findNodeById(tree, node.id);
  //   if (foundNode) {
  //     foundNode.Collapsed = !foundNode.Collapsed; // Toggle collapse state
  //     updateTree(tree); // Recalculate the tree and positions
  //   }
  // }, [tree, updateTree]);

  // const handleRightClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };
  // // console.log("nodes:",nodes)

  // const findLeafNodes = (node, leafNodes) => {
  //   if (!node.children || node.children.length === 0) {
  //     leafNodes.push(node);
  //   } else {
  //     node.children.forEach((child) => {
  //       findLeafNodes(child, leafNodes);
  //     });
  //   }
  // };


  // ========= Recursive function to calculate values for a node and its descendants==========

  const calculateNodeValueRecursively = (node) => {
    // Base case: If the node is a leaf (no children), calculate its totalValue and return
    if (!node.children || node.children.length === 0) {
      // node.totalValue = Number(node.constant) * Number(node.value);
      node.totalValue = Number(node.constant) * Number(node.checkFlag ? node.value : node.aggregatedvalue).toFixed(2);
      return node.totalValue;
    }
    // Recursive case: Calculate the totalValue by summing up the children's values
    let sum = 0;
    node.children.forEach((child) => {
      sum += Number(calculateNodeValueRecursively(child)); // Recursively calculate children's values
    });

    // Update the parent node's value as the sum of children's totalValue
    node.value = Number(sum);

    // Update this node's totalValue by applying its constant to the sum of children's values
    node.totalValue = sum * Number(node.constant);

    return node.totalValue.toFixed(2);
  };

  const calculateLeafNodesValues = (tree) => {
    // Find the root nodes (nodes without a parent)
    const rootNodes = tree.filter((node) => !node.parent);

    // Call the recursive function starting from the root nodes
    rootNodes.forEach((rootNode) => {
      calculateNodeValueRecursively(rootNode);
    });
    rootNodes.forEach((rootNode) => {
      let sum = 0;
      rootNode.children.forEach((child) => {
        sum += child.totalValue;
      });
      rootNode.totalValue = sum?.toFixed(2);
    });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'x') {
        setEditNodeProperties(false);
        // onClose();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', }} BackgroundColor="#000" className="wrapper" ref={reactFlowWrapper} >
      <ThemeProvider theme={theme}>
        {/* <NavbarHeader/> */}
        
        <ReactFlowProvider>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            // onEdgesChange={onEdgesChange}
            // onNodeDoubleClick={onNodeDoubleClick}
            // onNodesChange={onNodesChange}
            // onContextMenu={handleRightClick}
            // onSelectionDrag={addNewNode}
            defaultViewport={defaultViewport}
            onNodeContextMenu={onNodeContextMenu}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onNodeClick={handleSelect}
            onNodeMouseEnter={handleNodeMouseOver}
            onNodeMouseLeave={handleNodeMouseOut}
            proOptions={proOptions}
            // minZoom={0.5}
            // maxZoom={4}
            attributionPosition="bottom-left"
            // fitView = {defaultViewport}
            fitViewOptions={{ padding: 0.5 }}
          // className="bg-teal-50"
          // nodeTypes={nodeTypes}
          >
            {/* <Background variant='' /> */}
            <NodesComponent
              nodes={nodes}
              setNodes={setNodes}
              tree={tree}
              edges={edges}
              onClose={onClosePopupPanel}
              buttonClicked={buttonClicked}
              setButtonClicked={setButtonClicked}
              expandCollapse={expandCollapse}
              setEditNodeProperties={setEditNodeProperties}
              setNodeFormulapop={setNodeFormulapop}
              setExpandNodestate={setExpandNodestate}
              selectedNodeId={selectedNodeId}
              handleDelete={handleDelete}
              setSelectedNodeDelete={setSelectedNodeDelete}
              setNodedata={setNodedata}
            />
            <Background variant='' BackgroundColor="#000" />
            {/* <Background color={canvasdata.length>0 ? canvasdata[0]?.BackgroundColor : canvasConfiguration?.BackgroundColor} variant={canvasdata.length>0 ? canvasdata[0]?.Pattern : canvasConfiguration?.Pattern} lineWidth={0.1}/> */}
            {/* <Background
              color={canvasdata.length > 0 ? canvasdata[0]?.BackgroundColor : canvasConfiguration?.BackgroundColor}
              variant={canvasdata.length > 0 && canvasdata.length > 0 && canvasdata[0]?.Pattern === "Plain background"
                ? ''  
                : canvasConfiguration?.Pattern == "Plain background"? '':canvasConfiguration?.Pattern
              }
              lineWidth={canvasdata.length > 0 && canvasdata[0]?.Pattern === "Plain background" ? 0 : 0.1}
            /> */}
            {editNodeProperties && (
              <NodeProperties
                node={nodedata}
                nodes={nodes}
                setNodes={setNodes}
                setEdges={setEdges}
                setTree={setTree}
                tablenames={tablenames}
                calculateLeafNodesValues={calculateLeafNodesValues}
                onClose={onClosePopupPanel}
                setSelectedTable={setSelectedTable}
                selectedTable={selectedTable}
                setSelectedColumn={setSelectedColumn}
                selectedColumn={selectedColumn}
              />
            )}
            {openConfig && (<SettingsConfigurationPanel
              open={openConfig}
              setopenConfig={setopenConfig}
              node={selectedNodeId}
              calculateLeafNodesValues={calculateLeafNodesValues}
              nodes={nodes}
              setNodes={setNodes}
              setTree={setTree}

            />)}

            <Panel position="top-right">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "fixed",
                  right: 10,
                  top: 50,
                }}
              >
                <Tooltip title="Save All" placement="left" arrow>
                  <Button
                    onClick={handleSaveNodes}
                  >
                    <SaveIcon fontSize='large' color="#034661" />
                  </Button>
                </Tooltip>
                <Tooltip title="Configuration Settings" placement="left" arrow style={{ marginTop: "5px" }}>
                  <Button
                    onClick={handleConfig} >
                    <SettingsOutlinedIcon fontSize='large' color="#034661" />
                  </Button>
                </Tooltip>

              </div>
            </Panel>
            <Dialog
              fullScreen={fullScreen}
              open={deleteopen}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                {"Are you sure want to delete node?"}
              </DialogTitle>

              <DialogActions>
                <Button autoFocus onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleYes} >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  // Position at bottom-right
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </ReactFlow>
        </ReactFlowProvider>
      </ThemeProvider>
    </div>
  );
};

export default MainMindMap;