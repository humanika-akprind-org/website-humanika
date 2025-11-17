"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  DepartmentTask,
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/types/task";
import { Department as DepartmentEnum, Status } from "@/types/enums";
import type { User } from "@/types/user";
import TextEditor from "@/components/admin/ui/TextEditor";
import {
  FiArrowLeft,
  FiBriefcase,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";
import Link from "next/link";

interface TaskFormProps {
  task?: DepartmentTask;
  onSubmit: (
    data: CreateDepartmentTaskInput | UpdateDepartmentTaskInput
  ) => Promise<void>;
  isLoading?: boolean;
  users: User[];
}

export default function TaskForm({ task, onSubmit, users }: TaskFormProps) {
  const router = useRouter();
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    note: "",
    department: DepartmentEnum.BPH,
    userId: "",
    status: Status.DRAFT,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        note: task.note,
        department: task.department,
        userId: task.userId || "",
        status: task.status,
      });
    }
  }, [task]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.note.trim()) {
        throw new Error("Please enter task note");
      }
      if (!formData.department) {
        throw new Error("Please select a department");
      }

      // Submit form data
      const submitData = {
        ...formData,
        userId: formData.userId || undefined,
      };

      await onSubmit(submitData);

      router.push("/admin/governance/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl min-h-screen mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/admin/governance/tasks"
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {task ? "Edit Task" : "Tambah Task Baru"}
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
        <div className="space-y-6">
          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Note *
            </label>
            <TextEditor
              value={formData.note}
              onChange={(data) =>
                setFormData((prev) => ({ ...prev, note: data }))
              }
              disabled={isLoadingState}
              height="200px"
            />
            <p className="mt-1 text-xs text-gray-500">
              Wajib diisi dengan catatan tugas yang jelas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase className="text-gray-400" />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoadingState}
                >
                  <option value="">Pilih Department</option>
                  {Object.values(DepartmentEnum).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Wajib dipilih department yang bertanggung jawab
              </p>
            </div>

            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Assigned User
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoadingState}
                >
                  <option value="">Pilih User (Opsional)</option>
                  {(users || []).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Opsional, pilih user yang ditugaskan
              </p>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCheckCircle className="text-gray-400" />
                </div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoadingState}
                >
                  {Object.values(Status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Status tugas saat ini
              </p>
            </div>
          </div>
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
            disabled={isLoadingState}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoadingState
              ? "Menyimpan..."
              : task
              ? "Update Task"
              : "Tambah Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
