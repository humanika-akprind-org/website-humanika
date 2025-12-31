"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Image as ImageIcon,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface PastEventCardProps {
  id: string;
  title: string;
  date: Date | string;
  image?: string;
  participants?: number;
  achievements?: string[];
}

// Helper function to get preview URL
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
  }
  return image;
}

export default function PastEventCard({
  id,
  title,
  date,
  image,
  participants,
  achievements = [],
}: PastEventCardProps) {
  const previewUrl = getPreviewUrl(image);
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-grey-200"
    >
      {/* Event Image */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-grey-100 to-grey-200">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-grey-400">
            <ImageIcon className="w-12 h-12 mb-2" />
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Completed Badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
          Selesai
        </div>

        {/* Participants Count */}
        {participants !== undefined && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Users className="w-3 h-3" />
            {participants}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Event Content */}
      <div className="p-5">
        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-grey-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-grey-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
          {title}
        </h3>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-grey-700 mb-2">
              <Award className="w-4 h-4 text-yellow-500" />
              Pencapaian
            </div>
            <div className="flex flex-wrap gap-1.5">
              {achievements.slice(0, 2).map((achievement, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-200"
                >
                  {achievement}
                </span>
              ))}
              {achievements.length > 2 && (
                <span className="inline-block px-2 py-1 bg-grey-100 text-grey-600 text-xs rounded-full">
                  +{achievements.length - 2} lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Documentation Button */}
        <Link href={`/gallery/${id}`}>
          <button className="group/btn w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-grey-50 to-grey-100 text-grey-700 rounded-lg hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-300 font-medium border border-grey-200 hover:border-primary-200">
            <span>Lihat Dokumentasi</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
