import { useState, useEffect, useMemo } from "react";
import type { Event } from "@/types/event";

export type EventTab = "upcoming" | "past" | "all";
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
  past: number;
}

export function useEventData() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/event?status=PUBLISH`,
        {
          cache: "no-store",
        }
      );
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

    // Filter by active tab
    if (filters.activeTab === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.startDate) > now);
    } else if (filters.activeTab === "past") {
      filtered = filtered.filter((event) => new Date(event.endDate) < now);
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
      totalFiltered = totalFiltered.filter(
        (event) => new Date(event.startDate) > now
      );
    } else if (filters.activeTab === "past") {
      totalFiltered = totalFiltered.filter(
        (event) => new Date(event.endDate) < now
      );
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
      upcoming: allEvents.filter((e) => new Date(e.startDate) > now).length,
      past: allEvents.filter((e) => new Date(e.endDate) < now).length,
    };
  }, [allEvents]);
}

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  return { viewMode, setViewMode };
}
