"use client";

import { useRef, useState } from "react";
import {
  FiEdit,
  FiTrash,
  FiEye,
  FiDownload,
  FiDollarSign,
} from "react-icons/fi";
import type { Finance } from "@/types/finance";
import Checkbox from "../ui/checkbox/Checkbox";
import DropdownMenu, { DropdownMenuItem } from "../ui/dropdown/DropdownMenu";
import EmptyState from "../ui/EmptyState";
import AddButton from "../ui/button/AddButton";
import SortIcon from "../ui/SortIcon";
import Pagination from "../ui/pagination/Pagination";
import StatusChip from "../ui/chip/Status";
import StatusApproval from "../ui/chip/StatusApproval";

interface FinanceTableProps {
  finances: Finance[];
  selectedFinances: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onFinanceSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewFinance: (finance: Finance) => void;
  onEditFinance: (id: string) => void;
  onDeleteFinance: (finance?: Finance) => void;
  onPageChange: (page: number) => void;
  onAddFinance: () => void;
}

const FinanceTable: React.FC<FinanceTableProps> = ({
  finances,
  selectedFinances,
  loading,
  currentPage,
  totalPages,
  onFinanceSelect,
  onSelectAll,
  onViewFinance,
  onEditFinance,
  onDeleteFinance,
  onPageChange,
  onAddFinance,
}) => {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sort finances
  const sortedFinances = [...finances].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "description":
        aValue = a.description.toLowerCase();
        bValue = b.description.toLowerCase();
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "date":
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      default:
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
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

  const handleFinanceSelect = (id: string) => {
    onFinanceSelect(id);
  };

  const handleEditFinance = (id: string) => {
    onEditFinance(id);
  };

  const handleAddFinance = () => {
    onAddFinance();
  };

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

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
                    sortedFinances.length > 0 &&
                    selectedFinances.length === sortedFinances.length
                  }
                  onChange={handleSelectAll}
                />
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="amount"
                    iconType="arrow"
                  />
                </div>
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
                Proof
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="date"
                    iconType="arrow"
                  />
                </div>
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
                Approval
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFinances.map((finance, index) => (
              <tr
                key={finance.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedFinances.includes(finance.id)}
                    onChange={() => handleFinanceSelect(finance.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {finance.description}
                  </div>
                  {finance.event && (
                    <div className="text-xs text-gray-500 mt-1">
                      Event: {finance.event.name}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {finance.category?.name || "No category"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-medium ${
                      finance.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(finance.amount)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      finance.type === "INCOME"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {finance.type === "INCOME" ? "Income" : "Expense"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {finance.proof ? (
                      <>
                        <FiDownload className="text-gray-400" size={16} />
                        <span className="ml-2 text-sm text-gray-600">
                          Proof
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">No proof</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(finance.date))}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusChip status={finance.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusApproval
                    status={
                      finance.approvals && finance.approvals.length > 0
                        ? finance.approvals.sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )[0].status
                        : "PENDING"
                    }
                  />
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedFinances.length - 1}
                    hasMultipleItems={sortedFinances.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewFinance(finance)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditFinance(finance.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteFinance(finance)}
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

      {sortedFinances.length === 0 && !loading && (
        <EmptyState
          icon={<FiDollarSign size={48} className="mx-auto" />}
          title="No finances found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            <AddButton onClick={handleAddFinance} text="Add Finance" />
          }
        />
      )}

      {sortedFinances.length > 0 && (
        <Pagination
          usersLength={sortedFinances.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default FinanceTable;
