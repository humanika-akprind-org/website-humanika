import React from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Tag,
  Share2,
  Bookmark,
  ArrowLeft,
  Trophy,
  Sparkles,
  Target,
} from "lucide-react";
import type { Event } from "@/types/event";
import {
  getEventStatus,
  formatDateRange,
  formatTime,
} from "lib/eventDetailUtils";

interface EventDetailHeroSectionProps {
  event: Event;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onShare: () => void;
}

export default function EventDetailHeroSection({
  event,
  isBookmarked,
  onBookmarkToggle,
  onShare,
}: EventDetailHeroSectionProps) {
  const router = useRouter();
  const eventDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const { isPastEvent, isUpcomingEvent } = getEventStatus(eventDate, endDate);

  return (
    <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 via-primary-800 text-white overflow-hidden">
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
              <span className="text-sm">Back to Events</span>
            </button>
          </div>

          {/* Event Status */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            {isPastEvent ? (
              <>
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">EVENT BERAKHIR</span>
              </>
            ) : isUpcomingEvent ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">EVENT MENDATANG</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">SEDANG BERLANGSUNG</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
              {event.name}
            </span>
          </h1>

          {/* Meta Information */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-primary-200/80">Tanggal</p>
                <p className="font-medium">
                  {formatDateRange(eventDate, endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-primary-200/80">Waktu</p>
                <p className="font-medium">
                  {formatTime(eventDate)} - {formatTime(endDate)} WIB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blend-sm rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-primary-200/80">Kategori</p>
                <p className="font-medium">
                  {event.category?.name || event.department || "HUMANIKA"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onBookmarkToggle}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                isBookmarked
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
              <span>{isBookmarked ? "Disimpan" : "Simpan"}</span>
            </button>

            <button
              onClick={onShare}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
