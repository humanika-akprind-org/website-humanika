"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EventCard from "@/components/public/event/EventCard";
import type { Event } from "@/types/event";

interface UpcomingEventsSectionProps {
  eventsData: Event[];
}

export default function UpcomingEventsSection({
  eventsData,
}: UpcomingEventsSectionProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const now = new Date();
    const filtered = eventsData
      .filter((event: Event) => new Date(event.startDate) > now)
      .slice(0, 3);
    setUpcomingEvents(filtered);
  }, [eventsData]);

  return (
    <section className="py-16 bg-grey-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 text-grey-900 mb-4">Event Terdekat</h2>
          <p className="text-body-1 text-grey-600 max-w-2xl mx-auto">
            Ikuti kegiatan dan acara terbaru kami untuk mengembangkan skill dan
            jaringan profesional Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {upcomingEvents.map((event: Event) => {
            const truncatedDescription =
              event.description && event.description.length > 150
                ? `${event.description.substring(0, 150)}...`
                : event.description || "";
            return (
              <EventCard
                key={event.id}
                event={event}
                truncatedDescription={truncatedDescription}
              />
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/event"
            className="inline-flex items-center px-6 py-3 bg-white border border-grey-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            Lihat Semua Event
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
