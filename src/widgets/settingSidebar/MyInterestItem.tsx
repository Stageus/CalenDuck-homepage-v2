import React from "react";
import removeInterest from "shared/imgs/removeInterest.svg";
import { TInterestItem } from "types";

interface MyInterestItemProps {
  data: TInterestItem;
  onClick: (interestIdx: number) => void;
  color: string;
}

const MyInterestItem: React.FC<MyInterestItemProps> = ({
  data,
  onClick,
  color,
}) => {
  const { interestIdx, interestName } = data;

  return (
    <div
      className="w-full h-[40px] rounded-[8px] p-[10px] mb-[8px] flex justify-between items-center"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="text-[13px] text-[#585858]">{interestName}</div>
      <button onClick={() => onClick(interestIdx)}>
        <img src={removeInterest} alt="관심사 제거" />
      </button>
    </div>
  );
};

export default MyInterestItem;
