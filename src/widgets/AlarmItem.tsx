import React, { useState } from "react";

import arrowDropDown from "shared/imgs/arrowDropDown.svg";
import arrowDropUp from "shared/imgs/arrowDropUp.svg";

interface AlarmItemProps {
  data: {
    _id: number; // 알림 idx
    type: number; // 알림 종류
    date: string; // 알림 생성 시간
    interestName?: string; // 매니저로 지정된 관심사 이름
    content: string; // 스케쥴 내용
    title: string; // 작성한 문의 제목
    reply?: string; // 작성된 문의의 답변
  };
}
/*
	type = 1 ( 중요 스케쥴 알림 설정 ) --> 해당 스케쥴의 내용인 content 제공
	type = 2 ( 매니저 권한 획득 ) --> 지정된 관심사 이름인 interestName 제공
	type = 3 ( 문의 답변 ) --> 작성했던 문의의 제목인 title과 해당 문의의 답변 reply 제공
*/

const AlarmItem: React.FC<AlarmItemProps> = (props) => {
  const { type, date, interestName, content, title, reply } = props.data;

  let alarmSymbol, typeInterest, message;
  if (type === 1) {
    alarmSymbol = "🌟";
    typeInterest = "24시간 전";
    message = `[ ${interestName}: ${content} ] (이)가 하루 전으로 다가왔어요!`;
  } else if (type === 2) {
    alarmSymbol = "👑";
    typeInterest = "관리자 지정";
    message = `${interestName}에 대한 관리자로 지정되었습니다. 축하드립니다!`;
  } else if (type === 3) {
    alarmSymbol = "💌";
    typeInterest = "문의 답변";
    message = `${title}에 대한 관리자 답변이 도착했습니다.`;
  }

  // 드롭다운 버튼 클릭시 자세히 보기 열림
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const clickSeeDetailEvent = () => {
    setOpenDetail(!openDetail);
  };

  return (
    <article
      className={`w-full ${
        openDetail ? "h-[fit-content]" : "h-[70px]"
      } bg-tagColor rounded-[5px] p-[10px] m-[5px]`}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="mx-[10px]">{alarmSymbol}</span>
          <div className="w-[600px] ml-[10px] flex flex-col justify-start">
            <div className="text-sm text-grayColor">
              {typeInterest} - {date}
            </div>
            <div className="text-lg">{message}</div>
          </div>
        </div>

        {type === 3 && (
          <button onClick={clickSeeDetailEvent}>
            <img src={openDetail ? arrowDropUp : arrowDropDown} alt="자세히보기" />
          </button>
        )}
      </div>
      {type === 3 && openDetail && <div className="mx-[50px] mt-[30px] mb-[20px]">{reply}</div>}
    </article>
  );
};

export default AlarmItem;
