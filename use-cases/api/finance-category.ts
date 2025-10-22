import type {
  FinanceCategory,
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
  FinanceCategoryFilter,
} from "@/types/finance-category";
import { apiUrl } from "@/lib/config";

const API_URL = apiUrl;

export const getFinanceCategories = async (
  filter?: FinanceCategoryFilter
): Promise<FinanceCategory[]> => {
  const params = new URLSearchParams();

  if (filter?.type) params.append("type", filter.type);
  if (filter?.isActive !== undefined) params.append("isActive", filter.isActive.toString());
  if (filter?.search) params.append("search", filter.search);

  const response = await fetch(`${API_URL}/finance/category?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch finance categories");
  }

  return response.json();
};

export const getFinanceCategory = async (id: string): Promise<FinanceCategory> => {
  const response = await fetch(`${API_URL}/finance/category/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch finance category");
  }

  return response.json();
};

export const createFinanceCategory = async (
  data: CreateFinanceCategoryInput
): Promise<FinanceCategory> => {
  const response = await fetch(`${API_URL}/finance/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create finance category";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Finance category creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateFinanceCategory = async (
  id: string,
  data: UpdateFinanceCategoryInput
): Promise<FinanceCategory> => {
  const response = await fetch(`${API_URL}/finance/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update finance category");
  }

  return response.json();
};

export const deleteFinanceCategory = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/finance/category/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete finance category");
  }
};
