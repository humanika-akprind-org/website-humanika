"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiBriefcase, FiFolder, FiCalendar } from "react-icons/fi";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import { Status } from "@/types/enums";
import type { Event } from "@/types/event";
import type { Letter } from "@/types/letter";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import FileUpload from "@/components/admin/ui/input/FileUpload";
import { useDocumentForm } from "@/hooks/document/useDocumentForm";
import { useDocumentTypes } from "@/hooks/document-type/useDocumentTypes";

interface DocumentFormProps {
  document?: Document;
  onSubmit: (data: CreateDocumentInput | UpdateDocumentInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateDocumentInput | UpdateDocumentInput
  ) => Promise<void>;
  loading?: boolean;
  accessToken: string;
  events: Event[];
  letters: Letter[];
  fixedDocumentType?: string;
}

export default function DocumentForm({
  document,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  events,
  fixedDocumentType,
}: DocumentFormProps) {
  const router = useRouter();

  // Fetch document types
  const { documentTypes, isLoading: documentTypesLoading } = useDocumentTypes();

  // Find documentTypeId for fixedDocumentType
  const fixedDocumentTypeId = fixedDocumentType
    ? documentTypes.find(
        (type) =>
          type.name.toLowerCase().replace(/[\s\-]/g, "") ===
          fixedDocumentType.toLowerCase().replace(/[\s\-]/g, "")
      )?.id || ""
    : "";

  const {
    formData,
    isLoadingState,
    error,
    existingDocument,
    fileLoading,
    handleInputChange,
    handleFileChange,
    removeDocument,
    handleSubmit,
  } = useDocumentForm({
    document,
    accessToken,
    onSubmit,
    onSubmitForApproval,
    fixedDocumentTypeId,
  });

  const handleSelectChange = (name: string, value: string) => {
    handleInputChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLSelectElement>);
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
          <TextInput
            label="Document Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter document name"
            required
            icon={<FiBriefcase className="text-gray-400" />}
            disabled={isLoadingState}
          />

          <SelectInput
            label="Type"
            name="documentTypeId"
            value={formData.documentTypeId}
            onChange={(value) => handleSelectChange("documentTypeId", value)}
            options={documentTypes.map((type) => ({
              value: type.id,
              label: type.name,
            }))}
            placeholder="Select type"
            required
            icon={<FiFolder className="text-gray-400" />}
            disabled={isLoadingState || documentTypesLoading}
          />

          <SelectInput
            label="Status"
            name="status"
            value={formData.status}
            onChange={(value) => handleSelectChange("status", value)}
            options={Object.values(Status).map((status) => ({
              value: status,
              label:
                status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
            }))}
            placeholder="Select status"
            icon={<FiBriefcase className="text-gray-400" />}
            disabled={isLoadingState}
          />

          <SelectInput
            label="Related Event"
            name="eventId"
            value={formData.eventId}
            onChange={(value) => handleSelectChange("eventId", value)}
            options={events.map((event) => ({
              value: event.id,
              label: event.name,
            }))}
            placeholder="Pilih Event (Opsional)"
            icon={<FiCalendar className="text-gray-400" />}
            disabled={isLoadingState}
          />
        </div>

        <FileUpload
          label="Document File"
          existingFile={existingDocument}
          onRemove={removeDocument}
          onFileChange={(file) => {
            const syntheticEvent = {
              target: { files: [file] as unknown as FileList },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileChange(syntheticEvent);
          }}
          isLoading={isLoadingState}
          fileLoading={fileLoading}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
          helpText="Upload document (max 10MB, format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF)"
          loadingText="Mengupload file..."
        />

        <div className="flex justify-end space-x-3 pt-4">
          <CancelButton
            onClick={() => router.back()}
            disabled={isLoadingState}
          />

          <SubmitButton
            isSubmitting={isLoadingState || fileLoading}
            text={
              onSubmitForApproval
                ? "Simpan"
                : document
                ? "Update Document"
                : "Create Document"
            }
            loadingText={onSubmitForApproval ? "Mengajukan..." : "Menyimpan..."}
          />
        </div>
      </form>
    </div>
  );
}
