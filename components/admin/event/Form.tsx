"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Event, CreateEventInput, UpdateEventInput } from "@/types/event";
import { Department as DepartmentEnum } from "@/types/enums";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import {
  FiBriefcase,
  FiUser,
  FiFolder,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
} from "react-icons/fi";
import TextEditor from "@/components/admin/ui/text-area/TextEditor";
import TextInput from "@/components/admin/ui/input/TextInput";
import CurrencyInput from "@/components/admin/ui/input/CurrencyInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import { useEventForm } from "@/hooks/event/useEventForm";

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

// Helper function to get preview URL from thumbnail (file ID or URL)
const getThumbnailUrl = (thumbnail: string | null | undefined): string => {
  if (!thumbnail) return "";

  if (thumbnail.includes("drive.google.com")) {
    const fileIdMatch = thumbnail.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return thumbnail;
  } else if (thumbnail.match(/^[a-zA-Z0-9_-]+$/)) {
    return `/api/drive-image?fileId=${thumbnail}`;
  } else {
    return thumbnail;
  }
};

interface EventFormProps {
  event?: Event;
  onSubmit: (data: CreateEventInput | UpdateEventInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateEventInput | UpdateEventInput
  ) => Promise<void>;
  accessToken?: string;
  users: User[];
  periods: Period[];
  isEditing?: boolean;
  loading?: boolean;
}

export default function EventForm({
  event,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  users,
  periods,
  isEditing = false,
  loading = false,
}: EventFormProps) {
  const router = useRouter();
  const {
    formData,
    setFormData,
    isSubmitting,
    previewUrl,
    existingThumbnail,
    workPrograms,
    eventCategories,
    photoLoading,
    handleInputChange,
    handleFileChange,
    removeThumbnail,
    handleSubmit,
  } = useEventForm(
    event,
    onSubmit,
    onSubmitForApproval,
    accessToken,
    users,
    periods
  );

  const [_dateError, setDateError] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        setDateError("Start date must be before end date");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [formData.startDate, formData.endDate]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextInput
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter event name"
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <SelectInput
              label="Department"
              name="department"
              value={formData.department}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  department: value as DepartmentEnum,
                }))
              }
              options={Object.values(DepartmentEnum).map((dept) => ({
                value: dept,
                label: dept,
              }))}
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <CurrencyInput
              label="Budget (IDR)"
              name="funds"
              value={formData.funds}
              onChange={(value) => {
                setFormData((prev) => {
                  const newData = { ...prev, funds: value };
                  newData.remainingFunds = newData.funds - newData.usedFunds;
                  return newData;
                });
                if (formErrors.funds) {
                  setFormErrors((prev) => ({ ...prev, funds: "" }));
                }
              }}
              placeholder="Enter budget amount"
              required
              icon={<FiTrendingUp className="text-gray-400" />}
              error={formErrors.funds}
            />

            <CurrencyInput
              label="Used Funds (IDR)"
              name="usedFunds"
              value={formData.usedFunds}
              onChange={(value) => {
                setFormData((prev) => {
                  const newData = { ...prev, usedFunds: value };
                  newData.remainingFunds = newData.funds - newData.usedFunds;
                  return newData;
                });
              }}
              placeholder="Enter used funds amount"
              icon={<FiTrendingDown className="text-gray-400" />}
            />

            <CurrencyInput
              label="Remaining Funds (IDR)"
              name="remainingFunds"
              value={formData.remainingFunds}
              onChange={() => {}}
              placeholder="Remaining funds"
              icon={<FiCreditCard className="text-gray-400" />}
              disabled
            />

            <TextInput
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              icon={<FiCalendar className="text-gray-400" />}
            />

            <TextInput
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              icon={<FiCalendar className="text-gray-400" />}
            />

            <SelectInput
              label="Period"
              name="periodId"
              value={formData.periodId}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, periodId: value }))
              }
              options={(periods || []).map((period) => ({
                value: period.id,
                label: period.name,
              }))}
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <SelectInput
              label="Work Program"
              name="workProgramId"
              value={formData.workProgramId}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, workProgramId: value }))
              }
              options={workPrograms.map((workProgram) => ({
                value: workProgram.id,
                label: workProgram.name,
              }))}
              placeholder="Select a work program (optional)"
              icon={<FiFolder className="text-gray-400" />}
            />

            <SelectInput
              label="Responsible Person"
              name="responsibleId"
              value={formData.responsibleId}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, responsibleId: value }))
              }
              options={(users || []).map((user) => ({
                value: user.id,
                label: user.name,
              }))}
              required
              icon={<FiUser className="text-gray-400" />}
            />

            <SelectInput
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
              options={eventCategories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              placeholder="Select a category (optional)"
              icon={<FiFolder className="text-gray-400" />}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <TextEditor
                value={formData.description}
                onChange={(data) =>
                  setFormData((prev) => ({ ...prev, description: data }))
                }
                disabled={loading}
                height="200px"
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                label="Goal"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Enter event goal"
                required
                icon={<FiBriefcase className="text-gray-400" />}
              />
            </div>

            <div className="md:col-span-2">
              {/* Event Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Thumbnail
                </label>
                <div className="flex items-start space-x-4">
                  {(previewUrl ||
                    (existingThumbnail && existingThumbnail.trim() !== "")) && (
                    <div className="flex flex-col items-center">
                      <div className="flex-shrink-0">
                        {(() => {
                          // Get the display URL using the helper function
                          const displayUrl = getThumbnailUrl(
                            previewUrl || existingThumbnail
                          );

                          // Check if thumbnail exists and is a valid URL
                          if (displayUrl && isValidImageUrl(displayUrl)) {
                            return (
                              <div className="w-60 h-60 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                                <Image
                                  src={displayUrl}
                                  alt={formData.name || "Event thumbnail"}
                                  width={300}
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
                          onClick={removeThumbnail}
                          className="text-sm text-red-600 hover:text-red-800"
                          disabled={isSubmitting}
                        >
                          Remove Thumbnail
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
                      disabled={isSubmitting || photoLoading}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload thumbnail (max 5MB, format: JPG, PNG, GIF)
                    </p>
                    {photoLoading && (
                      <p className="text-sm text-blue-600 mt-1">
                        Uploading thumbnail...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <CancelButton onClick={() => router.back()} disabled={loading} />

            <SubmitButton
              isSubmitting={isSubmitting || photoLoading}
              text={isEditing ? "Update Event" : "Create Event"}
              loadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </>
  );
}
