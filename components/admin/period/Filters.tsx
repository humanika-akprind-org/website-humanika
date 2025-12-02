"use client";

import { useState } from "react";
import SearchInput from "../ui/input/SearchInput";
import FilterButton from "../ui/button/FilterButton";
import SelectFilter from "../ui/input/SelectFilter";
import DeleteSelectedButton from "../ui/button/DeleteSelectedButton";

interface PeriodFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function PeriodFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCount,
  onDeleteSelected,
}: PeriodFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Cari period..."
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
          <SelectFilter
            label="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={[
              { value: "all", label: "Semua Status" },
              { value: "ACTIVE", label: "Aktif" },
              { value: "INACTIVE", label: "Tidak Aktif" },
            ]}
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
