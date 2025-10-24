"use client";

import React, { useState } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import type { LetterFilter } from "@/types/letter";
import { LetterType, LetterPriority } from "@/types/enums";

interface LetterFiltersProps {
  onFilter: (filter: LetterFilter) => void;
  isLoading?: boolean;
}

export default function LetterFilters({
  onFilter,
  isLoading,
}: LetterFiltersProps) {
  const [filters, setFilters] = useState<LetterFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = <K extends keyof LetterFilter>(
    key: K,
    value: LetterFilter[K] | undefined
  ) => {
    const newFilters = { ...filters };
    if (value === "" || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFilter(newFilters);
  };
  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search letters..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? "border-blue-500 text-blue-700 bg-blue-50"
                : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
            }`}
            disabled={isLoading}
          >
            <FiFilter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isLoading}
            >
              <FiX className="w-4 h-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type || ""}
                onChange={(e) =>
                  handleFilterChange("type", e.target.value as LetterType)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              >
                <option value="">All Types</option>
                {Object.values(LetterType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "priority",
                    e.target.value as LetterPriority
                  )
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              >
                <option value="">All Priorities</option>
                {Object.values(LetterPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() +
                      priority.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Period Filter - Placeholder for now */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <select
                value={filters.periodId || ""}
                onChange={(e) => handleFilterChange("periodId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              >
                <option value="">All Periods</option>
                {/* Period options would be populated from API */}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
