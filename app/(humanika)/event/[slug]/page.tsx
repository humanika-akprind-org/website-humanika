"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEventDetailPage } from "hooks/event/useEventDetailPage";
import EventDetailHeroSection from "@/components/public/sections/event/detail/EventDetailHeroSection";
import EventDetailContentSection from "@/components/public/sections/event/detail/EventDetailContentSection";
import EventSections from "@/components/public/sections/event/EventSections";
import EventDetailLoadingState from "@/components/public/pages/event/EventDetailLoadingState";
import EventErrorState from "@/components/public/pages/event/EventErrorState";
import EventNotFoundState from "@/components/public/pages/event/EventNotFoundState";
import { handleShare } from "lib/eventDetailUtils";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      <EventDetailHeroSection
        event={event}
        isBookmarked={isBookmarked}
        onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
        onShare={() =>
          handleShare(event.name, event.description, window.location.href)
        }
      />

      <EventDetailContentSection event={event} />

      <EventSections pastEvents={pastEvents} relatedEvents={relatedEvents} />
    </div>
  );
}
