import React, { useEffect, useState } from "react";
import { classNames } from "../../utils/classNames";

interface DropDownItemProps<T = any> {
  options: {
    value: T;
    display: string;
  }[];
  selectedIdx?: number;
  onChange: (selectedOption: { value: T; display: string }) => void;
  className?: string;
}

const CustomDropDown: React.FC<DropDownItemProps> = ({
  selectedIdx,
  options,
  onChange,
  className = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(
    selectedIdx ? (selectedIdx === -1 ? 0 : selectedIdx) : 0
  );

  return (
    <div
      className={classNames(
        "bg-[#F7F7F7] rounded-[20px] flex items-center px-[12px]",
        className
      )}
    >
      <select
        value={options[selectedIndex].value}
        onChange={(e) => {
          const value = options[e.target.selectedIndex];
          setSelectedIndex(e.target.selectedIndex);
          onChange(value);
        }}
        className="focus:outline-none text-[13px] text-[#585858]"
        style={{
          background: "none",
        }}
      >
        {options.map((option, index) => (
          <option key={`option-${index}`} value={option.value}>
            {option.display}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomDropDown;
