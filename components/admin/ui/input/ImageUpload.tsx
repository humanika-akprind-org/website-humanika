"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Crop } from "lucide-react";
import ImageCropper from "./ImageCropper";

interface ImageUploadProps {
  label: string;
  previewUrl: string | null;
  existingPhoto: string | null | undefined;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  previewWidth?: number;
  previewHeight?: number;
  aspect?: number;
  removeButtonText?: string;
  loadingText?: string;
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
  alt = "Image",
  className = "",
  previewWidth = 480,
  previewHeight = 270,
  aspect = 16 / 9,
  removeButtonText = "Hapus Thumbnail",
  loadingText = "Mengupload thumbnail...",
}) => {
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

        // Create a synthetic event to pass to onFileChange
        const syntheticEvent = {
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        // Call the parent's onFileChange with the cropped image
        onFileChange(syntheticEvent);
      } catch (error) {
        console.error("Error uploading cropped image:", error);
      }
    },
    [onFileChange]
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

  // Helper function to validate image URL
  const isValidImageUrl = (url: string): boolean => {
    // Handle relative URLs
    if (url.startsWith("/")) {
      return (
        url.startsWith("/api/drive-image") ||
        /\.(jpg|jpeg|png|gif|webp|svg)/i.test(url)
      );
    }

    // Handle absolute URLs
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
      if (file.size > maxSize) {
        alert(
          `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
        );
        return;
      }
      // Reset crop-related state when new file is selected
      setCroppedImage(null);
      setCropModalOpen(false);
    }
    onFileChange(e);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-start space-x-4">
        {(previewUrl || (existingPhoto && existingPhoto.trim() !== "")) && (
          <div className="flex flex-col items-center">
            <div className="flex-shrink-0">
              {(() => {
                // Prioritize cropped image, then preview URL, then existing photo
                const displayUrl =
                  croppedImage || getPreviewUrl(previewUrl || existingPhoto);

                // Check if thumbnail exists and is a valid URL
                if (displayUrl && isValidImageUrl(displayUrl)) {
                  return (
                    <div
                      className="bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden"
                      style={{
                        width: previewWidth,
                        height: previewHeight,
                      }}
                    >
                      {displayUrl.startsWith("blob:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={displayUrl}
                          alt={alt}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              displayUrl,
                              e
                            );
                          }}
                        />
                      ) : (
                        <Image
                          src={displayUrl}
                          alt={alt}
                          width={previewWidth}
                          height={previewHeight}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              displayUrl,
                              e
                            );
                          }}
                        />
                      )}
                    </div>
                  );
                } else {
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  );
                }
              })()}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const displayUrl = getPreviewUrl(previewUrl || existingPhoto);
                  if (displayUrl && isValidImageUrl(displayUrl)) {
                    setOriginalImage(displayUrl);
                    setCropModalOpen(true);
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
                disabled={
                  isLoading || !getPreviewUrl(previewUrl || existingPhoto)
                }
              >
                <Crop className="w-4 h-4 inline mr-1" />
                Crop Image
              </button>
              <button
                type="button"
                onClick={onRemovePhoto}
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
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading || photoLoading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload thumbnail (max 5MB, format: JPG, PNG, GIF)
          </p>
          {photoLoading && (
            <p className="text-sm text-blue-600 mt-1">{loadingText}</p>
          )}
        </div>
      </div>

      {/* Crop Modal */}
      <ImageCropper
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={originalImage}
        onCropComplete={(croppedImg) => setCroppedImage(croppedImg)}
        aspect={aspect}
      />
    </div>
  );
};

export default ImageUpload;
