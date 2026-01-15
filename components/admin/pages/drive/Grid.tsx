"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Folder,
  File,
  Image as ImageIcon,
  FileText,
  Table,
  Presentation,
  Video,
  Music,
  Archive,
  ExternalLink,
} from "lucide-react";
import { callApi } from "@/use-cases/api/google-drive";
import {
  useGoogleDriveFiles,
  useFileOperations,
} from "@/hooks/drive/table/useGoogleDrive";
import DeleteModal from "./modal/DeleteModal";
import RenameModal from "./modal/RenameModal";
import Breadcrumbs from "./Breadcrumbs";
import type { DriveTableProps } from "@/types/google-drive";
import CreateFolderModal from "./modal/CreateFolderModal";
import UploadProgressModal from "./modal/UploadProgressModal";
import { useToast } from "./hooks/useToast";
import {
  DriveControlBar,
  DriveErrorState,
  DriveEmptyState,
  DriveLoadingState,
  DriveToast,
  DriveGridView,
  DriveListView,
} from "./index";

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

  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [renameModal, setRenameModal] = useState<{
    open: boolean;
    fileId: string | null;
    fileName: string;
    newName: string;
  }>({
    open: false,
    fileId: null,
    fileName: "",
    newName: "",
  });
  const [uploadProgress, setUploadProgress] = useState<{
    isOpen: boolean;
    fileName: string;
    progress: number;
    status: "uploading" | "success" | "error";
    error?: string;
  }>({
    isOpen: false,
    fileName: "",
    progress: 0,
    status: "uploading",
  });

  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    createFolder,
    uploadFile,
  } = useFileOperations(accessToken, fetchFiles);

  const { toast, showToast } = useToast();

  // Combine errors from both hooks
  const displayError = error || operationError;

  // Filter files based on search query
  const filteredFiles = React.useMemo(() => {
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

  const handleRename = useCallback(
    (fileId?: string | null, fileName?: string | null) => {
      if (!fileId) return;

      setRenameModal({
        open: true,
        fileId,
        fileName: fileName || "this file",
        newName: fileName || "",
      });
    },
    []
  );

  const confirmRename = useCallback(async () => {
    if (!renameModal.fileId || !renameModal.newName.trim()) return;

    await handleApiOperation(async () => {
      await callApi({
        action: "rename",
        fileId: renameModal.fileId,
        newName: renameModal.newName,
        accessToken,
      });
    }, "File renamed successfully");

    setRenameModal({ open: false, fileId: null, fileName: "", newName: "" });
    showToast("File berhasil diubah nama", "success");
  }, [
    renameModal.fileId,
    renameModal.newName,
    handleApiOperation,
    accessToken,
    showToast,
  ]);

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

  // Handle file upload button click
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Show progress modal
      setUploadProgress({
        isOpen: true,
        fileName: file.name,
        progress: 0,
        status: "uploading",
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      try {
        const success = await uploadFile(file, undefined, currentFolderId);

        clearInterval(progressInterval);

        if (success) {
          setUploadProgress((prev) => ({
            ...prev,
            progress: 100,
            status: "success",
          }));

          // Refresh files
          await fetchFiles();

          // Close modal after delay
          setTimeout(() => {
            setUploadProgress((prev) => ({ ...prev, isOpen: false }));
            showToast("File berhasil diunggah", "success");
          }, 1500);
        } else {
          throw new Error("Upload failed");
        }
      } catch (err) {
        clearInterval(progressInterval);

        setUploadProgress((prev) => ({
          ...prev,
          status: "error",
          error: err instanceof Error ? err.message : "Upload failed",
        }));
      }
    },
    [currentFolderId, uploadFile, fetchFiles, showToast]
  );

  // Handle create folder button click
  const handleCreateFolderClick = useCallback(() => {
    setCreateFolderModal(true);
  }, []);

  // Handle create folder confirmation
  const handleCreateFolderConfirm = useCallback(
    async (folderName: string) => {
      const success = await createFolder(folderName, currentFolderId);

      if (success) {
        setCreateFolderModal(false);
        await fetchFiles();
        showToast(`Folder "${folderName}" berhasil dibuat`, "success");
      }
    },
    [createFolder, currentFolderId, fetchFiles, showToast]
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Toast Notification */}
      <DriveToast toast={toast} />

      {/* Hidden file input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
        aria-label="Pilih file untuk diunggah"
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={createFolderModal}
        onClose={() => setCreateFolderModal(false)}
        onConfirm={handleCreateFolderConfirm}
        isLoading={isOperating}
      />

      {/* Upload Progress Modal */}
      <UploadProgressModal
        isOpen={uploadProgress.isOpen}
        fileName={uploadProgress.fileName}
        progress={uploadProgress.progress}
        status={uploadProgress.status}
        error={uploadProgress.error}
      />

      {/* Rename Modal */}
      <RenameModal
        isOpen={renameModal.open}
        onClose={() =>
          setRenameModal({
            open: false,
            fileId: null,
            fileName: "",
            newName: "",
          })
        }
        onConfirm={confirmRename}
        currentName={renameModal.fileName}
        isLoading={isOperating}
      />

      {/* Control Bar */}
      <DriveControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateFolder={handleCreateFolderClick}
        onUpload={handleUploadClick}
        onRefresh={fetchFiles}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isLoading={isLoading.files}
        isOperating={isOperating}
      />

      {/* Error State */}
      <DriveErrorState error={displayError} onRetry={fetchFiles} />

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
          <DriveLoadingState count={10} />
        ) : filteredFiles.length === 0 ? (
          // Empty state
          <DriveEmptyState
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
          />
        ) : viewMode === "list" ? (
          // List view - Using DriveListView component
          <DriveListView
            files={filteredFiles}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            isFolderShortcut={isFolderShortcut}
            getShortcutTargetId={getShortcutTargetId}
            navigateToFolder={navigateToFolder}
            handleCopyUrl={handleCopyUrl}
            handleOpenInDrive={handleOpenInDrive}
            handleRename={handleRename}
            handleDelete={handleDelete}
            isLoading={isLoading.files}
            isOperating={isOperating}
            copiedFileId={copiedFileId}
          />
        ) : (
          // Grid view - Using DriveGridView component
          <DriveGridView
            files={filteredFiles}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            isFolderShortcut={isFolderShortcut}
            getShortcutTargetId={getShortcutTargetId}
            navigateToFolder={navigateToFolder}
            handleCopyUrl={handleCopyUrl}
            handleOpenInDrive={handleOpenInDrive}
            handleRename={handleRename}
            handleDelete={handleDelete}
            isLoading={isLoading.files}
            isOperating={isOperating}
            copiedFileId={copiedFileId}
          />
        )}
      </div>

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
