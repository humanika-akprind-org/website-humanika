import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  ArticleFilter,
} from "@/types/article";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getArticles = async (
  filter?: ArticleFilter
): Promise<Article[]> => {
  const params = new URLSearchParams();

  if (filter?.status) params.append("status", filter.status.toString());
  if (filter?.periodId) params.append("periodId", filter.periodId);
  if (filter?.categoryId) params.append("categoryId", filter.categoryId);
  if (filter?.authorId) params.append("authorId", filter.authorId);
  if (filter?.search) params.append("search", filter.search);

  const response = await fetch(`${API_URL}/article?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
};

export const getArticle = async (id: string): Promise<Article> => {
  const response = await fetch(`${API_URL}/article/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch article";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const response = await fetch(`${API_URL}/article/slug/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch article by slug";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const createArticle = async (
  data: CreateArticleInput
): Promise<Article> => {
  const response = await fetch(`${API_URL}/article`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create article";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error(
      "Article creation failed:",
      "status:",
      response.status,
      "statusText:",
      response.statusText,
      "errorMessage:",
      errorMessage,
      "data:",
      data
    );
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateArticle = async (
  id: string,
  data: UpdateArticleInput
): Promise<Article> => {
  const response = await fetch(`${API_URL}/article/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update article");
  }

  return response.json();
};

export const deleteArticle = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/article/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete article");
  }
};

export const ArticleApi = {
  getArticles,
  getArticle,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
};
