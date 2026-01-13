import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Trophy, Sparkles, Target } from "lucide-react";
import type { Event, ScheduleItem } from "types/event";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import {
  getPreviewUrl,
  getEventStatus,
  getEarliestScheduleDate,
  getLatestScheduleDate,
} from "lib/eventDetailUtils";

interface EventDetailContentSectionProps {
  event: Event;
}

/**
 * Helper function to get dates from schedules
 */
const getDatesFromSchedules = (
  schedules: ScheduleItem[] | null | undefined
) => {
  if (!schedules || schedules.length === 0) {
    return { eventDate: new Date(), endDate: new Date() };
  }
  const eventDate = getEarliestScheduleDate(schedules);
  const endDate = getLatestScheduleDate(schedules);
  return { eventDate: eventDate || new Date(), endDate: endDate || new Date() };
};

/**
 * Main content section component for event detail page
 * Displays event description and thumbnail
 */
export default function EventDetailContentSection({
  event,
}: EventDetailContentSectionProps) {
  // Get dates from schedules for status calculation
  getDatesFromSchedules(event.schedules || []);
  const { isPastEvent, isUpcomingEvent } = getEventStatus(
    event.schedules || []
  );

  const getStatusIcon = () => {
    if (isPastEvent) return <Trophy className="w-6 h-6" />;
    if (isUpcomingEvent) return <Sparkles className="w-6 h-6" />;
    return <Target className="w-6 h-6" />;
  };

  const getStatusText = () => {
    if (isPastEvent) {
      return "Acara ini telah selesai";
    }
    if (isUpcomingEvent) {
      return "Acara akan datang";
    }
    return "Acara sedang berlangsung";
  };

  const getStatusBadgeColor = () => {
    if (isPastEvent) return "bg-gradient-to-br from-grey-700 to-grey-800";
    if (isUpcomingEvent) return "bg-gradient-to-br from-green-500 to-green-600";
    return "bg-gradient-to-br from-blue-500 to-blue-600";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Thumbnail Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative max-w-4xl mx-auto w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-50 to-primary-100">
            {getPreviewUrl(event.thumbnail) ? (
              <>
                <Image
                  src={getPreviewUrl(event.thumbnail)}
                  alt={event.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-200">
                <Calendar className="w-32 h-32 mb-4" />
              </div>
            )}

            {/* Event Status Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  isUpcomingEvent
                    ? "bg-blue-500/20 text-blue-600 border border-blue-500/30"
                    : isPastEvent
                    ? "bg-gray-500/20 text-gray-600 border border-gray-500/30"
                    : "bg-green-500/20 text-green-600 border border-green-500/30"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isUpcomingEvent
                      ? "bg-blue-500"
                      : isPastEvent
                      ? "bg-gray-500"
                      : "bg-green-500"
                  } animate-pulse`}
                />
                {isUpcomingEvent
                  ? "Coming Soon"
                  : isPastEvent
                  ? "Selesai"
                  : "Sedang Berlangsung"}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-grey-200"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  Detail Acara
                </h2>

                <HtmlRenderer
                  html={
                    event.description || "<p>Tidak ada deskripsi tersedia.</p>"
                  }
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Event Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl p-6 text-white shadow-lg ${getStatusBadgeColor()}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  {getStatusIcon()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">Status Acara</h3>
                  <p className="text-sm opacity-90">{getStatusText()}</p>
                </div>
              </div>
            </motion.div>

            {/* Organizer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-grey-200"
            >
              <h3 className="text-lg font-bold text-grey-900 mb-4">
                Penyelenggara
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-grey-900">HUMANIKA</p>
                  <p className="text-sm text-grey-600">
                    Himpunan Mahasiswa Informatika
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
