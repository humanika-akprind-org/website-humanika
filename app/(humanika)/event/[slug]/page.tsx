"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEventDetailPage } from "@/presentation/hooks/event/useEventDetailPage";
import EventDetailHeroSection from "@/presentation/components/public/sections/event/detail/EventDetailHeroSection";
import EventDetailContentSection from "@/presentation/components/public/sections/event/detail/EventDetailContentSection";
import EventSections from "@/presentation/components/public/sections/event/EventSections";
import EventDetailLoadingState from "@/presentation/components/public/pages/event/EventDetailLoadingState";
import EventErrorState from "@/presentation/components/public/pages/event/EventErrorState";
import EventNotFoundState from "@/presentation/components/public/pages/event/EventNotFoundState";

/**
 * Event detail page component
 * Displays comprehensive information about a specific event
 */
export default function EventDetail() {
  const params = useParams();

  // Use the full slug for API calls (API routes query by slug field)
  const slugParam = params.slug as string;

  const {
    event,
    loading,
    error,
    isBookmarked,
    setIsBookmarked,
    pastEvents,
    relatedEvents,
    refetch,
  } = useEventDetailPage(slugParam);

  // Loading state
  if (loading) {
    return <EventDetailLoadingState />;
  }

  // Error state - use reusable component
  if (error) {
    return <EventErrorState error={error} onRetry={refetch} />;
  }

  // Not found state - use reusable component
  if (!event) {
    return <EventNotFoundState />;
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 overflow-x-hidden">
      <EventDetailHeroSection
        event={event}
        isBookmarked={isBookmarked}
        onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
      />

      <EventDetailContentSection event={event} />

      <EventSections pastEvents={pastEvents} relatedEvents={relatedEvents} />
    </div>
  );
}
