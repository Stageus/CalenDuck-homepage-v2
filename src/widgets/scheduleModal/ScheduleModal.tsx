import React, { useEffect, useState } from "react";

import ScheduleItem from "widgets/scheduleModal/ScheduleItem";
import DropDownItem from "shared/components/DropDownItem";
import { useRecoilValue } from "recoil";
import selectedDateAtom from "shared/recoil/selectedDateAtom";
import { useCookies } from "react-cookie";
import { TScheduleItem } from "types";
import PostNewPersonalScheduleItem from "./PostNewPersonalScheduleItem";
import { useGetScheduleByDate } from "./hooks/useGetScheduleByDate";

const ScheduleModal: React.FC = () => {
  const selectedDate = useRecoilValue(selectedDateAtom);
  const year = selectedDate && selectedDate.getFullYear();
  const month = selectedDate && (selectedDate.getMonth() + 1).toString().padStart(2, "0");
  const date = selectedDate && selectedDate.getDate().toString().padStart(2, "0");
  const fullDate = `${year}${month}${date}`;

  const [cookies] = useCookies(["token"]);
  const [interestOptions, setInterestOptions] = useState<string[]>([]);

  const { data: scheduleData } = useGetScheduleByDate(fullDate);

  // 관심사 카테고리 선택 GET api 연결 (/interests)
  useEffect(() => {
    const getInterestOptions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}/interests`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        const result = await response.json();
        if (response.status === 200) {
          const interests = result.list.map((item: { interestName: string }) => item.interestName);
          setInterestOptions(["전체보기", ...interests]);
        } else if (response.status === 204) {
          setInterestOptions(["전체보기"]);
        } else if (response.status === 401) {
          console.log("토큰 검증 실패");
        }
      } catch (error) {
        console.error("서버 에러: ", error);
      }
    };

    getInterestOptions();
  }, [cookies.token]);

  return (
    <section className="bg-keyColor w-[717px] h-[486px] p-[20px] flex justify-center items-center drop-shadow">
      <div className="bg-white w-full h-full flex flex-col items-center ">
        {/* 상단 */}
        <article className="w-[655px] h-[15%] px-[20px] flex justify-start items-center">
          <div className="mr-[20px]">
            <DropDownItem
              options={interestOptions}
              value={interestOptions[0] || "전체보기"}
              onChange={() => {}}
            />
          </div>
          <div className="font-bold	text-xl">{`${year}/${month}/${date}`}</div>
        </article>

        <PostNewPersonalScheduleItem />

        {/* 해당 날짜의 스케줄 리스트 */}
        <article className="flex flex-col items-center justify-start h-[70%] overflow-auto">
          {scheduleData &&
            scheduleData.list.map((elem) => <ScheduleItem key={elem.idx} data={elem} />)}
        </article>
      </div>
    </section>
  );
};

export default ScheduleModal;
