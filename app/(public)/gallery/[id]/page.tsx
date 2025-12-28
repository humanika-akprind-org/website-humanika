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
  Users,
  MapPin,
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [eventData, galleriesData, eventsData] = await Promise.all([
          getEvent(id),
          getGalleries({ eventId: id }),
          getEvents({ status: Status.PUBLISH }),
        ]);

        // Group galleries by eventId and count them
        const galleryCounts = galleriesData.reduce((acc, gallery) => {
          acc[gallery.eventId] = (acc[gallery.eventId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setEvent(eventData);
        setGalleries(galleriesData);
        setRelatedEvents(
          eventsData
            .filter((e) => e.id !== id && (galleryCounts[e.id] || 0) > 0)
            .slice(0, 4)
        );
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
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
    location: event.location,
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

  // Modal untuk tampilan gambar penuh
  const ImageModal = () => {
    if (!selectedImage) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={() => setSelectedImage(null)}
      >
        <div className="relative max-w-6xl max-h-[90vh] w-full h-full p-4">
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Fullscreen"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg"
            />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white overflow-hidden">
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

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-200/80">Lokasi</p>
                  <p className="font-medium">
                    {album.location || "Universitas AKPRIND"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-200/80">Penyelenggara</p>
                  <p className="font-medium">HUMANIKA</p>
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
          {album.thumbnail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src={getPreviewUrl(album.thumbnail)}
                  alt={album.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-5 h-5" />
                    <span className="text-sm font-medium">COVER ALBUM</span>
                  </div>
                  <h2 className="text-2xl font-bold">{album.title}</h2>
                </div>
              </div>
            </motion.div>
          )}

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

          {/* Gallery Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-grey-900 mb-2">
                  Semua Foto
                </h2>
                <p className="text-grey-600">
                  {album.photos.length} foto dalam album ini
                </p>
              </div>
            </div>
          </motion.div>

          {/* Photo Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            {galleries.length > 0 ? (
              <GalleryGrid galleries={galleries} />
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
          {relatedEvents.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-grey-900">
                    Album Lainnya
                  </h2>
                  <p className="text-grey-600">
                    Jelajahi album foto dari acara HUMANIKA lainnya
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
                  count: galleries.length, // Placeholder count
                  cover: getPreviewUrl(event.thumbnail),
                  lastUpdated: event.updatedAt,
                  date: event.startDate,
                  location: event.location,
                }))}
              />
            </motion.section>
          )}

          {/* Download CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-primary-900 to-primary-950 rounded-2xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700/10 rounded-full mix-blend-multiply filter blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">DOWNLOAD</span>
                </div>

                <h3 className="text-2xl font-bold mb-6">
                  Ingin Mendownload Semua Foto?
                </h3>

                <p className="text-xl text-primary-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Dapatkan semua foto dalam album ini dalam kualitas tinggi
                  untuk keperluan pribadi atau publikasi.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleDownloadAll}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Album Lengkap</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Bagikan ke Teman</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
