// lib/google-drive.ts
import { google } from "googleapis";
import { Readable } from "stream";
import { oauth2Client } from "./google-oauth";

// Set credentials if available
if (process.env.ACCESS_TOKEN && process.env.REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
  });
}

const drive = google.drive({ version: "v3", auth: oauth2Client });

interface UploadParams {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export async function uploadToGoogleDrive({
  originalname,
  buffer,
  mimetype,
}: UploadParams) {
  try {
    const fileMetadata = {
      name: originalname,
      parents: ["root"], // Upload to root folder
    };

    const media = {
      mimeType: mimetype,
      body: Readable.from(buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    return {
      fileId: response.data.id!,
      webViewLink: response.data.webViewLink!,
    };
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw new Error("Failed to upload file to Google Drive");
  }
}

export async function listFiles() {
  try {
    const response = await drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name, webViewLink)",
    });
    return response.data.files || [];
  } catch (error) {
    console.error("Error listing files:", error);
    throw new Error("Failed to list files from Google Drive");
  }
}

export async function getGoogleDriveFiles(accessToken: string) {
  if (!accessToken) {
    throw new Error("Missing access token");
  }

  // Create a new oauth2Client instance for this specific request
  const client = oauth2Client;
  client.setCredentials({ access_token: accessToken });

  const driveWithToken = google.drive({ version: "v3", auth: client });

  let files;

  try {
    const result = await driveWithToken.files.list({
      pageSize: 15,
      fields: "nextPageToken, files(id, name)",
    });
    files = result.data.files;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch files from Google Drive.");
  }

  return files;
}

export interface GoogleDriveResponse {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

export async function googleDriveUpload(
  file: File
): Promise<GoogleDriveResponse> {
  try {
    // Implement your Google Drive upload logic here
    // This should handle the actual file upload to Google Drive
    // and return the file URL

    // Example implementation (replace with your actual Google Drive API integration):
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/google-drive/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Google Drive upload failed");
    }

    const data = await response.json();

    return {
      success: true,
      fileUrl: data.fileUrl,
    };
  } catch (error) {
    console.error("Google Drive upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}