/**
 * Approval [id] API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - PUT: Uses use case for complex update operations with validation
 * - DELETE: Uses use case for complex delete operations with validation
 *
 * Pattern Choice Rationale:
 * - PUT update: Use case provides validation, logging, and entity status sync
 * - DELETE: Use case provides validation, logging, and audit trail
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  UpdateApprovalUseCase,
  DeleteApprovalUseCase,
} from "@/application/use-cases/approval";

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateApprovalInput(body: Record<string, unknown>) {
  const errors: string[] = [];

  if (!body.status) {
    errors.push("Status is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// PUT /api/approvals/[id] - Use Case Pattern
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Authentication check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Extract payload
    const { id } = await params;
    const body = await request.json();
    const { status, note } = body;

    // 3. Basic validation (use case will do deeper validation)
    const validation = validateUpdateApprovalInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 4. Use use case for complex write with validation, logging, and sync
    const useCase = new UpdateApprovalUseCase();
    const result = await useCase.execute(
      {
        approvalId: id,
        status,
        note,
      },
      { userId: user.id, request },
    );

    // 5. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.approval,
    });
  } catch (error) {
    console.error("Error updating approval:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 400 },
      );
    }

    // Handle not found errors
    if ((error as Error).message === "Approval not found") {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
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

// ============================================================================
// DELETE /api/approvals/[id] - Use Case Pattern
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Authentication check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Extract payload
    const { id } = await params;

    // 3. Use use case for complex delete with validation and logging
    const useCase = new DeleteApprovalUseCase();
    const result = await useCase.execute(
      { approvalId: id },
      { userId: user.id, request },
    );

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error deleting approval:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 400 },
      );
    }

    // Handle not found errors
    if ((error as Error).message === "Approval not found") {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
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
