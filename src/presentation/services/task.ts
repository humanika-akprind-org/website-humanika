import type {
  DepartmentTask,
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
  DepartmentTaskFilter,
} from "@/domain/entities/task-department.entity";
import { Department, Status } from "@/domain/enums";
import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export const getDepartmentTasks = async (
  filter?: DepartmentTaskFilter,
): Promise<DepartmentTask[]> => {
  const params = new URLSearchParams();

  if (filter?.department) params.append("department", filter.department);
  if (filter?.status) params.append("status", filter.status.toString());
  if (filter?.userId) params.append("userId", filter.userId);
  if (filter?.search) params.append("search", filter.search);

  const response = await fetch(`${API_URL}/task?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch department tasks");
  }

  const responseData = await response.json();

  // Handle API response format: { success: true, data: [...] } or direct array [...]
  if (responseData.success === false) {
    console.error("Task API error:", responseData.error);
    return [];
  }

  // Handle both wrapped { data: [...] } and direct [...] formats
  if (Array.isArray(responseData)) {
    return responseData;
  }
  if (Array.isArray(responseData.data)) {
    return responseData.data;
  }
  return responseData || [];
};

export const getDepartmentTask = async (
  id: string,
): Promise<DepartmentTask> => {
  const response = await fetch(`${API_URL}/task/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch department task");
  }

  const responseData = await response.json();
  return responseData?.data || responseData;
};

export const createDepartmentTask = async (
  data: CreateDepartmentTaskInput,
): Promise<DepartmentTask> => {
  const response = await fetch(`${API_URL}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create department task";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Department task creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateDepartmentTask = async (
  id: string,
  data: UpdateDepartmentTaskInput,
): Promise<DepartmentTask> => {
  const response = await fetch(`${API_URL}/task/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update department task");
  }

  return response.json();
};

export const deleteDepartmentTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/task/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete department task");
  }
};

export const taskStatusOptions = Object.values(Status).map((status) => ({
  value: status,
  label: status.charAt(0) + status.slice(1).toLowerCase(),
}));

export const taskDepartmentOptions = Object.values(Department).map((dept) => ({
  value: dept,
  label: dept.charAt(0) + dept.slice(1).toLowerCase(),
}));
