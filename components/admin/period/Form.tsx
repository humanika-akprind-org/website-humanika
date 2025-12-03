"use client";

import type { Period } from "@/types/period";
import { FiFileText, FiCalendar } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import TextInput from "@/components/admin/ui/input/TextInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import Alert from "@/components/admin/ui/alert/Alert";
import CancelButton from "@/components/ui/CancelButton";
import CheckboxInput from "@/components/admin/ui/checkbox/CheckboxInput";
import { usePeriodFormLogic } from "@/hooks/period/usePeriodFormLogic";

interface PeriodFormProps {
  period?: Period;
  isEdit?: boolean;
}

export default function PeriodForm({
  period,
  isEdit = false,
}: PeriodFormProps) {
  const {
    formData,
    formErrors,
    handleChange,
    isSubmitting,
    alert,
    onSubmit,
    handleBack,
  } = usePeriodFormLogic(period, isEdit);

  return (
    <div className="p-6 max-w-4xl min-h-screen mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/admin/governance/periods"
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Edit Period" : "Tambah Period Baru"}
        </h1>
      </div>
      {alert && <Alert type={alert.type} message={alert.message} />}

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <TextInput
          label="Nama Period"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Masukkan nama period"
          required
          icon={<FiFileText className="text-gray-400" />}
          error={formErrors.name}
        />
        <p className="mt-1 text-xs text-gray-500">
          Wajib diisi dengan nama period yang jelas
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextInput
              label="Tahun Mulai"
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
              Tahun mulai period (min: 2000, max: 2100)
            </p>
          </div>

          <div>
            <TextInput
              label="Tahun Selesai"
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
              Tahun selesai period (min: 2001, max: 2101)
            </p>
          </div>
        </div>

        <CheckboxInput
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          label="Jadikan sebagai period aktif"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <CancelButton onClick={handleBack} disabled={isSubmitting} />

          <SubmitButton
            isSubmitting={isSubmitting}
            text={isEdit ? "Update Period" : "Tambah Period"}
            loadingText="Menyimpan..."
          />
        </div>
      </form>
    </div>
  );
}
