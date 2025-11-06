"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type {
  Finance,
  CreateFinanceInput,
  UpdateFinanceInput,
} from "@/types/finance";
import { FinanceType, Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { financeFolderId } from "@/lib/config";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import type { FinanceCategory } from "@/types/finance-category";
import type { Event } from "@/types/event";
import DescriptionEditor from "../ui/TextEditor";

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string): boolean => {
  const text = html.replace(/<[^>]*>/g, "").trim();
  return text.length === 0;
};

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

// Helper function to get preview URL from proof (file ID or URL)
const getPreviewUrl = (proof: string | null | undefined): string | null => {
  if (!proof) return null;

  if (proof.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = proof.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    return proof;
  } else if (proof.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `https://drive.google.com/uc?export=view&id=${proof}`;
  } else {
    // It's a direct URL or other format
    return proof;
  }
};

// Helper function to check if proof is from Google Drive (either URL or file ID)
const isGoogleDriveProof = (proof: string | null | undefined): boolean => {
  if (!proof) return false;
  return (
    proof.includes("drive.google.com") ||
    proof.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

// Helper function to get file ID from proof (either URL or file ID)
const getFileIdFromProof = (
  proof: string | null | undefined
): string | null => {
  if (!proof) return null;

  if (proof.includes("drive.google.com")) {
    const fileIdMatch = proof.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (proof.match(/^[a-zA-Z0-9_-]+$/)) {
    return proof;
  }
  return null;
};

interface FinanceFormProps {
  finance?: Finance;
  onSubmit: (data: CreateFinanceInput | UpdateFinanceInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateFinanceInput | UpdateFinanceInput
  ) => Promise<void>;
  isLoading?: boolean;
  accessToken: string;
  users: User[];
  periods: Period[];
  categories: FinanceCategory[];
  events: Event[];
}

export default function FinanceForm({
  finance,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  users: _users,
  periods,
  categories,
  events,
}: FinanceFormProps) {
  const router = useRouter();
  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: photoLoading,
    error: photoError,
  } = useFile(accessToken);

  const [formData, setFormData] = useState({
    name: finance?.name || "",
    description: finance?.description || "",
    amount: finance?.amount || 0,
    date: finance?.date
      ? new Date(finance.date).toISOString().split("T")[0]
      : "",
    categoryId: finance?.categoryId || "",
    type: finance?.type || FinanceType.EXPENSE,
    periodId: finance?.periodId || "",
    eventId: finance?.eventId || "",
    status: finance?.status || Status.DRAFT,
    proofFile: undefined as File | undefined,
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingProof, setExistingProof] = useState<string | null | undefined>(
    finance?.proof
  );
  const [removedProof, setRemovedProof] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize preview URL when component mounts with existing data
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(finance?.proof));
  }, [finance?.proof]);

  // Update preview URL when existingProof changes
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(existingProof));
  }, [existingProof]);

  useEffect(() => {
    if (photoError) {
      setError(photoError);
    }
  }, [photoError]);

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
      // Validasi file
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setFormData((prev) => ({ ...prev, proofFile: file }));
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRemovedProof(false); // Reset removed state when new file is selected
    }
  };

  const removeProof = () => {
    if (isGoogleDriveProof(existingProof)) {
      // Mark proof as removed for deletion during form submission
      setRemovedProof(true);
    }

    // Clear form state
    setFormData((prev) => ({ ...prev, proofFile: undefined }));
    setPreviewUrl(null);
    setExistingProof(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Please enter transaction name");
      }
      if (isHtmlEmpty(formData.description)) {
        throw new Error("Please enter description");
      }
      if (formData.amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      if (!formData.categoryId) {
        throw new Error("Please select a category");
      }
      if (!formData.periodId) {
        throw new Error("Please select a period");
      }
      if (!formData.date) {
        throw new Error("Please select date");
      }

      // Handle proof deletion if marked for removal
      let proofUrl: string | null | undefined = existingProof;

      if (removedProof) {
        // Delete from Google Drive and set proofUrl to null
        if (finance?.proof && isGoogleDriveProof(finance.proof)) {
          const fileId = getFileIdFromProof(finance.proof);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete proof:", deleteError);
              // Continue with submission even if delete fails
            }
          }
        }
        proofUrl = null;
      }

      if (formData.proofFile) {
        // Delete old proof from Google Drive if it exists and wasn't already removed
        if (
          !removedProof &&
          finance?.proof &&
          isGoogleDriveProof(finance.proof)
        ) {
          const fileId = getFileIdFromProof(finance.proof);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old proof:", deleteError);
              // Continue with upload even if delete fails
            }
          }
        }

        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.proofFile,
          tempFileName,
          financeFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `finance-proof-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set the file to public access
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              proofUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for proof");
            }
          } else {
            throw new Error("Failed to rename proof");
          }
        } else {
          throw new Error("Failed to upload proof");
        }
      }

      // Submit form data with proof URL (exclude proofFile for server action)
      const { proofFile: _, ...dataToSend } = formData;

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        proof: proofUrl,
        date: new Date(formData.date),
        eventId:
          formData.eventId && formData.eventId.trim() !== ""
            ? formData.eventId
            : undefined,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval({ ...submitData, status: Status.PENDING });
      } else {
        await onSubmit(submitData);
      }

      // Reset form state after successful submission
      setRemovedProof(false);

      router.push("/admin/finance/transactions");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save transaction"
      );
    } finally {
      setIsLoadingState(false);
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
              Transaction Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter transaction name"
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
              {Object.values(FinanceType).map((type) => (
                <option key={type} value={type}>
                  {type === FinanceType.INCOME ? "Income" : "Expense"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (IDR) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              required
              disabled={isLoadingState}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingState}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingState}
            >
              <option value="">Pilih Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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
              <option value="">Pilih Period</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event
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
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <DescriptionEditor
            value={formData.description}
            onChange={(data) =>
              setFormData((prev) => ({ ...prev, description: data }))
            }
            disabled={isLoadingState}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proof
          </label>
          <div className="flex items-start space-x-4">
            {(previewUrl || (existingProof && existingProof.trim() !== "")) && (
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0">
                  {(() => {
                    // Get the display URL using the helper function
                    const displayUrl = getPreviewUrl(
                      previewUrl || existingProof
                    );

                    // Check if proof exists and is a valid URL
                    if (displayUrl && isValidImageUrl(displayUrl)) {
                      return (
                        <div className="w-80 h-60 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                          <Image
                            src={displayUrl}
                            alt={finance?.name || "Transaction proof"}
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
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={removeProof}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={isLoadingState}
                  >
                    Hapus Proof
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
                disabled={isLoadingState || photoLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload proof (max 5MB, format: JPG, PNG, GIF)
              </p>
              {photoLoading && (
                <p className="text-sm text-blue-600 mt-1">
                  Mengupload proof...
                </p>
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
            disabled={isLoadingState || photoLoading}
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
                {isLoadingState
                  ? onSubmitForApproval
                    ? "Mengajukan..."
                    : "Menyimpan..."
                  : onSubmitForApproval
                  ? "Simpan"
                  : finance
                  ? "Update Transaction"
                  : "Create Transaction"}
              </>
            ) : finance ? (
              "Update Transaction"
            ) : (
              "Create Transaction"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
