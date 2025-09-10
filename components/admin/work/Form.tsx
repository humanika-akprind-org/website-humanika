"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Department } from "@/types/enums";
import type {
  WorkProgram,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
} from "@/types/work";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import {
  FiFileText,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiUser,
} from "react-icons/fi";

interface FormData {
  name: string;
  department: Department;
  schedule: string;
  funds: number;
  usedFunds: number;
  remainingFunds: number;
  goal: string;
  periodId: string;
  responsibleId: string;
}

interface WorkProgramFormProps {
  workProgram?: WorkProgram;
  users: User[];
  periods: Period[];
  onSubmit: (
    data: CreateWorkProgramInput | UpdateWorkProgramInput
  ) => Promise<void>;
  isEditing?: boolean;
}

export default function WorkProgramForm({
  workProgram,
  users,
  periods,
  onSubmit,
  isEditing = false,
}: WorkProgramFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: workProgram?.name || "",
    department: workProgram?.department || Department.INFOKOM,
    schedule: workProgram?.schedule || "",
    funds: workProgram?.funds || 0,
    usedFunds: workProgram?.usedFunds || 0,
    remainingFunds: workProgram ? (workProgram.funds - workProgram.usedFunds) : 0,
    goal: workProgram?.goal || "",
    periodId: workProgram?.periodId || "",
    responsibleId: workProgram?.responsibleId || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: name === "funds" || name === "usedFunds" ? parseFloat(value) || 0 : value,
      };
      if (name === "funds" || name === "usedFunds") {
        newData.remainingFunds = newData.funds - newData.usedFunds;
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      router.push("/admin/programs/works");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Work Program" : "Create New Work Program"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing
            ? "Update the work program details below."
            : "Fill in the details to create a new work program."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFileText className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter program name"
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBriefcase className="text-gray-400" />
              </div>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(Department).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="e.g., Q1 2024 - Q2 2024"
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget (IDR) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-gray-400" />
              </div>
              <input
                type="number"
                name="funds"
                value={formData.funds}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter budget amount"
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Used Funds (IDR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTrendingDown className="text-gray-400" />
              </div>
              <input
                type="number"
                name="usedFunds"
                value={formData.usedFunds}
                onChange={handleChange}
                min="0"
                max={formData.funds}
                placeholder="Enter used funds amount"
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remaining Funds (IDR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTrendingUp className="text-gray-400" />
              </div>
              <input
                type="number"
                name="remainingFunds"
                value={formData.remainingFunds}
                readOnly
                placeholder="Remaining funds"
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <select
                name="periodId"
                value={formData.periodId}
                onChange={handleChange}
                required
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Period</option>
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsible Person *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <select
                name="responsibleId"
                value={formData.responsibleId}
                onChange={handleChange}
                required
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Responsible Person</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.department}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goals and Objectives *
          </label>
          <textarea
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe the goals and objectives of this work program..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Program"
              : "Create Program"}
          </button>
        </div>
      </form>
    </div>
  );
}
