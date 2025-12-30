import { useState, useEffect } from "react";
import { getEvent, getEvents } from "@/use-cases/api/event";
import { getGalleries } from "@/use-cases/api/gallery";
import type { Event } from "@/types/event";
import type { Gallery } from "@/types/gallery";
import { Status } from "@/types/enums";

export interface AlbumData {
  id: string;
  title: string;
  date: Date;
  description: string;
  photos: {
    id: string;
    title: string;
    url: string;
    createdAt: Date;
  }[];
  thumbnail: string | null | undefined;
}

export interface UseGalleryDetailReturn {
  event: Event | null;
  galleries: Gallery[];
  relatedEvents: Event[];
  galleryCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
  album: AlbumData | null;
  formattedDate: string;
}

export const useGalleryDetail = (id: string): UseGalleryDetailReturn => {
  const [event, setEvent] = useState<Event | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [galleryCounts, setGalleryCounts] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventData, allGalleriesData, eventsData] = await Promise.all([
          getEvent(id),
          getGalleries(),
          getEvents({ status: Status.PUBLISH }),
        ]);

        // Group all galleries by eventId and count them
        const galleryCounts = allGalleriesData.reduce((acc, gallery) => {
          acc[gallery.eventId] = (acc[gallery.eventId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const relatedEventsData = eventsData
          .filter(
            (e) =>
              e.id !== id &&
              (galleryCounts[e.id] || 0) > 0 &&
              e.category?.id === eventData.category?.id
          )
          .slice(0, 4);

        // Filter galleries for current event only
        const currentEventGalleries = allGalleriesData.filter(
          (gallery) => gallery.eventId === id
        );

        setEvent(eventData);
        setGalleries(currentEventGalleries);
        setGalleryCounts(galleryCounts);
        setRelatedEvents(relatedEventsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load gallery data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const album: AlbumData | null = event
    ? {
        id: event.id,
        title: event.name,
        date: new Date(event.startDate),
        description: event.description,
        photos: galleries.map((gallery) => ({
          id: gallery.id,
          title: gallery.title,
          url: gallery.image,
          createdAt: new Date(gallery.createdAt),
        })),
        thumbnail: event.thumbnail,
      }
    : null;

  const formattedDate = album
    ? album.date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return {
    event,
    galleries,
    relatedEvents,
    galleryCounts,
    loading,
    error,
    album,
    formattedDate,
  };
};
