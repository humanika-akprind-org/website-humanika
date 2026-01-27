import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  className = "rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4",
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={className}
    />
  );
}
