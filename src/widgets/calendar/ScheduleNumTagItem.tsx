import React from "react";
import { TScheduleLabelItem } from "types";
import { SCHEDULE_COLOR } from "../../shared/consts/color";

const ScheduleNumTagItem: React.FC<{
  data: TScheduleLabelItem;
  color?: string;
}> = ({ data, color = SCHEDULE_COLOR[0].code }) => {
  const { type, name, count } = data;

  return (
    <div
      className="w-full rounded-[2px] h-[14px] text-[#585858] px-[4px] mb-[2px]"
      style={{ backgroundColor: color }}
    >
      <div className="flex justify-start items-center text-[8px] w-full">
        <div className="truncate ... ">{name || "개인"}</div>{" "}
        <span className="text-[8px]">{count >= 5 ? "[5+]" : `[${count}]`}</span>
      </div>
    </div>
  );
};

export default ScheduleNumTagItem;
