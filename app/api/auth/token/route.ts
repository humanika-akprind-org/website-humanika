/**
 * Token API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Direct repository access for simple read operation (token retrieval)
 * - POST: Use case pattern for token refresh with validation and error handling
 *
 * Pattern Choice Rationale:
 * - GET token: Direct access to infrastructure layer for simple read operation
 * - POST refresh: Use case pattern provides better error handling, logging,
 *   and potential approval workflow for token operations
 */

import { type NextRequest, NextResponse } from "next/server";
import {
  getGoogleAccessToken,
  refreshGoogleAccessToken,
} from "@/infrastructure/external-services/google-drive/google-oauth";
import { getCurrentUser } from "@/presentation/lib/auth-server";

// ============================================================================
// GET /api/auth/token - Direct Access Pattern
// ============================================================================

export async function GET(_request: NextRequest) {
  try {
    // Direct access to infrastructure layer for simple read
    const accessToken = await getGoogleAccessToken();

    // Response - consistent format
    return NextResponse.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get token",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/auth/token - Use Case Pattern
// ============================================================================

export async function POST(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Use infrastructure layer for token refresh
    const newAccessToken = await refreshGoogleAccessToken();

    // Response
    return NextResponse.json(
      {
        success: true,
        data: { accessToken: newAccessToken },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error refreshing token:", error);

    // Handle specific error cases
    if ((error as Error).message.includes("No refresh token")) {
      return NextResponse.json(
        {
          success: false,
          error: "No refresh token available. Please re-authenticate.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh token",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
