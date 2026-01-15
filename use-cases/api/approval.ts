import { apiUrl } from "@/lib/config/config";
import type {
  ApprovalsResponse,
  CreateApprovalInput,
  UpdateApprovalInput,
  ApprovalWithRelations,
} from "@/types/approval";

class ApprovalApi {
  private static API_URL = apiUrl;

  private static async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
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

  static async getApprovals(params?: {
    status?: string;
    entityType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data?: ApprovalsResponse; error?: string }> {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append("status", params.status);
    if (params?.entityType) queryParams.append("entityType", params.entityType);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/approval${queryString ? `?${queryString}` : ""}`;

    return this.fetchApi<ApprovalsResponse>(endpoint);
  }

  static async createApproval(
    approvalData: CreateApprovalInput
  ): Promise<{ data?: ApprovalWithRelations; error?: string }> {
    return this.fetchApi<ApprovalWithRelations>("/approval", {
      method: "POST",
      body: JSON.stringify(approvalData),
    });
  }

  static async updateApproval(
    id: string,
    approvalData: UpdateApprovalInput
  ): Promise<{ data?: ApprovalWithRelations; error?: string }> {
    return this.fetchApi<ApprovalWithRelations>(`/approval/${id}`, {
      method: "PUT",
      body: JSON.stringify(approvalData),
    });
  }

  static async deleteApproval(
    id: string
  ): Promise<{ data?: { message: string }; error?: string }> {
    return this.fetchApi<{ message: string }>(`/approval/${id}`, {
      method: "DELETE",
    });
  }
}

export { ApprovalApi };
