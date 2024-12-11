import { NODE_HEIGHT, NODE_WIDTH } from "../constants/chartlConstants";

export const newNodeForShovel = (name, value, x, y, hidden, color, onDoubbleClick, sourcePosition="bottom", targetPosition="top", label, hiperLink) => {
    return {
      nodeValue:value,
      // dragHandle: '.custom-drag-handle',
      hidden,
      id: name,
      nodeType: 'selectorNode',
      type: "selectorNode",
      nodeCategory: '',
      position: {
        x: x, // Generate a random x-coordinate within a reasonable range
        y: y, // Generate a random y-coordinate within a reasonable range
      },
      data: {
        label: hiperLink ? label : label ? `${label} (${value})` : `${name.split("-").slice(1).join("-")} (${value})`,
        id:name,
        style: {
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          height: "100%",
          alignItems: "center"
        },
        onDoubbleClick:onDoubbleClick,
        color
      },
      sourcePosition,
      targetPosition,
      style: {
        background: color, // Set background color
        color: 'black',     // Set text color
        borderColor: '#000',
        borderStyle: 'solid',
        borderWidth: '1px',
        fontSize: '14px', // Set the font size
        fontStyle: 'normal', // Set the font style
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        justifycontent: 'center', /* Horizontally center */
        alignitems: 'center'/* Vertically center */
      },
    };
  }