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
    <section className="w-full flex flex-col mt-[30px] bg-white  rounded-[8px] px-[44px]">
      {/* 드롭다운 선택 부분 */}
      <article className="flex h-[32px] my-[24px]">
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
              className="mr-[12px]"
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
              onChange={(selectedOption) => {
                if (selectedOption.value === -1) {
                  urlSearch.delete("interestIdx");
                } else {
                  urlSearch.set("interestIdx", selectedOption.value);
                }
                navigate(`/main?${urlSearch.toString()}`, { replace: true });
              }}
              selectedIdx={
                myInterest.list.findIndex(
                  (interest) =>
                    interest.interestIdx ===
                    Number(urlSearch.get("interestIdx"))
                ) + 1 // 제일 앞에 전체보기가 추가되기 때문
              }
            />
          )
        )}

        <CustomDropDown
          className="mr-[12px]"
          options={YEAR.map((year) => ({ value: year, display: year }))}
          onChange={(selectedOption) => {
            urlSearch.set(
              "date",
              `${selectedOption.value}${getSelectedYearMonth().month}`
            );

            navigate(`/main?${urlSearch.toString()}`, { replace: true });
          }}
          selectedIdx={YEAR.findIndex(
            (year) => year === getSelectedYearMonth().year
          )}
        />
        <CustomDropDown
          options={MONTH.map((month) => ({ value: month, display: month }))}
          onChange={(selectedOption) => {
            urlSearch.set(
              "date",
              `${getSelectedYearMonth().year}${selectedOption.value}`
            );

            navigate(`/main?${urlSearch.toString()}`, { replace: true });
          }}
          selectedIdx={MONTH.findIndex(
            (month) => month === getSelectedYearMonth().month
          )}
        />
      </article>

      {/* 달력 부분 */}
      <article className="w-full">
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
