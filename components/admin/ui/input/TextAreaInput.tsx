import React from "react";
import { cn } from "@/lib/utils";

interface TextAreaInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
  height?: string;
}

export default function TextAreaInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className,
  disabled = false,
  rows = 4,
  height,
}: TextAreaInputProps) {
  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      <div
        className={`relative border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
          error ? "border-red-500" : ""
        }`}
      >
        <textarea
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          style={{ height }}
          className={cn(
            "w-full p-3 text-sm rounded-lg focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none",
            error ? "border-red-500" : ""
          )}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
