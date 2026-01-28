/**
 * Login API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - POST: Uses repository for login with validation and cookie setting
 *
 * Pattern Choice Rationale:
 * - POST login: Repository provides validation, credential checking,
 *   token generation, and proper user retrieval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/presentation/lib/auth-server";
import { login } from "@/infrastructure/repositories/auth/login.repository";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

interface LoginInput {
  usernameOrEmail: string;
  password: string;
}

async function extractLoginBody(request: NextRequest): Promise<LoginInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

function validateLoginInput(body: LoginInput): ValidationResult {
  if (!body.usernameOrEmail?.trim()) {
    return { isValid: false, error: "Username or email is required" };
  }
  if (!body.password?.trim()) {
    return { isValid: false, error: "Password is required" };
  }
  return { isValid: true };
}

// ============================================================================
// POST /api/auth/login - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Extract payload
    const body = await extractLoginBody(request);

    // 2. Basic validation (repository will do deeper validation)
    const validation = validateLoginInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use repository for login
    const result = await login(body.usernameOrEmail, body.password);

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

    return setAuthCookie(response, result.token!, 60 * 60 * 24 * 7); // 1 week
  } catch (error) {
    console.error("Login error:", error);

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
