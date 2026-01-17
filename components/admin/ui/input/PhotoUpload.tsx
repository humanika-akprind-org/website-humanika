"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Crop } from "lucide-react";
import { cn } from "@/lib/utils";
import AccessTokenGuard from "./AccessTokenGuard";
import ImageCropper from "./ImageCropper";

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
  required?: boolean;
  error?: string;
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
  required = false,
  error,
}) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  // Function to handle cropped image upload
  const handleCroppedImageUpload = useCallback(
    async (croppedImg: string) => {
      try {
        // Convert base64/data URL to blob
        const response = await fetch(croppedImg);
        const blob = await response.blob();

        // Create a File object from the blob
        const file = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
        });

        // Call the parent's onFileChange with the cropped image file
        onFileChange(file);
      } catch (error) {
        console.error("Error uploading cropped image:", error);
      }
    },
    [onFileChange],
  );

  // Effect to handle cropped image upload
  useEffect(() => {
    if (croppedImage) {
      handleCroppedImageUpload(croppedImage);
    }
  }, [croppedImage, handleCroppedImageUpload]);

  // Effect to clear cropped image when preview URL changes
  useEffect(() => {
    setCroppedImage(null);
  }, [previewUrl]);

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

      // Reset crop-related state when new file is selected
      setCroppedImage(null);
      setCropModalOpen(false);

      onFileChange(file);
    }
  };

  // Function to get the display URL (prioritizes cropped image)
  const getDisplayUrl = (): string => {
    const imageUrl = getPreviewUrl(previewUrl || existingPhoto);
    return croppedImage || imageUrl;
  };

  return (
    <AccessTokenGuard label={label} required={required}>
      <div
        className={cn(
          "flex items-start space-x-4 p-4 rounded-lg border-2 transition-colors",
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white",
          className,
        )}
      >
        <div className="flex flex-col items-center">
          <div className="flex-shrink-0">
            {(() => {
              // Get the display URL (prioritizes cropped image)
              const displayUrl = getDisplayUrl();
              const hasError = displayUrl ? hasImageError(displayUrl) : true;

              // Show image if URL exists and no error
              if (displayUrl && !hasError) {
                return (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                    {displayUrl.startsWith("blob:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={displayUrl}
                        alt={alt}
                        className="w-full h-full object-cover rounded-full"
                        onError={() => handleImageError(displayUrl)}
                      />
                    ) : (
                      <Image
                        src={displayUrl}
                        alt={alt}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                        onError={() => handleImageError(displayUrl)}
                        unoptimized={true}
                      />
                    )}
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
          {(previewUrl || existingPhoto || croppedImage) && (
            <div className="flex gap-2 mt-2">
              {(previewUrl || existingPhoto) && (
                <button
                  type="button"
                  onClick={() => {
                    const url = getPreviewUrl(previewUrl || existingPhoto);
                    if (url) {
                      setOriginalImage(url);
                      setCropModalOpen(true);
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  disabled={isLoading || photoLoading}
                >
                  <Crop className="w-4 h-4 inline mr-1" />
                  Crop
                </button>
              )}
              {showRemoveButton &&
                (previewUrl ||
                  (existingPhoto && existingPhoto.trim() !== "") ||
                  croppedImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCroppedImage(null);
                      onRemovePhoto();
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={isLoading}
                  >
                    Hapus Foto
                  </button>
                )}
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
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* Crop Modal */}
      <ImageCropper
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={originalImage}
        onCropComplete={(croppedImg) => setCroppedImage(croppedImg)}
        aspect={1} // 1:1 aspect ratio for profile photo
      />
    </AccessTokenGuard>
  );
};

export default PhotoUpload;
