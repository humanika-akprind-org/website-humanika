import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import AlbumGrid from "@/components/public/gallery/album/AlbumGrid";
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

      <AlbumGrid
        albums={relatedEvents.map((event) => ({
          id: event.id,
          title: event.name,
          count: galleryCounts[event.id] || 0,
          cover: getPreviewUrl(event.thumbnail),
          lastUpdated: event.startDate,
          eventName: event.name,
          category: event.category?.name,
        }))}
        title="Album Terkait"
        showFilters={false}
      />
    </motion.section>
  );
}
