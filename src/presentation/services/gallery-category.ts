import type {
  GalleryCategory,
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/domain/value-objects/gallery-category";
import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export const getGalleryCategories = async (): Promise<GalleryCategory[]> => {
  const response = await fetch(`${API_URL}/gallery/category`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch gallery categories");
  }
  return response.json();
};

export const getGalleryCategory = async (
  id: string,
): Promise<GalleryCategory> => {
  const response = await fetch(`${API_URL}/gallery/category/${id}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch gallery category");
  }
  return response.json();
};

export const createGalleryCategory = async (
  data: CreateGalleryCategoryInput,
): Promise<GalleryCategory> => {
  const response = await fetch(`${API_URL}/gallery/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create gallery category");
  }
  return response.json();
};

export const updateGalleryCategory = async (
  id: string,
  data: UpdateGalleryCategoryInput,
): Promise<GalleryCategory> => {
  const response = await fetch(`${API_URL}/gallery/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update gallery category");
  }
  return response.json();
};

export const deleteGalleryCategory = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/gallery/category/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete gallery category");
  }
};

export const GalleryCategoryApi = {
  getGalleryCategories,
  getGalleryCategory,
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
};
