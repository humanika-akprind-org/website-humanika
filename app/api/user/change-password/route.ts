/**
 * Change Password API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route handles user password changes
 */

import { type NextRequest, NextResponse } from "next/server";
import { changePassword } from "@/infrastructure/repositories/user";
import { getCurrentUser } from "@/presentation/lib/auth-server";

// ============================================================================
// Local Types
// ============================================================================

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractChangePasswordBody(
  request: NextRequest,
): Promise<ChangePasswordBody> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateChangePasswordInput(body: ChangePasswordBody) {
  const errors: string[] = [];

  if (!body.currentPassword || body.currentPassword.trim() === "") {
    errors.push("Current password is required");
  }

  if (!body.newPassword || body.newPassword.trim() === "") {
    errors.push("New password is required");
  }

  if (body.newPassword && body.newPassword.length < 6) {
    errors.push("New password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// POST /api/user/change-password - Change user password
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Get current user
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Extract payload
    const body = await extractChangePasswordBody(request);

    // 3. Basic validation
    const validation = validateChangePasswordInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 4. Use repository for password change
    await changePassword(
      currentUser.id,
      body.currentPassword,
      body.newPassword,
    );

    // 5. Response
    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);

    if ((error as Error).message === "User not found or password not set") {
      return NextResponse.json(
        { success: false, error: "User not found or password not set" },
        { status: 404 },
      );
    }

    if ((error as Error).message === "Current password is incorrect") {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
