import { useState } from "react";
import type { EventFilter } from "@/types/event";
import type { Department, Status } from "@/types/enums";
import { Department as DepartmentEnum, Status as StatusEnum } from "@/types/enums";

interface EventFiltersProps {
  onFilterChange: (filters: EventFilter) => void;
  initialFilters?: EventFilter;
}

export default function EventFilters({
  onFilterChange,
  initialFilters = {},
}: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFilter>(initialFilters);

  const handleFilterChange = (key: keyof EventFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Department */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={filters.department || ""}
            onChange={(e) =>
              handleFilterChange(
                "department",
                e.target.value ? (e.target.value as Department) : undefined
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {Object.values(DepartmentEnum).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) =>
              handleFilterChange(
                "status",
                e.target.value ? (e.target.value as Status) : undefined
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {Object.values(StatusEnum).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date From
          </label>
          <input
            type="date"
            value={
              filters.startDate
                ? filters.startDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              handleFilterChange(
                "startDate",
                e.target.value ? new Date(e.target.value) : undefined
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date To
          </label>
          <input
            type="date"
            value={
              filters.endDate
                ? filters.endDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              handleFilterChange(
                "endDate",
                e.target.value ? new Date(e.target.value) : undefined
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
