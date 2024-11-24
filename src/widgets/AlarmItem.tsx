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
    is_read: boolean; // 알림 확인 여부
  };
}
/*
  type = 0 ( 중요 스케쥴 알림 설정 ) --> 해당 스케쥴의 내용인 content 제공
  type = 1 ( 매니저 권한 획득 ) --> 지정된 관심사 이름인 interestName 제공
  type = 2 ( 문의 답변 ) --> 작성했던 문의의 제목인 title과 해당 문의의 답변 reply 제공
*/

const AlarmItem: React.FC<AlarmItemProps> = (props) => {
  const { type, date, interestName, content, title, reply, is_read } = props.data;

  const formattedDate = (() => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  })();

  const formattedTime = new Date(date).toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  let typeInterest, message;
  if (type === 0) {
    typeInterest = "24시간 전";
    message = `[ ${interestName}: ${content} ] (이)가 하루 전으로 다가왔어요!`;
  } else if (type === 1) {
    typeInterest = "관리자 지정";
    message = `${interestName}에 대한 관리자로 지정되었습니다. 축하드립니다!`;
  } else if (type === 2) {
    typeInterest = "마스터 답변";
    message = `[${title}]에 대한 관리자 답변이 도착했습니다.`;
  }

  // 드롭다운 버튼 클릭시 자세히 보기 열림
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const clickSeeDetailEvent = () => {
    setOpenDetail(!openDetail);
  };

  const articleHeight = is_read ? "h-[70px]" : "h-[94px]";
  const articlePadding = is_read ? "px-[20px] py-[12px]" : "p-[10px]";
  const articleMarginBottom = is_read ? "mb-[18px]" : "mb-[8px]";
  const svgIcon = is_read ? (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="19.5" fill="white" stroke="#E3E3E3" />
      <ellipse cx="12.0513" cy="16.25" rx="2.05128" ry="2.25" fill="#424242" />
      <ellipse cx="27.9487" cy="16.25" rx="2.05128" ry="2.25" fill="#424242" />
      <ellipse cx="20.2527" cy="25" rx="4.61538" ry="3" fill="#FCD959" />
    </svg>
  ) : (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_36_2805)">
        <rect width="74" height="74" rx="3.7" fill="#FFEBD4" />
        <path d="M48.0941 36.222C48.0941 47.6806 38.1548 53.65 25.8941 53.65C13.6334 53.65 3.69409 47.6806 3.69409 36.222C3.69409 26.4798 10.8786 14.9863 20.5661 12.756C20.8598 12.6884 20.1221 11.5322 20.5661 11.3248C21.4541 10.9098 22.0441 12.4636 22.3421 12.4188C22.9268 12.3309 23.6741 9.66495 25.0061 9.25C25.8941 10.0799 25.2963 12.1547 25.8941 12.1547C38.1548 12.1547 48.0941 24.7634 48.0941 36.222Z" fill="white" />
        <ellipse cx="17.0213" cy="31.1723" rx="2.22" ry="2.4975" fill="#424242" />
        <ellipse cx="34.2205" cy="31.1723" rx="2.22" ry="2.4975" fill="#424242" />
        <ellipse cx="25.8964" cy="40.8847" rx="4.995" ry="3.33" fill="#FCD959" />
        <path d="M44.5177 64.8964L45.1847 58.3358C45.2571 57.6238 45.88 57.0967 46.5942 57.1432L50.9869 57.429C51.7387 57.4779 52.2999 58.141 52.2237 58.8906L51.5567 65.4512C51.4843 66.1633 50.8614 66.6903 50.1472 66.6439L45.7545 66.3581C45.0027 66.3092 44.4415 65.646 44.5177 64.8964Z" fill="#FFB271" />
        <path d="M44.6338 38.7916L66.6396 38.5573L64.2412 60.0587L43.0204 53.3471L44.6338 38.7916Z" fill="white" />
        <ellipse cx="69.6561" cy="49.461" rx="3.32489" ry="4.98733" transform="rotate(7.21225 69.6561 49.461)" fill="white" />
        <rect x="66.0225" y="36.1602" width="5.06243" height="26.3643" rx="2.53122" transform="rotate(7.20952 66.0225 36.1602)" fill="#FFB271" />
        <path d="M43.491 57.6264L44.293 53.2756C44.3499 52.9665 44.6135 52.7388 44.9278 52.7365C48.8037 52.7084 55.2582 53.3901 54.8351 55.9861C54.3917 58.7061 52.5125 59.2711 51.6282 59.2135L44.1583 58.4171L44.0744 58.4082C43.6894 58.3671 43.4208 58.0071 43.491 57.6264Z" fill="white" />
        <path d="M36.7111 42.223C37.1301 39.4823 39.5837 37.5229 42.3492 37.7206L45.5282 37.9479C45.9088 37.9751 46.1885 38.3163 46.1405 38.6948L44.2148 53.8858C44.1653 54.2762 43.7895 54.5384 43.406 54.4502L39.9448 53.6537C37.2312 53.0293 35.4583 50.4179 35.8791 47.6654L36.7111 42.223Z" fill="#FFB271" />
      </g>
      <defs>
        <clipPath id="clip0_36_2805">
          <rect width="74" height="74" rx="3.7" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
  const dateOrTime = is_read ? formattedDate : formattedTime;

  return (
    <article
      className={`w-full ${openDetail ? "h-[fit-content]" : articleHeight
        } bg-white rounded-[5px] ${articlePadding} ${articleMarginBottom}`}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <span>{svgIcon}</span>
          <div className="w-full ml-[10px] flex flex-col justify-start">
            <div className="text-sm text-[#6A6A6A]">
              {typeInterest} - {dateOrTime}
            </div>
            <div className="text-lg">{message}</div>
          </div>
        </div>

        {type === 2 && (
          <button onClick={clickSeeDetailEvent}>
            <img src={openDetail ? arrowDropUp : arrowDropDown} alt="자세히보기" />
          </button>
        )}
      </div>
      {type === 2 && openDetail && <div className="mx-[46.5px] mt-[24px]">{reply}</div>}
    </article>
  )
};

export default AlarmItem;
