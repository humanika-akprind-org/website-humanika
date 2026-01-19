"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AccessTokenGuard from "./AccessTokenGuard";
import {
  FiFile,
  FiFileText,
  FiTable,
  FiImage,
  FiFileMinus,
} from "react-icons/fi";

interface FileUploadProps {
  label: string;
  existingFile?: string | null;
  onRemoveFile?: () => void;
  onFileChange: (file: File) => void;
  isLoading?: boolean;
  fileLoading?: boolean;
  accept?: string;
  helpText?: string; // default "Upload file (max 5MB, format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)"
  loadingText?: string;
  required?: boolean;
  removeButtonText?: string;
  error?: string;
  ownerEmail?: string;
  maxSize?: number; // in bytes, default 5MB
}

// Helper type for file icon info
interface FileIconInfo {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

// Helper function to get file type and icon
const getFileIconInfo = (filename: string): FileIconInfo => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  // Image files
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  if (imageExtensions.includes(extension)) {
    return { icon: FiImage, color: "text-green-600", bgColor: "bg-green-100" };
  }

  // PDF files
  if (extension === "pdf") {
    return { icon: FiFileMinus, color: "text-red-600", bgColor: "bg-red-100" };
  }

  // Word documents
  const wordExtensions = ["doc", "docx"];
  if (wordExtensions.includes(extension)) {
    return { icon: FiFileText, color: "text-blue-600", bgColor: "bg-blue-100" };
  }

  // Excel spreadsheets
  const excelExtensions = ["xls", "xlsx"];
  if (excelExtensions.includes(extension)) {
    return { icon: FiTable, color: "text-green-600", bgColor: "bg-green-100" };
  }

  // PowerPoint presentations
  const pptExtensions = ["ppt", "pptx"];
  if (pptExtensions.includes(extension)) {
    return { icon: FiFile, color: "text-orange-600", bgColor: "bg-orange-100" };
  }

  // Default file icon
  return { icon: FiFile, color: "text-gray-600", bgColor: "bg-gray-100" };
};

// Helper function to check if file is an image
const isImageFile = (filename: string): boolean => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  return imageExtensions.includes(extension);
};

export default function FileUpload({
  label,
  existingFile,
  onRemoveFile,
  onFileChange,
  isLoading = false,
  fileLoading = false,
  accept,
  helpText = "Upload file (max 5MB, format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)",
  loadingText = "Uploading file...",
  required = false,
  removeButtonText = "Remove File",
  error,
  ownerEmail,
  maxSize = 5 * 1024 * 1024, // 5MB default
}: FileUploadProps) {
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);

  // Reset preview when existingFile changes
  useEffect(() => {
    if (existingFile && existingFile.trim() !== "") {
      setIsImage(isImageFile(existingFile));
      // For images, try to use the URL as preview
      if (isImageFile(existingFile)) {
        setPreviewUrl(existingFile);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
      setIsImage(false);
    }
  }, [existingFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        setSizeError(
          `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
        );
        return;
      }
      // Clear size error when valid file is selected
      setSizeError(null);
      onFileChange(file);

      // Set preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        setIsImage(true);
      } else {
        setPreviewUrl(null);
        setIsImage(false);
      }
    }
  };

  // Get file icon for non-image files
  const fileIconInfo = existingFile ? getFileIconInfo(existingFile) : null;
  const FileIcon = fileIconInfo?.icon || FiFile;

  return (
    <AccessTokenGuard label={label} required={required}>
      <div
        className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${
          error || sizeError ? "border-red-300 bg-red-50" : "border-gray-200"
        }`}
      >
        {existingFile && existingFile.trim() !== "" && (
          <div className="flex flex-col items-center">
            <div className="flex-shrink-0">
              {isImage && previewUrl ? (
                // Image preview
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  {previewUrl.startsWith("blob:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="File preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={previewUrl}
                      alt="File preview"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  )}
                </div>
              ) : (
                // File type icon
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 ${fileIconInfo?.bgColor}`}
                >
                  <FileIcon className={`w-8 h-8 ${fileIconInfo?.color}`} />
                </div>
              )}
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
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading || fileLoading}
          />
          {helpText && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}
          {fileLoading && (
            <p className="text-sm text-blue-600 mt-1">{loadingText}</p>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {sizeError && <p className="text-red-500 text-xs mt-1">{sizeError}</p>}
      {ownerEmail && (
        <p className="text-amber-600 text-xs mt-1">
          Use email {ownerEmail} to edit this file!
        </p>
      )}
    </AccessTokenGuard>
  );
}
