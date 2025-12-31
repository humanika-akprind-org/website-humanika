import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ImageOff } from "lucide-react";
import type { Album } from "@/lib/gallery-utils";
import { ANIMATION_DELAYS } from "./constants";

interface TopEventsSectionProps {
  albums: Album[];
}

export default function TopEventsSection({ albums }: TopEventsSectionProps) {
  if (albums.length === 0) return null;

  const topAlbums = albums.sort((a, b) => b.count - a.count).slice(0, 4);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAYS.topEventsSection }}
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
          <div className="w-2 h-2 bg-primary-500 rounded-full" />
          EVENT POPULER
        </div>
        <h2 className="text-3xl font-bold text-grey-900 mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            Event dengan Foto Terbanyak
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topAlbums.map((album) => (
          <Link
            key={album.id}
            href={`/gallery/${album.id}`}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-grey-200"
          >
            <div className="relative h-48 bg-gradient-to-br from-primary-50 to-primary-100">
              {album.cover ? (
                <Image
                  src={album.cover}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-primary-200">
                  <ImageOff className="w-16 h-16" />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600 shadow-md">
                {album.count} foto
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white font-bold text-lg line-clamp-2">
                  {album.title}
                </h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-grey-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {album.year}
                </div>
                <span className="text-primary-600 font-medium group-hover:text-primary-700">
                  Lihat album →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
