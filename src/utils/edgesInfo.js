import { MarkerType } from "reactflow";
export const newEdgeForShowel = (name, source, target,hidden) => {
    return {
       id: name,
       edgeId: name,
       sourceNodeId: source,
       targetNodeId: target,
       source,
       target,
       routeId: name,
       type: "smoothstep",
       label: "",
       markerEnd: {
         type: MarkerType.ArrowClosed,
         width: 25,
         height: 25,
         color: "#000",
         arrow: true,
       },
       style: { strokeWidth: 1, stroke: "#000" },
       animated: false,
       hidden
     };
 }