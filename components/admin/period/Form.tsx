"use client";

import type { Period, PeriodFormData } from "@/types/period";
import { FiFileText, FiCalendar } from "react-icons/fi";
import TextInput from "@/components/admin/ui/input/TextInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import Alert from "@/components/admin/ui/alert/Alert";
import CancelButton from "@/components/ui/CancelButton";
import CheckboxInput from "@/components/admin/ui/checkbox/CheckboxInput";
import { usePeriodFormLogic } from "@/hooks/period/usePeriodFormLogic";

interface PeriodFormProps {
  period?: Period;
  onSubmit?: (data: PeriodFormData) => Promise<void>;
  isEdit?: boolean;
}

export default function PeriodForm({
  period,
  onSubmit,
  isEdit = false,
}: PeriodFormProps) {
  const {
    formData,
    formErrors,
    handleChange,
    isSubmitting,
    alert,
    onSubmit: formOnSubmit,
    handleBack,
  } = usePeriodFormLogic({ period, onSubmit });

  return (
    <div className="p-6 max-w-4xl min-h-screen mx-auto">
      {alert && <Alert type={alert.type} message={alert.message} />}

      <form
        onSubmit={formOnSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <TextInput
          label="Period Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter period name"
          required
          icon={<FiFileText className="text-gray-400" />}
          error={formErrors.name}
        />
        <p className="mt-1 text-xs text-gray-500">
          Required to be filled with a clear period name
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextInput
              label="Start Year"
              name="startYear"
              value={formData.startYear.toString()}
              onChange={handleChange}
              placeholder="2024"
              type="number"
              required
              icon={<FiCalendar className="text-gray-400" />}
              error={formErrors.startYear}
            />
            <p className="mt-1 text-xs text-gray-500">
              Start year of period (min: 2000, max: 2100)
            </p>
          </div>

          <div>
            <TextInput
              label="End Year"
              name="endYear"
              value={formData.endYear?.toString() || ""}
              onChange={handleChange}
              placeholder="2025"
              type="number"
              required
              icon={<FiCalendar className="text-gray-400" />}
              error={formErrors.endYear}
            />
            <p className="mt-1 text-xs text-gray-500">
              End year of period (min: 2001, max: 2101)
            </p>
          </div>
        </div>

        <CheckboxInput
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          label="Set as active period"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <CancelButton onClick={handleBack} disabled={isSubmitting} />

          <SubmitButton
            isSubmitting={isSubmitting}
            text={isEdit ? "Update Period" : "Add Period"}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
}
