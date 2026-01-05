"use client";

import { useState } from "react";
import { taskStatusOptions, taskDepartmentOptions } from "@/use-cases/api/task";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

interface TaskFiltersProps {
  filters: Record<string, string>;
  searchTerm: string;
  selectedTasks: string[];
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (term: string) => void;
  onDeleteSelected: () => void;
}

export default function TaskFilters({
  filters,
  searchTerm,
  selectedTasks,
  onFilterChange,
  onSearchChange,
  onDeleteSelected,
}: TaskFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Cari task..."
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
            value={filters.status || "all"}
            onChange={(value) => onFilterChange("status", value)}
            options={[
              { value: "all", label: "Semua Status" },
              ...taskStatusOptions,
            ]}
          />
          <SelectFilter
            label="Department"
            value={filters.department || "all"}
            onChange={(value) => onFilterChange("department", value)}
            options={[
              { value: "all", label: "Semua Department" },
              ...taskDepartmentOptions,
            ]}
          />
          <DeleteSelectedButton
            selectedCount={selectedTasks.length}
            onClick={onDeleteSelected}
          />
        </div>
      )}
    </div>
  );
}
