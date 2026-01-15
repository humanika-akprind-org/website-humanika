"use client";

import React, { useMemo } from "react";
import { Image as ImageIcon, RefreshCw } from "lucide-react";
import { useGalleryPageData } from "@/hooks/gallery/useGalleryPageData";
import { useGalleryFilters } from "@/hooks/gallery/useGalleryFilters";
import GalleryHeroSection from "@/components/public/sections/gallery/GalleryHeroSection";
import GalleryTabs from "@/components/public/pages/gallery/GalleryTabs";
import GalleryControlBar from "@/components/public/pages/gallery/GalleryControlBar";
import GalleryContent from "@/components/public/pages/gallery/GalleryContent";
import TopEventsSection from "@/components/public/sections/gallery/TopEventsSection";
import GalleryPageLoadingState from "@/components/public/pages/gallery/GalleryPageLoadingState";

export default function GalleryPage() {
  const { events, galleries, isLoading, error, refetch, albums, stats, years } =
    useGalleryPageData();

  const { filters, updateFilter, resetFilters } = useGalleryFilters();

  // Filter albums by selected year
  const filteredAlbums = useMemo(() => {
    if (!albums) return [];
    return filters.selectedYear === "all"
      ? albums
      : albums.filter((album) => album.year === filters.selectedYear);
  }, [albums, filters.selectedYear]);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <GalleryPageLoadingState />;
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
                onClick={handleRefresh}
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
      <GalleryHeroSection
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => updateFilter("searchQuery", query)}
        stats={
          stats || {
            totalPhotos: 0,
            totalAlbums: 0,
            totalEvents: 0,
            latestUpload: "Belum ada",
          }
        }
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs Navigation */}
        <GalleryTabs
          activeTab={filters.activeTab}
          onTabChange={(tab) => updateFilter("activeTab", tab)}
          albums={albums || []}
          galleries={galleries}
        />

        {/* Control Bar */}
        <GalleryControlBar
          selectedYear={filters.selectedYear}
          selectedEvent={filters.selectedEvent}
          viewMode={filters.viewMode}
          sortBy={filters.sortBy}
          searchQuery={filters.searchQuery}
          years={years || []}
          events={events}
          onYearChange={(year) => updateFilter("selectedYear", year)}
          onEventChange={(event) => updateFilter("selectedEvent", event)}
          onViewModeChange={(mode) => updateFilter("viewMode", mode)}
          onSortChange={(sort) => updateFilter("sortBy", sort)}
          onSearchChange={(query) => updateFilter("searchQuery", query)}
          onResetFilters={resetFilters}
          onRefresh={handleRefresh}
        />

        {/* Content Sections */}
        <GalleryContent
          viewMode={filters.viewMode}
          activeTab={filters.activeTab}
          filteredAlbums={filteredAlbums}
          galleries={galleries}
        />

        {/* Top Events */}
        <TopEventsSection albums={albums || []} />
      </div>
    </div>
  );
}
