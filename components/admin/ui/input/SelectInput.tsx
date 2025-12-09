import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  icon,
  className,
}: SelectInputProps) {
  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            {icon}
          </div>
        )}
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className={cn(
              "w-full px-4 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",
              icon && "pl-10"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="hover:bg-gray-100"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
