"use client";

import React from "react";
import {
  FolderOpen,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import type { DriveFileRowProps } from "@/types/google-drive";
import { getGoogleDriveDirectUrl } from "@/lib/google-drive/file-utils";

const DriveFileRow: React.FC<DriveFileRowProps> = ({
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
  const isFolder = file.mimeType?.includes("folder") || isFolderShortcut(file);

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

  const getFileTypeLabel = (mimeType?: string | null): string => {
    if (!mimeType) {
      return "File";
    }
    if (mimeType.includes("folder") || isFolderShortcut(file)) {
      return "Folder";
    }
    if (mimeType.includes("image")) {
      return "Gambar";
    }
    if (mimeType.includes("pdf")) {
      return "PDF";
    }
    if (mimeType.includes("word") || mimeType.includes("document")) {
      return "Dokumen";
    }
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      return "Spreadsheet";
    }
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
      return "Presentasi";
    }
    if (mimeType.includes("video")) {
      return "Video";
    }
    if (mimeType.includes("audio")) {
      return "Audio";
    }
    if (mimeType.includes("zip") || mimeType.includes("rar")) {
      return "Arsip";
    }
    return "File";
  };

  return (
    <tr key={file.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {isFolder ? (
            <button
              onClick={handleFolderClick}
              disabled={isLoading}
              className="flex items-center hover:bg-blue-50 rounded p-1 -m-1 transition-colors"
            >
              <FolderOpen className="flex-shrink-0 h-12 w-12 text-yellow-500" />
              <span className="ml-3 truncate max-w-[320px] text-gray-900 hover:text-blue-600 cursor-pointer">
                {file.name}
              </span>
            </button>
          ) : (
            <>
              <div className="flex-shrink-0 h-12 w-12">
                {getFileIcon(file.mimeType)}
              </div>
              <span
                className="ml-3 truncate max-w-[320px] cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleFileClick}
              >
                {file.name}
              </span>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {getFileTypeLabel(file.mimeType)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isFolder ? "-" : formatFileSize(file.size)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex gap-1">
          {!isFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyUrl(file.id);
              }}
              disabled={isOperating}
              className={`p-1.5 rounded transition-colors ${
                copiedFileId === file.id
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Salin URL"
              aria-label="Salin URL file"
            >
              {copiedFileId === file.id ? (
                <Check className="w-4 h-4" />
              ) : (
                <LinkIcon className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenInDrive(file.id);
            }}
            className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            title="Buka di Drive"
            aria-label="Buka file di Google Drive"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRename(file.id, file.name);
            }}
            disabled={isOperating}
            className="p-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
            title="Ubah Nama"
            aria-label="Ubah nama file"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(file.id, file.name);
            }}
            disabled={isOperating}
            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            title="Hapus"
            aria-label="Hapus file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DriveFileRow;
