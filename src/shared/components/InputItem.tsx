import React, { useState } from "react";

import visibility from "shared/imgs/visibility.svg";
import visibilityOff from "shared/imgs/visibilityOff.svg";
import { classNames } from "../utils/classNames";

export type HelperTextOption = {
  text: string;
  type: "grey" | "red" | "green";
};

interface InputItemProps {
  label: string;
  extraBtn?: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickExtraBtn?: () => void;
  onBlur?: (value: string) => void;
  className?: string;
  /**
   * 하단에 뜰 텍스트
   */
  helperText?: string;

  /**
   * 하단에 뜰 텍스트 색상
   */
  helperTextType?: "grey" | "red" | "green";
}

const InputItem: React.FC<InputItemProps> = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  extraBtn,
  onClickExtraBtn,
  onBlur,
  className = "",
  helperText = "",
  helperTextType = "grey",
}) => {
  const [showPw, setShowPw] = useState<boolean>(false);
  const clickShowPwEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPw(!showPw);
  };

  const inputType = type === "password" ? (showPw ? "text" : "password") : type;

  return (
    <div className={classNames("w-full relative", className)}>
      <div className="mb-[8px]">
        <label className="font-[14px] text-[#818181]" htmlFor={label}>
          {label}
        </label>
      </div>
      <div className="relative w-full h-[50px]">
        <input
          onBlur={(e) => {
            onBlur && onBlur(e.target.value);
          }}
          className={classNames(
            "h-[50px] relative border-solid border-2 border-[#E3E3E3] rounded-[10px] p-[10px] outline-[#FF7E29]",
            extraBtn ? "w-[calc(100%-92px)]" : "w-full"
          )}
          type={inputType}
          defaultValue={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {type === "password" && (
          <button
            className="absolute top-[13px] right-[16px]"
            onClick={clickShowPwEvent}
          >
            <img
              src={showPw ? visibility : visibilityOff}
              alt={showPw ? "보임" : "숨김"}
            />
          </button>
        )}

        {extraBtn && (
          <button
            className="absolute font-semibold text-[16px] text-[#FF7E29] right-0 h-full w-[84px] px-[10px] py-[5px] rounded-[8px] border-[1px] border-[#FF7E29]"
            onClick={onClickExtraBtn}
          >
            {extraBtn}
          </button>
        )}
      </div>
      <div className="text-[13px] mt-[8px] absolute">
        <span
          className={classNames(
            helperTextType === "grey"
              ? "text-[#818181]"
              : helperTextType === "green"
              ? "text-[#34A853]"
              : "text-[#FF0000]"
          )}
        >
          {helperText}
        </span>
      </div>
    </div>
  );
};

export default InputItem;
