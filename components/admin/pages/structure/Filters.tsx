"use client";

import { useState, useEffect } from "react";
import { Status } from "@/types/enums";
import { getPeriods } from "@/use-cases/api/period";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

type StructureFiltersType = {
  status: string;
  periodId: string;
};

interface StructureFiltersProps {
  filters: StructureFiltersType;
  searchTerm: string;
  selectedCount: number;
  onFilterChange: (key: keyof StructureFiltersType, value: string) => void;
  onSearchChange: (term: string) => void;
  onDeleteSelected: () => void;
}

// Helper function to format enum values for display
const formatEnumValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

// Get all enum values as options for select inputs
const statusOptions = Object.values(Status).map((status) => ({
  value: status,
  label: formatEnumValue(status),
}));

export default function StructureFilters({
  filters,
  searchTerm,
  selectedCount,
  onFilterChange,
  onSearchChange,
  onDeleteSelected,
}: StructureFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [periods, setPeriods] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const loadPeriods = async () => {
      try {
        const data = await getPeriods();
        setPeriods(data);
      } catch (error) {
        console.error("Failed to load periods:", error);
      }
    };

    loadPeriods();
  }, []);

  const periodOptions = periods.map((period) => ({
    value: period.id,
    label: period.name,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Cari struktur organisasi..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <SelectFilter
            label="Status"
            value={filters.status}
            onChange={(value) => onFilterChange("status", value)}
            options={[{ value: "all", label: "All Status" }, ...statusOptions]}
          />
          <SelectFilter
            label="Period"
            value={filters.periodId}
            onChange={(value) => onFilterChange("periodId", value)}
            options={[{ value: "all", label: "All Periods" }, ...periodOptions]}
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
