"use client";

import { useState, useEffect } from "react";
import { Department, Position } from "@/types/enums";
import type { Period } from "@/types/period";
import { getPeriods } from "@/use-cases/api/period";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

type ManagementFiltersType = {
  department: string;
  position: string;
  periodId: string;
};

interface ManagementFiltersProps {
  filters: ManagementFiltersType;
  searchTerm: string;
  selectedManagements: string[];
  onFilterChange: (key: keyof ManagementFiltersType, value: string) => void;
  onSearchChange: (term: string) => void;
  onDeleteSelected: () => void;
  canDelete?: () => boolean;
}

// Helper function to format enum values for display
const formatEnumValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

// Get all enum values as options for select inputs
const departmentOptions = Object.values(Department).map((dept) => ({
  value: dept,
  label: formatEnumValue(dept),
}));

const positionOptions = Object.values(Position).map((position) => ({
  value: position as string,
  label: formatEnumValue(position as string),
}));

export default function ManagementFilters({
  filters,
  searchTerm,
  selectedManagements,
  onFilterChange,
  onSearchChange,
  onDeleteSelected,
  canDelete,
}: ManagementFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [periods, setPeriods] = useState<Period[]>([]);

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
          placeholder="Search managements by name, department or position..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <SelectFilter
            label="Department"
            value={filters.department}
            onChange={(value) => onFilterChange("department", value)}
            options={[
              { value: "all", label: "All Departments" },
              ...departmentOptions,
            ]}
          />
          <SelectFilter
            label="Position"
            value={filters.position}
            onChange={(value) => onFilterChange("position", value)}
            options={[
              { value: "all", label: "All Positions" },
              ...positionOptions,
            ]}
          />
          <SelectFilter
            label="Period"
            value={filters.periodId}
            onChange={(value) => onFilterChange("periodId", value)}
            options={[{ value: "all", label: "All Periods" }, ...periodOptions]}
          />
          {canDelete && canDelete() && (
            <DeleteSelectedButton
              selectedCount={selectedManagements.length}
              onClick={onDeleteSelected}
            />
          )}
        </div>
      )}
    </div>
  );
}
