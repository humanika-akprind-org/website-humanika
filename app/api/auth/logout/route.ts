/**
 * Logout API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - POST: Uses repository for logout with cookie clearing
 *
 * Pattern Choice Rationale:
 * - POST logout: Repository provides proper logout workflow including
 *   session invalidation and cookie clearing
 */

import { type NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/presentation/lib/clear-auth-cookies";
import { logout } from "@/infrastructure/repositories/auth/logout.repository";

// ============================================================================
// POST /api/auth/logout - Use Case Pattern
// ============================================================================

export async function POST(_request: NextRequest) {
  try {
    // Use repository for logout
    const result = await logout();

    // Handle logout result
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    // Clear auth cookies and return response
    const response = NextResponse.json({
      success: true,
      message: result.message,
    });

    return clearAuthCookies(response);
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
