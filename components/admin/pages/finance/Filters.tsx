"use client";

import { useState, useEffect } from "react";
import { Status, FinanceType } from "@/types/enums";
import { WorkApi } from "@/use-cases/api/work";
import { getFinanceCategories } from "@/use-cases/api/finance-category";
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
  selectedCount: number;
  onDeleteSelected: () => void;
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
  selectedCount,
  onDeleteSelected,
}: FinanceFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [workPrograms, setWorkPrograms] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingWorkPrograms, setLoadingWorkPrograms] = useState(true);
  const [errorWorkPrograms, setErrorWorkPrograms] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  // Fetch work programs on component mount
  useEffect(() => {
    const fetchWorkPrograms = async () => {
      try {
        setLoadingWorkPrograms(true);
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
      } finally {
        setLoadingWorkPrograms(false);
      }
    };

    fetchWorkPrograms();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoryData = await getFinanceCategories();
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
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
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

  const typeOptions = [
    { value: "all", label: "Semua Tipe" },
    ...Object.values(FinanceType).map((type) => ({
      value: type,
      label: type === FinanceType.INCOME ? "Pemasukan" : "Pengeluaran",
    })),
  ];

  const categoryOptions = [
    { value: "all", label: "Semua Kategori" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const workProgramOptions = [
    { value: "all", label: "Semua Program Kerja" },
    ...workPrograms.map((workProgram) => ({
      value: workProgram.id,
      label: workProgram.name,
    })),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Cari transaksi..."
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
            label="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={statusOptions}
          />
          <SelectFilter
            label="Tipe"
            value={typeFilter}
            onChange={onTypeFilterChange}
            options={typeOptions}
          />
          <div>
            <SelectFilter
              label="Kategori"
              value={categoryFilter}
              onChange={onCategoryFilterChange}
              options={categoryOptions}
            />
            {loadingCategories && (
              <p className="text-xs text-gray-500 mt-1">
                Loading categories...
              </p>
            )}
            {errorCategories && (
              <p className="text-xs text-red-500 mt-1">{errorCategories}</p>
            )}
          </div>
          <div>
            <SelectFilter
              label="Program Kerja"
              value={workProgramFilter}
              onChange={onWorkProgramFilterChange}
              options={workProgramOptions}
            />
            {loadingWorkPrograms && (
              <p className="text-xs text-gray-500 mt-1">Loading programs...</p>
            )}
            {errorWorkPrograms && (
              <p className="text-xs text-red-500 mt-1">{errorWorkPrograms}</p>
            )}
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <DeleteSelectedButton
            selectedCount={selectedCount}
            onClick={onDeleteSelected}
          />
        </div>
      )}
    </div>
  );
}
