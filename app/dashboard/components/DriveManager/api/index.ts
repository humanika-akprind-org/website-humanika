import { ApiRequestBody } from "../types";

export const callApi = async (body: ApiRequestBody, formData?: FormData) => {
  try {
    const res = await fetch("/api/google-drive", {
      method: "POST",
      headers: formData ? undefined : { "Content-Type": "application/json" },
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
  const res = await fetch(`/api/google-drive-list?accessToken=${accessToken}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch files");
  }

  return data.files || [];
};

export const fetchDriveFolders = async (accessToken: string) => {
  const res = await fetch(
    `/api/google-drive-folders?accessToken=${accessToken}`
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch folders");
  }

  return data.folders || [];
};
