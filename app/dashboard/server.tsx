// server.tsx
import oauth2Client from "@/app/lib/google-oauth";
import { google } from "googleapis";

export async function getGoogleDriveFiles(accessToken: string) {

  if (!accessToken) {
    throw new Error("Missing access token");
  }

  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive("v3");
  let files;

  try {
    const result = await drive.files.list({
      auth: oauth2Client,
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
