import { google } from "googleapis";
import { cookies } from "next/headers";
import {
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
} from "@/lib/config/config";

export const oauth2Client = new google.auth.OAuth2(
  googleClientId,
  googleClientSecret,
  googleRedirectUri
);

// Set credentials if available
// if (process.env.ACCESS_TOKEN && process.env.REFRESH_TOKEN) {
//   oauth2Client.setCredentials({
//     access_token: process.env.ACCESS_TOKEN,
//     refresh_token: process.env.REFRESH_TOKEN,
//   });
// }

export const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

/**
 * Get Google access token from cookies
 * @returns The access token string or empty string if not found
 */
export function getGoogleAccessToken(): string {
  const cookieStore = cookies();
  return cookieStore.get("google_access_token")?.value || "";
}
