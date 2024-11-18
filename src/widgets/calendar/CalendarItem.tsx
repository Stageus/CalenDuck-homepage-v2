import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DateBox from "widgets/calendar/DateBox";
import { useGetScheduleAll } from "./hooks/useGetScheduleAll";
import { useGetSelectedYearMonth } from "../../shared/hooks/useGetSelectedYearMonth";
import { useGetMyInterest } from "./hooks/useGetMyInterest";
import CustomDropDown from "../../shared/components/CustomDropDown";
import { MONTH, YEAR } from "../../shared/consts/date";

// TODO: 이거 어디에 쓰는건지 판단 필요함
interface CalendarItemProps {
  onDateClick: (date: Date) => void;
}

const CalendarItem: React.FC<CalendarItemProps> = ({ onDateClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParam = new URLSearchParams();

  const urlSearch = new URLSearchParams(location.search);

  const { data: myInterest } = useGetMyInterest();

  const getSelectedYearMonth = useGetSelectedYearMonth();

  const [nowDate, setNowDate] = useState<Date>(new Date());

  useEffect(() => {
    const newDate = new Date(
      Number(getSelectedYearMonth().year),
      Number(getSelectedYearMonth().month) - 1
    );
    setNowDate(newDate);
  }, [location.search]);

  const { data: personalScheduleData } = useGetScheduleAll(
    getSelectedYearMonth().yearMonth
  );

  const managingInterest = urlSearch.get("interest");

  if (!personalScheduleData) {
    return <></>;
  }

  return (
    <section className="w-full h-[80vh] flex flex-col mt-[70px]">
      {/* 드롭다운 선택 부분 */}
      <article className="w-[25%] flex justify-between items-end">
        {managingInterest ? (
          // manager 계정으로 로그인
          <div className="flex flex-col">
            <span className="text-xs">👑 내가 관리자인 관심사</span>
            <span className="text-xl font-bold">{managingInterest}</span>
          </div>
        ) : (
          // general 계정으로 로그인
          myInterest && (
            <CustomDropDown
              options={[
                {
                  value: -1,
                  display: "전체보기",
                },
                ...myInterest.list.map((interest) => ({
                  value: interest.interestIdx,
                  display: interest.interestName,
                })),
              ]}
              onChange={(value) => {
                console.log(value);
              }}
            />
          )
        )}

        <CustomDropDown
          options={YEAR.map((year) => ({ value: year, display: year }))}
          onChange={(selectedOption) => {
            searchParam.set(
              "date",
              `${selectedOption.value}${getSelectedYearMonth().month}`
            );

            navigate(`/main?${searchParam.toString()}`, { replace: true });
          }}
          selectedIdx={YEAR.findIndex(
            (year) => year === getSelectedYearMonth().year
          )}
        />
        <CustomDropDown
          options={MONTH.map((month) => ({ value: month, display: month }))}
          onChange={(selectedOption) => {
            searchParam.set(
              "date",
              `${getSelectedYearMonth().year}${selectedOption.value}`
            );

            navigate(`/main?${searchParam.toString()}`, { replace: true });
          }}
          selectedIdx={MONTH.findIndex(
            (month) => month === getSelectedYearMonth().month
          )}
        />

        {/* <DropDownItem
          options={YEAR}
          value={selectedYear}
          onChange={handleYearChange}
        />
        <DropDownItem
          options={MONTH}
          value={selectedMonth}
          onChange={handleMonthChange}
        /> */}
      </article>

      {/* 달력 부분 */}
      <article className="w-full h-[90%]">
        <DateBox
          nowDate={nowDate}
          setNowDate={setNowDate}
          scheduleListData={personalScheduleData.list}
        />
      </article>
    </section>
  );
};

export default CalendarItem;
