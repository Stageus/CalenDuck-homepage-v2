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
}

// 알림 목록 불러오기 GET api 연결 (/notifications?ㅔ)
const AlarmPage = () => {
  // const dummyData = [
  //   {
  //     id: "alarm_1",
  //     date: "2024/06/18",
  //     type: 1,
  //     interest: "프리미어리그",
  //     title: "토트넘 vs 울버햄튼",
  //   },
  //   {
  //     id: "alarm_2",
  //     date: "2024/06/18",
  //     type: 2,
  //     title: "알림이 제대로 오지 않았습니다.",
  //     reply:
  //       "정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~ 정말정말 죄송합니다.왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~ 정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~정말정말 죄송합니다.왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~ 정말정말 죄송합니다. 왜 안 갔지 나도 진짜모르겠다.... 미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다....미안미안해~~~~ 정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~정말정말 죄송합니다.왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~ 정말정말 죄송합니다. 왜 안 갔지 나도 진짜모르겠다.... 미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다....미안미안해~~~~ 정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다....미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~정말정말 죄송합니다. 왜 안 갔지 나도 진짜 모르겠다.... 미안미안해~~~~",
  //   },
  //   {
  //     id: "alarm_3",
  //     date: "2024/06/18",
  //     type: 3,
  //     title: "미식축구",
  //   },
  // ];
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
  }, [cookies.token, notifListData]);

  return (
    <>
      <HeaderSidebarContainer />
      <div className="w-full h-[50px] flex items-center font-bold text-xl mb-5 fixed top-[50px] bg-white">
        [ 알림함 ]
      </div>

      {notifListData.length > 0 ? (
        <section className="mt-[120px] flex flex-col justify-center items-start">
          {/* {}
          <h2 className="font-bold text-l mt-7 mb-2">오늘 받은 알림</h2>
          <article className="w-full flex flex-col items-center justify-start">
            {notifListData.map((elem) => {
              return <AlarmItem key={elem.idx} data={elem} />;
            })}
          </article> */}

          <div className="flex items-end mt-7 mb-2">
            {/* <h2 className="font-bold text-l mr-5">이전 알림</h2> */}
            <span className="text-xs text-alertColor">30일 후 자동 삭제 됩니다</span>
          </div>
          <article className="w-full flex flex-col items-center justify-start">
            {notifListData.map((elem) => {
              return <AlarmItem key={elem._id} data={elem} />;
            })}
          </article>
        </section>
      ) : (
        <section className="flex justify-center items-center">
          <h1>새로운 알림이 없습니다!</h1>
        </section>
      )}
    </>
  );
};
export default AlarmPage;
