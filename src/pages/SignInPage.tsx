import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import mainLogo from "shared/imgs/mainLogo.svg";
import InputItem from "shared/components/InputItem";

// 로그인 PUT api 연결 (/users/login)
const SignInPage = () => {
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const signInEvent = async () => {
    console.log("🚀   id:", id);
    console.log("🚀   pw:", pw);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          pw: pw,
        }),
      });
      console.log("fetch완료🚀 🚀 🚀 ");
      console.log("🚀 response.status:", response.status);

      if (response.status === 201) {
        const data = await response.json();
        setCookies("token", data.token);
        alert("로그인에 성공하셨습니다.");

        // 로그인 성공 시 페이지 이동
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const formattedDate = `${year}${month}`;
        navigate(`/main?date=${formattedDate}`);
      } else if (response.status === 400) {
        alert("정규식 위반");
      } else if (response.status === 401) {
        alert("잘못된 인증 정보 제공");
      } else if (response.status === 404) {
        alert("해당 api가 없음");
      } else if (response.status === 500) {
        alert("서버에러");
      }
    } catch (error) {
      if (error instanceof Error) console.error("Error:", error.message);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (cookies.token) {
      // alert("이미 로그인 된 사용자입니다?????");
      console.log("cookie 있음");
    }
  }, [cookies.token]);

  return (
    <section className="fixed left-0 w-[100vw] h-[100vh] flex bg-keyColor ">
      <div className="flex justify-center items-center w-[40%]">
        <img src={mainLogo} alt="메인로고" />
      </div>

      <article className="flex flex-col justify-center items-center w-[60%] bg-white rounded-l-[30px]">
        <div className="w-full h-[45%] flex flex-col justify-between items-center">
          <form
            onSubmit={(e) => e.preventDefault}
            className="w-full flex flex-col justify-between items-center"
          >
            <div className="w-[70%] flex flex-col justify-center items-center ">
              <InputItem
                label="아이디"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <InputItem
                label="비밀번호"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-[70%]">
              <button
                onClick={signInEvent}
                className="w-full py-[10px] mb-[10px] bg-keyColor rounded-[5px] font-bold"
              >
                로그인
              </button>
              <button className="w-full py-[10px] bg-yellow-500 rounded-[5px] font-bold">
                카카오 로그인
              </button>
            </div>
          </form>

          <div className="flex justify-between w-[70%]">
            <Link to="/signUp">
              <span className="text-sm">계정이 없으세요? 회원가입</span>
            </Link>

            <div className="flex">
              <Link to="/findId">
                <span className="text-sm">아이디 찾기</span>
              </Link>
              /
              <Link to="/findPw">
                <span className="text-sm">비밀번호 찾기</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
export default SignInPage;
