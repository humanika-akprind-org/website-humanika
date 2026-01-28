/**
 * Letter API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET letters: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateLetterInput } from "@/domain/entities/letter.entity";
import type { LetterType, LetterPriority, Status } from "@/domain/enums";
import type { LetterFilter } from "@/application/interface/letter.repository.interface";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetLettersUseCase,
  CreateLetterUseCase,
} from "@/application/use-cases/letter";
import { LetterRepositoryPrisma } from "@/infrastructure/repositories/letter";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractLetterQueryParams(request: NextRequest): LetterFilter {
  const { searchParams } = new URL(request.url);
  return {
    type: searchParams.get("type") as LetterType | undefined,
    priority: searchParams.get("priority") as LetterPriority | undefined,
    status: searchParams.get("status") as Status | undefined,
    periodId: searchParams.get("periodId") || undefined,
    eventId: searchParams.get("eventId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateLetterBody(
  request: NextRequest,
): Promise<CreateLetterInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateLetterInput(body: CreateLetterInput) {
  const errors: string[] = [];

  if (!body.regarding || body.regarding.trim() === "") {
    errors.push("Regarding is required");
  }

  if (!body.origin || body.origin.trim() === "") {
    errors.push("Origin is required");
  }

  if (!body.destination || body.destination.trim() === "") {
    errors.push("Destination is required");
  }

  if (!body.date) {
    errors.push("Date is required");
  }

  if (!body.type) {
    errors.push("Type is required");
  }

  if (!body.priority) {
    errors.push("Priority is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/letters - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractLetterQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new LetterRepositoryPrisma();
    const useCase = new GetLettersUseCase(repo);
    const result = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.letters,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching letters:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch letters",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/letters - Use Case Pattern
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
    const body = await extractCreateLetterBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateLetterInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new LetterRepositoryPrisma();
    const useCase = new CreateLetterUseCase(repo);
    const letter = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: letter,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating letter:", error);

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
