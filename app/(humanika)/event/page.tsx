"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import EventCard from "@/components/public/pages/card/event/EventCard";
import { useEventCategories } from "@/hooks/event-category/useEventCategories";
import {
  useEventData,
  useEventFilters,
  useFilteredEvents,
  useEventStats,
  useViewMode,
} from "@/hooks/event/useEventPage";
import {
  generateCategories,
  truncateDescription,
} from "@/components/public/pages/event/utils";
import EventHeroSection from "@/components/public/sections/event/EventHeroSection";
import EventTabs from "@/components/public/pages/event/EventTabs";
import EventControlBar from "@/components/public/pages/event/EventControlBar";
import EventEmptyState from "@/components/public/pages/event/EventEmptyState";
import EventCalendarView from "@/components/public/pages/event/EventCalendarView";
import EventLoadMore from "@/components/public/pages/event/EventLoadMore";
import FeaturedPastEvents from "@/components/public/pages/event/FeaturedPastEvents";
import PopularCategories from "@/components/public/pages/event/EventPopularCategories";
import EventPageLoadingState from "@/components/public/pages/event/EventPageLoadingState";
import EventErrorState from "@/components/public/pages/event/EventErrorState";

export default function EventPage() {
  // Custom hooks for data management
  const { allEvents, loading, error, refetch } = useEventData();
  const { filters, setters, actions } = useEventFilters();
  const { filteredEvents, hasMore } = useFilteredEvents(allEvents, filters);
  const stats = useEventStats(allEvents);
  const { viewMode, setViewMode } = useViewMode();

  // Fetch dynamic categories from API
  const { categories: eventCategories } = useEventCategories();

  // Generate categories with counts
  const categories = useMemo(
    () => generateCategories(eventCategories, allEvents),
    [eventCategories, allEvents]
  );

  // Get past events for featured section
  const pastEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter((event) => new Date(event.endDate) < now)
      .slice(0, 4);
  }, [allEvents]);

  // Check if there are active filters
  const hasActiveFilters = Boolean(
    filters.searchQuery.trim() ||
      filters.selectedCategory !== "all" ||
      filters.selectedType !== "all" ||
      filters.selectedStatus !== "all"
  );

  // Loading state for initial load
  if (loading && filters.page === 1) {
    return <EventPageLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <EventHeroSection
        searchQuery={filters.searchQuery}
        onSearchChange={setters.setSearchQuery}
        stats={stats}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs Navigation */}
        <EventTabs
          activeTab={filters.activeTab}
          onTabChange={setters.setActiveTab}
          stats={stats}
        />

        {/* Control Bar */}
        <EventControlBar
          filters={filters}
          onCategoryChange={setters.setSelectedCategory}
          onSortChange={setters.setSortBy}
          onViewModeChange={setViewMode}
          onResetFilters={actions.resetFilters}
          categories={categories}
          selectedCategory={filters.selectedCategory}
          viewMode={viewMode}
          sortBy={filters.sortBy}
        />

        {/* Events Content */}
        <div className="mt-12">
          {/* Error State */}
          {error && <EventErrorState error={error} onRetry={refetch} />}

          {/* Empty State */}
          {!loading && !error && filteredEvents.length === 0 && (
            <EventEmptyState
              hasFilters={hasActiveFilters}
              onResetFilters={actions.resetFilters}
            />
          )}

          {/* Events Display */}
          {filteredEvents.length > 0 && (
            <>
              {/* Results Info */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-grey-900">
                    {filters.activeTab === "upcoming"
                      ? "Event Mendatang"
                      : filters.activeTab === "past"
                      ? "Event Terdahulu"
                      : "Semua Event"}
                  </h2>
                  <p className="text-grey-600 mt-2">
                    Menampilkan {filteredEvents.length} dari {allEvents.length}{" "}
                    event
                  </p>
                </div>
                <div className="text-sm text-grey-600">
                  Halaman {filters.page} • {Math.ceil(allEvents.length / 9)}{" "}
                  total halaman
                </div>
              </div>

              {/* Events Grid */}
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredEvents.map((event, index) => {
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
                <EventCalendarView allEvents={allEvents} />
              )}

              {/* Load More */}
              {hasMore && (
                <EventLoadMore
                  onLoadMore={actions.loadMore}
                  loading={loading}
                />
              )}
            </>
          )}

          {/* Featured Past Events */}
          {filters.activeTab !== "past" && pastEvents.length > 0 && (
            <FeaturedPastEvents pastEvents={pastEvents} />
          )}
        </div>

        {/* Popular Categories */}
        <PopularCategories
          categories={categories}
          selectedCategory={filters.selectedCategory}
          onCategoryClick={setters.setSelectedCategory}
        />
      </div>
    </div>
  );
}
