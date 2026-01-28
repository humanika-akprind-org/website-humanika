/**
 * Register API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - POST: Uses repository for user registration with validation
 *
 * Pattern Choice Rationale:
 * - POST register: Repository provides validation, logging, and proper
 *   user creation workflow with default role assignment
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateUserData } from "@/domain/entities/user.entity";
import { register } from "@/infrastructure/repositories/auth/register.repository";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractRegisterBody(
  request: NextRequest,
): Promise<CreateUserData> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

function validateRegisterInput(body: CreateUserData): ValidationResult {
  if (!body.name?.trim()) {
    return { isValid: false, error: "Name is required" };
  }
  if (!body.email?.trim()) {
    return { isValid: false, error: "Email is required" };
  }
  if (!body.username?.trim()) {
    return { isValid: false, error: "Username is required" };
  }
  if (!body.password?.trim()) {
    return { isValid: false, error: "Password is required" };
  }
  if (body.password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }
  return { isValid: true };
}

// ============================================================================
// POST /api/auth/register - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Extract payload
    const body = await extractRegisterBody(request);

    // 2. Basic validation (repository will do deeper validation)
    const validation = validateRegisterInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use repository for registration
    const result = await register(
      body.name,
      body.email,
      body.username,
      body.password,
    );

    // 4. Handle registration result
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    // 5. Response
    const response = NextResponse.json({
      success: true,
      message: result.message,
      data: { user: result.user },
    });

    // Do NOT set auth cookie here to prevent auto-login before verification
    return response;
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific error cases
    if ((error as Error).message.includes("already exists")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 409 },
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
