import type { Event } from "types/event";

/**
 * Generates a preview URL for an image based on its source
 * @param image - The image URL or file ID
 * @returns The processed image URL
 */
export function getPreviewUrl(image: string | null | undefined): string {
  if (!image) return "";

  if (image.includes("drive.google.com")) {
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return image;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    return `/api/drive-image?fileId=${image}`;
  } else {
    return image;
  }
}

/**
 * Formats a date range for display
 * @param startDate - Start date of the event
 * @param endDate - End date of the event
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  return `${startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })} - ${endDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

/**
 * Formats time for display
 * @param date - Date object to format
 * @returns Formatted time string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Determines the status of an event relative to current time
 * @param startDate - Event start date
 * @param endDate - Event end date
 * @returns Object with status flags
 */
export function getEventStatus(startDate: Date, endDate: Date) {
  const now = new Date();
  const isPastEvent = endDate < now;
  const isUpcomingEvent = startDate > now;

  return {
    isPastEvent,
    isUpcomingEvent,
    isOngoingEvent: !isPastEvent && !isUpcomingEvent,
  };
}

/**
 * Filters and sorts past events
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
    .filter((e) => new Date(e.endDate) < new Date() && e.id !== currentEventId)
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
