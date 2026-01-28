import type {
  EventCategory,
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/domain/value-objects/event-category";
import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export const getEventCategories = async (): Promise<EventCategory[]> => {
  const response = await fetch(`${API_URL}/event/category`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch event categories");
  }
  return response.json();
};

export const getEventCategory = async (id: string): Promise<EventCategory> => {
  const response = await fetch(`${API_URL}/event/category/${id}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch event category");
  }
  return response.json();
};

export const createEventCategory = async (
  data: CreateEventCategoryInput,
): Promise<EventCategory> => {
  const response = await fetch(`${API_URL}/event/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create event category");
  }
  return response.json();
};

export const updateEventCategory = async (
  id: string,
  data: UpdateEventCategoryInput,
): Promise<EventCategory> => {
  const response = await fetch(`${API_URL}/event/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update event category");
  }
  return response.json();
};

export const deleteEventCategory = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/event/category/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete event category");
  }
};

export const EventCategoryApi = {
  getEventCategories,
  getEventCategory,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
};
