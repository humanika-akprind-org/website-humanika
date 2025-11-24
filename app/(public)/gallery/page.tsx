"use client";

import React, { useState, useEffect } from "react";
import { getEvents } from "@/use-cases/api/event";
import { getGalleries } from "@/use-cases/api/gallery";
import type { Event } from "@/types/event";
import type { Gallery } from "@/types/gallery";
import { Status } from "@/types/enums";
import AlbumGrid from "@/components/public/gallery/AlbumGrid";
import GalleryGrid from "@/components/public/gallery/GalleryGrid";

export default function GalleryPage() {
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

  const [events, setEvents] = useState<Event[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [eventsData, galleriesData] = await Promise.all([
          getEvents({ status: Status.PUBLISH }),
          getGalleries(),
        ]);
        setEvents(eventsData);
        setGalleries(galleriesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load gallery data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Loading galleries...</div>;
  if (error) return <div>Error loading galleries: {error}</div>;

  // Group galleries by eventId and count them
  const galleryCounts = galleries.reduce((acc, gallery) => {
    acc[gallery.eventId] = (acc[gallery.eventId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const albums = events.map((event) => ({
    id: event.id,
    title: event.name,
    count: galleryCounts[event.id] || 0,
    cover: getPreviewUrl(event.thumbnail),
    lastUpdated: event.updatedAt,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-red-700 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Galeri HUMANIKA</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Dokumentasi kegiatan dan momen berharga bersama Himpunan Mahasiswa
              Informatika.
            </p>
          </div>
        </section>

        {/* Gallery Content */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
              Album Foto
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
              Filter Tahun
            </button>
          </div>

          <AlbumGrid albums={albums} />
        </section>

        {/* Photo Highlights */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-red-600 pb-2 inline-block">
            Foto Terbaru
          </h2>
          <GalleryGrid />
        </section>
      </main>
    </div>
  );
}
