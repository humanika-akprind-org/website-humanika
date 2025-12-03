import React from "react";

interface CheckboxInputProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
  labelClassName?: string;
}

export default function CheckboxInput({
  id,
  name,
  checked,
  onChange,
  label,
  className = "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",
  labelClassName = "ml-2 block text-sm text-gray-900",
}: CheckboxInputProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className={className}
      />
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
    </div>
  );
}
