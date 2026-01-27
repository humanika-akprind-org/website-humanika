"use server";

import { getGoogleAccessToken } from "@/infrastructure/external-services/google-drive/google-oauth";

export async function getAccessTokenAction() {
  return getGoogleAccessToken();
}
