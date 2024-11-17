import React, { useState, useRef } from "react";

import ScheduleAlarmOnBtn from "widgets/scheduleModal/ScheduleAlarmOnBtn";
import ScheduleAlarmOffBtn from "widgets/scheduleModal/ScheduleAlarmOffBtn";
import edit from "shared/imgs/edit.svg";
import finish from "shared/imgs/finish.svg";
import { useCookies } from "react-cookie";
import DeletePersonalScheduleItem from "./DeletePersonalScheduleItem";
import { useRecoilState } from "recoil";
import selectedDateAtom from "shared/recoil/selectedDateAtom";
import { ScheduleDetailModel } from "./hooks/useGetScheduleByDate";
import { useUpdateScheduleByIdx } from "./hooks/useUpdateScheduleByIdx";

type Props = {
  data: ScheduleDetailModel;
  updateCalendarComponentKey: () => void;
  refetchScheduleByDate: () => void;
};

const ScheduleItem: React.FC<Props> = ({
  data: schedule,
  updateCalendarComponentKey,
  refetchScheduleByDate,
}) => {
  const { idx, name, time, type, contents, priority } = schedule;
  const [cookies] = useCookies(["token"]);

  // 스케줄 알람 여부 버튼 토글
  const [alarm, setAlarm] = useState<boolean>(priority);

  const getTimeString = (time: string) => {
    const date = new Date(time);

    return (
      date.getHours().toString().padStart(2, "0") +
      " : " +
      date.getMinutes().toString().padStart(2, "0")
    );
  };

  // 수정 중인 타이틀 반영
  const titleRef = useRef<HTMLInputElement>(null);

  // 수정하기 버튼 클릭 시
  // 1. title input이 editable하게 됨
  // 2. 기존 수정&삭제 버튼이 완료 버튼으로 변경됨
  const [editing, setEditing] = useState<boolean>(false);
  const editTitleEvent = () => {
    setEditing(!editing);
    if (!editing && titleRef.current) {
      titleRef.current.value = contents;
    }
  };
  // Edit을 위한 값
  const [scheduleContents, setScheduleContents] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedDate] = useRecoilState(selectedDateAtom);
  const year = selectedDate && selectedDate.getFullYear();
  const month =
    selectedDate && (selectedDate.getMonth() + 1).toString().padStart(2, "0");
  const date =
    selectedDate && selectedDate.getDate().toString().padStart(2, "0");

  const { mutate: updateScheduleByIdx } = useUpdateScheduleByIdx({
    onSuccess() {
      setEditing(false);
      refetchScheduleByDate();
    },
  });

  return (
    <article
      className={`${
        editing ? "bg-tagColor" : "bg-lightgrayColor"
      } w-[638px] h-[70px] rounded-[5px] flex justify-between items-center p-[20px] m-[5px]`}
    >
      <div className="w-[80%] flex items-center">
        {!alarm ? (
          <div>
            <ScheduleAlarmOnBtn setAlarm={setAlarm} idx={idx} />
          </div>
        ) : (
          <div>
            <ScheduleAlarmOffBtn setAlarm={setAlarm} idx={idx} />
          </div>
        )}

        {editing ? (
          <input
            type="time"
            onChange={(e) => setScheduleTime(e.target.value)}
          />
        ) : (
          <div className="w-[15%]">{getTimeString(time)}</div>
        )}

        {type === "interest" && <div className="w-[20%]">{name}</div>}

        {editing ? (
          <input
            type="text"
            className="w-[350px] outline-alertColor	bg-transparent p-[10px] items-center"
            ref={titleRef}
            defaultValue={contents}
            maxLength={20}
            onChange={(e) => setScheduleContents(e.target.value)}
          />
        ) : (
          <div className="w-[350px] h-[40px] flex items-center">{contents}</div>
        )}
      </div>

      {/* 개인 스케줄일 때에만 수정 및 삭제 가능 */}
      {type === "personal" && (
        <div
          className={`w-[13%] flex ${
            editing ? "justify-center" : "justify-between"
          }`}
        >
          {editing ? (
            <>
              <button
                onClick={() =>
                  updateScheduleByIdx({
                    idx,
                    personalContents: scheduleContents,
                    fullDate: `${year}${month}${date} ${scheduleTime}`,
                  })
                }
              >
                <img src={finish} alt="제출하기" />
              </button>
            </>
          ) : (
            <>
              <button onClick={editTitleEvent}>
                <img src={edit} alt="수정하기" />
              </button>
              <DeletePersonalScheduleItem
                schedule={schedule}
                refetchScheduleByDate={refetchScheduleByDate}
                updateCalendarComponentKey={updateCalendarComponentKey}
              />
            </>
          )}
        </div>
      )}
    </article>
  );
};

export default ScheduleItem;
