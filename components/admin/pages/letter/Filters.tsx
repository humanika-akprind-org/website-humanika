"use client";

import { useState, useEffect } from "react";
import { LetterType, LetterPriority, LetterClassification } from "types/enums";
import type { LetterFilter } from "types/letter";
import { PeriodApi } from "@/use-cases/api/period";
import SearchInput from "../../ui/input/SearchInput";
import SelectFilter from "../../ui/input/SelectFilter";
import FilterButton from "../../ui/button/FilterButton";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

interface LetterFiltersProps {
  onFilter: (filter: LetterFilter) => void;
  isLoading?: boolean;
  selectedCount: number;
  onDeleteSelected: () => void;
  canDelete?: () => boolean;
}

export default function LetterFilters({
  onFilter,
  isLoading,
  selectedCount,
  onDeleteSelected,
  canDelete,
}: LetterFiltersProps) {
  const [filters, setFilters] = useState<LetterFilter>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [periods, setPeriods] = useState<{ id: string; name: string }[]>([]);

  // Fetch periods on component mount
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const periodData = await PeriodApi.getPeriods();
        const periodOptions = periodData.map((period) => ({
          id: period.id,
          name: period.name,
        }));
        setPeriods(periodOptions);
      } catch (err) {
        console.error("Error fetching periods:", err);
        // Fallback to empty array
        setPeriods([]);
      }
    };

    fetchPeriods();
  }, []);

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
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Search letters..."
          value={filters.search || ""}
          onChange={(value) => handleFilterChange("search", value)}
        />

        <div className="flex items-center gap-3">
          <FilterButton
            isOpen={isFilterOpen}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          />

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isLoading}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
          <SelectFilter
            label="Type"
            value={filters.type || ""}
            onChange={(value) =>
              handleFilterChange("type", value as LetterType)
            }
            options={[
              { value: "", label: "All Types" },
              ...Object.values(LetterType).map((type) => ({
                value: type,
                label:
                  type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
              })),
            ]}
          />

          <SelectFilter
            label="Priority"
            value={filters.priority || ""}
            onChange={(value) =>
              handleFilterChange("priority", value as LetterPriority)
            }
            options={[
              { value: "", label: "All Priorities" },
              ...Object.values(LetterPriority).map((priority) => ({
                value: priority,
                label:
                  priority.charAt(0).toUpperCase() +
                  priority.slice(1).toLowerCase(),
              })),
            ]}
          />

          <SelectFilter
            label="Classification"
            value={filters.classification || ""}
            onChange={(value) =>
              handleFilterChange(
                "classification",
                value as LetterClassification
              )
            }
            options={[
              { value: "", label: "All Classifications" },
              ...Object.values(LetterClassification).map((classification) => ({
                value: classification,
                label: classification
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (l: string) => l.toUpperCase()),
              })),
            ]}
          />

          <div>
            <SelectFilter
              label="Period"
              value={filters.periodId || ""}
              onChange={(value) => handleFilterChange("periodId", value)}
              options={[
                { value: "", label: "All Periods" },
                ...periods.map((period) => ({
                  value: period.id,
                  label: period.name,
                })),
              ]}
            />
          </div>
          <div className="flex items-end">
            {canDelete && canDelete() && (
              <DeleteSelectedButton
                selectedCount={selectedCount}
                onClick={onDeleteSelected}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
