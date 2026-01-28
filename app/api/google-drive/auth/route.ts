/**
 * Google Drive Auth API Route
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route initiates Google OAuth 2.0 flow for Google Drive access.
 * Pattern: Direct response (simple OAuth URL generation)
 *
 * Rationale: OAuth URL generation is a simple operation that doesn't
 * require complex business logic, validation beyond basic checks, or logging.
 * The OAuth flow is handled by Google's servers.
 */

import { oauth2Client } from "@/infrastructure/external-services/google/google-oauth";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { isProduction } from "@/presentation/lib/config/config";
import {
  googleClientId,
  googleClientSecret,
} from "@/presentation/lib/config/config";

// ============================================================================
// OAuth Configuration
// ============================================================================

/** Google OAuth scopes for Drive access */
const GOOGLE_DRIVE_SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.photos.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

/** OAuth state cookie expiration (1 hour in seconds) */
const OAUTH_STATE_MAX_AGE = 60 * 60;

// ============================================================================
// GET /api/google-drive/auth - Direct Response Pattern
// ============================================================================

export async function GET() {
  try {
    // 1. Validate environment variables
    if (!googleClientId || !googleClientSecret) {
      throw new Error("Missing Google OAuth credentials");
    }

    // 2. Generate secure random state for CSRF protection
    const state = crypto.randomBytes(16).toString("hex");

    // 3. Generate OAuth authorization URL
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GOOGLE_DRIVE_SCOPES,
      state,
      prompt: "consent",
      client_id: googleClientId,
    });

    // 4. Create response with OAuth state cookie
    const response = NextResponse.json({ url });
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: isProduction,
      maxAge: OAUTH_STATE_MAX_AGE,
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
      { status: 500 },
    );
  }
}
