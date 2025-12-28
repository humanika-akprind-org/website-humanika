"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/public/event/EventCard";
import PastEventCard from "@/components/public/event/PastEventCard";
import type { Event } from "@/types/event";
import {
  Calendar,
  Filter,
  CalendarDays,
  Sparkles,
  TrendingUp,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function EventSection() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/event?status=PUBLISH`,
          {
            cache: "no-store",
          }
        );
        const events: Event[] = await res.json();
        setAllEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();

  // Filter events
  const upcomingEvents = allEvents.filter(
    (event) => new Date(event.startDate) > now
  );

  const pastEvents = allEvents
    .filter((event) => new Date(event.endDate) < now)
    .slice(0, 4);

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(
      new Set(
        allEvents.map((e) => e.department?.toString().toLowerCase() || "other")
      )
    ),
  ];

  // Filter events by category
  const filteredUpcomingEvents =
    selectedCategory === "all"
      ? upcomingEvents
      : upcomingEvents.filter(
          (event) =>
            event.department?.toString().toLowerCase() === selectedCategory
        );

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              KALENDER KEGIATAN
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-grey-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                Event & Kegiatan
              </span>
              <br />
              Mendatang
            </h2>

            <p className="text-lg text-grey-600 max-w-2xl mx-auto leading-relaxed">
              Ikuti kegiatan dan acara terbaru kami untuk mengembangkan skill
              dan jaringan profesional Anda
            </p>
          </div>

          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              <p className="text-grey-600 font-medium">
                Memuat daftar event...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-grey-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
            KALENDER KEGIATAN
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-grey-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Event & Kegiatan
            </span>
            <br />
            Mendatang
          </h2>

          <p className="text-lg text-grey-600 max-w-2xl mx-auto leading-relaxed">
            Ikuti kegiatan dan acara terbaru kami untuk mengembangkan skill dan
            jaringan profesional Anda
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-grey-900 mb-2 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary-600" />
                Kegiatan Mendatang
                <span className="ml-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  {upcomingEvents.length} Event
                </span>
              </h3>
              <p className="text-grey-600">
                Pilih kategori untuk melihat event spesifik
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                        : "bg-white border border-grey-200 text-grey-700 hover:border-primary-300 hover:text-primary-600"
                    }`}
                  >
                    {category === "all"
                      ? "Semua"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-grey-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary-50 text-primary-600"
                      : "text-grey-600 hover:text-primary-600"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "calendar"
                      ? "bg-primary-50 text-primary-600"
                      : "text-grey-600 hover:text-primary-600"
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Events Grid */}
          {filteredUpcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredUpcomingEvents.slice(0, 6).map((event, index) => {
                const truncatedDescription = event.description
                  ? event.description.length > 150
                    ? event.description.substring(0, 150) + "..."
                    : event.description
                  : "";

                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    truncatedDescription={truncatedDescription}
                    index={index}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-grey-200 mb-16">
              <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
                <Calendar className="w-16 h-16 text-grey-400" />
                <div>
                  <h3 className="text-xl font-bold text-grey-900 mb-2">
                    Belum Ada Event Mendatang
                  </h3>
                  <p className="text-grey-600">
                    Tidak ada event yang tersedia untuk kategori ini. Silakan
                    cek kategori lain atau kembali lagi nanti.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Load More Button */}
          {filteredUpcomingEvents.length > 6 && (
            <div className="text-center mb-20">
              <button className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-grey-200 text-grey-700 rounded-xl hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 font-semibold shadow-sm hover:shadow-md">
                <span>Muat Lebih Banyak</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-grey-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Kegiatan Terdahulu
                </h3>
                <p className="text-grey-600">
                  Jelajahi event yang telah kami selenggarakan
                </p>
              </div>

              <Link
                href="/event/archive"
                className="group inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <span>Lihat Arsip Lengkap</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event) => (
                <PastEventCard
                  key={event.id}
                  id={event.id}
                  title={event.name}
                  date={event.endDate}
                  image={event.thumbnail ?? undefined}
                  participants={event.capacity}
                  achievements={["Workshop", "Networking"]}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/event"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            <span>Jelajahi Semua Event</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-grey-600 text-sm mt-4">
            {allEvents.length}+ event tersedia untuk Anda ikuti
          </p>
        </motion.div>
      </div>
    </section>
  );
}
