"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiTrash2, FiChevronDown } from "react-icons/fi";
import { Status } from "@/types/enums";
import { PeriodApi } from "@/lib/api/period";
import { getArticleCategories } from "@/lib/api/article-category";

interface ArticleFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (period: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function ArticleFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  periodFilter,
  onPeriodFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  selectedCount,
  onDeleteSelected,
}: ArticleFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [periods, setPeriods] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loadingPeriods, setLoadingPeriods] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch periods and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPeriods(true);
        setLoadingCategories(true);
        const [periodData, categoryData] = await Promise.all([
          PeriodApi.getPeriods(),
          getArticleCategories(),
        ]);
        const periodOptions = periodData.map((period) => ({
          id: period.id,
          name: period.name,
        }));
        setPeriods(periodOptions);
        setCategories(categoryData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load filters");
        // Fallback data
        setPeriods([
          { id: "fallback-2024", name: "2024" },
          { id: "fallback-2023", name: "2023" },
          { id: "fallback-2022", name: "2022" },
        ]);
        setCategories([
          { id: "fallback-news", name: "News" },
          { id: "fallback-announcement", name: "Announcement" },
        ]);
      } finally {
        setLoadingPeriods(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari artikel..."
            className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FiFilter className="mr-2 text-gray-500" />
          Filter
          <FiChevronDown
            className={`ml-2 transition-transform ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="all">Semua Status</option>
              {Object.values(Status).map((status) => (
                <option key={status} value={status}>
                  {status.toString().charAt(0).toUpperCase() +
                    status.toString().slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={periodFilter}
              onChange={(e) => onPeriodFilterChange(e.target.value)}
              disabled={loadingPeriods}
            >
              <option value="all">Semua Period</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
            {loadingPeriods && (
              <p className="text-xs text-gray-500 mt-1">Loading periods...</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              disabled={loadingCategories}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {loadingCategories && (
              <p className="text-xs text-gray-500 mt-1">
                Loading categories...
              </p>
            )}
          </div>
          <div className="flex items-end">
            <button
              className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                selectedCount === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
            >
              <FiTrash2 className="mr-2" />
              Hapus Terpilih ({selectedCount})
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
