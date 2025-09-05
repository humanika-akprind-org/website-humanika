"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { callApi, fetchDriveFolders } from "@/lib/api/google-drive";
import { getFolderOptions } from "@/app/utils/google-drive";
import { useRouter } from "next/navigation";

interface DriveFormProps {
  accessToken: string;
  file?: drive_v3.Schema$File;
  onSuccess?: () => void;
}

interface LoadingState {
  upload: boolean;
  folders: boolean;
}

const DriveForm: React.FC<DriveFormProps> = ({
  accessToken,
  file,
  onSuccess,
}) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(file?.name?.split(".")[0] || "");
  const [fileExtension, setFileExtension] = useState(
    file?.name?.includes(".") ? file.name.split(".").pop() || "" : ""
  );
  const [folders, setFolders] = useState<drive_v3.Schema$File[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState("root");
  const [isLoading, setIsLoading] = useState<LoadingState>({
    upload: false,
    folders: false,
  });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setLoadingState = (key: keyof LoadingState, value: boolean) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

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
    fetchFolders();
  }, [fetchFolders]);

  const folderOptions = getFolderOptions(folders);

  const extractFileInfo = useCallback((file: File) => {
    const fileNameParts = file.name.split(".");
    const extension = fileNameParts.length > 1 ? fileNameParts.pop() : "";
    return {
      name: fileNameParts.join("."),
      extension: extension || "",
    };
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const { name, extension } = extractFileInfo(selectedFile);
      setFileExtension(extension);

      if (fileName === "" || fileName === name) {
        setFileName(name);
      }
    }
  }, [selectedFile, fileName, extractFileInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      // Edit mode - rename file
      if (!fileName.trim()) {
        setError("Nama file tidak boleh kosong");
        return;
      }

      const newFileName = `${fileName.trim()}${
        fileExtension ? `.${fileExtension}` : ""
      }`;

      setLoadingState("upload", true);
      setError(null);

      try {
        await callApi({
          action: "rename",
          fileId: file.id,
          fileName: newFileName,
          accessToken,
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/drive");
        }
      } catch (err) {
        console.error("Rename error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Rename failed. Please try again."
        );
      } finally {
        setLoadingState("upload", false);
      }
    } else {
      // Add mode - upload file
      if (!selectedFile) {
        setError("Please select a file to upload");
        return;
      }

      if (!fileName.trim()) {
        setError("Nama file tidak boleh kosong");
        return;
      }

      const newFileName = `${fileName.trim()}${
        fileExtension ? `.${fileExtension}` : ""
      }`;
      const renamedFile = new File([selectedFile], newFileName, {
        type: selectedFile.type,
        lastModified: Date.now(),
      });

      setLoadingState("upload", true);
      setError(null);

      const formData = new FormData();
      formData.append("file", renamedFile);
      formData.append("action", "upload");
      formData.append("accessToken", accessToken);
      formData.append("folderId", selectedFolderId);
      formData.append("fileName", newFileName);

      try {
        const result = await callApi(
          {
            action: "upload",
            accessToken,
          },
          formData
        );

        if (result.success) {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/admin/drive");
          }
        } else {
          throw new Error(result.message || "Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Upload failed. Please try again."
        );
      } finally {
        setLoadingState("upload", false);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolderId(e.target.value);
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

      <form onSubmit={handleSubmit}>
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
