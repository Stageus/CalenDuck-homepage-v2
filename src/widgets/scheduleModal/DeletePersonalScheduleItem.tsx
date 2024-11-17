import React from "react";
import remove from "shared/imgs/remove.svg";
import { ScheduleDetailModel } from "./hooks/useGetScheduleByDate";
import { useAlarmOff } from "./hooks/useAlarmOff";

type Props = {
  schedule: ScheduleDetailModel;
};

const DeletePersonalScheduleItem: React.FC<Props> = ({ schedule }) => {
  const { idx } = schedule;
  const { mutate: alarmOff } = useAlarmOff({});

  return (
    <button onClick={() => alarmOff({ idx })}>
      <img src={remove} alt="삭제하기" />
    </button>
  );
};

export default DeletePersonalScheduleItem;
