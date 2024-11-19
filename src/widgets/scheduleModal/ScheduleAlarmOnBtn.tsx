import React from "react";
import alarmOn from "shared/imgs/alarmOn.svg";
import { useAlarmOn } from "./hooks/useAlarmOn";

// 스케줄 중요 알림 설정 POST api (/schedules/:idx/notify)
const ScheduleAlarmOnBtn: React.FC<{
  idx: number;
  setAlarm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ idx, setAlarm }) => {
  const { mutate: alarmOnByIdx } = useAlarmOn({
    onSuccess() {
      setAlarm((value) => !value);
    },
  });

  return (
    <button onClick={() => alarmOnByIdx({ idx })}>
      <img src={alarmOn} alt="알람on" className="w-full" />
    </button>
  );
};

export default ScheduleAlarmOnBtn;
