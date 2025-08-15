"use client";

import React, { useState, useEffect, useMemo } from "react";
import { drive_v3 } from "googleapis/build/src/apis/drive/v3";

interface DriveManagerProps {
  files: drive_v3.Schema$File[] | undefined;
  accessToken: string;
}

interface ApiRequestBody {
  action: string;
  fileId?: string;
  fileName?: string;
  accessToken: string;
}

export default function DriveManager({
  files: initialFiles,
  accessToken,
}: DriveManagerProps) {
  const [files, setFiles] = useState(initialFiles || []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const [folders, setFolders] = useState<drive_v3.Schema$File[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("root");
  const [isLoading, setIsLoading] = useState({
    files: false,
    folders: false,
    upload: false,
    operations: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFolderId = localStorage.getItem("lastUsedFolderId");
      if (savedFolderId) {
        setSelectedFolderId(savedFolderId);
      }
    }
  }, []);

  const callApi = async (body: ApiRequestBody, formData?: FormData) => {
    try {
      const res = await fetch("/api/google-drive", {
        method: "POST",
        headers: formData ? undefined : { "Content-Type": "application/json" },
        body: formData ?? JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("API call error:", err);
      throw err;
    }
  };

  const fetchFiles = async () => {
    setIsLoading((prev) => ({ ...prev, files: true }));
    setError(null);

    try {
      const res = await fetch(
        `/api/google-drive-list?accessToken=${accessToken}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch files");
      }

      setFiles(data.files || []);
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
      const res = await fetch(
        `/api/google-drive-folders?accessToken=${accessToken}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch folders");
      }

      setFolders(data.folders || []);
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
    if (selectedFolderId && selectedFolderId !== "root") {
      localStorage.setItem("lastUsedFolderId", selectedFolderId);
    }
  }, [selectedFolderId]);

  const folderOptions = useMemo(
    () => [
      { id: "root", name: "📁 Root Folder" },
      ...folders
        .filter((f): f is { id: string; name: string } => !!f.id)
        .map((f) => ({ id: f.id, name: `📂 ${f.name}` })),
    ],
    [folders]
  );

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
      const result = await callApi({} as ApiRequestBody, formData);

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

      {/* Upload Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Upload Files
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select File
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              disabled={isLoading.upload}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected:{" "}
                <span className="font-medium">{selectedFile.name}</span> (
                {Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Folder
            </label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading.folders || isLoading.upload}
            >
              {folderOptions.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading.upload}
            className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center ${
              selectedFile && !isLoading.upload
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading.upload ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>

      {/* File List Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">Your Files</h2>
          <button
            onClick={fetchFiles}
            disabled={isLoading.files}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </div>

        {isLoading.files ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload your first file to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {files.map((file) => (
              <li
                key={file.id}
                className="p-3 hover:bg-gray-50 flex justify-between items-center"
              >
                <div className="flex items-center min-w-0">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="ml-3 truncate">{file.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyUrl(file.id)}
                    disabled={isLoading.operations}
                    className={`px-3 py-1 text-sm rounded border ${
                      copiedFileId === file.id
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {copiedFileId === file.id ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleRename(file.id)}
                    disabled={isLoading.operations}
                    className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 border border-yellow-200"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={isLoading.operations}
                    className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
