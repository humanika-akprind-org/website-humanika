import type {
  Management,
  CreateManagementData,
  UpdateManagementData,
  ManagementsResponse,
  ApiResponse,
} from "@/types/management";
import { Department, Position } from "@/types/enums";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
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

// Get all managements with pagination and filters
export async function getManagements(params?: {
  page?: number;
  limit?: number;
  search?: string;
  department?: Department | string;
  position?: Position | string;
}): Promise<ApiResponse<ManagementsResponse>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.department) queryParams.append("department", params.department);
  if (params?.position) queryParams.append("position", params.position);

  const queryString = queryParams.toString();
  const endpoint = `/management${queryString ? `?${queryString}` : ""}`;

  return fetchApi<ManagementsResponse>(endpoint);
}

// Get management by ID
export async function getManagementById(
  id: string
): Promise<ApiResponse<Management>> {
  return fetchApi<Management>(`/management/${id}`);
}

// Create new management
export async function createManagement(
  managementData: CreateManagementData
): Promise<ApiResponse<Management>> {
  const formData = new FormData();
  formData.append("userId", managementData.userId);
  formData.append("periodId", managementData.periodId);
  formData.append("position", managementData.position);
  formData.append("department", managementData.department);

  if (managementData.photoFile) {
    formData.append("photo", managementData.photoFile);
  }

  return fetchApi<Management>("/management", {
    method: "POST",
    body: formData,
  });
}

// Update management
export async function updateManagement(
  id: string,
  managementData: UpdateManagementData
): Promise<ApiResponse<Management>> {
  const formData = new FormData();

  if (managementData.userId) formData.append("userId", managementData.userId);
  if (managementData.periodId) formData.append("periodId", managementData.periodId);
  if (managementData.position) formData.append("position", managementData.position);
  if (managementData.department) formData.append("department", managementData.department);

  if (managementData.photoFile) {
    formData.append("photo", managementData.photoFile);
  }

  if (managementData.photoFile === null) {
    formData.append("removePhoto", "true");
  }

  return fetchApi<Management>(`/management/${id}`, {
    method: "PUT",
    body: formData,
  });
}

// Delete management
export async function deleteManagement(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<{ message: string }>(`/management/${id}`, {
    method: "DELETE",
  });
}

// Bulk delete managements
export async function bulkDeleteManagements(
  ids: string[]
): Promise<ApiResponse<{ count: number }>> {
  return fetchApi<{ count: number }>("/management/bulk-delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });
}

// Helper functions for UI
export const formatPosition = (position: Position) =>
  position
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatDepartment = (department: Department) =>
  department.charAt(0) + department.slice(1).toLowerCase();

// Get all enum values as options for select inputs
export const positionOptions = Object.values(Position).map((position) => ({
  value: position,
  label: formatPosition(position),
}));

export const departmentOptions = Object.values(Department).map((dept) => ({
  value: dept,
  label: formatDepartment(dept),
}));

// Export types for convenience
export type {
  Management,
  CreateManagementData,
  UpdateManagementData,
  ManagementsResponse,
  ApiResponse,
};

// Export object with all functions for easy importing
export const managementAPI = {
  getManagements,
  getManagementById,
  createManagement,
  updateManagement,
  deleteManagement,
  bulkDeleteManagements,
  formatPosition,
  formatDepartment,
  positionOptions,
  departmentOptions,
};
