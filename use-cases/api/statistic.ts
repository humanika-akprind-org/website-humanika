import type {
  Statistic,
  CreateStatisticInput,
  UpdateStatisticInput,
  StatisticFilter,
} from "@/types/statistic";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getStatistics = async (
  filter?: StatisticFilter
): Promise<Statistic[]> => {
  const params = new URLSearchParams();

  if (filter?.periodId) params.append("periodId", filter.periodId);

  const response = await fetch(`${API_URL}/statistics?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }

  return response.json();
};

export const getStatistic = async (id: string): Promise<Statistic> => {
  const response = await fetch(`${API_URL}/statistics/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistic");
  }

  return response.json();
};

export const getStatisticByPeriod = async (
  periodId: string
): Promise<Statistic | null> => {
  const response = await fetch(`${API_URL}/statistics?periodId=${periodId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistic by period");
  }

  const data = await response.json();
  return data.length > 0 ? data[0] : null;
};

export const getActivePeriodStatistic = async (): Promise<Statistic | null> => {
  const response = await fetch(`${API_URL}/statistics?period=active`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch active period statistic");
  }

  return response.json();
};

export const createStatistic = async (
  data: CreateStatisticInput
): Promise<Statistic> => {
  const response = await fetch(`${API_URL}/statistics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create statistic";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Statistic creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateStatistic = async (
  id: string,
  data: UpdateStatisticInput
): Promise<Statistic> => {
  const response = await fetch(`${API_URL}/statistics/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update statistic");
  }

  return response.json();
};

export const deleteStatistic = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/statistics/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete statistic");
  }
};

export const StatisticApi = {
  getStatistics,
  getStatistic,
  getStatisticByPeriod,
  getActivePeriodStatistic,
  createStatistic,
  updateStatistic,
  deleteStatistic,
};
