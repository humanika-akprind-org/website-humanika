"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Event, CreateEventInput, UpdateEventInput } from "@/types/event";
import { Department as DepartmentEnum } from "@/types/enums";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import {
  FiBriefcase,
  FiUser,
  FiFolder,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import TextEditor from "@/components/admin/ui/text-area/TextEditor";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import ImageUpload from "@/components/admin/ui/input/ImageUpload";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import { useEventForm } from "@/hooks/event/useEventForm";

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
}

export default function EventForm({
  event,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  users,
  periods,
  isEditing = false,
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

  const handleFileUpload = (file: File) => {
    // Create a synthetic event to match the hook's expectation
    const syntheticEvent = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(syntheticEvent);
  };

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

            <TextInput
              label="Budget (IDR)"
              name="funds"
              type="number"
              value={formData.funds.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  funds: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="0"
              required
              icon={<FiDollarSign className="text-gray-400" />}
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
                disabled={isSubmitting}
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
              <ImageUpload
                label="Event Thumbnail"
                previewUrl={previewUrl}
                existingPhoto={existingThumbnail}
                onFileChange={handleFileUpload}
                onRemovePhoto={removeThumbnail}
                isLoading={isSubmitting}
                photoLoading={photoLoading}
                helpText="Upload event thumbnail (max 5MB, format: JPG, PNG, GIF)"
                alt="Event thumbnail"
                previewSize="medium"
                previewShape="square"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <CancelButton
              onClick={() => router.back()}
              disabled={isSubmitting}
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              text={
                onSubmitForApproval
                  ? "Submit for Approval"
                  : isEditing
                  ? "Update Event"
                  : "Create Event"
              }
              loadingText={onSubmitForApproval ? "Submitting..." : "Saving..."}
            />
          </div>
        </form>
      </div>
    </>
  );
}
