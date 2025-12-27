"use client";

import React, { useState } from "react";
import Image from "next/image";
import AccessTokenGuard from "./AccessTokenGuard";

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

interface PhotoUploadProps {
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
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label,
  previewUrl,
  existingPhoto,
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

  const hasImageError = (url: string) => imageErrors.has(url);

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
    <AccessTokenGuard label={label} required={true}>
      <div className={className}>
        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
            <div className="flex-shrink-0">
              {(() => {
                // Get the image URL
                const imageUrl = getPreviewUrl(previewUrl || existingPhoto);
                const hasError = imageUrl ? hasImageError(imageUrl) : true;

                // Show image if URL exists and no error
                if (imageUrl && !hasError) {
                  return (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={alt}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                        onError={() => handleImageError(imageUrl)}
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
              (previewUrl ||
                (existingPhoto && existingPhoto.trim() !== "")) && (
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
    </AccessTokenGuard>
  );
};

export default PhotoUpload;
