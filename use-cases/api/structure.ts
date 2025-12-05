import type {
  OrganizationalStructure,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
  OrganizationalStructureFilter,
} from "@/types/structure";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

// Fungsi fetch dasar yang dapat digunakan oleh semua fungsi API
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ error?: string; data?: T }> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      cache: "no-store",
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

export const getOrganizationalStructures = async (
  filter?: OrganizationalStructureFilter
): Promise<{ error?: string; data?: OrganizationalStructure[] }> => {
  const params = new URLSearchParams();

  if (filter?.status) params.append("status", filter.status.toString());
  if (filter?.periodId) params.append("periodId", filter.periodId);
  if (filter?.search) params.append("search", filter.search);

  const queryString = params.toString();
  const endpoint = `/structure${queryString ? `?${queryString}` : ""}`;

  return fetchApi<OrganizationalStructure[]>(endpoint);
};

export const getOrganizationalStructure = async (
  id: string
): Promise<{ error?: string; data?: OrganizationalStructure }> =>
  fetchApi<OrganizationalStructure>(`/structure/${id}`);

export const createOrganizationalStructure = async (
  data: CreateOrganizationalStructureInput
): Promise<{ error?: string; data?: OrganizationalStructure }> =>
  fetchApi<OrganizationalStructure>("/structure", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateOrganizationalStructure = async (
  id: string,
  data: UpdateOrganizationalStructureInput
): Promise<{ error?: string; data?: OrganizationalStructure }> =>
  fetchApi<OrganizationalStructure>(`/structure/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteOrganizationalStructure = async (
  id: string
): Promise<{ error?: string; data?: { message: string } }> =>
  fetchApi<{ message: string }>(`/structure/${id}`, {
    method: "DELETE",
  });

// Export API object for consistency with other API files
export const StructureApi = {
  getStructures: getOrganizationalStructures,
  getStructure: getOrganizationalStructure,
  createStructure: createOrganizationalStructure,
  updateStructure: updateOrganizationalStructure,
  deleteStructure: deleteOrganizationalStructure,
};
