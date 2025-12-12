"use client";

import { useState } from "react";
import { useEvents } from "@/hooks/event/useEvents";
import SearchInput from "../ui/input/SearchInput";
import FilterButton from "../ui/button/FilterButton";
import SelectFilter from "../ui/input/SelectFilter";
import DeleteSelectedButton from "../ui/button/DeleteSelectedButton";

interface GalleryFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  eventFilter: string;
  onEventFilterChange: (event: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function GalleryFilters({
  searchTerm,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  selectedCount,
  onDeleteSelected,
}: GalleryFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { events, isLoading } = useEvents();

  const eventOptions = [
    { value: "all", label: "Semua Event" },
    ...events.map((event) => ({
      value: event.id,
      label: event.name,
    })),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Cari judul gallery atau event..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <SelectFilter
              label="Event"
              value={eventFilter}
              onChange={onEventFilterChange}
              options={eventOptions}
            />
            {isLoading && (
              <p className="text-xs text-gray-500 mt-1">Loading events...</p>
            )}
          </div>
          <DeleteSelectedButton
            selectedCount={selectedCount}
            onClick={onDeleteSelected}
          />
        </div>
      )}
    </div>
  );
}
