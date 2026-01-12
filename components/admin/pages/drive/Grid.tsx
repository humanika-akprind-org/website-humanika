"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  FolderPlus,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
  Folder,
  File,
  Image as ImageIcon,
  FileText,
  Table,
  Presentation,
  Video,
  Music,
  Archive,
  Check,
  Link as LinkIcon,
  FolderOpen,
  Edit2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { callApi } from "@/use-cases/api/google-drive";
import {
  useGoogleDriveFiles,
  useFileOperations,
} from "@/hooks/drive/table/useGoogleDrive";
import DeleteModal from "./modal/DeleteModal";
import Breadcrumbs from "./Breadcrumbs";
import type { DriveTableProps } from "@/types/google-drive";

// Toast hook (inline implementation for simplicity)
const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  return { toast, showToast };
};

const DriveGrid: React.FC<DriveTableProps> = ({
  files: initialFiles = [],
  accessToken,
}) => {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    fileId: string | null;
    fileName: string;
  }>({
    isOpen: false,
    fileId: null,
    fileName: "",
  });

  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    files,
    isLoading,
    error,
    fetchFiles,
    currentFolderId,
    folderPath,
    navigateToFolder,
    navigateToBreadcrumb,
  } = useGoogleDriveFiles(accessToken, initialFiles, pageSize);

  const {
    copiedFileId,
    isOperating,
    operationError,
    handleApiOperation,
    handleCopyUrl,
  } = useFileOperations(accessToken, fetchFiles);

  const { toast, showToast } = useToast();

  // Combine errors from both hooks
  const displayError = error || operationError;

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase();
    return files.filter(
      (file) =>
        file.name?.toLowerCase().includes(query) ||
        file.mimeType?.toLowerCase().includes(query)
    );
  }, [files, searchQuery]);

  const handleDelete = useCallback(
    (fileId?: string | null, fileName?: string | null) => {
      if (!fileId) return;

      setDeleteModal({
        isOpen: true,
        fileId,
        fileName: fileName || "this file",
      });
    },
    []
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteModal.fileId) return;

    await handleApiOperation(async () => {
      await callApi({
        action: "delete",
        fileId: deleteModal.fileId ?? undefined,
        accessToken,
      });
    }, "File deleted successfully");

    setDeleteModal({ isOpen: false, fileId: null, fileName: "" });
    showToast("File berhasil dihapus", "success");
  }, [deleteModal.fileId, handleApiOperation, accessToken, showToast]);

  const formatFileSize = useCallback((bytes?: number | string | null) => {
    if (!bytes) return "-";
    // Convert string to number if necessary
    const numBytes = typeof bytes === "string" ? parseFloat(bytes) : bytes;
    if (!numBytes) return "-";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(numBytes) / Math.log(1024));
    return `${(numBytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }, []);

  // Helper to check if file is a shortcut pointing to a folder
  const isFolderShortcut = useCallback(
    (file: (typeof files)[0]): boolean =>
      !!file.mimeType?.includes("shortcut") &&
      !!file.shortcutDetails?.targetMimeType?.includes("folder"),
    []
  );

  // Get the target folder ID from a shortcut
  const getShortcutTargetId = useCallback(
    (file: (typeof files)[0]): string | null =>
      file.shortcutDetails?.targetId || null,
    []
  );

  const getFileIcon = useCallback(
    (mimeType?: string | null): React.ReactNode => {
      if (!mimeType) return <File className="w-12 h-12 text-gray-400" />;

      if (mimeType.includes("folder")) {
        return <Folder className="w-12 h-12 text-yellow-500" />;
      }
      // Shortcut icon
      if (mimeType.includes("shortcut")) {
        return (
          <div className="relative">
            <File className="w-12 h-12 text-blue-400" />
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        );
      }
      if (mimeType.includes("image")) {
        return <ImageIcon className="w-12 h-12 text-green-500" />;
      }
      if (mimeType.includes("pdf")) {
        return <FileText className="w-12 h-12 text-red-500" />;
      }
      if (mimeType.includes("word") || mimeType.includes("document")) {
        return <FileText className="w-12 h-12 text-blue-500" />;
      }
      if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
        return <Table className="w-12 h-12 text-green-600" />;
      }
      if (
        mimeType.includes("powerpoint") ||
        mimeType.includes("presentation")
      ) {
        return <Presentation className="w-12 h-12 text-orange-500" />;
      }
      if (mimeType.includes("video")) {
        return <Video className="w-12 h-12 text-purple-500" />;
      }
      if (mimeType.includes("audio")) {
        return <Music className="w-12 h-12 text-pink-500" />;
      }
      if (mimeType.includes("text")) {
        return <FileText className="w-12 h-12 text-gray-500" />;
      }
      if (mimeType.includes("zip") || mimeType.includes("rar")) {
        return <Archive className="w-12 h-12 text-yellow-600" />;
      }
      return <File className="w-12 h-12 text-gray-400" />;
    },
    []
  );

  const handleOpenInDrive = useCallback((fileId?: string | null) => {
    if (!fileId) return;
    window.open(`https://drive.google.com/file/d/${fileId}/view`, "_blank");
  }, []);

  const handleUploadClick = useCallback(() => {
    showToast("Fitur upload akan segera hadir", "info");
  }, [showToast]);

  const handleCreateFolder = useCallback(() => {
    showToast("Fitur buat folder akan segera hadir", "info");
  }, [showToast]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
          role="alert"
        >
          {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
          {toast.type === "error" && <XCircle className="w-5 h-5" />}
          {toast.type === "info" && <Info className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-48"
              aria-label="Cari file"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Create Folder Button */}
          <button
            onClick={handleCreateFolder}
            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2 text-sm"
            aria-label="Buat folder baru"
          >
            <FolderPlus className="h-4 w-4" />
            Folder
          </button>

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            aria-label="Unggah file"
          >
            <Upload className="h-4 w-4" />
            Unggah
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchFiles}
            disabled={isLoading.files}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            aria-label="Segarkan file"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading.files ? "animate-spin" : ""}`}
            />
            Segarkan
          </button>
        </div>
      </div>

      {displayError && (
        <div
          className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start"
          role="alert"
        >
          <XCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{displayError}</p>
          </div>
          <button
            onClick={() => fetchFiles()}
            className="ml-auto text-sm underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={folderPath}
        currentFolderId={currentFolderId}
        onNavigate={navigateToBreadcrumb}
        isLoading={isLoading.files}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading.files && files.length === 0 ? (
          // Initial loading state
          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-100 rounded-lg p-4"
                >
                  <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          // Empty state
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
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          // Grid view
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="group relative bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-all duration-200 border border-transparent hover:border-blue-200 cursor-pointer"
                >
                  {/* Folder/File Icon */}
                  <div className="flex justify-center mb-3">
                    {file.mimeType?.includes("folder") ||
                    isFolderShortcut(file) ? (
                      <button
                        onClick={() => {
                          // Check if it's a folder shortcut - navigate to the target folder
                          if (isFolderShortcut(file)) {
                            const targetId = getShortcutTargetId(file);
                            if (targetId) {
                              navigateToFolder(
                                targetId,
                                file.name || "Shortcut"
                              );
                            }
                          } else {
                            // Regular folder - navigate using the file's own ID
                            navigateToFolder(file.id || "", file.name || "");
                          }
                        }}
                        disabled={isLoading.files}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        aria-label={`Buka folder ${file.name}`}
                      >
                        <FolderOpen className="w-12 h-12 text-yellow-500" />
                      </button>
                    ) : (
                      <div
                        className="p-2"
                        role="img"
                        aria-label={file.mimeType || "File"}
                      >
                        {getFileIcon(file.mimeType)}
                      </div>
                    )}
                  </div>

                  {/* File Name */}
                  <div className="text-center">
                    <p
                      className="text-sm font-medium text-gray-700 truncate px-2"
                      title={file.name || undefined}
                    >
                      {file.name || "Untitled"}
                    </p>
                  </div>

                  {/* File Info */}
                  <div className="text-center mt-1">
                    <p className="text-xs text-gray-400">
                      {file.mimeType?.includes("folder") ||
                      isFolderShortcut(file)
                        ? "Folder"
                        : formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Action Buttons - Show on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
                    {!file.mimeType?.includes("folder") &&
                      !isFolderShortcut(file) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(file.id);
                          }}
                          disabled={isOperating}
                          className="p-1.5 bg-white text-gray-600 rounded shadow-sm hover:bg-gray-50 border border-gray-200 text-xs"
                          title="Salin URL"
                          aria-label="Salin URL file"
                        >
                          {copiedFileId === file.id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <LinkIcon className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenInDrive(file.id);
                      }}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded shadow-sm hover:bg-blue-100 border border-blue-200 text-xs"
                      title="Buka di Drive"
                      aria-label="Buka file di Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/admin/drive/edit/${file.id}`}
                      className="p-1.5 bg-yellow-50 text-yellow-600 rounded shadow-sm hover:bg-yellow-100 border border-yellow-200 text-xs flex items-center justify-center"
                      title="Edit"
                      aria-label="Edit file"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id, file.name);
                      }}
                      disabled={isOperating}
                      className="p-1.5 bg-red-50 text-red-600 rounded shadow-sm hover:bg-red-100 border border-red-200 text-xs"
                      title="Hapus"
                      aria-label="Hapus file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isOperating && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
              aria-hidden="true"
            />
            <p className="text-gray-700">Memproses permintaan Anda...</p>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        fileName={deleteModal.fileName}
        onClose={() =>
          setDeleteModal({ isOpen: false, fileId: null, fileName: "" })
        }
        onConfirm={confirmDelete}
        isLoading={isOperating}
      />
    </div>
  );
};

export default DriveGrid;
