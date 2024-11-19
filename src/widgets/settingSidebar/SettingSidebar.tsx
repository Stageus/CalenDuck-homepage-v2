import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useRecoilState } from "recoil";
import settingSidebarToggleAtom from "shared/recoil/settingSidebarToggleAtom";

import MyInterestList from "widgets/settingSidebar/MyInterestList";
import LogoutItem from "widgets/settingSidebar/LogoutItem";
import DeleteAccountItem from "widgets/settingSidebar/DeleteAccountItem";
import { useCookies } from "react-cookie";
import { TInterestItem } from "types";
import InterestListItem from "./InterestListItem";
import { useGetInterestAll } from "./hooks/useGetInterestAll";

// 관심사 목록 불러오기 GET api 연결 (/interests/all)
const SettingSidebar = () => {
  const date = `${new Date().getFullYear()}${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const managingInterest = "뮤지컬";

  const [interestListData, setInterestListData] = useState<TInterestItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: interests, refetch: refetchInterestList } = useGetInterestAll();

  // 검색어를 기준으로 관심사 필터링(영문일 경우 소문자로 변환해 확인)
  const filteredInterestList = searchTerm
    ? interestListData.filter((item) =>
        item.interestName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : interestListData;

  const [settingSidebarToggle] = useRecoilState(settingSidebarToggleAtom);
  if (!settingSidebarToggle) {
    return null;
  }

  return (
    <section className="w-[300px] h-full bg-white flex flex-col justify-start items-center p-[20px]">
      {/* 관심사 목록 */}
      <article className="w-[282px] h-[303px] border-[#E2E2E2] border-[1px] rounded-[12px] mb-[10px] px-[16px]">
        <h2 className="text-[18px] font-medium mt-[16px]">관심사 목록</h2>
        <p className="mt-[4px] mb-[16px] text-[9px] text-[#AAAAAA]">
          태그를 선택해서 내 관심사에 추가해보세요!
        </p>
        <div className="h-[228px] overflow-scroll">
          {interests && interests.list.length && (
            <article className="w-full h-[100px] flex flex-wrap gap-[8px]">
              {interests.list.map((elem) => (
                <InterestListItem
                  key={elem.interestIdx}
                  data={elem}
                  refetchInterestList={refetchInterestList}
                />
              ))}
            </article>
          )}
        </div>
      </article>

      {/* 내 관심사 목록 */}
      <MyInterestList />

      {/* 하단 기능 버튼 */}
      <article className="w-full h-[130px] flex flex-col justify-between items-end">
        {managingInterest && (
          <Link to={`/manager?date=${date}&interest=${managingInterest}`}>
            <button className="text-sm px-[10px] py-[5px] rounded-[5px] hover:bg-subColor">
              관심사 관리 페이지로 이동
            </button>
          </Link>
        )}
        <Link to="/contact">
          <button className="text-sm px-[10px] py-[5px] rounded-[5px] hover:bg-subColor">
            1:1문의
          </button>
        </Link>

        {/* 로그아웃 */}
        <LogoutItem />

        {/* 탈퇴하기 */}
        <DeleteAccountItem />
      </article>
    </section>
  );
};

export default SettingSidebar;
