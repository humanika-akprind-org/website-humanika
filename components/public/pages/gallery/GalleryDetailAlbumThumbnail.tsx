import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, FolderOpen } from "lucide-react";
import { getPreviewUrl } from "@/lib/gallery-utils";
import type { AlbumData } from "@/hooks/gallery/useGalleryDetail";

interface GalleryDetailAlbumThumbnailProps {
  album: AlbumData;
}

export default function GalleryDetailAlbumThumbnail({
  album,
}: GalleryDetailAlbumThumbnailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="relative max-w-4xl mx-auto w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-50 to-primary-100 group">
        {getPreviewUrl(album.thumbnail) ? (
          <>
            <Image
              src={getPreviewUrl(album.thumbnail)}
              alt={album.title}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Album Badge */}
            <div className="absolute top-6 right-6">
              <div className="px-4 py-2 bg-primary-600 text-white rounded-full font-medium shadow-lg">
                ALBUM FOTO
              </div>
            </div>

            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5" />
                <span className="text-sm font-medium">COVER ALBUM</span>
              </div>
              <h2 className="text-2xl font-bold">{album.title}</h2>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-200">
            <FolderOpen className="w-32 h-32 mb-4" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
