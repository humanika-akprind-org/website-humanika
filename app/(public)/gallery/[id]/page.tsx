"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getEvent, getEvents } from "@/use-cases/api/event";
import { getGalleries } from "@/use-cases/api/gallery";
import type { Event } from "@/types/event";
import type { Gallery } from "@/types/gallery";
import { Status } from "@/types/enums";
import AlbumGrid from "@/components/public/gallery/AlbumGrid";
import GalleryGrid from "@/components/public/gallery/GalleryGrid";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import {
  Calendar,
  Camera,
  ChevronRight,
  ArrowLeft,
  Share2,
  Download,
  Image as ImageIcon,
  Film,
  FolderOpen,
} from "lucide-react";
import { motion } from "framer-motion";

export default function GalleryDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Helper function to get preview URL from image (file ID or URL)
  function getPreviewUrl(image: string | null | undefined): string {
    if (!image) return "";

    if (image.includes("drive.google.com")) {
      const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `/api/drive-image?fileId=${fileIdMatch[1]}`;
      }
      return image;
    } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
      return `/api/drive-image?fileId=${image}`;
    } else {
      return image;
    }
  }

  const [event, setEvent] = useState<Event | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [galleryCounts, setGalleryCounts] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [eventData, allGalleriesData, eventsData] = await Promise.all([
          getEvent(id),
          getGalleries(),
          getEvents({ status: Status.PUBLISH }),
        ]);

        // Group all galleries by eventId and count them
        const galleryCounts = allGalleriesData.reduce((acc, gallery) => {
          acc[gallery.eventId] = (acc[gallery.eventId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const relatedEventsData = eventsData
          .filter(
            (e) =>
              e.id !== id &&
              (galleryCounts[e.id] || 0) > 0 &&
              e.category?.id === eventData.category?.id
          )
          .slice(0, 4);

        // Filter galleries for current event only
        const currentEventGalleries = allGalleriesData.filter(
          (gallery) => gallery.eventId === id
        );

        setEvent(eventData);
        setGalleries(currentEventGalleries);
        setGalleryCounts(galleryCounts);
        setRelatedEvents(relatedEventsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load gallery data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-grey-600">Memuat album galeri...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-grey-900 mb-2">
            Error memuat galeri
          </h1>
          <p className="text-grey-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-grey-400 text-6xl mb-4">📷</div>
          <h1 className="text-2xl font-bold text-grey-900 mb-2">
            Album Tidak Ditemukan
          </h1>
          <p className="text-grey-600 mb-6">
            Album yang diminta tidak dapat ditemukan.
          </p>
          <button
            onClick={() => router.push("/gallery")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Lihat Semua Album
          </button>
        </div>
      </div>
    );
  }

  const album = {
    id: event.id,
    title: event.name,
    date: event.startDate,
    description: event.description,
    photos: galleries.map((gallery) => ({
      id: gallery.id,
      title: gallery.title,
      url: getPreviewUrl(gallery.image),
      createdAt: gallery.createdAt,
    })),
    thumbnail: event.thumbnail,
  };

  const formattedDate = new Date(album.date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownloadAll = async () => {
    alert("Fitur download semua foto akan segera tersedia!");
  };

  const handleShare = () => {
    navigator
      .share?.({
        title: album.title,
        text: `Lihat album foto ${album.title} dari HUMANIKA`,
        url: window.location.href,
      })
      .catch(() => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link berhasil disalin!");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 via-primary-800 text-white overflow-hidden">
        {/* Background Image */}
        {event?.thumbnail && (
          <div className="absolute inset-0">
            <Image
              src={getPreviewUrl(event.thumbnail)}
              alt={event.name}
              fill
              style={{ objectFit: "cover" }}
              className="opacity-20"
              priority
            />
          </div>
        )}
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-primary-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Kembali ke Galeri</span>
              </button>
            </div>

            {/* Album Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">ALBUM FOTO</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                {album.title}
              </span>
            </h1>

            {/* Album Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-200/80">Total Foto</p>
                  <p className="text-2xl font-bold">{album.photos.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-200/80">Tanggal</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Semua</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan Album</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Album Thumbnail */}
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

          {/* Album Description */}
          {album.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-grey-200">
                <h3 className="text-xl font-bold text-grey-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Film className="w-6 h-6 text-primary-600" />
                  </div>
                  Deskripsi Album
                </h3>
                <div className="prose prose-lg max-w-none">
                  <HtmlRenderer html={album.description} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Photo Grid */}
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

          {/* Related Albums */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-grey-900">
                  Album Terkait
                </h2>
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
        </div>
      </div>
    </div>
  );
}
