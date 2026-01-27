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
import type { Event } from "@/domain/entities/event.entity";
import { SORT_OPTIONS, VIEW_MODE_OPTIONS, ANIMATION_DELAYS } from "./constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

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
      className="mb-8 md:mb-12"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-grey-200 p-4 md:p-6">
        {/* Main controls row - responsive layout */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Filters - scrollable on mobile */}
          <div className="flex-1">
            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 min-w-max md:min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Filter className="w-4 h-4 md:w-5 md:h-5 text-grey-600" />
                  <span className="text-xs md:text-sm font-medium text-grey-700">
                    Filter:
                  </span>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-32 sm:w-40 md:w-48 px-3 py-2 bg-grey-100 text-grey-700 rounded-lg text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-grey-400 flex-shrink-0"
                />

                {/* Year Filter */}
                <Select value={selectedYear} onValueChange={onYearChange}>
                  <SelectTrigger className="w-[120px] md:w-[140px] px-3 py-2 bg-grey-100 text-grey-700 rounded-lg text-xs md:text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-transparent hover:bg-grey-200 data-[placeholder]:text-grey-400 [&>span]:line-clamp-1">
                    <SelectValue placeholder="Semua Tahun" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-grey-200 shadow-lg rounded-lg">
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Event Filter */}
                <Select value={selectedEvent} onValueChange={onEventChange}>
                  <SelectTrigger className="w-[140px] md:w-[180px] px-3 py-2 bg-grey-100 text-grey-700 rounded-lg text-xs md:text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-transparent hover:bg-grey-200 data-[placeholder]:text-grey-400 [&>span]:line-clamp-1">
                    <SelectValue placeholder="Semua Event" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-grey-200 shadow-lg rounded-lg max-h-[300px]">
                    <SelectItem value="all">Semua Event</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <Select value={viewMode} onValueChange={onViewModeChange}>
                  <SelectTrigger className="w-[110px] md:w-[130px] px-3 py-2 bg-grey-100 text-grey-700 rounded-lg text-xs md:text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-transparent hover:bg-grey-200 data-[placeholder]:text-grey-400 [&>span]:line-clamp-1">
                    <SelectValue placeholder="Tampilan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-grey-200 shadow-lg rounded-lg">
                    {VIEW_MODE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Controls - stack on mobile, row on xl */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 xl:flex-nowrap">
            {/* Sort By */}
            <div className="relative group">
              <button className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-grey-100 text-grey-700 rounded-lg hover:bg-grey-200 transition-colors text-xs md:text-sm font-medium">
                {(() => {
                  const sortOption = SORT_OPTIONS.find(
                    (opt) => opt.id === sortBy,
                  );
                  const IconComponent = sortOption
                    ? iconMap[sortOption.iconName as keyof typeof iconMap]
                    : Calendar;
                  return (
                    <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  );
                })()}
                <span className="hidden sm:inline">
                  {SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label ||
                    "Terbaru"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-44 md:w-48 bg-white rounded-xl shadow-lg border border-grey-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {SORT_OPTIONS.map((option) => {
                  const IconComponent =
                    iconMap[option.iconName as keyof typeof iconMap];
                  return (
                    <button
                      key={option.id}
                      onClick={() => onSortChange(option.id)}
                      className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 text-left transition-colors ${
                        sortBy === option.id
                          ? "bg-primary-50 text-primary-600"
                          : "text-grey-700 hover:bg-grey-50"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-xs md:text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs md:text-sm font-medium"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Reset Filter</span>
                <span className="sm:hidden">Reset</span>
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

        {/* Active Filters - compact on mobile */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-grey-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-grey-600">Aktif:</span>
              {searchQuery && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                  <span>{`"${searchQuery}"`}</span>
                  <button
                    onClick={() => onSearchChange("")}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedYear !== "all" && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                  <span>{selectedYear}</span>
                  <button
                    onClick={() => onYearChange("all")}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedEvent !== "all" && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs max-w-[150px] truncate">
                  <span className="truncate">
                    {events.find((e) => e.id === selectedEvent)?.name}
                  </span>
                  <button
                    onClick={() => onEventChange("all")}
                    className="hover:text-primary-900 flex-shrink-0"
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
