import { UserRole, Department, Position } from "@/types/enums";
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UsersResponse,
  ApiResponse,
} from "@/types/user";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
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
  position?: Position | string;
  isActive?: boolean;
  verifiedAccount?: boolean;
  allUsers?: boolean;
}): Promise<ApiResponse<UsersResponse>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.role) queryParams.append("role", params.role);
  if (params?.department) queryParams.append("department", params.department);
  if (params?.position) queryParams.append("position", params.position);
  if (params?.isActive !== undefined) {
    queryParams.append("isActive", params.isActive.toString());
  }
  if (params?.verifiedAccount !== undefined) {
    queryParams.append("verifiedAccount", params.verifiedAccount.toString());
  }
  if (params?.allUsers !== undefined) {
    queryParams.append("allUsers", params.allUsers.toString());
  }

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

// Get current authenticated user
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return fetchApi<User>("/auth/me");
}

// Change current user's password
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<{ message: string }>("/user/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Delete current user's account
export async function deleteCurrentAccount(): Promise<
  ApiResponse<{ message: string }>
> {
  return fetchApi<{ message: string }>("/user/delete-account", {
    method: "DELETE",
  });
}

// Get unverified users
export async function getUnverifiedUsers(params?: {
  search?: string;
  role?: UserRole | string;
  department?: Department | string;
  position?: Position | string;
  page?: number;
  limit?: number;
  allUsers?: boolean;
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

export const positionOptions = Object.values(Position).map((position) => ({
  value: position as string,
  label: formatEnumValue(position as string),
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
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  deleteCurrentAccount,
  toggleUserStatus,
  getUnverifiedUsers,
  verifyUser,
  sendVerificationEmail,
  bulkVerifyUsers,
  bulkSendVerification,
  formatEnumValue,
  userRoleOptions,
  departmentOptions,
  positionOptions,
};
