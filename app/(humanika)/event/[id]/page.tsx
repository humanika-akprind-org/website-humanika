"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { useEventDetailPage } from "hooks/event/useEventDetailPage";
import EventDetailHeroSection from "@/components/public/sections/event/detail/EventDetailHeroSection";
import EventDetailContentSection from "@/components/public/sections/event/detail/EventDetailContentSection";
import EventSections from "@/components/public/sections/event/EventSections";
import EventDetailLoadingState from "@/components/public/pages/event/EventDetailLoadingState";
import { handleShare } from "lib/eventDetailUtils";

/**
 * Event detail page component
 * Displays comprehensive information about a specific event
 */
export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    event,
    loading,
    error,
    isBookmarked,
    setIsBookmarked,
    pastEvents,
    relatedEvents,
  } = useEventDetailPage(id);

  // Loading state
  if (loading) {
    return <EventDetailLoadingState />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-grey-900 mb-2">
            Error loading event
          </h1>
          <p className="text-grey-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="text-grey-400 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-grey-900 mb-2">
            Event Not Found
          </h1>
          <p className="text-grey-600 mb-6">
            The requested event could not be found.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Events
          </button>
        </div>
      </div>
    );
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
