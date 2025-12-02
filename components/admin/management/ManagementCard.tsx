"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Management } from "@/types/management";
import { type Position } from "@/types/enums";

interface ManagementCardProps {
  management: Management;
  isSelected: boolean;
  onSelect: (id: string) => void;
  proxyImageUrl: string | null;
  hasImageError: boolean;
  onImageError: (url: string) => void;
  onDelete: (management: Management) => void;
  onDeleteFile: (fileId: string, fileName: string) => void;
  isOperating: boolean;
  getPositionLabel: (position: Position) => string;
  extractFileId: (url: string) => string | null;
}

const ManagementCard: React.FC<ManagementCardProps> = ({
  management,
  isSelected,
  onSelect,
  proxyImageUrl,
  hasImageError,
  onImageError,
  onDelete,
  onDeleteFile,
  isOperating,
  getPositionLabel,
  extractFileId,
}) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex items-start space-x-4">
      {/* Checkbox */}
      <div className="flex-shrink-0 pt-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(management.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
        />
      </div>

      {/* Photo */}
      <div className="flex-shrink-0 relative">
        {proxyImageUrl && !hasImageError ? (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden">
            <Image
              src={proxyImageUrl}
              alt={management.user?.name || "Management"}
              width={64}
              height={64}
              className="w-full h-full object-cover rounded-full"
              onError={() => onImageError(proxyImageUrl)}
              unoptimized={true}
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {management.user?.name}
        </h3>
        <p className="text-sm text-blue-600 font-medium">
          {getPositionLabel(management.position)}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {management.user?.email}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Periode: {management.period?.name}
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
      <Link
        href={`/admin/governance/managements/edit/${management.id}`}
        className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 border border-yellow-200"
      >
        Edit
      </Link>
      {management.photo && (
        <button
          onClick={() => {
            const fileId = extractFileId(management.photo || "");
            if (fileId) {
              onDeleteFile(fileId, `${management.user?.name} - Photo`);
            }
          }}
          disabled={isOperating}
          className="px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded hover:bg-orange-100 border border-orange-200 disabled:opacity-50"
          type="button"
        >
          Hapus Foto
        </button>
      )}
      <button
        onClick={() => onDelete(management)}
        disabled={isOperating}
        className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-200 disabled:opacity-50"
        type="button"
      >
        Hapus
      </button>
    </div>
  </div>
);

export default ManagementCard;
