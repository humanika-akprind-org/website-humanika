/**
 * Statistic API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET statistics: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and duplicate checking
 */

import { type NextRequest, NextResponse } from "next/server";
import type {
  CreateStatisticInput,
  StatisticFilter,
} from "@/domain/entities/statistic.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetStatisticsUseCase,
  CreateStatisticUseCase,
} from "@/application/use-cases/statistic";
import { StatisticRepositoryPrisma } from "@/infrastructure/repositories/statistic";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractStatisticQueryParams(request: NextRequest): StatisticFilter {
  const { searchParams } = new URL(request.url);
  return {
    periodId: searchParams.get("periodId") || undefined,
    period: searchParams.get("period") || undefined,
  };
}

async function extractCreateStatisticBody(
  request: NextRequest,
): Promise<CreateStatisticInput> {
  const body = await request.json();
  return {
    activeMembers: body.activeMembers,
    annualEvents: body.annualEvents,
    collaborativeProjects: body.collaborativeProjects,
    innovationProjects: body.innovationProjects,
    awards: body.awards,
    memberSatisfaction: body.memberSatisfaction,
    learningMaterials: body.learningMaterials,
    periodId: body.periodId,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateStatisticInput(body: CreateStatisticInput) {
  const errors: string[] = [];

  if (!body.periodId) {
    errors.push("Period ID is required");
  }

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
// GET /api/statistics - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractStatisticQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new StatisticRepositoryPrisma();
    const useCase = new GetStatisticsUseCase(repo);
    const result = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.statistics,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch statistics",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/statistics - Use Case Pattern
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
    const body = await extractCreateStatisticBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateStatisticInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and duplicate checking
    const repo = new StatisticRepositoryPrisma();
    const useCase = new CreateStatisticUseCase(repo);
    const statistic = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: statistic,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating statistic:", error);

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

    // Handle duplicate errors
    if ((error as Error).message.includes("already exists")) {
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
