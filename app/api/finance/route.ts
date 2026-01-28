/**
 * Finance API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET finances: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateFinanceInput } from "@/domain/entities/finance.entity";
import type { FinanceType, Status } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetFinancesUseCase,
  type GetFinancesResult,
  CreateFinanceUseCase,
} from "@/application/use-cases/finance";
import { FinanceRepositoryPrisma } from "@/infrastructure/repositories/finance";

// ============================================================================
// Local Types for Query Params (string values from URL)
// ============================================================================

interface FinanceQueryParams {
  type?: FinanceType | undefined;
  status?: Status | undefined;
  periodId?: string | undefined;
  categoryId?: string | undefined;
  eventId?: string | undefined;
  workProgramId?: string | undefined;
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractFinanceQueryParams(request: NextRequest): FinanceQueryParams {
  const { searchParams } = new URL(request.url);
  return {
    type: searchParams.get("type") as FinanceType | undefined,
    status: searchParams.get("status") as Status | undefined,
    periodId: searchParams.get("periodId") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    eventId: searchParams.get("eventId") || undefined,
    workProgramId: searchParams.get("workProgramId") || undefined,
    search: searchParams.get("search") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
  };
}

async function extractCreateFinanceBody(
  request: NextRequest,
): Promise<CreateFinanceInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateFinanceInput(body: CreateFinanceInput) {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!body.amount || typeof body.amount !== "number") {
    errors.push("Amount is required and must be a number");
  } else if (body.amount <= 0) {
    errors.push("Amount must be greater than 0");
  }

  if (!body.date) {
    errors.push("Date is required");
  }

  if (!body.type) {
    errors.push("Type is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/finances - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractFinanceQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new FinanceRepositoryPrisma();
    const useCase = new GetFinancesUseCase(repo);
    const result: GetFinancesResult = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.finances,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching finances:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch finances",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/finances - Use Case Pattern
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
    const body = await extractCreateFinanceBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateFinanceInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new FinanceRepositoryPrisma();
    const useCase = new CreateFinanceUseCase(repo);
    const finance = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: finance,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating finance:", error);

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
