/**
 * Work Program API Route (Dynamic) - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern for single resource operations:
 * - GET: Uses use case for fetching single resource by ID
 * - PUT: Uses use case for updating with validation and logging
 * - DELETE: Uses use case for deletion with validation and logging
 *
 * Pattern Choice Rationale:
 * - GET by ID: Use case provides validation and consistent error handling
 * - PUT update: Use case provides validation, logging, and approval workflow
 * - DELETE: Use case provides validation and activity logging
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateWorkProgramInput } from "@/domain/entities/work-program.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetWorkProgramByIdUseCase,
  UpdateWorkProgramUseCase,
  DeleteWorkProgramUseCase,
} from "@/application/use-cases/work-program";
import { WorkProgramRepositoryPrisma } from "@/infrastructure/repositories/work-program";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateWorkProgramBody(
  request: NextRequest,
): Promise<UpdateWorkProgramInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateWorkProgramInput(body: UpdateWorkProgramInput): {
  isValid: boolean;
  error?: string;
} {
  const errors: string[] = [];

  if (
    body.name !== undefined &&
    (body.name.trim() === "" || body.name.length < 3)
  ) {
    errors.push("Name must be at least 3 characters if provided");
  }

  if (body.department !== undefined && !body.department) {
    errors.push("Department is required if provided");
  }

  if (body.periodId !== undefined && body.periodId.trim() === "") {
    errors.push("Period ID cannot be empty if provided");
  }

  if (body.responsibleId !== undefined && body.responsibleId.trim() === "") {
    errors.push("Responsible ID cannot be empty if provided");
  }

  if (body.schedule !== undefined && body.schedule.trim() === "") {
    errors.push("Schedule cannot be empty if provided");
  }

  if (body.funds !== undefined && body.funds < 0) {
    errors.push("Funds cannot be negative");
  }

  if (body.usedFunds !== undefined && body.usedFunds < 0) {
    errors.push("Used funds cannot be negative");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/work/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = (await params).id;

    // Use use case for fetching single work program
    const repo = new WorkProgramRepositoryPrisma();
    const useCase = new GetWorkProgramByIdUseCase(repo);
    const workProgram = await useCase.execute(id);

    if (!workProgram) {
      return NextResponse.json(
        { success: false, error: "Work program not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: workProgram,
    });
  } catch (error) {
    console.error("Error fetching work program:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Invalid work program ID")) {
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
        error: "Failed to fetch work program",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/work/[id] - Use Case Pattern
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = (await params).id;
    const body = await extractUpdateWorkProgramBody(request);

    // Basic validation (use case will do deeper validation)
    const validation = validateUpdateWorkProgramInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // Use use case for update with validation, logging, and approval workflow
    const repo = new WorkProgramRepositoryPrisma();
    const useCase = new UpdateWorkProgramUseCase(repo);
    const workProgram = await useCase.execute(id, body, { id: user.id });

    return NextResponse.json({
      success: true,
      data: workProgram,
    });
  } catch (error) {
    console.error("Error updating work program:", error);

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

    // Handle not found error
    if ((error as Error).message === "Work program not found") {
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
        error: "Failed to update work program",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/work/[id] - Use Case Pattern
// ============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = (await params).id;

    // Use use case for deletion with validation and logging
    const repo = new WorkProgramRepositoryPrisma();
    const useCase = new DeleteWorkProgramUseCase(repo);
    await useCase.execute(id, { id: user.id });

    return NextResponse.json({
      success: true,
      message: "Work program deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting work program:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Invalid work program ID")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 400 },
      );
    }

    // Handle not found error
    if ((error as Error).message === "Work program not found") {
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
        error: "Failed to delete work program",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
