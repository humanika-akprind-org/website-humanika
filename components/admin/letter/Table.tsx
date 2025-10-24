"use client";

import { useState } from "react";
import Link from "next/link";
import { FiFileText, FiUser } from "react-icons/fi";
import type { Letter } from "@/types/letter";
import {
  Status,
  LetterType,
  LetterPriority,
  Status as StatusEnum,
} from "@/types/enums";
import LetterStats from "./Stats";
import LetterFilters from "./Filters";
import DeleteModal from "./modal/DeleteModal";

interface LetterTableProps {
  letters: Letter[];
  onDelete: (id: string) => Promise<void>;
  accessToken?: string;
}

export default function LetterTable({ letters, onDelete }: LetterTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<LetterType | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<LetterPriority | "all">(
    "all"
  );
  const [userFilter, setUserFilter] = useState<string>("all");
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<Letter | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const handleStatusFilterChange = (status: string) =>
    (status === "all" ||
      Object.values(StatusEnum).includes(status as unknown as StatusEnum)) &&
    setStatusFilter(status === "all" ? "all" : (status as unknown as Status));

  const handleTypeFilterChange = (type: string) =>
    (type === "all" ||
      Object.values(LetterType).includes(type as unknown as LetterType)) &&
    setTypeFilter(type === "all" ? "all" : (type as unknown as LetterType));

  const handlePriorityFilterChange = (priority: string) =>
    (priority === "all" ||
      Object.values(LetterPriority).includes(
        priority as unknown as LetterPriority
      )) &&
    setPriorityFilter(
      priority === "all" ? "all" : (priority as unknown as LetterPriority)
    );

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const getStatusColor = (status: Status) => {
    switch (status) {
      case StatusEnum.DRAFT:
        return "bg-gray-100 text-gray-800";
      case StatusEnum.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StatusEnum.PUBLISH:
        return "bg-green-100 text-green-800";
      case StatusEnum.PRIVATE:
        return "bg-blue-100 text-blue-800";
      case StatusEnum.ARCHIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: LetterType) => {
    switch (type) {
      case LetterType.INCOMING:
        return "bg-blue-100 text-blue-800";
      case LetterType.OUTGOING:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: LetterPriority) => {
    switch (priority) {
      case LetterPriority.IMPORTANT:
        return "bg-red-100 text-red-800";
      case LetterPriority.NORMAL:
        return "bg-green-100 text-green-800";
      case LetterPriority.URGENT:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (letter: Letter) => {
    setLetterToDelete(letter);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      selectedLetters.forEach((id) => onDelete(id));
      setSelectedLetters([]);
    } else if (letterToDelete) {
      onDelete(letterToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setLetterToDelete(null);
    setIsBulkDelete(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLetterToDelete(null);
    setIsBulkDelete(false);
  };

  // Filter letters based on search term and filters
  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.regarding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || letter.status === statusFilter;

    const matchesType = typeFilter === "all" || letter.type === typeFilter;

    const matchesPriority =
      priorityFilter === "all" || letter.priority === priorityFilter;

    const matchesUser =
      userFilter === "all" || letter.createdBy.id === userFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesPriority &&
      matchesUser
    );
  });

  // Toggle letter selection
  const toggleLetterSelection = (id: string) => {
    setSelectedLetters((prev) =>
      prev.includes(id)
        ? prev.filter((letterId) => letterId !== id)
        : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedLetters.length === 0) return;

    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  if (letters.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No letters found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first letter.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl">
      <LetterStats totalLetters={filteredLetters.length} />

      <LetterFilters
        onFilter={(filter) => {
          setSearchTerm(filter.search || "");
          if (filter.type) handleTypeFilterChange(filter.type);
          if (filter.priority) handlePriorityFilterChange(filter.priority);
        }}
        isLoading={false}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredLetters.length} of {letters.length} letters
          </p>
        </div>

        {selectedLetters.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedLetters.length} letter
              {selectedLetters.length > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Letters Table */}
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
                      filteredLetters.length > 0 &&
                      selectedLetters.length === filteredLetters.length
                    }
                    onChange={() => {
                      if (selectedLetters.length === filteredLetters.length) {
                        setSelectedLetters([]);
                      } else {
                        setSelectedLetters(
                          filteredLetters.map((letter) => letter.id)
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
                  Letter
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
                  Priority
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
                  User
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
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
              {filteredLetters.length > 0 ? (
                filteredLetters.map((letter) => (
                  <tr
                    key={letter.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLetters.includes(letter.id)}
                        onChange={() => toggleLetterSelection(letter.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {letter.regarding}
                      </div>
                      <div className="text-sm text-gray-500">
                        {letter.number && `No: ${letter.number}`}
                        {letter.origin && ` • Dari: ${letter.origin}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        Kepada: {letter.destination}
                      </div>
                      {letter.letter && (
                        <div className="text-sm text-blue-600 mt-1">
                          <span className="inline-flex items-center">
                            <FiFileText className="w-4 h-4 mr-1" />
                            File terlampir
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(
                          letter.type
                        )}`}
                      >
                        {letter.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(
                          letter.priority
                        )}`}
                      >
                        {letter.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          letter.status
                        )}`}
                      >
                        {letter.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-400" size={14} />
                        {letter.createdBy?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(letter.createdAt)}
                    </td>
                    <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/administration/letters/${letter.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View letter"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/administration/letters/edit/${letter.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit letter"
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
                          onClick={() => handleDelete(letter)}
                          title="Delete letter"
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
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No letters found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {letters.length === 0
                        ? "Get started by creating your first letter."
                        : "No letters match the selected filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredLetters.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredLetters.length}</span> of{" "}
              <span className="font-medium">{letters.length}</span> letters
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
        letterTitle={letterToDelete?.regarding || ""}
        isLoading={false}
      />
    </div>
  );
}
