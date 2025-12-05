"use server";

import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";

export async function getAccessTokenAction() {
  return getGoogleAccessToken();
}
