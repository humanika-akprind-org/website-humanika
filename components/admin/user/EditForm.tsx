"use client";

import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiKey,
  FiUsers,
  FiLock,
  FiSave,
  FiX,
} from "react-icons/fi";
import { UserRole, Department, Position } from "@/types/enums";
import { formatEnumValue } from "@/lib/utils";
import { UserApi } from "@/use-cases/api/user";
import type { User, UpdateUserData } from "@/types/user";
import TextInput from "../ui/input/TextInput";
import SelectInput from "../ui/input/SelectInput";
import PasswordInput from "../ui/input/PasswordInput";
import Alert, { type AlertType } from "../ui/alert/Alert";
import SubmitButton from "../ui/button/SubmitButton";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import UserInfoHeader from "../ui/UserInfoHeader";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    role: UserRole.ANGGOTA,
    department: undefined,
    position: undefined,
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<UpdateUserData>>({});

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
        setShowDeleteModal(false);
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
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

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
                setFormData((prev) => ({ ...prev, role: value as UserRole }))
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
                setFormData((prev) => ({
                  ...prev,
                  department: value ? (value as Department) : undefined,
                }))
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

            <SubmitButton
              isSubmitting={isSubmitting}
              text="Update User"
              loadingText="Updating User..."
              icon={<FiSave className="mr-2" />}
            />
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
