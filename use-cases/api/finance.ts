import type {
  Finance,
  CreateFinanceInput,
  UpdateFinanceInput,
  FinanceFilter,
} from "@/types/finance";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getFinances = async (
  filter?: FinanceFilter
): Promise<Finance[]> => {
  const params = new URLSearchParams();

  if (filter?.type) params.append("type", filter.type);
  if (filter?.status) params.append("status", filter.status.toString());
  if (filter?.categoryId) params.append("categoryId", filter.categoryId);
  if (filter?.workProgramId) {
    params.append("workProgramId", filter.workProgramId);
  }
  if (filter?.search) params.append("search", filter.search);
  if (filter?.startDate) {
    params.append("startDate", filter.startDate.toISOString());
  }
  if (filter?.endDate) params.append("endDate", filter.endDate.toISOString());

  const response = await fetch(`${API_URL}/finance?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch finances");
  }

  return response.json();
};

export const getFinance = async (id: string): Promise<Finance> => {
  const response = await fetch(`${API_URL}/finance/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch finance");
  }

  return response.json();
};

export const createFinance = async (
  data: CreateFinanceInput
): Promise<Finance> => {
  const response = await fetch(`${API_URL}/finance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create finance";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Finance creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateFinance = async (
  id: string,
  data: UpdateFinanceInput
): Promise<Finance> => {
  const response = await fetch(`${API_URL}/finance/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update finance");
  }

  return response.json();
};

export const deleteFinance = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/finance/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete finance");
  }
};

export const FinanceApi = {
  getFinances,
  getFinance,
  createFinance,
  updateFinance,
  deleteFinance,
};
