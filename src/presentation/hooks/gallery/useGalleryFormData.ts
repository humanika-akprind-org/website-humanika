import { useState, useEffect } from "react";
import { getEvents } from "@/presentation/services/event";
import { getGalleryCategories } from "@/presentation/services/gallery-category";
import { getPeriods } from "@/presentation/services/period";
import type { Event } from "@/domain/entities/event";
import type { GalleryCategory } from "@/domain/value-objects/gallery-category";
import type { Period } from "@/domain/entities/period";

export function useGalleryFormData() {
  const [events, setEvents] = useState<Event[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>(
    [],
  );
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [eventsData, categoriesData, periodsData] = await Promise.all([
          getEvents(),
          getGalleryCategories(),
          getPeriods(),
        ]);
        setEvents(eventsData);
        setGalleryCategories(categoriesData);
        setPeriods(periodsData);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load form data",
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
    periods,
    loading,
    error,
  };
}
