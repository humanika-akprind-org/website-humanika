import { useState } from "react";
import { Department, Status } from "@/types/enums";
import type {
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/types/task";
import type { AlertType } from "@/components/admin/ui/alert/Alert";

export interface TaskFormData {
  title: string;
  subtitle: string;
  note: string;
  department: Department;
  userId?: string;
  workProgramId?: string;
  status: Status;
}

export const useTaskForm = (
  task?: {
    title: string;
    subtitle?: string;
    note: string;
    department: Department;
    userId?: string;
    workProgramId?: string;
    status: Status;
  },
  onSubmit?: (
    formData: CreateDepartmentTaskInput | UpdateDepartmentTaskInput
  ) => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || "",
    subtitle: task?.subtitle || "",
    note: task?.note || "",
    department: task?.department || Department.BPH,
    userId: task?.userId || "",
    workProgramId: task?.workProgramId || "",
    status: task?.status || Status.DRAFT,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (formErrors[name as keyof TaskFormData]) {
      setFormErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleNoteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, note: value }));
    if (formErrors.note) {
      setFormErrors((prev) => {
        const { note: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.note.trim()) errors.note = "Note is required";
    if (!formData.department) errors.department = "Department is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !onSubmit) return;

    setIsSubmitting(true);
    setAlert(null);

    try {
      const submitData = {
        ...formData,
        userId: formData.userId || undefined,
        workProgramId: formData.workProgramId || undefined,
      };
      await onSubmit(submitData);
      setAlert({
        type: "success",
        message: task
          ? "Task updated successfully!"
          : "Task created successfully!",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setAlert({
        type: "error",
        message: "Failed to save task. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    alert,
    formData,
    setFormData,
    formErrors,
    handleChange,
    handleNoteChange,
    validateForm,
    handleSubmit,
  };
};
