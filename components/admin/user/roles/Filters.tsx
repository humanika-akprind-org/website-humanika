import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";
import type { UserRole, Department } from "@/types/enums";

type FilterType = {
  role: UserRole | "";
  department: Department | "";
};

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterType;
  onFilterChange: (key: keyof FilterType, value: string) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  onClearFilters: () => void;
}

export default function Filters({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  isFilterOpen,
  onToggleFilter,
  onClearFilters,
}: FiltersProps) {
  const userRoleOptions = [
    { value: "DPO", label: "DPO" },
    { value: "BPH", label: "BPH" },
    { value: "PENGURUS", label: "Pengurus" },
    { value: "ANGGOTA", label: "Anggota" },
  ];

  const departmentOptions = [
    { value: "INFOKOM", label: "Infokom" },
    { value: "PSDM", label: "PSDM" },
    { value: "LITBANG", label: "Litbang" },
    { value: "KWU", label: "KWU" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search unverified users by name, email or username..."
            className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          onClick={onToggleFilter}
        >
          <FiFilter className="mr-2 text-gray-500" />
          Filters
          <FiChevronDown
            className={`ml-2 transition-transform ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.role}
              onChange={(e) => onFilterChange("role", e.target.value)}
            >
              <option value="">All Roles</option>
              {userRoleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.department}
              onChange={(e) =>
                onFilterChange("department", e.target.value)
              }
            >
              <option value="">All Departments</option>
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="px-4 py-2.5 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full"
              onClick={onClearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
