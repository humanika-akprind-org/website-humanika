import { oauth2Client } from "@/lib/google-oauth";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const SCOPE = [
      "https://www.googleapis.com/auth/drive",
      // scope lainnya...
    ];

    const state = crypto.randomBytes(16).toString("hex");
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPE,
      state,
      prompt: "consent",
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Connection error:", error); // Gunakan variabel error
  }
}
