"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Crop } from "lucide-react";
import {
  FiFile,
  FiFileText,
  FiTable,
  FiImage,
  FiFileMinus,
  FiRefreshCw,
} from "react-icons/fi";
import ImageCropper from "./ImageCropper";
import AccessTokenGuard from "./AccessTokenGuard";

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
  helpText?: string; // default "Upload thumbnail (max 5MB, format: JPG, PNG, GIF)"
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
  required?: boolean;
  error?: string;
  ownerEmail?: string;
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

// Helper function to check if file is PDF
const isPDFFile = (file: File | string): boolean => {
  if (file instanceof File) {
    return (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    );
  }
  return (
    file.toLowerCase().endsWith(".pdf") || file.includes("application/pdf")
  );
};

// Helper function to check if file is an Office document (DOC, DOCX, XLS, XLSX, PPT, PPTX)
const isOfficeDocument = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  const fileType = file.type;

  const officeExtensions = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"];

  const officeMimeTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  return (
    officeExtensions.some((ext) => fileName.endsWith(ext)) ||
    officeMimeTypes.some((mime) =>
      fileType.includes(mime.split("/").pop() || ""),
    )
  );
};

// Helper function to compress image file
const compressImage = async (
  file: File,
  maxSizeMB: number = 5,
  quality: number = 0.8,
  maxWidth: number = 1920,
): Promise<File> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Scale down if width exceeds maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              // If still too large, reduce quality further
              if (compressedFile.size > maxSizeMB * 1024 * 1024) {
                resolve(
                  compressImage(file, maxSizeMB, quality - 0.1, maxWidth),
                );
              } else {
                resolve(compressedFile);
              }
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          quality,
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
  });

// Helper function to compress Office document
const compressOfficeDocument = async (
  file: File,
  _maxSizeMB: number = 5,
): Promise<File> => {
  try {
    const originalSize = file.size;

    // For Office documents, we can try to compress by:
    // 1. Converting to a more efficient format where possible
    // 2. Removing unnecessary metadata

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Create a compressed version by using compression API if available
    // Most browsers support CompressionStream for gzip/deflate

    try {
      // Try using CompressionStream if available
      if (typeof CompressionStream !== "undefined") {
        const compressionStream = new CompressionStream("gzip");
        const reader = new ReadableStream({
          start(controller) {
            controller.enqueue(new Uint8Array(arrayBuffer));
            controller.close();
          },
        }).pipeThrough(compressionStream);

        const chunks: Blob[] = [];
        const reader2 = reader.getReader();
        while (true) {
          const { done, value } = await reader2.read();
          if (done) break;
          chunks.push(new Blob([value]));
        }

        // Combine chunks - but this creates a gzip compressed file
        // which won't be a valid Office document
        // So this approach doesn't work for documents that need to remain readable
      }
    } catch (_e) {
      // CompressionStream not available or failed, continue with original
    }

    // For Office documents, we can't easily compress without specialized libraries
    // that can restructure the internal XML files
    // For now, return the original file with a warning
    // In a production environment, you would use libraries like:
    // - docx (for Word)
    // - xlsx (for Excel)
    // - pptx (for PowerPoint)
    // to parse and rebuild with optimized settings

    console.log(
      `Office document size: ${Math.round(originalSize / 1024 / 1024)}MB (compression not fully supported in browser)`,
    );

    // Return original file - in production, implement proper Office document compression
    return file;
  } catch (error) {
    console.error("Error compressing Office document:", error);
    return file;
  }
};

// Helper function to get file type category
const getFileTypeCategory = (
  file: File,
): "image" | "pdf" | "office" | "other" => {
  if (file.type.startsWith("image/")) return "image";
  if (isPDFFile(file)) return "pdf";
  if (isOfficeDocument(file)) return "office";
  return "other";
};

