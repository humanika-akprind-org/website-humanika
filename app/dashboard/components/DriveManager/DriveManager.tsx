"use client";

import React, { useState, useEffect, useMemo } from "react";
import { drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { DriveManagerProps, LoadingState } from "./types";
import { callApi, fetchDriveFiles, fetchDriveFolders } from "./api";
import {
  getFolderOptions,
  loadFolderFromLocalStorage,
  saveFolderToLocalStorage,
} from "./utils";
import UploadSection from "./subcomponents/UploadSection";
import FileList from "./subcomponents/FileList";

const DriveManager: React.FC<DriveManagerProps> = ({
  files: initialFiles,
  accessToken,
}) => {
  const [files, setFiles] = useState(initialFiles || []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const [folders, setFolders] = useState<drive_v3.Schema$File[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    loadFolderFromLocalStorage()
  );
  const [isLoading, setIsLoading] = useState<LoadingState>({
    files: false,
    folders: false,
    upload: false,
    operations: false,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setIsLoading((prev) => ({ ...prev, files: true }));
    setError(null);

    try {
      const files = await fetchDriveFiles(accessToken);
      setFiles(files);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setIsLoading((prev) => ({ ...prev, files: false }));
    }
  };

  const fetchFolders = async () => {
    setIsLoading((prev) => ({ ...prev, folders: true }));
    setError(null);

    try {
      const folders = await fetchDriveFolders(accessToken);
      setFolders(folders);
    } catch (err) {
      console.error("Error fetching folders:", err);
      setError(err instanceof Error ? err.message : "Failed to load folders");
    } finally {
      setIsLoading((prev) => ({ ...prev, folders: false }));
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, [accessToken]);

  useEffect(() => {
    saveFolderToLocalStorage(selectedFolderId);
  }, [selectedFolderId]);

  const folderOptions = useMemo(() => getFolderOptions(folders), [folders]);

  const handleRename = async (fileId?: string | null) => {
    if (!fileId) return;

    const newName = prompt("Enter new name:");
    if (!newName) return;

    setIsLoading((prev) => ({ ...prev, operations: true }));
    setError(null);

    try {
      await callApi({
        action: "rename",
        fileId,
        fileName: newName,
        accessToken,
      });
      await fetchFiles();
    } catch (err) {
      console.error("Error renaming file:", err);
      setError(err instanceof Error ? err.message : "Failed to rename file");
    } finally {
      setIsLoading((prev) => ({ ...prev, operations: false }));
    }
  };

  const handleDelete = async (fileId?: string | null) => {
    if (!fileId || !confirm("Are you sure you want to delete this file?"))
      return;

    setIsLoading((prev) => ({ ...prev, operations: true }));
    setError(null);

    try {
      await callApi({ action: "delete", fileId, accessToken });
      await fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
      setError(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setIsLoading((prev) => ({ ...prev, operations: false }));
    }
  };

  const handleCopyUrl = async (fileId?: string | null) => {
    if (!fileId) return;

    setIsLoading((prev) => ({ ...prev, operations: true }));
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
      setError(err instanceof Error ? err.message : "Failed to copy URL");
    } finally {
      setIsLoading((prev) => ({ ...prev, operations: false }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please choose a file first!");
      return;
    }

    setIsLoading((prev) => ({ ...prev, upload: true }));
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("action", "upload");
    formData.append("accessToken", accessToken);
    formData.append("folderId", selectedFolderId);

    try {
      // For upload, we use FormData instead of JSON body
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
        // Clear file input
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
    setError(null);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolderId(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Google Drive Manager
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <UploadSection
        selectedFile={selectedFile}
        selectedFolderId={selectedFolderId}
        folderOptions={folderOptions}
        isLoading={isLoading}
        onFileChange={handleFileChange}
        onFolderChange={handleFolderChange}
        onUpload={handleUpload}
      />

      <FileList
        files={files}
        isLoading={isLoading}
        copiedFileId={copiedFileId}
        onRename={handleRename}
        onDelete={handleDelete}
        onCopyUrl={handleCopyUrl}
        onRefresh={fetchFiles}
      />
    </div>
  );
};

export default DriveManager;
