export const createNodeData = (filter) => filter.map((data) => ({
    nodeId: data.nodeId,
    width: data.width,
    height: data.height,
    id: data.id,
    data: 
    // { label: data.nodeImage !== " " ? data.nodeName.split(' ').join('\n') :data.nodeName  },
    { label: data.nodeName.split(' ').join('\n') },
    // {label : data.nodeName},
    // { label:
    // <div>
    //     <span>{data.nodeName}</span>
    // </div>},
    nodeType: data.nodeType,
    MachineType: data.MachineType,
    type: data.type,
    nodeCategory: data.nodeCategory,
    unit1Measurable: data.unit1Measurable,
    parentNode: data.parentNode,
    extent: data.extent,
    unit2Mandatory: data.unit2Mandatory,
    iconId: data.iconId,
    itemDescription: data.itemDescription,
    sourcePosition: data.sourcePosition,
    targetPosition: data.targetPosition,
    nodeImage: data.nodeImage,
    percentage_rejects: data.percentage_rejects,
    position: { x: data.xPosition, y: data.yPosition },
    date: data.date,
    style: {
        background: data.fillColor,
        color: data.FontColor,
        borderColor: data.borderColor,
        borderStyle: data.borderStyle,
        borderWidth: data.borderWidth,
        fontSize: data.FontSize,
        fontStyle: data.FontStyle,
        width: data.width,
        height: data.height,
        borderRadius: data.borderRadius,
        display: data.borderRadius ? "flex" : "",
        alignItems: "center",
        justifyContent: data.nodeImage !== "" && data.nodeImage !== null ? "flex-start" : "",
        borderLeftWidth: data.nodeType  === 'Machine' ? data.borderLeftWidth : data.borderWidth, // Set left border width to 10px
        borderLeftColor: data.nodeType  === 'Machine' ? data.borderLeftColor : data.borderColor, // Set left border color to red (you can change this to any color)
        boxShadow: data.nodeType  === 'Machine' || data.nodeType  === 'Material'  ?  '0px 2px 5px #888' : '', // Set left border color to red (you can change this to any color)
    },
}));


// let x = [];
        // for (let index = 0; index < filter.length; index++) {
        //   const data = filter[index];
        //   x.push({
        //     nodeId: data.nodeId,
        //     width: data.width,
        //     height: data.height,
        //     id: data.id,
        //     data: { label: data.nodeName },
        //     nodeType: data.nodeType,
        //     MachineType: data.MachineType,
        //     type: data.type,
        //     nodeCategory: data.nodeCategory,
        //     unit1Measurable: data.unit1Measurable,
        //     parentNode: data.parentNode,
        //     extent: data.extent,
        //     unit2Mandatory: data.unit2Mandatory,
        //     iconId: data.iconId,
        //     itemDescription: data.itemDescription,
        //     sourcePosition: data.sourcePosition,
        //     targetPosition: data.targetPosition,
        //     nodeImage: data.nodeImage,
        //     percentage_rejects: data.percentage_rejects,
        //     position: { x: data.xPosition, y: data.yPosition },
        //     style: {
        //       background: data.fillColor, // Set background color
        //       color: data.FontColor, // Set text color
        //       borderColor: data.borderColor,
        //       borderStyle: data.borderStyle,
        //       borderWidth: data.borderWidth,
        //       fontSize: data.FontSize, // Set the font size
        //       fontStyle: data.FontStyle, // Set the font style
        //       width: data.width,
        //       height: data.height,
        //       borderRadius: data.borderRadius,
        //       display: data.borderRadius ? "flex" : "",
        //       alignItems: data.nodeImage !== "" ? "flex-start" : "",
        //       justifyContent: "center",
        //       borderLeftWidth: data.nodeType  === 'Machine' ? '15px' : data.borderWidth, // Set left border width to 10px
        //       borderLeftColor: data.nodeType  === 'Machine' ? 'red' : data.borderColor, // Set left border color to red (you can change this to any color)
        //     },
        //   });
        // }