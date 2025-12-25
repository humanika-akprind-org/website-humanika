"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CalendarPickerProps {
  isOpen: boolean;
  currentMonth: Date;
  onNavigateMonth: (direction: "prev" | "next") => void;
  onDateSelect: (date: Date) => void;
  calendarRef: React.RefObject<HTMLDivElement>;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  isOpen,
  currentMonth,
  onNavigateMonth,
  onDateSelect,
  calendarRef,
}) => {
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add previous month's days to fill the first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push(prevDate);
    }

    // Add current month's days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // Add next month's days to fill the last week
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (_date: Date): boolean => false;

  const isCurrentMonth = (date: Date): boolean =>
    date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear();

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!isOpen) return null;

  return (
    <div
      ref={calendarRef}
      className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => onNavigateMonth("prev")}
          className="p-1 hover:bg-gray-100 rounded-md"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={() => onNavigateMonth("next")}
          className="p-1 hover:bg-gray-100 rounded-md"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onDateSelect(date)}
            className={`w-10 h-10 text-sm rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isCurrentMonth(date)
                ? isSelected(date)
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : isToday(date)
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>

      {/* Today button */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onDateSelect(new Date())}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default CalendarPicker;
