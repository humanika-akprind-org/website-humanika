"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import type { DriveEmptyStateProps } from "@/types/google-drive";

const DriveEmptyState: React.FC<DriveEmptyStateProps> = ({
  searchQuery,
  onClearSearch,
}) => (
  <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
    <FolderOpen className="mx-auto h-16 w-16 text-gray-300" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">
      {searchQuery ? "File tidak ditemukan" : "Folder ini kosong"}
    </h3>
    <p className="mt-2 text-sm text-gray-500">
      {searchQuery
        ? `Tidak ada file yang cocok dengan "${searchQuery}"`
        : "Unggah file pertama Anda atau buat folder untuk memulai."}
    </p>
    {searchQuery && (
      <button
        onClick={onClearSearch}
        className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Hapus pencarian
      </button>
    )}
  </div>
);

export default DriveEmptyState;
