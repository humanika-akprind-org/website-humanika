import { useState, useCallback } from "react";
import { DEFAULT_FILTERS } from "@/components/public/gallery/constants";

export type GalleryFilters = typeof DEFAULT_FILTERS;

export function useGalleryFilters() {
  const [filters, setFilters] = useState<GalleryFilters>(DEFAULT_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof GalleryFilters>(key: K, value: GalleryFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.selectedYear !== "all" ||
    filters.selectedEvent !== "all";

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
}
