import React, { useEffect, useState } from "react";

import ScheduleItem from "widgets/scheduleModal/ScheduleItem";
import DropDownItem from "shared/components/DropDownItem";
import { useRecoilValue } from "recoil";
import selectedDateAtom from "shared/recoil/selectedDateAtom";
import { useCookies } from "react-cookie";
import PostNewPersonalScheduleItem from "./PostNewPersonalScheduleItem";
import { useGetScheduleByDate } from "./hooks/useGetScheduleByDate";
import { useGetSelectedYearMonth } from "../../shared/hooks/useGetSelectedYearMonth";
import { useGetMyInterest } from "../calendar/hooks/useGetMyInterest";
import CustomDropDown from "../../shared/components/CustomDropDown";

type Props = {
  updateCalendarComponentKey: () => void;
};

const ScheduleModal: React.FC<Props> = ({
  updateCalendarComponentKey,
}: Props) => {
  const selectedDate = useRecoilValue(selectedDateAtom);

  const getSelectedYearMonth = useGetSelectedYearMonth();

  const year = getSelectedYearMonth().year;
  const month = getSelectedYearMonth().month;
  const date =
    selectedDate && selectedDate.getDate().toString().padStart(2, "0");

  const [selectedInterest, setSelectedInterest] = useState(-1);

  const { data: scheduleData, refetch: refetchScheduleByDate } =
    useGetScheduleByDate(`${year}${month}${date}`, selectedInterest);

  const { data: myInterest } = useGetMyInterest();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <section className="w-[670px] h-[546px] rounded-[8px] bg-white px-[32px] pt-[20px] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.12)] z-10">
      <div className="bg-white w-full h-full flex flex-col items-center ">
        {/* 상단 */}
        <article className="w-full h-[32px] mb-[12px] flex justify-start items-center">
          <div className="mr-[16px] h-full">
            {myInterest && (
              <CustomDropDown
                options={[
                  {
                    display: "전체보기",
                    value: -1,
                  },
                  ...myInterest.list.map((interest) => ({
                    value: interest.interestIdx,
                    display: interest.interestName,
                  })),
                ]}
                onChange={(selectedOption) => {
                  setSelectedInterest(selectedOption.value);
                }}
                selectedIdx={selectedInterest}
              />
            )}
          </div>
          <div className="text-[13px] font-bold">{`${year}/${month}/${date}`}</div>
        </article>

        <PostNewPersonalScheduleItem
          refetchScheduleByDate={refetchScheduleByDate}
          updateCalendarComponentKey={updateCalendarComponentKey}
        />

        <div className="w-full h-[2px] bg-[#F7F7F7] my-[17px]"></div>

        {/* 해당 날짜의 스케줄 리스트 */}
        <article className="h-[364px] w-full flex flex-col items-center justify-start overflow-y-scroll">
          {scheduleData &&
            scheduleData.list.map((elem) => (
              <ScheduleItem
                key={elem.idx}
                data={elem}
                refetchScheduleByDate={refetchScheduleByDate}
                updateCalendarComponentKey={updateCalendarComponentKey}
              />
            ))}
        </article>
      </div>
    </section>
  );
};

export default ScheduleModal;
