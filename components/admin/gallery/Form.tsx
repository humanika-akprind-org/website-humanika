"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiImage, FiSave, FiX } from "react-icons/fi";
import type {
  Gallery,
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@/types/gallery";
import type { Event } from "@/types/event";
import { useEvents } from "@/hooks/event/useEvents";
import { useFile } from "@/hooks/useFile";
import { galleryFolderId } from "@/lib/config/config";

// Helper function to check if image is from Google Drive (either URL or file ID)
const isGoogleDriveImage = (image: string | null | undefined): boolean => {
  if (!image) return false;
  return (
    image.includes("drive.google.com") ||
    image.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

// Helper function to get file ID from image (either URL or file ID)
const getFileIdFromImage = (
  image: string | null | undefined
): string | null => {
  if (!image) return null;

  if (image.includes("drive.google.com")) {
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    return image;
  }
  return null;
};

interface GalleryFormProps {
  gallery?: Gallery;
  onSubmit: (data: CreateGalleryInput | UpdateGalleryInput) => Promise<void>;
  isLoading?: boolean;
  accessToken: string;
  events?: Event[];
}

export default function GalleryForm({
  gallery,
  onSubmit,
  isLoading,
  accessToken,
  events: propEvents,
}: GalleryFormProps) {
  const router = useRouter();
  const { events: hookEvents, isLoading: eventsLoading } = useEvents();
  const events = propEvents || hookEvents;
  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: photoLoading,
    error: photoError,
  } = useFile(accessToken);

  const [formData, setFormData] = useState({
    title: gallery?.title || "",
    eventId: gallery?.eventId || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    gallery?.image || null
  );
  const [removedFile, setRemovedFile] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (photoError) {
      setError(photoError);
    }
  }, [photoError]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, file: "File must be an image" }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "File size must be less than 5MB",
      }));
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemovedFile(false);
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.eventId) {
      newErrors.eventId = "Event is required";
    }

    if (!gallery && !selectedFile) {
      newErrors.file = "File is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let imageUrl: string | undefined = gallery?.image;

      if (selectedFile) {
        // Delete old image from Google Drive if it exists
        if (isGoogleDriveImage(gallery?.image)) {
          const fileId = getFileIdFromImage(gallery?.image);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old image:", deleteError);
              // Continue with upload even if delete fails
            }
          }
        }

        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          selectedFile,
          tempFileName,
          galleryFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `gallery-${formData.title
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set the file to public access
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              imageUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for image");
            }
          } else {
            throw new Error("Failed to rename image");
          }
        } else {
          throw new Error("Failed to upload image");
        }
      } else if (removedFile) {
        // If file was removed, delete from Google Drive and set imageUrl to undefined
        if (isGoogleDriveImage(gallery?.image)) {
          const fileId = getFileIdFromImage(gallery?.image);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete image:", deleteError);
              // Continue with submission even if delete fails
            }
          }
        }
        imageUrl = undefined;
      }

      const submitData = {
        title: formData.title,
        eventId: formData.eventId,
        ...(imageUrl && { image: imageUrl }),
      };

      await onSubmit(submitData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save gallery"
      );
    }
  };

  const removeFile = () => {
    if (selectedFile) {
      // If there's a newly selected file, remove it
      setSelectedFile(null);
      setPreviewUrl(gallery?.image || null);
      setRemovedFile(false);
    } else if (previewUrl) {
      // If there's an existing image being previewed, mark as removed
      setPreviewUrl(null);
      setRemovedFile(true);
    }
  };

  // Helper function to get preview URL from image (file ID or URL)
  const getPreviewUrl = (image: string | null | undefined): string => {
    if (!image) return "";

    if (image.includes("drive.google.com")) {
      // It's a full Google Drive URL, convert to direct image URL
      const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
      return image;
    } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
      // It's a Google Drive file ID, construct direct URL
      return `https://drive.google.com/uc?export=view&id=${image}`;
    } else {
      // It's a direct URL or other format
      return image;
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiImage className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter gallery title"
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Event */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiImage className="text-gray-400" />
                </div>
                <select
                  name="eventId"
                  required
                  value={formData.eventId}
                  onChange={handleInputChange}
                  disabled={eventsLoading}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.eventId && (
                <p className="text-red-500 text-xs mt-1">{errors.eventId}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File {!gallery && "*"}
              </label>

              {previewUrl && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    {previewUrl.includes("video") ? (
                      <video
                        src={previewUrl}
                        className="w-32 h-32 object-cover rounded-lg border"
                        controls
                      />
                    ) : (
                      <Image
                        src={getPreviewUrl(previewUrl)}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Remove file"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={isLoading || photoLoading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload image (max 5MB, format: JPG, PNG, GIF)
                  </p>
                  {photoLoading && (
                    <p className="text-sm text-blue-600 mt-1">
                      Mengupload gambar...
                    </p>
                  )}
                </div>
              </div>
              {errors.file && (
                <p className="text-red-500 text-xs mt-1">{errors.file}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || photoLoading}
              className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50"
            >
              <FiSave className="mr-2" />
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
