"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type {
  OrganizationalStructure,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/types/structure";
import { Status } from "@/types/enums";
import { useStructureForm } from "@/hooks/structure/useStructureForm";
import { FiFile } from "react-icons/fi";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import Alert from "@/components/admin/ui/alert/Alert";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import TextInput from "@/components/admin/ui/input/TextInput";
import CancelButton from "@/components/ui/CancelButton";

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

// Helper function to get preview URL from structure image (file ID or URL)
const getStructureImageUrl = (
  structureImage: string | null | undefined
): string => {
  if (!structureImage) return "";

  if (structureImage.includes("drive.google.com")) {
    const fileIdMatch = structureImage.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return structureImage;
  } else if (structureImage.match(/^[a-zA-Z0-9_-]+$/)) {
    return `/api/drive-image?fileId=${structureImage}`;
  } else {
    return structureImage;
  }
};

interface StructureFormProps {
  structure?: OrganizationalStructure;
  onSubmit: (
    data:
      | CreateOrganizationalStructureInput
      | UpdateOrganizationalStructureInput
  ) => Promise<void>;
  isEdit?: boolean;
}

export default function StructureForm({
  structure,
  onSubmit,
  isEdit = false,
}: StructureFormProps) {
  const router = useRouter();

  const {
    formData,
    setFormData,
    periods,
    isLoading,
    alert,
    previewUrl,
    existingDecree,
    existingStructureImage,
    fileLoading,
    removeDecree,
    removeStructureImage,
    handleSubmit,
    handleFileChange,
    handleStructureImageChange,
  } = useStructureForm(structure, onSubmit);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {alert && <Alert type={alert.type} message={alert.message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Structure Name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter structure name"
            required
          />

          <SelectInput
            label="Period"
            name="periodId"
            value={formData.periodId}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, periodId: value }))
            }
            options={periods.map((period) => ({
              value: period.id,
              label: period.name,
            }))}
            placeholder="Pilih Periode"
            required
          />

          <SelectInput
            label="Status"
            name="status"
            value={formData.status}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, status: value as Status }))
            }
            options={Object.values(Status).map((status) => ({
              value: status,
              label: status,
            }))}
            required
          />
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
                    disabled={isLoading}
                  >
                    Remove File
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isLoading || fileLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload document (max 10MB, format: PDF, DOC, DOCX, JPG, PNG)
              </p>
              {fileLoading && (
                <p className="text-sm text-blue-600 mt-1">Uploading file...</p>
              )}
            </div>
          </div>
        </div>

        {/* Structure Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Structure Image
          </label>
          <div className="flex items-start space-x-4">
            {(previewUrl ||
              (existingStructureImage &&
                existingStructureImage.trim() !== "")) && (
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0">
                  {(() => {
                    // Get the display URL using the helper function
                    const displayUrl = getStructureImageUrl(
                      previewUrl || existingStructureImage
                    );

                    // Check if structure image exists and is a valid URL
                    if (displayUrl && isValidImageUrl(displayUrl)) {
                      return (
                        <div className="w-80 h-60 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                          <Image
                            src={displayUrl}
                            alt={formData.name || "Structure image"}
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
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={removeStructureImage}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={isLoading}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleStructureImageChange(file);
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isLoading || fileLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload image (max 10MB, format: JPG, PNG, GIF, WEBP)
              </p>
              {fileLoading && (
                <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <CancelButton onClick={() => router.back()} disabled={isLoading} />

          <SubmitButton
            isSubmitting={isLoading}
            text={isEdit ? "Update Structure" : "Add Structure"}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
}
