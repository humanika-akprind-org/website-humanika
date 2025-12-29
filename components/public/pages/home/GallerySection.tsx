"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LatestGalleryGrid } from "../../gallery/LatestGalleryGrid";
import AlbumGrid from "../../gallery/album/AlbumGrid";
import { getGalleries } from "@/use-cases/api/gallery";
import { getEvents } from "@/use-cases/api/event";
import type { Gallery } from "@/types/gallery";
import type { Event } from "@/types/event";
import { Status } from "@/types/enums";
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
  Loader2,
  Album,
} from "lucide-react";
import { motion } from "framer-motion";

export default function GallerySection() {
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

  const [events, setEvents] = useState<Event[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "albums">("photos");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [eventsData, galleriesData] = await Promise.all([
          getEvents({ status: Status.PUBLISH }),
          getGalleries(),
        ]);
        setEvents(eventsData);
        setGalleries(galleriesData.slice(0, 12)); // Limit to 12 for preview
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

  // Group galleries by eventId and count them
  const galleryCounts = galleries.reduce((acc, gallery) => {
    acc[gallery.eventId] = (acc[gallery.eventId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare albums data with additional info
  const albums = events
    .map((event) => {
      const eventDate = new Date(event.startDate);
      return {
        id: event.id,
        title: event.name,
        count: galleryCounts[event.id] || 0,
        cover: getPreviewUrl(event.thumbnail),
        lastUpdated: event.updatedAt,
        eventName: event.name,
        category: event.department?.toString() || "General",
        date: eventDate,
        year: eventDate.getFullYear().toString(),
      };
    })
    .filter((album) => album.count > 0); // Only show albums with photos

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              GALERI KEGIATAN
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-grey-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                Dokumentasi Visual
              </span>
              <br />
              Momen Berharga
            </h2>

            <p className="text-lg text-grey-600 max-w-2xl mx-auto leading-relaxed">
              Menyimpan kenangan dari berbagai kegiatan dan acara HUMANIKA dalam
              bentuk visual
            </p>
          </div>

          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              <p className="text-grey-600 font-medium">Memuat galeri...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto bg-red-50 p-8 rounded-2xl border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700 mb-2">
                  Gagal Memuat Galeri
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-grey-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
            GALERI KEGIATAN
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-grey-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Dokumentasi Visual
            </span>
            <br />
            Momen Berharga
          </h2>

          <p className="text-lg text-grey-600 max-w-2xl mx-auto leading-relaxed">
            Menyimpan kenangan dari berbagai kegiatan dan acara HUMANIKA dalam
            bentuk visual yang menarik
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex space-x-1 bg-white border border-grey-200 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("photos")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "photos"
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                    : "text-grey-700 hover:text-primary-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>Foto</span>
                  <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    {galleries.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("albums")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "albums"
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                    : "text-grey-700 hover:text-primary-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Album className="w-4 h-4" />
                  <span>Album</span>
                  <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    {albums.length}
                  </span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-grey-600">
                Total{" "}
                <span className="font-semibold text-primary-700">
                  {galleries.length +
                    albums.reduce((sum, album) => sum + album.count, 0)}
                </span>{" "}
                konten visual
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          {activeTab === "photos" ? (
            <div className="space-y-8">
              <LatestGalleryGrid galleries={galleries} />
            </div>
          ) : (
            <AlbumGrid albums={albums} title="Album Galeri" />
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Koleksi Lengkap</span>
            </div>

            <h3 className="text-2xl font-bold text-grey-900 mb-6">
              Jelajahi Seluruh Koleksi Galeri Kami
            </h3>

            <p className="text-grey-600 max-w-2xl mx-auto mb-8">
              Temukan lebih banyak foto, album, dan dokumentasi dari berbagai
              kegiatan HUMANIKA yang telah kami selenggarakan.
            </p>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            <Camera className="w-5 h-5" />
            <span>Jelajahi Galeri Lengkap</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-grey-600 text-sm mt-4">
            {galleries.length}+ foto dan {albums.length}+ album tersedia
          </p>
        </motion.div>
      </div>
    </section>
  );
}
