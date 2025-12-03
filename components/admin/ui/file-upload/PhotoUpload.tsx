"use client";

import React, { useState } from "react";
import Image from "next/image";

// Helper function to extract file ID from various Google Drive URL formats
const extractFileId = (url: string): string | null => {
  if (!url) return null;

  // Handle direct file IDs
  if (url.length === 33 && !url.includes("/")) {
    return url;
  }

  // Handle Google Drive URLs
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /uc\?export=view&id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Helper function to get preview URL from photo (file ID or URL)
const getPreviewUrl = (
  photo: string | null | undefined,
  accessToken: string
): string | null => {
  if (!photo) return null;

  if (isGoogleDrivePhoto(photo)) {
    // Generate proxy image URL for preview
    const fileId = extractFileId(photo);
    if (!fileId) return null;

    return `/api/drive-image?fileId=${fileId}${
      accessToken ? `&accessToken=${accessToken}` : ""
    }`;
  } else {
    // It's a direct URL or other format
    return photo;
  }
};

// Helper function to check if photo is from Google Drive (either URL or file ID)
const isGoogleDrivePhoto = (photo: string | null | undefined): boolean => {
  if (!photo) return false;
  return (
    photo.includes("drive.google.com") ||
    photo.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

interface PhotoUploadProps {
  label: string;
  previewUrl: string | null;
  existingPhoto: string | null | undefined;
  accessToken: string;
  onFileChange: (file: File) => void;
  onRemovePhoto: () => void;
  isLoading: boolean;
  photoLoading: boolean;
  maxSize?: number; // in bytes, default 5MB
  accept?: string; // default "image/*"
  helpText?: string;
  alt?: string;
  showRemoveButton?: boolean;
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label,
  previewUrl,
  existingPhoto,
  accessToken,
  onFileChange,
  onRemovePhoto,
  isLoading,
  photoLoading,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/*",
  helpText = "Upload foto profil (max 5MB, format: JPG, PNG, GIF)",
  alt = "Profile photo",
  showRemoveButton = true,
  className = "",
}) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Check if image has errored
  const hasImageError = (url: string | null): boolean => {
    if (!url) return true;
    return imageErrors.has(url);
  };

  // Handle image error
  const handleImageError = (url: string) => {
    setImageErrors((prev) => new Set(prev).add(url));
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

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <div className="flex-shrink-0">
            {(() => {
              // Get the proxy image URL
              const proxyImageUrl = getPreviewUrl(
                previewUrl || existingPhoto,
                accessToken
              );
              const hasError = proxyImageUrl
                ? hasImageError(proxyImageUrl)
                : true;

              // Show image if URL exists and no error
              if (proxyImageUrl && !hasError) {
                return (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                    <Image
                      src={proxyImageUrl}
                      alt={alt}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                      onError={() => handleImageError(proxyImageUrl)}
                      unoptimized={true}
                    />
                  </div>
                );
              } else {
                // Show fallback avatar
                return (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                );
              }
            })()}
          </div>
          {showRemoveButton &&
            (previewUrl || (existingPhoto && existingPhoto.trim() !== "")) && (
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="text-sm text-red-600 hover:text-red-800"
                  disabled={isLoading}
                >
                  Hapus Foto
                </button>
              </div>
            )}
        </div>

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
            <p className="text-sm text-blue-600 mt-1">Mengupload foto...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
