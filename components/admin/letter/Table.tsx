"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2, FiEye, FiFile } from "react-icons/fi";
import type { Letter } from "@/types/letter";
import { LetterType, LetterPriority } from "@/types/enums";
import { formatDate } from "@/lib/utils";

interface LetterTableProps {
  letters: Letter[];
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function LetterTable({
  letters,
  onDelete,
  isLoading,
}: LetterTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this letter?")) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } catch (error) {
        console.error("Failed to delete letter:", error);
      } finally {
        setDeletingId(null);
      }
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600">Loading letters...</span>
        </div>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <FiFile className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No letters</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new letter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Letter Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type & Priority
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {letters.map((letter) => (
              <tr key={letter.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FiFile className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-4">
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
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        letter.type
                      )}`}
                    >
                      {letter.type.charAt(0).toUpperCase() +
                        letter.type.slice(1).toLowerCase()}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        letter.priority
                      )}`}
                    >
                      {letter.priority.charAt(0).toUpperCase() +
                        letter.priority.slice(1).toLowerCase()}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(letter.date.toISOString())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {letter.createdBy.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/administration/letters/${letter.id}`
                        )
                      }
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/administration/letters/edit/${letter.id}`
                        )
                      }
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(letter.id)}
                      disabled={deletingId === letter.id}
                      className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === letter.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      ) : (
                        <FiTrash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
