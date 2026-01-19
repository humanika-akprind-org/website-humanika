"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Crop } from "lucide-react";
import AccessTokenGuard from "./AccessTokenGuard";
import ImageCropper from "./ImageCropper";
import {
  FiFile,
  FiFileText,
  FiTable,
  FiImage,
  FiFileMinus,
} from "react-icons/fi";

interface FileUploadProps {
  label: string;
  previewUrl?: string | null;
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
  ownerEmail?: string;
  fileId?: string;
  maxSize?: number;
  // Crop related props
  enableCrop?: boolean;
  aspect?: number;
  showCropButton?: boolean;
  cropButtonText?: string;
  // Preview props
  previewWidth?: number;
  previewHeight?: number;
  alt?: string;
  className?: string;
}

// Helper type for file icon info
interface FileIconInfo {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  isImage?: boolean;
}

// Helper function to extract file extension from filename or URL
const getFileExtension = (filename: string): string => {
  // Handle Google Drive URLs
  if (filename.includes("drive.google.com")) {
    const fileIdMatch = filename.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      // Try to find extension in URL path or query params
      const pathMatch = filename.match(/\/([^\/?]+)\.([a-zA-Z0-9]+)(?:\?|$)/);
      if (pathMatch) {
        return pathMatch[2].toLowerCase();
      }

      // Check query parameters for export format (e.g., ?export=download&format=pdf)
      const formatMatch = filename.match(/[?&]format=([a-zA-Z0-9]+)/);
      if (formatMatch) {
        return formatMatch[1].toLowerCase();
      }

      // For Google Drive, we can't determine extension from URL
      // Return empty string, the caller should handle this case
      return "";
    }
  }

  // Handle regular URLs with query params
  if (filename.includes("?")) {
    const urlWithoutParams = filename.split("?")[0];
    return urlWithoutParams.split(".").pop()?.toLowerCase() || "";
  }

  // Handle regular filenames
  return filename.split(".").pop()?.toLowerCase() || "";
};

// Helper function to check if file is an image
const isImageFile = (filename: string): boolean => {
  // Handle Google Drive URLs
  if (filename.includes("drive.google.com")) {
    const fileIdMatch = filename.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      // For Google Drive URLs, we can't reliably determine if it's an image from the URL
      // However, we should allow it to try displaying the image
      return true;
    }
  }

  const extension = getFileExtension(filename);
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  return imageExtensions.includes(extension);
};

// Helper function to get file type and icon
const getFileIconInfo = (filename: string): FileIconInfo => {
  // Handle Google Drive URLs
  if (filename.includes("drive.google.com")) {
    const fileIdMatch = filename.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      // Check if extension exists in URL
      const pathMatch = filename.match(/\/([^\/?]+)\.([a-zA-Z0-9]+)(?:\?|$)/);
      if (pathMatch) {
        const extension = pathMatch[2].toLowerCase();
        const imageExtensions = [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "webp",
          "bmp",
          "svg",
        ];
        if (imageExtensions.includes(extension)) {
          return {
            icon: FiImage,
            color: "text-green-600",
            bgColor: "bg-green-100",
            isImage: true,
          };
        }

        if (extension === "pdf") {
          return {
            icon: FiFileMinus,
            color: "text-red-600",
            bgColor: "bg-red-100",
          };
        }

        const wordExtensions = ["doc", "docx"];
        if (wordExtensions.includes(extension)) {
          return {
            icon: FiFileText,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
          };
        }

        const excelExtensions = ["xls", "xlsx"];
        if (excelExtensions.includes(extension)) {
          return {
            icon: FiTable,
            color: "text-green-600",
            bgColor: "bg-green-100",
          };
        }

        const pptExtensions = ["ppt", "pptx"];
        if (pptExtensions.includes(extension)) {
          return {
            icon: FiFile,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
          };
        }
      }
      // For Google Drive URLs without extension, show image icon as potential image
      return {
        icon: FiImage,
        color: "text-green-600",
        bgColor: "bg-green-100",
        isImage: true,
      };
    }
  }

  const extension = getFileExtension(filename);

  // Image files
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  if (imageExtensions.includes(extension)) {
    return {
      icon: FiImage,
      color: "text-green-600",
      bgColor: "bg-green-100",
      isImage: true,
    };
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

// Helper function to get display URL for image preview (handles Google Drive URLs)
const getImageDisplayUrl = (filename: string): string | null => {
  if (!isImageFile(filename)) {
    return null;
  }

  // Handle Google Drive URLs
  if (filename.includes("drive.google.com")) {
    const fileIdMatch = filename.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
  }

  // For regular image URLs, return as-is
  return filename;
};

// Helper function to validate image URL
const isValidImageUrl = (url: string): boolean => {
  // Handle blob URLs directly (from FileReader)
  if (url.startsWith("blob:")) {
    return true;
  }

  // Handle data URLs (base64 from FileReader)
  if (url.startsWith("data:image/")) {
    return true;
  }

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
      url.includes("drive.google.com")
    );
  } catch {
    return false;
  }
};

