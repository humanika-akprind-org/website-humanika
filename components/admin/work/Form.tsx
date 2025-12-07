"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type {
  WorkProgram,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
} from "@/types/work";
import { Department } from "@/types/enums";
import TextEditor from "@/components/admin/ui/text-area/TextEditor";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import {
  FiFileText,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiTrendingUp,
  FiTrendingDown,
  FiUser,
} from "react-icons/fi";
import { useWorkForm } from "@/hooks/work-program/useWorkForm";
import { formatCurrency, parseCurrency } from "@/lib/utils";

interface WorkProgramFormProps {
  workProgram?: WorkProgram;
  onSubmit: (
    data: CreateWorkProgramInput | UpdateWorkProgramInput
  ) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateWorkProgramInput | UpdateWorkProgramInput
  ) => Promise<void>;
  isEditing?: boolean;
}

export default function WorkProgramForm({
  workProgram,
  onSubmit,
  onSubmitForApproval,
  isEditing = false,
}: WorkProgramFormProps) {
  const router = useRouter();
  const {
    isSubmitting,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    handleChange,
    handleGoalChange,
    handleSubmit,
    users,
    periods,
  } = useWorkForm({ workProgram, onSubmit: onSubmitForApproval || onSubmit });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextInput
              label="Program Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter program name"
              required
              icon={<FiFileText className="text-gray-400" />}
              error={formErrors.name}
            />

            <SelectInput
              label="Department"
              name="department"
              value={formData.department}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  department: value as Department,
                }))
              }
              options={Object.values(Department).map((dept) => ({
                value: dept,
                label: dept,
              }))}
              required
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <TextInput
              label="Schedule/Timeline"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="e.g., 2024-01-01, Event Name, Period 2024-2025"
              icon={<FiCalendar className="text-gray-400" />}
            />

            <TextInput
              label="Budget (IDR)"
              name="funds"
              value={formatCurrency(formData.funds)}
              onChange={(e) => {
                const parsedValue = parseCurrency(e.target.value);
                setFormData((prev) => {
                  const newData = { ...prev, funds: parsedValue };
                  newData.remainingFunds = newData.funds - newData.usedFunds;
                  return newData;
                });
                if (formErrors.funds) {
                  setFormErrors((prev) => ({ ...prev, funds: "" }));
                }
              }}
              placeholder="Enter budget amount"
              required
              type="text"
              icon={<FiTrendingUp className="text-gray-400" />}
              error={formErrors.funds}
            />

            <TextInput
              label="Used Funds (IDR)"
              name="usedFunds"
              value={formatCurrency(formData.usedFunds)}
              onChange={(e) => {
                const parsedValue = parseCurrency(e.target.value);
                setFormData((prev) => {
                  const newData = { ...prev, usedFunds: parsedValue };
                  newData.remainingFunds = newData.funds - newData.usedFunds;
                  return newData;
                });
              }}
              placeholder="Enter used funds amount"
              type="text"
              icon={<FiTrendingDown className="text-gray-400" />}
            />

            <TextInput
              label="Remaining Funds (IDR)"
              name="remainingFunds"
              value={formatCurrency(formData.remainingFunds)}
              onChange={handleChange}
              placeholder="Remaining funds"
              type="text"
              icon={<FiCreditCard className="text-gray-400" />}
              disabled
            />

            <SelectInput
              label="Period"
              name="periodId"
              value={
                typeof formData.period === "string"
                  ? formData.period
                  : formData.period?.id || ""
              }
              onChange={(value: string) => {
                setFormData((prev) => ({
                  ...prev,
                  period: value,
                }));
                if (formErrors.periodId) {
                  setFormErrors((prev) => ({ ...prev, periodId: "" }));
                }
              }}
              options={periods.map((period) => ({
                value: period.id,
                label: period.name,
              }))}
              placeholder="Select Period"
              required
              icon={<FiCalendar className="text-gray-400" />}
            />

            <SelectInput
              label="Responsible Person"
              name="responsibleId"
              value={
                typeof formData.responsible === "string"
                  ? formData.responsible
                  : formData.responsible?.id || ""
              }
              onChange={(value: string) => {
                const selectedUser = users.find((u) => u.id === value);
                setFormData((prev) => ({
                  ...prev,
                  responsible: selectedUser || null,
                }));
                if (formErrors.responsibleId) {
                  setFormErrors((prev) => ({ ...prev, responsibleId: "" }));
                }
              }}
              options={users.map((user) => ({
                value: user.id,
                label: `${user.name} - ${user.department}`,
              }))}
              placeholder="Select Responsible Person"
              required
              icon={<FiUser className="text-gray-400" />}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goals and Objectives *
              </label>
              <TextEditor
                value={formData.goal}
                onChange={handleGoalChange}
                disabled={isSubmitting}
                height="200px"
              />
              {formErrors.goal && (
                <p className="text-red-500 text-xs mt-1">{formErrors.goal}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <CancelButton
              onClick={() => router.back()}
              disabled={isSubmitting}
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              text={isEditing ? "Update Program" : "Create Program"}
              loadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </>
  );
}
