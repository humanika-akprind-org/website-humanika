"use client";

import { useRef, useState } from "react";
import { FiEdit, FiTrash, FiTag, FiEye } from "react-icons/fi";
import type { FinanceCategory } from "@/types/finance-category";
import { FinanceType } from "@/types/enums";
import Checkbox from "../../../ui/checkbox/Checkbox";
import DropdownMenu, {
  DropdownMenuItem,
} from "../../../ui/dropdown/DropdownMenu";
import EmptyState from "../../../ui/EmptyState";
import AddButton from "../../../ui/button/AddButton";
import SortIcon from "../../../ui/SortIcon";
import Pagination from "../../../ui/pagination/Pagination";

interface FinanceCategoryTableProps {
  categories: FinanceCategory[];
  selectedCategories: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onCategorySelect: (id: string) => void;
  onSelectAll: () => void;
  onViewCategory: (category: FinanceCategory) => void;
  onEditCategory: (id: string) => void;
  onDeleteCategory: (category?: FinanceCategory) => void;
  onPageChange: (page: number) => void;
  onAddCategory: () => void;
}

const FinanceCategoryTable: React.FC<FinanceCategoryTableProps> = ({
  categories,
  selectedCategories,
  loading,
  currentPage,
  totalPages,
  onCategorySelect,
  onSelectAll,
  onViewCategory,
  onEditCategory,
  onDeleteCategory,
  onPageChange,
  onAddCategory,
}) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort categories
  const sortedCategories = [...categories].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "description":
        aValue = a.description?.toLowerCase() || "";
        bValue = b.description?.toLowerCase() || "";
        break;
      case "type":
        aValue = a.type;
        bValue = b.type;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const handleSelectAll = () => {
    onSelectAll();
  };

  const handleCategorySelect = (id: string) => {
    onCategorySelect(id);
  };

  const handleEditCategory = (id: string) => {
    onEditCategory(id);
  };

  const handleAddCategory = () => {
    onAddCategory();
  };

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

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
              >
                <Checkbox
                  checked={
                    sortedCategories.length > 0 &&
                    selectedCategories.length === sortedCategories.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Category Name
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="name"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center">
                  Description
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="description"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center">
                  Type
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="type"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Created
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="createdAt"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center">
                  Updated
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="updatedAt"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCategories.map((category, index) => (
              <tr
                key={category.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategorySelect(category.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {category.description || "-"}
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
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(category.createdAt))}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(category.updatedAt))}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedCategories.length - 1}
                    hasMultipleItems={sortedCategories.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewCategory(category)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditCategory(category.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteCategory(category)}
                      color="red"
                    >
                      <FiTrash className="mr-2" size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedCategories.length === 0 && !loading && (
        <EmptyState
          icon={<FiTag size={48} className="mx-auto" />}
          title="No categories found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            <AddButton onClick={handleAddCategory} text="Add Category" />
          }
        />
      )}

      {sortedCategories.length > 0 && (
        <Pagination
          usersLength={sortedCategories.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default FinanceCategoryTable;
