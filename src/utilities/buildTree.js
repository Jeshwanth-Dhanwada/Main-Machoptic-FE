import { Edgesdata } from '../component/EdgeConfig'
import ReactFlow, {
   MarkerType, Background, applyNodeChanges,
} from 'reactflow';
import '../component/updatenode.css';

export function buildTree(nodess) {

  const nodeMap = new Map();
  const tree = [];
  // Create a map of nodes with their ID as the key
  nodess.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // Build the tree structure
  nodess.forEach(node => {
    const currentNode = nodeMap.get(node.id);

    if (node.parent === "" || null) {
      tree.push(currentNode);
    } else {
      const parentNode = nodeMap.get(node.parent);
      if (parentNode) {
        parentNode.children.push(currentNode);
      } else {
        console.warn(`Parent node ${node.parent} not found for node ${node.id}`);
      }
    }
  });
  return tree; // Assuming there's only one root node
}

export const convertTreeToNodes = (node,nodeconfig) => {
  const Latestnodes = [];
  // console.log('convertTreeToNodes',node.value,node.children.length == 0|| "" ? node.value : "test node")
  // If node is not collapsed, process its children recursively
  console.log("check node:",node.parent)
  if (!node.Collapsed) {
    node.children.forEach((child) => {
      Latestnodes.push(...convertTreeToNodes(child)); // Recursively add child nodes
    });
  }
  Latestnodes.push({
    nodeId: node?.nodeId,
    id: node.id,
    data: {
      label: (
        // <div className=" flex flex-col justify-center items-center font-sans font-normal">
        <div className=" d-flex flex-row">
          <span style={{ fontSize: "6px" }}>
            {node.nodeName
              ? node.nodeName
              : node.data?.label?.props?.children?.props?.children[0] || 'Default Name'}
            <span style={{ fontSize: "6px" }}>({node.children.length == 0|| "" ? (node.checkFlag ? node.value : node.aggregatedvalue) : (node.parent == ""?node.totalValue:node.value)})</span>  {/* Dynamic time */}
          </span>
          {/* <div className='bg-gray-200 rounded-sm' style={{ padding: '1px' }}>
            ({node.diffval || '50'}-{node.diffval || '30'}) 
          </div> */}

        </div>
        // node.nodeName
        // node.nodeName? node.nodeName : node.data.label.props.children[0].props?.children[0]+" " + node.data.label.props.children[0].props?.children[1].props.children
      ),
    },
    sourcePosition: node.sourcePosition,
    targetPosition: node.targetPosition == "bottom" ? null : node.targetPosition,
    position: node.position || { x: node.xPosition || 0, y: node.yPosition || 0 },  // Simplified position fallback
    hover: true,
    level: Number(node.level),
    childLength: node.children.length,
    parent: node.parent,
    Collapsed: node.Collapsed,
    constant: node.constant,
    value: node.value,
    datatable:node.datatable,
    datacolumn:node.datacolumn,
    checkFlag:node.checkFlag,
    aggregatedvalue:node.aggregatedvalue,
    width: node.width ? parseInt(node.width) : 80,  // Default width if missing
    height: node.height ? parseInt(node.height) : 20,  // Default height if missing
    style: {
      borderRadius: '50px',
      background: node.nodeName === "RootNode" ? "#08A64F" : node.backgroundColor,  // Fixed RootNode condition
      borderColor: '#CECECE',
      borderWidth: '1px',
      
      fontSize: "6px", // Set the font size
      fontStyle: node.fontStyle, // Set the font style
      width: node.width ? parseInt(node.width) : 80,  // Default width if missing
      height: node.height ? parseInt(node.height) : 20,  // Default height if missing
      color: node.FontColor,
    },
  });

  // console.log("=================> convert tree to nodes:", Latestnodes);
  return Latestnodes;
};

export  const convertTreeToEdges = (node,edges) => {
  const latestedges = [];

  // If the node is not collapsed, add edges to its children
  if (!node.Collapsed) {
      node.children.forEach((child) => {
          // Create an edge from the current node to the child
          latestedges.push({
              id: `${node.id}-${child.id}`,
              edgeId: node?.edgeId,
              source: node.id,
              target: child.id,
              type: Edgesdata?.length > 0 ? String(Edgesdata[0]?.EdgeType) : String(edges?.EdgeType),
              animated:Edgesdata?.length > 0 ? Edgesdata[0]?.EdgeAnimation : edges?.EdgeAnimation,
              style: { 
                  // strokeWidth: Edgesdata?.length > 0 ? Edgesdata[0]?.EdgeThickness :"1", 
                  stroke: Edgesdata?.length > 0 ? Edgesdata[0]?.EdgeColor : edges?.EdgeColor,
              },
              // markerEnd: {
              //     type: MarkerType.Arrow,
              //     width: 10,
              //     height: 10,
              //     color: "#000",
              //   },

          });
          // Recursively add edges from the child node
          latestedges.push(...convertTreeToEdges(child));
      });
  }
  return latestedges;
};


// export const convertTreeToEdges = (node) => {
//     const latestedges = [];

//     // If the node is not collapsed, add edges to its children
//     if (!node.Collapsed) {
//       node.children.forEach((child) => {
//         // Create an edge from the current node to the child
//         latestedges.push({
//           // id: `${node.id}-${child.id}`,
//           // source: node.id,
//           // target: child.id,
//           id: `${node.id}-${child.id}`,
//           edgeId: node?.edgeId,
//           source: node.id,
//           target: child.id,
//           type: "simplebezier",
//           style: { strokeWidth: 1 },
//           // style: { strokeWidth: data.strokeWidth, stroke: data.stroke }
//           // markerEnd: {

//         });
//         // Recursively add edges from the child node
//         latestedges.push(...convertTreeToEdges(child));
//       });
//     }
//     return latestedges;
//   };

export const convertArrayToObject = (array) => {
  if (Array.isArray(array) && array.length >= 1) {
    return array[0];
  } else {
    throw new Error('Input must be an array with a single tree node.');
  }
};