// Unified compression function - skips PDF compression
const compressFile = async (
  file: File,
  maxSizeMB: number = 5,
): Promise<File> => {
  const category = getFileTypeCategory(file);

  // Skip compression for PDFs
  if (category === "pdf") {
    console.log("PDF compression skipped");
    return file;
  }

  switch (category) {
    case "image":
      return compressImage(file, maxSizeMB, 0.8, 1920);
    case "office":
      return compressOfficeDocument(file, maxSizeMB);
    default:
      return file;
  }
};

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
  required = false,
  error,
  ownerEmail,
  helpText = "Upload thumbnail (max 5MB, format: JPG, PNG, GIF)",
}) => {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Track if file has been converted (for files > 5MB)
  const [isConverted, setIsConverted] = useState(false);

  // Track conversion loading state
  const [isConverting, setIsConverting] = useState(false);

  // Track uploaded file for conversion
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Track uploaded file for icon detection
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Track if image failed to load (for fallback to icon)
  const [imageLoadError, setImageLoadError] = useState(false);

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

        // Call the parent's onFileChange with the File
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

  // Handle file conversion for large files (compress except PDF)
  const handleConvertFile = async () => {
    if (!uploadedFile) return;

    const fileCategory = getFileTypeCategory(uploadedFile);

    // Show appropriate message based on file type
    if (fileCategory === "pdf") {
      setSizeError(
        `PDF files cannot be compressed. Please upload a smaller file (max 5MB).`,
      );
      return;
    }

    setIsConverting(true);
    try {
      const compressedFile = await compressFile(uploadedFile, 5);

      // Check if compression actually reduced the file size
      if (compressedFile.size >= uploadedFile.size) {
        const fileTypeName =
          fileCategory === "office"
            ? "Office document"
            : fileCategory === "image"
              ? "Image"
              : "File";
        setSizeError(
          `${fileTypeName} file is already optimized. Please upload a smaller file (max 5MB).`,
        );
      } else {
        setIsConverted(true);
        setSizeError(null);
        onFileChange(compressedFile);

        // Update preview with compressed image
        if (compressedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setCroppedImage(reader.result as string);
          };
          reader.readAsDataURL(compressedFile);
        }
      }
    } catch (error) {
      console.error("Error converting file:", error);
      setSizeError("Failed to convert file. Please try a different file.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Reset conversion states
      setIsConverted(false);
      setIsConverting(false);
      setUploadedFile(file);
      setCurrentFile(file);
      setImageLoadError(false);

      const fileCategory = getFileTypeCategory(file);

      if (file.size > maxSize) {
        // Show appropriate error message based on file type
        if (fileCategory === "image") {
          setSizeError(
            `File size is ${Math.round(file.size / (1024 * 1024))}MB. Click "Compress File" to reduce its size.`,
          );
        } else if (fileCategory === "pdf") {
          setSizeError(
            `File size is ${Math.round(file.size / (1024 * 1024))}MB. PDF compression is not supported. Please upload a smaller file.`,
          );
        } else if (fileCategory === "office") {
          setSizeError(
            `File size is ${Math.round(file.size / (1024 * 1024))}MB. Click "Compress File" to optimize document.`,
          );
        } else {
          setSizeError(
            `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
          );
        }
      } else {
        setSizeError(null);
        onFileChange(file);
      }
      // Reset crop-related state when new file is selected
      setCroppedImage(null);
      setCropModalOpen(false);

      // Set preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCroppedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Get file icon info - prioritize uploaded file, then use existing photo
  const getFileIcon = () => {
    // If we have an uploaded file (new upload), determine icon from file type
    if (currentFile) {
      const fileType = currentFile.type;
      const fileName = currentFile.name.toLowerCase();

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

    // If we have an existing photo, use its info
    if (existingPhoto && existingPhoto.trim() !== "") {
      const iconInfo = getFileIconInfo(existingPhoto);
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
    return getPreviewUrl(previewUrl || existingPhoto);
  };

  return (
    <AccessTokenGuard label={label} required={required}>
      <div className={className}>
        <div
          className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${
            error || sizeError ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
        >
          {(previewUrl ||
            (existingPhoto && existingPhoto.trim() !== "") ||
            currentFile) && (
            <div className="flex flex-col items-center">
              <div className="flex-shrink-0">
                {(() => {
                  // Prioritize cropped image, then preview URL, then existing photo
                  const displayUrl = getDisplayUrl();

                  // Check if we have a valid image URL and image loaded successfully
                  if (
                    displayUrl &&
                    isValidImageUrl(displayUrl) &&
                    !imageLoadError
                  ) {
                    return (
                      <div
                        className="bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden"
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
                            className="w-full h-full object-contain rounded-lg"
                            onError={() => setImageLoadError(true)}
                          />
                        ) : (
                          <Image
                            src={displayUrl}
                            alt={alt}
                            width={previewWidth}
                            height={previewHeight}
                            className="w-full h-full object-contain rounded-lg"
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
                        className={`rounded-lg flex items-center justify-center border-2 border-gray-200 ${fileIcon.bgColor}`}
                        style={{
                          width: previewWidth,
                          height: previewHeight,
                        }}
                      >
                        <fileIcon.Icon
                          className={`w-12 h-12 ${fileIcon.color}`}
                        />
                      </div>
                    );
                  }
                })()}
              </div>
              <div className="flex gap-2">
                {/* Compress button for large files (> 5MB) - skip for PDF */}
                {uploadedFile &&
                  uploadedFile.size > maxSize &&
                  !isConverted &&
                  !isPDFFile(uploadedFile) && (
                    <button
                      type="button"
                      onClick={handleConvertFile}
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      disabled={isLoading || isConverting}
                    >
                      <FiRefreshCw
                        className={`w-4 h-4 inline mr-1 ${
                          isConverting ? "animate-spin" : ""
                        }`}
                      />
                      {isConverting ? "Converting..." : "Compress File"}
                    </button>
                  )}
                {/* Crop button only for images */}
                {croppedImage && isValidImageUrl(croppedImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (croppedImage) {
                        setOriginalImage(croppedImage);
                        setCropModalOpen(true);
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    disabled={isLoading || !croppedImage}
                  >
                    <Crop className="w-4 h-4 inline mr-1" />
                    Crop Image
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCroppedImage(null);
                    setCurrentFile(null);
                    setUploadedFile(null);
                    setIsConverted(false);
                    onRemovePhoto();
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
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isLoading || photoLoading}
            />
            {helpText && (
              <p className="text-sm text-gray-500 mt-1">{helpText}</p>
            )}
            {photoLoading && (
              <p className="text-sm text-blue-600 mt-1">{loadingText}</p>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {sizeError && <p className="text-red-500 text-xs mt-1">{sizeError}</p>}

        {/* Owner email alert */}
        {ownerEmail && (
          <p className="text-amber-600 text-xs mt-1">
            Use email {ownerEmail} to edit this thumbnail!
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
};

export default ImageUpload;
