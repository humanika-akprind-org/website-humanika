"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useDriveForm } from "@/hooks/drive/form/useDriveForm";
import type { DriveFormProps } from "@/types/google-drive";

const DriveForm: React.FC<DriveFormProps> = ({
  accessToken,
  file,
  onSuccess,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    fileName,
    fileExtension,
    selectedFolderId,
    isLoading,
    error,
    folderOptions,
    handleSubmit,
    handleFileInputChange,
    handleFileNameChange,
    handleFolderChange,
  } = useDriveForm({ accessToken, file });

  const handleFormSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);

    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/drive");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {file ? "Edit File" : "Upload File Baru"}
      </h2>

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

      <form onSubmit={handleFormSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="file-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama File
            </label>
            <div className="flex">
              <input
                id="file-name"
                type="text"
                value={fileName}
                onChange={handleFileNameChange}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama file"
                required
              />
              {fileExtension && (
                <span className="bg-gray-100 px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md text-gray-500">
                  .{fileExtension}
                </span>
              )}
            </div>
          </div>

          {!file && (
            <>
              <div>
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pilih File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  disabled={isLoading.upload}
                  required={!file}
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    File dipilih:{" "}
                    <span className="font-medium">{selectedFile.name}</span> (
                    {Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="folder-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Folder Tujuan
                </label>
                <select
                  id="folder-select"
                  value={selectedFolderId}
                  onChange={handleFolderChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading.folders || isLoading.upload}
                  required
                >
                  {folderOptions.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading.upload}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                !isLoading.upload
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading.upload ? (
                <span className="flex items-center">
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {file ? "Menyimpan..." : "Mengupload..."}
                </span>
              ) : file ? (
                "Simpan Perubahan"
              ) : (
                "Upload File"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DriveForm;
