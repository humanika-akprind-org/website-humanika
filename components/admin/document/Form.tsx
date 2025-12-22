"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiFile, FiBriefcase, FiFolder, FiCalendar } from "react-icons/fi";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import { Status } from "@/types/enums";
import type { User } from "@/types/user";
import type { Event } from "@/types/event";
import type { Letter } from "@/types/letter";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
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
  users?: User[];
  events: Event[];
  letters: Letter[];
}

export default function DocumentForm({
  document,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  users: _users,
  events,
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
    accessToken,
    onSubmit,
    onSubmitForApproval,
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

          {onSubmitForApproval ? null : (
            <SelectInput
              label="Status"
              name="status"
              value={formData.status}
              onChange={(value) => handleSelectChange("status", value)}
              options={Object.values(Status).map((status) => ({
                value: status,
                label:
                  status.charAt(0).toUpperCase() +
                  status.slice(1).toLowerCase(),
              }))}
              placeholder="Select status"
              icon={<FiBriefcase className="text-gray-400" />}
              disabled={isLoadingState}
            />
          )}

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document File
          </label>
          <div className="flex items-start space-x-4">
            {existingDocument && (
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
                    <FiFile className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={removeDocument}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={isLoadingState}
                  >
                    Hapus File
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
                <p className="text-sm text-blue-600 mt-1">Mengupload file...</p>
              )}
            </div>
          </div>
        </div>

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
