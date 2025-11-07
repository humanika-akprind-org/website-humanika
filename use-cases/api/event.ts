import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventFilter,
} from "@/types/event";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getEvents = async (filter?: EventFilter): Promise<Event[]> => {
  const params = new URLSearchParams();

  if (filter?.department) params.append("department", filter.department);
  if (filter?.status) params.append("status", filter.status.toString());
  if (filter?.periodId) params.append("periodId", filter.periodId);
  if (filter?.workProgramId) params.append("workProgramId", filter.workProgramId);
  if (filter?.search) params.append("search", filter.search);
  if (filter?.startDate) params.append("startDate", filter.startDate.toISOString());
  if (filter?.endDate) params.append("endDate", filter.endDate.toISOString());

  const response = await fetch(`${API_URL}/event?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
};

export const getEvent = async (id: string): Promise<Event> => {
  const response = await fetch(`${API_URL}/event/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  return response.json();
};

export const createEvent = async (data: CreateEventInput): Promise<Event> => {
  const response = await fetch(`${API_URL}/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create event";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Event creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateEvent = async (
  id: string,
  data: UpdateEventInput
): Promise<Event> => {
  const response = await fetch(`${API_URL}/event/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  return response.json();
};

export const deleteEvent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/event/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
};
