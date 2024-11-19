import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import settingSidebarToggleAtom from "shared/recoil/settingSidebarToggleAtom";
import MyInterestList from "widgets/settingSidebar/MyInterestList";
import LogoutItem from "widgets/settingSidebar/LogoutItem";
import DeleteAccountItem from "widgets/settingSidebar/DeleteAccountItem";
import InterestListItem from "./InterestListItem";
import { useGetInterestAll } from "./hooks/useGetInterestAll";
import { useState } from "react";

const SettingSidebar = () => {
  const date = `${new Date().getFullYear()}${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const managingInterest = "뮤지컬";

  const { data: interests, refetch: refetchInterestList } = useGetInterestAll();

  const [refetchMyInterestFlag, setRefetchMyInterestFlag] = useState(0);

  const [settingSidebarToggle] = useRecoilState(settingSidebarToggleAtom);
  if (!settingSidebarToggle) {
    return null;
  }

  const refetchMyInterest = () => {
    setRefetchMyInterestFlag((value) => value + 1);
  };

  return (
    <section className="w-[300px] relative h-[calc(100%-56px)] bg-white flex flex-col items-center p-[20px]">
      {/* 관심사 목록 */}
      <article className="w-[282px] h-[303px] border-[#E2E2E2] border-[1px] rounded-[12px] mb-[10px] px-[16px]">
        <h2 className="text-[18px] font-medium mt-[16px]">관심사 목록</h2>
        <p className="mt-[4px] mb-[16px] text-[9px] text-[#AAAAAA]">
          태그를 선택해서 내 관심사에 추가해보세요!
        </p>
        <div className="h-[225px] overflow-scroll">
          {interests && interests.list.length && (
            <article className="w-full flex flex-wrap items-start gap-[8px]">
              {interests.list.map((elem) => (
                <InterestListItem
                  refetchMyInterest={refetchMyInterest}
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
      <div className="mt-[20px] w-full">
        <MyInterestList
          refetchInterest={refetchInterestList}
          refetchFlag={refetchMyInterestFlag}
        />
      </div>

      {/* 하단 기능 버튼 */}
      <article className="absolute w-full flex flex-col justify-between items-end bottom-0">
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
