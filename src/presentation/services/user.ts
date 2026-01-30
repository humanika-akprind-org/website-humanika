import { UserRole, Department, Position } from "@/domain/enums";
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UsersResponse,
} from "@/domain/entities/user.entity";
import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

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
}): Promise<{ data?: UsersResponse; error?: string }> {
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

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch users";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (_e) {
        errorMessage = response.statusText || errorMessage;
      }
      return { error: errorMessage };
    }

    const responseData = await response.json();

    // Handle API response format: { success: true, data: {...} } or { success: false, error: "..." }
    if (responseData.success === false) {
      console.error("User API error:", responseData.error);
      return {
        data: {
          users: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        },
      };
    }

    return { data: responseData.data || responseData };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to fetch users",
    };
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User> {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch user";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Create new user
export async function createUser(userData: CreateUserData): Promise<User> {
  const response = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create user";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    console.error(
      "User creation failed:",
      "status:",
      response.status,
      "statusText:",
      response.statusText,
      "errorMessage:",
      errorMessage,
      "data:",
      userData,
    );
    throw new Error(errorMessage);
  }

  return response.json();
}

// Update user
export async function updateUser(
  id: string,
  userData: UpdateUserData | Partial<CreateUserData>,
): Promise<User> {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    let errorMessage = "Failed to update user";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Delete user
export async function deleteUser(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete user";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Toggle user active status
export async function toggleUserStatus(
  id: string,
  isActive: boolean,
): Promise<User> {
  return updateUser(id, { isActive });
}

// Get current authenticated user
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch current user";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Change current user's password
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/user/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to change password";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Delete current user's account
export async function deleteCurrentAccount(): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/user/delete-account`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete account";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
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
}): Promise<{ data?: UsersResponse; error?: string }> {
  return getUsers({
    ...params,
    verifiedAccount: false,
  });
}

// Verify a user account
export async function verifyUser(id: string): Promise<User> {
  const response = await fetch(`${API_URL}/user/${id}/verify`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "Failed to verify user";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Send verification email to a user
export async function sendVerificationEmail(
  id: string,
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/user/${id}/send-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "Failed to send verification email";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Bulk verify users
export async function bulkVerifyUsers(
  ids: string[],
): Promise<{ count: number }> {
  const response = await fetch(`${API_URL}/user/bulk-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ userIds: ids }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to bulk verify users";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Bulk send verification emails
export async function bulkSendVerification(
  ids: string[],
): Promise<{ count: number }> {
  const response = await fetch(`${API_URL}/user/bulk-send-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ userIds: ids }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to bulk send verification emails";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
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

export const positionOptions = (Object.values(Position) as string[]).map(
  (position) => ({
    value: position,
    label: formatEnumValue(position),
  }),
);

// Export types for convenience
export type { User, CreateUserData, UpdateUserData, UsersResponse };

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
