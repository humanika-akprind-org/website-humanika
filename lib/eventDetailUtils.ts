import type { Event, ScheduleItem } from "types/event";
import { getGoogleDrivePreviewUrl } from "@/lib/google-drive/file-utils";

/**
 * Generates a preview URL for an image based on its source
 * @param image - The image URL or file ID
 * @returns The processed image URL
 */
export function getPreviewUrl(image: string | null | undefined): string {
  if (!image) return "";
  return getGoogleDrivePreviewUrl(image);
}

/**
 * Formats a single schedule item for display
 * @param schedule - The schedule item
 * @returns Formatted schedule string
 */
export function formatSchedule(schedule: ScheduleItem): string {
  const date = new Date(schedule.date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = schedule.startTime
    ? `${schedule.startTime}${schedule.endTime ? ` - ${schedule.endTime}` : ""}`
    : "";

  const location = schedule.location ? ` | ${schedule.location}` : "";

  if (time) {
    return `${date} | ${time}${location}`;
  }
  return `${date}${location}`;
}

/**
 * Formats a date range from schedules for display
 * @param schedules - Array of schedule items
 * @returns Formatted date range string
 */
export function formatDateRange(schedules: ScheduleItem[]): string {
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    return "";
  }

  if (schedules.length === 1) {
    return formatSchedule(schedules[0]);
  }

  // Sort schedules by date
  const sorted = [...schedules].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstDate = new Date(sorted[0].date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });

  const lastDate = new Date(sorted[sorted.length - 1].date).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return `${firstDate} - ${lastDate}`;
}

/**
 * Formats time for display
 * @param time - Time string in HH:mm format
 * @returns Formatted time string
 */
export function formatTime(time: string | undefined): string {
  if (!time) return "";
  return time;
}

/**
 * Determines the status of an event relative to current time based on schedules
 * @param schedules - Array of schedule items
 * @returns Object with status flags
 */
export function getEventStatus(schedules: ScheduleItem[]) {
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    return {
      isPastEvent: false,
      isUpcomingEvent: false,
      isOngoingEvent: false,
      hasSchedules: false,
    };
  }

  const now = new Date();
  const dates = schedules.map((s) => new Date(s.date));
  const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const isPastEvent = latestDate < now;
  const isUpcomingEvent = earliestDate > now;

  return {
    isPastEvent,
    isUpcomingEvent,
    isOngoingEvent: !isPastEvent && !isUpcomingEvent,
    hasSchedules: true,
  };
}

/**
 * Filters and sorts past events based on schedules
 * @param events - Array of events
 * @param currentEventId - ID of current event to exclude
 * @param limit - Maximum number of events to return
 * @returns Filtered past events
 */
export function getPastEvents(
  events: Event[],
  currentEventId: string,
  limit: number = 4
): Event[] {
  return events
    .filter((e) => {
      if (e.id === currentEventId) return false;
      if (
        !e.schedules ||
        !Array.isArray(e.schedules) ||
        e.schedules.length === 0
      ) {
        return false;
      }

      const latestDate = new Date(
        Math.max(...e.schedules.map((s) => new Date(s.date).getTime()))
      );
      return latestDate < new Date();
    })
    .slice(0, limit);
}

/**
 * Filters related events based on category or department
 * @param events - Array of events
 * @param currentEvent - Current event object
 * @param limit - Maximum number of events to return
 * @returns Filtered related events
 */
export function getRelatedEvents(
  events: Event[],
  currentEvent: Event,
  limit: number = 6
): Event[] {
  return events
    .filter(
      (e) =>
        e.id !== currentEvent.id &&
        (e.categoryId === currentEvent.categoryId ||
          e.department === currentEvent.department)
    )
    .slice(0, limit);
}

/**
 * Truncates description text for display
 * @param description - Full description text
 * @param maxLength - Maximum length before truncation
 * @returns Truncated description
 */
export function truncateDescription(
  description: string | undefined,
  maxLength: number = 150
): string {
  if (!description) return "";
  return description.length > maxLength
    ? description.substring(0, maxLength) + "..."
    : description;
}

/**
 * Handles sharing functionality with fallback
 * @param eventName - Name of the event
 * @param description - Event description
 * @param url - Current page URL
 */
export function handleShare(
  eventName: string,
  description: string | undefined,
  url: string
): void {
  navigator
    .share?.({
      title: eventName,
      text: description?.substring(0, 100) + "..." || "",
      url,
    })
    .catch(() => {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    });
}

/**
 * Get the earliest date from schedules
 */
export function getEarliestScheduleDate(
  schedules: ScheduleItem[]
): Date | null {
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    return null;
  }
  const dates = schedules.map((s) => new Date(s.date));
  return new Date(Math.min(...dates.map((d) => d.getTime())));
}

/**
 * Get the latest date from schedules
 */
export function getLatestScheduleDate(schedules: ScheduleItem[]): Date | null {
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    return null;
  }
  const dates = schedules.map((s) => new Date(s.date));
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}
