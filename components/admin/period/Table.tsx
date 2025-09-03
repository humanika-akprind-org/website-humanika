"use client";

import { useRouter } from "next/navigation";
import type { Period } from "@/types/period";
import {
  FiEdit,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiFile,
} from "react-icons/fi";

interface PeriodTableProps {
  periods: Period[];
  selectedPeriods: string[];
  onSelectPeriod: (id: string) => void;
  onSelectAll: () => void;
  onDelete: (period?: Period) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function PeriodTable({
  periods,
  selectedPeriods,
  onSelectPeriod,
  onSelectAll,
  onDelete,
  onReorder,
  sortField,
  sortDirection,
  onSort,
}: PeriodTableProps) {
  const router = useRouter();

  const handleEditPeriod = (id: string) => {
    router.push(`/admin/governance/periods/edit/${id}`);
  };

  const getStatusClass = (isActive: boolean) =>
    isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  const getStatusText = (isActive: boolean) =>
    isActive ? "Aktif" : "Tidak Aktif";

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <FiArrowUp size={14} />
    ) : (
      <FiArrowDown size={14} />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
              >
                <input
                  type="checkbox"
                  checked={
                    periods.length > 0 &&
                    selectedPeriods.length === periods.length
                  }
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  Nama Period
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tahun
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort("createdAt")}
              >
                <div className="flex items-center">
                  Dibuat
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {periods.map((period, index) => (
              <tr
                key={period.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPeriods.includes(period.id)}
                    onChange={() => onSelectPeriod(period.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {period.name}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {period.startYear} - {period.endYear}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                      period.isActive
                    )}`}
                  >
                    {getStatusText(period.isActive)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(period.createdAt)}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => handleEditPeriod(period.id)}
                      title="Edit period"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => onDelete(period)}
                      title="Hapus period"
                    >
                      <FiTrash2 size={16} />
                    </button>
                    <div className="flex flex-col">
                      <button
                        className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                        onClick={() => onReorder(period.id, "up")}
                        disabled={index === 0}
                        title="Pindah ke atas"
                      >
                        <FiArrowUp size={12} />
                      </button>
                      <button
                        className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                        onClick={() => onReorder(period.id, "down")}
                        disabled={index === periods.length - 1}
                        title="Pindah ke bawah"
                      >
                        <FiArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {periods.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <FiFile size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            Tidak ada period ditemukan
          </p>
          <p className="text-gray-400 mt-1">
            Coba sesuaikan pencarian atau filter Anda
          </p>
        </div>
      )}

      {periods.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-700 mb-4 sm:mb-0">
            Menampilkan <span className="font-medium">{periods.length}</span>{" "}
            period
          </p>
        </div>
      )}
    </div>
  );
}
