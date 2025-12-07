"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/types/event";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";

// Helper function to get preview URL from image (file ID or URL)
function getPreviewUrl(image: string | null | undefined): string {
  if (!image) return "";

  if (image.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return image;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `/api/drive-image?fileId=${image}`;
  } else {
    // It's a direct URL or other format
    return image;
  }
}

interface EventCardProps {
  event: Event;
  truncatedDescription: string;
}

export default function EventCard({
  event,
  truncatedDescription,
}: EventCardProps) {
  const previewUrl = useMemo(
    () => getPreviewUrl(event.thumbnail ?? null),
    [event.thumbnail]
  );

  const category = event.department
    ? event.department.toString()
    : "Uncategorized";

  // Compute date values synchronously to avoid hydration mismatch
  const month = event.startDate
    ? new Date(event.startDate).toLocaleString("id-ID", { month: "short" })
    : "N/A";
  const day = event.startDate ? new Date(event.startDate).getDate() : null;
  const time = event.startDate
    ? new Date(event.startDate).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Loading";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-red-600">
      <div className="h-48 bg-red-100 flex items-center relative">
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium z-10">
          {category}
        </div>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={event.name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-red-600 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
        <div className="absolute top-4 right-4 bg-white text-red-600 px-3 py-1 rounded-full text-sm font-medium shadow-md flex flex-col items-center justify-center w-12 h-12 z-10">
          <span className="text-xs font-bold">{month || "N/A"}</span>
          <span className="text-lg font-bold -mt-1">{day ?? "-"}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          {event.name}
        </h3>
        <HtmlRenderer html={truncatedDescription} />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{time || "Loading"}</span>
          <Link
            href={`/event/${event.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
