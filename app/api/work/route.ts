/**
 * Work Program API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 * - DELETE: Uses use case for bulk delete operations with validation
 *
 * Pattern Choice Rationale:
 * - GET: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 * - DELETE bulk: Use case provides validation and batch operation handling
 */

import { type NextRequest, NextResponse } from "next/server";
import type {
  CreateWorkProgramInput,
  WorkProgramFilter,
} from "@/domain/entities/work-program.entity";
import type { Status, Department } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetWorkProgramsUseCase,
  type GetWorkProgramsResult,
  CreateWorkProgramUseCase,
  BulkDeleteWorkProgramsUseCase,
} from "@/application/use-cases/work-program";
import { WorkProgramRepositoryPrisma } from "@/infrastructure/repositories/work-program";

// ============================================================================
// Local Types for Query Params (string values from URL)
// ============================================================================

interface WorkProgramQueryParams {
  department?: Department | undefined;
  status?: Status | undefined;
  periodId?: string | undefined;
  search?: string | undefined;
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractWorkProgramQueryParams(
  request: NextRequest,
): WorkProgramQueryParams {
  const { searchParams } = new URL(request.url);
  return {
    department: searchParams.get("department") as Department | undefined,
    status: searchParams.get("status") as Status | undefined,
    periodId: searchParams.get("periodId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateWorkProgramBody(
  request: NextRequest,
): Promise<CreateWorkProgramInput> {
  return await request.json();
}

async function extractBulkDeleteBody(
  request: NextRequest,
): Promise<{ ids: string[] }> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateWorkProgramInput(body: CreateWorkProgramInput): {
  isValid: boolean;
  error?: string;
} {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!body.department) {
    errors.push("Department is required");
  }

  if (!body.periodId) {
    errors.push("Period ID is required");
  }

  if (!body.responsibleId) {
    errors.push("Responsible ID is required");
  }

  if (body.schedule !== undefined && body.schedule.trim() === "") {
    errors.push("Schedule cannot be empty if provided");
  }

  if (body.funds !== undefined && body.funds < 0) {
    errors.push("Funds cannot be negative");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

function validateBulkDeleteInput(body: { ids: string[] }): {
  isValid: boolean;
  error?: string;
} {
  const errors: string[] = [];

  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    errors.push("IDs array is required and must not be empty");
  }

  if (body.ids && body.ids.length > 0) {
    const invalidIds = body.ids.filter(
      (id) => typeof id !== "string" || id.trim() === "" || id === "undefined",
    );
    if (invalidIds.length > 0) {
      errors.push("All IDs must be non-empty strings");
    }
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/work - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractWorkProgramQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new WorkProgramRepositoryPrisma();
    const useCase = new GetWorkProgramsUseCase(repo);
    const filter: WorkProgramFilter = {
      department: queryParams.department,
      status: queryParams.status,
      periodId: queryParams.periodId,
      search: queryParams.search,
    };
    const result: GetWorkProgramsResult = await useCase.execute(filter);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.workPrograms,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching work programs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch work programs",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/work - Use Case Pattern
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
    const body = await extractCreateWorkProgramBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateWorkProgramInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new WorkProgramRepositoryPrisma();
    const useCase = new CreateWorkProgramUseCase(repo);
    const workProgram = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: workProgram,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating work program:", error);

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
// DELETE /api/work - Use Case Pattern (Bulk Delete)
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Extract payload
    const body = await extractBulkDeleteBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateBulkDeleteInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for bulk delete with validation and logging
    const repo = new WorkProgramRepositoryPrisma();
    const useCase = new BulkDeleteWorkProgramsUseCase(repo);
    const result = await useCase.execute(body.ids, { id: user.id });

    // 4. Response
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} work programs`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error deleting work programs:", error);

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

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
