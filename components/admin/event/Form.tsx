"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Event, CreateEventInput, UpdateEventInput } from "@/types/event";
import { Department as DepartmentEnum, Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { useWorkPrograms } from "@/hooks/work-program/useWorkPrograms";
import { useEventCategories } from "@/hooks/event-category/useEventCategories";
import { eventThumbnailFolderId } from "@/lib/config/config";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import { FiSend } from "react-icons/fi";
import DescriptionEditor from "../ui/TextEditor";

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string): boolean => {
  const text = html.replace(/<[^>]*>/g, "").trim();
  return text.length === 0;
};

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

// Helper function to get preview URL from thumbnail (file ID or URL)
const getPreviewUrl = (thumbnail: string | null | undefined): string | null => {
  if (!thumbnail) return null;

  if (thumbnail.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = thumbnail.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    return thumbnail;
  } else if (thumbnail.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `https://drive.google.com/uc?export=view&id=${thumbnail}`;
  } else {
    // It's a direct URL or other format
    return thumbnail;
  }
};

// Helper function to check if thumbnail is from Google Drive (either URL or file ID)
const isGoogleDriveThumbnail = (
  thumbnail: string | null | undefined
): boolean => {
  if (!thumbnail) return false;
  return (
    thumbnail.includes("drive.google.com") ||
    thumbnail.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

// Helper function to get file ID from thumbnail (either URL or file ID)
const getFileIdFromThumbnail = (
  thumbnail: string | null | undefined
): string | null => {
  if (!thumbnail) return null;

  if (thumbnail.includes("drive.google.com")) {
    const fileIdMatch = thumbnail.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (thumbnail.match(/^[a-zA-Z0-9_-]+$/)) {
    return thumbnail;
  }
  return null;
};

interface EventFormProps {
  event?: Event;
  onSubmit: (data: CreateEventInput | UpdateEventInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateEventInput | UpdateEventInput
  ) => Promise<void>;
  isLoading?: boolean;
  accessToken?: string;
  users: User[];
  periods: Period[];
  isEditing?: boolean;
}

export default function EventForm({
  event,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  users,
  periods,
  isEditing = false,
}: EventFormProps) {
  const router = useRouter();
  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: photoLoading,
    error: photoError,
  } = useFile(accessToken);

  // Fetch work programs
  const { workPrograms, isLoading: workProgramsLoading } = useWorkPrograms();

  // Fetch event categories
  const { categories: eventCategories, isLoading: categoriesLoading } =
    useEventCategories();

  // Users and periods are now passed as props

  const [formData, setFormData] = useState({
    name: event?.name || "",
    description: event?.description || "",
    goal: event?.goal || "",
    department: event?.department || DepartmentEnum.BPH,
    periodId: event?.period?.id || "",
    responsibleId: event?.responsible?.id || "",
    startDate: event?.startDate
      ? new Date(event.startDate).toISOString().split("T")[0]
      : "",
    endDate: event?.endDate
      ? new Date(event.endDate).toISOString().split("T")[0]
      : "",
    funds: event?.funds || 0,
    workProgramId: event?.workProgram?.id || "",
    categoryId: event?.category?.id || "",
    thumbnailFile: undefined as File | undefined,
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<
    string | null | undefined
  >(event?.thumbnail);
  const [removedThumbnail, setRemovedThumbnail] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize preview URL when component mounts with existing data
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(event?.thumbnail));
  }, [event?.thumbnail]);

  // Update preview URL when existingThumbnail changes
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(existingThumbnail));
  }, [existingThumbnail]);

  useEffect(() => {
    if (photoError) {
      setError(photoError);
    }
  }, [photoError]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi file
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRemovedThumbnail(false); // Reset removed state when new file is selected
    }
  };

  const removeThumbnail = () => {
    if (isGoogleDriveThumbnail(existingThumbnail)) {
      // Mark thumbnail as removed for deletion during form submission
      setRemovedThumbnail(true);
    }

    // Clear form state
    setFormData((prev) => ({ ...prev, thumbnailFile: undefined }));
    setPreviewUrl(null);
    setExistingThumbnail(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Please enter event name");
      }
      if (isHtmlEmpty(formData.description)) {
        throw new Error("Please enter description");
      }
      if (!formData.goal.trim()) {
        throw new Error("Please enter goal");
      }
      if (!formData.periodId) {
        throw new Error("Please select a period");
      }
      if (!formData.responsibleId) {
        throw new Error("Please select responsible person");
      }
      if (!formData.startDate) {
        throw new Error("Please select start date");
      }
      if (!formData.endDate) {
        throw new Error("Please select end date");
      }
      if (formData.funds <= 0) {
        throw new Error("Funds must be greater than 0");
      }

      // Handle thumbnail deletion if marked for removal
      let thumbnailUrl: string | null | undefined = existingThumbnail;

      if (removedThumbnail) {
        // Delete from Google Drive and set thumbnailUrl to null
        if (event?.thumbnail && isGoogleDriveThumbnail(event.thumbnail)) {
          const fileId = getFileIdFromThumbnail(event.thumbnail);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete thumbnail:", deleteError);
              // Continue with submission even if delete fails
            }
          }
        }
        thumbnailUrl = null;
      }

      if (formData.thumbnailFile) {
        // Delete old thumbnail from Google Drive if it exists and wasn't already removed
        if (
          !removedThumbnail &&
          event?.thumbnail &&
          isGoogleDriveThumbnail(event.thumbnail)
        ) {
          const fileId = getFileIdFromThumbnail(event.thumbnail);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old thumbnail:", deleteError);
              // Continue with upload even if delete fails
            }
          }
        }

        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.thumbnailFile,
          tempFileName,
          eventThumbnailFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `event-thumbnail-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set the file to public access
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              thumbnailUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for thumbnail");
            }
          } else {
            throw new Error("Failed to rename thumbnail");
          }
        } else {
          throw new Error("Failed to upload thumbnail");
        }
      }

      // Submit form data with thumbnail URL (exclude thumbnailFile for server action)
      const { thumbnailFile: _, ...dataToSend } = formData;

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        thumbnail: thumbnailUrl,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        workProgramId:
          formData.workProgramId && formData.workProgramId.trim() !== ""
            ? formData.workProgramId
            : undefined,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval({ ...submitData, status: Status.PENDING });
      } else {
        await onSubmit(submitData);
      }

      // Reset form state after successful submission
      setRemovedThumbnail(false);

      router.push("/admin/program/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <h3 className="font-medium">Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event name"
              required
              disabled={isLoadingState}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingState}
            >
              <option value="">Pilih Department</option>
              {Object.values(DepartmentEnum).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget (IDR) *
            </label>
            <input
              type="number"
              name="funds"
              value={formData.funds}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              required
              disabled={isLoadingState}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingState}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingState}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period *
            </label>
            <select
              name="periodId"
              value={formData.periodId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingState}
            >
              <option value="">Pilih Period</option>
              {(periods || []).map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Program
            </label>
            <select
              name="workProgramId"
              value={formData.workProgramId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingState || workProgramsLoading}
            >
              <option value="">Pilih Work Program (Opsional)</option>
              {workPrograms.map((workProgram) => (
                <option key={workProgram.id} value={workProgram.id}>
                  {workProgram.name}
                </option>
              ))}
            </select>
            {workProgramsLoading && (
              <p className="text-sm text-gray-500 mt-1">
                Memuat work programs...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsible Person *
            </label>
            <select
              name="responsibleId"
              value={formData.responsibleId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingState}
            >
              <option value="">Pilih Person</option>
              {(users || []).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingState || categoriesLoading}
            >
              <option value="">Pilih Category (Opsional)</option>
              {eventCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoriesLoading && (
              <p className="text-sm text-gray-500 mt-1">Memuat categories...</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <DescriptionEditor
            value={formData.description}
            onChange={(data) =>
              setFormData((prev) => ({ ...prev, description: data }))
            }
            disabled={isLoadingState}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal *
          </label>
          <textarea
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter event goal"
            required
            disabled={isLoadingState}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail
          </label>
          <div className="flex items-start space-x-4">
            {(previewUrl ||
              (existingThumbnail && existingThumbnail.trim() !== "")) && (
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0">
                  {(() => {
                    // Get the display URL using the helper function
                    const displayUrl = getPreviewUrl(
                      previewUrl || existingThumbnail
                    );

                    // Check if thumbnail exists and is a valid URL
                    if (displayUrl && isValidImageUrl(displayUrl)) {
                      return (
                        <div className="w-80 h-60 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                          <Image
                            src={displayUrl}
                            alt={event?.name || "Event thumbnail"}
                            width={400}
                            height={300}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              console.error(
                                "Image failed to load:",
                                displayUrl,
                                e
                              );
                            }}
                          />
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
                    onClick={removeThumbnail}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={isLoadingState}
                  >
                    Hapus Thumbnail
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
                disabled={isLoadingState || photoLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload thumbnail (max 5MB, format: JPG, PNG, GIF)
              </p>
              {photoLoading && (
                <p className="text-sm text-blue-600 mt-1">
                  Mengupload thumbnail...
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoadingState}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoadingState || photoLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FiSend className="mr-2" />
            {isLoadingState
              ? onSubmitForApproval
                ? "Mengajukan..."
                : "Menyimpan..."
              : onSubmitForApproval
              ? "Ajukan Persetujuan"
              : isEditing
              ? "Update Event"
              : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
