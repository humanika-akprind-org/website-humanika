"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getEvent, getEvents } from "use-cases/api/event";
import type { Event } from "types/event";
import { FiSend } from "react-icons/fi";
import PastEventCard from "@/components/public/event/PastEventCard";

interface EventDetailProps {
  params: { id: string };
}

export default function EventDetail({ params }: EventDetailProps) {
  const { id } = params;

  // Helper function to get preview URL from image (file ID or URL)
  function getPreviewUrl(image: string | null | undefined): string {
    if (!image) return "";

    if (image.includes("drive.google.com")) {
      // It's a full Google Drive URL, convert to direct image URL
      const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
      return image;
    } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
      // It's a Google Drive file ID, construct direct URL
      return `https://drive.google.com/uc?export=view&id=${image}`;
    } else {
      // It's a direct URL or other format
      return image;
    }
  }

  // Defensive fallback for optional fields in fetched event data
  function getSafeEvent(event: Event) {
    return {
      ...event,
      category: event.department || undefined, // since category not present in Event type, fallback to goal
      type: undefined, // no type in Event type
      title: event.name || undefined,
      registrationLink: "#", // no registrationLink in Event type, default fallback
      location: "", // no location, fallback empty
      thumbnail: event.thumbnail || "",
      description: event.description || "",
      startDate: event.startDate || new Date(),
    };
  }

  const [event, setEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const eventData = await getEvent(id);
        setEvent(eventData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load event data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  useEffect(() => {
    async function loadAllEvents() {
      try {
        const events = await getEvents();
        setAllEvents(events);
      } catch (err) {
        console.error("Failed to load all events:", err);
      }
    }
    loadAllEvents();
  }, []);

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>Error loading event: {error}</div>;
  if (!event) return <div>No event found.</div>;

  const safeEvent = event ? getSafeEvent(event) : null;

  const eventDate = new Date(safeEvent?.startDate ?? "");

  const now = new Date();
  const pastEvents = allEvents
    .filter((e) => new Date(e.endDate) < now && e.id !== id)
    .slice(0, 4); // Limit to 4 past events, exclude current event

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mr-3">
              {safeEvent?.category ?? safeEvent?.type ?? "Acara"}
            </span>
            <span>
              {eventDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" • "}
              {eventDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            {safeEvent?.title ?? safeEvent?.name ?? "Judul Acara"}
          </h1>

          {safeEvent?.thumbnail ? (
            <div className="bg-white-0 rounded-xl mb-8 flex items-center justify-center w-full h-96 overflow-hidden relative">
              <Image
                src={getPreviewUrl(safeEvent.thumbnail)}
                alt={safeEvent.title ?? "Event thumbnail"}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-xl"
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl mb-8 flex flex-col items-center justify-center w-full h-96 text-grey-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">No image available</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-md flex items-center justify-center gap-2">
              <FiSend className="h-5 w-5" />
              Bagikan
            </button>
          </div>
        </section>

        <section className="max-w-2xl mx-auto prose prose-blue prose-lg mb-16">
          <div
            dangerouslySetInnerHTML={{ __html: safeEvent?.description ?? "" }}
          />
        </section>

        {/* Past Events */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-2">
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
