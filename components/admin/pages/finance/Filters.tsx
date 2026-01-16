"use client";

import { useState, useEffect } from "react";
import { Status, FinanceType } from "@/types/enums";
import { WorkApi } from "@/use-cases/api/work";
import { getFinanceCategories } from "@/use-cases/api/finance-category";
import { PeriodApi } from "@/use-cases/api/period";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

interface FinanceFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  workProgramFilter: string;
  onWorkProgramFilterChange: (workProgram: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (period: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  canDelete?: () => boolean;
}

export default function FinanceFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  workProgramFilter,
  onWorkProgramFilterChange,
  periodFilter,
  onPeriodFilterChange,
  selectedCount,
  onDeleteSelected,
  canDelete,
}: FinanceFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [workPrograms, setWorkPrograms] = useState<
    { id: string; name: string }[]
  >([]);
  const [errorWorkPrograms, setErrorWorkPrograms] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
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

  // Fetch work programs on component mount
  useEffect(() => {
    const fetchWorkPrograms = async () => {
      try {
        const workProgramData = await WorkApi.getWorkPrograms();
        const workProgramOptions = workProgramData.map((workProgram) => ({
          id: workProgram.id,
          name: workProgram.name,
        }));
        setWorkPrograms(workProgramOptions);
        setErrorWorkPrograms(null);
      } catch (err) {
        console.error("Error fetching work programs:", err);
        setErrorWorkPrograms("Failed to load work programs");
        // Fallback to static work programs
        setWorkPrograms([
          { id: "fallback-2024", name: "2024" },
          { id: "fallback-2023", name: "2023" },
          { id: "fallback-2022", name: "2022" },
        ]);
      }
    };

    fetchWorkPrograms();
  }, []);

  // Fetch categories on component mount and when typeFilter changes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const filter =
          typeFilter !== "all"
            ? { type: typeFilter as FinanceType }
            : undefined;
        const categoryData = await getFinanceCategories(filter);
        const categoryOptions = categoryData.map((category) => ({
          id: category.id,
          name: category.name,
        }));
        setCategories(categoryOptions);
        setErrorCategories(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setErrorCategories("Failed to load categories");
        // Fallback to empty categories
        setCategories([]);
      }
    };

    fetchCategories();
  }, [typeFilter]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    ...Object.values(Status).map((status) => ({
      value: status,
      label:
        status.toString().charAt(0).toUpperCase() +
        status.toString().slice(1).toLowerCase(),
    })),
  ];

  const typeOptions = [
    { value: "all", label: "All Type" },
    ...Object.values(FinanceType).map((type) => ({
      value: type,
      label: type === FinanceType.INCOME ? "Income" : "Expense",
    })),
  ];

  const categoryOptions = [
    { value: "all", label: "All Category" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const workProgramOptions = [
    { value: "all", label: "All Work Program" },
    ...workPrograms.map((workProgram) => ({
      value: workProgram.id,
      label: workProgram.name,
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
          placeholder="Search transaction..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-100">
          <SelectFilter
            label="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={statusOptions}
          />
          <SelectFilter
            label="Type"
            value={typeFilter}
            onChange={onTypeFilterChange}
            options={typeOptions}
          />
          <div>
            <SelectFilter
              label="Category"
              value={categoryFilter}
              onChange={onCategoryFilterChange}
              options={categoryOptions}
            />
            {errorCategories && (
              <p className="text-xs text-red-500 mt-1">{errorCategories}</p>
            )}
          </div>
          <div>
            <SelectFilter
              label="Work Program"
              value={workProgramFilter}
              onChange={onWorkProgramFilterChange}
              options={workProgramOptions}
            />
            {errorWorkPrograms && (
              <p className="text-xs text-red-500 mt-1">{errorWorkPrograms}</p>
            )}
          </div>
          <div>
            <SelectFilter
              label="Period"
              value={periodFilter}
              onChange={onPeriodFilterChange}
              options={periodOptions}
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
