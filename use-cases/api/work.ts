import type {
  WorkProgram,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
  WorkProgramFilter,
} from "@/types/work";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getWorkPrograms = async (
  filter?: WorkProgramFilter
): Promise<WorkProgram[]> => {
  const params = new URLSearchParams();

  if (filter?.department) params.append("department", filter.department);
  if (filter?.status) params.append("status", filter.status.toString());
  if (filter?.periodId) params.append("periodId", filter.periodId);
  if (filter?.search) params.append("search", filter.search);

  const response = await fetch(`${API_URL}/work?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch work programs");
  }

  return response.json();
};

export const getWorkProgram = async (id: string): Promise<WorkProgram> => {
  const response = await fetch(`${API_URL}/work/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch work program");
  }

  return response.json();
};

export const createWorkProgram = async (
  data: CreateWorkProgramInput
): Promise<WorkProgram> => {
  const response = await fetch(`${API_URL}/work`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create work program");
  }

  return response.json();
};

export const updateWorkProgram = async (
  id: string,
  data: UpdateWorkProgramInput
): Promise<WorkProgram> => {
  const response = await fetch(`${API_URL}/work/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update work program");
  }

  return response.json();
};

export const deleteWorkProgram = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/work/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete work program");
  }
};

export const deleteWorkPrograms = async (
  ids: string[]
): Promise<{ deletedCount: number }> => {
  const response = await fetch(`${API_URL}/work`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete work programs");
  }

  return response.json();
};

export const WorkApi = {
  getWorkPrograms,
  getWorkProgram,
  createWorkProgram,
  updateWorkProgram,
  deleteWorkProgram,
  deleteWorkPrograms,
};
