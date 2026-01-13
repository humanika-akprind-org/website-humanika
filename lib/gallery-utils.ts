import type { Event } from "@/types/event";
import type { Gallery } from "@/types/gallery";
import { getGoogleDrivePreviewUrl } from "@/lib/google-drive/file-utils";
import { getEarliestScheduleDate } from "@/lib/event-utils";

export interface Album {
  id: string;
  title: string;
  count: number;
  cover: string;
  lastUpdated: Date;
  eventName: string;
  eventSlug: string;
  category: string;
  date: Date;
  year: string;
}

export interface GalleryStats {
  totalPhotos: number;
  totalAlbums: number;
  totalEvents: number;
  latestUpload: string;
}

/**
 * Gets the preview URL for an image, handling Google Drive links
 */
export const getPreviewUrl = (image: string | null | undefined): string =>
  getGoogleDrivePreviewUrl(image);

/**
 * Groups galleries by eventId and counts them
 */
export const getGalleryCounts = (
  galleries: Gallery[]
): Record<string, number> =>
  galleries.reduce((acc, gallery) => {
    acc[gallery.eventId] = (acc[gallery.eventId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

/**
 * Extracts unique years from events, sorted descending
 */
export const getYearsFromEvents = (events: Event[]): string[] => {
  const years = Array.from(
    new Set(
      events
        .map((event) => getEarliestScheduleDate(event.schedules))
        .filter((date): date is Date => date !== null)
        .map((date) => date.getFullYear().toString())
    )
  ).sort((a, b) => b.localeCompare(a));

  return ["all", ...years];
};

/**
 * Transforms events into albums with gallery counts
 */
export const transformEventsToAlbums = (
  events: Event[],
  galleryCounts: Record<string, number>
): Album[] =>
  events
    .map((event) => {
      // Get earliest date from schedules
      const eventDate =
        event.schedules && event.schedules.length > 0
          ? new Date(
              Math.min(
                ...event.schedules.map((s) => new Date(s.date).getTime())
              )
            )
          : new Date(event.createdAt);
      return {
        id: event.id,
        title: event.name,
        count: galleryCounts[event.id] || 0,
        cover: getPreviewUrl(event.thumbnail),
        lastUpdated: event.updatedAt,
        eventName: event.name,
        eventSlug: event.slug,
        category: event.department?.toString() || "General",
        date: eventDate,
        year: eventDate.getFullYear().toString(),
      };
    })
    .filter((album) => album.count > 0); // Only show albums with photos

/**
 * Calculates gallery statistics
 */
export const calculateGalleryStats = (
  galleries: Gallery[],
  events: Event[]
): GalleryStats => ({
  totalPhotos: galleries.length,
  totalAlbums: events.length,
  totalEvents: new Set(galleries.map((g) => g.eventId)).size,
  latestUpload:
    galleries.length > 0
      ? new Date(galleries[0].createdAt).toLocaleDateString("id-ID")
      : "Belum ada",
});