export default function FileUpload({
  label,
  previewUrl: propPreviewUrl,
  existingFile,
  onRemoveFile,
  onFileChange,
  isLoading = false,
  fileLoading = false,
  accept,
  helpText = "Upload file (max 5MB, format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF)",
  loadingText = "Uploading file...",
  required = false,
  removeButtonText = "Delete File",
  error,
  ownerEmail,
  fileId,
  maxSize = 5 * 1024 * 1024,
  enableCrop = true,
  aspect = 16 / 9,
  showCropButton = true,
  cropButtonText = "Crop Image",
  previewWidth = 64,
  previewHeight = 64,
  alt = "File preview",
  className = "",
}: FileUploadProps) {
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string | null>(
    null,
  );

  // Track if a new file has been uploaded
  const [hasNewFile, setHasNewFile] = useState(false);

  // Track uploaded file for icon detection
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Track if image failed to load (for fallback to icon)
  const [imageLoadError, setImageLoadError] = useState(false);

  // Use prop preview URL if provided and non-empty, otherwise use internal state
  const previewUrl =
    propPreviewUrl && propPreviewUrl.trim() !== ""
      ? propPreviewUrl
      : internalPreviewUrl;

  // Function to handle cropped image upload
  const handleCroppedImageUpload = useCallback(
    async (croppedImg: string) => {
      try {
        const response = await fetch(croppedImg);
        const blob = await response.blob();

        const file = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
        });

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

  // Reset hasNewFile and imageLoadError when existingFile changes
  useEffect(() => {
    if (existingFile && existingFile.trim() !== "") {
      setHasNewFile(false);
      setImageLoadError(false);
      const isImg = isImageFile(existingFile);
      setIsImage(isImg);
      if (isImg) {
        setInternalPreviewUrl(getImageDisplayUrl(existingFile));
      } else {
        setInternalPreviewUrl(null);
      }
    } else {
      setInternalPreviewUrl(null);
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
      setSizeError(null);
      setCroppedImage(null);
      setCropModalOpen(false);
      setHasNewFile(true);
      setUploadedFile(file);
      setImageLoadError(false);
      onFileChange(file);

      // Set preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setInternalPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        setIsImage(true);
      } else {
        setInternalPreviewUrl(null);
        setIsImage(false);
      }
    }
  };

  // Get file icon info - prioritize existing file, then use internal preview for new uploads
  const getFileIcon = () => {
    // If we have an uploaded file (new upload), determine icon from file type
    if (uploadedFile) {
      const fileType = uploadedFile.type;
      const fileName = uploadedFile.name.toLowerCase();

      if (fileType.startsWith("image/")) {
        return {
          Icon: FiImage,
          bgColor: "bg-green-100",
          color: "text-green-600",
        };
      }

      if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
        return {
          Icon: FiFileMinus,
          bgColor: "bg-red-100",
          color: "text-red-600",
        };
      }

      if (
        fileType.includes("word") ||
        fileName.endsWith(".doc") ||
        fileName.endsWith(".docx")
      ) {
        return {
          Icon: FiFileText,
          bgColor: "bg-blue-100",
          color: "text-blue-600",
        };
      }

      if (
        fileType.includes("excel") ||
        fileType.includes("spreadsheet") ||
        fileName.endsWith(".xls") ||
        fileName.endsWith(".xlsx")
      ) {
        return {
          Icon: FiTable,
          bgColor: "bg-green-100",
          color: "text-green-600",
        };
      }

      if (
        fileType.includes("powerpoint") ||
        fileType.includes("presentation") ||
        fileName.endsWith(".ppt") ||
        fileName.endsWith(".pptx")
      ) {
        return {
          Icon: FiFile,
          bgColor: "bg-orange-100",
          color: "text-orange-600",
        };
      }

      // Default for unknown file types
      return {
        Icon: FiFile,
        bgColor: "bg-gray-100",
        color: "text-gray-600",
      };
    }

    // If we have an existing file, use its info
    if (existingFile && existingFile.trim() !== "") {
      const iconInfo = getFileIconInfo(existingFile);
      return {
        Icon: iconInfo.icon,
        bgColor: iconInfo.bgColor,
        color: iconInfo.color,
      };
    }

    // Default icon
    return {
      Icon: FiFile,
      bgColor: "bg-gray-100",
      color: "text-gray-600",
    };
  };

  const fileIcon = getFileIcon();

  // Helper function to get display URL (prioritize cropped image)
  const getDisplayUrl = () => {
    if (croppedImage) return croppedImage;
    return previewUrl;
  };

  return (
    <AccessTokenGuard label={label} required={required}>
      <div className={className}>
        <div
          className={`flex items-start space-x-4 p-4 rounded-lg border-2 cursor-pointer ${
            error || sizeError ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          onClick={() => {
            if (fileId) {
              window.open(
                `https://drive.google.com/file/d/${fileId}/view`,
                "_blank",
              );
            }
          }}
        >
          {(previewUrl ||
            (existingFile && existingFile.trim() !== "") ||
            hasNewFile) && (
            <div className="flex flex-col items-center">
              <div className="flex-shrink-0">
                {(() => {
                  // Prioritize cropped image, then preview URL, then existing file
                  const displayUrl = getDisplayUrl();

                  // Check if we have a valid image URL and image loaded successfully
                  if (
                    displayUrl &&
                    isValidImageUrl(displayUrl) &&
                    !imageLoadError
                  ) {
                    return (
                      <div
                        className="bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden"
                        style={{
                          width: previewWidth,
                          height: previewHeight,
                        }}
                      >
                        {displayUrl.startsWith("blob:") ||
                        displayUrl.startsWith("data:") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={displayUrl}
                            alt={alt}
                            className="w-full h-full object-cover"
                            onError={() => setImageLoadError(true)}
                          />
                        ) : (
                          <Image
                            src={displayUrl}
                            alt={alt}
                            width={previewWidth}
                            height={previewHeight}
                            className="w-full h-full object-cover"
                            unoptimized
                            onError={() => setImageLoadError(true)}
                          />
                        )}
                      </div>
                    );
                  } else {
                    // Show file type icon (fallback when image fails to load)
                    return (
                      <div
                        className={`rounded-full flex items-center justify-center border-2 border-gray-200 ${fileIcon.bgColor}`}
                        style={{
                          width: previewWidth,
                          height: previewHeight,
                        }}
                      >
                        <fileIcon.Icon
                          className={`w-8 h-8 ${fileIcon.color}`}
                        />
                      </div>
                    );
                  }
                })()}
              </div>
              <div className="flex gap-2 mt-2">
                {enableCrop && isImage && showCropButton && (
                  <button
                    type="button"
                    onClick={() => {
                      const displayUrl = getDisplayUrl();
                      if (displayUrl) {
                        setOriginalImage(displayUrl);
                        setCropModalOpen(true);
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    disabled={isLoading || !getDisplayUrl()}
                  >
                    <Crop className="w-4 h-4 inline mr-1" />
                    {cropButtonText}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCroppedImage(null);
                    setHasNewFile(false);
                    setUploadedFile(null);
                    onRemoveFile?.();
                  }}
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
            {helpText && (
              <p className="text-sm text-gray-500 mt-1">{helpText}</p>
            )}
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

        {/* Crop Modal */}
        <ImageCropper
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          imageSrc={originalImage}
          onCropComplete={(croppedImg) => setCroppedImage(croppedImg)}
          aspect={aspect}
        />
      </div>
    </AccessTokenGuard>
  );
}
