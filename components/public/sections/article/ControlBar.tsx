import { motion } from "framer-motion";
import {
  Filter,
  SortAsc,
  ChevronDown,
  RefreshCw,
  X,
  Tag,
  Clock,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import type {
  SortOption,
  ViewMode,
} from "../../../../hooks/article/hooks/constants";

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface ControlBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  searchQuery: string;
  onSearchClear: () => void;
  onResetFilters: () => void;
}

const getSortLabel = (sort: SortOption) => {
  switch (sort) {
    case "newest":
      return "Terbaru";
    case "popular":
      return "Populer";
    case "oldest":
      return "Terlama";
    default:
      return "Terbaru";
  }
};

const getSortIcon = (sort: SortOption) => {
  switch (sort) {
    case "newest":
      return <Clock className="w-4 h-4" />;
    case "popular":
      return <TrendingUp className="w-4 h-4" />;
    case "oldest":
      return <BookOpen className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const ControlBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  searchQuery,
  onSearchClear,
  onResetFilters,
}: ControlBarProps) => {
  const hasActiveFilters = searchQuery || selectedCategory !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
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
                <SortAsc className="w-4 h-4" />
                {getSortLabel(sortBy)}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-grey-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {[
                  { id: "newest" as const, label: "Terbaru" },
                  { id: "popular" as const, label: "Populer" },
                  { id: "oldest" as const, label: "Terlama" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => onSortChange(option.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      sortBy === option.id
                        ? "bg-primary-50 text-primary-600"
                        : "text-grey-700 hover:bg-grey-50"
                    }`}
                  >
                    {getSortIcon(option.id)}
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
                onClick={() => onViewModeChange("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-grey-600 hover:text-primary-600"
                }`}
                aria-label="List view"
              >
                <div className="w-4 h-4 flex flex-col gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-1 bg-current rounded-full"
                    />
                  ))}
                </div>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 text-grey-600 hover:text-primary-600 transition-colors"
              aria-label="Refresh articles"
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
                    onClick={onSearchClear}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedCategory !== "all" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span>
                    Kategori:{" "}
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                  <button
                    onClick={() => onCategoryChange("all")}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {hasActiveFilters && (
                <button
                  onClick={onResetFilters}
                  className="text-sm text-grey-600 hover:text-primary-600 transition-colors"
                >
                  Reset semua filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
