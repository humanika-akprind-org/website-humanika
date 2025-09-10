"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Period, PeriodFormData } from "@/types/period";
import { createPeriod, updatePeriod } from "@/lib/api/period";
import { FiFileText, FiCalendar } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

interface PeriodFormProps {
  period?: Period;
  isEdit?: boolean;
}

export default function PeriodForm({
  period,
  isEdit = false,
}: PeriodFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PeriodFormData>({
    name: "",
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 1,
    isActive: false,
  });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && period) {
        await updatePeriod(period.id, formData);
      } else {
        await createPeriod(formData);
      }
      router.push("/admin/governance/periods");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
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
      {error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Period *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFileText className="text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama period"
              required
              className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Wajib diisi dengan nama period yang jelas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startYear"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tahun Mulai *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="number"
                id="startYear"
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                placeholder="2024"
                min="2000"
                max="2100"
                required
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Tahun mulai period (min: 2000, max: 2100)
            </p>
          </div>

          <div>
            <label
              htmlFor="endYear"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tahun Selesai *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="number"
                id="endYear"
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                placeholder="2025"
                min="2001"
                max="2101"
                required
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading
              ? "Menyimpan..."
              : isEdit
              ? "Update Period"
              : "Tambah Period"}
          </button>
        </div>
      </form>
    </div>
  );
}
