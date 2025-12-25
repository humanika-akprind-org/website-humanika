"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiBriefcase, FiCalendar, FiFile, FiUser } from "react-icons/fi";
import type {
  Letter,
  CreateLetterInput,
  UpdateLetterInput,
} from "@/types/letter";
import {
  LetterType,
  LetterPriority,
  LetterClassification,
} from "@/types/enums";
import type { Period } from "@/types/period";
import type { Event } from "@/types/event";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import DateInput from "@/components/admin/ui/date/DateInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import FileUpload from "@/components/admin/ui/input/FileUpload";
import { useLetterForm } from "@/hooks/letter/useLetterForm";
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

export default function LetterForm({
  letter,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  periods = [],
  events = [],
  isEditing,
}: LetterFormProps) {
  const router = useRouter();

  const {
    formData,
    isLoadingState,
    error,
    existingLetter,
    fileLoading,
    errors,
    handleInputChange,
    handleFileChange,
    removeLetter,
    handleSubmit,
  } = useLetterForm({
    letter,
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
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Regarding"
            name="regarding"
            value={formData.regarding}
            onChange={handleInputChange}
            placeholder="Enter letter regarding"
            required
            icon={<FiBriefcase className="text-gray-400" />}
            error={errors.regarding}
            disabled={isLoadingState}
          />

          <TextInput
            label="Letter Number"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            placeholder="Enter letter number"
            required
            icon={<FiFile className="text-gray-400" />}
            error={errors.number}
            disabled={isLoadingState}
          />

          <DateInput
            label="Date"
            value={formData.date}
            onChange={(value) =>
              handleInputChange({
                target: { name: "date", value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            required
            error={errors.date}
            disabled={isLoadingState}
          />

          <SelectInput
            label="Type"
            name="type"
            value={formData.type}
            onChange={(value) => handleSelectChange("type", value)}
            options={Object.values(LetterType).map((type) => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
            }))}
            placeholder="Select type"
            icon={<FiBriefcase className="text-gray-400" />}
            disabled={isLoadingState}
          />

          <SelectInput
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={(value) => handleSelectChange("priority", value)}
            options={Object.values(LetterPriority).map((priority) => ({
              value: priority,
              label:
                priority.charAt(0).toUpperCase() +
                priority.slice(1).toLowerCase(),
            }))}
            placeholder="Select priority"
            icon={<FiBriefcase className="text-gray-400" />}
            disabled={isLoadingState}
          />

          <SelectInput
            label="Classification"
            name="classification"
            value={formData.classification || ""}
            onChange={(value) => handleSelectChange("classification", value)}
            options={[
              { value: "", label: "Select classification" },
              ...Object.values(LetterClassification).map((classification) => ({
                value: classification,
                label: classification
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
              })),
            ]}
            placeholder="Select classification"
            icon={<FiBriefcase className="text-gray-400" />}
            disabled={isLoadingState}
          />
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Origin"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            placeholder="Enter origin"
            required
            icon={<FiUser className="text-gray-400" />}
            error={errors.origin}
            disabled={isLoadingState}
          />

          <TextInput
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            placeholder="Enter destination"
            required
            icon={<FiUser className="text-gray-400" />}
            error={errors.destination}
            disabled={isLoadingState}
          />
        </div>

        {/* Period and Event */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Period"
            name="periodId"
            value={formData.periodId}
            onChange={(value) => handleSelectChange("periodId", value)}
            options={periods.map((period) => ({
              value: period.id,
              label: period.name,
            }))}
            placeholder="Select Period"
            icon={<FiCalendar className="text-gray-400" />}
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
            placeholder="Select Event"
            icon={<FiCalendar className="text-gray-400" />}
            disabled={isLoadingState}
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body
          </label>
          <TextEditor
            value={formData.body || ""}
            onChange={(value) =>
              handleInputChange({
                target: { name: "body", value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            disabled={isLoadingState}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              handleInputChange({
                target: { name: "notes", value: e.target.value },
              } as React.ChangeEvent<HTMLTextAreaElement>)
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notes"
            disabled={isLoadingState}
          />
        </div>

        {/* Letter File */}
        <FileUpload
          label="Letter File"
          existingFile={existingLetter}
          onRemove={removeLetter}
          onFileChange={(file) => {
            const syntheticEvent = {
              target: { files: [file] as unknown as FileList },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileChange(syntheticEvent);
          }}
          isLoading={isLoadingState}
          fileLoading={fileLoading}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
          helpText="Upload letter file (max 10MB, format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF)"
          loadingText="Mengupload file..."
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <CancelButton
            onClick={() => router.back()}
            disabled={isLoadingState}
          />

          <SubmitButton
            isSubmitting={isLoadingState || fileLoading}
            text={
              onSubmitForApproval
                ? "Ajukan Persetujuan"
                : isEditing
                ? "Update Letter"
                : "Create Letter"
            }
            loadingText={onSubmitForApproval ? "Mengajukan..." : "Menyimpan..."}
          />
        </div>
      </form>
    </div>
  );
}
