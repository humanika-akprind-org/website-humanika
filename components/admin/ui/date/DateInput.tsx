"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import CalendarPicker from "./CalendarPicker";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = "Masukkan tanggal",
  disabled = false,
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputValue, setInputValue] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set current month to selected date when value changes
  useEffect(() => {
    if (value) {
      const selectedDate = new Date(value);
      if (!isNaN(selectedDate.getTime())) {
        setCurrentMonth(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        );
      }
    }
  }, [value]);

  // Update input value when value changes
  useEffect(() => {
    setInputValue(formatDisplayDate(value));
  }, [value]);

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const parseDate = (str: string): string | null => {
    const parts = str.split("/");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    const date = new Date(year, month, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseDate(inputValue);
    if (parsed) {
      onChange(parsed);
    } else {
      setInputValue(formatDisplayDate(value));
    }
  };

  const handleDateSelect = (date: Date) => {
    // Create date string in YYYY-MM-DD format to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>

      <div
        className={`relative flex border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
          error ? "border-red-500" : ""
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
          <FiCalendar className="text-gray-400" />
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      <CalendarPicker
        isOpen={isOpen}
        currentMonth={currentMonth}
        onNavigateMonth={navigateMonth}
        onDateSelect={handleDateSelect}
        calendarRef={calendarRef}
      />
    </div>
  );
};

export default DateInput;
