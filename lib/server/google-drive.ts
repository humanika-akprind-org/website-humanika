import { google } from "googleapis";
import { oauth2Client } from "../google-oauth";

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