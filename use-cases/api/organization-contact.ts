import type {
  OrganizationContact,
  CreateOrganizationContactInput,
  UpdateOrganizationContactInput,
  OrganizationContactFilter,
} from "@/types/organization-contact";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getOrganizationContacts = async (
  filter?: OrganizationContactFilter
): Promise<OrganizationContact[]> => {
  const params = new URLSearchParams();

  if (filter?.periodId) params.append("periodId", filter.periodId);

  const response = await fetch(
    `${API_URL}/organization-contact?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch organization contacts");
  }

  return response.json();
};

export const getOrganizationContact = async (
  id: string
): Promise<OrganizationContact> => {
  const response = await fetch(`${API_URL}/organization-contact/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organization contact");
  }

  return response.json();
};

export const getActivePeriodOrganizationContact =
  async (): Promise<OrganizationContact | null> => {
    const response = await fetch(
      `${API_URL}/organization-contact?period=active`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch active period organization contact");
    }

    return response.json();
  };

export const createOrganizationContact = async (
  data: CreateOrganizationContactInput
): Promise<OrganizationContact> => {
  const response = await fetch(`${API_URL}/organization-contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create organization contact";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Organization contact creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateOrganizationContact = async (
  id: string,
  data: UpdateOrganizationContactInput
): Promise<OrganizationContact> => {
  const response = await fetch(`${API_URL}/organization-contact/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update organization contact");
  }

  return response.json();
};

export const deleteOrganizationContact = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/organization-contact/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete organization contact");
  }
};

export const OrganizationContactApi = {
  getOrganizationContacts,
  getOrganizationContact,
  getActivePeriodOrganizationContact,
  createOrganizationContact,
  updateOrganizationContact,
  deleteOrganizationContact,
};
