import React from "react";
import { motion } from "framer-motion";
import {
  Filter,
  Calendar,
  ChevronDown,
  X,
  RefreshCw,
  Heart,
  Users,
} from "lucide-react";
import type { Event } from "@/types/event";
import { SORT_OPTIONS, VIEW_MODE_OPTIONS, ANIMATION_DELAYS } from "./constants";

const iconMap = {
  Calendar,
  Heart,
  Users,
};

interface GalleryControlBarProps {
  selectedYear: string;
  selectedEvent: string;
  viewMode: "albums" | "photos" | "both";
  sortBy: "recent" | "popular" | "event";
  searchQuery: string;
  years: string[];
  events: Event[];
  onYearChange: (year: string) => void;
  onEventChange: (event: string) => void;
  onViewModeChange: (mode: "albums" | "photos" | "both") => void;
  onSortChange: (sort: "recent" | "popular" | "event") => void;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
}

export default function GalleryControlBar({
  selectedYear,
  selectedEvent,
  viewMode,
  sortBy,
  searchQuery,
  years,
  events,
  onYearChange,
  onEventChange,
  onViewModeChange,
  onSortChange,
  onSearchChange,
  onResetFilters,
  onRefresh,
}: GalleryControlBarProps) {
  const hasActiveFilters =
    searchQuery || selectedYear !== "all" || selectedEvent !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAYS.controlBar }}
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
                onChange={(e) => onYearChange(e.target.value)}
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
                onChange={(e) => onEventChange(e.target.value)}
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
                  onViewModeChange(
                    e.target.value as "albums" | "photos" | "both"
                  )
                }
                className="px-4 py-2 bg-grey-100 text-grey-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {VIEW_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort By */}
            <div className="relative group">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-grey-100 text-grey-700 rounded-lg hover:bg-grey-200 transition-colors text-sm font-medium">
                {(() => {
                  const sortOption = SORT_OPTIONS.find(
                    (opt) => opt.id === sortBy
                  );
                  const IconComponent = sortOption
                    ? iconMap[sortOption.iconName as keyof typeof iconMap]
                    : Calendar;
                  return <IconComponent className="w-4 h-4" />;
                })()}
                {SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label ||
                  "Terbaru"}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-grey-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {SORT_OPTIONS.map((option) => {
                  const IconComponent =
                    iconMap[option.iconName as keyof typeof iconMap];
                  return (
                    <button
                      key={option.id}
                      onClick={() => onSortChange(option.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        sortBy === option.id
                          ? "bg-primary-50 text-primary-600"
                          : "text-grey-700 hover:bg-grey-50"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Reset Filter
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 text-grey-600 hover:text-primary-600 transition-colors"
              aria-label="Refresh gallery"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-grey-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-grey-600">Filter aktif:</span>
              {searchQuery && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span>&quot;{searchQuery}&quot;</span>
                  <button
                    onClick={() => onSearchChange("")}
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
                    onClick={() => onYearChange("all")}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedEvent !== "all" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span>
                    Event: {events.find((e) => e.id === selectedEvent)?.name}
                  </span>
                  <button
                    onClick={() => onEventChange("all")}
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
  );
}
