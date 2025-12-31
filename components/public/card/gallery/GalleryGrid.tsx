"use client";

import { useState } from "react";
import GalleryCard from "./GalleryCard";
import { useGalleries } from "@/hooks/gallery/useGalleries";
import type { Gallery } from "@/types/gallery";
import {
  Filter,
  Grid3x3,
  List,
  Loader2,
  AlertCircle,
  Calendar,
  SortAsc,
} from "lucide-react";
import { motion } from "framer-motion";

interface GalleryGridProps {
  galleries?: Gallery[];
  title?: string;
  showFilters?: boolean;
}

export default function GalleryGrid({
  galleries: propGalleries,
  title = "Gallery",
  showFilters = true,
}: GalleryGridProps) {
  const { galleries: hookGalleries, isLoading, error } = useGalleries();
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const galleries = propGalleries || hookGalleries;

  // Get unique events for filtering
  const events = [
    "all",
    ...Array.from(new Set(galleries.map((g) => g.event?.name || "Lainnya"))),
  ];

  // Sort galleries
  const sortedGalleries = [...galleries].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    } else {
      // For popularity, you might want to add a likes/views count
      return 0;
    }
  });

  // Filter by event
  const filteredGalleries =
    selectedEvent === "all"
      ? sortedGalleries
      : sortedGalleries.filter(
          (gallery) =>
            gallery.event?.name === selectedEvent ||
            (!gallery.event?.name && selectedEvent === "Lainnya")
        );

  if (isLoading && !propGalleries) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          <p className="text-grey-600 font-medium">Memuat galeri...</p>
        </div>
      </div>
    );
  }

  if (error && !propGalleries) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto bg-red-50 p-8 rounded-2xl border border-red-100">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <div>
            <h3 className="text-xl font-bold text-red-700 mb-2">
              Gagal Memuat Galeri
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-grey-900 mb-2">{title}</h2>
          <p className="text-grey-600">
            {filteredGalleries.length} foto • {events.length - 1} event
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-4">
            {/* Event Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-grey-600" />
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 bg-white border border-grey-200 rounded-lg text-sm text-grey-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                {events.map((event) => (
                  <option key={event} value={event}>
                    {event === "all" ? "Semua Event" : event}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-grey-600" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "popular")
                }
                className="px-3 py-2 bg-white border border-grey-200 rounded-lg text-sm text-grey-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Terpopuler</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-grey-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-50 text-primary-600"
                    : "text-grey-600 hover:text-primary-600"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "masonry"
                    ? "bg-primary-50 text-primary-600"
                    : "text-grey-600 hover:text-primary-600"
                }`}
                aria-label="Masonry view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {filteredGalleries.length > 0 ? (
        viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filteredGalleries.map((gallery, index) => (
              <GalleryCard key={gallery.id} gallery={gallery} index={index} />
            ))}
          </motion.div>
        ) : (
          // Masonry Layout
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {filteredGalleries.map((gallery, index) => (
              <div key={gallery.id} className="mb-4 break-inside-avoid">
                <GalleryCard gallery={gallery} index={index} />
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-grey-200">
          <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
            <Filter className="w-16 h-16 text-grey-400" />
            <div>
              <h3 className="text-xl font-bold text-grey-900 mb-2">
                Tidak Ada Foto Ditemukan
              </h3>
              <p className="text-grey-600">
                Tidak ada foto yang cocok dengan filter yang dipilih.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedEvent("all");
                setSortBy("newest");
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}

      {/* Grid Info */}
      {filteredGalleries.length > 0 && (
        <div className="flex items-center justify-between text-sm text-grey-600 pt-6 border-t border-grey-200">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />
            <span>Menampilkan {filteredGalleries.length} foto</span>
          </div>
          <span>Total {galleries.length} foto tersedia</span>
        </div>
      )}
    </div>
  );
}

// LatestGalleryGrid is just a wrapper with different default props
export function LatestGalleryGrid({
  galleries: propGalleries,
}: {
  galleries?: Gallery[];
}) {
  return (
    <GalleryGrid
      galleries={propGalleries}
      title="Foto Terbaru"
      showFilters={false}
    />
  );
}
