"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

interface RelatedEventsEmptyStateProps {
  onExploreEvents?: () => void;
}

export default function RelatedEventsEmptyState({
  onExploreEvents,
}: RelatedEventsEmptyStateProps) {
  const router = useRouter();

  const handleExploreEvents = () => {
    if (onExploreEvents) {
      onExploreEvents();
    } else {
      router.push("/event");
    }
  };

  return (
    <div className="text-center py-16">
      <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-grey-900 mb-2">
            Tidak Ada Acara Terkait
          </h3>
          <p className="text-grey-600">
            Belum ada acara terkait untuk event ini. Coba lihat event lainnya
            yang mungkin menarik bagi Anda.
          </p>
        </div>
        <button
          onClick={handleExploreEvents}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
        >
          <Calendar className="w-4 h-4" />
          Jelajahi Semua Acara
        </button>
      </div>
    </div>
  );
}
