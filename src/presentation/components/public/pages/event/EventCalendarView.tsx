"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Event, ScheduleItem } from "@/types/event";

interface EventCalendarViewProps {
  allEvents: Event[];
}

// Helper function to check if event has a schedule on a specific date
function eventHasScheduleOnDate(
  schedules: ScheduleItem[] | null | undefined,
  targetDate: Date
): boolean {
  if (!schedules || schedules.length === 0) return false;
  return schedules.some((schedule) => {
    const scheduleDate = new Date(schedule.date);
    // Compare by year, month, and day components to avoid timezone issues
    return (
      scheduleDate.getFullYear() === targetDate.getFullYear() &&
      scheduleDate.getMonth() === targetDate.getMonth() &&
      scheduleDate.getDate() === targetDate.getDate()
    );
  });
}

// Helper function to get events that have a schedule on a specific date
function getEventsOnDate(events: Event[], targetDate: Date): Event[] {
  return events.filter((event) =>
    eventHasScheduleOnDate(event.schedules, targetDate)
  );
}

export default function EventCalendarView({
  allEvents,
}: EventCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month info
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get today's date for highlighting
  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day;

  // Format month name
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    "id-ID",
    { month: "long", year: "numeric" }
  );

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: { day: number | null; date: Date | null }[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({ day, date });
    }

    return days;
  }, [currentYear, currentMonth, firstDayOfMonth, daysInMonth]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-grey-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-grey-100 transition-colors"
          aria-label="Bulan sebelumnya"
        >
          <svg
            className="w-5 h-5 text-grey-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="text-center">
          <h3 className="text-xl font-bold text-grey-900 capitalize">
            {monthName}
          </h3>
          <button
            onClick={goToCurrentMonth}
            className="text-sm text-primary-600 hover:text-primary-700 mt-1"
          >
            Hari ini
          </button>
        </div>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-grey-100 transition-colors"
          aria-label="Bulan berikutnya"
        >
          <svg
            className="w-5 h-5 text-grey-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-grey-700 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((item, index) => {
          if (item.day === null) {
            return <div key={`empty-${index}`} className="h-12" />;
          }

          const eventsOnDate = getEventsOnDate(allEvents, item.date!);
          const hasEvent = eventsOnDate.length > 0;
          const today = isToday(item.day!);

          return (
            <div key={item.day} className="relative group">
              <Link
                href={hasEvent ? `/event/${eventsOnDate[0].slug}` : "#"}
                onClick={(e) => {
                  if (!hasEvent) e.preventDefault();
                }}
                className={`h-12 flex items-center justify-center rounded-lg border transition-all block ${
                  today
                    ? "bg-primary-600 border-primary-600 text-white font-semibold shadow-md"
                    : hasEvent
                    ? "bg-primary-50 border-primary-200 text-primary-700 cursor-pointer hover:bg-primary-100 hover:border-primary-300"
                    : "bg-grey-50 border-grey-200 text-grey-700 hover:bg-grey-100"
                }`}
              >
                {item.day}
              </Link>
              {/* Tooltip for events */}
              {hasEvent && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-grey-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 whitespace-nowrap pointer-events-none">
                  <div className="font-medium">{eventsOnDate[0].name}</div>
                  {eventsOnDate.length > 1 && (
                    <div className="text-xs text-grey-300 mt-1">
                      +{eventsOnDate.length - 1} event lainnya
                    </div>
                  )}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-grey-900" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-grey-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-50 border border-primary-200" />
          <span className="text-sm text-grey-600">Event tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-600" />
          <span className="text-sm text-grey-600">Hari ini</span>
        </div>
      </div>
    </div>
  );
}
