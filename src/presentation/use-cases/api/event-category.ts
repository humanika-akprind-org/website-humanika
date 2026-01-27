import type {
  EventCategory,
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/types/event-category";

export const getEventCategories = async (): Promise<EventCategory[]> => {
  const response = await fetch("/api/event/category");
  if (!response.ok) {
    throw new Error("Failed to fetch event categories");
  }
  return response.json();
};

export const getEventCategory = async (id: string): Promise<EventCategory> => {
  const response = await fetch(`/api/event/category/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch event category");
  }
  return response.json();
};

export const createEventCategory = async (
  data: CreateEventCategoryInput
): Promise<EventCategory> => {
  const response = await fetch("/api/event/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create event category");
  }
  return response.json();
};

export const updateEventCategory = async (
  id: string,
  data: UpdateEventCategoryInput
): Promise<EventCategory> => {
  const response = await fetch(`/api/event/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update event category");
  }
  return response.json();
};

export const deleteEventCategory = async (id: string): Promise<void> => {
  const response = await fetch(`/api/event/category/${id}`, {
    method: "DELETE",
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
