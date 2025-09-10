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
import { apiUrl } from "@/lib/config";

// Enum values from Prisma
enum UserRole {
  DPO = "DPO",
  BPH = "BPH",
  PENGURUS = "PENGURUS",
  ANGGOTA = "ANGGOTA",
}

enum Department {
  INFOKOM = "INFOKOM",
  PSDM = "PSDM",
  LITBANG = "LITBANG",
  KWU = "KWU",
}

enum Position {
  KETUA_UMUM = "KETUA_UMUM",
  WAKIL_KETUA_UMUM = "WAKIL_KETUA_UMUM",
  SEKRETARIS = "SEKRETARIS",
  BENDAHARA = "BENDAHARA",
  KEPALA_DEPARTEMEN = "KEPALA_DEPARTEMEN",
  STAFF_DEPARTEMEN = "STAFF_DEPARTEMEN",
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  department?: Department;
  position?: Position;
  isActive: boolean;
  verifiedAccount: boolean;
  attemptLogin: number;
  blockExpires?: string;
  createdAt: string;
  updatedAt: string;
  avatarColor: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
}

// Helper function to format enum values for display
const formatEnumValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

class UserApi {
  private static API_BASE_URL = apiUrl;

  private static async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "An error occurred" };
      }

      return { data };
    } catch (_error) {
      return { error: "Network error occurred" };
    }
  }

  static async getUserById(
    id: string
  ): Promise<{ data?: User; error?: string }> {
    return this.fetchApi<User>(`/user/${id}`);
  }

  static async updateUser(
    id: string,
    userData: UpdateUserData
  ): Promise<{ data?: User; error?: string }> {
    return this.fetchApi<User>(`/user/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  static async deleteUser(
    id: string
  ): Promise<{ data?: { message: string }; error?: string }> {
    return this.fetchApi<{ message: string }>(`/user/${id}`, {
      method: "DELETE",
    });
  }
}

interface UserEditFormProps {
  userId: string;
  onSuccess?: () => void;
  onDelete?: () => void;
}

export default function UserEditForm({ userId, onSuccess, onDelete }: UserEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
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
    const fetchUser = async () => {
      try {
        const response = await UserApi.getUserById(userId);

        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          const userData = response.data;
          setUser(userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            username: userData.username,
            password: "",
            role: userData.role,
            department: userData.department,
            position: userData.position,
            isActive: userData.isActive,
          });
        }
      } catch (_error) {
        setError("Failed to fetch user data");
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is changed
    if (formErrors[name as keyof UpdateUserData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<UpdateUserData> = {};

    if (!formData.name?.trim()) errors.name = "Name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.username?.trim()) errors.username = "Username is required";
    if (formData.password && formData.password.length < 6) errors.password = "Password must be at least 6 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await UserApi.updateUser(userId, formData);

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("User updated successfully");
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      }
    } catch (_error) {
      setError("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await UserApi.deleteUser(userId);

      if (response.error) {
        setError(response.error);
        setShowDeleteModal(false);
      } else {
        setSuccess("User deleted successfully");
        setTimeout(() => {
          onDelete?.();
        }, 1000);
      }
    } catch (_error) {
      setError("Failed to delete user. Please try again.");
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="flex items-center mb-6">
          <div
            className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center text-white ${user.avatarColor}`}
          >
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username || ""}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUsers className="text-gray-400" />
                </div>
                <select
                  name="role"
                  required
                  value={formData.role || UserRole.ANGGOTA}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>
                      {formatEnumValue(role)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUsers className="text-gray-400" />
                </div>
                <select
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select a department</option>
                  {Object.values(Department).map((dept) => (
                    <option key={dept} value={dept}>
                      {formatEnumValue(dept)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUsers className="text-gray-400" />
                </div>
                <select
                  name="position"
                  value={formData.position || ""}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select a position</option>
                  {Object.values(Position).map((pos) => (
                    <option key={pos} value={pos}>
                      {formatEnumValue(pos)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <select
                  name="isActive"
                  required
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.value === "true",
                    }))
                  }
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiKey className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave blank to keep current"
                />
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.password}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters. Leave empty to keep current password.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50"
            >
              <FiSave className="mr-2" />
              {isSubmitting ? "Updating User..." : "Update User"}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Confirm Deletion
                </h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete {user.name}? This action cannot
                be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center disabled:opacity-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
