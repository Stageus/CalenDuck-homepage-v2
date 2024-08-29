import React, { useState } from "react";

import visibility from "shared/imgs/visibility.svg";
import visibilityOff from "shared/imgs/visibilityOff.svg";

interface InputItemProps {
  label: string;
  extraBtn?: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputItem: React.FC<InputItemProps> = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  extraBtn,
}) => {
  const [showPw, setShowPw] = useState<boolean>(false);
  const clickShowPwEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPw(!showPw);
  };

  const inputType = type === "password" ? (showPw ? "text" : "password") : type;

  return (
    <div className="w-full h-[80px] content-between mb-[10px]">
      <label htmlFor={label}>{label}</label>
      <div className="relative w-full h-[50px]">
        <input
          className="w-full h-[50px] relative border-solid border-2 border-grayColor rounded-[10px] p-[10px] outline-alertColor"
          type={inputType}
          defaultValue={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {type === "password" && (
          <button className="absolute top-[13px] right-[10px]" onClick={clickShowPwEvent}>
            <img src={showPw ? visibility : visibilityOff} alt={showPw ? "보임" : "숨김"} />
          </button>
        )}

        {extraBtn && (
          <button className="absolute bg-subColor top-[8px] right-[10px] px-[10px] py-[5px] rounded-[10px]">
            {extraBtn}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputItem;
