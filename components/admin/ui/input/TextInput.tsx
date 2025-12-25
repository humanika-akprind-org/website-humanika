import React from "react";
import { cn } from "@/lib/utils";

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export default function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  icon,
  error,
  className,
  disabled = false,
}: TextInputProps) {
  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      <div
        className={`relative flex border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
          error ? "border-red-500" : ""
        }`}
      >
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 py-2 text-sm rounded-lg focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed",
            icon ? "pl-10 pr-4" : "px-4"
          )}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
