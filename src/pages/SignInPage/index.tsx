import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import mainLogo from "shared/imgs/duck_character.svg";
import InputItem from "shared/components/InputItem";
import { useLogin } from "./hooks/useLogin";

const SignInPage = () => {
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [id, setId] = useState("guest1234");
  const [pw, setPw] = useState("aa12341234**");

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
    <section className="fixed left-0 w-[100vw] h-[100vh] flex bg-[#FFF6ED]">
      <div className="flex justify-center w-[40%]">
        <div className="mt-[120px]">
          <h1 className="text-[40px] font-semibold mb-[16px]">
            <span className="text-[#FF7E29]">캘린덕</span>과 함께라면
            <br />
            까먹는 일정은 없을 거예요!
          </h1>
          <p className="text-[16px] font-medium text-[#818181]">
            알림을 직접 커스텀해서 나에게 더욱 딱 맞는 일정관리,
            <br />
            캘린덕으로 갓생 시작해봐요!
          </p>
        </div>
        <div className="absolute bottom-0">
          <img src={mainLogo} alt="메인로고" />
        </div>
      </div>

      <article className="flex flex-col justify-center items-center w-[60%] bg-white rounded-l-[30px]">
        <div className="w-full h-[45%] flex flex-col items-center">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col justify-between items-center w-[70%]"
          >
            <h2 className="w-full font-medium text-[24px] text-[#585858]">
              로그인하시겠어요?
            </h2>
            <div className="w-full flex flex-col justify-center items-center mt-[24px]">
              <div className="w-full mb-[32px]">
                <InputItem
                  label="아이디"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>
              <div className="w-full mb-[32px]">
                <InputItem
                  label="비밀번호"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
              </div>

              <div className="w-full">
                <button
                  onClick={() => login({ id, pw })}
                  className="w-full py-[10px] mb-[10px] bg-[#FF7E29] text-white rounded-[5px] font-semibold text-[16px]"
                >
                  로그인
                </button>
              </div>
            </div>

            {/* <div className="flex flex-col w-full">
              <button className="w-full py-[10px] bg-yellow-500 rounded-[5px] font-bold">
                카카오 로그인
              </button>
            </div> */}
          </form>

          <div className="flex justify-between w-[70%] ">
            <div className="text-[#FFB271] text-[15px]">
              계정이 없으세요?
              <Link
                to="/signUp"
                className="text-[15px] font-bold text-[#FF7E29]"
              >
                <span className="text-sm"> 회원가입</span>
              </Link>
            </div>
            <div className="flex text-[15px] text-[#999999]">
              <Link to="/findId" className="mr-[12px]">
                <span className="text-sm">아이디 찾기</span>
              </Link>
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
