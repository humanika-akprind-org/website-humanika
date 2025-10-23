"use client";

import { useState } from "react";
import { FiSearch, FiFilter, FiTrash2, FiChevronDown } from "react-icons/fi";
import { DocumentType, Status } from "@/types/enums";

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
}

export default function DocumentFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  userFilter,
  onUserFilterChange,
  selectedCount,
  onDeleteSelected,
}: DocumentFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari dokumen..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
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
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
            >
              <option value="all">All Types</option>
              {Object.values(DocumentType).map((type) => (
                <option key={type} value={type}>
                  {type
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userFilter}
              onChange={(e) => onUserFilterChange(e.target.value)}
            >
              <option value="all">All Users</option>
              {/* TODO: Add user options */}
            </select>
          </div>
          <div className="flex items-end md:col-span-3">
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
