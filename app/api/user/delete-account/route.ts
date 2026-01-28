/**
 * Delete Account API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 */

import { type NextRequest, NextResponse } from "next/server";
import {
  getCurrentUser,
  clearAuthCookies,
} from "@/presentation/lib/auth-server";
import { DeleteAccountUseCase } from "@/application/use-cases/user";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/user";

// ============================================================================
// DELETE /api/user/delete-account - Delete user account
// ============================================================================

export async function DELETE(_request: NextRequest) {
  try {
    // 1. Get current user
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Use use case for account deletion
    const repo = new UserRepositoryPrisma();
    const useCase = new DeleteAccountUseCase(repo);
    await useCase.execute(currentUser.id);

    // 3. Log out the user after deletion
    await clearAuthCookies();

    // 4. Response
    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);

    if ((error as Error).message === "User not found") {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
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
