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

/**
 * Get Google refresh token from cookies
 * @returns The refresh token string or empty string if not found
 */
export async function getGoogleRefreshToken(): Promise<string> {
  const cookieStore = cookies();
  const refreshToken =
    (await cookieStore).get("google_refresh_token")?.value || "";
  return refreshToken;
}

/**
 * Refresh Google access token using refresh token
 * @returns The new access token
 * @throws Error if no refresh token or refresh failed
 */
export async function refreshGoogleAccessToken(): Promise<string> {
  const refreshToken = await getGoogleRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const response = await oauth2Client.refreshAccessToken();
  const newAccessToken = response.credentials.access_token;

  if (!newAccessToken) {
    throw new Error("Failed to refresh access token");
  }

  // Update the access token cookie
  const cookieStore = cookies();
  (await cookieStore).set({
    name: "google_access_token",
    value: newAccessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return newAccessToken;
}
