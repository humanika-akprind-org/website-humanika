"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Maximize2, Share2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Gallery } from "@/types/gallery";
import { motion } from "framer-motion";

// Helper function to get preview URL
const getImageUrl = (imageId: string) =>
  `/api/drive-image?fileId=${imageId}&size=large`;

const getThumbnailUrl = (imageId: string) =>
  `/api/drive-image?fileId=${imageId}&size=medium`;

interface GalleryCardProps {
  gallery: Gallery;
  index?: number;
}

export default function GalleryCard({ gallery, index = 0 }: GalleryCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [relatedGalleries, setRelatedGalleries] = useState<Gallery[]>([]);

  // Fetch related galleries from the same event only when dialog opens
  useEffect(() => {
    if (isDialogOpen && gallery.eventId) {
      const fetchRelatedGalleries = async () => {
        try {
          const { getGalleries } = await import("@/use-cases/api/gallery");
          const data = await getGalleries({ eventId: gallery.eventId });
          setRelatedGalleries(data);
        } catch (error) {
          console.error("Failed to fetch related galleries:", error);
        }
      };
      fetchRelatedGalleries();
    }
  }, [isDialogOpen, gallery.eventId]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = getImageUrl(gallery.image);
    link.download = `${gallery.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: gallery.title,
          text: `Lihat foto "${gallery.title}" dari HUMANIKA Gallery`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard!");
    }
  };

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="group relative"
      >
        <div
          className="aspect-square bg-gradient-to-br from-grey-100 to-grey-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-grey-200"
          onClick={() => setIsDialogOpen(true)}
        >
          {/* Image */}
          <div className="relative w-full h-full">
            <Image
              src={getThumbnailUrl(gallery.image)}
              alt={gallery.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick Actions Overlay */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <Share2 className="w-4 h-4 text-grey-700" />
              </button>
            </div>

            {/* Preview Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl">
                <Maximize2 className="w-6 h-6 text-primary-600" />
              </div>
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <h3 className="font-semibold text-grey-900 text-sm line-clamp-2">
                  {gallery.title}
                </h3>
                {gallery.event?.name && (
                  <p className="text-xs text-grey-600 mt-1 line-clamp-1">
                    <Calendar className="w-4 h-4 inline mr-1" />{" "}
                    {gallery.event.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-grey-900">
              {gallery.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-grey-100 to-grey-200 rounded-xl overflow-hidden">
              {imageError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-grey-400">
                  <div className="w-16 h-16 bg-grey-200 rounded-full flex items-center justify-center mb-4">
                    <Image
                      src="/api/drive-image?fileId=dummy"
                      alt="Error"
                      width={24}
                      height={24}
                      className="opacity-50"
                    />
                  </div>
                  <p className="text-grey-600">Gagal memuat gambar</p>
                </div>
              ) : (
                <Image
                  src={getImageUrl(gallery.image)}
                  alt={gallery.title}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              )}
            </div>

            {/* Image Details */}
            <div className="bg-grey-50 rounded-xl p-5">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {gallery.event?.name && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-grey-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Event</span>
                        </div>
                        <p className="text-grey-900 font-medium">
                          {gallery.event.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-grey-700 mb-3">
                      Aksi
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleDownload}
                        className="flex-1 min-w-[120px]"
                        variant="default"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={handleShare}
                        className="flex-1 min-w-[120px]"
                        variant="outline"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Bagikan
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-grey-200">
                    <h5 className="text-sm font-semibold text-grey-700 mb-2">
                      Informasi Gambar
                    </h5>
                    <div className="space-y-2 text-sm text-grey-600">
                      <div className="flex justify-between">
                        <span>Resolusi:</span>
                        <span className="font-medium">1920 × 1080</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-medium">JPEG</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ukuran:</span>
                        <span className="font-medium">2.4 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Images (if any) */}
            {relatedGalleries &&
              relatedGalleries.filter((g) => g.id !== gallery.id).length >
                0 && (
                <div>
                  <h4 className="text-lg font-semibold text-grey-900 mb-4">
                    Foto Lainnya dari Event Ini
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {relatedGalleries
                      .filter((g) => g.id !== gallery.id)
                      .slice(0, 6)
                      .map((relatedGallery) => (
                        <div
                          key={relatedGallery.id}
                          className="aspect-square bg-grey-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setIsDialogOpen(false);
                            // Navigate to the related gallery (you might need to implement this)
                            window.location.href = `/gallery/${relatedGallery.id}`;
                          }}
                        >
                          <Image
                            src={getThumbnailUrl(relatedGallery.image)}
                            alt={relatedGallery.title}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            style={{ objectFit: "cover" }}
                            className="hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
