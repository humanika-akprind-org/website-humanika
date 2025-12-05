"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/public/event/EventCard";
import PastEventCard from "@/components/public/event/PastEventCard";
import type { Event } from "@/types/event";

export default function EventSection() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-grey-900 mb-4">
              Event Terdekat
            </h2>
            <p className="text-body-1 text-grey-600 max-w-2xl mx-auto">
              Ikuti kegiatan dan acara terbaru kami untuk mengembangkan skill
              dan jaringan profesional Anda
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat event...</p>
          </div>
        </div>
      </section>
    );
  }

  const now = new Date();

  // Pass full event objects without mapping to EventCard for correct props
  const upcomingEvents = allEvents.filter(
    (event) => new Date(event.startDate) > now
  );

  const pastEvents = allEvents
    .filter((event) => new Date(event.endDate) < now)
    .slice(0, 4); // Limit to 4 past events

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

        {/* Upcoming Events */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
              Upcoming Events
            </h3>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                Filter
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
                Calendar View
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => {
              // Truncate description for EventCard
              const truncatedDescription = event.description
                ? event.description.length > 150
                  ? event.description.substring(0, 150) + "..."
                  : event.description
                : "";

              return (
                <EventCard
                  key={event.id}
                  event={event}
                  truncatedDescription={truncatedDescription}
                />
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-md">
              Load More Events
            </button>
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-gray-800 border-b-4 border-red-600 pb-2 inline-block">
            Past Events
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastEvents.map((event) => (
              <PastEventCard
                key={event.id}
                id={event.id}
                title={event.name}
                date={event.endDate}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
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
