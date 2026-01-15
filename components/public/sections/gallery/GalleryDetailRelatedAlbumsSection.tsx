import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, FolderOpen } from "lucide-react";
import AlbumGrid from "@/components/public/pages/card/album/AlbumGrid";
import { getPreviewUrl } from "@/lib/gallery-utils";
import type { Event } from "@/types/event";

interface GalleryDetailRelatedAlbumsSectionProps {
  relatedEvents: Event[];
  galleryCounts: Record<string, number>;
}

export default function GalleryDetailRelatedAlbumsSection({
  relatedEvents,
  galleryCounts,
}: GalleryDetailRelatedAlbumsSectionProps) {
  const router = useRouter();

  const albums = relatedEvents.map((event) => ({
    id: event.id,
    title: event.name,
    count: galleryCounts[event.id] || 0,
    cover: getPreviewUrl(event.thumbnail),
    lastUpdated:
      event.schedules && event.schedules.length > 0
        ? new Date(
            Math.min(...event.schedules.map((s) => new Date(s.date).getTime()))
          )
        : new Date(event.createdAt),
    eventName: event.name,
    category: event.category?.name,
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-16"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-grey-900">Album Terkait</h2>
          <p className="text-grey-600">
            Jelajahi album dari acara HUMANIKA lainnya
          </p>
        </div>
        <button
          onClick={() => router.push("/gallery")}
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {albums.length > 0 ? (
        <AlbumGrid albums={albums} title="Album Terkait" showFilters={false} />
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-grey-200">
          <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-grey-900 mb-2">
                Tidak Ada Album Terkait
              </h3>
              <p className="text-grey-600">
                belum ada album lain dalam kategori yang sama. Jelajahi album
                lainnya dari HUMANIKA!
              </p>
            </div>
            <button
              onClick={() => router.push("/gallery")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              <ChevronRight className="w-4 h-4" />
              Jelajahi Semua Album
            </button>
          </div>
        </div>
      )}
    </motion.section>
  );
}
