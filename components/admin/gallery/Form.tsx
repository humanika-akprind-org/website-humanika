"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type {
  Gallery,
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@/types/gallery";
import type { Event } from "@/types/event";
import { FiImage } from "react-icons/fi";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import ImageUpload from "@/components/admin/ui/input/ImageUpload";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import { useGalleryForm } from "@/hooks/gallery/useGalleryForm";

interface GalleryFormProps {
  gallery?: Gallery;
  onSubmit: (data: CreateGalleryInput | UpdateGalleryInput) => Promise<void>;
  loading?: boolean;
  accessToken?: string;
  events?: Event[];
}

export default function GalleryForm({
  gallery,
  onSubmit,
  accessToken,
  events: propEvents,
  loading = false,
}: GalleryFormProps) {
  const router = useRouter();
  const {
    formData,
    setFormData,
    isSubmitting,
    error,
    previewUrl,
    existingImage,
    events,
    eventsLoading,
    galleryCategories,
    categoriesLoading,
    photoLoading,
    handleInputChange,
    handleFileChange,
    removeImage,
    handleSubmit,
  } = useGalleryForm(gallery, onSubmit, accessToken, propEvents);

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <TextInput
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter gallery title"
                required
                icon={<FiImage className="text-gray-400" />}
              />
            </div>

            <SelectInput
              label="Event"
              name="eventId"
              value={formData.eventId}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, eventId: value }))
              }
              options={(events || []).map((event) => ({
                value: event.id,
                label: event.name,
              }))}
              required
              placeholder={
                eventsLoading ? "Loading events..." : "Select an event"
              }
              icon={<FiImage className="text-gray-400" />}
            />

            <SelectInput
              label="Category"
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: value || undefined,
                }))
              }
              options={(galleryCategories || []).map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              disabled={categoriesLoading}
              placeholder={
                categoriesLoading
                  ? "Loading categories..."
                  : "Select a category (Optional)"
              }
              icon={<FiImage className="text-gray-400" />}
            />

            <div className="md:col-span-2">
              <ImageUpload
                label="Gallery Image"
                previewUrl={previewUrl}
                existingPhoto={existingImage}
                onFileChange={handleFileChange}
                onRemovePhoto={removeImage}
                isLoading={isSubmitting}
                photoLoading={photoLoading}
                alt={formData.title || "Gallery image"}
                customWidth={240}
                customHeight={240}
                accept="image/*"
                helpText="Upload image (max 5MB, format: JPG, PNG, GIF)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <CancelButton
              onClick={() => router.back()}
              disabled={isSubmitting}
            />

            <SubmitButton
              isSubmitting={isSubmitting || photoLoading || loading}
              text={gallery ? "Update Gallery" : "Create Gallery"}
              loadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </>
  );
}
