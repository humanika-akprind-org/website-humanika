/**
 * Statistic API Route [id] - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for read operations
 * - PUT: Uses use case for update operations with validation
 * - DELETE: Uses use case for delete operations
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateStatisticInput } from "@/domain/entities/statistic.entity";
import {
  GetStatisticByIdUseCase,
  UpdateStatisticUseCase,
  DeleteStatisticUseCase,
} from "@/application/use-cases/statistic";
import { StatisticRepositoryPrisma } from "@/infrastructure/repositories/statistic";
import { getCurrentUser } from "@/presentation/lib/auth-server";

interface Context {
  params: Promise<{ id: string }>;
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateStatisticInput(body: Partial<UpdateStatisticInput>) {
  const errors: string[] = [];

  // Validate numeric fields are non-negative
  if (body.activeMembers !== undefined && body.activeMembers < 0) {
    errors.push("Active members cannot be negative");
  }

  if (body.annualEvents !== undefined && body.annualEvents < 0) {
    errors.push("Annual events cannot be negative");
  }

  if (
    body.collaborativeProjects !== undefined &&
    body.collaborativeProjects < 0
  ) {
    errors.push("Collaborative projects cannot be negative");
  }

  if (body.innovationProjects !== undefined && body.innovationProjects < 0) {
    errors.push("Innovation projects cannot be negative");
  }

  if (body.awards !== undefined && body.awards < 0) {
    errors.push("Awards cannot be negative");
  }

  if (
    body.memberSatisfaction !== undefined &&
    (body.memberSatisfaction < 0 || body.memberSatisfaction > 100)
  ) {
    errors.push("Member satisfaction must be between 0 and 100");
  }

  if (body.learningMaterials !== undefined && body.learningMaterials < 0) {
    errors.push("Learning materials cannot be negative");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/statistics/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    // 1. Use use case for read operation
    const repo = new StatisticRepositoryPrisma();
    const useCase = new GetStatisticByIdUseCase(repo);
    const statistic = await useCase.execute(id);

    if (!statistic) {
      return NextResponse.json(
        {
          success: false,
          error: "Statistic not found",
        },
        { status: 404 },
      );
    }

    // 2. Response - consistent format
    return NextResponse.json({
      success: true,
      data: statistic,
    });
  } catch (error) {
    console.error("Error fetching statistic:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch statistic",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/statistics/[id] - Use Case Pattern
// ============================================================================

export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    // 1. Basic validation (use case will do deeper validation)
    const validation = validateUpdateStatisticInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 2. Use use case for update with validation and logging
    const repo = new StatisticRepositoryPrisma();
    const useCase = new UpdateStatisticUseCase(repo);
    const statistic = await useCase.execute(id, body, { id: user.id });

    // 3. Response
    return NextResponse.json({
      success: true,
      data: statistic,
      message: "Statistic updated successfully",
    });
  } catch (error) {
    console.error("Error updating statistic:", error);

    // Handle validation errors
    const err = error as Error;
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
    if (err.message === "Statistic not found") {
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
        error: "Failed to update statistic",
        message: err.message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/statistics/[id] - Use Case Pattern
// ============================================================================

export async function DELETE(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    // 1. Use use case for delete with validation
    const repo = new StatisticRepositoryPrisma();
    const useCase = new DeleteStatisticUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 2. Response
    return NextResponse.json({
      success: true,
      message: "Statistic deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting statistic:", error);

    // Handle not found errors
    const err = error as Error;
    if (err.message === "Statistic not found") {
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
        error: "Failed to delete statistic",
        message: err.message,
      },
      { status: 500 },
    );
  }
}
