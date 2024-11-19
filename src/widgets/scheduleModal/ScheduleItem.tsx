import React, { useState, useRef } from "react";

import ScheduleAlarmOnBtn from "widgets/scheduleModal/ScheduleAlarmOnBtn";
import ScheduleAlarmOffBtn from "widgets/scheduleModal/ScheduleAlarmOffBtn";
import edit from "shared/imgs/edit.svg";
import finish from "shared/imgs/finish.svg";
import DeletePersonalScheduleItem from "./DeletePersonalScheduleItem";
import { useRecoilState } from "recoil";
import selectedDateAtom from "shared/recoil/selectedDateAtom";
import { ScheduleDetailModel } from "./hooks/useGetScheduleByDate";
import { useUpdateScheduleByIdx } from "./hooks/useUpdateScheduleByIdx";
import { classNames } from "../../shared/utils/classNames";
import scheduleModalToggleAtom from "../../shared/recoil/scheduleModalToggleAtom";

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
  const scheduleDate = new Date(time);
  const [scheduleContents, setScheduleContents] = useState(contents);
  const [scheduleTime, setScheduleTime] = useState(
    `${scheduleDate.getHours().toString().padStart(2, "0")}:${scheduleDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`
  );
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
      className={classNames(
        `relative w-full h-[60px] rounded-[12px] flex items-center px-[18px] mb-[16px]`,
        editing ? "bg-[#FFF6ED]" : "bg-[#F7F7F7]"
      )}
    >
      <div className="h-[60px] flex items-center">
        <div className="mr-[36px] h-[24px]">
          {!alarm ? (
            <ScheduleAlarmOnBtn setAlarm={setAlarm} idx={idx} />
          ) : (
            <ScheduleAlarmOffBtn setAlarm={setAlarm} idx={idx} />
          )}
        </div>
        <div className="w-[56px] mr-[6px] text-[13px] text-[#585858]">
          {getTimeString(time)}
        </div>

        <div className="text-[13px] text-[#585858] w-[60px]">
          {name || "개인"}
        </div>

        {editing ? (
          <input
            type="text"
            className="w-[280px] text-[#585858] h-[22px] text-[13px] border-b-[1px] outline-none	bg-transparent items-center"
            ref={titleRef}
            defaultValue={contents}
            maxLength={20}
            onChange={(e) => setScheduleContents(e.target.value)}
          />
        ) : (
          <div className="w-[280px] text-[13px] text-[#585858] flex items-center mr-[42px]">
            {contents}
          </div>
        )}
      </div>

      {/* 개인 스케줄일 때에만 수정 및 삭제 가능 */}
      {type === "personal" && (
        <div className="flex absolute right-[18px]">
          {editing ? (
            <button
              className="w-[65px] h-[38px] right-0 top-[50%] text-[#FF7E29] text-[13px]"
              onClick={() => {
                if (!scheduleTime) {
                  return alert("시간을 선택해주세요.");
                }

                updateScheduleByIdx({
                  idx,
                  personalContents: scheduleContents,
                  fullDate: `${year}${month}${date} ${scheduleTime}`,
                });
              }}
            >
              수정하기
            </button>
          ) : (
            <>
              <button onClick={editTitleEvent} className="mr-[12px]">
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
