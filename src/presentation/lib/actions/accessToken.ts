"use server";

import { getGoogleAccessToken } from "@/infrastructure/external-services/google/google-oauth";

export async function getAccessTokenAction() {
  return getGoogleAccessToken();
}
