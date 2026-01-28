/**
 * Period API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for read operations
 * - POST: Uses use case for write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET periods: Use case provides better separation
 * - POST create: Use case provides validation and logging
 */

import { type NextRequest, NextResponse } from "next/server";
import type { PeriodFormData } from "@/domain/entities/period.entity";
import {
  GetPeriodsUseCase,
  CreatePeriodUseCase,
} from "@/application/use-cases/period";
import { PeriodRepositoryPrisma } from "@/infrastructure/repositories/period";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractCreatePeriodBody(
  request: NextRequest,
): Promise<PeriodFormData> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreatePeriodInput(body: PeriodFormData) {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!body.startYear) {
    errors.push("Start year is required");
  }

  if (!body.endYear) {
    errors.push("End year is required");
  }

  if (body.startYear && body.endYear && body.startYear >= body.endYear) {
    errors.push("Start year must be less than end year");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/periods - Use Case Pattern
// ============================================================================

export async function GET(_request: NextRequest) {
  try {
    // 1. Use use case for read operation
    const repo = new PeriodRepositoryPrisma();
    const useCase = new GetPeriodsUseCase(repo);
    const result = await useCase.execute();

    // 2. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.periods,
    });
  } catch (error) {
    console.error("Error fetching periods:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch periods",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/periods - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Extract payload
    const body = await extractCreatePeriodBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreatePeriodInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for write with validation and logging
    const repo = new PeriodRepositoryPrisma();
    const useCase = new CreatePeriodUseCase(repo);
    const period = await useCase.execute(body);

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: period,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating period:", error);

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
