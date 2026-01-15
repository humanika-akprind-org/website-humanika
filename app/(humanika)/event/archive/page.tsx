"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import EventCard from "@/components/public/pages/card/event/EventCard";
import { useEventCategories } from "@/hooks/event-category/useEventCategories";
import { useEventData } from "@/hooks/event/useEventPage";
import {
  generateCategories,
  truncateDescription,
} from "@/components/public/pages/event/utils";
import EventHeroSection from "@/components/public/sections/event/EventHeroSection";
import EventControlBar from "@/components/public/pages/event/EventControlBar";
import EventEmptyState from "@/components/public/pages/event/EventEmptyState";
import EventCalendarView from "@/components/public/pages/event/EventCalendarView";
import EventLoadMore from "@/components/public/pages/event/EventLoadMore";
import ArchivePageLoadingState from "@/components/public/pages/event/ArchivePageLoadingState";
import ErrorState from "@/components/public/pages/event/EventErrorState";
import PopularCategories from "@/components/public/pages/event/EventPopularCategories";
import type {
  EventFilters,
  ViewMode,
  SortBy,
} from "@/hooks/event/useEventPage";
import type { ScheduleItem } from "@/types/event";

// Helper function to get the latest schedule date from an event
function getLatestScheduleDate(
  schedules: ScheduleItem[] | null | undefined
): Date | null {
  if (!schedules || schedules.length === 0) return null;
  const dates = schedules.map((s) => new Date(s.date).getTime());
  return new Date(Math.max(...dates));
}

// Helper function to get the earliest schedule date from an event
function getEarliestScheduleDate(
  schedules: ScheduleItem[] | null | undefined
): Date | null {
  if (!schedules || schedules.length === 0) return null;
  const dates = schedules.map((s) => new Date(s.date).getTime());
  return new Date(Math.min(...dates));
}

export default function EventArchivePage() {
  // Custom hooks for data management
  const { allEvents, loading, error, refetch } = useEventData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);

  // Fetch dynamic categories from API
  const { categories: eventCategories } = useEventCategories();

  // Generate categories with counts
  const categories = useMemo(
    () => generateCategories(eventCategories, allEvents),
    [eventCategories, allEvents]
  );

  // Get only past events for archive page
  const archiveEvents = useMemo(() => {
    const now = new Date();
    return allEvents.filter((event) => {
      const latestDate = getLatestScheduleDate(event.schedules);
      return latestDate && latestDate < now;
    });
  }, [allEvents]);

  // Filters object for EventControlBar
  const filters: EventFilters = {
    searchQuery,
    selectedCategory,
    selectedType,
    selectedStatus,
    sortBy,
    activeTab: "past",
    page,
  };

  // Check if there are active filters
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      selectedCategory !== "all" ||
      selectedType !== "all" ||
      selectedStatus !== "all"
  );

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSortBy("date");
    setPage(1);
  };

  // Load more
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Get filtered archive events
  const displayedEvents = useMemo(() => {
    let events = [...archiveEvents];

    // Apply search filter
    if (searchQuery.trim()) {
      events = events.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      events = events.filter(
        (event) =>
          event.category?.name?.toLowerCase().replace(/\s+/g, "-") ===
          selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    if (sortBy === "date") {
      events.sort((a, b) => {
        const dateA = getEarliestScheduleDate(a.schedules);
        const dateB = getEarliestScheduleDate(b.schedules);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === "name") {
      events.sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'popular' would need additional data (likes/views)

    // Pagination
    return events.slice(0, page * 12);
  }, [archiveEvents, searchQuery, selectedCategory, sortBy, page]);

  const archiveHasMore = useMemo(() => {
    let events = [...archiveEvents];

    if (searchQuery.trim()) {
      events = events.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      events = events.filter(
        (event) =>
          event.category?.name?.toLowerCase().replace(/\s+/g, "-") ===
          selectedCategory.toLowerCase()
      );
    }

    return events.length > page * 12;
  }, [archiveEvents, searchQuery, selectedCategory, page]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = allEvents.filter((e) => {
      const earliestDate = getEarliestScheduleDate(e.schedules);
      return earliestDate && earliestDate > now;
    });
    const ongoing = allEvents.filter((e) => {
      const earliestDate = getEarliestScheduleDate(e.schedules);
      const latestDate = getLatestScheduleDate(e.schedules);
      return earliestDate && latestDate
        ? earliestDate <= now && latestDate >= now
        : false;
    });
    return {
      total: allEvents.length,
      upcoming: upcoming.length,
      ongoing: ongoing.length,
      past: archiveEvents.length,
    };
  }, [allEvents, archiveEvents]);

  // Loading state for initial load
  if (loading && page === 1) {
    return <ArchivePageLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <EventHeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-grey-900">
            Arsip Event Terdahulu
          </h2>
          <p className="text-grey-600 mt-2">
            Menampilkan {displayedEvents.length} dari {archiveEvents.length}{" "}
            event yang telah berlalu
          </p>
        </div>

        {/* Control Bar */}
        <EventControlBar
          filters={filters}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
          onViewModeChange={setViewMode}
          onResetFilters={resetFilters}
          categories={categories}
          selectedCategory={selectedCategory}
          viewMode={viewMode}
          sortBy={sortBy}
        />

        {/* Events Content */}
        <div>
          {/* Error State */}
          {error && <ErrorState error={error} onRetry={refetch} />}

          {/* Empty State */}
          {!loading && !error && displayedEvents.length === 0 && (
            <EventEmptyState
              hasFilters={hasActiveFilters}
              onResetFilters={resetFilters}
            />
          )}

          {/* Events Display */}
          {displayedEvents.length > 0 && (
            <>
              {/* Events Grid */}
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {displayedEvents.map((event, index) => {
                      const truncatedDescription = truncateDescription(
                        event.description
                      );
                      return (
                        <EventCard
                          key={event.id}
                          event={event}
                          truncatedDescription={truncatedDescription}
                          index={index}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <EventCalendarView allEvents={archiveEvents} />
              )}

              {/* Load More */}
              {archiveHasMore && (
                <EventLoadMore onLoadMore={loadMore} loading={loading} />
              )}
            </>
          )}
        </div>

        {/* Popular Categories */}
        <div className="mt-16">
          <PopularCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={setSelectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
