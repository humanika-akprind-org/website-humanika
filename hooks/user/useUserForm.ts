import { useState } from "react";
import { UserRole } from "@/types/enums";
import { type CreateUserData } from "@/components/admin/pages/user/Form";
import { type AlertType } from "@/components/admin/ui/alert/Alert";

export const useUserForm = (
  onSubmit: (formData: CreateUserData) => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    username: "",
    password: "",
    role: UserRole.ANGGOTA,
    department: undefined,
    position: undefined,
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<CreateUserData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when field is changed
    if (formErrors[name as keyof CreateUserData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CreateUserData> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
      await onSubmit(formData);
      setAlert({ type: "success", message: "User created successfully!" });
    } catch (err) {
      console.error("Submission error:", err);
      setAlert({
        type: "error",
        message: "Failed to create user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateUsernameFromEmail = (email: string): string => {
    if (!email || !email.includes("@")) return "";

    const baseUsername = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace(/^[^a-z]+/, "") // Remove leading non-letters
      .replace(/[^a-z0-9]+$/, ""); // Remove trailing non-alphanumeric

    // Ensure minimum length of 3 characters
    if (baseUsername.length < 3) {
      return baseUsername + Math.random().toString(36).substring(2, 5);
    }

    // Limit maximum length to 20 characters
    return baseUsername.substring(0, 20);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData((prev) => ({
      ...prev,
      email,
      username: prev.username || generateUsernameFromEmail(email),
    }));
    handleChange(e);
  };

  return {
    isSubmitting,
    alert,
    formData,
    setFormData,
    formErrors,
    handleChange,
    validateForm,
    handleSubmit,
    generateUsernameFromEmail,
    handleEmailChange,
  };
};
