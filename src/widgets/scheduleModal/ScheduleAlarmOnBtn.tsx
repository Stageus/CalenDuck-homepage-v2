import React from "react";
import alarmOn from "shared/imgs/alarmOn.svg";
import { useAlarmOn } from "./hooks/useAlarmOn";

// 스케줄 중요 알림 설정 POST api (/schedules/:idx/notify)
const ScheduleAlarmOnBtn: React.FC<{ idx: number }> = ({ idx }) => {
  const { mutate: alarmOnByIdx } = useAlarmOn({
    onSuccess() {},
  });

  return (
    <button
      onClick={() => {
        alarmOnByIdx({ idx });
      }}
      className="w-[25px] mr-[20px]"
    >
      <img src={alarmOn} alt="알람on" className="w-full" />
    </button>
  );
};

export default ScheduleAlarmOnBtn;
