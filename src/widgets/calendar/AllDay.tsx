import React from "react";

import { useRecoilState } from "recoil";
import scheduleModalToggleAtom from "shared/recoil/scheduleModalToggleAtom";
import selectedDateAtom from "shared/recoil/selectedDateAtom";
import { TScheduleLabelItem } from "types";

import ScheduleNumTagItem from "widgets/calendar/ScheduleNumTagItem";
import { classNames } from "../../shared/utils/classNames";

interface Props {
  day: Date;
  nowDate: Date;
  setNowDate: React.Dispatch<React.SetStateAction<Date>>;
  scheduleListData?: TScheduleLabelItem[];
}

interface ArticleProps {
  sameMonth: boolean;
  sameDay: boolean;
}

const AllDay = ({ day, nowDate, setNowDate, scheduleListData }: Props) => {
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

  const dayClassNames = [articleProps.sameMonth && "hover:bg-subColor"].join(" ");
  const numClassNames = [
    articleProps.sameMonth ? "font-semibold" : "font-thin",
    articleProps.sameDay ? "text-alertColor" : "text-black",
  ].join(" ");

  return (
    <button
      onClick={articleProps.sameMonth ? openScheduleModalEvent : undefined}
      className={`relative border justify-center items-center h-[180px] flex-wrap content-between ${dayClassNames}`}
    >
      <p className={classNames(numClassNames, "absolute top-0 right-[10px] text-[24px]")}>
        {day.getDate()}
      </p>
      {articleProps.sameMonth && (
        <div className="flex flex-wrap justify-center">
          {scheduleListData &&
            scheduleListData.map((elem) => {
              return (
                <ScheduleNumTagItem
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
