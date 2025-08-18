import { oauth2Client } from "@/lib/google-oauth";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    // Validasi environment variables
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
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
      client_id: process.env.CLIENT_ID,
    });

    // Simpan state ke cookie untuk verifikasi nanti
    const response = NextResponse.json({ url });
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 menit
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
