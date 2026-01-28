import { type ApiRequestBody } from "@/domain/value-objects/google-drive";
import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export const callApi = async (body: ApiRequestBody, formData?: FormData) => {
  try {
    const res = await fetch(`${API_URL}/google-drive`, {
      method: "POST",
      headers: formData ? undefined : { "Content-Type": "application/json" },
      credentials: "include",
      body: formData ?? JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API call error:", err);
    throw err;
  }
};

export const fetchDriveFiles = async (accessToken: string) => {
  const res = await fetch(
    `${API_URL}/google-drive/files?accessToken=${accessToken}`,
    {
      credentials: "include",
    },
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch files");
  }

  return data.files || [];
};

export const fetchDriveFolders = async (accessToken: string) => {
  const res = await fetch(
    `${API_URL}/google-drive/folders?accessToken=${accessToken}`,
    {
      credentials: "include",
    },
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch folders");
  }

  return data.folders || [];
};

export const getGoogleDriveAuthUrl = async (): Promise<{ url: string }> => {
  const res = await fetch(`${API_URL}/google-drive/auth`, {
    credentials: "include",
  });
  return res.json();
};

export const logoutGoogleDrive = async (): Promise<void> => {
  await fetch(`${API_URL}/google-drive/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const GoogleDriveApi = {
  callApi,
  fetchDriveFiles,
  fetchDriveFolders,
  getGoogleDriveAuthUrl,
  logoutGoogleDrive,
};
