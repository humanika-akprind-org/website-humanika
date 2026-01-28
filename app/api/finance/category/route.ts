/**
 * Finance Category API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET finance/categories: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type {
  CreateFinanceCategoryInput,
  FinanceCategoryFilter,
} from "@/domain/value-objects/finance-category";
import type { FinanceType } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetFinanceCategoriesUseCase,
  type GetFinanceCategoriesResult,
  CreateFinanceCategoryUseCase,
} from "@/application/use-cases/finance-category";
import { FinanceCategoryRepositoryPrisma } from "@/infrastructure/repositories/finance-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractFinanceCategoryQueryParams(
  request: NextRequest,
): FinanceCategoryFilter {
  const { searchParams } = new URL(request.url);
  return {
    type: searchParams.get("type") as FinanceType | undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateFinanceCategoryBody(
  request: NextRequest,
): Promise<CreateFinanceCategoryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateFinanceCategoryInput(body: CreateFinanceCategoryInput) {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!body.type) {
    errors.push("Type is required (INCOME or EXPENSE)");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/finance/category - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractFinanceCategoryQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new FinanceCategoryRepositoryPrisma();
    const useCase = new GetFinanceCategoriesUseCase(repo);
    const result: GetFinanceCategoriesResult =
      await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.financeCategories,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching finance categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch finance categories",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/finance/category - Use Case Pattern
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
    const body = await extractCreateFinanceCategoryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateFinanceCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new FinanceCategoryRepositoryPrisma();
    const useCase = new CreateFinanceCategoryUseCase(repo);
    const financeCategory = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: financeCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating finance category:", error);

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

    // Handle unique constraint errors
    if ((error as Error).message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Category name must be unique",
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
