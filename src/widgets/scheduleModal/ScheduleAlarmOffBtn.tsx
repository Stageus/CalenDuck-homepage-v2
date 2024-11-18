import React from "react";
import { useCookies } from "react-cookie";
import alarmOffIcon from "shared/imgs/alarmOff.svg";
import { useAlarmOff } from "./hooks/useAlarmOff";

const ScheduleAlarmOffBtn: React.FC<{
  idx: number;
  setAlarm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ idx, setAlarm }) => {
  const { mutate: alarmOff } = useAlarmOff({
    onSuccess() {
      setAlarm((value) => !value);
    },
  });

  return (
    <button onClick={() => alarmOff({ idx })} className="w-[25px] mr-[20px]">
      <img src={alarmOffIcon} alt="알람off" className="w-full" />
    </button>
  );
};

export default ScheduleAlarmOffBtn;
