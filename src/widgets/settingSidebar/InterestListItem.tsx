import React from "react";
import { SetState, TInterestItem } from "types";
import { useRegisterInterest } from "./hooks/useRegisterInterest";

interface InterestListItemProps {
  data: TInterestItem;
  refetchInterestList: () => void;

  /**
   * 내 관심사 refetch를 위한 키 state 변경 함순
   */
  refetchMyInterest: () => void;
}

const InterestListItem: React.FC<InterestListItemProps> = ({
  data,
  refetchInterestList,
  refetchMyInterest,
}) => {
  const { interestIdx, interestName } = data;

  const { mutate: registerInterest } = useRegisterInterest({
    onSuccess() {
      refetchInterestList();
      refetchMyInterest();
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
