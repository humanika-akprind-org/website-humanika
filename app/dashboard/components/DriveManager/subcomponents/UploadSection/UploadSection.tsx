"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadSectionProps } from "../../types";

const UploadSection: React.FC<UploadSectionProps> = ({
  selectedFile,
  selectedFolderId,
  folderOptions,
  isLoading,
  onFileChange,
  onFileNameChange,
  onFolderChange,
  onUpload,
  onRename,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileNameInputRef = useRef<HTMLInputElement>(null);

  // Effect untuk mengatur nama file awal saat file dipilih
  useEffect(() => {
    if (selectedFile) {
      const fileNameParts = selectedFile.name.split(".");
      const extension = fileNameParts.length > 1 ? fileNameParts.pop() : "";
      setFileExtension(extension || "");

      if (
        fileName === "" ||
        fileName === selectedFile.name.replace(/\.[^/.]+$/, "")
      ) {
        setFileName(fileNameParts.join("."));
      }
    } else {
      setFileName("");
      setFileExtension("");
    }
  }, [selectedFile]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return;

    if (!fileName.trim()) {
      alert("Nama file tidak boleh kosong");
      return;
    }

    const newFileName = `${fileName.trim()}${
      fileExtension ? `.${fileExtension}` : ""
    }`;
    const renamedFile = new File([selectedFile], newFileName, {
      type: selectedFile.type,
      lastModified: Date.now(),
    });

    try {
      // Upload file dan dapatkan fileId
      const fileId = await onUpload(renamedFile);
      setUploadedFileId(fileId);

      // Panggil callback rename setelah upload selesai
      if (onRename) {
        onRename(fileId);
      }

      resetFileInput();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload gagal, silakan coba lagi");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e);
      setFileName("");
      setUploadedFileId(null); // Reset fileId saat file baru dipilih
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFileName(newName);
    if (onFileNameChange) {
      onFileNameChange(e);
    }

    // Jika file sudah diupload, panggil onRename saat nama diubah
    if (uploadedFileId && onRename) {
      onRename(uploadedFileId);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileName("");
    setFileExtension("");
    setUploadedFileId(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Tombol Add File */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Tambah File
      </button>

      {/* Modal Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Upload File Baru
                </h2>
                <button
                  onClick={resetFileInput}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama File
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        ref={fileNameInputRef}
                        value={fileName}
                        onChange={handleFileNameChange}
                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan nama file"
                        disabled={!selectedFile}
                        required
                      />
                      {fileExtension && (
                        <span className="bg-gray-100 px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md text-gray-500">
                          .{fileExtension}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {selectedFile
                        ? `File akan diupload sebagai: ${fileName}${
                            fileExtension ? `.${fileExtension}` : ""
                          }`
                        : "Pilih file terlebih dahulu"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      required
                    />
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        File dipilih:{" "}
                        <span className="font-medium">{selectedFile.name}</span>{" "}
                        ({Math.round(selectedFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Folder Tujuan
                    </label>
                    <select
                      value={selectedFolderId}
                      onChange={onFolderChange}
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

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetFileInput}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedFile || isLoading.upload}
                      className={`px-4 py-2 rounded-md text-white font-medium ${
                        selectedFile && !isLoading.upload
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Mengupload...
                        </span>
                      ) : (
                        "Upload File"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadSection;
