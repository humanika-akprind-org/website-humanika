/**
 * Period API Route [id] - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for read operations
 * - PUT: Uses use case for update operations with validation
 * - DELETE: Uses use case for delete operations
 */

import { type NextRequest, NextResponse } from "next/server";
import type { PeriodFormData } from "@/domain/entities/period.entity";
import {
  GetPeriodByIdUseCase,
  UpdatePeriodUseCase,
  DeletePeriodUseCase,
} from "@/application/use-cases/period";
import { PeriodRepositoryPrisma } from "@/infrastructure/repositories/period";

interface Context {
  params: Promise<{ id: string }>;
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdatePeriodInput(body: Partial<PeriodFormData>) {
  const errors: string[] = [];

  // Validate year range if both are provided
  if (
    body.startYear !== undefined &&
    body.endYear !== undefined &&
    body.startYear >= body.endYear
  ) {
    errors.push("Start year must be less than end year");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/periods/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    // 1. Use use case for read operation
    const repo = new PeriodRepositoryPrisma();
    const useCase = new GetPeriodByIdUseCase(repo);
    const period = await useCase.execute(id);

    if (!period) {
      return NextResponse.json(
        {
          success: false,
          error: "Period not found",
        },
        { status: 404 },
      );
    }

    // 2. Response - consistent format
    return NextResponse.json({
      success: true,
      data: period,
    });
  } catch (error) {
    console.error("Error fetching period:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch period",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/periods/[id] - Use Case Pattern
// ============================================================================

export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // 1. Basic validation (use case will do deeper validation)
    const validation = validateUpdatePeriodInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 2. Use use case for update with validation and logging
    const repo = new PeriodRepositoryPrisma();
    const useCase = new UpdatePeriodUseCase(repo);
    const period = await useCase.execute(id, body);

    // 3. Response
    return NextResponse.json({
      success: true,
      data: period,
      message: "Period updated successfully",
    });
  } catch (error) {
    console.error("Error updating period:", error);

    // Cast error to Error type
    const err = error as Error;

    // Handle validation errors
    if (err.message.includes("Validation failed")) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
        },
        { status: 400 },
      );
    }

    // Handle not found errors
    if (err.message === "Period not found") {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update period",
        message: err.message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/periods/[id] - Use Case Pattern
// ============================================================================

export async function DELETE(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    // 1. Use use case for delete with validation
    const repo = new PeriodRepositoryPrisma();
    const useCase = new DeletePeriodUseCase(repo);
    await useCase.execute(id);

    // 2. Response
    return NextResponse.json({
      success: true,
      message: "Period deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting period:", error);

    // Handle not found errors
    const err = error as Error;
    if (err.message === "Period not found") {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
        },
        { status: 404 },
      );
    }

    // Handle related data errors
    if (err.message === "Cannot delete period with related data") {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete period",
        message: err.message,
      },
      { status: 500 },
    );
  }
}
