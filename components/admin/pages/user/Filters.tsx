import { useState } from "react";
import type { UserFilters as UserFiltersType } from "@/types/user";
import {
  userRoleOptions,
  departmentOptions,
  positionOptions,
} from "@/use-cases/api/user";
import SearchInput from "../../ui/input/SearchInput";
import FilterButton from "../../ui/button/FilterButton";
import SelectFilter from "../../ui/input/SelectFilter";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";

interface UserFiltersProps {
  filters: UserFiltersType;
  searchTerm: string;
  selectedUsers: string[];
  onFilterChange: (key: keyof UserFiltersType, value: string) => void;
  onSearchChange: (term: string) => void;
  onDeleteSelected: () => void;
}

export default function UserFilters({
  filters,
  searchTerm,
  selectedUsers,
  onFilterChange,
  onSearchChange,
  onDeleteSelected,
}: UserFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Search users by name, email or username..."
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
          <SelectFilter
            label="Status"
            value={filters.isActive}
            onChange={(value) => onFilterChange("isActive", value)}
            options={[
              { value: "all", label: "All Status" },
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />
          <DeleteSelectedButton
            selectedCount={selectedUsers.length}
            onClick={onDeleteSelected}
          />
        </div>
      )}
    </div>
  );
}
