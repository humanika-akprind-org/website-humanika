"use client";

import { useRef, useState } from "react";
import {
  FiFileText,
  FiEye,
  FiEdit,
  FiTrash,
  FiClipboard,
  FiTarget,
  FiDownload,
} from "react-icons/fi";
import type { Letter } from "@/types/letter";
import Checkbox from "../../ui/checkbox/Checkbox";
import StatusChip from "../../ui/chip/Status";
import StatusApproval from "../../ui/chip/StatusApproval";
import EmptyState from "../../ui/EmptyState";
import TypeChip from "../../ui/chip/Type";
import PriorityChip from "../../ui/chip/Priority";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import AddButton from "../../ui/button/AddButton";
import SortIcon from "../../ui/SortIcon";
import Pagination from "../../ui/pagination/Pagination";
import { getGoogleDriveDirectUrl } from "@/lib/google-drive/file-utils";

interface LetterTableProps {
  letters: Letter[];
  selectedLetters: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onLetterSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewLetter: (letter: Letter) => void;
  onEditLetter: (id: string) => void;
  onDeleteLetter: (letter?: Letter) => void;
  onPageChange: (page: number) => void;
  onAddLetter: () => void;
  typeFilter?: string;
}

export default function LetterTable({
  letters,
  selectedLetters,
  loading: _loading,
  currentPage,
  totalPages,
  onLetterSelect,
  onSelectAll,
  onViewLetter,
  onEditLetter,
  onDeleteLetter,
  onPageChange,
  onAddLetter,
  typeFilter,
}: LetterTableProps) {
  // Filter letters by type if typeFilter is provided
  const filteredLetters = typeFilter
    ? letters.filter(
        (letter) =>
          letter.type?.toLowerCase().replace(/[\s\-]/g, "") ===
          typeFilter.toLowerCase().replace(/[\s\-]/g, "")
      )
    : letters;

  const [sortField, setSortField] = useState("regarding");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort letters
  const sortedLetters = [...filteredLetters].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "regarding":
        aValue = a.regarding.toLowerCase();
        bValue = b.regarding.toLowerCase();
        break;
      case "type":
        aValue = a.type.toLowerCase();
        bValue = b.type.toLowerCase();
        break;
      case "priority":
        aValue = a.priority.toLowerCase();
        bValue = b.priority.toLowerCase();
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;

      default:
        aValue = a.regarding.toLowerCase();
        bValue = b.regarding.toLowerCase();
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

  const handleAddLetter = () => {
    onAddLetter();
  };

  // Handle download letter
  const handleDownloadLetter = (letter: Letter) => {
    if (letter.letter) {
      const downloadUrl = getGoogleDriveDirectUrl(letter.letter, "download");
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
    }
  };

  // Determine empty state props based on typeFilter
  const emptyStateProps = (() => {
    if (typeFilter === "proposal") {
      return {
        icon: <FiClipboard size={48} className="mx-auto" />,
        title: "No proposals found",
        description: "Try adjusting your search or filter criteria",
        actionButton: (
          <AddButton onClick={handleAddLetter} text="Add Proposal" />
        ),
      };
    } else if (typeFilter === "accountabilityreport") {
      return {
        icon: <FiTarget size={48} className="mx-auto" />,
        title: "No accountability reports found",
        description: "Try adjusting your search or filter criteria",
        actionButton: (
          <AddButton onClick={handleAddLetter} text="Add Accountability" />
        ),
      };
    } else {
      return {
        icon: <FiFileText size={48} className="mx-auto" />,
        title: "No letters found",
        description: "Try adjusting your search or filter criteria",
        actionButton: <AddButton onClick={handleAddLetter} text="Add Letter" />,
      };
    }
  })();

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
                    sortedLetters.length > 0 &&
                    selectedLetters.length === sortedLetters.length
                  }
                  onChange={onSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("regarding")}
              >
                <div className="flex items-center">
                  Letter
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="regarding"
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
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center">
                  Priority
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="priority"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("classification")}
              >
                <div className="flex items-center">
                  Classification
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="classification"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="status"
                    iconType="arrow"
                  />
                </div>
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
            {sortedLetters.map((letter, index) => (
              <tr
                key={letter.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedLetters.includes(letter.id)}
                    onChange={() => onLetterSelect(letter.id)}
                  />
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${letter.letter}/view`,
                      "_blank"
                    );
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {letter.regarding}
                  </div>
                  <div className="text-sm text-gray-500">
                    {letter.number && `No: ${letter.number}`}
                    {letter.origin && ` • From: ${letter.origin}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    To: {letter.destination}
                  </div>
                  {letter.letter && (
                    <div className="text-sm text-blue-600 mt-1">
                      <span className="inline-flex items-center">
                        <FiFileText className="w-4 h-4 mr-1" />
                        Attached file
                      </span>
                    </div>
                  )}
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${letter.letter}/view`,
                      "_blank"
                    );
                  }}
                >
                  <TypeChip type={letter.type} />
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${letter.letter}/view`,
                      "_blank"
                    );
                  }}
                >
                  <PriorityChip priority={letter.priority} />
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${letter.letter}/view`,
                      "_blank"
                    );
                  }}
                >
                  <div className="text-sm text-gray-900">
                    {letter.classification
                      ? letter.classification
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (l: string) => l.toUpperCase())
                      : "-"}
                  </div>
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${letter.letter}/view`,
                      "_blank"
                    );
                  }}
                >
                  <StatusChip status={letter.status} />
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${letter.letter}/view`,
                      "_blank"
                    );
                  }}
                >
                  {letter.approvals && letter.approvals.length > 0 ? (
                    <StatusApproval
                      status={
                        letter.approvals.sort(
                          (a, b) =>
                            new Date(b.updatedAt).getTime() -
                            new Date(a.updatedAt).getTime()
                        )[0].status
                      }
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No approvals</span>
                  )}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedLetters.length - 1}
                    hasMultipleItems={sortedLetters.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewLetter(letter)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditLetter(letter.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownloadLetter(letter)}
                      color="default"
                    >
                      <FiDownload className="mr-2" size={14} />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteLetter(letter)}
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

      {sortedLetters.length === 0 && !_loading && (
        <EmptyState
          icon={emptyStateProps.icon}
          title={emptyStateProps.title}
          description={emptyStateProps.description}
          actionButton={emptyStateProps.actionButton}
        />
      )}

      {sortedLetters.length > 0 && (
        <Pagination
          usersLength={sortedLetters.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
