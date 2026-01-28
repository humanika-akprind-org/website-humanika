/**
 * Bulk Verify Users API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import { BulkVerifyUsersUseCase } from "@/application/use-cases/user";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/user";

// ============================================================================
// Local Types
// ============================================================================

interface BulkVerifyBody {
  userIds: string[];
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractBulkVerifyBody(
  request: NextRequest,
): Promise<BulkVerifyBody> {
  return await request.json();
}

// ============================================================================
// POST /api/user/bulk-verify - Bulk verify users
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Extract payload
    const body = await extractBulkVerifyBody(request);

    // 3. Use use case for bulk verify
    const repo = new UserRepositoryPrisma();
    const useCase = new BulkVerifyUsersUseCase(repo);
    const result = await useCase.execute(body.userIds);

    // 4. Response
    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} users verified successfully`,
    });
  } catch (error) {
    console.error("Error bulk verifying users:", error);

    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
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
