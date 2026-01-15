"use client";

import React, { useState } from "react";
import Link from "next/link";
import { callApi } from "@/use-cases/api/google-drive";
import {
  useGoogleDriveFiles,
  useFileOperations,
} from "@/hooks/drive/table/useGoogleDrive";
import DeleteModal from "./modal/DeleteModal";
import Breadcrumbs from "./Breadcrumbs";
import type { DriveTableProps } from "@/types/google-drive";

const DriveTable: React.FC<DriveTableProps> = ({
  files: initialFiles = [],
  accessToken,
}) => {
  const [filter, setFilter] = useState<"all" | "files" | "folders">("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    fileId: string | null;
    fileName: string;
  }>({
    isOpen: false,
    fileId: null,
    fileName: "",
  });

  const {
    files,
    isLoading,
    error,
    fetchFiles,
    currentFolderId,
    folderPath,
    navigateToFolder,
    navigateToBreadcrumb,
  } = useGoogleDriveFiles(accessToken, initialFiles);

  const {
    copiedFileId,
    isOperating,
    operationError,
    handleApiOperation,
    handleCopyUrl,
  } = useFileOperations(accessToken, fetchFiles);

  // Combine errors from both hooks
  const displayError = error || operationError;

  const filteredFiles = files.filter((file) => {
    if (filter === "all") return true;
    if (filter === "folders") return file.mimeType?.includes("folder");
    return !file.mimeType?.includes("folder");
  });

  const handleDelete = async (
    fileId?: string | null,
    fileName?: string | null
  ) => {
    if (!fileId) return;

    setDeleteModal({
      isOpen: true,
      fileId,
      fileName: fileName || "this file",
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.fileId) return;

    await handleApiOperation(async () => {
      await callApi({
        action: "delete",
        fileId: deleteModal.fileId ?? undefined,
        accessToken,
      });
    }, "File deleted successfully");

    setDeleteModal({ isOpen: false, fileId: null, fileName: "" });
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

      {displayError && (
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
            <p className="text-sm">{displayError}</p>
          </div>
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={folderPath}
        currentFolderId={currentFolderId}
        onNavigate={navigateToBreadcrumb}
        isLoading={isLoading.files}
      />

      {/* Filter Controls */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-sm rounded border ${
            filter === "all"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter("files")}
          className={`px-3 py-1 text-sm rounded border ${
            filter === "files"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          File
        </button>
        <button
          onClick={() => setFilter("folders")}
          className={`px-3 py-1 text-sm rounded border ${
            filter === "folders"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          Folder
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading.files ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : filteredFiles.length === 0 ? (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === "all"
                ? "No files or folders"
                : filter === "files"
                ? "No files"
                : "No folders"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? "Upload your first file or create a folder to get started."
                : filter === "files"
                ? "Upload your first file to get started."
                : "Create your first folder to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {file.mimeType?.includes("folder") ? (
                          <button
                            onClick={() =>
                              navigateToFolder(file.id || "", file.name || "")
                            }
                            disabled={isLoading.files}
                            className="flex items-center hover:bg-blue-50 rounded p-1 -m-1 transition-colors"
                          >
                            <svg
                              className="flex-shrink-0 h-5 w-5 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                              />
                            </svg>
                            <span className="ml-3 truncate max-w-[320px] text-blue-600 hover:underline cursor-pointer">
                              {file.name}
                            </span>
                          </button>
                        ) : (
                          <>
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
                            <span className="ml-3 truncate max-w-[320px]">
                              {file.name}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.mimeType?.includes("folder") ? "Folder" : "File"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyUrl(file.id)}
                          disabled={isOperating}
                          className={`px-3 py-1 text-sm rounded border ${
                            copiedFileId === file.id
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {copiedFileId === file.id ? "Copied!" : "Copy URL"}
                        </button>
                        <Link
                          href={`/admin/drive/edit/${file.id}`}
                          className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 border border-yellow-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(file.id, file.name)}
                          disabled={isOperating}
                          className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <p className="text-gray-700">Processing your request...</p>
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

export default DriveTable;
