import React, { memo } from "react";
import { BiFontSize } from "react-icons/bi";
import { Handle, Position,height } from "reactflow";

function CustomNode({ data }) {
  console.log("data...", data);
  return (
    <div className="bg-white w-32 h-9 px-1 shadow-md border flex justify-center items-center ">
      <div className=" flex flex-col justify-center items-center font-sans font-normal">
        <div className="font-sans font-normal"> {data.label} (0 min)</div>
          <div className=" bg-gray-200 rounded-sm p-px">18.5 - 18.5</div>
       
        {/* <div className="text-black-100 font-normal">{data.label}</div> */}

        {/* <div className="w-20 h-1 flex justify-center items-center bg-white px-4 py-2 shadow-md border-2 rounded-md border-stone-400 ">
        </div> */}
        {/* <div className=" w-20 h-1 text-gray-500 flex justify-center items-center bg-gray-100">
          {data.label}
        </div> */}
        {/* <div className="text-xs">{data.label}</div> */}
        {/* <div className="text-gray-500 flex justify-center items-center bg-gray-100"> */}
        {/* <div className="text-gray-500">{data.job}</div> */}
        {/* </div> */}
      </div>
      <Handle type="target" position={Position.Left} className="!bg-teal-500"  />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-teal-500"
      />
    </div>
  );
}

export default memo(CustomNode);
