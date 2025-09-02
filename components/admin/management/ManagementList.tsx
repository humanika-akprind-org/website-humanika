"use client";

import React, { useState } from "react";
import type { Management } from "@/types/management";
import { Department } from "@/types/enums";
import { managementAPI } from "@/lib/api/management";
// import Image from "next/image";

interface ManagementListProps {
  managements: Management[];
  onEdit: (management: Management) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const ManagementList: React.FC<ManagementListProps> = ({
  managements,
  onEdit,
  onDelete,
  onView,
}) => {
  const [selectedManagements, setSelectedManagements] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | Department>("all");
  const [sortField, setSortField] = useState<
    "name" | "department" | "position" | "createdAt"
  >("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const toggleSelection = (id: string) => {
    setSelectedManagements((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedManagements((prev) =>
      prev.length === managements.length ? [] : managements.map((m) => m.id)
    );
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredManagements = managements.filter(
    (management) => filter === "all" || management.department === filter
  );

  const sortedManagements = [...filteredManagements].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case "name":
        aValue = a.user.name;
        bValue = b.user.name;
        break;
      case "department":
        aValue = a.department;
        bValue = b.department;
        break;
      case "position":
        aValue = a.position;
        bValue = b.position;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

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



  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filter Controls */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          {Object.values(Department).map((dept) => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === dept
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {managementAPI.formatEnumValue(dept)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked={selectedManagements.length === managements.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("department")}
              >
                Department
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("position")}
              >
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedManagements.map((management) => (
              <tr key={management.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedManagements.includes(management.id)}
                    onChange={() => toggleSelection(management.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {management.photo ? (
                      <img
                        src={management.photo}
                        alt={management.user.name}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium mr-3"
                        style={{ backgroundColor: management.user.avatarColor }}
                      >
                        {management.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {management.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {management.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentClass(
                      management.department
                    )}`}
                  >
                    {managementAPI.formatEnumValue(management.department)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {managementAPI.formatEnumValue(management.position)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {management.period.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(management.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(management.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(management)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(management.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
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
          <div className="text-gray-400 text-lg">No managements found</div>
          <p className="text-gray-500 mt-2">
            Create your first management position to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManagementList;
