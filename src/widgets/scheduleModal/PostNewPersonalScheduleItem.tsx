import { useState } from "react";
import ScheduleAlarmOnBtn from "widgets/scheduleModal/ScheduleAlarmOnBtn";
import ScheduleAlarmOffBtn from "widgets/scheduleModal/ScheduleAlarmOffBtn";
import finish from "shared/imgs/finish.svg";
import { useRecoilState } from "recoil";
import selectedDateAtom from "shared/recoil/selectedDateAtom";
import { useCreatePersonalSchedule } from "./hooks/useCreatePersonalSchedule";

type Props = {
  refetchScheduleByDate: () => void;
  updateCalendarComponentKey: () => void;
};

const PostNewPersonalScheduleItem = ({
  refetchScheduleByDate,
  updateCalendarComponentKey,
}: Props) => {
  // 스케줄 알람 여부 토글
  const [alarm, setAlarm] = useState<boolean>(false);
  const clickSetAlarmEvent = () => {
    setAlarm(!alarm);
  };

  const [scheduleTime, setScheduleTime] = useState("");
  const [personalContents, setPersonalContents] = useState("");
  const [selectedDate] = useRecoilState(selectedDateAtom);
  const year = selectedDate && selectedDate.getFullYear();
  const month =
    selectedDate && (selectedDate.getMonth() + 1).toString().padStart(2, "0");
  const date =
    selectedDate && selectedDate.getDate().toString().padStart(2, "0");

  const { mutate: createPersonalSchedule } = useCreatePersonalSchedule({
    onSuccess() {
      setScheduleTime("");
      setPersonalContents("");
      refetchScheduleByDate();
      updateCalendarComponentKey();
    },
  });

  return (
    <>
      {/* 개인 스케줄 입력란 */}
      <article className="w-full h-[60px] flex items-center px-[9px] justify-between border-[#E3E3E3] border rounded-[12px]">
        <div className="flex items-center">
          <div className="h-[42px] rounded-[12px] flex items-center justify-center mr-[9px] bg-[#F7F7F7]">
            <input
              type="time"
              value={scheduleTime}
              className="px-[10px] outline-none"
              style={{
                background: "none",
              }}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
          <input
            type="text"
            className="w-[355px] outline-none bg-[#F7F7F7] h-[42px] rounded-[12px] text-[14px] pl-[10px]"
            maxLength={100}
            placeholder="개인 스케줄을 입력하세요."
            value={personalContents}
            onChange={(e) => setPersonalContents(e.target.value)}
          />
        </div>

        <div className="w-[89px] flex justify-center h-[42px] bg-[#FF7F50] rounded-[8px] text-white">
          <button
            onClick={() => {
              if (!scheduleTime) {
                return alert("시간을 선택해주세요");
              }

              createPersonalSchedule({
                fullDate: `${year}${month}${date} ${scheduleTime}`,
                personalContents,
              });
            }}
          >
            등록하기
          </button>
        </div>
      </article>
    </>
  );
};

export default PostNewPersonalScheduleItem;
