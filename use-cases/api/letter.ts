import type {
  Letter,
  CreateLetterInput,
  UpdateLetterInput,
  LetterFilter,
} from "@/types/letter";
import { apiUrl } from "@/lib/config/config";

const API_URL = apiUrl;

export const getLetters = async (filter?: LetterFilter): Promise<Letter[]> => {
  const params = new URLSearchParams();

  if (filter?.type) params.append("type", filter.type.toString());
  if (filter?.priority) params.append("priority", filter.priority.toString());
  if (filter?.periodId) params.append("periodId", filter.periodId);
  if (filter?.eventId) params.append("eventId", filter.eventId);
  if (filter?.search) params.append("search", filter.search);

  const response = await fetch(`${API_URL}/letter?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch letters");
  }

  return response.json();
};

export const getLetter = async (id: string): Promise<Letter> => {
  const response = await fetch(`${API_URL}/letter/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch letter");
  }

  return response.json();
};

export const createLetter = async (
  data: CreateLetterInput
): Promise<Letter> => {
  const response = await fetch(`${API_URL}/letter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create letter";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("Letter creation failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      data,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateLetter = async (
  id: string,
  data: UpdateLetterInput
): Promise<Letter> => {
  const response = await fetch(`${API_URL}/letter/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update letter");
  }

  return response.json();
};

export const deleteLetter = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/letter/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete letter");
  }
};

export const LetterApi = {
  getLetters,
  getLetter,
  createLetter,
  updateLetter,
  deleteLetter,
};
