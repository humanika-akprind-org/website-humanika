/**
 * Me API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Direct access to presentation layer for simple read operation (current user)
 *
 * Pattern Choice Rationale:
 * - GET current user: Direct access to presentation layer for simple read operation
 *   since getCurrentUser already handles all authentication logic and user retrieval
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/presentation/lib/auth-server";

// ============================================================================
// GET /api/auth/me - Direct Access Pattern
// ============================================================================

export async function GET(_request: NextRequest) {
  try {
    // Direct access to presentation layer for user retrieval
    const user = await getCurrentUser();

    // Handle unauthenticated case
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    // Response - consistent format
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get current user",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
