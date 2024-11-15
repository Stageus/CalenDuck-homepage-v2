import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import mainLogo from "shared/imgs/mainLogo.svg";
import InputItem from "shared/components/InputItem";
import { useCheckDuplicateId } from "./hooks/useCheckDuplicateId";
import { useSendEmailAuthCode } from "./hooks/useSendEmailAuthCode";
import { useCheckEmailAuthCode } from "./hooks/useCheckEmailAuthCode";
import { useSignUp } from "./hooks/useSignUp";

const SignUpPage = () => {
  const ID_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/; // 영어 + 숫자, 각 최소 1개 이상, 6~12
  const PW_REGEX =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/; // 영어 + 숫자 + 특수문자, 각 최소 1개 이상, 8~16
  const EMAIL_REGEX =
    /^(?!\.)(?!.*\.\.)(?=.{5,320})[a-zA-Z\d.!#$%&'*+/=?^_{|}~-]{1,64}(?<!\.)@(?!-)(?!.*--)(?=.{3,255}$)([a-zA-Z\d-]{1,63}(?:\.[a-zA-Z\d-]{1,63})*(?<!-)\.[a-zA-Z]{1,63})$/;
  const NICKNAME_REGEX = /^[a-zA-Zㄱ-ㅎ가-힣]{2,32}$/;

  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["token"]);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [emailAuthToken, setEmailAuthToken] = useState("");

  const [isSendAuthCode, setIsSendAuthCode] = useState(false);
  const [isSuccessDuplicateIdCheck, setIsSuccessDuplicateIdCheck] = useState(false);
  const [isSuccessEmailAuthCheck, setIsSuccessEmailAuthCheck] = useState(false);

  const [checkedList, setCheckedList] = useState<string[]>([]);

  // 하나의 checkbox 클릭에 따른 토글 onChange
  const toggleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // 이미 check 되어있는 건 (이미 checkedList에 포함되어 있던 건) 다시 누르면 value를 제외한 새로운 checkedList를 반환 (filter)
    // check 되어 있지 않은 건 누르면 checkedList에 포함됨 (기존에 존재하는 것과 더불어 ...prev)
    setCheckedList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // 전체동의 누를 경우 아래 checkbox 모두 속성 checked
  const requiredCheckboxes = ["이용약관", "개인정보 수집 및 동의"];
  const toggleSelectAll = () => {
    if (checkedList.length === requiredCheckboxes.length) {
      setCheckedList([]);
    } else {
      setCheckedList(requiredCheckboxes);
    }
  };

  const { mutate: checkDuplicateId } = useCheckDuplicateId({
    onSuccess() {
      alert("사용 가능한 아이디입니다.");
      setIsSuccessDuplicateIdCheck(true);
    },
  });

  const { mutate: sendEmailAuthCode, isPending: isPendingSendEmailAuthCode } = useSendEmailAuthCode(
    {
      onSuccess() {
        setIsSendAuthCode(true);
        alert("이메일 인증번호가 발송되었습니다.");
      },
    }
  );

  const { mutate: checkEmailAuthCode } = useCheckEmailAuthCode({
    onSuccess(data) {
      console.log(data);
      setEmailAuthToken(data.emailToken);
      setIsSuccessEmailAuthCheck(true);
      alert("인증 성공");
    },
  });

  const { mutate: signup } = useSignUp({
    onSuccess() {
      navigate("/main");
    },
  });

  // 체크된 아이템이 두 개 모두 있을 경우 signUpBtn 활성화, 하나라도 체크가 안 되었을 경우 비활성화

  return (
    <section className="fixed left-0 w-[100vw] h-[100vh] flex bg-keyColor ">
      <div className="flex justify-center items-center w-[40%]">
        <img src={mainLogo} alt="메인로고" />
      </div>

      <article className="flex flex-col justify-center items-center w-[60%] bg-white rounded-l-[30px]">
        <div className="w-full flex flex-col justify-around items-center">
          <div className="w-[70%]">
            <InputItem
              label="아이디"
              type="text"
              placeholder="6~12글자로 입력해주세요"
              extraBtn="중복확인"
              onClickExtraBtn={() => {
                if (!ID_REGEX.test(id)) {
                  return alert("아이디는 영어와 숫자로 이루어진 6~12글자이어야 합니다.");
                }
                checkDuplicateId({ id });
              }}
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setIsSuccessDuplicateIdCheck(false);
              }}
            />
            <InputItem
              label="비밀번호"
              type="password"
              placeholder="8~16글자로 입력해주세요"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <InputItem
              label="이름"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputItem
              label="이메일"
              type="email"
              extraBtn="번호 전송"
              value={email}
              onClickExtraBtn={() => {
                if (isPendingSendEmailAuthCode) return;

                if (!EMAIL_REGEX.test(email)) {
                  return alert("이메일 형식이 유효하지 않습니다.");
                }

                sendEmailAuthCode({
                  email,
                  checkDuplicated: true,
                });
              }}
              onChange={(e) => {
                setIsSuccessEmailAuthCheck(false);
                setIsSendAuthCode(false);
                setEmail(e.target.value);
              }}
            />
            <InputItem
              label="인증번호"
              type="text"
              extraBtn="인증 확인"
              value=""
              onClickExtraBtn={() => {
                if (!isSendAuthCode) {
                  return alert("이메일 인증 코드가 발송되지 않은 이메일입니다.");
                }

                checkEmailAuthCode({
                  email,
                  code: authCode,
                  pageType: "signup",
                });
              }}
              onChange={(e) => setAuthCode(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-[70%] mb-[10px]">
            <label>
              <input
                type="checkbox"
                value="전체동의"
                className="mr-[5px]"
                // 아래 체크박스 전부 체크 됐으면
                checked={checkedList.length === requiredCheckboxes.length}
                onChange={toggleSelectAll}
              />
              <span className="text-sm">전체동의</span>
            </label>
            <hr className="my-[5px]" />
            <label className="w-full flex justify-between items-center mb-[2px]">
              <div>
                <input
                  type="checkbox"
                  value="이용약관"
                  className="mr-[5px]"
                  checked={checkedList.includes("이용약관")}
                  onChange={toggleCheck}
                />
                <span className="text-sm">이용약관 (필수)</span>
              </div>
              <button className="border border-black px-[5px] py-[3px] rounded-[5px] text-xs">
                전문보기
              </button>
            </label>
            <label className="w-full flex justify-between items-center">
              <div>
                <input
                  type="checkbox"
                  value="개인정보 수집 및 동의"
                  className="mr-[5px]"
                  checked={checkedList.includes("개인정보 수집 및 동의")}
                  onChange={toggleCheck}
                />
                <span className="text-sm">개인정보 수집 및 동의 (필수)</span>
              </div>
              <button className="border border-black px-[5px] py-[3px] rounded-[5px] text-xs">
                전문보기
              </button>
            </label>
          </div>

          <div className="w-[70%] flex flex-col justify-between items-center">
            <button
              className="w-full py-[10px] mb-[10px] bg-keyColor rounded-[5px] font-bold"
              onClick={() => {
                if (checkedList.length !== requiredCheckboxes.length) {
                  return alert("약관 동의는 필수입니다.");
                }

                if (!ID_REGEX.test(id)) {
                  return alert("아이디는 영어와 숫자로 이루어진 6~12글자이어야 합니다.");
                }

                if (!PW_REGEX.test(pw)) {
                  return alert("비밀번호는 영어와 숫자, 특수문자로 이루어진 8~16글자이어 합니다.");
                }

                if (!NICKNAME_REGEX.test(name)) {
                  return alert(
                    "닉네임은 알파벳 또는 한글로 이루어진 2글자 이상 글자이어야 합니다."
                  );
                }

                if (!isSuccessDuplicateIdCheck) {
                  return alert("아이디 중복검사는 필수입니다.");
                }

                if (!isSuccessEmailAuthCheck) {
                  return alert("이메일 인증이 완료되지 않았습니다.");
                }

                signup({
                  id,
                  email,
                  nickname: name,
                  pw,
                  emailToken: emailAuthToken,
                });
              }}
            >
              회원가입
            </button>
            <button className="w-full py-[10px] mb-[10px] bg-yellow-500 rounded-[5px] font-bold">
              카카오 회원가입
            </button>
            <Link to="/">
              <span className="text-sm">로그인하러 가기</span>
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
};
export default SignUpPage;
