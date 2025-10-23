import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentFilter,
} from "@/types/document";
import { apiUrl } from "@/lib/config";

const API_URL = apiUrl;

export const getDocuments = async (
  filter?: DocumentFilter
): Promise<Document[]> => {
  const params = new URLSearchParams();

  if (filter?.type) params.append("type", filter.type);
  if (filter?.status) params.append("status", filter.status.toString());
  if (filter?.userId) params.append("userId", filter.userId);
  if (filter?.eventId) params.append("eventId", filter.eventId);
  if (filter?.letterId) params.append("letterId", filter.letterId);
  if (filter?.search) params.append("search", filter.search);

  const response = await fetch(`${API_URL}/document?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};

export const getDocument = async (id: string): Promise<Document> => {
  const response = await fetch(`${API_URL}/document/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch document");
  }

  return response.json();
};

export const createDocument = async (
  data: CreateDocumentInput
): Promise<Document> => {
  const response = await fetch(`${API_URL}/document`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create document";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Document creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateDocument = async (
  id: string,
  data: UpdateDocumentInput
): Promise<Document> => {
  const response = await fetch(`${API_URL}/document/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update document");
  }

  return response.json();
};

export const deleteDocument = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/document/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete document");
  }
};
