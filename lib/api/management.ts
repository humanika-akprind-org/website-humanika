import type {
  Management,
  ManagementServerData,
  ManagementApiResponse,
} from "@/types/management";
// import { ApiResponseStatus } from "@/types/enums";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const ManagementApi = {
  async getManagements(): Promise<Management[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/management`);
      const result: ManagementApiResponse = await response.json();

      if (result.success && result.data) {
        return Array.isArray(result.data) ? result.data : [result.data];
      }
      throw new Error(result.message || "Failed to fetch managements");
    } catch (error) {
      console.error("Error fetching managements:", error);
      throw error;
    }
  },

  async getManagement(id: string): Promise<Management> {
    try {
      const response = await fetch(`${API_BASE_URL}/management/${id}`);
      const result: ManagementApiResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        return result.data;
      }
      throw new Error(result.message || "Failed to fetch management");
    } catch (error) {
      console.error("Error fetching management:", error);
      throw error;
    }
  },

  async createManagement(formData: ManagementServerData): Promise<Management> {
    try {
      const response = await fetch(`${API_BASE_URL}/management`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ManagementApiResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        return result.data;
      }
      throw new Error(result.message || "Failed to create management");
    } catch (error) {
      console.error("Error creating management:", error);
      throw error;
    }
  },

  async updateManagement(
    id: string,
    formData: ManagementServerData
  ): Promise<Management> {
    try {
      const response = await fetch(`${API_BASE_URL}/management/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ManagementApiResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        return result.data;
      }
      throw new Error(result.message || "Failed to update management");
    } catch (error) {
      console.error("Error updating management:", error);
      throw error;
    }
  },

  async deleteManagement(id: string, accessToken?: string | null): Promise<void> {
    try {
      const headers: Record<string, string> = {};

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/management/${id}`, {
        method: "DELETE",
        headers,
      });

      const result: ManagementApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete management");
      }
    } catch (error) {
      console.error("Error deleting management:", error);
      throw error;
    }
  },
};
