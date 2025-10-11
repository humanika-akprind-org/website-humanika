"use client";

import { useState } from "react";
import Link from "next/link";
import { FiTag } from "react-icons/fi";
import type { FinanceCategory } from "@/types/finance-category";
import { FinanceType } from "@/types/enums";
import FinanceCategoryStats from "./Stats";
import FinanceCategoryFilters from "./Filters";
import DeleteModal from "./modal/DeleteModal";

interface FinanceCategoryTableProps {
  categories: FinanceCategory[];
  onDelete: (id: string) => void;
}

export default function FinanceCategoryTable({
  categories,
  onDelete,
}: FinanceCategoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<FinanceType | "all">("all");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<FinanceCategory | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const handleTypeFilterChange = (type: string) =>
    (type === "all" ||
      Object.values(FinanceType).includes(type as FinanceType)) &&
    setTypeFilter(type as FinanceType | "all");

  const handleIsActiveFilterChange = (isActive: string) =>
    setIsActiveFilter(isActive);

  const getTypeColor = (type: FinanceType) => {
    switch (type) {
      case FinanceType.INCOME:
        return "bg-green-100 text-green-800";
      case FinanceType.EXPENSE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (category: FinanceCategory) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      selectedCategories.forEach((id) => onDelete(id));
      setSelectedCategories([]);
    } else if (categoryToDelete) {
      onDelete(categoryToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
    setIsBulkDelete(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
    setIsBulkDelete(false);
  };

  // Filter categories based on search term and filters
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || category.type === typeFilter;

    const matchesIsActive =
      isActiveFilter === "all" ||
      (isActiveFilter === "true" && category.isActive) ||
      (isActiveFilter === "false" && !category.isActive);

    return matchesSearch && matchesType && matchesIsActive;
  });

  // Toggle category selection
  const toggleCategorySelection = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedCategories.length === 0) return;

    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <FiTag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No categories found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first finance category.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl">
      <FinanceCategoryStats categories={filteredCategories} />

      <FinanceCategoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        isActiveFilter={isActiveFilter}
        onIsActiveFilterChange={handleIsActiveFilterChange}
        selectedCount={selectedCategories.length}
        onDeleteSelected={handleBulkDelete}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredCategories.length} of {categories.length}{" "}
            categories
          </p>
        </div>

        {selectedCategories.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedCategories.length} categor
              {selectedCategories.length > 1 ? "ies" : "y"} selected
            </span>
          </div>
        )}
      </div>

      {/* Categories Table */}
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
                      filteredCategories.length > 0 &&
                      selectedCategories.length === filteredCategories.length
                    }
                    onChange={() => {
                      if (
                        selectedCategories.length === filteredCategories.length
                      ) {
                        setSelectedCategories([]);
                      } else {
                        setSelectedCategories(
                          filteredCategories.map((category) => category.id)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: "300px", minWidth: "300px" }}
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transactions
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategorySelection(category.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td
                      className="px-4 py-4"
                      style={{ width: "300px", minWidth: "300px" }}
                    >
                      <div className="text-sm text-gray-600 break-words">
                        {category.description || "No description"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(
                          category.type
                        )}`}
                      >
                        {category.type === FinanceType.INCOME
                          ? "Pemasukan"
                          : "Pengeluaran"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category._count?.finances || 0}
                    </td>
                    <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/finance/transactions/categories/edit/${category.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit category"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(category)}
                          title="Delete category"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FiTag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No categories found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {categories.length === 0
                        ? "Get started by creating your first category."
                        : "No categories match the selected filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredCategories.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredCategories.length}</span>{" "}
              of <span className="font-medium">{categories.length}</span>{" "}
              categories
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        categoryName={categoryToDelete?.name || ""}
        count={isBulkDelete ? selectedCategories.length : 1}
        isLoading={false}
      />
    </div>
  );
}