"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/types/article";
import { Status } from "@/types/enums";
import type { Period } from "@/types/period";
import { FiBriefcase, FiFolder } from "react-icons/fi";
import TextEditor from "@/components/admin/ui/text-area/TextEditor";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import ImageUpload from "@/components/admin/ui/input/ImageUpload";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import { useArticleForm } from "@/hooks/article/useArticleForm";
import { type User } from "@/types/user";

interface ArticleFormProps {
  article?: Article;
  onSubmit: (data: CreateArticleInput | UpdateArticleInput) => Promise<void>;
  accessToken?: string;
  periods: Period[];
  currentUser?: User | null;
  isEditing?: boolean;
  loading?: boolean;
}

export default function ArticleForm({
  article,
  onSubmit,
  accessToken,
  periods,
  currentUser,
  isEditing = false,
  loading = false,
}: ArticleFormProps) {
  const router = useRouter();
  const {
    formData,
    setFormData,
    isSubmitting,
    previewUrl,
    existingThumbnail,
    articleCategories,
    photoLoading,
    handleInputChange,
    handleFileChange,
    removeThumbnail,
    handleSubmit,
  } = useArticleForm(article, onSubmit, accessToken, periods, currentUser);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextInput
              label="Article Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter article title"
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <SelectInput
              label="Status"
              name="status"
              value={formData.status}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as Status,
                }))
              }
              options={Object.values(Status).map((status) => ({
                value: status,
                label: status,
              }))}
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <SelectInput
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
              options={articleCategories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              placeholder="Select a category (optional)"
              icon={<FiFolder className="text-gray-400" />}
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
              placeholder="Select a period (optional)"
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <TextEditor
                value={formData.content}
                onChange={(data) =>
                  setFormData((prev) => ({ ...prev, content: data }))
                }
                disabled={loading}
                height="200px"
              />
            </div>

            <div className="md:col-span-2">
              <ImageUpload
                label="Article Thumbnail"
                previewUrl={previewUrl}
                existingPhoto={existingThumbnail}
                onFileChange={handleFileChange}
                onRemovePhoto={removeThumbnail}
                isLoading={isSubmitting}
                photoLoading={photoLoading}
                alt={formData.title || "Article thumbnail"}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <CancelButton onClick={() => router.back()} disabled={loading} />

            <SubmitButton
              isSubmitting={isSubmitting || photoLoading}
              text={isEditing ? "Update Article" : "Create Article"}
              loadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </>
  );
}
