"use client";

import React, { useState } from "react";
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

  const callApi = async (body: ApiRequestBody, formData?: FormData) => {
    const res = await fetch("/api/google-drive", {
      method: "POST",
      headers: formData ? undefined : { "Content-Type": "application/json" },
      body: formData ?? JSON.stringify(body),
    });
    return res.json();
  };

  const fetchFiles = async () => {
    const res = await fetch(
      `/api/google-drive-list?accessToken=${accessToken}`
    );
    const data = await res.json();
    if (data.success) {
      setFiles(data.files);
    }
  };

  const handleRename = async (fileId: string | null | undefined) => {
    const newName = prompt("Enter new name:");
    if (newName && typeof fileId === "string") {
      await callApi({
        action: "rename",
        fileId,
        fileName: newName,
        accessToken,
      });
      fetchFiles();
      alert("File renamed!");
    }
  };

  const handleDelete = async (fileId: string | null | undefined) => {
    if (
      confirm("Are you sure you want to delete this file?") &&
      typeof fileId === "string"
    ) {
      await callApi({ action: "delete", fileId, accessToken });
      fetchFiles();
      alert("File deleted!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please choose a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("action", "upload");
    formData.append("accessToken", accessToken);

    const result = await callApi({} as ApiRequestBody, formData);
    if (result.success) {
      fetchFiles();
      alert("File uploaded to Google Drive!");
      setSelectedFile(null);
      // Clear file input
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      alert("Upload failed: " + result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Google Drive Manager
      </h1>

      {/* Upload Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Upload Files
        </h2>
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <span className="sr-only">Choose file</span>
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
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              selectedFile
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Upload
          </button>
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium">{selectedFile.name}</span> (
            {Math.round(selectedFile.size / 1024)} KB)
          </p>
        )}
      </div>

      {/* File List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Files</h2>
        {files?.length ? (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
            {files.map((file) => (
              <li
                key={file.id}
                className="p-3 hover:bg-gray-50 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
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
                  <span className="text-gray-800">{file.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRename(file.id)}
                    className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 border border-yellow-200"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
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
        )}
      </div>
    </div>
  );
}
