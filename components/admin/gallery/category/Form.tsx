"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type {
  GalleryCategory,
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/types/gallery-category";

import TextInput from "@/components/admin/ui/input/TextInput";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import { FiImage } from "react-icons/fi";
import { useGalleryCategoryForm } from "@/hooks/gallery-category/useGalleryCategoryForm";

interface GalleryCategoryFormProps {
  category?: GalleryCategory;
  onSubmit: (
    data: CreateGalleryCategoryInput | UpdateGalleryCategoryInput
  ) => Promise<void>;
  isLoading?: boolean;
}

export default function GalleryCategoryForm({
  category,
  onSubmit,
  isLoading = false,
}: GalleryCategoryFormProps) {
  const router = useRouter();
  const { isSubmitting, formData, formErrors, handleChange, handleSubmit } =
    useGalleryCategoryForm(category, onSubmit);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <TextInput
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
              icon={<FiImage className="text-gray-400" />}
              error={formErrors.name}
              disabled={isLoading || isSubmitting}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description (optional)"
                disabled={isLoading || isSubmitting}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional description up to 500 characters.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <CancelButton
              onClick={() => router.back()}
              disabled={isLoading || isSubmitting}
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              text={category ? "Update Category" : "Save Category"}
              loadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </>
  );
}
