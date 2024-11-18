import React from "react";
import { TScheduleLabelItem } from "types";

const ScheduleNumTagItem: React.FC<{ data: TScheduleLabelItem }> = (props) => {
  const { type, name, count } = props.data;

  return (
    <div className="w-full rounded-[2px] h-[14px] bg-tagColor text-[#585858] px-[4px] mb-[2px]">
      <div className="flex justify-start items-center text-[8px] w-full">
        <div className="truncate ... ">{name || "개인"}</div>{" "}
        <span className="text-[8px]">{count >= 5 ? "[5+]" : `[${count}]`}</span>
      </div>
    </div>
  );
};

export default ScheduleNumTagItem;
