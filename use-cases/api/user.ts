// @lib/api/user.ts
import { UserRole, Department } from "@/types/enums";
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UsersResponse,
  ApiResponse,
} from "@/types/user";
import { apiUrl } from "@/lib/config/config";

const API_BASE_URL = apiUrl;

// Fungsi fetch dasar yang dapat digunakan oleh semua fungsi API
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

// Get all users with pagination and filters
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | string;
  department?: Department | string;
  isActive?: boolean;
  verifiedAccount?: boolean;
}): Promise<ApiResponse<UsersResponse>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.role) queryParams.append("role", params.role);
  if (params?.department) queryParams.append("department", params.department);
  if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
  if (params?.verifiedAccount !== undefined) queryParams.append("verifiedAccount", params.verifiedAccount.toString());

  const queryString = queryParams.toString();
  const endpoint = `/user${queryString ? `?${queryString}` : ""}`;

  return fetchApi<UsersResponse>(endpoint);
}

// Get user by ID
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  return fetchApi<User>(`/user/${id}`);
}

// Create new user
export async function createUser(
  userData: CreateUserData
): Promise<ApiResponse<User>> {
  return fetchApi<User>("/user", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Update user
export async function updateUser(
  id: string,
  userData: UpdateUserData | Partial<CreateUserData>
): Promise<ApiResponse<User>> {
  return fetchApi<User>(`/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

// Delete user
export async function deleteUser(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<{ message: string }>(`/user/${id}`, {
    method: "DELETE",
  });
}

// Toggle user active status
export async function toggleUserStatus(
  id: string,
  isActive: boolean
): Promise<ApiResponse<User>> {
  return updateUser(id, { isActive });
}

// Get unverified users
export async function getUnverifiedUsers(params?: {
  search?: string;
  role?: UserRole | string;
  department?: Department | string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<UsersResponse>> {
  return getUsers({
    ...params,
    verifiedAccount: false,
  });
}

// Verify a user account
export async function verifyUser(id: string): Promise<ApiResponse<User>> {
  return fetchApi<User>(`/user/${id}/verify`, {
    method: "PATCH",
  });
}

// Send verification email to a user
export async function sendVerificationEmail(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<{ message: string }>(`/user/${id}/send-verification`, {
    method: "POST",
  });
}

// Bulk verify users
export async function bulkVerifyUsers(
  ids: string[]
): Promise<ApiResponse<{ count: number }>> {
  return fetchApi<{ count: number }>("/user/bulk-verify", {
    method: "POST",
    body: JSON.stringify({ userIds: ids }),
  });
}

// Bulk send verification emails
export async function bulkSendVerification(
  ids: string[]
): Promise<ApiResponse<{ count: number }>> {
  return fetchApi<{ count: number }>("/user/bulk-send-verification", {
    method: "POST",
    body: JSON.stringify({ userIds: ids }),
  });
}

// Helper function to format enum values for display
export const formatEnumValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

// Get all enum values as options for select inputs
export const userRoleOptions = Object.values(UserRole).map((role) => ({
  value: role,
  label: formatEnumValue(role),
}));

export const departmentOptions = Object.values(Department).map((dept) => ({
  value: dept,
  label: formatEnumValue(dept),
}));

// Export types for convenience
export type {
  User,
  CreateUserData,
  UpdateUserData,
  UsersResponse,
  ApiResponse,
};

// Ekspor objek dengan semua fungsi untuk kemudahan impor
export const UserApi = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUnverifiedUsers,
  verifyUser,
  sendVerificationEmail,
  bulkVerifyUsers,
  bulkSendVerification,
  formatEnumValue,
  userRoleOptions,
  departmentOptions,
};
