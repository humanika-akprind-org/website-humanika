import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export default function CurrencyInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  error,
  className,
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const formatCurrency = (num: number): string => {
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const parseCurrency = (str: string): number => {
    // Remove all non-digit characters
    const cleaned = str.replace(/[^\d]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    const numericValue = parseCurrency(inputValue);
    onChange(numericValue);
  };

  const handleBlur = () => {
    const numericValue = parseCurrency(displayValue);
    setDisplayValue(formatCurrency(numericValue));
    onChange(numericValue);
  };

  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none user-select-none">
            {icon}
          </div>
        )}
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex items-center pointer-events-none user-select-none text-gray-500 font-regular",
            icon ? "pl-10" : "pl-3"
          )}
        >
          Rp
        </div>
        <Input
          type="text"
          name={name}
          required={required}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",
            "pl-10", // Always add padding for Rp prefix
            icon && "pl-16" // Add extra padding if icon is present
          )}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
