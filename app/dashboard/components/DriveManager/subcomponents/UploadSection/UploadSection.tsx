import React from "react";
import { LoadingState, FolderOption } from "../../types";

interface UploadSectionProps {
  selectedFile: File | null;
  selectedFolderId: string;
  folderOptions: FolderOption[];
  isLoading: LoadingState;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onUpload: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  selectedFile,
  selectedFolderId,
  folderOptions,
  isLoading,
  onFileChange,
  onFolderChange,
  onUpload,
}) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Upload Files</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={onFileChange}
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
              Selected: <span className="font-medium">{selectedFile.name}</span>{" "}
              ({Math.round(selectedFile.size / 1024)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination Folder
          </label>
          <select
            value={selectedFolderId}
            onChange={onFolderChange}
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
          onClick={onUpload}
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
  );
};

export default UploadSection;
