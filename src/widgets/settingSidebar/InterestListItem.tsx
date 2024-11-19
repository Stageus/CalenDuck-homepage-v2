import React from "react";
import { TInterestItem } from "types";
import { useRegisterInterest } from "./hooks/useRegisterInterest";

interface InterestListItemProps {
  data: TInterestItem;
  refetchInterestList: () => void;
}

const InterestListItem: React.FC<InterestListItemProps> = ({
  data,
  refetchInterestList,
}) => {
  const { interestIdx, interestName } = data;

  const { mutate: registerInterest } = useRegisterInterest({
    onSuccess() {
      refetchInterestList();
    },
  });

  return (
    <button
      onClick={() => registerInterest(interestIdx)}
      className="h-[26px] border px-[12px] flex justify-between items-center rounded-[15px] border-[#E3E3E3] text-[12px] text-[#585858] hover:bg-[#eeeeee]"
    >
      {interestName}+
    </button>
  );
};

export default InterestListItem;
