import { useState, useEffect } from "react";
import { getEvents } from "@/use-cases/api/event";
import { getGalleryCategories } from "@/use-cases/api/gallery-category";
import type { Event } from "@/types/event";
import type { GalleryCategory } from "@/types/gallery-category";

export function useGalleryFormData() {
  const [events, setEvents] = useState<Event[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [eventsData, categoriesData] = await Promise.all([
          getEvents(),
          getGalleryCategories(),
        ]);
        setEvents(eventsData);
        setGalleryCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load form data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  return {
    events,
    galleryCategories,
    loading,
    error,
  };
}
