"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type {
  FinanceCategory,
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
} from "@/domain/value-objects/finance-category";
import { FinanceType } from "@/domain/enums/enums";

import TextInput from "@/presentation/components/admin/ui/input/TextInput";
import { Textarea } from "@/presentation/components/ui/textarea";
import SelectInput from "@/presentation/components/admin/ui/input/SelectInput";
import SubmitButton from "@/presentation/components/admin/ui/button/SubmitButton";
import CancelButton from "@/presentation/components/ui/CancelButton";
import { FiTag } from "react-icons/fi";
import { useFinanceCategoryForm } from "@/presentation/hooks/finance-category/useFinanceCategoryForm";

interface FinanceCategoryFormProps {
  category?: FinanceCategory;
  onSubmit: (
    data: CreateFinanceCategoryInput | UpdateFinanceCategoryInput,
  ) => Promise<void>;
  isLoading?: boolean;
}

export default function FinanceCategoryForm({
  category,
  onSubmit,
  isLoading = false,
}: FinanceCategoryFormProps) {
  const router = useRouter();
  const {
    isSubmitting,
    formData,
    formErrors,
    handleChange,
    handleSelectChange,
    handleSubmit,
  } = useFinanceCategoryForm(category, onSubmit);

  const typeOptions = Object.values(FinanceType).map((type) => ({
    value: type,
    label: type === FinanceType.INCOME ? "Pemasukan" : "Pengeluaran",
  }));

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
              icon={<FiTag className="text-gray-400" />}
              error={formErrors.name}
              disabled={isLoading || isSubmitting}
            />

            <div>
              <SelectInput
                label="Type"
                name="type"
                value={formData.type}
                onChange={(value) => handleSelectChange("type", value)}
                options={typeOptions}
                placeholder="Pilih Type"
                disabled={isLoading || isSubmitting}
              />
              {formErrors.type && (
                <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>
              )}
            </div>

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
