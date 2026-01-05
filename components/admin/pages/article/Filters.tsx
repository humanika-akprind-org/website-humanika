"use client";

import { useState, useEffect } from "react";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import { Status } from "@/types/enums";
import { PeriodApi } from "@/use-cases/api/period";
import { getArticleCategories } from "@/use-cases/api/article-category";
import SearchInput from "../../ui/input/SearchInput";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

interface ArticleFiltersProps {
  searchTerm: string;
  selectedArticles: string[];
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (period: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  onDeleteSelected: () => void;
}

export default function ArticleFilters({
  searchTerm,
  selectedArticles,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  periodFilter,
  onPeriodFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onDeleteSelected,
}: ArticleFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [periods, setPeriods] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const [error, setError] = useState<string | null>(null);

  // Fetch periods and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };

    fetchData();
  }, []);

  const statusOptions = [
    { value: "all", label: "All Status" },
    ...Object.values(Status).map((status) => ({
      value: status,
      label:
        status.toString().charAt(0).toUpperCase() +
        status.toString().slice(1).toLowerCase(),
    })),
  ];

  const periodOptions = [
    { value: "all", label: "All Period" },
    ...periods.map((period) => ({
      value: period.id,
      label: period.name,
    })),
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search article..."
            value={searchTerm}
            onChange={onSearchChange}
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
          <SelectFilter
            label="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={statusOptions}
          />
          <SelectFilter
            label="Period"
            value={periodFilter}
            onChange={onPeriodFilterChange}
            options={periodOptions}
          />
          <SelectFilter
            label="Category"
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            options={categoryOptions}
          />
          <div className="flex items-end">
            {selectedArticles.length > 0 && (
              <DeleteSelectedButton
                selectedCount={selectedArticles.length}
                onClick={onDeleteSelected}
              />
            )}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
