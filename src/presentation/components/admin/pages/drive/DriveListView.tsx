"use client";

import React from "react";
import type { DriveListViewProps } from "@/types/google-drive";
import { DriveFileRow } from "./index";

const DriveListView: React.FC<DriveListViewProps> = ({
  files,
  getFileIcon,
  formatFileSize,
  isFolderShortcut,
  getShortcutTargetId,
  navigateToFolder,
  handleCopyUrl,
  handleOpenInDrive,
  handleRename,
  handleDelete,
  isLoading,
  isOperating,
  copiedFileId,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Nama
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Tipe
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Ukuran
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {files.map((file) => (
          <DriveFileRow
            key={file.id}
            file={file}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            isFolderShortcut={isFolderShortcut}
            getShortcutTargetId={getShortcutTargetId}
            navigateToFolder={navigateToFolder}
            handleCopyUrl={handleCopyUrl}
            handleOpenInDrive={handleOpenInDrive}
            handleRename={handleRename}
            handleDelete={handleDelete}
            isLoading={isLoading}
            isOperating={isOperating}
            copiedFileId={copiedFileId}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default DriveListView;
