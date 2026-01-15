import type { ScheduleItem } from "@/types/event";

/**
 * Helper function to get the earliest date from schedules
 */
export const getEarliestScheduleDate = (
  schedules: ScheduleItem[] | null | undefined
): Date | null => {
  if (!schedules || schedules.length === 0) return null;
  const dates = schedules.map((s) => new Date(s.date));
  return new Date(Math.min(...dates.map((d) => d.getTime())));
};

/**
 * Helper function to get the latest date from schedules
 */
export const getLatestScheduleDate = (
  schedules: ScheduleItem[] | null | undefined
): Date | null => {
  if (!schedules || schedules.length === 0) return null;
  const dates = schedules.map((s) => new Date(s.date));
  return new Date(Math.max(...dates.map((d) => d.getTime())));
};

/**
 * Helper function to get startDate from schedules (for backward compatibility)
 */
export const getStartDateFromSchedules = (
  schedules: ScheduleItem[] | null | undefined
): string | null => {
  const date = getEarliestScheduleDate(schedules);
  return date ? date.toISOString().split("T")[0] : null;
};

/**
 * Helper function to get endDate from schedules (for backward compatibility)
 */
export const getEndDateFromSchedules = (
  schedules: ScheduleItem[] | null | undefined
): string | null => {
  const date = getLatestScheduleDate(schedules);
  return date ? date.toISOString().split("T")[0] : null;
};

/**
 * Check if event is upcoming based on schedules
 */
export const isEventUpcoming = (
  schedules: ScheduleItem[] | null | undefined
): boolean => {
  const earliestDate = getEarliestScheduleDate(schedules);
  if (!earliestDate) return false;
  return earliestDate > new Date();
};

/**
 * Check if event is ongoing based on schedules
 */
export const isEventOngoing = (
  schedules: ScheduleItem[] | null | undefined
): boolean => {
  const earliestDate = getEarliestScheduleDate(schedules);
  const latestDate = getLatestScheduleDate(schedules);
  if (!earliestDate || !latestDate) return false;
  const now = new Date();
  return now >= earliestDate && now <= latestDate;
};

/**
 * Check if event is past based on schedules
 */
export const isEventPast = (
  schedules: ScheduleItem[] | null | undefined
): boolean => {
  const latestDate = getLatestScheduleDate(schedules);
  if (!latestDate) return false;
  return latestDate < new Date();
};

/**
 * Format date range from schedules for display
 */
export const formatDateRangeFromSchedules = (
  schedules: ScheduleItem[] | null | undefined
): string => {
  const earliestDate = getEarliestScheduleDate(schedules);
  const latestDate = getLatestScheduleDate(schedules);

  if (!earliestDate || !latestDate) return "Jadwal belum ditentukan";

  if (earliestDate.toDateString() === latestDate.toDateString()) {
    return earliestDate.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return `${earliestDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })} - ${latestDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

/**
 * Check if event is multi-day based on schedules
 */
export const isEventMultiDay = (
  schedules: ScheduleItem[] | null | undefined
): boolean => {
  const earliestDate = getEarliestScheduleDate(schedules);
  const latestDate = getLatestScheduleDate(schedules);
  if (!earliestDate || !latestDate) return false;
  return latestDate.getTime() - earliestDate.getTime() > 24 * 60 * 60 * 1000;
};
