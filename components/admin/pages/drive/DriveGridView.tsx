"use client";

import React from "react";
import type { DriveGridViewProps } from "@/types/google-drive";
import { DriveFileCard } from "./index";

const DriveGridView: React.FC<DriveGridViewProps> = ({
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
  <div className="p-6">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {files.map((file) => (
        <DriveFileCard
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
    </div>
  </div>
);

export default DriveGridView;
