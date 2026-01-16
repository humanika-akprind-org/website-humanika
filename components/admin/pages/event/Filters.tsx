"use client";

import { useState, useEffect } from "react";
import { Status } from "@/types/enums";
import { PeriodApi } from "@/use-cases/api/period";
import { useWorkPrograms } from "@/hooks/work-program/useWorkPrograms";
import { useEventCategories } from "@/hooks/event-category/useEventCategories";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

interface EventFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (period: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (department: string) => void;
  workProgramFilter: string;
  onWorkProgramFilterChange: (workProgram: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  canDelete?: () => boolean;
}

export default function EventFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  periodFilter,
  onPeriodFilterChange,
  workProgramFilter,
  onWorkProgramFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  selectedCount,
  onDeleteSelected,
  canDelete,
}: EventFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [periods, setPeriods] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch work programs
  const { workPrograms } = useWorkPrograms();

  // Fetch event categories
  const { categories: eventCategories } = useEventCategories();

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
        setError(null);
      } catch (err) {
        console.error("Error fetching periods:", err);
        setError("Failed to load periods");
        // Fallback to static periods
        setPeriods([
          { id: "fallback-2024", name: "2024" },
          { id: "fallback-2023", name: "2023" },
          { id: "fallback-2022", name: "2022" },
        ]);
      }
    };

    fetchPeriods();
  }, []);

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    ...Object.values(Status).map((status) => ({
      value: status,
      label:
        status.toString().charAt(0).toUpperCase() +
        status.toString().slice(1).toLowerCase(),
    })),
  ];

  const periodOptions = [
    { value: "all", label: "Semua Period" },
    ...periods.map((period) => ({
      value: period.id,
      label: period.name,
    })),
  ];

  const workProgramOptions = [
    { value: "all", label: "Semua Work Program" },
    ...workPrograms.map((workProgram) => ({
      value: workProgram.id,
      label: workProgram.name,
    })),
  ];

  const categoryOptions = [
    { value: "all", label: "Semua Category" },
    ...eventCategories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Cari event..."
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
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={statusOptions}
          />
          <div>
            <SelectFilter
              label="Period"
              value={periodFilter}
              onChange={onPeriodFilterChange}
              options={periodOptions}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <SelectFilter
              label="Category"
              value={categoryFilter}
              onChange={onCategoryFilterChange}
              options={categoryOptions}
            />
          </div>
          <div>
            <SelectFilter
              label="Work Program"
              value={workProgramFilter}
              onChange={onWorkProgramFilterChange}
              options={workProgramOptions}
            />
          </div>
          {canDelete && canDelete() && (
            <DeleteSelectedButton
              selectedCount={selectedCount}
              onClick={onDeleteSelected}
            />
          )}
        </div>
      )}
    </div>
  );
}
