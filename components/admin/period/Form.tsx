"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Period, PeriodFormData } from "@/types/period";
import { createPeriod, updatePeriod } from "@/use-cases/api/period";
import { FiFileText, FiCalendar } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import TextInput from "@/components/admin/ui/input/TextInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";

interface PeriodFormProps {
  period?: Period;
  isEdit?: boolean;
}

export default function PeriodForm({
  period,
  isEdit = false,
}: PeriodFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<PeriodFormData>({
    name: "",
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 1,
    isActive: false,
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof PeriodFormData, string>>
  >({});

  useEffect(() => {
    if (period) {
      setFormData({
        name: period.name,
        startYear: period.startYear,
        endYear: period.endYear,
        isActive: period.isActive,
      });
    }
  }, [period]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value)
          : value,
    }));

    // Clear error when field is changed
    if (formErrors[name as keyof PeriodFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof PeriodFormData, string>> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (
      !formData.startYear ||
      formData.startYear < 2000 ||
      formData.startYear > 2100
    ) {
      errors.startYear = "Start year must be between 2000 and 2100";
    }
    if (
      !formData.endYear ||
      formData.endYear < 2001 ||
      formData.endYear > 2101
    ) {
      errors.endYear = "End year must be between 2001 and 2101";
    }
    if (formData.startYear >= formData.endYear) {
      errors.endYear = "End year must be greater than start year";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setAlert(null);

    try {
      if (isEdit && period) {
        await updatePeriod(period.id, formData);
      } else {
        await createPeriod(formData);
      }
      setAlert({ type: "success", message: "Period saved successfully!" });
      router.push("/admin/governance/periods");
      router.refresh();
    } catch (err) {
      console.error("Submission error:", err);
      setAlert({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to save period. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        onSubmit={handleSubmit}
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-900"
          >
            Jadikan sebagai period aktif
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Batal
          </button>
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
