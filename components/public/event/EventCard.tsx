"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/types/event";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import { Calendar, Clock, MapPin, Users, ArrowRight, Tag } from "lucide-react";
import { motion } from "framer-motion";

// Helper function to get preview URL from image
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

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string }> = {
  workshop: { bg: "from-blue-500 to-blue-600", text: "text-blue-600" },
  seminar: { bg: "from-purple-500 to-purple-600", text: "text-purple-600" },
  competition: { bg: "from-red-500 to-red-600", text: "text-red-600" },
  webinar: { bg: "from-green-500 to-green-600", text: "text-green-600" },
  hackathon: { bg: "from-orange-500 to-orange-600", text: "text-orange-600" },
  networking: { bg: "from-cyan-500 to-cyan-600", text: "text-cyan-600" },
  default: { bg: "from-primary-500 to-primary-600", text: "text-primary-600" },
};

// Format date and time
const formatDate = (date: Date) =>
  date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

interface EventCardProps {
  event: Event;
  truncatedDescription: string;
  index?: number;
}

export default function EventCard({
  event,
  truncatedDescription,
  index = 0,
}: EventCardProps) {
  const previewUrl = useMemo(
    () => getPreviewUrl(event.thumbnail ?? null),
    [event.thumbnail]
  );

  const category = event.department?.toString().toLowerCase() || "default";
  const categoryColor = categoryColors[category] || categoryColors.default;

  // Date calculations
  const startDate = event.startDate ? new Date(event.startDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const month = startDate?.toLocaleString("id-ID", { month: "short" }) || "N/A";
  const day = startDate?.getDate() || null;
  const isMultiDay =
    startDate &&
    endDate &&
    endDate.getTime() - startDate.getTime() > 24 * 60 * 60 * 1000;

  const formattedDate = startDate ? formatDate(startDate) : "Loading...";
  const formattedTime = startDate ? formatTime(startDate) : "Loading...";

  // Status badge
  const now = new Date();
  const eventStatus = startDate && startDate > now ? "upcoming" : "ongoing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-grey-200"
    >
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div
          className={`
          inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm
          ${
            eventStatus === "upcoming"
              ? "bg-blue-500/20 text-blue-600 border border-blue-500/30"
              : "bg-green-500/20 text-green-600 border border-green-500/30"
          }
        `}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              eventStatus === "upcoming" ? "bg-blue-500" : "bg-green-500"
            } animate-pulse`}
          />
          {eventStatus === "upcoming" ? "Coming Soon" : "Sedang Berlangsung"}
        </div>
      </div>

      {/* Category Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryColor.bg} text-white shadow-md`}
        >
          <Tag className="w-3 h-3" />
          {event.department || "Event"}
        </div>
      </div>

      {/* Event Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500"
              priority={index < 3}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-primary-200">
              <svg
                className="w-20 h-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="p-3 text-center min-w-16">
            <div className="text-lg font-bold text-grey-900">{day || "-"}</div>
            <div className="text-xs font-semibold text-grey-600 uppercase tracking-wide">
              {month}
            </div>
            {isMultiDay && (
              <div className="text-[10px] text-grey-500 mt-1">Multi-day</div>
            )}
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-grey-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.name}
        </h3>

        {/* Description */}
        <div className="mb-6">
          <HtmlRenderer
            html={truncatedDescription}
            className="text-grey-700 line-clamp-3 leading-relaxed text-sm"
          />
        </div>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-grey-600">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-grey-600">
              <Clock className="w-4 h-4" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-grey-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {event.capacity && (
            <div className="flex items-center gap-2 text-sm text-grey-600">
              <Users className="w-4 h-4" />
              <span>{event.capacity} peserta</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-grey-100">
          <div className="text-sm">
            <span className={`font-semibold ${categoryColor.text}`}>
              {event.isFree ? "Gratis" : "Berbayar"}
            </span>
          </div>

          <Link
            href={`/event/${event.id}`}
            className="group/link inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            <span>Detail</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-200 rounded-2xl pointer-events-none transition-all duration-300" />
    </motion.div>
  );
}
