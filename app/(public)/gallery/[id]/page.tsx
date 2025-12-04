"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getEvent, getEvents } from "@/use-cases/api/event";
import { getGalleries } from "@/use-cases/api/gallery";
import type { Event } from "@/types/event";
import type { Gallery } from "@/types/gallery";
import { Status } from "@/types/enums";
import AlbumGrid from "@/components/public/gallery/AlbumGrid";
import GalleryGrid from "@/components/public/gallery/GalleryGrid";

interface GalleryDetailProps {
  params: { id: string };
}

export default function GalleryDetail({ params }: GalleryDetailProps) {
  const { id } = params;

  // Helper function to get preview URL from image (file ID or URL)
  function getPreviewUrl(image: string | null | undefined): string {
    if (!image) return "";

    if (image.includes("drive.google.com")) {
      // It's a full Google Drive URL, convert to direct image URL
      const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `/api/drive-image?fileId=${fileIdMatch[1]}`;
      }
      return image;
    } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
      // It's a Google Drive file ID, construct direct URL
      return `/api/drive-image?fileId=${image}`;
    } else {
      // It's a direct URL or other format
      return image;
    }
  }

  const [event, setEvent] = useState<Event | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [eventData, galleriesData, eventsData] = await Promise.all([
          getEvent(id),
          getGalleries({ eventId: id }),
          getEvents({ status: Status.PUBLISH }), // Fetch published events for related albums
        ]);
        setEvent(eventData);
        setGalleries(galleriesData);
        setRelatedEvents(eventsData.filter((e) => e.id !== id).slice(0, 3)); // Exclude current event, take first 3
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load gallery data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div>Loading gallery details...</div>;
  if (error) return <div>Error loading gallery: {error}</div>;
  if (!event) return <div>No event found.</div>;

  const album = {
    id: event.id,
    title: event.name,
    date: event.startDate,
    description: event.description,
    photos: galleries.map((gallery) => ({
      id: gallery.id,
      title: gallery.title,
      url: getPreviewUrl(gallery.image),
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Album Header */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>
              {new Date(album.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="mx-2">•</span>
            <span>{album.photos.length} foto</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {album.title}
          </h1>
          <div
            className="text-lg text-gray-700 mb-8"
            dangerouslySetInnerHTML={{ __html: album.description }}
          />

          {event.thumbnail ? (
            <div className="bg-white-0 rounded-xl mb-8 flex items-center justify-center w-full h-96 overflow-hidden relative">
              <Image
                src={getPreviewUrl(event.thumbnail)}
                alt={album.title}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-xl"
              />
            </div>
          ) : (
            <div className="bg-gray-200 h-96 rounded-xl mb-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </section>

        {/* Photo Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-2">
            Semua Foto
          </h2>
          <GalleryGrid galleries={galleries} />
        </section>

        {/* Related Albums */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-2">
            Album Lainnya
          </h2>
          <AlbumGrid
            albums={relatedEvents.map((event) => ({
              id: event.id,
              title: event.name,
              count: 0, // Placeholder, could fetch actual count if needed
              cover: getPreviewUrl(event.thumbnail),
              lastUpdated: event.updatedAt,
            }))}
          />
        </section>
      </main>
    </div>
  );
}
