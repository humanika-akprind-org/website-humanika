"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiTrash2, FiChevronDown } from "react-icons/fi";
import { Department, Status } from "@/types/enums";
import { PeriodApi } from "@/use-cases/api/period";

interface EventFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (period: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (department: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function EventFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  periodFilter,
  onPeriodFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  selectedCount,
  onDeleteSelected,
}: EventFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [periods, setPeriods] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch periods on component mount
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchPeriods();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari event..."
            className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FiFilter className="mr-2 text-gray-500" />
          Filter
          <FiChevronDown
            className={`ml-2 transition-transform ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="all">Semua Status</option>
              {Object.values(Status).map((status) => (
                <option key={status} value={status}>
                  {status.toString().charAt(0).toUpperCase() +
                    status.toString().slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={periodFilter}
              onChange={(e) => onPeriodFilterChange(e.target.value)}
              disabled={loading}
            >
              <option value="all">Semua Period</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
            {loading && (
              <p className="text-xs text-gray-500 mt-1">Loading periods...</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={departmentFilter}
              onChange={(e) =>
                onDepartmentFilterChange(e.target.value as Department | "all")
              }
            >
              <option value="all">All Departments</option>
              {Object.values(Department).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                selectedCount === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
            >
              <FiTrash2 className="mr-2" />
              Hapus Terpilih ({selectedCount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
