import React, { useState } from "react";
import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { type LoadingState } from "@/types/google-drive";

interface FileListProps {
  files: drive_v3.Schema$File[];
  isLoading: LoadingState;
  copiedFileId: string | null;
  onRename: (fileId?: string | null) => void;
  onDelete: (fileId?: string | null) => void;
  onCopyUrl: (fileId?: string | null) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  isLoading,
  copiedFileId,
  onRename,
  onDelete,
  onCopyUrl,
}) => {
  const [filter, setFilter] = useState<"all" | "files" | "folders">("all");

  const filteredFiles = files.filter((file) => {
    if (filter === "all") return true;
    if (filter === "folders") return file.mimeType?.includes("folder");
    return !file.mimeType?.includes("folder");
  });

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-4 flex space-x-2 px-4 pt-4">
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
                      ) : (
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
                      )}
                      <span className="ml-3 truncate max-w-[320px]">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.mimeType?.includes("folder") ? "Folder" : "File"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onCopyUrl(file.id)}
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
                        onClick={() => onRename(file.id)}
                        disabled={isLoading.operations}
                        className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 border border-yellow-200"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => onDelete(file.id)}
                        disabled={isLoading.operations}
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
  );
};

export default FileList;
