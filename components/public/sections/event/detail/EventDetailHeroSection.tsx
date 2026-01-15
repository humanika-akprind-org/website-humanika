import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Tag,
  Share2,
  Bookmark,
  ArrowLeft,
  Trophy,
  Sparkles,
  Target,
  Clock,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Event, ScheduleItem } from "@/types/event";
import { getEventStatus } from "lib/eventDetailUtils";

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
  const [showAllSchedules, setShowAllSchedules] = useState(false);

  // Get dates from schedules
  const hasSchedules = event.schedules && event.schedules.length > 0;

  const { isPastEvent, isUpcomingEvent } = getEventStatus(
    event.schedules || []
  );

  // Maximum schedules to show before collapsing
  const MAX_VISIBLE_SCHEDULES = 3;

  /**
   * Formats a single schedule item for display with all details
   */
  const formatFullSchedule = (schedule: ScheduleItem) => {
    const date = new Date(schedule.date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const time = schedule.startTime
      ? `${schedule.startTime}${
          schedule.endTime ? ` - ${schedule.endTime}` : ""
        } WIB`
      : "";

    const location = schedule.location || "";

    const notes = schedule.notes || "";

    return { date, time, location, notes };
  };

  /**
   * Sort schedules by date
   */
  const sortedSchedules = hasSchedules
    ? [...event.schedules].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    : [];

  // Determine which schedules to display
  const displayedSchedules = showAllSchedules
    ? sortedSchedules
    : sortedSchedules.slice(0, MAX_VISIBLE_SCHEDULES);

  const hasMoreSchedules = sortedSchedules.length > MAX_VISIBLE_SCHEDULES;

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

          {/* Labels Container - Horizontal */}
          <div className="flex flex-row gap-6 mb-4">
            {/* Jadwal Acara Label */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-primary-200/80">Jadwal Acara</p>
                <p className="font-medium">
                  {hasSchedules
                    ? `${sortedSchedules.length} jadwal`
                    : "Belum ada jadwal"}
                </p>
              </div>
            </div>

            {/* Kategori Label */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
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

          {/* Meta Information */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Schedule Items - Horizontal Row */}
            <div className="md:col-span-2 lg:col-span-3">
              {/* All Schedules */}
              {hasSchedules ? (
                <div className="flex flex-row flex-nowrap gap-3 overflow-x-auto pb-2">
                  {displayedSchedules.map((schedule, index) => {
                    const { date, time, location, notes } =
                      formatFullSchedule(schedule);
                    return (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors min-w-[200px] max-w-[240px] flex-shrink-0"
                      >
                        {/* Date */}
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-4 h-4 text-primary-200/80 flex-shrink-0 mt-0.5" />
                          <span className="font-medium text-sm">{date}</span>
                        </div>

                        {/* Time */}
                        {time && (
                          <div className="flex items-center gap-3 mb-2 ml-7">
                            <Clock className="w-4 h-4 text-primary-200/80 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{time}</span>
                          </div>
                        )}

                        {/* Location */}
                        {location && (
                          <div className="flex items-center gap-3 mb-2 ml-7">
                            <MapPin className="w-4 h-4 text-primary-200/80 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{location}</span>
                          </div>
                        )}

                        {/* Notes */}
                        {notes && (
                          <div className="flex items-start gap-3 ml-7">
                            <FileText className="w-4 h-4 text-primary-200/80 flex-shrink-0 mt-0.5" />
                            <span className="text-primary-200/90 text-sm">
                              {notes}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Show More / Show Less Button */}
                  {hasMoreSchedules && (
                    <button
                      onClick={() => setShowAllSchedules(!showAllSchedules)}
                      className="flex items-center gap-2 text-sm text-primary-200/80 hover:text-white transition-colors self-center"
                    >
                      {showAllSchedules ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Tampilkan lebih sedikit</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>
                            Tampilkan{" "}
                            {sortedSchedules.length - MAX_VISIBLE_SCHEDULES}{" "}
                            jadwal lainnya
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-primary-200/80">
                  Jadwal akan segera ditambahkan
                </p>
              )}
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
