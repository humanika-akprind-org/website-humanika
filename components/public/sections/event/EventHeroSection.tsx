import { motion } from "framer-motion";
import { Sparkles, Search, X } from "lucide-react";
import type { EventStats } from "@/hooks/event/useEventPage";

interface EventHeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stats: EventStats;
}

export default function EventHeroSection({
  searchQuery,
  onSearchChange,
  stats,
}: EventHeroSectionProps) {
  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 placeholder-primary-200"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-200" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
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
                {stats.past} Event Terdahulu
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
