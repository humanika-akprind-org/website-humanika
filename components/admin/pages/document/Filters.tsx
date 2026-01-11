"use client";

import { useState } from "react";
import { DocumentType, Status, StatusApproval } from "@/types/enums";
import SearchInput from "../../ui/input/SearchInput";
import DeleteSelectedButton from "../../ui/button/DeleteSelectedButton";
import SelectFilter from "../../ui/input/SelectFilter";
import FilterButton from "../../ui/button/FilterButton";

interface DocumentFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  userFilter: string;
  onUserFilterChange: (user: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  showTypeFilter?: boolean;
  showApprovalStatusFilter?: boolean;
  approvalStatusFilter?: string;
  onApprovalStatusFilterChange?: (status: string) => void;
}

export default function DocumentFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  selectedCount,
  onDeleteSelected,
  showTypeFilter = true,
  showApprovalStatusFilter = false,
  approvalStatusFilter = "all",
  onApprovalStatusFilterChange = () => {},
}: DocumentFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Search document..."
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <SelectFilter
            label="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={[
              { value: "all", label: "All Status" },
              ...Object.values(Status).map((status) => ({
                value: status,
                label:
                  status.charAt(0).toUpperCase() +
                  status.slice(1).toLowerCase(),
              })),
            ]}
          />

          {showTypeFilter && (
            <SelectFilter
              label="Type"
              value={typeFilter}
              onChange={onTypeFilterChange}
              options={[
                { value: "all", label: "All Types" },
                ...Object.values(DocumentType).map((type) => ({
                  value: type,
                  label: type
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                })),
              ]}
            />
          )}

          {showApprovalStatusFilter && (
            <SelectFilter
              label="Approval Status"
              value={approvalStatusFilter}
              onChange={onApprovalStatusFilterChange}
              options={[
                { value: "all", label: "All Approval Status" },
                ...Object.values(StatusApproval).map((status) => ({
                  value: status,
                  label:
                    status.charAt(0).toUpperCase() +
                    status.slice(1).toLowerCase(),
                })),
              ]}
            />
          )}

          <div className="flex items-end">
            <DeleteSelectedButton
              selectedCount={selectedCount}
              onClick={onDeleteSelected}
            />
          </div>
        </div>
      )}
    </div>
  );
}
