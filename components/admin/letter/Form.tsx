"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiFile } from "react-icons/fi";
import type {
  Letter,
  CreateLetterInput,
  UpdateLetterInput,
} from "@/types/letter";
import { LetterType, LetterPriority } from "@/types/enums";
import type { Period } from "@/types/period";
import type { Event } from "@/types/event";
import { useFile } from "@/hooks/useFile";
import { appConfig } from "@/lib/config/config";
import TextEditor from "@/components/admin/ui/text-area/TextEditor";

interface LetterFormProps {
  letter?: Letter;
  onSubmit: (data: CreateLetterInput | UpdateLetterInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateLetterInput | UpdateLetterInput
  ) => Promise<void>;
  isLoading?: boolean;
  accessToken?: string;
  periods?: Period[];
  events?: Event[];
  isEditing?: boolean;
}

interface LetterFormData {
  regarding: string;
  number: string;
  date: string;
  type: LetterType;
  priority: LetterPriority;
  origin: string;
  destination: string;
  body: string;
  letter: string;
  notes: string;
  periodId: string;
  eventId: string;
  letterFile?: File;
}

export default function LetterForm({
  letter,
  onSubmit,
  onSubmitForApproval,
  isLoading = false,
  accessToken,
  periods = [],
  events = [],
  isEditing = false,
}: LetterFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<LetterFormData>({
    regarding: "",
    number: "",
    date: "",
    type: LetterType.INCOMING,
    priority: LetterPriority.NORMAL,
    origin: "",
    destination: "",
    body: "",
    letter: "",
    notes: "",
    periodId: "",
    eventId: "",
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingLetter, setExistingLetter] = useState<string | undefined>(
    letter?.letter || undefined
  );
  const [removedLetter, setRemovedLetter] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: fileLoading,
    error: fileError,
  } = useFile(accessToken || "");

  useEffect(() => {
    if (letter) {
      setFormData({
        regarding: letter.regarding || "",
        number: letter.number || "",
        date: letter.date
          ? new Date(letter.date).toISOString().split("T")[0]
          : "",
        type: letter.type || LetterType.INCOMING,
        priority: letter.priority || LetterPriority.NORMAL,
        origin: letter.origin || "",
        destination: letter.destination || "",
        body: letter.body || "",
        letter: letter.letter || "",
        notes: letter.notes || "",
        periodId: letter.periodId || "",
        eventId: letter.eventId || "",
      });
      setExistingLetter(letter.letter || undefined);
    }
  }, [letter]);

  useEffect(() => {
    if (fileError) {
      setError(fileError);
    }
  }, [fileError]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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

      setFormData((prev) => ({ ...prev, letterFile: file }));
      setError(null);
      setRemovedLetter(false); // Reset removed state when new file is selected
    }
  };

  const removeLetter = () => {
    if (existingLetter) {
      // Mark letter as removed for deletion during form submission
      setRemovedLetter(true);
    }

    // Clear form state
    setFormData((prev) => ({
      ...prev,
      letterFile: undefined,
      letter: "",
    }));
    setExistingLetter(undefined);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.regarding.trim()) {
      newErrors.regarding = "Regarding is required";
    }
    if (!formData.number.trim()) {
      newErrors.number = "Letter number is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.origin.trim()) {
      newErrors.origin = "Origin is required";
    }
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoadingState(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.regarding.trim()) {
        throw new Error("Please enter letter regarding");
      }

      // Check if access token is available
      if (!accessToken) {
        throw new Error(
          "Authentication required. Please log in to Google Drive."
        );
      }

      // Handle letter deletion if marked for removal
      let letterUrl: string | undefined = undefined;

      if (removedLetter) {
        // Delete file from Google Drive if it exists
        if (letter?.letter) {
          const fileId = getFileIdFromLetter(letter.letter);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (error) {
              const deleteError = error as { status?: number };
              // Ignore 404 errors (file already deleted)
              if (!deleteError.status || deleteError.status !== 404) {
                console.warn("Failed to delete letter file:", deleteError);
              }
              // Continue with submission regardless of error
            }
          }
        }
        // Keep letterUrl as undefined to ensure removal from database
      } else {
        // If not removing, keep existing letter
        letterUrl = existingLetter || undefined;
      }

      if (formData.letterFile) {
        // Delete old letter from Google Drive if it exists and wasn't already removed
        if (!removedLetter && letter?.letter) {
          const fileId = getFileIdFromLetter(letter.letter);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (error) {
              const deleteError = error as { status?: number };
              // Only log non-404 errors (404 means file is already gone)
              if (!deleteError.status || deleteError.status !== 404) {
                console.warn("Failed to delete old letter:", deleteError);
              }
              // Continue with upload regardless of error
            }
          }
        }

        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.letterFile,
          tempFileName,
          appConfig.letterFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `letter-${formData.regarding
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set the file to public access
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              letterUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for letter");
            }
          } else {
            throw new Error("Failed to rename letter");
          }
        } else {
          throw new Error("Failed to upload letter");
        }
      }

      // Submit form data with letter URL (exclude letterFile for server action)
      const { letterFile: _, letter: __, ...dataToSend } = formData; // Exclude both letterFile and letter field

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        letter: removedLetter
          ? undefined
          : formData.letterFile
          ? letterUrl
          : existingLetter, // Set to undefined when removed, new url when uploading, or keep existing
        date: new Date(formData.date).toISOString(),
        periodId: formData.periodId || undefined,
        eventId: formData.eventId || undefined,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval(submitData);
      } else {
        await onSubmit(submitData);
      }

      // Reset form state after successful submission
      setRemovedLetter(false);

      router.push("/admin/administration/letters");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save letter");
    } finally {
      setIsLoadingState(false);
    }
  };

  // Helper function to get file ID from letter (either URL or file ID)
  const getFileIdFromLetter = (
    ltr: string | null | undefined
  ): string | null => {
    if (!ltr) return null;

    if (ltr.includes("drive.google.com")) {
      const fileIdMatch = ltr.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return fileIdMatch ? fileIdMatch[1] : null;
    } else if (ltr.match(/^[a-zA-Z0-9_-]+$/)) {
      return ltr;
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
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regarding *
            </label>
            <input
              type="text"
              value={formData.regarding}
              onChange={(e) => handleInputChange("regarding", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.regarding ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter letter regarding"
              disabled={isLoading}
            />
            {errors.regarding && (
              <p className="text-sm text-red-600 mt-1">{errors.regarding}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Letter Number *
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleInputChange("number", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.number ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter letter number"
              disabled={isLoading}
            />
            {errors.number && (
              <p className="text-sm text-red-600 mt-1">{errors.number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? "border-red-500" : "border-gray-200"
              }`}
              disabled={isLoading}
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {Object.values(LetterType).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {Object.values(LetterPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() +
                    priority.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin *
            </label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => handleInputChange("origin", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.origin ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter origin"
              disabled={isLoading}
            />
            {errors.origin && (
              <p className="text-sm text-red-600 mt-1">{errors.origin}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.destination ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter destination"
              disabled={isLoading}
            />
            {errors.destination && (
              <p className="text-sm text-red-600 mt-1">{errors.destination}</p>
            )}
          </div>
        </div>

        {/* Period and Event */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              value={formData.periodId}
              onChange={(e) => handleInputChange("periodId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">Select Period</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Event
            </label>
            <select
              value={formData.eventId}
              onChange={(e) => handleInputChange("eventId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body
          </label>
          <TextEditor
            value={formData.body || ""}
            onChange={(value) => handleInputChange("body", value)}
            disabled={isLoading}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notes"
            disabled={isLoading}
          />
        </div>

        {/* Letter File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Letter File
          </label>
          <div className="flex items-start space-x-4">
            {existingLetter && (
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
                    <FiFile className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={removeLetter}
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
                Upload letter file (max 10MB, format: PDF, DOC, DOCX, XLS, XLSX,
                PPT, PPTX, TXT, JPG, PNG, GIF)
              </p>
              {fileLoading && (
                <p className="text-sm text-blue-600 mt-1">Mengupload file...</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
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
                {onSubmitForApproval ? "Mengajukan..." : "Menyimpan..."}
              </>
            ) : onSubmitForApproval ? (
              "Ajukan Persetujuan"
            ) : isEditing ? (
              "Update Letter"
            ) : (
              "Create Letter"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
