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

  const [cookies] = useCookies(["token"]);
  const [interestOptions, setInterestOptions] = useState<string[]>([]);

  const [selectedInterest, setSelectedInterest] = useState(-1);

  const { data: scheduleData, refetch: refetchScheduleByDate } =
    useGetScheduleByDate(`${year}${month}${date}`, selectedInterest);

  const { data: myInterest } = useGetMyInterest();

  return (
    <section className="bg-keyColor w-[717px] h-[486px] p-[20px] flex justify-center items-center drop-shadow">
      <div className="bg-white w-full h-full flex flex-col items-center ">
        {/* 상단 */}
        <article className="w-[655px] h-[15%] px-[20px] flex justify-start items-center">
          <div className="mr-[20px]">
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
          <div className="font-bold	text-xl">{`${year}/${month}/${date}`}</div>
        </article>

        <PostNewPersonalScheduleItem
          refetchScheduleByDate={refetchScheduleByDate}
          updateCalendarComponentKey={updateCalendarComponentKey}
        />

        {/* 해당 날짜의 스케줄 리스트 */}
        <article className="flex flex-col items-center justify-start h-[70%] overflow-auto">
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
