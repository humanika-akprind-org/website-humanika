"use client";

import DeleteSelectedButton from "@/components/admin/ui/button/DeleteSelectedButton";
import SearchInput from "@/components/admin/ui/input/SearchInput";

interface OrganizationContactFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function OrganizationContactFilters({
  searchTerm,
  onSearchChange,
  selectedCount,
  onDeleteSelected,
}: OrganizationContactFiltersProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
          <SearchInput
            placeholder="Search by vision, email, or period..."
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        <DeleteSelectedButton
          selectedCount={selectedCount}
          onClick={onDeleteSelected}
        />
      </div>
    </div>
  );
}
