import { motion } from "framer-motion";
import {
  Filter,
  TrendingUp,
  ChevronDown,
  X,
  CalendarDays,
  Calendar,
} from "lucide-react";
import { Tag } from "lucide-react";
import type {
  EventFilters,
  ViewMode,
  SortBy,
} from "@/hooks/event/useEventPage";
import { hasActiveFilters } from "./utils";

interface EventControlBarProps {
  filters: EventFilters;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortBy) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onResetFilters: () => void;
  categories: Array<{
    id: string;
    name: string;
    count: number;
    color: string;
  }>;
  selectedCategory: string;
  viewMode: ViewMode;
  sortBy: SortBy;
}

export default function EventControlBar({
  filters,
  onCategoryChange,
  onSortChange,
  onViewModeChange,
  onResetFilters,
  categories,
  selectedCategory,
  viewMode,
  sortBy,
}: EventControlBarProps) {
  const sortOptions = [
    {
      id: "date" as const,
      label: "Tanggal Terdekat",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "popular" as const,
      label: "Paling Populer",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "name" as const,
      label: "Nama A-Z",
      icon: <Tag className="w-4 h-4" />,
    },
  ];

  return (
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
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                        : "bg-grey-100 text-grey-700 hover:bg-grey-200"
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {category.name}
                    {category.id !== "all" && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          selectedCategory === category.id
                            ? "bg-white/30"
                            : "bg-grey-300"
                        }`}
                      >
                        {category.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
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
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => onSortChange(option.id)}
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
                onClick={() => onViewModeChange("grid")}
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
                onClick={() => onViewModeChange("calendar")}
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
            {hasActiveFilters({
              searchQuery: filters.searchQuery,
              selectedCategory: filters.selectedCategory,
              selectedType: filters.selectedType,
              selectedStatus: filters.selectedStatus,
            }) && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters({
          searchQuery: filters.searchQuery,
          selectedCategory: filters.selectedCategory,
          selectedType: filters.selectedType,
          selectedStatus: filters.selectedStatus,
        }) && (
          <div className="mt-6 pt-6 border-t border-grey-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-grey-600">Filter aktif:</span>
              {filters.searchQuery && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span>&quot;{filters.searchQuery}&quot;</span>
                  <button
                    onClick={() => onCategoryChange("all")}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.selectedCategory !== "all" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span>{filters.selectedCategory}</span>
                  <button
                    onClick={() => onCategoryChange("all")}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.selectedType !== "all" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span>{filters.selectedType}</span>
                  <button
                    onClick={() => onCategoryChange("all")}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.selectedStatus !== "all" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span>
                    {filters.selectedStatus === "free" ? "Gratis" : "Berbayar"}
                  </span>
                  <button
                    onClick={() => onCategoryChange("all")}
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
