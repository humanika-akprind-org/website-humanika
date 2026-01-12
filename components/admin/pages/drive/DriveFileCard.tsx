"use client";

import React, { useState } from "react";
import {
  FolderOpen,
  MoreVertical,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
} from "lucide-react";
import type { DriveFileCardProps } from "@/types/google-drive";
import { getGoogleDriveDirectUrl } from "@/lib/google-drive/file-utils";

const DriveFileCard: React.FC<DriveFileCardProps> = ({
  file,
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
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isFolder = file.mimeType?.includes("folder") || isFolderShortcut(file);
  const isCopied = copiedFileId === file.id;

  const handleFolderClick = () => {
    if (isFolderShortcut(file)) {
      const targetId = getShortcutTargetId(file);
      if (targetId) {
        navigateToFolder(targetId, file.name || "Shortcut");
      }
    } else {
      navigateToFolder(file.id || "", file.name || "");
    }
  };

  const handleFileClick = () => {
    if (file.id) {
      const url = getGoogleDriveDirectUrl(file.id, "view");
      if (url) {
        window.open(url, "_blank");
      }
    }
  };

  const handleMenuAction = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
    setMenuOpen(false);
  };

  return (
    <div
      className="group relative bg-white hover:bg-gray-50 rounded-xl p-5 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md cursor-pointer"
      onClick={() => (isFolder ? handleFolderClick() : handleFileClick())}
    >
      <div className="flex justify-center mb-4">
        {isFolder ? (
          <button
            onClick={handleFolderClick}
            disabled={isLoading}
            className="p-3 bg-yellow-50 rounded-xl transition-colors"
            aria-label={`Buka folder ${file.name}`}
          >
            <FolderOpen className="w-10 h-10 text-yellow-500" />
          </button>
        ) : (
          <div
            className="p-3 bg-gray-50 rounded-xl"
            role="img"
            aria-label={file.mimeType || "File"}
          >
            {getFileIcon(file.mimeType)}
          </div>
        )}
      </div>

      <div className="text-center">
        <p
          className="text-sm font-medium text-gray-800 truncate px-2"
          title={file.name || undefined}
        >
          {file.name || "Untitled"}
        </p>
      </div>

      <div className="text-center mt-1.5">
        <p className="text-xs text-gray-400">
          {isFolder ? "Folder" : formatFileSize(file.size)}
        </p>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            disabled={isOperating}
            className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-500 rounded-lg hover:bg-white hover:text-gray-700 shadow-sm border border-gray-100 text-xs"
            title="Opsi"
            aria-label="Opsi file"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
              {!isFolder && (
                <button
                  onClick={handleMenuAction(() => handleCopyUrl?.(file.id))}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {isCopied ? "Copied" : "Copy Link"}
                </button>
              )}
              {!isFolder && (
                <button
                  onClick={handleMenuAction(() => handleOpenInDrive?.(file.id))}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Drive
                </button>
              )}
              <button
                onClick={handleMenuAction(() =>
                  handleRename?.(file.id, file.name)
                )}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Rename
              </button>
              <button
                onClick={handleMenuAction(() =>
                  handleDelete?.(file.id, file.name)
                )}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriveFileCard;
