"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/event/useEvents";
import { useGalleryCategories } from "@/hooks/gallery-category/useGalleryCategories";
import { PeriodApi } from "@/use-cases/api/period";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

interface GalleryFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  eventFilter: string;
  onEventFilterChange: (event: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (period: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function GalleryFilters({
  searchTerm,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  periodFilter,
  onPeriodFilterChange,
  selectedCount,
  onDeleteSelected,
}: GalleryFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { events, isLoading: eventsLoading } = useEvents();
  const { categories, isLoading: categoriesLoading } = useGalleryCategories();
  const [periods, setPeriods] = useState<{ id: string; name: string }[]>([]);
  const [periodsLoading, setPeriodsLoading] = useState(false);

  // Fetch periods on component mount
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        setPeriodsLoading(true);
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
      } finally {
        setPeriodsLoading(false);
      }
    };

    fetchPeriods();
  }, []);

  const eventOptions = [
    { value: "all", label: "All Events" },
    ...events.map((event) => ({
      value: event.id,
      label: event.name,
    })),
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const periodOptions = [
    { value: "all", label: "All Period" },
    ...periods.map((period) => ({
      value: period.id,
      label: period.name,
    })),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Search gallery..."
          value={searchTerm}
          onChange={onSearchChange}
        />

        <FilterButton
          isOpen={isFilterOpen}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        />
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <SelectFilter
            label="Event"
            value={eventFilter}
            onChange={onEventFilterChange}
            options={eventOptions}
            disabled={eventsLoading}
          />
          <SelectFilter
            label="Category"
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            options={categoryOptions}
            disabled={categoriesLoading}
          />
          <SelectFilter
            label="Period"
            value={periodFilter}
            onChange={onPeriodFilterChange}
            options={periodOptions}
            disabled={periodsLoading}
          />
          <DeleteSelectedButton
            selectedCount={selectedCount}
            onClick={onDeleteSelected}
          />
        </div>
      )}
    </div>
  );
}
