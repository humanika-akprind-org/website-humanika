"use client";

import { Department, Status } from "@/types/enums";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";
import { useEffect, useState } from "react";
import { type Period } from "@prisma/client";
import { getPeriods } from "@/use-cases/api/period";

interface WorkFiltersProps {
  filters: Record<string, string>;
  searchTerm: string;
  selectedPrograms: string[];
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
  onDeleteSelected: () => void;
}

export default function WorkFilters({
  filters,
  searchTerm,
  selectedPrograms,
  onFilterChange,
  onSearchChange,
  onDeleteSelected,
}: WorkFiltersProps) {
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
  const workStatusOptions = Object.values(Status).map((status) => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase(),
  }));

  const workDepartmentOptions = Object.values(Department).map((dept) => ({
    value: dept,
    label: dept.charAt(0) + dept.slice(1).toLowerCase(),
  }));

  const periodOptions = periods.map((period: Period) => ({
    value: period.id,
    label: period.name,
  }));

  const activeStatusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Search work programs by name or goal..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
          <SelectFilter
            label="Status"
            value={filters.status || "all"}
            onChange={(value) => onFilterChange("status", value)}
            options={[
              { value: "all", label: "All Status" },
              ...workStatusOptions,
            ]}
          />
          <SelectFilter
            label="Department"
            value={filters.department || "all"}
            onChange={(value) => onFilterChange("department", value)}
            options={[
              { value: "all", label: "All Departments" },
              ...workDepartmentOptions,
            ]}
          />
          <SelectFilter
            label="Period"
            value={filters.period || "all"}
            onChange={(value) => onFilterChange("period", value)}
            options={[{ value: "all", label: "All Periods" }, ...periodOptions]}
          />
          <SelectFilter
            label="Period Status"
            value={filters.isActive || "all"}
            onChange={(value) => onFilterChange("isActive", value)}
            options={activeStatusOptions}
          />
          <DeleteSelectedButton
            selectedCount={selectedPrograms.length}
            onClick={onDeleteSelected}
          />
        </div>
      )}
    </div>
  );
}
