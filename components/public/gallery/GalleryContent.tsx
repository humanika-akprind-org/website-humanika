import React from "react";
import { motion } from "framer-motion";
import { Camera, Grid3x3 } from "lucide-react";
import AlbumGrid from "../card/gallery/album/AlbumGrid";
import GalleryGrid from "../card/gallery/GalleryGrid";
import type { Album } from "@/lib/gallery-utils";
import type { Gallery } from "@/types/gallery";
import { ANIMATION_DELAYS } from "./constants";

interface GalleryContentProps {
  viewMode: "albums" | "photos" | "both";
  activeTab: "albums" | "highlights" | "trending";
  filteredAlbums: Album[];
  galleries: Gallery[];
}

export default function GalleryContent({
  viewMode,
  activeTab,
  filteredAlbums,
  galleries,
}: GalleryContentProps) {
  const getPhotosSectionTitle = () => {
    switch (activeTab) {
      case "highlights":
        return "Foto Highlight";
      case "trending":
        return "Foto Trending";
      default:
        return "Foto Terbaru";
    }
  };

  const getPhotosSectionDescription = () => {
    switch (activeTab) {
      case "highlights":
        return "Kumpulan foto terbaik dari berbagai event";
      case "trending":
        return "Foto yang paling banyak disukai";
      default:
        return "Foto-foto terbaru dari galeri";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: ANIMATION_DELAYS.content }}
      className="space-y-16"
    >
      {/* Albums Section */}
      {(viewMode === "both" || viewMode === "albums") && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ANIMATION_DELAYS.albumsSection }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Grid3x3 className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-grey-900">Album Foto</h2>
              </div>
              <p className="text-grey-600">
                Kelompokkan foto berdasarkan event dan kegiatan
              </p>
            </div>
            <div className="text-sm text-grey-600">
              {filteredAlbums.length} album •{" "}
              {filteredAlbums.reduce((sum, album) => sum + album.count, 0)} foto
            </div>
          </div>

          {filteredAlbums.length > 0 ? (
            <AlbumGrid albums={filteredAlbums} showFilters={false} />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-grey-200">
              <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <Grid3x3 className="w-12 h-12 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-grey-900 mb-2">
                    Tidak Ada Album Ditemukan
                  </h3>
                  <p className="text-grey-600">
                    Tidak ada album yang cocok dengan filter yang dipilih.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.section>
      )}

      {/* Photos Section */}
      {(viewMode === "both" || viewMode === "photos") && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ANIMATION_DELAYS.photosSection }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Camera className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-grey-900">
                  {getPhotosSectionTitle()}
                </h2>
              </div>
              <p className="text-grey-600">{getPhotosSectionDescription()}</p>
            </div>
            <div className="text-sm text-grey-600">
              {galleries.length} foto •{" "}
              {new Set(galleries.map((g) => g.eventId)).size} event
            </div>
          </div>

          {galleries.length > 0 ? (
            <GalleryGrid galleries={galleries} title="" showFilters={false} />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-grey-200">
              <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-grey-900 mb-2">
                    Belum Ada Foto
                  </h3>
                  <p className="text-grey-600">
                    Belum ada foto yang tersedia di galeri.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.section>
      )}
    </motion.div>
  );
}
