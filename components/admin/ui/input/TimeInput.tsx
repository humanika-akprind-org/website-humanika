"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import TimePicker from "@/components/admin/ui/date/TimePicker";

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function TimeInput({
  label,
  value,
  onChange,
  required = false,
  placeholder = "Pilih waktu",
  disabled = false,
  error,
  className = "",
}: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update input value when value changes
  useEffect(() => {
    setInputValue(formatDisplayTime(value));
  }, [value]);

  // Format time for display (e.g., "09:00" -> "09.00")
  const formatDisplayTime = (timeString: string): string => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    if (!hours || !minutes) return "";
    return `${hours}.${minutes}`;
  };

  // Parse display time to input value (e.g., "09.00" -> "09:00")
  const parseTime = (str: string): string | null => {
    const parts = str.split(".");
    if (parts.length !== 2) return null;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseTime(inputValue);
    if (parsed) {
      onChange(parsed);
    } else {
      setInputValue(formatDisplayTime(value));
    }
  };

  const handleTimeSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>

      <div
        className={`relative flex border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
          error ? "border-red-500 focus-within:ring-red-500" : ""
        }`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-4 py-2 text-sm rounded-l-lg focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="px-3 py-2 rounded-r-lg bg-gray-50 hover:bg-gray-100 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <FiClock className="text-gray-400 w-4 h-4" />
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      <TimePicker
        isOpen={isOpen}
        value={value}
        onTimeSelect={handleTimeSelect}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
