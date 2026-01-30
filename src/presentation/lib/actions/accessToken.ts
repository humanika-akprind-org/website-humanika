"use server";

import {
  getGoogleAccessToken,
  getGoogleUserEmail,
  refreshGoogleAccessToken,
} from "@/infrastructure/external-services/google/google-oauth";

export async function getAccessTokenAction() {
  return getGoogleAccessToken();
}

export async function validateAccessToken(token: string): Promise<boolean> {
  try {
    const email = await getGoogleUserEmail(token);
    return email !== "";
  } catch {
    return false;
  }
}

export async function refreshAccessTokenAction(): Promise<string | null> {
  try {
    const newToken = await refreshGoogleAccessToken();
    return newToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
}
