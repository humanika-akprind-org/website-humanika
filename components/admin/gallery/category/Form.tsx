"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  GalleryCategory,
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/types/gallery-category";

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
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      await onSubmit(formData);
      router.push("/admin/content/galleries/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter category name"
            required
            disabled={isLoading}
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            Category names must be unique and up to 100 characters.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter category description (optional)"
            disabled={isLoading}
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional description up to 500 characters.
          </p>
        </div>

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
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                Saving...
              </>
            ) : (
              "Save Category"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
