"use server";

import { getGoogleAccessToken } from "@/src/infrastructure/external-services/google-drive/google-oauth";

export async function getAccessTokenAction() {
  return getGoogleAccessToken();
}
