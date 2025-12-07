"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type {
  DepartmentTask,
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/types/task";
import { Department, Status } from "@/types/enums";

import TextEditor from "@/components/admin/ui/text-area/TextEditor";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import { FiBriefcase, FiUser, FiCheckCircle, FiFolder } from "react-icons/fi";
import type { User } from "@/types/user";
import type { WorkProgram } from "@/types/work";
import { useTaskForm } from "@/hooks/task/useTaskForm";

export interface CreateTaskData {
  title: string;
  subtitle: string;
  note: string;
  department: Department;
  userId?: string;
  workProgramId?: string;
  status?: Status;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

interface TaskFormProps {
  task?: DepartmentTask;
  onSubmit: (
    data: CreateDepartmentTaskInput | UpdateDepartmentTaskInput
  ) => Promise<void>;
  isEdit?: boolean;
}

export default function TaskForm({
  task,
  onSubmit,
  isEdit = false,
}: TaskFormProps) {
  const router = useRouter();
  const {
    isSubmitting,
    formData,
    setFormData,
    formErrors,
    handleChange,
    handleNoteChange,
    handleSubmit,
    users,
    workPrograms,
  } = useTaskForm(task, onSubmit);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextInput
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              icon={<FiBriefcase className="text-gray-400" />}
              error={formErrors.title}
            />

            <TextInput
              label="Task Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Enter task subtitle (optional)"
              icon={<FiBriefcase className="text-gray-400" />}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Note *
              </label>
              <TextEditor
                value={formData.note}
                onChange={handleNoteChange}
                disabled={isSubmitting}
                height="200px"
              />
              {formErrors.note && (
                <p className="text-red-500 text-xs mt-1">{formErrors.note}</p>
              )}
            </div>

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

            <SelectInput
              label="Assigned User"
              name="userId"
              value={formData.userId || ""}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, userId: value }))
              }
              options={users.map((user: User) => ({
                value: user.id,
                label: user.name,
              }))}
              placeholder="Select a user (optional)"
              icon={<FiUser className="text-gray-400" />}
            />

            <SelectInput
              label="Work Program"
              name="workProgramId"
              value={formData.workProgramId || ""}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, workProgramId: value }))
              }
              options={workPrograms.map((workProgram: WorkProgram) => ({
                value: workProgram.id,
                label: workProgram.name,
              }))}
              placeholder="Select a work program (optional)"
              icon={<FiFolder className="text-gray-400" />}
            />

            <SelectInput
              label="Status"
              name="status"
              value={formData.status}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, status: value as Status }))
              }
              options={Object.values(Status).map((status) => ({
                value: status,
                label: status,
              }))}
              required
              icon={<FiCheckCircle className="text-gray-400" />}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <CancelButton
              onClick={() => router.back()}
              disabled={isSubmitting}
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              text={isEdit ? "Update Task" : "Add Task"}
              loadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </>
  );
}
