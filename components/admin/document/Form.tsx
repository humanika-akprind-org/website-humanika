"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiFile, FiSend } from "react-icons/fi";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import { DocumentType as DocumentTypeEnum, Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { documentFolderId } from "@/lib/config/config";
import type { User } from "@/types/user";
import type { Event } from "@/types/event";
import type { Letter } from "@/types/letter";
import type { User } from "@/types/user";
import { useDocumentForm } from "@/hooks/document/useDocumentForm";

interface DocumentFormProps {
  document?: Document;
  onSubmit: (data: CreateDocumentInput | UpdateDocumentInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateDocumentInput | UpdateDocumentInput
  ) => Promise<void>;
  isLoading?: boolean;
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
  letters,
}: DocumentFormProps) {
  const router = useRouter();

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
              Document Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document name"
              required
              disabled={isLoadingState}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingState}
            >
              <option value="">Pilih Type</option>
              {Object.values(DocumentTypeEnum).map((type) => (
                <option key={type} value={type}>
                  {type
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingState}
            >
              {Object.values(Status).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Event
            </label>
            <select
              name="eventId"
              value={formData.eventId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingState}
            >
              <option value="">Pilih Event (Opsional)</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Letter
            </label>
            <select
              name="letterId"
              value={formData.letterId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingState}
            >
              <option value="">Pilih Letter (Opsional)</option>
              {letters.map((letter) => (
                <option key={letter.id} value={letter.id}>
                  {letter.number} - {letter.regarding}
                </option>
              ))}
            </select>
          </div>
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
            disabled={isLoadingState || fileLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FiSend className="mr-2" />
            {isLoadingState
              ? onSubmitForApproval
                ? "Mengajukan..."
                : "Menyimpan..."
              : onSubmitForApproval
              ? "Simpan"
              : document
              ? "Update Document"
              : "Create Document"}
          </button>
        </div>
      </form>
    </div>
  );
}