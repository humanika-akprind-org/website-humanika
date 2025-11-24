"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/public/event/EventCard";
import PastEventCard from "@/components/public/event/PastEventCard";
import type { Event } from "@/types/event";

export default function EventPage() {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
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
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-red-700 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 right-20 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Event HUMANIKA</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Temukan berbagai kegiatan menarik yang kami selenggarakan untuk
              mengembangkan kompetensi di bidang teknologi informasi.
            </p>
          </div>
        </section>

        {/* Event List */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
              Upcoming Events
            </h2>
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
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-md">
              Load More Events
            </button>
          </div>
        </section>

        {/* Past Events */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-red-600 pb-2 inline-block">
            Past Events
          </h2>
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
        </section>
      </main>
    </div>
  );
}
