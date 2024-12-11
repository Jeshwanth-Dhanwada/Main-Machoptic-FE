
export const generateJSONDataForNodes = (Nodesdata) => {
  // console.log('generating JSON data for nodes:', Nodesdata)
    const jsonData = {
      nodes: Nodesdata.map((node) => ({
        nodeId: node.nodeId,
        id: node.id,
        nodeName: node.nodeName?node.nodeName :node.data.label.props?.children.props.children[0] || " default label",
        // nodeName:"child",
        // nodeName: node.data.label?.props?.children[0].props?.children[0] || "child",
        width: String(node.style.width),
        height: String(node.style.height),
        xPosition: node.position.x,
        yPosition: node.position.y,
        backgroundColor: node.style.background,
        borderRadius: node.style.borderRadius,
        borderWidth: node.style.borderWidth,
        borderColor: node.style.borderColor,
        fillColor: node.style.fillColor,
        sourcePosition: "right",
        targetPosition: "left",
        FontColor: node.style.color,
        FontStyle: node.style.fontStyle,
        parent: node.parent,
        FontSize: node.style.fontSize,
        level: node.level,
        Collapsed: node.Collapsed,
        userId: '101',
        type: "",
        constant: node.constant,
        value: Number(node.value),
        datatable:node.datatable,
        datacolumn:node.datacolumn,
        checkFlag:node.checkFlag,
        aggregatedvalue:node.aggregatedvalue

      })),
    };
    // console.log('generating JSON data for nodes:',jsonData)

    return JSON.stringify(jsonData);
  };

  export const generateJSONDataForEdges = (edges) => {
    const jsonData = {
      edges: edges.map((edge) => ({
        id: edge.id,
        edgeId: edge.edgeId,
        sourceId: edge.source,
        targetId: edge.target,
        type: edge.type,
        arrow: false,
        strokeWidth: 1,
        stroke: "1",
        userId: "101",
      })),
    };
    // const jsonString = flatted.stringify(jsonData);
    // return jsonString;
    return JSON.stringify(jsonData); // Use null and 2 for pretty formatting
  };
