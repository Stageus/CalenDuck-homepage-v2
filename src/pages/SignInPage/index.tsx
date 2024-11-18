import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import mainLogo from "shared/imgs/mainLogo.svg";
import InputItem from "shared/components/InputItem";
import { useLogin } from "./hooks/useLogin";

const SignInPage = () => {
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const redirectToMainPage = (year?: string, month?: string) => {
    const date = new Date();

    if (!year) {
      year = date.getFullYear().toString();
    }

    if (!month) {
      month = String(date.getMonth() + 1).padStart(2, "0");
    }

    navigate(`/main?date=${year}${month}`);
  };

  const { mutate: login } = useLogin({
    onSuccess(data) {
      setCookies("token", data.token);

      redirectToMainPage();
    },
  });

  useEffect(() => {
    if (cookies.token) {
      redirectToMainPage();
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
            onSubmit={(e) => e.preventDefault()}
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
                onClick={() => login({ id, pw })}
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
