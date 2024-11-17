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
  const month = selectedDate && (selectedDate.getMonth() + 1).toString().padStart(2, "0");
  const date = selectedDate && selectedDate.getDate().toString().padStart(2, "0");

  const { mutate: createPersonalSchedule } = useCreatePersonalSchedule({
    onSuccess() {
      alert("스케줄이 생성되었습니다.");
      setScheduleTime("");
      setPersonalContents("");
      refetchScheduleByDate();
      updateCalendarComponentKey();
    },
  });

  return (
    <>
      {/* 개인 스케줄 입력란 */}
      <article className="w-[655px] h-[15%] p-[20px] flex justify-between border-y border-black">
        <div className="w-[85%] flex items-center">
          {/* {alarm ? (
            <div onClick={clickSetAlarmEvent}>
              <ScheduleAlarmOnBtn idx={}/>
            </div>
          ) : (
            <div onClick={clickSetAlarmEvent}>
              <ScheduleAlarmOffBtn />
            </div>
          )} */}
          <div>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
          <input
            type="text"
            className="w-[350px] border border-alertColor outline-alertColor bg-transparent p-[10px] ml-[30px] items-center"
            maxLength={100}
            value={personalContents}
            onChange={(e) => setPersonalContents(e.target.value)}
          />
        </div>

        <div className="w-[10%] flex justify-center">
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
            <img src={finish} alt="제출하기" />
          </button>
        </div>
      </article>
    </>
  );
};

export default PostNewPersonalScheduleItem;
