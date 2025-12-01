import {
  userRoleOptions,
  departmentOptions,
  positionOptions,
} from "@/use-cases/api/user";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import type { UserFilters } from "@/types/user";

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: UserFilters;
  onFilterChange: (key: keyof UserFilters, value: string) => void;
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
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Search unverified users by name, email or username..."
          value={searchTerm}
          onChange={onSearchChange}
        />

        <FilterButton isOpen={isFilterOpen} onClick={onToggleFilter} />
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <SelectFilter
            label="Role"
            value={filters.role}
            onChange={(value) => onFilterChange("role", value)}
            options={[{ value: "all", label: "All Roles" }, ...userRoleOptions]}
          />
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
            value={filters.position || "all"}
            onChange={(value) => onFilterChange("position", value)}
            options={[
              { value: "all", label: "All Positions" },
              ...positionOptions,
            ]}
          />
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
