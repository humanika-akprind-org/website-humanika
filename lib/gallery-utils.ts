import type { Event } from "@/types/event";
import type { Gallery } from "@/types/gallery";

export interface Album {
  id: string;
  title: string;
  count: number;
  cover: string;
  lastUpdated: Date;
  eventName: string;
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
export const getPreviewUrl = (image: string | null | undefined): string => {
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
};

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
      events.map((event) => new Date(event.startDate).getFullYear().toString())
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
      const eventDate = new Date(event.startDate);
      return {
        id: event.id,
        title: event.name,
        count: galleryCounts[event.id] || 0,
        cover: getPreviewUrl(event.thumbnail),
        lastUpdated: event.updatedAt,
        eventName: event.name,
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
