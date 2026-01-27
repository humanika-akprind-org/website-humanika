"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Maximize2, Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/presentation/components/ui/dialog";
import { Button } from "@/src/presentation/components/ui/button";
import type { Gallery } from "@/src/domain/entities/gallery";
import type { ScheduleItem } from "@/src/domain/entities/event";
import { motion } from "framer-motion";

// Helper function to get preview URL
const getImageUrl = (imageId: string) =>
  `/api/drive-image?fileId=${imageId}&size=large`;

const getThumbnailUrl = (imageId: string) =>
  `/api/drive-image?fileId=${imageId}&size=medium`;

// Helper function to format date without weekday
const formatSimpleDate = (schedule: ScheduleItem) => {
  const date = new Date(schedule.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return date;
};

// Helper function to check if schedules exist
const hasSchedules = (schedules: ScheduleItem[] | undefined | null): boolean =>
  !!schedules && Array.isArray(schedules) && schedules.length > 0;

interface GalleryCardProps {
  gallery: Gallery;
  index?: number;
}

export default function GalleryCard({ gallery, index = 0 }: GalleryCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [relatedGalleries, setRelatedGalleries] = useState<Gallery[]>([]);
  const [currentGallery, setCurrentGallery] = useState<Gallery>(gallery);
  const [imageMetadata, setImageMetadata] = useState<{
    resolution: string | null;
    format: string | null;
    size: string | null;
  } | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Fetch image metadata when dialog opens or currentGallery changes
  useEffect(() => {
    if (isDialogOpen) {
      const fetchMetadata = async () => {
        try {
          const response = await fetch(
            `/api/drive-image/metadata?fileId=${currentGallery.image}`,
          );
          if (response.ok) {
            const data = await response.json();
            setImageMetadata(data);
          }
        } catch (error) {
          console.error("Failed to fetch image metadata:", error);
        }
      };
      fetchMetadata();
    } else {
      setImageMetadata(null);
    }
  }, [isDialogOpen, currentGallery]);

  // Fetch related galleries from the same event only when dialog opens
  useEffect(() => {
    if (isDialogOpen && currentGallery.eventId) {
      const fetchRelatedGalleries = async () => {
        try {
          const { getGalleries } =
            await import("@/src/presentation/use-cases/api/gallery");
          const data = await getGalleries({ eventId: currentGallery.eventId });
          setRelatedGalleries(data);
        } catch (error) {
          console.error("Failed to fetch related galleries:", error);
        }
      };
      fetchRelatedGalleries();
    }
  }, [isDialogOpen, currentGallery.eventId]);

  // Reset state when gallery prop changes
  useEffect(() => {
    setCurrentGallery(gallery);
    setImageError(false);
    setImageMetadata(null);
    setImageDimensions(null);
  }, [gallery]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = getImageUrl(currentGallery.image);
    link.download = `${currentGallery.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRelatedGalleryClick = (relatedGallery: Gallery) => {
    setCurrentGallery(relatedGallery);
    setImageError(false);
    setImageMetadata(null);
    setImageDimensions(null);
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

            {/* Preview Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl">
                <Maximize2 className="w-6 h-6 text-primary-600" />
              </div>
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-grey-100">
                <h3 className="font-semibold text-grey-900 text-base line-clamp-2 mb-3">
                  {gallery.title}
                </h3>

                {gallery.event?.name && (
                  <div className="flex items-center gap-2 text-sm text-grey-600 mb-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    {gallery.event.slug ? (
                      <Link
                        href={`/event/${gallery.event.slug}`}
                        className="font-medium hover:text-primary-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {gallery.event.name}
                      </Link>
                    ) : (
                      <span className="font-medium">{gallery.event.name}</span>
                    )}
                  </div>
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
              {currentGallery.title}
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
                  src={getImageUrl(currentGallery.image)}
                  alt={currentGallery.title}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    setImageDimensions({
                      width: naturalWidth,
                      height: naturalHeight,
                    });
                  }}
                />
              )}
            </div>

            {/* Image Details */}
            <div className="bg-grey-50 rounded-xl p-5">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Event Info & Schedules */}
                <div className="space-y-4">
                  {/* Event Info */}
                  {currentGallery.event?.name && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-grey-500 uppercase tracking-wider">
                          Event
                        </p>
                        {currentGallery.event.slug ? (
                          <Link
                            href={`/event/${currentGallery.event.slug}`}
                            className="font-semibold text-grey-900 hover:text-primary-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {currentGallery.event.name}
                          </Link>
                        ) : (
                          <p className="font-semibold text-grey-900">
                            {currentGallery.event.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Event Schedule Info */}
                  {hasSchedules(currentGallery.event?.schedules) && (
                    <div className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-grey-500" />
                        <span className="text-sm font-semibold text-grey-700 uppercase tracking-wider">
                          Jadwal Acara
                        </span>
                      </div>
                      <div className="space-y-2">
                        {/* Date Range */}
                        <div className="bg-white rounded-lg p-3 border border-grey-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                            <span className="font-medium text-grey-800 text-sm">
                              Jadwal
                            </span>
                          </div>
                          <span className="text-sm text-grey-600 ml-6">
                            {currentGallery.event!.schedules.length > 1
                              ? `${formatSimpleDate(currentGallery.event!.schedules[0])} - ${formatSimpleDate(currentGallery.event!.schedules[currentGallery.event!.schedules.length - 1])}`
                              : formatSimpleDate(
                                  currentGallery.event!.schedules[0],
                                )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-grey-200">
                    <h5 className="text-sm font-semibold text-grey-700 mb-2">
                      Informasi Gambar
                    </h5>
                    <div className="space-y-2 text-sm text-grey-600">
                      <div className="flex justify-between">
                        <span>Resolusi:</span>
                        <span className="font-medium">
                          {imageDimensions
                            ? `${imageDimensions.width} × ${imageDimensions.height}`
                            : imageMetadata?.resolution || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-medium">
                          {imageMetadata?.format || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ukuran:</span>
                        <span className="font-medium">
                          {imageMetadata?.size || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Images (if any) */}
            {relatedGalleries &&
              relatedGalleries.filter((g) => g.id !== currentGallery.id)
                .length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-grey-900 mb-4">
                    Foto Lainnya dari Event Ini
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-w-full">
                    {relatedGalleries
                      .filter((g) => g.id !== currentGallery.id)
                      .slice(0, 6)
                      .map((relatedGallery) => (
                        <div
                          key={relatedGallery.id}
                          className="relative aspect-square bg-grey-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() =>
                            handleRelatedGalleryClick(relatedGallery)
                          }
                        >
                          <Image
                            src={getThumbnailUrl(relatedGallery.image)}
                            alt={relatedGallery.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
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
