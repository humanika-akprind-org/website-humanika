"use client";

import { useRef, useState } from "react";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { Landmark } from "lucide-react";
import type { OrganizationContact } from "@/types/organization-contact";
import Checkbox from "../../ui/checkbox/Checkbox";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import EmptyState from "../../ui/EmptyState";
import AddButton from "../../ui/button/AddButton";
import SortIcon from "../../ui/SortIcon";
import Pagination from "../../ui/pagination/Pagination";

interface OrganizationContactTableProps {
  organizationContacts: OrganizationContact[];
  selectedContacts: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onContactSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewContact: (contact: OrganizationContact) => void;
  onEditContact: (id: string) => void;
  onDeleteContact: (contact?: OrganizationContact) => void;
  onPageChange: (page: number) => void;
  onAddContact: () => void;
}

export default function OrganizationContactTable({
  organizationContacts,
  selectedContacts,
  loading,
  currentPage,
  totalPages,
  onContactSelect,
  onSelectAll,
  onViewContact,
  onEditContact,
  onDeleteContact,
  onPageChange,
  onAddContact,
}: OrganizationContactTableProps) {
  const [sortField, setSortField] = useState("vision");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  // Sort organizationContacts
  const sortedContacts = [...organizationContacts].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "vision":
        aValue = a.vision;
        bValue = b.vision;
        break;
      case "email":
        aValue = a.email;
        bValue = b.email;
        break;
      case "period":
        aValue = a.period?.name || "";
        bValue = b.period?.name || "";
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;

      default:
        aValue = a.vision;
        bValue = b.vision;
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
    onSelectAll?.();
  };

  const handleSelectContact = (id: string) => {
    onContactSelect?.(id);
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
                    sortedContacts.length > 0 &&
                    selectedContacts.length === sortedContacts.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("vision")}
              >
                <div className="flex items-center">
                  Vision
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="vision"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("period")}
              >
                <div className="flex items-center">
                  Period
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="period"
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
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedContacts.map((contact, index) => (
              <tr
                key={contact.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                  />
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                  title={contact.vision}
                >
                  {contact.vision}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.phone || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.period?.name || "Unknown"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(new Date(contact.createdAt))}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedContacts.length - 1}
                    hasMultipleItems={sortedContacts.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewContact(contact)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditContact(contact.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteContact(contact)}
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

      {sortedContacts.length === 0 && !loading && (
        <EmptyState
          icon={<Landmark size={48} className="mx-auto" />}
          title="No organization contacts found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            <AddButton onClick={onAddContact} text="Add Organization Contact" />
          }
        />
      )}

      {/* Table Footer */}
      {sortedContacts.length > 0 && (
        <Pagination
          usersLength={sortedContacts.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
