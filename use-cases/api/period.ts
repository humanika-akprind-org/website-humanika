import type { Period, PeriodFormData, PeriodApiResponse } from "@/types/period";
import { apiUrl } from "@/lib/config";

const API_BASE_URL = apiUrl;

export const getPeriods = async (): Promise<Period[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/period`);

    if (!response.ok) {
      throw new Error("Failed to fetch periods");
    }

    const result: PeriodApiResponse = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    throw new Error(result.message || "Invalid response format");
  } catch (error) {
    console.error("Error fetching periods:", error);
    throw error;
  }
};

export const getPeriod = async (id: string): Promise<Period> => {
  try {
    const response = await fetch(`${API_BASE_URL}/period/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch period");
    }

    const result: PeriodApiResponse = await response.json();

    if (result.success && result.data && !Array.isArray(result.data)) {
      return result.data;
    }

    throw new Error(result.message || "Invalid response format");
  } catch (error) {
    console.error("Error fetching period:", error);
    throw error;
  }
};

export const createPeriod = async (
  periodData: PeriodFormData
): Promise<Period> => {
  try {
    const response = await fetch(`${API_BASE_URL}/period`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(periodData),
    });

    if (!response.ok) {
      throw new Error("Failed to create period");
    }

    const result: PeriodApiResponse = await response.json();

    if (result.success && result.data && !Array.isArray(result.data)) {
      return result.data;
    }

    throw new Error(result.message || "Invalid response format");
  } catch (error) {
    console.error("Error creating period:", error);
    throw error;
  }
};

export const updatePeriod = async (
  id: string,
  periodData: PeriodFormData
): Promise<Period> => {
  try {
    const response = await fetch(`${API_BASE_URL}/period/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(periodData),
    });

    if (!response.ok) {
      throw new Error("Failed to update period");
    }

    const result: PeriodApiResponse = await response.json();

    if (result.success && result.data && !Array.isArray(result.data)) {
      return result.data;
    }

    throw new Error(result.message || "Invalid response format");
  } catch (error) {
    console.error("Error updating period:", error);
    throw error;
  }
};

export const deletePeriod = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/period/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete period");
    }

    const result: PeriodApiResponse = await response.json();

    return result.success || false;
  } catch (error) {
    console.error("Error deleting period:", error);
    throw error;
  }
};

export const reorderPeriods = async (periods: Period[]): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/period/reorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ periods }),
    });

    if (!response.ok) {
      throw new Error("Failed to reorder periods");
    }

    const result: PeriodApiResponse = await response.json();
    return result.success || false;
  } catch (error) {
    console.error("Error reordering periods:", error);
    throw error;
  }
};

export const PeriodApi = {
  getPeriods,
  getPeriod,
  createPeriod,
  updatePeriod,
  deletePeriod,
  reorderPeriods,
};
