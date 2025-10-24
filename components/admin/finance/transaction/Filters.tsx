"use client";

import { FiSearch, FiFilter, FiChevronDown, FiTrash2 } from "react-icons/fi";

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (value: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function Filters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  periodFilter,
  onPeriodFilterChange,
  isFilterOpen,
  setIsFilterOpen,
  selectedCount,
  onDeleteSelected,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari transaksi berdasarkan deskripsi atau kategori..."
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
              <option value="PENDING">Menunggu</option>
              <option value="APPROVED">Disetujui</option>
              <option value="REJECTED">Ditolak</option>
              <option value="ARCHIVED">Diarsipkan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
            >
              <option value="all">Semua Tipe</option>
              <option value="INCOME">Pendapatan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {/* Categories will be populated dynamically */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={periodFilter}
              onChange={(e) => onPeriodFilterChange(e.target.value)}
            >
              <option value="all">Semua Periode</option>
              {/* Periods will be populated dynamically */}
            </select>
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            {selectedCount} transaksi dipilih
          </span>
          <button
            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center"
            onClick={onDeleteSelected}
          >
            <FiTrash2 className="mr-2" />
            Hapus Terpilih ({selectedCount})
          </button>
        </div>
      )}
    </div>
  );
}
