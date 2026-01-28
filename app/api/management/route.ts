/**
 * Management API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET managements: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and duplicate checking
 */

import { type NextRequest, NextResponse } from "next/server";
import type { ManagementServerData } from "@/domain/entities/management.entity";
import type { Department, Position } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetManagementsUseCase,
  CreateManagementUseCase,
} from "@/application/use-cases/management";
import { ManagementRepositoryPrisma } from "@/infrastructure/repositories/management";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractManagementQueryParams(request: NextRequest): {
  department?: Department;
  position?: Position;
  periodId?: string;
  search?: string;
  userId?: string;
  page?: number;
  limit?: number;
} {
  const { searchParams } = new URL(request.url);
  return {
    department: searchParams.get("department") as Department | undefined,
    position: searchParams.get("position") as Position | undefined,
    periodId: searchParams.get("periodId") || undefined,
    search: searchParams.get("search") || undefined,
    userId: searchParams.get("userId") || undefined,
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") || "1", 10)
      : undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit") || "10", 10)
      : undefined,
  };
}

async function extractCreateManagementBody(
  request: NextRequest,
): Promise<ManagementServerData> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateManagementInput(body: ManagementServerData) {
  const errors: string[] = [];

  if (!body.userId || body.userId.trim() === "") {
    errors.push("User ID is required");
  }

  if (!body.periodId || body.periodId.trim() === "") {
    errors.push("Period ID is required");
  }

  if (!body.position) {
    errors.push("Position is required");
  }

  if (!body.department) {
    errors.push("Department is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/management - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractManagementQueryParams(request);

    const filters = {
      department: queryParams.department,
      position: queryParams.position,
      periodId: queryParams.periodId,
      search: queryParams.search,
      userId: queryParams.userId,
    };

    const pagination = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
    };

    // 2. Use use case for complex read with validation and pagination
    const repo = new ManagementRepositoryPrisma();
    const useCase = new GetManagementsUseCase(repo);
    const result = await useCase.execute(filters, pagination);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.managements,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching managements:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch managements",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/management - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Extract payload
    const body = await extractCreateManagementBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateManagementInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and duplicate checking
    const repo = new ManagementRepositoryPrisma();
    const useCase = new CreateManagementUseCase(repo);
    const management = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: management,
        message: "Management created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating management:", error);

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

    // Handle duplicate/constraint errors
    if (
      (error as Error).message.includes("already has a management position") ||
      (error as Error).message.includes("already taken for this period")
    ) {
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
      },
      { status: 500 },
    );
  }
}
