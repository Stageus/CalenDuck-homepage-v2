import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import mainLogo from "shared/imgs/duck_character.svg";
import InputItem, { HelperTextOption } from "shared/components/InputItem";
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
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [emailAuthToken, setEmailAuthToken] = useState("");

  const [isSendAuthCode, setIsSendAuthCode] = useState(false);
  const [isSuccessDuplicateIdCheck, setIsSuccessDuplicateIdCheck] =
    useState(false);
  const [isSuccessEmailAuthCheck, setIsSuccessEmailAuthCheck] = useState(false);

  const [checkedList, setCheckedList] = useState<string[]>([]);

  const [idHelperText, setIdHelperText] = useState<HelperTextOption>({
    text: "알파벳 및 숫자로 이루어진 6~12글자",
    type: "grey",
  });

  const [pwHelperText, setPwHelperText] = useState<HelperTextOption>({
    text: "알파벳과 숫자로 이루어진 8~12글자",
    type: "grey",
  });

  const [nameHelperText, setNameHelperText] = useState<HelperTextOption>({
    text: "한글 또는 알파벳으로 이루어진 2글자 이상 글자",
    type: "grey",
  });

  const [emailHelperText, setEmailHelperText] = useState<HelperTextOption>({
    text: "",
    type: "grey",
  });

  const [authCodeHelperText, setAuthCodeHelperText] =
    useState<HelperTextOption>({
      text: "",
      type: "grey",
    });

  // 하나의 checkbox 클릭에 따른 토글 onChange
  const toggleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // 이미 check 되어있는 건 (이미 checkedList에 포함되어 있던 건) 다시 누르면 value를 제외한 새로운 checkedList를 반환 (filter)
    // check 되어 있지 않은 건 누르면 checkedList에 포함됨 (기존에 존재하는 것과 더불어 ...prev)
    setCheckedList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
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

  const { mutate: checkDuplicateId } = useCheckDuplicateId(
    {
      onSuccess() {
        setIdHelperText({
          text: "사용 가능합니다.",
          type: "green",
        });
        setIsSuccessDuplicateIdCheck(true);
      },
    },
    setIdHelperText
  );

  const { mutate: sendEmailAuthCode, isPending: isPendingSendEmailAuthCode } =
    useSendEmailAuthCode(
      {
        onSuccess() {
          setIsSendAuthCode(true);
          setEmailHelperText({
            text: "성공적으로 발송되었습니다.",
            type: "green",
          });
          alert("인증번호가 발송되었습니다.");
        },
      },
      setEmailHelperText
    );

  const { mutate: checkEmailAuthCode } = useCheckEmailAuthCode({
    onSuccess(data) {
      setEmailAuthToken(data.emailToken);
      setIsSuccessEmailAuthCheck(true);
      setAuthCodeHelperText({
        text: "인증 성공",
        type: "green",
      });
    },
  });

  const { mutate: signup } = useSignUp({
    onSuccess() {
      navigate("/main");
    },
  });

  // 체크된 아이템이 두 개 모두 있을 경우 signUpBtn 활성화, 하나라도 체크가 안 되었을 경우 비활성화

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

      <article className="flex flex-col items-center w-[60%] bg-white rounded-l-[30px] h-[100vh] overflow-scroll">
        <div className="w-[70%] flex flex-col justify-around items-center">
          <h2 className="w-full font-medium text-[24px] text-[#585858] my-[20px]">
            회원가입
          </h2>
          <div className="w-full">
            <InputItem
              className="mb-[52px]"
              label="아이디"
              type="text"
              placeholder="6~12글자로 입력해주세요"
              extraBtn="중복확인"
              helperText={idHelperText.text}
              helperTextType={idHelperText.type}
              onClickExtraBtn={() => {
                if (!ID_REGEX.test(id)) {
                  return alert(
                    "아이디는 영어와 숫자로 이루어진 6~12글자이어야 합니다."
                  );
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
              className="mb-[52px]"
              label="비밀번호"
              helperText={pwHelperText.text}
              helperTextType={pwHelperText.type}
              type="password"
              placeholder="8~16글자로 입력해주세요"
              onBlur={(value) => {
                if (!PW_REGEX.test(value)) {
                  return setPwHelperText({
                    text: "비밀번호는 알파벳과 숫자로 이루어진 8~12글자이어야합니다",
                    type: "red",
                  });
                }

                return setPwHelperText({
                  text: "사용가능합니다.",
                  type: "green",
                });
              }}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <InputItem
              className="mb-[52px]"
              label="이름"
              helperText={nameHelperText.text}
              helperTextType={nameHelperText.type}
              onBlur={(value) => {
                if (!NICKNAME_REGEX.test(value)) {
                  return setNameHelperText({
                    text: "닉네임은 알파벳 또는 한글로 이루어진 2글자 이상 글자여야합니다.",
                    type: "red",
                  });
                }

                return setNameHelperText({
                  text: "사용가능합니다.",
                  type: "green",
                });
              }}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputItem
              className="mb-[52px]"
              label="이메일"
              type="email"
              extraBtn="번호 전송"
              helperText={emailHelperText.text}
              helperTextType={emailHelperText.type}
              value={email}
              onClickExtraBtn={() => {
                if (isPendingSendEmailAuthCode) return;

                if (!EMAIL_REGEX.test(email)) {
                  return setEmailHelperText({
                    text: "이메일 형식이 유효하지 않습니다.",
                    type: "red",
                  });
                }

                sendEmailAuthCode({
                  email,
                  checkDuplicated: true,
                });
              }}
              onChange={(e) => {
                setEmailHelperText({
                  text: "",
                  type: "grey",
                });
                setAuthCodeHelperText({
                  text: "",
                  type: "grey",
                });
                setIsSuccessEmailAuthCheck(false);
                setIsSendAuthCode(false);
                setEmail(e.target.value);
              }}
            />
            <InputItem
              label="인증번호"
              className="mb-[52px]"
              type="text"
              extraBtn="인증 확인"
              value=""
              helperText={authCodeHelperText.text}
              helperTextType={authCodeHelperText.type}
              onClickExtraBtn={() => {
                if (!isSendAuthCode) {
                  return setEmailHelperText({
                    text: "이메일 인증 코드가 발송되지 않은 이메일입니다.",
                    type: "red",
                  });
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

          <div className="flex flex-col w-full mb-[32px] text-[14px] custom_checkbox">
            <label className="flex items-center">
              <input
                type="checkbox"
                value="전체동의"
                className="mr-[5px]"
                // 아래 체크박스 전부 체크 됐으면
                checked={checkedList.length === requiredCheckboxes.length}
                onChange={toggleSelectAll}
              />
              <span className="text-[14px]">전체동의</span>
            </label>
            <hr className="my-[12px]" />
            <label className="w-full flex justify-between items-center mb-[12px]">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  value="이용약관"
                  className="mr-[5px]"
                  checked={checkedList.includes("이용약관")}
                  onChange={toggleCheck}
                />
                <span className="text-sm">이용약관 (필수)</span>
              </div>
              <button className="bg-none border-none text-[14px] text-[#AAAAAA]">
                전문보기
              </button>
            </label>
            <label className="w-full flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  value="개인정보 수집 및 동의"
                  className="mr-[5px]"
                  checked={checkedList.includes("개인정보 수집 및 동의")}
                  onChange={toggleCheck}
                />
                <span className="text-sm">개인정보 수집 및 동의 (필수)</span>
              </div>
              <button className="bg-none border-none text-[14px] text-[#AAAAAA]">
                전문보기
              </button>
            </label>
          </div>

          <div className="w-full flex flex-col justify-between items-center">
            <button
              className="w-full py-[10px] mb-[10px] bg-[#FF7E29] rounded-[8px] font-semibold text-[16px] text-white"
              onClick={() => {
                if (checkedList.length !== requiredCheckboxes.length) {
                  return alert("약관 동의는 필수입니다.");
                }

                if (!ID_REGEX.test(id)) {
                  return alert(
                    "아이디는 영어와 숫자로 이루어진 6~12글자이어야 합니다."
                  );
                }

                if (!PW_REGEX.test(pw)) {
                  return alert(
                    "비밀번호는 영어와 숫자, 특수문자로 이루어진 8~16글자이어 합니다."
                  );
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
          </div>
        </div>
      </article>
    </section>
  );
};
export default SignUpPage;
