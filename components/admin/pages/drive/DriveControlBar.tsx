"use client";

import React from "react";
import {
  Search,
  FolderPlus,
  Upload,
  RefreshCw,
  List,
  Grid as GridIcon,
} from "lucide-react";
import type { DriveControlBarProps } from "@/types/google-drive";

const DriveControlBar: React.FC<DriveControlBarProps> = ({
  searchQuery,
  onSearchChange,
  onCreateFolder,
  onUpload,
  onRefresh,
  viewMode,
  onViewModeChange,
  isLoading,
  isOperating,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Cari file..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          aria-label="Cari file"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Create Folder Button */}
      <button
        onClick={onCreateFolder}
        className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2 text-sm"
        aria-label="Buat folder baru"
      >
        <FolderPlus className="h-4 w-4" />
        Folder
      </button>

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={isOperating}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
        aria-label="Unggah file"
      >
        <Upload className="h-4 w-4" />
        Unggah
      </button>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
        aria-label="Segarkan file"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        Segarkan
      </button>
    </div>

    {/* View Toggle Buttons */}
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Tampilan grid"
        title="Tampilan grid"
      >
        <GridIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Tampilan list"
        title="Tampilan list"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default DriveControlBar;
