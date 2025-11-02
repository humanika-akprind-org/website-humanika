"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiFile, FiSend } from "react-icons/fi";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import { DocumentType as DocumentTypeEnum, Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { documentFolderId } from "@/lib/config";
import type { User } from "@/types/user";
import type { Event } from "@/types/event";
import type { Letter } from "@/types/letter";

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
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: fileLoading,
    error: fileError,
  } = useFile(accessToken);

  const [formData, setFormData] = useState({
    name: document?.name || "",
    type: document?.type || DocumentTypeEnum.OTHER,
    status: document?.status || Status.DRAFT,
    eventId: document?.eventId || "",
    letterId: document?.letterId || "",
    documentFile: undefined as File | undefined,
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingDocument, setExistingDocument] = useState<
    string | null | undefined
  >(document?.document);
  const [removedDocument, setRemovedDocument] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fileError) {
      setError(fileError);
    }
  }, [fileError]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFormData((prev) => ({ ...prev, documentFile: file }));
      setError(null);
      setRemovedDocument(false); // Reset removed state when new file is selected
    }
  };

  const removeDocument = () => {
    if (existingDocument) {
      // Mark document as removed for deletion during form submission
      setRemovedDocument(true);
    }

    // Clear form state
    setFormData((prev) => ({ ...prev, documentFile: undefined }));
    setExistingDocument(null);
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setIsLoadingState(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Please enter document name");
      }

      // Check if access token is available
      if (!accessToken) {
        throw new Error(
          "Authentication required. Please log in to Google Drive."
        );
      }

      // Handle document deletion if marked for removal
      let documentUrl: string | null | undefined = existingDocument;

      if (removedDocument) {
        // Delete from Google Drive and set documentUrl to null
        if (document?.document) {
          const fileId = getFileIdFromDocument(document.document);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete document:", deleteError);
              // Continue with submission even if delete fails
            }
          }
        }
        documentUrl = null;
      }

      if (formData.documentFile) {
        // Delete old document from Google Drive if it exists and wasn't already removed
        if (!removedDocument && document?.document) {
          const fileId = getFileIdFromDocument(document.document);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old document:", deleteError);
              // Continue with upload even if delete fails
            }
          }
        }

        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.documentFile,
          tempFileName,
          documentFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `document-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set the file to public access
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              documentUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for document");
            }
          } else {
            throw new Error("Failed to rename document");
          }
        } else {
          throw new Error("Failed to upload document");
        }
      }

      // Submit form data with document URL (exclude documentFile for server action)
      const { documentFile: _, ...dataToSend } = formData;

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        document: documentUrl,
        eventId: formData.eventId || undefined,
        letterId: formData.letterId || undefined,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval({ ...submitData, status: Status.PENDING });
      } else {
        await onSubmit(submitData);
      }

      // Reset form state after successful submission
      setRemovedDocument(false);

      router.push("/admin/administration/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save document");
    } finally {
      setIsLoadingState(false);
    }
  };

  // Helper function to get file ID from document (either URL or file ID)
  const getFileIdFromDocument = (
    doc: string | null | undefined
  ): string | null => {
    if (!doc) return null;

    if (doc.includes("drive.google.com")) {
      const fileIdMatch = doc.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return fileIdMatch ? fileIdMatch[1] : null;
    } else if (doc.match(/^[a-zA-Z0-9_-]+$/)) {
      return doc;
    }
    return null;
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
