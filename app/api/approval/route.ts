/**
 * Approval API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET approvals: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type { ApprovalFilters } from "@/domain/entities/approval.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetApprovalsUseCase,
  CreateApprovalUseCase,
} from "@/application/use-cases/approval";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractApprovalQueryParams(request: NextRequest): ApprovalFilters {
  const { searchParams } = new URL(request.url);
  return {
    status: searchParams.get("status") || undefined,
    entityType: searchParams.get("entityType") || undefined,
    page: parseInt(searchParams.get("page") || "1") || 1,
    limit: parseInt(searchParams.get("limit") || "10") || 10,
  };
}

async function extractCreateApprovalBody(request: NextRequest) {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateApprovalInput(body: Record<string, unknown>) {
  const errors: string[] = [];

  if (!body.entityType) {
    errors.push("Entity type is required");
  }

  if (
    !body.entityId ||
    (typeof body.entityId === "string" && body.entityId.trim() === "")
  ) {
    errors.push("Entity ID is required");
  }

  if (
    !body.userId ||
    (typeof body.userId === "string" && body.userId.trim() === "")
  ) {
    errors.push("User ID is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/approvals - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
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
    const queryParams = extractApprovalQueryParams(request);

    // 3. Use use case for complex read with validation and pagination
    const useCase = new GetApprovalsUseCase();
    const result = await useCase.execute(queryParams);

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.approvals,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch approvals",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/approvals - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
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
    const body = await extractCreateApprovalBody(request);

    // 3. Basic validation (use case will do deeper validation)
    const validation = validateCreateApprovalInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 4. Use use case for complex write with validation, logging, and approval
    const useCase = new CreateApprovalUseCase();
    const result = await useCase.execute(
      {
        entityType: body.entityType,
        entityId: body.entityId,
        userId: body.userId,
        status: body.status,
        note: body.note,
        requesterId: user.id,
      },
      { userId: user.id, request },
    );

    // 5. Response
    return NextResponse.json(
      {
        success: true,
        data: result.approval,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating approval:", error);

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

    // Handle duplicate approval errors
    if (
      (error as Error).message === "Approval already exists for this entity"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
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
