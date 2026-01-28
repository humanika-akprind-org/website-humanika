import type { ActivityLog } from "@/domain/entities/activity-log.entity";
import type { ActivityMetadata } from "@/domain/entities/activity-log.entity";
import { type ActivityType } from "@/domain/enums";
import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export interface ActivityParams {
  activityType?: ActivityType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ActivityApiResponse {
  activities: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getActivities = async (
  params?: ActivityParams,
): Promise<ActivityApiResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.activityType) {
    queryParams.append("activityType", params.activityType);
  }
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = `/system/activity${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const result = await response.json();
  return {
    activities: result.activities || [],
    pagination: result.pagination || {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: 0,
      totalPages: 0,
    },
  };
};

export const logActivity = async (data: {
  activityType: ActivityType;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: ActivityMetadata;
}): Promise<ActivityLog> => {
  const response = await fetch(`${API_URL}/system/activity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to log activity");
  }

  return response.json();
};

export const ActivityApi = {
  getActivities,
  logActivity,
};
