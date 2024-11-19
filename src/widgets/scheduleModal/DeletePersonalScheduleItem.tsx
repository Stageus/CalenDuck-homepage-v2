import React from "react";
import remove from "shared/imgs/remove.svg";
import { ScheduleDetailModel } from "./hooks/useGetScheduleByDate";
import { useDeleteScheduleByIdx } from "./hooks/useDeleteScheduleByIdx";

type Props = {
  schedule: ScheduleDetailModel;
  updateCalendarComponentKey: () => void;
  refetchScheduleByDate: () => void;
};

const DeletePersonalScheduleItem: React.FC<Props> = ({
  schedule,
  updateCalendarComponentKey,
  refetchScheduleByDate,
}) => {
  const { idx } = schedule;

  const { mutate: deletePersonalScheduleByIdx } = useDeleteScheduleByIdx({
    onSuccess() {
      updateCalendarComponentKey();
      refetchScheduleByDate();
    },
  });

  return (
    <button
      onClick={() => {
        const confirmState = window.confirm("정말 삭제하시겠습니까?");

        if (confirmState) {
          deletePersonalScheduleByIdx(idx);
        }
      }}
    >
      <img src={remove} alt="삭제하기" />
    </button>
  );
};

export default DeletePersonalScheduleItem;
