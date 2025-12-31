import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Download,
  Share2,
  ImageIcon,
  Calendar,
} from "lucide-react";
import { getPreviewUrl } from "@/lib/gallery-utils";
import type { Event } from "@/types/event";
import type { AlbumData } from "@/hooks/gallery/useGalleryDetail";

interface GalleryDetailHeroSectionProps {
  event: Event;
  album: AlbumData;
  formattedDate: string;
  onDownloadAll: () => void;
  onShare: () => void;
}

export default function GalleryDetailHeroSection({
  event,
  album,
  formattedDate,
  onDownloadAll,
  onShare,
}: GalleryDetailHeroSectionProps) {
  const router = useRouter();

  return (
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
              onClick={onDownloadAll}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Semua</span>
            </button>

            <button
              onClick={onShare}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Album</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
