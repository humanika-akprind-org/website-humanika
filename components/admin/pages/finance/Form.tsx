"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type {
  Finance,
  CreateFinanceInput,
  UpdateFinanceInput,
} from "@/types/finance";
import { FinanceType, Status } from "@/types/enums";
import type { FinanceCategory } from "@/types/finance-category";
import type { WorkProgram } from "@/types/work";
import type { Period } from "@/types/period";
import { FiBriefcase, FiCalendar } from "react-icons/fi";
import TextEditor from "components/admin/ui/text-area/TextEditor";
import TextInput from "components/admin/ui/input/TextInput";
import SelectInput from "components/admin/ui/input/SelectInput";
import CurrencyInput from "components/admin/ui/input/CurrencyInput";
import DateInput from "components/admin/ui/date/DateInput";
import ImageUpload from "components/admin/ui/input/ImageUpload";
import SubmitButton from "components/admin/ui/button/SubmitButton";
import CancelButton from "components/ui/CancelButton";
import { useFinanceForm } from "@/hooks/finance/useFinanceForm";

interface FinanceFormProps {
  finance?: Finance;
  onSubmit: (data: CreateFinanceInput | UpdateFinanceInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateFinanceInput | UpdateFinanceInput
  ) => Promise<void>;
  isLoading?: boolean;
  accessToken?: string;
  categories: FinanceCategory[];
  workPrograms: WorkProgram[];
  periods?: Period[];
  isEditing?: boolean;
}

export default function FinanceForm({
  finance,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  categories,
  workPrograms,
  periods = [],
  isEditing = false,
}: FinanceFormProps) {
  const router = useRouter();
  const {
    formData,
    setFormData,
    isSubmitting,
    error,
    previewUrl,
    existingProof,
    photoLoading,
    handleInputChange,
    handleFileChange,
    removeProof,
    handleSubmit,
  } = useFinanceForm({
    finance,
    onSubmit,
    onSubmitForApproval,
    accessToken,
    categories,
    workPrograms,
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextInput
              label="Transaction Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter transaction name"
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <SelectInput
              label="Type"
              name="type"
              value={formData.type}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  type: value as FinanceType,
                }))
              }
              options={Object.values(FinanceType).map((type) => ({
                value: type,
                label: type === FinanceType.INCOME ? "Income" : "Expense",
              }))}
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <CurrencyInput
              label="Amount"
              name="amount"
              value={formData.amount}
              onChange={(value: number) =>
                setFormData((prev) => ({ ...prev, amount: value }))
              }
              placeholder="0"
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <DateInput
              label="Date"
              value={formData.date}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, date: value }))
              }
              required
            />

            <SelectInput
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
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
              placeholder="Select work program (optional)"
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
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <SelectInput
              label="Period"
              name="periodId"
              value={formData.periodId || ""}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  periodId: value || "",
                }))
              }
              options={periods.map((period) => ({
                value: period.id,
                label: period.name,
              }))}
              placeholder="Select period (optional)"
              icon={<FiCalendar className="text-gray-400" />}
            />
          </div>

          <div className="mb-6">
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

          <div className="mb-6">
            <ImageUpload
              label="Proof"
              previewUrl={previewUrl}
              existingPhoto={existingProof}
              onFileChange={handleFileChange}
              onRemovePhoto={removeProof}
              isLoading={isSubmitting}
              photoLoading={photoLoading}
              alt={formData.name || "Transaction proof"}
              removeButtonText="Hapus Proof"
              loadingText="Mengupload proof..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <CancelButton
              onClick={() => router.back()}
              disabled={isSubmitting}
            />

            <SubmitButton
              isSubmitting={isSubmitting || photoLoading}
              text={
                isEditing
                  ? "Update Transaction"
                  : onSubmitForApproval
                  ? "Submit for Approval"
                  : "Create Transaction"
              }
              loadingText={
                isSubmitting
                  ? onSubmitForApproval
                    ? "Mengajukan..."
                    : "Menyimpan..."
                  : "Saving..."
              }
            />
          </div>
        </form>
      </div>
    </>
  );
}
