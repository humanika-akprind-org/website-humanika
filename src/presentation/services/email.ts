import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const sendEmail = async (
  data: EmailData,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result: EmailResponse = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

export const EmailApi = {
  sendEmail,
};
