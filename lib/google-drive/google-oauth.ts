import { google } from "googleapis";
import {
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
} from "@/lib/config/config";
import { cookies } from "next/headers";

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
export async function getGoogleAccessToken(): Promise<string> {
  const cookieStore = cookies();
  const accessToken =
    (await cookieStore).get("google_access_token")?.value || "";
  return accessToken;
}
