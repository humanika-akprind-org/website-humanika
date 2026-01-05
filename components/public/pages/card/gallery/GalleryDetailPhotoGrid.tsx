import React from "react";
import { motion } from "framer-motion";
import { Camera, ArrowLeft } from "lucide-react";
import GalleryGrid from "@/components/public/pages/card/gallery/GalleryGrid";
import type { Gallery } from "@/types/gallery";

interface GalleryDetailPhotoGridProps {
  galleries: Gallery[];
  router: { push: (path: string) => void };
}

export default function GalleryDetailPhotoGrid({
  galleries,
  router,
}: GalleryDetailPhotoGridProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-16"
    >
      {galleries.length > 0 ? (
        <GalleryGrid galleries={galleries} showFilters={false} />
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-grey-200">
          <div className="text-grey-400 mb-4">
            <Camera className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-grey-900 mb-2">
            Belum Ada Foto
          </h3>
          <p className="text-grey-600 mb-6">
            Foto untuk album ini akan segera diunggah.
          </p>
          <button
            onClick={() => router.push("/gallery")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Lihat Album Lain
          </button>
        </div>
      )}
    </motion.section>
  );
}
