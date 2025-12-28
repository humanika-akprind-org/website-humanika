"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getEvent, getEvents } from "use-cases/api/event";
import type { Event } from "types/event";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Bookmark,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  CalendarDays,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";
import PastEventCard from "@/components/public/event/PastEventCard";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import { motion } from "framer-motion";

export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Helper function to get preview URL from image (file ID or URL)
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

  const [event, setEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const eventData = await getEvent(id);
        setEvent(eventData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load event data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  useEffect(() => {
    async function loadAllEvents() {
      try {
        const events = await getEvents();
        setAllEvents(events);
      } catch (err) {
        console.error("Failed to load all events:", err);
      }
    }
    loadAllEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-grey-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-grey-900 mb-2">
            Error loading event
          </h1>
          <p className="text-grey-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-grey-400 text-6xl mb-4">📅</div>
          <h1 className="text-2xl font-bold text-grey-900 mb-2">
            Event Not Found
          </h1>
          <p className="text-grey-600 mb-6">
            The requested event could not be found.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Events
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const now = new Date();
  const isPastEvent = endDate < now;
  const isUpcomingEvent = eventDate > now;
  const isOngoingEvent = eventDate <= now && endDate >= now;

  const pastEvents = allEvents
    .filter((e) => new Date(e.endDate) < now && e.id !== id)
    .slice(0, 4);

  const formatDateRange = () => {
    if (eventDate.toDateString() === endDate.toDateString()) {
      return eventDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return `${eventDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })} - ${endDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white overflow-hidden">
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
                  <span className="text-sm font-medium">
                    SEDANG BERLANGSUNG
                  </span>
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
                  <p className="font-medium">{formatDateRange()}</p>
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
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-200/80">Lokasi</p>
                  <p className="font-medium">
                    {event.location || "Universitas AKPRIND"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-200/80">Kategori</p>
                  <p className="font-medium">
                    {event.department || "HUMANIKA"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
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
                onClick={() => {
                  navigator
                    .share?.({
                      title: event.name,
                      text: event.description?.substring(0, 100) + "...",
                      url: window.location.href,
                    })
                    .catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan</span>
              </button>

              {event.registrationLink && !isPastEvent && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Daftar Sekarang</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Thumbnail Image */}
          {event.thumbnail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
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

                {/* Event Status Badge */}
                <div className="absolute top-6 right-6">
                  <div
                    className={`px-4 py-2 rounded-full font-medium shadow-lg ${
                      isPastEvent
                        ? "bg-grey-700 text-white"
                        : isUpcomingEvent
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {isPastEvent
                      ? "Berakhir"
                      : isUpcomingEvent
                      ? "Mendatang"
                      : "Berlangsung"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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
                      event.description ||
                      "<p>Tidak ada deskripsi tersedia.</p>"
                    }
                  />
                </div>

                {/* Additional Info */}
                {event.goals && (
                  <div className="mt-8 pt-8 border-t border-grey-200">
                    <h3 className="text-xl font-bold text-grey-900 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      Tujuan Acara
                    </h3>
                    <ul className="space-y-3">
                      {Array.isArray(event.goals) ? (
                        event.goals.map((goal, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-grey-700">{goal}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-grey-700">{event.goals}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Event Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl p-6 text-white shadow-lg ${
                  isPastEvent
                    ? "bg-gradient-to-br from-grey-700 to-grey-800"
                    : isUpcomingEvent
                    ? "bg-gradient-to-br from-green-500 to-green-600"
                    : "bg-gradient-to-br from-blue-500 to-blue-600"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {isPastEvent ? (
                      <Trophy className="w-6 h-6" />
                    ) : isUpcomingEvent ? (
                      <Sparkles className="w-6 h-6" />
                    ) : (
                      <Target className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Status Acara</h3>
                    <p className="text-sm opacity-90">
                      {isPastEvent
                        ? "Acara ini telah selesai"
                        : isUpcomingEvent
                        ? "Acara akan datang"
                        : "Acara sedang berlangsung"}
                    </p>
                  </div>
                </div>
                {!isPastEvent && event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-grey-900 rounded-xl hover:bg-grey-100 transition-colors font-semibold"
                  >
                    <CalendarDays className="w-4 h-4" />
                    Daftar Sekarang
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
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
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-grey-900">HUMANIKA</p>
                    <p className="text-sm text-grey-600">
                      Himpunan Mahasiswa Informatika
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-grey-200"
              >
                <h3 className="text-lg font-bold text-grey-900 mb-4">
                  Pertanyaan?
                </h3>
                <p className="text-grey-600 text-sm mb-4">
                  Hubungi kami untuk informasi lebih lanjut tentang acara ini.
                </p>
                <button
                  onClick={() => router.push("/contact")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
                >
                  Hubungi Tim
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-grey-900">
                    Acara Sebelumnya
                  </h2>
                  <p className="text-grey-600">
                    Jelajahi acara-acara HUMANIKA yang telah berlangsung
                  </p>
                </div>
                <button
                  onClick={() => router.push("/events")}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pastEvents.map((event) => (
                  <PastEventCard
                    key={event.id}
                    id={event.id}
                    title={event.name}
                    date={event.endDate}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-primary-900 to-primary-950 rounded-2xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700/10 rounded-full mix-blend-multiply filter blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm font-medium">IKUTI KAMI</span>
                </div>

                <h3 className="text-2xl font-bold mb-6">
                  Ingin Tetap Update dengan Acara HUMANIKA?
                </h3>

                <p className="text-xl text-primary-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Bergabung dengan newsletter kami untuk mendapatkan notifikasi
                  langsung tentang acara, workshop, dan kegiatan menarik
                  lainnya.
                </p>

                <div className="max-w-md mx-auto">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Email Anda"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-white text-primary-700 rounded-xl hover:bg-grey-50 transition-colors font-semibold"
                    >
                      Berlangganan
                    </button>
                  </div>
                  <p className="text-sm text-primary-200/80 mt-3">
                    Kami tidak akan mengirim spam. Batalkan kapan saja.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
