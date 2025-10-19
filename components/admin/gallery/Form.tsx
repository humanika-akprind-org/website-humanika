"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Gallery, CreateGalleryInput, UpdateGalleryInput } from "@/types/gallery";
import type { Event } from "@/types/event";
import { useEvents } from "@/hooks/useEvents";
import { useFile } from "@/hooks/useFile";
import { galleryFolderId } from "@/lib/config";

// Helper function to check if image is from Google Drive (either URL or file ID)
const isGoogleDriveImage = (
  image: string | null | undefined
): boolean => {
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

export default function GalleryForm({ gallery, onSubmit, isLoading, accessToken, events: propEvents }: GalleryFormProps) {
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(gallery?.image || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (photoError) {
      setError(photoError);
    }
  }, [photoError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, file: "File must be an image" }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: "File size must be less than 5MB" }));
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: "" }));
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
      }

      const submitData = {
        title: formData.title,
        eventId: formData.eventId,
        ...(imageUrl && { image: imageUrl }),
      };

      await onSubmit(submitData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save gallery");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(gallery?.image || null);
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
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <h3 className="font-medium">Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter gallery title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Event */}
        <div>
          <label htmlFor="eventId" className="block text-sm font-medium text-gray-700">
            Event *
          </label>
          <select
            id="eventId"
            name="eventId"
            value={formData.eventId}
            onChange={handleInputChange}
            disabled={eventsLoading}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
          {errors.eventId && <p className="mt-1 text-sm text-red-600">{errors.eventId}</p>}
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
          {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || photoLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
