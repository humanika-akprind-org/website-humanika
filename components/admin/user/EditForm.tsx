"use client";

import { useState } from "react";
import { FiUser, FiMail, FiKey, FiUsers, FiLock, FiX } from "react-icons/fi";
import { UserRole, Department, Position } from "@/types/enums";
import { formatEnumValue } from "@/lib/utils";
import type { User } from "@/types/user";
import TextInput from "../ui/input/TextInput";
import SelectInput from "../ui/input/SelectInput";
import PasswordInput from "../ui/input/PasswordInput";
import Alert from "../ui/alert/Alert";
import SubmitButton from "../ui/button/SubmitButton";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import UserInfoHeader from "../ui/UserInfoHeader";
import { useRouter } from "next/navigation";
import CancelButton from "@/components/ui/CancelButton";
import { useEditUserForm } from "@/hooks/user/useEditUserForm";

interface UserEditFormProps {
  userId: string;
  onSuccess?: () => void;
  onDelete?: () => void;
  user?: User;
}

export default function UserEditForm({
  userId,
  onSuccess,
  onDelete,
  user: initialUser,
}: UserEditFormProps): JSX.Element {
  const router = useRouter();

  const {
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
  } = useEditUserForm(userId, initialUser, onSuccess, onDelete);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-gray-500">Loading user data...</div>
      </div>
    );
  }

  return (
    <>
      {alert && <Alert type={alert.type} message={alert.message} />}

      <UserInfoHeader user={user} />

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextInput
              label="Full Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              icon={<FiUser className="text-gray-400" />}
              error={formErrors.name}
            />

            <TextInput
              label="Email Address"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              type="email"
              icon={<FiMail className="text-gray-400" />}
              error={formErrors.email}
            />

            <TextInput
              label="Username"
              name="username"
              value={formData.username || ""}
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
                updateFormData("role", value as UserRole)
              }
              options={Object.values(UserRole).map((role) => ({
                value: role,
                label: formatEnumValue(role),
              }))}
              required
              icon={<FiUsers className="text-gray-400" />}
            />

            <SelectInput
              label="Department"
              name="department"
              value={formData.department || ""}
              onChange={(value: string) =>
                updateFormData(
                  "department",
                  value ? (value as Department) : undefined
                )
              }
              options={Object.values(Department).map((dept) => ({
                value: dept,
                label: formatEnumValue(dept),
              }))}
              placeholder="Select a department"
              icon={<FiUsers className="text-gray-400" />}
            />

            <SelectInput
              label="Position"
              name="position"
              value={formData.position || ""}
              onChange={(value: string) =>
                updateFormData(
                  "position",
                  value ? (value as Position) : undefined
                )
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
                updateFormData("isActive", value === "true")
              }
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              required
              icon={<FiLock className="text-gray-400" />}
            />

            <PasswordInput
              label="New Password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
              icon={<FiKey className="text-gray-400" />}
              error={formErrors.password}
              hint="Minimum 6 characters. Leave empty to keep current password."
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center disabled:opacity-50"
            >
              <FiX className="mr-2" />
              {isDeleting ? "Deleting..." : "Delete User"}
            </button>

            <div className="flex justify-end space-x-3">
              <CancelButton
                onClick={() => router.back()}
                disabled={isSubmitting}
              />

              <SubmitButton
                isSubmitting={isSubmitting}
                text="Update User"
                loadingText="Updating User..."
              />
            </div>
          </div>
        </form>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={user?.name}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
