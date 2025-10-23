"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  OrganizationalStructure,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/types/structure";

import { useFile } from "@/hooks/useFile";
import { structureFolderId } from "@/lib/config";
import type { Period } from "@/types/period";
import { FiFile, FiEye } from "react-icons/fi";
import PreviewModal from "./modal/PreviewModal";

// Helper function to check if decree is from Google Drive (either URL or file ID)
const isGoogleDriveDecree = (decree: string | null | undefined): boolean => {
  if (!decree) return false;
  return (
    decree.includes("drive.google.com") ||
    decree.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

// Helper function to get file ID from decree (either URL or file ID)
const getFileIdFromDecree = (
  decree: string | null | undefined
): string | null => {
  if (!decree) return null;

  if (decree.includes("drive.google.com")) {
    const fileIdMatch = decree.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (decree.match(/^[a-zA-Z0-9_-]+$/)) {
    return decree;
  }
  return null;
};

interface StructureFormProps {
  structure?: OrganizationalStructure;
  onSubmit: (
    data:
      | CreateOrganizationalStructureInput
      | UpdateOrganizationalStructureInput
  ) => Promise<void>;
  isLoading?: boolean;
  accessToken: string;
  periods: Period[];
}

export default function StructureForm({
  structure,
  onSubmit,
  accessToken,
  periods,
}: StructureFormProps) {
  const router = useRouter();
  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: fileLoading,
    error: fileError,
  } = useFile(accessToken);

  const [formData, setFormData] = useState({
    name: structure?.name || "",
    periodId: structure?.period?.id || "",
    decreeFile: undefined as File | undefined,
    structure: structure?.structure || "",
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingDecree, setExistingDecree] = useState<
    string | null | undefined
  >(structure?.decree);
  const [removedDecree, setRemovedDecree] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fileError) {
      setError(fileError);
    }
  }, [fileError]);

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
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      if (
        !allowedTypes.some((type) => file.type.includes(type.split("/")[1]))
      ) {
        setError("Please select a valid document file");
        return;
      }

      setFormData((prev) => ({ ...prev, decreeFile: file }));
      setError(null);
      setRemovedDecree(false);
    }
  };

  const removeDecree = () => {
    if (isGoogleDriveDecree(existingDecree)) {
      setRemovedDecree(true);
    }
    setFormData((prev) => ({ ...prev, decreeFile: undefined }));
    setExistingDecree(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Please enter structure name");
      }
      if (!formData.periodId) {
        throw new Error("Please select a period");
      }

      let decreeUrl: string | null | undefined = existingDecree;

      // Handle decree deletion
      if (removedDecree) {
        if (structure?.decree && isGoogleDriveDecree(structure.decree)) {
          const fileId = getFileIdFromDecree(structure.decree);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete decree:", deleteError);
            }
          }
        }
        decreeUrl = null;
      }

      // Handle file upload
      if (formData.decreeFile) {
        // Delete old decree if exists
        if (
          !removedDecree &&
          structure?.decree &&
          isGoogleDriveDecree(structure.decree)
        ) {
          const fileId = getFileIdFromDecree(structure.decree);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old decree:", deleteError);
            }
          }
        }

        // Upload new file
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.decreeFile,
          tempFileName,
          structureFolderId
        );

        if (uploadedFileId) {
          const finalFileName = `structure-decree-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              decreeUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for decree");
            }
          } else {
            throw new Error("Failed to rename decree");
          }
        } else {
          throw new Error("Failed to upload decree");
        }
      }

      // Prepare and submit data
      const { decreeFile: _, ...dataToSend } = formData;
      const submitData = {
        ...dataToSend,
        decree: decreeUrl,
        structure: formData.structure || undefined,
      };

      await onSubmit(submitData);
      setRemovedDecree(false);
      router.push("/admin/governance/structure");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save organizational structure"
      );
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Structure Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter structure name"
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
                <option value="">Select Period</option>
                {(periods || []).map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Decree File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decree File (SK) *
            </label>
            <div className="flex items-start space-x-4">
              {existingDecree && existingDecree.trim() !== "" && (
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
                      <FiFile className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={removeDecree}
                      className="text-sm text-red-600 hover:text-red-800"
                      disabled={isLoadingState}
                    >
                      Remove File
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isLoadingState || fileLoading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload document (max 10MB, format: PDF, DOC, DOCX, XLS, XLSX,
                  PPT, PPTX, TXT, JPG, PNG, GIF)
                </p>
                {fileLoading && (
                  <p className="text-sm text-blue-600 mt-1">
                    Uploading file...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Structure Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Structure (HTML as string)
            </label>
            <textarea
              name="structure"
              value={formData.structure}
              onChange={handleInputChange}
              rows={10}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter structure as HTML string (optional)"
              disabled={isLoadingState}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={!formData.structure}
              >
                <FiEye className="w-4 h-4 mr-1" />
                Preview
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoadingState}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoadingState || fileLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isLoadingState ? (
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
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        structure={formData.structure}
        title={`${formData.name || "Structure"} Preview`}
      />
    </>
  );
}
