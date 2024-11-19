import React, { useEffect, useState } from "react";

import HeaderSidebarContainer from "shared/components/HeaderSidebarContainer";
import CalendarItem from "widgets/calendar/CalendarItem";
import ScheduleModal from "widgets/scheduleModal/ScheduleModal";

import { useRecoilState } from "recoil";
import scheduleModalToggleAtom from "shared/recoil/scheduleModalToggleAtom";
import selectedDateAtom from "shared/recoil/selectedDateAtom";

const MainPage = () => {
  // 해당 날짜에 해당하는 ScheduleModal 열림
  const [openModal, setOpenModal] = useRecoilState(scheduleModalToggleAtom);
  const [, setSelectedDate] = useRecoilState(selectedDateAtom);

  const openScheduleModalEvent = () => {
    setOpenModal(!openModal);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    openScheduleModalEvent();
  };

  const [calendarComponentKey, setCalendarComponentKey] = useState(1);

  const updateCalendarComponentKey = () => {
    setCalendarComponentKey((value) => value + 1);
  };

  return (
    <>
      <HeaderSidebarContainer />
      <div className="bg-[#FFF6ED] h-[100vh] pt-[56px]">
        <div className="max-w-[900px] w-full mx-auto">
          <article className="flex flex-col flex-grow">
            <CalendarItem
              onDateClick={handleDateClick}
              key={calendarComponentKey}
            />
          </article>
        </div>
      </div>

      {/* 스케줄 모달 */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div
            className="fixed inset-0 bg-lightgrayColor opacity-50"
            onClick={openScheduleModalEvent}
          ></div>
          <ScheduleModal
            updateCalendarComponentKey={updateCalendarComponentKey}
          />
        </div>
      )}
    </>
  );
};
export default MainPage;
