import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import HeaderSidebarContainer from "shared/components/HeaderSidebarContainer";
import AlarmItem from "widgets/AlarmItem";

// 알림 데이터 타입 정의
interface NotifData {
  _id: number; // 알림 idx
  type: number; // 알림 종류
  date: string; // 알림 생성 시간
  interestName?: string; // 매니저로 지정된 관심사 이름
  content: string; // 스케쥴 내용
  title: string; // 작성한 문의 제목
  reply?: string; // 작성된 문의의 답변
  is_read: boolean // 알림 여부 확인
}

// 알림 목록 불러오기 GET api 연결 (/notifications)
const AlarmPage = () => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [notifListData, setNotifListData] = useState<NotifData[]>([]);

  useEffect(() => {
    if (!cookies.token) {
      navigate("/");
    }
  }, [navigate, cookies.token]);

  useEffect(() => {
    const getAlarmList = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}/notifications?page=1`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        const result = await response.json();

        if (response.status === 200) {
          setNotifListData(result.list);
        } else if (response.status === 400) {
          console.log("잘못된 인증 정보 제공");
        } else if (response.status === 401) {
          console.log("잘못된 인증 정보 제공");
        }
      } catch (error) {
        console.error("서버 에러: ", error);
      }
    };
    getAlarmList();
  }, [cookies.token]);

  const unreadNotifications = notifListData.filter((item) => !item.is_read);
  const readNotifications = notifListData.filter((item) => item.is_read);

  return (
    <>
      <HeaderSidebarContainer />
      <div className="h-[100vh] pt-[56px] bg-[#FFF6ED]">
        <div className="max-w-[830px] w-full mx-auto h-[50px] flex items-center font-bold text-xl text-[#585858] mt-[32px] mb-[8px] top-[50px]">
          알림함
        </div>

        {notifListData.length > 0 ? (
          <section className="max-w-[830px] w-full mx-auto flex flex-col justify-center items-start ">
            {unreadNotifications.length > 0 && (
              <>
                <div className="flex items-end mb-[18px]">
                  <span className="text-base text-[#999999]">오늘 받은 알림</span>
                </div>
                <article className="w-full flex flex-col items-center justify-start mb-[20px]">
                  {unreadNotifications.map((elem) => (
                    <AlarmItem key={elem._id} data={elem} />
                  ))}
                </article>
              </>
            )}

            <div className="flex flex-col mb-2">
              <div className="text-base text-[#999999]">이전 알림</div>
              <div className="text-xs text-[#999999]">최근 30일 이내 알림을 확인할 수 있어요</div>
            </div>
            <article className="w-full flex flex-col items-center justify-start">
              {readNotifications.map((elem) => {
                return <AlarmItem key={elem._id} data={elem} />;
              })}
            </article>

          </section>
        ) : (
          <section className="flex justify-center items-center">
            <h1>새로운 알림이 없습니다!</h1>
          </section>
        )}
      </div>
    </>
  );
};
export default AlarmPage;
