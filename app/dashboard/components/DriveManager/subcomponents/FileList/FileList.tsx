import React from "react";
import { drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { LoadingState } from "../../types";

interface FileListProps {
  files: drive_v3.Schema$File[];
  isLoading: LoadingState;
  copiedFileId: string | null;
  onRename: (fileId?: string | null) => void;
  onDelete: (fileId?: string | null) => void;
  onCopyUrl: (fileId?: string | null) => void;
  onRefresh: () => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  isLoading,
  copiedFileId,
  onRename,
  onDelete,
  onCopyUrl,
  onRefresh,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-700">Your Files</h2>
        <button
          onClick={onRefresh}
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
                <span className="ml-3 truncate max-w-[520px]">{file.name}</span>
              </div>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
