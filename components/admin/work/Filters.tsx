import { FiSearch, FiFilter, FiChevronDown, FiTrash2 } from "react-icons/fi";
import { Department, Status } from "@/types/enums";

interface WorkFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: Status | "all";
  setStatusFilter: (value: Status | "all") => void;
  departmentFilter: Department | "all";
  setDepartmentFilter: (value: Department | "all") => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  isActiveFilter: "all" | "active" | "inactive";
  setIsActiveFilter: (value: "all" | "active" | "inactive") => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  periods: string[];
  selectedPrograms: string[];
  handleDelete: () => void;
}

export default function WorkFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  periodFilter,
  setPeriodFilter,
  isActiveFilter,
  setIsActiveFilter,
  isFilterOpen,
  setIsFilterOpen,
  periods,
  selectedPrograms,
  handleDelete,
}: WorkFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search work programs by name or goal..."
            className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Status | "all")
              }
            >
              <option value="all">All Status</option>
              {Object.values(Status).map((status) => (
                <option key={status} value={status}>
                  {status}
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
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value as Department | "all")
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value="all">All Periods</option>
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period Status
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={isActiveFilter}
              onChange={(e) =>
                setIsActiveFilter(e.target.value as "all" | "active" | "inactive")
              }
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                selectedPrograms.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
              onClick={handleDelete}
              disabled={selectedPrograms.length === 0}
            >
              <FiTrash2 className="mr-2" />
              Delete Selected ({selectedPrograms.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
