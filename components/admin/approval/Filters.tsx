"use client";

import { useState } from "react";
import SearchInput from "../ui/input/SearchInput";
import FilterButton from "../ui/button/FilterButton";
import SelectFilter from "../ui/input/SelectFilter";
import BulkApprovalActions from "./BulkApprovalActions";

interface ApprovalFiltersProps {
  filters: Record<string, string>;
  searchTerm: string;
  selectedApprovals: string[];
  selectedApprovalData: Array<{ id: string; status: string }>;
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (term: string) => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkRequestRevision: () => void;
  onBulkReturn: () => void;
}

const approvalStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function ApprovalFilters({
  filters,
  searchTerm,
  selectedApprovals,
  selectedApprovalData,
  onFilterChange,
  onSearchChange,
  onBulkApprove,
  onBulkReject,
  onBulkRequestRevision,
  onBulkReturn,
}: ApprovalFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Check status conditions
  const allPending = selectedApprovalData.every(
    (approval) => approval.status === "PENDING"
  );
  const allNotPending = selectedApprovalData.every(
    (approval) => approval.status !== "PENDING"
  );
  const isMixed = !allPending && !allNotPending;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <SearchInput
          placeholder="Cari approval..."
          value={searchTerm}
          onChange={onSearchChange}
        />

        <FilterButton
          isOpen={isFilterOpen}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        />
      </div>
      {/* Combined Filters and Bulk Actions - Responsive Left and Right */}
      {isFilterOpen && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Advanced Filters */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                <SelectFilter
                  label="Status"
                  value={filters.status || "all"}
                  onChange={(value) => onFilterChange("status", value)}
                  options={[
                    { value: "all", label: "Semua Status" },
                    ...approvalStatusOptions,
                  ]}
                />
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex justify-end items-end">
              <BulkApprovalActions
                selectedCount={selectedApprovals.length}
                disabledApprove={isMixed || !allPending}
                disabledReject={isMixed || !allPending}
                disabledRevision={isMixed || !allPending}
                disabledReturn={isMixed || allPending}
                onBulkApprove={onBulkApprove}
                onBulkReject={onBulkReject}
                onBulkRequestRevision={onBulkRequestRevision}
                onBulkReturn={onBulkReturn}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
