import type {
  OrganizationalStructure,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
  OrganizationalStructureFilter,
} from "@/types/structure";
import { apiUrl } from "@/lib/config";

const API_URL = apiUrl;

export const getOrganizationalStructures = async (
  filter?: OrganizationalStructureFilter
): Promise<OrganizationalStructure[]> => {
  const params = new URLSearchParams();

  if (filter?.status) params.append("status", filter.status.toString());
  if (filter?.periodId) params.append("periodId", filter.periodId);
  if (filter?.search) params.append("search", filter.search);

  const response = await fetch(`${API_URL}/structure?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organizational structures");
  }

  return response.json();
};

export const getOrganizationalStructure = async (
  id: string
): Promise<OrganizationalStructure> => {
  const response = await fetch(`${API_URL}/structure/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organizational structure");
  }

  return response.json();
};

export const createOrganizationalStructure = async (
  data: CreateOrganizationalStructureInput
): Promise<OrganizationalStructure> => {
  const response = await fetch(`${API_URL}/structure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create organizational structure";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Organizational structure creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateOrganizationalStructure = async (
  id: string,
  data: UpdateOrganizationalStructureInput
): Promise<OrganizationalStructure> => {
  const response = await fetch(`${API_URL}/structure/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update organizational structure");
  }

  return response.json();
};

export const deleteOrganizationalStructure = async (
  id: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/structure/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete organizational structure");
  }
};
