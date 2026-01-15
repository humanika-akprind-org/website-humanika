"use client";

import React, { useState, useRef, useEffect } from "react";

interface TimePickerProps {
  isOpen: boolean;
  value: string;
  onTimeSelect: (time: string) => void;
  onClose: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  isOpen,
  value,
  onTimeSelect,
  onClose,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Initialize time from value
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        if (hours >= 12) {
          setPeriod("PM");
          setSelectedHour(hours === 12 ? 12 : hours - 12);
        } else {
          setPeriod("AM");
          setSelectedHour(hours === 0 ? 12 : hours);
        }
        setSelectedMinute(minutes);
      }
    } else {
      const now = new Date();
      const hours = now.getHours();
      setPeriod(hours >= 12 ? "PM" : "AM");
      setSelectedHour(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);
      setSelectedMinute(now.getMinutes());
    }
  }, [value, isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle hour selection
  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
  };

  // Handle minute selection
  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
  };

  // Handle period toggle
  const handlePeriodToggle = () => {
    setPeriod((prev) => (prev === "AM" ? "PM" : "AM"));
  };

  // Confirm selection
  const handleConfirm = () => {
    let hours = selectedHour;
    if (period === "PM" && selectedHour !== 12) {
      hours = selectedHour + 12;
    } else if (period === "AM" && selectedHour === 12) {
      hours = 0;
    }
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")}`;
    onTimeSelect(formattedTime);
    onClose();
  };

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate minutes (0, 5, 10, ..., 55)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64"
    >
      {/* Time display and AM/PM toggle */}
      <div className="flex items-center justify-center mb-3">
        <div className="text-center">
          <span className="text-2xl font-semibold text-gray-800">
            {String(selectedHour).padStart(2, "0")}:
            {String(selectedMinute).padStart(2, "0")}
          </span>
        </div>
        <button
          type="button"
          onClick={handlePeriodToggle}
          className="ml-2 px-2 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {period}
        </button>
      </div>

      {/* Hour and Minute columns */}
      <div className="flex gap-2">
        {/* Hour column */}
        <div className="flex-1 max-h-32 overflow-y-auto border border-gray-200 rounded">
          <div className="text-xs text-center text-gray-500 py-1 bg-gray-50">
            Hour
          </div>
          <div className="grid grid-cols-3 gap-1 p-1">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => handleHourSelect(hour)}
                className={`px-2 py-1 text-sm rounded transition-colors ${
                  selectedHour === hour
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {hour}
              </button>
            ))}
          </div>
        </div>

        {/* Minute column */}
        <div className="flex-1 max-h-32 overflow-y-auto border border-gray-200 rounded">
          <div className="text-xs text-center text-gray-500 py-1 bg-gray-50">
            Minute
          </div>
          <div className="grid grid-cols-3 gap-1 p-1">
            {minutes.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => handleMinuteSelect(minute)}
                className={`px-2 py-1 text-sm rounded transition-colors ${
                  selectedMinute === minute
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {String(minute).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <div className="flex justify-end mt-3 pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={handleConfirm}
          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default TimePicker;
