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
import type { Period } from "@/types/period";
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
    data: CreateDocumentInput | UpdateDocumentInput,
  ) => Promise<void>;
  loading?: boolean;
  events: Event[];
  letters: Letter[];
  periods?: Period[];
  fixedDocumentType?: string;
  isEditing?: boolean;
}

export default function DocumentForm({
  document,
  onSubmit,
  onSubmitForApproval,
  periods = [],
  fixedDocumentType,
  isEditing = false,
}: DocumentFormProps) {
  const router = useRouter();

  // Fetch document types
  const { documentTypes, isLoading: documentTypesLoading } = useDocumentTypes();

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
    onSubmit,
    onSubmitForApproval,
    fixedDocumentType,
    documentTypes,
  });

  const handleSelectChange = (name: string, value: string) => {
    handleInputChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  // Determine if the Type select should be hidden
  const normalizedFixed = fixedDocumentType
    ?.toLowerCase()
    .replace(/[\s\-]/g, "");
  const hideTypeSelect =
    normalizedFixed === "proposal" ||
    normalizedFixed === "accountabilityreport";

  // Dynamic label and placeholder based on fixedDocumentType
  const getDynamicLabel = (type?: string) => {
    if (!type) return "Document Name";
    if (type.toLowerCase() === "proposal") return "Proposal Name";
    if (type.toLowerCase().replace(/[\s\-]/g, "") === "accountabilityreport") {
      return "Accountability Report Name";
    }
    return "Document Name";
  };

  const getDynamicPlaceholder = (type?: string) => {
    if (!type) return "Enter document name";
    if (type.toLowerCase() === "proposal") return "Enter proposal name";
    if (type.toLowerCase().replace(/[\s\-]/g, "") === "accountabilityreport") {
      return "Enter accountability report name";
    }
    return "Enter document name";
  };

  const documentLabel = getDynamicLabel(fixedDocumentType);
  const documentPlaceholder = getDynamicPlaceholder(fixedDocumentType);

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
            label={documentLabel}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={documentPlaceholder}
            required
            icon={<FiBriefcase className="text-gray-400" />}
            disabled={isLoadingState}
          />

          {!hideTypeSelect && (
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
          )}

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
            label="Period"
            name="periodId"
            value={formData.periodId || ""}
            onChange={(value) => handleSelectChange("periodId", value)}
            options={periods.map((period) => ({
              value: period.id,
              label: period.name,
            }))}
            placeholder="Select period (optional)"
            icon={<FiCalendar className="text-gray-400" />}
            disabled={isLoadingState}
          />
        </div>

        <FileUpload
          label="Document File"
          existingFile={existingDocument}
          onRemoveFile={removeDocument}
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
          loadingText="Uploading file..."
          removeButtonText="Delete File"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <CancelButton
            onClick={() => router.back()}
            disabled={isLoadingState}
          />

          <SubmitButton
            isSubmitting={isLoadingState || fileLoading}
            text={isEditing ? "Update Document" : "Create Document"}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
}
