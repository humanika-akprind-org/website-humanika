"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type {
  OrganizationalStructure,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/types/structure";
import { Status } from "@/types/enums";
import { useStructureForm } from "@/hooks/structure/useStructureForm";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import TextInput from "@/components/admin/ui/input/TextInput";
import CancelButton from "@/components/ui/CancelButton";
import ImageUpload from "@/components/admin/ui/input/ImageUpload";
import FileUpload from "@/components/admin/ui/input/FileUpload";
import { FiBriefcase, FiCalendar } from "react-icons/fi";
import {
  getGoogleDrivePreviewUrl,
  getFileIdFromFile,
} from "@/lib/google-drive/file-utils";

interface StructureFormProps {
  structure?: OrganizationalStructure;
  onSubmit: (
    data:
      | CreateOrganizationalStructureInput
      | UpdateOrganizationalStructureInput,
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
    previewUrl,
    existingDecree,
    existingStructureImage,
    fileLoading,
    errors,
    ownerEmail,
    removeDecree,
    removeStructureImage,
    handleSubmit,
    handleFileChange,
    handleStructureImageChange,
  } = useStructureForm(structure, onSubmit);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
            error={errors.name}
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
            icon={<FiCalendar className="text-gray-400" />}
            required
            error={errors.periodId}
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
            icon={<FiBriefcase className="text-gray-400" />}
            required
          />
        </div>

        <FileUpload
          label="Decree File (SK)"
          previewUrl={getGoogleDrivePreviewUrl(existingDecree)}
          existingFile={existingDecree}
          fileId={
            isEdit
              ? (getFileIdFromFile(existingDecree) ?? undefined)
              : undefined
          }
          onRemoveFile={removeDecree}
          onFileChange={handleFileChange}
          isLoading={isLoading}
          fileLoading={fileLoading}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          helpText="Upload document (max 5MB, format: PDF, DOC, DOCX, JPG, PNG)"
          loadingText="Uploading file..."
          removeButtonText="Hapus File"
          required
          error={errors.decreeFile}
          ownerEmail={ownerEmail || undefined}
          previewWidth={80}
          previewHeight={80}
          alt="Decree file preview"
        />

        {/* Structure Image Upload */}
        <ImageUpload
          label="Structure Image"
          previewUrl={previewUrl}
          existingPhoto={existingStructureImage}
          onFileChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleStructureImageChange(file);
          }}
          onRemovePhoto={removeStructureImage}
          isLoading={isLoading}
          photoLoading={fileLoading}
          maxSize={10 * 1024 * 1024}
          accept="image/*"
          helpText="Upload image (max 10MB, format: JPG, PNG, GIF, WEBP)"
          alt={formData.name || "Structure image"}
          previewWidth={240}
          previewHeight={320}
          aspect={3 / 4}
          removeButtonText="Remove Image"
          loadingText="Uploading image..."
          error={errors.structureImage}
          ownerEmail={ownerEmail || undefined}
        />

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
