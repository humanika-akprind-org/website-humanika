import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  side?: "top" | "bottom";
}

export default function SelectFilter({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  side,
}: SelectFilterProps) {
  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent side={side}>
          {options
            .filter((option) => option.value !== "")
            .map((option) => (
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
  );
}
