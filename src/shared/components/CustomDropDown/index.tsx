import React, { useEffect, useState } from "react";

interface DropDownItemProps<T = any> {
  options: {
    value: T;
    display: string;
  }[];
  selectedIdx?: number;
  onChange: (selectedOption: { value: T; display: string }) => void;
}

const CustomDropDown: React.FC<DropDownItemProps> = ({
  selectedIdx,
  options,
  onChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(selectedIdx || 0);

  return (
    <select
      value={options[selectedIndex].value}
      onChange={(e) => {
        const value = options[e.target.selectedIndex];
        setSelectedIndex(e.target.selectedIndex);
        onChange(value);
      }}
      className="focus:outline-none"
    >
      {options.map((option, index) => (
        <option key={`option-${index}`} value={option.value}>
          {option.display}
        </option>
      ))}
    </select>
  );
};

export default CustomDropDown;
