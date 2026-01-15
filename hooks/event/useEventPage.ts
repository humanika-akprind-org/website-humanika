import { useState, useEffect, useMemo } from "react";
import type { Event, ScheduleItem } from "@/types/event";

export type EventTab = "upcoming" | "ongoing" | "past" | "all";
export type ViewMode = "grid" | "calendar";
export type SortBy = "date" | "popular" | "name";

export interface EventFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedType: string;
  selectedStatus: string;
  sortBy: SortBy;
  activeTab: EventTab;
  page: number;
}

export interface EventStats {
  total: number;
  upcoming: number;
  ongoing: number;
  past: number;
}

/**
 * Helper function to get the latest date from schedules
 */
const getLatestScheduleDate = (
  schedules: ScheduleItem[] | null | undefined
): Date | null => {
  if (!schedules || schedules.length === 0) return null;
  const dates = schedules.map((s) => new Date(s.date));
  return new Date(Math.max(...dates.map((d) => d.getTime())));
};

/**
 * Helper function to get the earliest date from schedules
 */
const getEarliestScheduleDate = (
  schedules: ScheduleItem[] | null | undefined
): Date | null => {
  if (!schedules || schedules.length === 0) return null;
  const dates = schedules.map((s) => new Date(s.date));
  return new Date(Math.min(...dates.map((d) => d.getTime())));
};

export function useEventData() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Use relative URL to work in both development and production
      const res = await fetch("/api/event?status=PUBLISH", {
        cache: "no-store",
      });
      const events: Event[] = await res.json();
      setAllEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Gagal memuat data event. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    allEvents,
    loading,
    error,
    refetch: fetchEvents,
  };
}

export function useEventFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [page, setPage] = useState(1);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSortBy("date");
    setPage(1);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const setActiveTabAndResetPage = (tab: EventTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return {
    filters: {
      searchQuery,
      selectedCategory,
      selectedType,
      selectedStatus,
      sortBy,
      activeTab,
      page,
    },
    setters: {
      setSearchQuery,
      setSelectedCategory,
      setSelectedType,
      setSelectedStatus,
      setSortBy,
      setActiveTab: setActiveTabAndResetPage,
      setPage,
    },
    actions: {
      resetFilters,
      loadMore,
    },
  };
}

export function useFilteredEvents(allEvents: Event[], filters: EventFilters) {
  const filteredEvents = useMemo(() => {
    const now = new Date();
    let filtered = [...allEvents];

    // Filter by active tab based on schedules
    if (filters.activeTab === "upcoming") {
      filtered = filtered.filter((event) => {
        const earliestDate = getEarliestScheduleDate(event.schedules);
        return earliestDate ? earliestDate > now : false;
      });
    } else if (filters.activeTab === "ongoing") {
      filtered = filtered.filter((event) => {
        const earliestDate = getEarliestScheduleDate(event.schedules);
        const latestDate = getLatestScheduleDate(event.schedules);
        return earliestDate && latestDate
          ? earliestDate <= now && latestDate >= now
          : false;
      });
    } else if (filters.activeTab === "past") {
      filtered = filtered.filter((event) => {
        const latestDate = getLatestScheduleDate(event.schedules);
        return latestDate ? latestDate < now : false;
      });
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          event.description
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filters.selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) =>
          event.category?.name?.toLowerCase().replace(/\s+/g, "-") ===
          filters.selectedCategory.toLowerCase()
      );
    }

    // Pagination
    const paginated = filtered.slice(0, filters.page * 9);
    return paginated;
  }, [allEvents, filters]);

  const hasMore = useMemo(() => {
    const now = new Date();
    let totalFiltered = [...allEvents];

    if (filters.activeTab === "upcoming") {
      totalFiltered = totalFiltered.filter((event) => {
        const earliestDate = getEarliestScheduleDate(event.schedules);
        return earliestDate ? earliestDate > now : false;
      });
    } else if (filters.activeTab === "ongoing") {
      totalFiltered = totalFiltered.filter((event) => {
        const earliestDate = getEarliestScheduleDate(event.schedules);
        const latestDate = getLatestScheduleDate(event.schedules);
        return earliestDate && latestDate
          ? earliestDate <= now && latestDate >= now
          : false;
      });
    } else if (filters.activeTab === "past") {
      totalFiltered = totalFiltered.filter((event) => {
        const latestDate = getLatestScheduleDate(event.schedules);
        return latestDate ? latestDate < now : false;
      });
    }

    if (filters.searchQuery.trim()) {
      totalFiltered = totalFiltered.filter(
        (event) =>
          event.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          event.description
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.selectedCategory !== "all") {
      totalFiltered = totalFiltered.filter(
        (event) =>
          event.category?.name?.toLowerCase().replace(/\s+/g, "-") ===
          filters.selectedCategory.toLowerCase()
      );
    }

    return totalFiltered.length > filters.page * 9;
  }, [allEvents, filters]);

  return {
    filteredEvents,
    hasMore,
  };
}

export function useEventStats(allEvents: Event[]) {
  return useMemo(() => {
    const now = new Date();
    return {
      total: allEvents.length,
      upcoming: allEvents.filter((e) => {
        const earliestDate = getEarliestScheduleDate(e.schedules);
        return earliestDate ? earliestDate > now : false;
      }).length,
      ongoing: allEvents.filter((e) => {
        const earliestDate = getEarliestScheduleDate(e.schedules);
        const latestDate = getLatestScheduleDate(e.schedules);
        return earliestDate && latestDate
          ? earliestDate <= now && latestDate >= now
          : false;
      }).length,
      past: allEvents.filter((e) => {
        const latestDate = getLatestScheduleDate(e.schedules);
        return latestDate ? latestDate < now : false;
      }).length,
    };
  }, [allEvents]);
}

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  return { viewMode, setViewMode };
}
