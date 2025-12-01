import { oauth2Client } from "@/lib/google-drive/google-oauth";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { isProduction } from "@/lib/config/config";
import { googleClientId, googleClientSecret } from "@/lib/config/config";

export async function GET() {
  try {
    // Validasi environment variables
    if (!googleClientId || !googleClientSecret) {
      throw new Error("Missing Google OAuth credentials");
    }

    const SCOPE = [
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/drive.photos.readonly",
    ];

    const state = crypto.randomBytes(16).toString("hex");

    // Generate auth URL
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPE,
      state,
      prompt: "consent",
      // Include client_id untuk memastikan tidak ada kesalahan
      client_id: googleClientId,
    });

    // Simpan state ke cookie untuk verifikasi nanti
    const response = NextResponse.json({ url });
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60, // 1 jam
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);

    return NextResponse.json(
      {
        error: "Failed to initiate OAuth flow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
