"use server";

import { getGoogleAccessToken } from "@/src/presentation/lib/google-drive/google-oauth";

export async function getAccessTokenAction() {
  return getGoogleAccessToken();
}
