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
  // Use /api/system/activity for activity logs (not /api/activity which is for radar chart stats)
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

  const responseData = await response.json();

  // Handle API response format: { success: true, data: {...} } or direct {...}
  if (responseData.success === false) {
    console.error("Activity API error:", responseData.error);
    return {
      activities: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // Handle both wrapped { data: {...} } and direct {...} formats
  const data = responseData.data || responseData;

  // Extract activities from various possible formats
  let activities: ActivityLog[] = [];
  if (Array.isArray(data?.activities)) {
    activities = data.activities;
  } else if (Array.isArray(data)) {
    activities = data;
  }

  // Extract pagination from various possible formats
  const pagination = data?.pagination || {
    page: params?.page || 1,
    limit: params?.limit || 10,
    total: 0,
    totalPages: 0,
  };

  return {
    activities,
    pagination,
  };
};

/**
 * Radar chart data structure for department activity visualization
 */
export interface RadarChartResult {
  subject: string;
  A: number;
  fullMark: number;
}

/**
 * Fetch activities for radar chart visualization
 * Returns aggregated activity counts per department
 */
export const getActivitiesRadarChart = async (): Promise<
  RadarChartResult[]
> => {
  const response = await fetch(`${API_URL}/activity`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch activity radar chart data");
  }

  const responseData = await response.json();

  // Handle API response format: { success: true, data: [...] } or direct [...]
  if (responseData.success === false) {
    console.error("Activity Radar Chart API error:", responseData.error);
    return [];
  }

  // Handle both wrapped { data: {...} } and direct {...} formats
  const data = responseData.data || responseData;

  // Extract radar chart data array
  if (Array.isArray(data)) {
    return data;
  }

  return [];
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
  getActivitiesRadarChart,
  logActivity,
};
