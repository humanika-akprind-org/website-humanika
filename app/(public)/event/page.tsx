"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import EventCard from "@/components/public/event/EventCard";
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
} from "@/components/public/event/utils";
import EventHeroSection from "@/components/public/event/EventHeroSection";
import EventTabs from "@/components/public/event/EventTabs";
import EventControlBar from "@/components/public/event/EventControlBar";
import EventEmptyState from "@/components/public/event/EventEmptyState";
import EventCalendarView from "@/components/public/event/EventCalendarView";
import EventLoadMore from "@/components/public/event/EventLoadMore";
import FeaturedPastEvents from "@/components/public/event/FeaturedPastEvents";
import PopularCategories from "@/components/public/event/PopularCategories";
import LoadingState from "@/components/public/event/LoadingState";
import ErrorState from "@/components/public/event/ErrorState";

export default function EventPage() {
  // Custom hooks for data management
  const { allEvents, loading, error, refetch } = useEventData();
  const { filters, setters, actions } = useEventFilters(allEvents);
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

  // Loading state
  if (loading && filters.page === 1) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
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
        <div className="mb-12">
          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <EventEmptyState
              activeTab={filters.activeTab}
              searchQuery={filters.searchQuery}
              selectedCategory={filters.selectedCategory}
              selectedType={filters.selectedType}
              selectedStatus={filters.selectedStatus}
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
        />
      </div>
    </div>
  );
}
