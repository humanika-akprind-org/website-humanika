"use client";

import AlbumCard from "./AlbumCard";
import { motion } from "framer-motion";
import { Grid3x3, FolderOpen, Filter } from "lucide-react";
import { useState } from "react";

interface Album {
  id: string;
  title: string;
  count: number;
  cover?: string;
  lastUpdated?: Date;
  eventName?: string;
  category?: string;
}

interface AlbumGridProps {
  albums: Album[];
  title?: string;
  showFilters?: boolean;
}

export default function AlbumGrid({
  albums,
  title = "Album Gallery",
  showFilters = true,
}: AlbumGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract unique categories
  const categories = [
    "all",
    ...Array.from(
      new Set(albums.map((album) => album.category || "uncategorized"))
    ),
  ];

  // Filter albums by category
  const filteredAlbums =
    selectedCategory === "all"
      ? albums
      : albums.filter((album) => album.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FolderOpen className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-grey-900">{title}</h2>
          </div>
          <p className="text-grey-600">
            {filteredAlbums.length} album •{" "}
            {albums.reduce((sum, album) => sum + album.count, 0)} foto
          </p>
        </div>

        {showFilters && categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-grey-700">
              <Filter className="w-4 h-4" />
              Filter:
            </div>
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
                  {category === "all" ? "Semua" : category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAlbums.map((album, index) => (
            <AlbumCard key={album.id} album={album} index={index} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-grey-200">
          <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
            <Grid3x3 className="w-16 h-16 text-grey-400" />
            <div>
              <h3 className="text-xl font-bold text-grey-900 mb-2">
                Tidak Ada Album Ditemukan
              </h3>
              <p className="text-grey-600">
                Tidak ada album yang cocok dengan filter yang dipilih.
              </p>
            </div>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}

      {/* Grid Info */}
      {filteredAlbums.length > 0 && (
        <div className="flex items-center justify-between text-sm text-grey-600 pt-4 border-t border-grey-200">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />
            <span>Menampilkan {filteredAlbums.length} album</span>
          </div>
          <span>Total {albums.length} album tersedia</span>
        </div>
      )}
    </div>
  );
}
