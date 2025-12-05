import { useState, useEffect } from "react";
import { UserApi } from "@/use-cases/api/user";
import type { User, UpdateUserData } from "@/types/user";
import { UserRole } from "@/types/enums";

type AlertType = "error" | "success" | "warning" | "info";

export function useEditUserForm(
  userId: string,
  initialUser?: User,
  onSuccess?: () => void,
  onDelete?: () => void
) {
  const [user, setUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({
    name: "",
    email: "",
    username: "",
    password: "",
    role: initialUser?.role || UserRole.ANGGOTA,
    department: undefined,
    position: undefined,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Partial<UpdateUserData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setFormData({
        name: initialUser.name,
        email: initialUser.email,
        username: initialUser.username,
        password: "",
        role: initialUser.role,
        department: initialUser.department || undefined,
        position: initialUser.position || undefined,
        isActive: initialUser.isActive,
      });
    } else {
      const fetchUser = async () => {
        try {
          const response = await UserApi.getUserById(userId);

          if (response.error) {
            setAlert({ type: "error", message: response.error });
          } else if (response.data) {
            const userData = response.data;
            setUser(userData);
            setFormData({
              name: userData.name,
              email: userData.email,
              username: userData.username,
              password: "",
              role: userData.role,
              department: userData.department ?? undefined,
              position: userData.position ?? undefined,
              isActive: userData.isActive,
            });
          }
        } catch (_error) {
          setAlert({ type: "error", message: "Failed to fetch user data" });
        }
      };

      fetchUser();
    }
  }, [userId, initialUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "department" || name === "position"
          ? value === ""
            ? undefined
            : value
          : value,
    }));

    // Clear error when field is changed
    if (formErrors[name as keyof UpdateUserData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const updateFormData = (key: keyof UpdateUserData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear error when field is changed
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<UpdateUserData> = {};

    if (!formData.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.username?.trim()) {
      errors.username = "Username is required";
    }
    if (formData.password && formData.password.length < 6) {
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
      const response = await UserApi.updateUser(userId, formData);

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else {
        setAlert({ type: "success", message: "User updated successfully!" });
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      }
    } catch (_error) {
      setAlert({
        type: "error",
        message: "Failed to update user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setAlert(null);

    try {
      const response = await UserApi.deleteUser(userId);

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else {
        setAlert({ type: "success", message: "User deleted successfully!" });
        setTimeout(() => {
          onDelete?.();
        }, 1000);
      }
    } catch (_error) {
      setAlert({
        type: "error",
        message: "Failed to delete user. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    user,
    alert,
    formData,
    formErrors,
    isSubmitting,
    isDeleting,
    handleChange,
    updateFormData,
    handleSubmit,
    handleDelete,
  };
}
