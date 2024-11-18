import React from "react";

import WeekBox from "widgets/calendar/WeekBox";
import AllDay from "widgets/calendar/AllDay";
import { TScheduleLabelItem } from "types";

const monthList = (nowDate: Date) => {
  const nowYear = nowDate.getFullYear();
  const nowMonth = nowDate.getMonth();

  const dayOneWeek = new Date(nowYear, nowMonth, 1).getDay();
  const dayLastWeek = new Date(nowYear, nowMonth + 1, 0).getDay();

  const result: Date[] = [];
  const prevMonthEnd = new Date(nowYear, nowMonth, 0).getDate();
  const nowMonthEnd = new Date(nowYear, nowMonth + 1, 0).getDate();

  for (let i = dayOneWeek - 1; i >= 0; i--) {
    result.push(new Date(nowYear, nowMonth - 1, prevMonthEnd - i));
  }

  for (let i = 1; i <= nowMonthEnd; i++) {
    result.push(new Date(nowYear, nowMonth, i));
  }

  for (let i = 1; i < 7 - dayLastWeek; i++) {
    result.push(new Date(nowYear, nowMonth + 1, i));
  }

  return result;
};

interface Props {
  nowDate: Date;
  setNowDate: React.Dispatch<React.SetStateAction<Date>>;
  scheduleListData: TScheduleLabelItem[][];
}

const DateBox = ({ nowDate, setNowDate, scheduleListData }: Props) => {
  const allDay: Date[] = monthList(nowDate);

  const weeks = ["일", "월", "화", "수", "목", "금", "토"];

  /**
   * 해당 달 1일 이전으로 표시되는 이전 달 날짜 개수
   */
  let count = 0;
  allDay.forEach((date) => {
    if (date.getMonth() !== nowDate.getMonth()) count++;
  });

  return (
    <article className="w-full grid grid-cols-7 mb-[24px]">
      {weeks.map((week: string) => {
        return <WeekBox key={week} weekName={week} />;
      })}

      {allDay.map((date, i) => {
        const firstDateOfMonth = new Date();
        firstDateOfMonth.setMonth(date.getMonth());
        firstDateOfMonth.setFullYear(date.getFullYear());

        return (
          <AllDay
            i={i}
            key={date.toISOString()}
            day={date}
            nowDate={nowDate}
            setNowDate={setNowDate}
            scheduleListData={scheduleListData[i - count]}
          />
        );
      })}
    </article>
  );
};

export default DateBox;
