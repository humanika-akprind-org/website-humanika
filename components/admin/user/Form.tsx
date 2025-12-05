"use client";

import { FiUser, FiMail, FiKey, FiUsers, FiLock } from "react-icons/fi";
import { UserRole, Department, Position } from "@/types/enums";
import { formatEnumValue } from "@/lib/utils";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import PasswordInput from "@/components/admin/ui/input/PasswordInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import Alert from "@/components/admin/ui/alert/Alert";
import { useRouter } from "next/navigation";
import CancelButton from "@/components/ui/CancelButton";
import { useUserForm } from "@/hooks/user/useUserForm";
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
  const router = useRouter();
  const {
    isSubmitting,
    alert,
    formData,
    setFormData,
    formErrors,
    handleChange,
    handleSubmit,
    handleEmailChange,
  } = useUserForm(onSubmit);

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
              options={Object.values(Department).map((dept) => ({
                value: dept,
                label: dept,
              }))}
              placeholder="Select a department"
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
              options={Object.values(Position).map((pos) => ({
                value: pos,
                label: formatEnumValue(pos),
              }))}
              placeholder="Select a position"
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
            <CancelButton
              onClick={() => router.back()}
              disabled={isSubmitting}
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              text="Add User"
              loadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </>
  );
}
