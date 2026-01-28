/**
 * Google Drive Logout API Route
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route handles clearing Google Drive authentication cookies.
 * Pattern: Direct response (simple operation - no use case needed)
 *
 * Rationale: Logout is a simple cookie cleanup operation that doesn't
 * require complex business logic, validation, or logging.
 */

import { NextResponse } from "next/server";

// ============================================================================
// Cookies to clear
// ============================================================================

const GOOGLE_DRIVE_COOKIES = [
  "google_access_token",
  "google_refresh_token",
  "oauth_state",
] as const;

// ============================================================================
// POST /api/google-drive/logout - Direct Response Pattern
// ============================================================================

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear Google Drive authentication cookies
  for (const cookie of GOOGLE_DRIVE_COOKIES) {
    response.cookies.delete(cookie);
  }

  return response;
}
