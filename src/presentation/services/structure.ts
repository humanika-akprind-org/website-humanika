import type {
  OrganizationalStructure,
  OrganizationalStructureFilter,
} from "@/domain/entities/organizational-structure.entity";
import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export const getStructures = async (
  filter?: OrganizationalStructureFilter,
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

export const getStructure = async (
  id: string,
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

export const createStructure = async (
  data: Partial<OrganizationalStructure>,
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
    throw new Error("Failed to create organizational structure");
  }

  return response.json();
};

export const updateStructure = async (
  id: string,
  data: Partial<OrganizationalStructure>,
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

export const deleteStructure = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/structure/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete organizational structure");
  }
};

// Helper function for getting published structures (public use)
export const getPublishedStructures = async (): Promise<
  OrganizationalStructure[]
> => {
  const response = await fetch(`${API_URL}/structure?status=PUBLISH`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch published structures");
  }

  return response.json();
};

export const StructureApi = {
  getStructures,
  getStructure,
  createStructure,
  updateStructure,
  deleteStructure,
  getPublishedStructures,
};
