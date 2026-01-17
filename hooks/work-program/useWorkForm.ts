import { useState, useEffect } from "react";
import type {
  WorkProgram,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
} from "@/types/work";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import { Department } from "@/types/enums";
import { UserApi } from "@/use-cases/api/user";
import { getPeriods } from "@/use-cases/api/period";

interface FormData {
  name: string;
  department: Department;
  schedule: string;
  funds: number;
  usedFunds: number;
  remainingFunds: number;
  goal: string;
  period: Period | string | null;
  responsible: User | string | null;
}

interface UseWorkFormProps {
  workProgram?: WorkProgram;
  onSubmit: (
    data: CreateWorkProgramInput | UpdateWorkProgramInput
  ) => Promise<void>;
}

export function useWorkForm({ workProgram, onSubmit }: UseWorkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, periodsResponse] = await Promise.all([
          UserApi.getUsers({ allUsers: true }),
          getPeriods(),
        ]);

        setUsers(usersResponse.data?.users || []);
        setPeriods(periodsResponse);
      } catch (err) {
        console.error("Error loading form data:", err);
      }
    };

    fetchData();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    name: workProgram?.name || "",
    department: workProgram?.department || Department.INFOKOM,
    schedule: workProgram?.schedule || "",
    funds: workProgram?.funds || 0,
    usedFunds: workProgram?.usedFunds || 0,
    remainingFunds: workProgram ? workProgram.funds - workProgram.usedFunds : 0,
    goal: workProgram?.goal || "",
    period: workProgram?.period || null,
    responsible: workProgram?.responsible || null,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGoalChange = (value: string) => {
    setFormData((prev) => ({ ...prev, goal: value }));
    if (formErrors.goal) {
      setFormErrors((prev) => ({ ...prev, goal: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Program name is required";
    }
    if (!formData.goal.trim()) {
      errors.goal = "Goals and objectives are required";
    }
    if (
      !formData.period ||
      (typeof formData.period === "string" && !formData.period.trim())
    ) {
      errors.periodId = "Period is required";
    }
    if (
      !formData.responsible ||
      (typeof formData.responsible === "string" && !formData.responsible.trim())
    ) {
      errors.responsibleId = "Responsible person is required";
    }
    if (formData.funds <= 0) {
      errors.funds = "Budget must be greater than 0";
    }
    if (formData.usedFunds < 0) {
      errors.usedFunds = "Used funds cannot be negative";
    }
    if (formData.usedFunds > formData.funds) {
      errors.usedFunds = "Used funds cannot exceed total funds";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name,
        department: formData.department,
        schedule: formData.schedule,
        funds: formData.funds,
        usedFunds: formData.usedFunds,
        goal: formData.goal,
        periodId:
          typeof formData.period === "string"
            ? formData.period
            : formData.period?.id || "",
        responsibleId:
          typeof formData.responsible === "string"
            ? formData.responsible
            : formData.responsible?.id || "",
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
