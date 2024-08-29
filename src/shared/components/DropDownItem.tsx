import React from "react";

interface DropDownItemProps {
  options: any[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DropDownItem: React.FC<DropDownItemProps> = ({ options, value, onChange }) => {
  return (
    <select value={value} onChange={onChange} className="focus:outline-none">
      {options.map((option: any, index: number) => (
        <option key={index} value={typeof option === "string" || "number" ? option : option.value}>
          {typeof option === "string" || "number" ? option : option.label}
        </option>
      ))}
    </select>
  );
};

export default DropDownItem;
