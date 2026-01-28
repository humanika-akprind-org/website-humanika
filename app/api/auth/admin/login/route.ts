/**
 * Admin Login API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - POST: Uses repository for admin login with validation and cookie setting
 *
 * Pattern Choice Rationale:
 * - POST admin login: Repository provides validation, credential checking,
 *   token generation, and proper admin user retrieval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/presentation/lib/auth-server";
import { adminLogin } from "@/infrastructure/repositories/auth/admin-login.repository";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

interface AdminLoginInput {
  usernameOrEmail: string;
  password: string;
}

async function extractAdminLoginBody(
  request: NextRequest,
): Promise<AdminLoginInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

function validateAdminLoginInput(body: AdminLoginInput): ValidationResult {
  if (!body.usernameOrEmail?.trim()) {
    return { isValid: false, error: "Username or email is required" };
  }
  if (!body.password?.trim()) {
    return { isValid: false, error: "Password is required" };
  }
  return { isValid: true };
}

// ============================================================================
// POST /api/auth/admin/login - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Extract payload
    const body = await extractAdminLoginBody(request);

    // 2. Basic validation (repository will do deeper validation)
    const validation = validateAdminLoginInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use repository for admin login
    const result = await adminLogin(body.usernameOrEmail, body.password);

    // 4. Handle login result
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    // 5. Set auth cookie and return response
    const response = NextResponse.json({
      success: true,
      data: { user: result.user, token: result.token },
    });

    return setAuthCookie(response, result.token!, 60 * 60 * 6); // 6 hours
  } catch (error) {
    console.error("Admin login error:", error);

    // Handle specific error cases
    if ((error as Error).message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 404 },
      );
    }

    if ((error as Error).message.includes("Access denied")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 403 },
      );
    }

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
