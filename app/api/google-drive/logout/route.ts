import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear Google Drive cookies
  response.cookies.delete("google_access_token");
  response.cookies.delete("google_refresh_token");
  response.cookies.delete("oauth_state");

  return response;
}
