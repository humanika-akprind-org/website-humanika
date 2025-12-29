"use client";

import React, { useState, useEffect } from "react";
import { getEvents } from "@/use-cases/api/event";
import { getGalleries } from "@/use-cases/api/gallery";
import type { Event } from "@/types/event";
import type { Gallery } from "@/types/gallery";
import { Status } from "@/types/enums";
import AlbumGrid from "@/components/public/gallery/AlbumGrid";
import GalleryGrid from "@/components/public/gallery/GalleryGrid";
import {
  Camera,
  Image as ImageIcon,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Loader2,
  RefreshCw,
  X,
  Grid3x3,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function GalleryPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"albums" | "photos" | "both">(
    "both"
  );
  const [activeTab, setActiveTab] = useState<
    "albums" | "highlights" | "trending"
  >("albums");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "event">(
    "recent"
  );

  // Helper function to get preview URL
  const getPreviewUrl = (image: string | null | undefined): string => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, galleriesData] = await Promise.all([
        getEvents({ status: Status.PUBLISH }),
        getGalleries(),
      ]);
      setEvents(eventsData);
      setGalleries(galleriesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load gallery data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Group galleries by eventId and count them
  const galleryCounts = galleries.reduce((acc, gallery) => {
    acc[gallery.eventId] = (acc[gallery.eventId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Extract years from events
  const years = [
    "all",
    ...Array.from(
      new Set(
        events.map((event) =>
          new Date(event.startDate).getFullYear().toString()
        )
      )
    ),
  ].sort((a, b) => b.localeCompare(a));

  // Prepare albums data with additional info
  const albums = events
    .map((event) => {
      const eventDate = new Date(event.startDate);
      return {
        id: event.id,
        title: event.name,
        count: galleryCounts[event.id] || 0,
        cover: getPreviewUrl(event.thumbnail),
        lastUpdated: event.updatedAt,
        eventName: event.name,
        category: event.department?.toString() || "General",
        date: eventDate,
        year: eventDate.getFullYear().toString(),
      };
    })
    .filter((album) => album.count > 0); // Only show albums with photos

  // Filter albums by selected year
  const filteredAlbums =
    selectedYear === "all"
      ? albums
      : albums.filter((album) => album.year === selectedYear);

  // Calculate stats
  const stats = {
    totalPhotos: galleries.length,
    totalAlbums: albums.length,
    totalEvents: new Set(galleries.map((g) => g.eventId)).size,
    latestUpload:
      galleries.length > 0
        ? new Date(galleries[0].createdAt).toLocaleDateString("id-ID")
        : "Belum ada",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
              <Camera className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-6 text-grey-600 font-medium">Memuat galeri...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-grey-900 mb-2">
                  Gagal Memuat Galeri
                </h3>
                <p className="text-grey-600 mb-6">{error}</p>
              </div>
              <button
                onClick={loadData}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 via-primary-800 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-primary-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">DOKUMENTASI VISUAL</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                Galeri & Dokumentasi
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-100">
                HUMANIKA
              </span>
            </h1>

            <p className="text-xl text-primary-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Jelajahi momen berharga, kegiatan inspiratif, dan dokumentasi
              visual dari perjalanan Himpunan Mahasiswa Informatika.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari foto berdasarkan event, deskripsi, atau tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 placeholder-primary-200"
                />
                <ImageIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-200" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-200 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {stats.totalPhotos} Foto
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {stats.totalAlbums} Album
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {stats.totalEvents} Event
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  Terakhir: {stats.latestUpload}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="inline-flex rounded-xl bg-grey-100 p-2">
              {[
                {
                  id: "albums",
                  label: "Album",
                  icon: <Grid3x3 className="w-4 h-4" />,
                  count: albums.length,
                },
                {
                  id: "highlights",
                  label: "Highlight",
                  icon: <Sparkles className="w-4 h-4" />,
                  count: Math.min(12, galleries.length),
                },
                {
                  id: "trending",
                  label: "Trending",
                  icon: <TrendingUp className="w-4 h-4" />,
                  count: Math.min(8, galleries.length),
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "albums" | "highlights" | "trending")
                  }
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                      : "text-grey-700 hover:text-primary-600 hover:bg-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      activeTab === tab.id ? "bg-white/30" : "bg-grey-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-grey-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Filters */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-grey-600" />
                    <span className="text-sm font-medium text-grey-700">
                      Filter:
                    </span>
                  </div>

                  {/* Year Filter */}
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 bg-grey-100 text-grey-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="all">Semua Tahun</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year === "all" ? "Semua Tahun" : year}
                      </option>
                    ))}
                  </select>

                  {/* Event Filter */}
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="px-4 py-2 bg-grey-100 text-grey-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="all">Semua Event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <select
                    value={viewMode}
                    onChange={(e) =>
                      setViewMode(
                        e.target.value as "albums" | "photos" | "both"
                      )
                    }
                    className="px-4 py-2 bg-grey-100 text-grey-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="both">Album & Foto</option>
                    <option value="albums">Album Saja</option>
                    <option value="photos">Foto Saja</option>
                  </select>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Sort By */}
                <div className="relative group">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-grey-100 text-grey-700 rounded-lg hover:bg-grey-200 transition-colors text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    {sortBy === "recent"
                      ? "Terbaru"
                      : sortBy === "popular"
                      ? "Populer"
                      : "Event"}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-grey-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {[
                      {
                        id: "recent",
                        label: "Terbaru",
                        icon: <Calendar className="w-4 h-4" />,
                      },
                      {
                        id: "popular",
                        label: "Paling Populer",
                        icon: <Heart className="w-4 h-4" />,
                      },
                      {
                        id: "event",
                        label: "Berdasarkan Event",
                        icon: <Users className="w-4 h-4" />,
                      },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          setSortBy(option.id as "recent" | "popular" | "event")
                        }
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          sortBy === option.id
                            ? "bg-primary-50 text-primary-600"
                            : "text-grey-700 hover:bg-grey-50"
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                {(searchQuery ||
                  selectedYear !== "all" ||
                  selectedEvent !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedYear("all");
                      setSelectedEvent("all");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Reset Filter
                  </button>
                )}

                {/* Refresh Button */}
                <button
                  onClick={loadData}
                  className="p-2 text-grey-600 hover:text-primary-600 transition-colors"
                  aria-label="Refresh gallery"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery ||
              selectedYear !== "all" ||
              selectedEvent !== "all") && (
              <div className="mt-6 pt-6 border-t border-grey-200">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-grey-600">Filter aktif:</span>
                  {searchQuery && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>&quot;{searchQuery}&quot;</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="hover:text-primary-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedYear !== "all" && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>Tahun: {selectedYear}</span>
                      <button
                        onClick={() => setSelectedYear("all")}
                        className="hover:text-primary-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedEvent !== "all" && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>
                        Event:{" "}
                        {events.find((e) => e.id === selectedEvent)?.name}
                      </span>
                      <button
                        onClick={() => setSelectedEvent("all")}
                        className="hover:text-primary-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-16"
        >
          {/* Albums Section */}
          {(viewMode === "both" || viewMode === "albums") && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Grid3x3 className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-grey-900">
                      Album Foto
                    </h2>
                  </div>
                  <p className="text-grey-600">
                    Kelompokkan foto berdasarkan event dan kegiatan
                  </p>
                </div>
                <div className="text-sm text-grey-600">
                  {filteredAlbums.length} album •{" "}
                  {filteredAlbums.reduce((sum, album) => sum + album.count, 0)}{" "}
                  foto
                </div>
              </div>

              {filteredAlbums.length > 0 ? (
                <AlbumGrid
                  albums={filteredAlbums}
                  title=""
                  showFilters={false}
                />
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-grey-200">
                  <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                      <Grid3x3 className="w-12 h-12 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-grey-900 mb-2">
                        Tidak Ada Album Ditemukan
                      </h3>
                      <p className="text-grey-600">
                        Tidak ada album yang cocok dengan filter yang dipilih.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {/* Photos Section */}
          {(viewMode === "both" || viewMode === "photos") && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Camera className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-grey-900">
                      {activeTab === "highlights"
                        ? "Foto Highlight"
                        : activeTab === "trending"
                        ? "Foto Trending"
                        : "Foto Terbaru"}
                    </h2>
                  </div>
                  <p className="text-grey-600">
                    {activeTab === "highlights"
                      ? "Kumpulan foto terbaik dari berbagai event"
                      : activeTab === "trending"
                      ? "Foto yang paling banyak disukai"
                      : "Foto-foto terbaru dari galeri"}
                  </p>
                </div>
                <div className="text-sm text-grey-600">
                  {galleries.length} foto •{" "}
                  {new Set(galleries.map((g) => g.eventId)).size} event
                </div>
              </div>

              {galleries.length > 0 ? (
                <GalleryGrid
                  galleries={galleries}
                  title=""
                  showFilters={false}
                />
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-grey-200">
                  <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-grey-900 mb-2">
                        Belum Ada Foto
                      </h3>
                      <p className="text-grey-600">
                        Belum ada foto yang tersedia di galeri.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {/* Top Events */}
          {albums.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 text-primary-600 font-semibold uppercase tracking-wider text-sm mb-4">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  EVENT POPULER
                </div>
                <h2 className="text-3xl font-bold text-grey-900 mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                    Event dengan Foto Terbanyak
                  </span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {albums
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 4)
                  .map((album) => (
                    <Link
                      key={album.id}
                      href={`/gallery/${album.id}`}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-grey-200"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-primary-50 to-primary-100">
                        {album.cover ? (
                          <Image
                            src={album.cover}
                            alt={album.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-primary-200">
                            <ImageIcon className="w-16 h-16" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600 shadow-md">
                          {album.count} foto
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <h3 className="text-white font-bold text-lg line-clamp-2">
                            {album.title}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between text-sm text-grey-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {album.year}
                          </div>
                          <span className="text-primary-600 font-medium group-hover:text-primary-700">
                            Lihat album →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </motion.section>
          )}

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-grey-200">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">UNGGAH FOTO</span>
                </div>

                <h2 className="text-3xl font-bold text-grey-900 mb-6">
                  Punya Foto dari Event HUMANIKA?
                </h2>

                <p className="text-grey-600 mb-10 leading-relaxed">
                  Bagikan momen berharga Anda dengan komunitas. Upload foto
                  event HUMANIKA yang Anda ikuti dan jadilah bagian dari
                  dokumentasi kami.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/upload"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Upload Foto</span>
                  </Link>
                  <Link
                    href="/event"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-300 font-semibold"
                  >
                    <span>Lihat Event</span>
                    <ChevronDown className="w-5 h-5 transform rotate-270" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
