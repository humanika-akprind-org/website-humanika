"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  ChevronRight,
  FolderOpen,
  Clock,
  Calendar,
} from "lucide-react";

interface AlbumCardProps {
  album: {
    id: string;
    title: string;
    count: number;
    cover?: string;
    lastUpdated?: Date;
    eventName?: string;
    eventSlug?: string;
    category?: string;
  };
  index?: number;
}

export default function AlbumCard({ album, index = 0 }: AlbumCardProps) {
  const lastUpdatedText = album.lastUpdated
    ? new Date(album.lastUpdated).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Baru-baru ini";

  // Format count text
  const countText = `${album.count} ${album.count === 1 ? "foto" : "foto"}`;

  // Build href using eventSlug if available, otherwise use id
  const href = album.eventSlug
    ? `/gallery/${album.eventSlug}`
    : `/gallery/${album.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link href={href}>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-grey-200">
          {/* Album Cover */}
          <div className="relative aspect-video bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
            {album.cover ? (
              <>
                <Image
                  src={album.cover}
                  alt={album.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-200">
                <FolderOpen className="w-16 h-16 mb-2" />
                <span className="text-sm text-primary-600 font-medium">
                  Album
                </span>
              </div>
            )}

            {/* Photo Count Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-grey-900">
                <ImageIcon className="w-4 h-4 text-primary-600" />
                {countText}
              </div>
            </div>

            {/* Category Badge */}
            {album.category && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                {album.category}
              </div>
            )}

            {/* View Album Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                <ChevronRight className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Album Info */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-grey-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
              {album.title}
            </h3>

            {/* Event Info */}
            {album.eventName && (
              <p className="text-sm text-grey-600 mb-3 line-clamp-1">
                <Calendar className="w-4 h-4 inline mr-1" /> {album.eventName}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-grey-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{lastUpdatedText}</span>
              </div>

              <div className="flex items-center gap-1 text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                <span>Buka</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
