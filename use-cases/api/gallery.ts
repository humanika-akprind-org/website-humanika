import type {
  Gallery,
  CreateGalleryInput,
  UpdateGalleryInput,
  GalleryFilter,
} from "@/types/gallery";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getGalleries = async (
  filter?: GalleryFilter
): Promise<Gallery[]> => {
  const params = new URLSearchParams();

  if (filter?.eventId) params.append("eventId", filter.eventId);
  if (filter?.search) params.append("search", filter.search);

  const response = await fetch(`${API_URL}/gallery?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch galleries");
  }

  return response.json();
};

export const getGallery = async (id: string): Promise<Gallery> => {
  const response = await fetch(`${API_URL}/gallery/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gallery");
  }

  return response.json();
};

export const createGallery = async (
  data: CreateGalleryInput
): Promise<Gallery> => {
  const response = await fetch(`${API_URL}/gallery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create gallery";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Gallery creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateGallery = async (
  id: string,
  data: UpdateGalleryInput
): Promise<Gallery> => {
  const response = await fetch(`${API_URL}/gallery/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update gallery");
  }

  return response.json();
};

export const deleteGallery = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/gallery/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete gallery");
  }
};

export const GalleryApi = {
  getGallery,
  getGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
};
