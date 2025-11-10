import type { ActivityLog } from "@/types/activity-log";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getActivities = async (): Promise<ActivityLog[]> => {
  const response = await fetch(`${API_URL}/system/activity`, {
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
  return result.activities || [];
};

export const ActivityApi = {
  getActivities,
};
