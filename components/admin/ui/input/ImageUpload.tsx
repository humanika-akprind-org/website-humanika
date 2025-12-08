"use client";

import React from "react";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  previewUrl: string | null;
  existingPhoto: string | null | undefined;
  onFileChange: (file: File) => void;
  onRemovePhoto: () => void;
  isLoading: boolean;
  photoLoading: boolean;
  maxSize?: number; // in bytes, default 5MB
  accept?: string; // default "image/*"
  helpText?: string;
  alt?: string;
  showRemoveButton?: boolean;
  previewSize?: "small" | "medium" | "large"; // default "medium"
  previewShape?: "square" | "rectangle"; // default "square"
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  previewUrl,
  existingPhoto,
  onFileChange,
  onRemovePhoto,
  isLoading,
  photoLoading,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/*",
  helpText = "Upload image (max 5MB, format: JPG, PNG, GIF)",
  alt = "Image",
  showRemoveButton = true,
  previewSize = "medium",
  previewShape = "square",
  className = "",
}) => {
  // Helper function to validate image URL
  const isValidImageUrl = (url: string): boolean => {
    try {
      new URL(url);
      return (
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) ||
        url.includes("drive.google.com") ||
        url.startsWith("blob:")
      );
    } catch {
      return false;
    }
  };

  // Helper function to get preview URL from photo (file ID or URL)
  const getPreviewUrl = (photo: string | null | undefined): string => {
    if (!photo) return "";

    if (photo.includes("drive.google.com")) {
      const fileIdMatch = photo.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `/api/drive-image?fileId=${fileIdMatch[1]}`;
      }
      return photo;
    } else if (photo.match(/^[a-zA-Z0-9_-]+$/)) {
      return `/api/drive-image?fileId=${photo}`;
    } else {
      return photo;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      onFileChange(file);
    }
  };

  const getPreviewDimensions = () => {
    if (previewShape === "rectangle") {
      switch (previewSize) {
        case "small":
          return { width: 200, height: 150, containerClasses: "w-50 h-37" };
        case "large":
          return { width: 500, height: 375, containerClasses: "w-125 h-93" };
        default: // medium
          return { width: 320, height: 240, containerClasses: "w-80 h-60" };
      }
    } else {
      // square
      switch (previewSize) {
        case "small":
          return { width: 64, height: 64, containerClasses: "w-16 h-16" };
        case "large":
          return { width: 128, height: 128, containerClasses: "w-32 h-32" };
        default: // medium
          return { width: 96, height: 96, containerClasses: "w-24 h-24" };
      }
    }
  };

  const { width, height, containerClasses } = getPreviewDimensions();
  const hasImage = previewUrl || (existingPhoto && existingPhoto.trim() !== "");
  const displayUrl = getPreviewUrl(previewUrl || existingPhoto);
  const isValidUrl = displayUrl && isValidImageUrl(displayUrl);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-start space-x-4">
        {hasImage && (
          <div className="flex flex-col items-center">
            <div className="flex-shrink-0">
              {isValidUrl ? (
                <div
                  className={`${containerClasses} bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden`}
                >
                  <Image
                    src={displayUrl}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`w-full h-full ${
                      previewShape === "rectangle"
                        ? "object-contain"
                        : "object-cover rounded-lg"
                    }`}
                    onError={(e) => {
                      console.error("Image failed to load:", displayUrl, e);
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`${containerClasses} bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200`}
                >
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            {showRemoveButton && (
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="text-sm text-red-600 hover:text-red-800"
                  disabled={isLoading}
                >
                  Hapus {label.toLowerCase()}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex-1">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading || photoLoading}
          />
          <p className="text-sm text-gray-500 mt-1">{helpText}</p>
          {photoLoading && (
            <p className="text-sm text-blue-600 mt-1">
              Mengupload {label.toLowerCase()}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
