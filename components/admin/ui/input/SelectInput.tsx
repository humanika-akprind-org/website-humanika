"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

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
  disabled?: boolean;
  searchPlaceholder?: string;
  maxDisplayCount?: number;
  showSearch?: boolean;
  error?: string;
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
  disabled,
  searchPlaceholder = "Search...",
  maxDisplayCount = 200,
  showSearch = true,
  error,
}: SelectInputProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter options based on search query
  const filteredOptions = useMemo(
    () =>
      !searchQuery.trim()
        ? options
        : options.filter(
            (option) =>
              option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              option.value.toLowerCase().includes(searchQuery.toLowerCase())
          ),
    [options, searchQuery]
  );

  // Get display options with limit
  const displayOptions = useMemo(
    () => filteredOptions.slice(0, maxDisplayCount),
    [filteredOptions, maxDisplayCount]
  );

  // Check if there are more options hidden
  const hasMoreOptions = filteredOptions.length > maxDisplayCount;

  // Handle clear search
  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
  };

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value);

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
        <Select
          value={value}
          onValueChange={(newValue) => {
            onChange(newValue);
            // Optional: Clear search after selection
            // setSearchQuery("");
          }}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn(
              "w-full px-4 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-red-500 focus:ring-red-500"
            )}
          >
            <SelectValue
              placeholder={placeholder}
              className={cn(!value && "text-gray-400")}
            >
              {selectedOption?.label || placeholder}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto"
          >
            {showSearch && (
              <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-2 shadow-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-full pl-10 pr-8 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}
            {displayOptions.length > 0 ? (
              displayOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "hover:bg-gray-100 cursor-pointer",
                    value === option.value && "bg-blue-50 text-blue-700"
                  )}
                >
                  {option.label}
                </SelectItem>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-gray-500">
                No results found
              </div>
            )}
            {hasMoreOptions && (
              <div className="py-2 px-3 text-xs text-gray-400 bg-gray-50 border-t border-gray-100 sticky bottom-0">
                Showing {maxDisplayCount} of {filteredOptions.length} options
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
