"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";
import {
  type DriveManagerProps,
  type LoadingState,
} from "../../../../../types/google-drive";
import {
  callApi,
  fetchDriveFiles,
  fetchDriveFolders,
} from "../../../../../lib/api/google-drive";
import {
  getFolderOptions,
  loadFolderFromLocalStorage,
  saveFolderToLocalStorage,
} from "../../../../utils";
import UploadSection from "./subcomponents/UploadSection";
import FileList from "./subcomponents/FileList";

const DriveManager: React.FC<DriveManagerProps> = ({
  files: initialFiles = [],
  accessToken,
}) => {
  const [files, setFiles] = useState<drive_v3.Schema$File[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNameInput, setFileNameInput] = useState("");
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const [folders, setFolders] = useState<drive_v3.Schema$File[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    loadFolderFromLocalStorage() || "root"
  );
  const [isLoading, setIsLoading] = useState<LoadingState>({
    files: false,
    folders: false,
    upload: false,
    operations: false,
  });
  const [error, setError] = useState<string | null>(null);

  const setLoadingState = (key: keyof LoadingState, value: boolean) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

  const fetchFiles = useCallback(async () => {
    setLoadingState("files", true);
    setError(null);

    try {
      const files = await fetchDriveFiles(accessToken);
      setFiles(files);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load files. Please try again."
      );
    } finally {
      setLoadingState("files", false);
    }
  }, [accessToken]);

  const fetchFolders = useCallback(async () => {
    setLoadingState("folders", true);
    setError(null);

    try {
      const folders = await fetchDriveFolders(accessToken);
      setFolders(folders);
    } catch (err) {
      console.error("Error fetching folders:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load folders. Please try again."
      );
    } finally {
      setLoadingState("folders", false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, [fetchFiles, fetchFolders]);

  useEffect(() => {
    if (selectedFolderId) {
      saveFolderToLocalStorage(selectedFolderId);
    }
  }, [selectedFolderId]);

  const folderOptions = useMemo(() => getFolderOptions(folders), [folders]);

  const handleApiOperation = async (
    operation: () => Promise<void>,
    successMessage?: string
  ) => {
    setLoadingState("operations", true);
    setError(null);

    try {
      await operation();
      await fetchFiles();
      if (successMessage) {
        // Could show a success toast here
        console.log(successMessage);
      }
    } catch (err) {
      console.error("Operation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Operation failed. Please try again."
      );
    } finally {
      setLoadingState("operations", false);
    }
  };

  const handleRename = async (fileId?: string | null) => {
    if (!fileId) return;

    const newName = prompt("Enter new name:");
    if (!newName?.trim()) return;

    await handleApiOperation(async () => {
      await callApi({
        action: "rename",
        fileId,
        fileName: newName,
        accessToken,
      });
    }, "File renamed successfully");
  };

  const handleDelete = async (fileId?: string | null) => {
    if (!fileId || !confirm("Are you sure you want to delete this file?")) {
      return;
    }

    await handleApiOperation(async () => {
      await callApi({ action: "delete", fileId, accessToken });
    }, "File deleted successfully");
  };

  const handleCopyUrl = async (fileId?: string | null) => {
    if (!fileId) return;

    setLoadingState("operations", true);
    setError(null);

    try {
      const res = await callApi({
        action: "getUrl",
        fileId,
        accessToken,
      });

      if (res.success && res.url) {
        await navigator.clipboard.writeText(res.url);
        setCopiedFileId(fileId);
        setTimeout(() => setCopiedFileId(null), 2000);
      } else {
        throw new Error(res.message || "Failed to get file URL");
      }
    } catch (err) {
      console.error("Error copying URL:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to copy URL. Please try again."
      );
    } finally {
      setLoadingState("operations", false);
    }
  };

  const handleUpload = async (file: File): Promise<string> => {
    if (!file) {
      setError("Please select a file to upload");
      return ""; // Return empty string on error
    }

    setLoadingState("upload", true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("action", "upload");
    formData.append("accessToken", accessToken);
    formData.append("folderId", selectedFolderId);
    formData.append("fileName", fileNameInput.trim() || file.name);

    try {
      const result = await callApi(
        {
          action: "upload",
          accessToken,
        },
        formData
      );

      if (result.success) {
        await fetchFiles();
        setSelectedFile(null);
        setFileNameInput("");
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Return the file ID (make sure your API returns this)
        return result.fileId || "";
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
      return ""; // Return empty string on error
    } finally {
      setLoadingState("upload", false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
    setError(null);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileNameInput(e.target.value);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolderId(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Google Drive Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your organization&apos;s documents and files
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchFiles}
            disabled={isLoading.files}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            aria-label="Refresh files"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div
          className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start"
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <UploadSection
          selectedFile={selectedFile} // Keep this for UI display
          selectedFolderId={selectedFolderId}
          folderOptions={folderOptions}
          isLoading={isLoading}
          onFileChange={handleFileChange}
          onFileNameChange={handleFileNameChange}
          onFolderChange={handleFolderChange}
          onUpload={(file) => handleUpload(file)} // Pass the file here
          onRename={handleRename}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <FileList
          files={files}
          isLoading={isLoading}
          copiedFileId={copiedFileId}
          onRename={handleRename}
          onDelete={handleDelete}
          onCopyUrl={handleCopyUrl}
        />
      </div>

      {isLoading.operations && (
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
            <p className="text-gray-700">Processing your request...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveManager;
