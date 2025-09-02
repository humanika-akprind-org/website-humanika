// @/components/admin/management/ManagementTable.tsx
"use client";

import { useState } from "react";
import type { Management } from "@/types/management";
import { Department, Position } from "@/types/enums";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import Image from "next/image";

interface ManagementTableProps {
  managements: Management[];
  onEdit: (management: Management) => void;
  onDelete: (management: Management) => void;
  onView: (management: Management) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export const ManagementTable: React.FC<ManagementTableProps> = ({
  managements,
  onEdit,
  onDelete,
  onView,
  onAdd,
  isLoading = false,
}) => {
  const [selectedManagements, setSelectedManagements] = useState<string[]>([]);

  const toggleManagementSelection = (id: string) => {
    if (selectedManagements.includes(id)) {
      setSelectedManagements(
        selectedManagements.filter((managementId) => managementId !== id)
      );
    } else {
      setSelectedManagements([...selectedManagements, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedManagements.length === managements.length) {
      setSelectedManagements([]);
    } else {
      setSelectedManagements(managements.map((management) => management.id));
    }
  };

  const getDepartmentClass = (department: Department) => {
    switch (department) {
      case Department.INFOKOM:
        return "bg-blue-100 text-blue-800";
      case Department.PSDM:
        return "bg-green-100 text-green-800";
      case Department.LITBANG:
        return "bg-purple-100 text-purple-800";
      case Department.KWU:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPositionDisplayName = (position: Position) => {
    switch (position) {
      case Position.KETUA_UMUM:
        return "Ketua Umum";
      case Position.WAKIL_KETUA_UMUM:
        return "Wakil Ketua Umum";
      case Position.SEKRETARIS:
        return "Sekretaris";
      case Position.BENDAHARA:
        return "Bendahara";
      case Position.KEPALA_DEPARTEMEN:
        return "Kepala Departemen";
      case Position.STAFF_DEPARTEMEN:
        return "Staff Departemen";
      default:
        return position;
    }
  };

  const getDepartmentDisplayName = (department: Department) => {
    switch (department) {
      case Department.INFOKOM:
        return "INFOKOM";
      case Department.PSDM:
        return "PSDM";
      case Department.LITBANG:
        return "LITBANG";
      case Department.KWU:
        return "KWU";
      default:
        return department;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"/>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-t border-gray-200">
              <div className="h-full flex items-center px-6">
                <div className="h-4 bg-gray-200 rounded w-3/4"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                    managements.length > 0 &&
                    selectedManagements.length === managements.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Departemen
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Posisi
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Periode
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Dibuat
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
            {managements.map((management) => (
              <tr
                key={management.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedManagements.includes(management.id)}
                    onChange={() => toggleManagementSelection(management.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    {management.photo && (
                      <Image
                        src={management.photo}
                        alt={management.user.name}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {management.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {management.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getDepartmentClass(
                      management.department
                    )}`}
                  >
                    {getDepartmentDisplayName(management.department)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getPositionDisplayName(management.position)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {management.period.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(management.createdAt)}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => onView(management)}
                      title="Lihat detail"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => onEdit(management)}
                      title="Edit management"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => onDelete(management)}
                      title="Hapus management"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {managements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <FiPlus size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            Tidak ada data management
          </p>
          <p className="text-gray-400 mt-1">
            Klik tombol &quot;Tambah Management&quot; untuk menambahkan data
            baru
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={onAdd}
          >
            Tambah Management
          </button>
        </div>
      )}
    </div>
  );
};
