import React from "react";
import { TScheduleLabelItem } from "types";

const ScheduleNumTagItem: React.FC<{ data: TScheduleLabelItem }> = (props) => {
  const { type, name, count } = props.data;

  return (
    <div className="w-[calc(50%-10px)] h-[27px] bg-tagColor m-[2px] px-[10px] flex justify-center rounded-[20px]">
      <div className="w-full flex justify-between items-center">
        <div className="flex justify-start text-[10px] w-full">
          <div className="truncate ... ">{name || "개인"}</div>
        </div>

        <span className="text-[10px] ">{count >= 5 ? "[5+]" : `[${count}]`}</span>
      </div>
    </div>
  );
};

export default ScheduleNumTagItem;
