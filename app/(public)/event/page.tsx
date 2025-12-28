"use client";

import { useEffect, useMemo, useState } from "react";
import EventCard from "@/components/public/event/EventCard";
import PastEventCard from "@/components/public/event/PastEventCard";
import type { Event } from "@/types/event";
import {
  Calendar,
  Filter,
  CalendarDays,
  Search,
  ChevronDown,
  Loader2,
  TrendingUp,
  X,
  Sparkles,
  Trophy,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function EventPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "popular" | "name">("date");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">(
    "upcoming"
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const now = new Date();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
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
      setError("Gagal memuat data event. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort logic
  const filteredEvents = useMemo(() => {
    let filtered = [...allEvents];

    // Filter by active tab
    if (activeTab === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.startDate) > now);
    } else if (activeTab === "past") {
      filtered = filtered.filter((event) => new Date(event.endDate) < now);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) =>
          event.department?.toString().toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((event) => event.type === selectedType);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      if (selectedStatus === "free") {
        filtered = filtered.filter((event) => event.isFree);
      } else if (selectedStatus === "paid") {
        filtered = filtered.filter((event) => !event.isFree);
      }
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "popular":
          return (b.capacity || 0) - (a.capacity || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Pagination
    const paginated = filtered.slice(0, page * 9);
    setHasMore(filtered.length > page * 9);

    return paginated;
  }, [
    allEvents,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedStatus,
    sortBy,
    activeTab,
    page,
  ]);

  // Extract unique categories and types
  const categories = [
    "all",
    ...Array.from(
      new Set(
        allEvents.map((e) => e.department?.toString().toLowerCase() || "other")
      )
    ),
  ];

  const eventTypes = [
    "all",
    ...Array.from(new Set(allEvents.map((e) => e.type || "general"))),
  ];

  // Stats calculation
  const stats = {
    total: allEvents.length,
    upcoming: allEvents.filter((e) => new Date(e.startDate) > now).length,
    past: allEvents.filter((e) => new Date(e.endDate) < now).length,
    free: allEvents.filter((e) => e.isFree).length,
    paid: allEvents.filter((e) => !e.isFree).length,
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSortBy("date");
    setPage(1);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-grey-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
              <Calendar className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-6 text-grey-600 font-medium">Memuat event...</p>
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
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-grey-900 mb-2">
                  Gagal Memuat Event
                </h3>
                <p className="text-grey-600 mb-6">{error}</p>
              </div>
              <button
                onClick={fetchEvents}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                <Loader2 className="w-4 h-4" />
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
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white overflow-hidden">
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
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">KALENDER KEGIATAN</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                Event & Kegiatan
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-100">
                HUMANIKA
              </span>
            </h1>

            <p className="text-xl text-primary-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Temukan berbagai kegiatan menarik yang kami selenggarakan untuk
              mengembangkan kompetensi, memperluas jaringan, dan menciptakan
              pengalaman berharga di bidang teknologi informasi.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari event berdasarkan nama, deskripsi, atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 placeholder-primary-200"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-200" />
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
                  {stats.total} Total Event
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {stats.upcoming} Event Mendatang
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-primary-200">
                  {stats.free} Event Gratis
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
                  id: "upcoming",
                  label: "Mendatang",
                  icon: <Calendar className="w-4 h-4" />,
                  count: stats.upcoming,
                },
                {
                  id: "past",
                  label: "Terdahulu",
                  icon: <Trophy className="w-4 h-4" />,
                  count: stats.past,
                },
                {
                  id: "all",
                  label: "Semua",
                  icon: <BarChart3 className="w-4 h-4" />,
                  count: stats.total,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setPage(1);
                  }}
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

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-grey-100 text-grey-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* Type Filter */}
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 bg-grey-100 text-grey-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="all">Semua Tipe</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 bg-grey-100 text-grey-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="free">Gratis</option>
                    <option value="paid">Berbayar</option>
                  </select>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Sort By */}
                <div className="relative group">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-grey-100 text-grey-700 rounded-lg hover:bg-grey-200 transition-colors text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {sortBy === "date"
                      ? "Tanggal"
                      : sortBy === "popular"
                      ? "Populer"
                      : "Nama"}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-grey-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {[
                      {
                        id: "date",
                        label: "Tanggal Terdekat",
                        icon: <Calendar className="w-4 h-4" />,
                      },
                      {
                        id: "popular",
                        label: "Paling Populer",
                        icon: <TrendingUp className="w-4 h-4" />,
                      },
                      {
                        id: "name",
                        label: "Nama A-Z",
                        icon: <BarChart3 className="w-4 h-4" />,
                      },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id as any)}
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

                {/* View Mode Toggle */}
                <div className="flex items-center bg-grey-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-grey-600 hover:text-primary-600"
                    }`}
                    aria-label="Grid view"
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-current rounded-sm" />
                      ))}
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "calendar"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-grey-600 hover:text-primary-600"
                    }`}
                    aria-label="Calendar view"
                  >
                    <CalendarDays className="w-4 h-4" />
                  </button>
                </div>

                {/* Reset Button */}
                {(searchQuery ||
                  selectedCategory !== "all" ||
                  selectedType !== "all" ||
                  selectedStatus !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedType !== "all" ||
              selectedStatus !== "all") && (
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
                  {selectedCategory !== "all" && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="hover:text-primary-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedType !== "all" && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>{selectedType}</span>
                      <button
                        onClick={() => setSelectedType("all")}
                        className="hover:text-primary-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedStatus !== "all" && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>
                        {selectedStatus === "free" ? "Gratis" : "Berbayar"}
                      </span>
                      <button
                        onClick={() => setSelectedStatus("all")}
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

        {/* Events Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-grey-900 mb-2">
                    Tidak Ada Event Ditemukan
                  </h3>
                  <p className="text-grey-600 mb-8">
                    {searchQuery ||
                    selectedCategory !== "all" ||
                    selectedType !== "all" ||
                    selectedStatus !== "all"
                      ? "Coba ubah filter atau kata kunci pencarian Anda."
                      : activeTab === "upcoming"
                      ? "Belum ada event mendatang. Silakan kembali lagi nanti."
                      : "Belum ada event terdahulu yang tercatat."}
                  </p>
                </div>
                {(searchQuery ||
                  selectedCategory !== "all" ||
                  selectedType !== "all" ||
                  selectedStatus !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Events Display */}
          {filteredEvents.length > 0 && (
            <>
              {/* Results Info */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-grey-900">
                    {activeTab === "upcoming"
                      ? "Event Mendatang"
                      : activeTab === "past"
                      ? "Event Terdahulu"
                      : "Semua Event"}
                  </h2>
                  <p className="text-grey-600 mt-2">
                    Menampilkan {filteredEvents.length} dari {allEvents.length}{" "}
                    event
                  </p>
                </div>
                <div className="text-sm text-grey-600">
                  Halaman {page} • {Math.ceil(allEvents.length / 9)} total
                  halaman
                </div>
              </div>

              {/* Events Grid */}
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredEvents.map((event, index) => {
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
                  </AnimatePresence>
                </div>
              ) : (
                // Calendar View
                <div className="bg-white rounded-2xl shadow-lg border border-grey-200 p-6">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-grey-900 mb-2">
                      Kalender Event
                    </h3>
                    <p className="text-grey-600">
                      Pilih tanggal untuk melihat event yang tersedia
                    </p>
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-8">
                    {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-grey-700 py-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const day = i + 1;
                      const hasEvent = allEvents.some(
                        (event) => new Date(event.startDate).getDate() === day
                      );
                      return (
                        <div
                          key={i}
                          className={`h-12 flex items-center justify-center rounded-lg border transition-colors ${
                            hasEvent
                              ? "bg-primary-50 border-primary-200 text-primary-700 cursor-pointer hover:bg-primary-100"
                              : "bg-grey-50 border-grey-200 text-grey-400"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memuat...
                      </>
                    ) : (
                      <>
                        <span>Muat Lebih Banyak</span>
                        <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Featured Past Events (Only for upcoming/all tabs) */}
          {activeTab !== "past" &&
            allEvents.filter((e) => new Date(e.endDate) < now).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Trophy className="w-6 h-6 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-grey-900">
                        Event Terdahulu
                      </h2>
                    </div>
                    <p className="text-grey-600">
                      Jelajahi event yang telah kami selenggarakan
                    </p>
                  </div>
                  <Link
                    href="/event/archive"
                    className="group inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <span>Lihat Arsip Lengkap</span>
                    <ChevronDown className="w-4 h-4 transform rotate-270 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {allEvents
                    .filter((event) => new Date(event.endDate) < now)
                    .slice(0, 4)
                    .map((event) => (
                      <PastEventCard
                        key={event.id}
                        id={event.id}
                        title={event.name}
                        date={event.endDate}
                        image={event.thumbnail || undefined}
                        participants={event.capacity}
                        achievements={[event.department || "General"]}
                      />
                    ))}
                </div>
              </motion.div>
            )}

          {/* Event Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20"
          >
            <div className="bg-gradient-to-r from-primary-900 to-primary-950 rounded-2xl p-8 md:p-12 text-white">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm font-medium">STATISTIK EVENT</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-6">Dalam Angka</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{stats.total}</div>
                    <div className="text-sm text-primary-200">Total Event</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {stats.upcoming}
                    </div>
                    <div className="text-sm text-primary-200">
                      Event Mendatang
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{stats.free}</div>
                    <div className="text-sm text-primary-200">Event Gratis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {Math.max(...allEvents.map((e) => e.capacity || 0))}
                    </div>
                    <div className="text-sm text-primary-200">
                      Kapasitas Tertinggi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-grey-200">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    JANGAN KETINGGALAN
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-grey-900 mb-6">
                  Dapatkan Notifikasi Event Terbaru
                </h2>

                <p className="text-grey-600 mb-10 leading-relaxed">
                  Berlangganan untuk mendapatkan update event terbaru langsung
                  ke email Anda. Dapatkan akses early bird, diskon khusus, dan
                  informasi lengkap seputar kegiatan HUMANIKA.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/auth/register"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Daftar Event Mendatang</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-300 font-semibold"
                  >
                    <span>Info Lebih Lanjut</span>
                    <ChevronDown className="w-5 h-5 transform rotate-270" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
