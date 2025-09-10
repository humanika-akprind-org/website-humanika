"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type {
  Management,
  ManagementFormData,
  ManagementServerData,
} from "@/types/management";
import { Department, Position } from "@/types/enums";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import { useManagementPhoto } from "@/hooks/management/useManagementPhoto";
import DeleteModal from "./modal/DeleteModal";
import { formatEnumValue } from "@/lib/utils";
import { managementFolderId } from "@/lib/config";
import { FiUser, FiCalendar, FiHome, FiBriefcase } from "react-icons/fi";

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
const getPreviewUrl = (photo: string | null | undefined): string | null => {
  if (!photo) return null;

  if (photo.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = photo.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    return photo;
  } else if (photo.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `https://drive.google.com/uc?export=view&id=${photo}`;
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

// Helper function to get file ID from photo (either URL or file ID)
const getFileIdFromPhoto = (
  photo: string | null | undefined
): string | null => {
  if (!photo) return null;

  if (photo.includes("drive.google.com")) {
    const fileIdMatch = photo.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (photo.match(/^[a-zA-Z0-9_-]+$/)) {
    return photo;
  }
  return null;
};

interface ManagementFormProps {
  accessToken: string;
  users: User[];
  periods: Period[];
  management?: Management;
  onSubmit: (data: ManagementServerData) => Promise<void>;
}

const ManagementForm: React.FC<ManagementFormProps> = ({
  accessToken,
  users,
  periods,
  management,
  onSubmit,
}) => {
  const router = useRouter();
  const {
    uploadPhoto,
    deletePhoto,
    renamePhoto,
    isLoading: photoLoading,
    error: photoError,
  } = useManagementPhoto(accessToken);

  const [formData, setFormData] = useState<ManagementFormData>({
    userId: management?.userId || "",
    periodId: management?.periodId || "",
    position: management?.position || Position.STAFF_DEPARTEMEN,
    department: management?.department || Department.INFOKOM,
    photoFile: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null | undefined>(
    management?.photo
  );

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    fileId: string | null;
    fileName: string;
  }>({
    isOpen: false,
    fileId: null,
    fileName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize preview URL when component mounts with existing data
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(management?.photo));
  }, [management?.photo]);

  // Update preview URL when existingPhoto changes
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(existingPhoto));
  }, [existingPhoto]);

  useEffect(() => {
    if (photoError) {
      setError(photoError);
    }
  }, [photoError]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      setFormData((prev) => ({ ...prev, photoFile: file }));
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removePhoto = () => {
    if (isGoogleDrivePhoto(existingPhoto)) {
    }

    // If it's a local file or no photo, just remove it
    setFormData((prev) => ({ ...prev, photoFile: undefined }));
    setPreviewUrl(null);
    setExistingPhoto(null);
  };

  const confirmDelete = async () => {
    if (!deleteModal.fileId) return;

    setIsDeleting(true);
    try {
      const success = await deletePhoto(deleteModal.fileId);

      if (success) {
        // Remove the photo from the form
        setFormData((prev) => ({ ...prev, photoFile: undefined }));
        setPreviewUrl(null);
        setExistingPhoto(null);
      }
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, fileId: null, fileName: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.userId) {
        throw new Error("Please select a user");
      }
      if (!formData.periodId) {
        throw new Error("Please select a period");
      }

      // Upload photo first if provided
      let photoUrl: string | null | undefined = existingPhoto;

      if (formData.photoFile) {
        // Delete old photo from Google Drive if it exists
        if (isGoogleDrivePhoto(existingPhoto)) {
          const fileId = getFileIdFromPhoto(existingPhoto);
          if (fileId) {
            try {
              await deletePhoto(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old photo:", deleteError);
              // Continue with upload even if delete fails
            }
          }
        }

        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadPhoto(
          formData.photoFile,
          tempFileName,
          managementFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renamePhoto hook
          const finalFileName = `management_${formData.userId}_${Date.now()}`;
          const renameSuccess = await renamePhoto(uploadedFileId, finalFileName);

          if (renameSuccess) {
            photoUrl = uploadedFileId;
          } else {
            throw new Error("Failed to rename photo");
          }
        } else {
          throw new Error("Failed to upload photo");
        }
      }

      // Submit form data with photo URL (exclude photoFile for server action)
      const { photoFile: _, ...dataToSend } = formData;
      await onSubmit({
        ...dataToSend,
        photo: photoUrl || null,
      });

      // If there was a file uploaded, run removePhoto logic to clean up form state
      if (formData.photoFile) {
        removePhoto();
      }

      router.push("/admin/governance/managements");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save management"
      );
    } finally {
      setIsLoading(false);
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
              User *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="">Pilih User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <select
                name="periodId"
                value={formData.periodId}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="">Pilih Periode</option>
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departemen *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiHome className="text-gray-400" />
              </div>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="">Pilih Departemen</option>
                {Object.values(Department).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posisi *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBriefcase className="text-gray-400" />
              </div>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                {Object.values(Position).map((pos) => (
                  <option key={pos} value={pos}>
                    {formatEnumValue(pos)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Profil
          </label>
          <div className="flex items-start space-x-4">
            {(previewUrl || (existingPhoto && existingPhoto.trim() !== "")) && (
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0">
                  {(() => {
                    // Get the display URL using the helper function
                    const displayUrl = getPreviewUrl(
                      previewUrl || existingPhoto
                    );

                    // Check if photo exists and is a valid URL
                    if (displayUrl && isValidImageUrl(displayUrl)) {
                      return (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                          <Image
                            src={displayUrl}
                            alt={management?.user?.name || "Management"}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-full"
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
                    onClick={removePhoto}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={isLoading}
                  >
                    Hapus Foto
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
                Upload foto profil (max 5MB, format: JPG, PNG, GIF)
              </p>
              {photoLoading && (
                <p className="text-sm text-blue-600 mt-1">Mengupload foto...</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
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

      <DeleteModal
        isOpen={deleteModal.isOpen}
        managementName={deleteModal.fileName}
        onClose={() =>
          setDeleteModal({ isOpen: false, fileId: null, fileName: "" })
        }
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManagementForm;
