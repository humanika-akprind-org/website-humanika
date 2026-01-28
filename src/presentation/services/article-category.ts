import type {
  ArticleCategory,
  CreateArticleCategoryInput,
  UpdateArticleCategoryInput,
} from "@/domain/value-objects/article-category";

// Re-export the type for convenience
export type { ArticleCategory } from "@/domain/value-objects/article-category";

import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export const getArticleCategories = async (): Promise<ArticleCategory[]> => {
  const response = await fetch(`${API_URL}/article/category`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article categories");
  }

  const responseData = await response.json();
  // API returns { success, data: [...] } format, extract the data array
  return responseData?.data || responseData || [];
};

export const getArticleCategory = async (
  id: string,
): Promise<ArticleCategory> => {
  const response = await fetch(`${API_URL}/article/category/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article category");
  }

  return response.json();
};

export const createArticleCategory = async (
  data: CreateArticleCategoryInput,
): Promise<ArticleCategory> => {
  const response = await fetch(`${API_URL}/article/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create article category";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Article category creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateArticleCategory = async (
  id: string,
  data: UpdateArticleCategoryInput,
): Promise<ArticleCategory> => {
  const response = await fetch(`${API_URL}/article/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update article category");
  }

  return response.json();
};

export const deleteArticleCategory = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/article/category/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete article category");
  }
};

// Helper function for getting categories with article count
export const getArticleCategoriesWithCount = async (): Promise<
  ArticleCategory[]
> => {
  const response = await fetch(`${API_URL}/article/category?withCount=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article categories");
  }

  const responseData = await response.json();
  return responseData?.data || responseData || [];
};

// Alias for getArticleCategoriesWithCount for public use
export const getPublishedCategories = getArticleCategoriesWithCount;

export const ArticleCategoryApi = {
  getArticleCategories,
  getArticleCategory,
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
  getArticleCategoriesWithCount,
};
