"use client";

import React from "react";
import AccessTokenGuard from "./AccessTokenGuard";
import { FiFile } from "react-icons/fi";

interface FileUploadProps {
  label: string;
  existingFile?: string | null;
  onRemoveFile?: () => void;
  onFileChange: (file: File) => void;
  isLoading?: boolean;
  fileLoading?: boolean;
  accept?: string;
  helpText?: string;
  loadingText?: string;
  required?: boolean;
  removeButtonText?: string;
  error?: string;
}

export default function FileUpload({
  label,
  existingFile,
  onRemoveFile,
  onFileChange,
  isLoading = false,
  fileLoading = false,
  accept,
  helpText,
  loadingText = "Uploading file...",
  required = false,
  removeButtonText = "Remove File",
  error,
}: FileUploadProps) {
  return (
    <AccessTokenGuard label={label} required={required}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && "*"}
        </label>
        <div
          className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${
            error ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
        >
          {existingFile && existingFile.trim() !== "" && (
            <div className="flex flex-col items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
                  <FiFile className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={onRemoveFile}
                  className="text-sm text-red-600 hover:text-red-800"
                  disabled={isLoading}
                >
                  {removeButtonText}
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            <input
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileChange(file);
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isLoading || fileLoading}
            />
            {helpText && (
              <p className="text-sm text-gray-500 mt-1">{helpText}</p>
            )}
            {fileLoading && (
              <p className="text-sm text-blue-600 mt-1">{loadingText}</p>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </AccessTokenGuard>
  );
}
