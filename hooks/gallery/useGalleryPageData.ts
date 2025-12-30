import { useMemo } from "react";
import { useEvents } from "@/hooks/event/useEvents";
import { useGalleries } from "@/hooks/gallery/useGalleries";
import { Status } from "@/types/enums";
import {
  getGalleryCounts,
  getYearsFromEvents,
  transformEventsToAlbums,
  calculateGalleryStats,
} from "@/lib/gallery-utils";

export function useGalleryPageData() {
  const {
    events,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useEvents({ status: Status.PUBLISH });

  const {
    galleries,
    isLoading: galleriesLoading,
    error: galleriesError,
    refetch: refetchGalleries,
  } = useGalleries();

  const isLoading = eventsLoading || galleriesLoading;
  const error = eventsError || galleriesError;

  const refetch = () => {
    refetchEvents();
    refetchGalleries();
  };

  const galleryCounts = useMemo(() => getGalleryCounts(galleries), [galleries]);

  const years = useMemo(() => getYearsFromEvents(events), [events]);

  const albums = useMemo(
    () => transformEventsToAlbums(events, galleryCounts),
    [events, galleryCounts]
  );

  const stats = useMemo(
    () => calculateGalleryStats(galleries, events),
    [galleries, events]
  );

  return {
    events,
    galleries,
    isLoading,
    error,
    refetch,
    albums,
    stats,
    years,
  };
}
