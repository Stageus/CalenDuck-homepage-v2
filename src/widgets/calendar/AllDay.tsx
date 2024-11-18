import React from "react";

import { useRecoilState } from "recoil";
import scheduleModalToggleAtom from "shared/recoil/scheduleModalToggleAtom";
import selectedDateAtom from "shared/recoil/selectedDateAtom";
import { TScheduleLabelItem } from "types";

import ScheduleNumTagItem from "widgets/calendar/ScheduleNumTagItem";
import { classNames } from "../../shared/utils/classNames";
import { SCHEDULE_COLOR } from "../../shared/consts/color";

interface Props {
  day: Date;
  nowDate: Date;
  setNowDate: React.Dispatch<React.SetStateAction<Date>>;
  scheduleListData: TScheduleLabelItem[];

  /**
   * 스케줄 라벨 색상 결정 요소입니다.
   */
  i: number;
}

interface ArticleProps {
  sameMonth: boolean;
  sameDay: boolean;
}

const AllDay = ({ day, nowDate, setNowDate, scheduleListData, i }: Props) => {
  const nowTime = new Date();

  const articleProps: ArticleProps = {
    sameMonth: nowDate.getMonth() === day.getMonth(),
    sameDay:
      nowTime.getFullYear() === day.getFullYear() &&
      nowTime.getMonth() === day.getMonth() &&
      nowTime.getDate() === day.getDate(),
  };

  // 해당 날짜에 해당하는 ScheduleModal 열림
  const [openModal, setOpenModal] = useRecoilState(scheduleModalToggleAtom);
  const [, setSelectedDate] = useRecoilState(selectedDateAtom);

  const openScheduleModalEvent = () => {
    setSelectedDate(day);
    setOpenModal(!openModal);
  };

  const dayClassNames = [articleProps.sameMonth && "hover:bg-[#F7F7F7]"].join(
    " "
  );

  const startColorIndex = i % SCHEDULE_COLOR.length;

  return (
    <button
      onClick={articleProps.sameMonth ? openScheduleModalEvent : undefined}
      className={`flex flex-col box-border items-center relative border-r-[1px] border-t-[1px] min-h-[98px] text-[10px] ${dayClassNames}`}
    >
      {articleProps.sameMonth ? (
        <div className="h-[24px] w-[24px] my-[2px]">
          <p
            className={classNames(
              "w-full h-full flex justify-center items-center",
              articleProps.sameDay ? "rounded-full bg-[#FF7E29] text-white" : ""
            )}
          >
            {day.getDate()}
          </p>
        </div>
      ) : null}
      {articleProps.sameMonth && (
        <div className="w-full flex flex-wrap justify-center px-[2px]">
          {scheduleListData &&
            scheduleListData.map((elem, i) => {
              return (
                <ScheduleNumTagItem
                  color={
                    SCHEDULE_COLOR[
                      (startColorIndex + i) % SCHEDULE_COLOR.length
                    ].code
                  }
                  key={elem.idx}
                  data={{
                    idx: elem.idx,
                    count: elem.count,
                    type: elem.type,
                    name: elem.name,
                  }}
                />
              );
            })}
        </div>
      )}
    </button>
  );
};

export default AllDay;
