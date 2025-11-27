"use client";

import { useState } from "react";
import { FiUser, FiMail, FiKey, FiUsers, FiLock } from "react-icons/fi";
import { UserRole, Department, Position } from "@/types/enums";
import { formatEnumValue } from "@/lib/utils";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import PasswordInput from "@/components/admin/ui/input/PasswordInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
export interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

interface UserFormProps {
  onSubmit: (formData: CreateUserData) => Promise<void>;
}

export default function UserForm({ onSubmit }: UserFormProps) {
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

  return (
    <>
      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              icon={<FiUser className="text-gray-400" />}
              error={formErrors.name}
            />

            <TextInput
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder="Enter email address"
              required
              type="email"
              icon={<FiMail className="text-gray-400" />}
              error={formErrors.email}
            />

            <TextInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              icon={<FiUser className="text-gray-400" />}
              error={formErrors.username}
            />

            <SelectInput
              label="Role"
              name="role"
              value={formData.role || ""}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, role: value as UserRole }))
              }
              options={Object.values(UserRole).map((role) => ({
                value: role,
                label: role,
              }))}
              required
              icon={<FiUsers className="text-gray-400" />}
            />

            <SelectInput
              label="Department"
              name="department"
              value={formData.department || ""}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  department: value ? (value as Department) : undefined,
                }))
              }
              options={[
                { value: "", label: "Select a department" },
                ...Object.values(Department).map((dept) => ({
                  value: dept,
                  label: dept,
                })),
              ]}
              icon={<FiUsers className="text-gray-400" />}
            />

            <SelectInput
              label="Position"
              name="position"
              value={formData.position || ""}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  position: value ? (value as Position) : undefined,
                }))
              }
              options={[
                { value: "", label: "Select a position" },
                ...Object.values(Position).map((pos) => ({
                  value: pos,
                  label: formatEnumValue(pos),
                })),
              ]}
              icon={<FiUsers className="text-gray-400" />}
            />

            <SelectInput
              label="Status"
              name="isActive"
              value={formData.isActive ? "true" : "false"}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, isActive: value === "true" }))
              }
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              required
              icon={<FiLock className="text-gray-400" />}
            />

            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set a password (min. 6 characters)"
              required
              icon={<FiKey className="text-gray-400" />}
              error={formErrors.password}
              hint="Password must be at least 6 characters long."
              className="md:col-span-2"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <SubmitButton
              isSubmitting={isSubmitting}
              text="Create User"
              loadingText="Creating User..."
            />
          </div>
        </form>
      </div>
    </>
  );
}
