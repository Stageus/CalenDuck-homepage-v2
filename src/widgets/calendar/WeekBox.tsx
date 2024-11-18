import React from "react";

interface Props {
  weekName: string;
}

const WeekBox = ({ weekName }: Props) => {
  return (
    <article className="w-full flex justify-center items-center h-[24px]">
      <p className="text-[12px] text-[#252525]">{weekName}</p>
    </article>
  );
};

export default WeekBox;
