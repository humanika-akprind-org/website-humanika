"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Event, CreateEventInput, UpdateEventInput } from "@/types/event";
import { Department as DepartmentEnum } from "@/types/enums";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import { FiBriefcase, FiUser, FiFolder } from "react-icons/fi";
import TextEditor from "@/components/admin/ui/text-area/TextEditor";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import ImageUpload from "@/components/admin/ui/input/ImageUpload";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import { useEventForm } from "@/hooks/event/useEventForm";
import ScheduleInput from "../../ui/input/ScheduleInput";

interface EventFormProps {
  event?: Event;
  onSubmit: (data: CreateEventInput | UpdateEventInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateEventInput | UpdateEventInput,
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
    loadMoreUsers,
    searchUsers,
    isLoadingUsers,
    hasMoreUsers,
    searchedUsers,
  } = useEventForm(
    event,
    onSubmit,
    onSubmitForApproval,
    accessToken,
    users,
    periods,
  );

  // Use searched users when available, otherwise fall back to original users
  const displayUsers = searchedUsers.length > 0 ? searchedUsers : users;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <TextInput
                label="Event Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter event name"
                required
                icon={<FiBriefcase className="text-gray-400" />}
              />
              <small className="text-gray-500">
                Event name must be unique because it is used as a slug.
              </small>
            </div>
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

            <div className="md:col-span-2">
              <ScheduleInput
                schedules={formData.schedules}
                onChange={(schedules) =>
                  setFormData((prev) => ({ ...prev, schedules }))
                }
                disabled={loading}
              />
            </div>
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
              options={(displayUsers || []).map((user) => ({
                value: user.id,
                label: user.name,
              }))}
              required
              icon={<FiUser className="text-gray-400" />}
              onSearch={searchUsers}
              onLoadMore={loadMoreUsers}
              isLoadingMore={isLoadingUsers}
              hasMore={hasMoreUsers}
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
              <ImageUpload
                label="Event Thumbnail"
                previewUrl={previewUrl}
                existingPhoto={existingThumbnail}
                onFileChange={handleFileChange}
                onRemovePhoto={removeThumbnail}
                isLoading={isSubmitting}
                photoLoading={photoLoading}
                alt={formData.name || "Event thumbnail"}
              />
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
