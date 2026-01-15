"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/public/pages/card/event/EventCard";
import type { Event, ScheduleItem } from "@/types/event";
import {
  Filter,
  CalendarDays,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import SectionHeaderSkeleton from "@/components/public/ui/skeleton/SectionHeaderSkeleton";
import EventsControlSkeleton from "@/components/public/ui/skeleton/EventsControlSkeleton";
import CardSkeleton from "@/components/public/ui/skeleton/CardSkeleton";

// Helper function to get the earliest schedule date from an event
function getEarliestScheduleDate(
  schedules: ScheduleItem[] | null | undefined
): Date | null {
  if (!schedules || schedules.length === 0) return null;
  const dates = schedules.map((s) => new Date(s.date).getTime());
  return new Date(Math.min(...dates));
}

// Helper function to get the time from the earliest schedule
function getEarliestScheduleTime(
  schedules: ScheduleItem[] | null | undefined
): string {
  const earliest = getEarliestScheduleDate(schedules);
  if (!earliest) return "";
  return earliest.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventsSection() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // Filter upcoming events - events with at least one schedule in the future
  const upcomingEvents = allEvents.filter((event) => {
    const earliestDate = getEarliestScheduleDate(event.schedules);
    return earliestDate && earliestDate > now;
  });

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(
      new Set(
        allEvents.map((e) => e.department?.toString().toLowerCase() || "other")
      )
    ),
  ];

  // Filter events by selected category
  const filteredEvents =
    selectedCategory === "all"
      ? upcomingEvents
      : upcomingEvents.filter(
          (event) =>
            event.department?.toString().toLowerCase() === selectedCategory
        );

  // Sort by date (nearest first) - using earliest schedule date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = getEarliestScheduleDate(a.schedules);
    const dateB = getEarliestScheduleDate(b.schedules);
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateA.getTime() - dateB.getTime();
  });

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
        <div className="container mx-auto px-4">
          <SectionHeaderSkeleton />
          <EventsControlSkeleton />
          <CardSkeleton
            count={6}
            gridClass="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
            KEGIATAN TERDEKAT
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-grey-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Event Mendatang
            </span>
            <br />
            yang Wajib Diikuti
          </h2>

          <p className="text-lg text-grey-600 max-w-2xl mx-auto leading-relaxed">
            Temukan acara terbaru yang akan membantu Anda mengembangkan skill
            dan memperluas jaringan profesional
          </p>
        </motion.div>

        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-grey-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                Event yang Akan Datang
                <span className="ml-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  {sortedEvents.length} Event
                </span>
              </h3>
              <p className="text-grey-600">
                Pilih kategori untuk menemukan event yang sesuai minat Anda
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 4).map((category) => (
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

                {categories.length > 4 && (
                  <button className="px-4 py-2 bg-white border border-grey-200 text-grey-700 rounded-lg text-sm font-medium hover:border-primary-300 hover:text-primary-600 transition-colors">
                    +{categories.length - 4} lainnya
                  </button>
                )}
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
                  aria-label="Grid view"
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-primary-50 text-primary-600"
                      : "text-grey-600 hover:text-primary-600"
                  }`}
                  aria-label="List view"
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events Grid/List */}
        {sortedEvents.length > 0 ? (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              >
                {sortedEvents.slice(0, 6).map((event, index) => {
                  const truncatedDescription = event.description
                    ? event.description.length > 150
                      ? `${event.description.substring(0, 150)}...`
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
              </motion.div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <div className="space-y-6">
                  {sortedEvents.slice(0, 4).map((event, index) => {
                    const earliestDate = getEarliestScheduleDate(
                      event.schedules
                    );
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="group bg-white rounded-xl shadow-lg hover:shadow-xl border border-grey-200 overflow-hidden transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Date Badge */}
                          <div className="md:w-32 bg-gradient-to-b from-primary-600 to-primary-700 text-white p-6 flex flex-col items-center justify-center">
                            <div className="text-3xl font-bold">
                              {earliestDate ? earliestDate.getDate() : "-"}
                            </div>
                            <div className="text-sm uppercase font-semibold mt-1">
                              {earliestDate
                                ? earliestDate.toLocaleString("id-ID", {
                                    month: "short",
                                  })
                                : "-"}
                            </div>
                            <div className="text-xs opacity-80 mt-1">
                              {earliestDate
                                ? earliestDate.toLocaleString("id-ID", {
                                    weekday: "short",
                                  })
                                : "-"}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                                    {event.department || "General"}
                                  </span>
                                  <span className="text-sm text-grey-600 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {getEarliestScheduleTime(event.schedules)}
                                  </span>
                                </div>

                                <h3 className="text-xl font-bold text-grey-900 mb-3 group-hover:text-primary-600 transition-colors">
                                  {event.name}
                                </h3>

                                {event.description && (
                                  <p className="text-grey-600 line-clamp-2 mb-4">
                                    {event.description.length > 200
                                      ? `${event.description.substring(
                                          0,
                                          200
                                        )}...`
                                      : event.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Load More / View More */}
            {sortedEvents.length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-16"
              >
                <button className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-grey-200 text-grey-700 rounded-xl hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 font-semibold shadow-sm hover:shadow-md">
                  <span>Muat Lebih Banyak</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-grey-600 text-sm mt-4">
                  Menampilkan 6 dari {sortedEvents.length} event mendatang
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-grey-200 mb-16"
          >
            <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-primary-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-grey-900 mb-2">
                  Belum Ada Event Mendatang
                </h3>
                <p className="text-grey-600 mb-6">
                  Saat ini belum ada event yang akan datang. Silakan kembali
                  lagi nanti atau jelajahi event sebelumnya.
                </p>
              </div>
              <Link
                href="/event/archive"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                <span>Lihat Event Sebelumnya</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-12 text-white shadow-2xl mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Bergabung dengan Komunitas
                </span>
              </div>

              <h3 className="text-3xl font-bold mb-6">
                Tidak Ingin Ketinggalan Event?
              </h3>

              <p className="text-primary-100/90 text-lg mb-8 leading-relaxed">
                Daftar sekarang untuk mendapatkan notifikasi event terbaru,
                akses eksklusif, dan kesempatan untuk berpartisipasi dalam
                kegiatan komunitas kami.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-all duration-300 font-semibold shadow-lg"
                >
                  <span>Daftar Sekarang</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/event/calendar"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  <span>Lihat Kalender</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

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
