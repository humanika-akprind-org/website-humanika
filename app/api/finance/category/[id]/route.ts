/**
 * Finance Category API Route [id] - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single read operation with validation
 * - PUT: Uses use case for complex write operations with validation
 * - DELETE: Uses use case for delete operation with validation
 *
 * Pattern Choice Rationale:
 * - GET finance/category/[id]: Use case provides better separation for single entity retrieval
 * - PUT update: Use case provides validation, logging, and approval workflow
 * - DELETE: Use case provides validation and logging
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateFinanceCategoryInput } from "@/domain/value-objects/finance-category";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetFinanceCategoryByIdUseCase,
  UpdateFinanceCategoryUseCase,
  DeleteFinanceCategoryUseCase,
} from "@/application/use-cases/finance-category";
import { FinanceCategoryRepositoryPrisma } from "@/infrastructure/repositories/finance-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateFinanceCategoryBody(
  request: NextRequest,
): Promise<UpdateFinanceCategoryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateFinanceCategoryInput(body: UpdateFinanceCategoryInput) {
  const errors: string[] = [];

  if (body.name !== undefined && body.name.trim() === "") {
    errors.push("Name cannot be empty");
  }

  if (body.description !== undefined && body.description.trim() === "") {
    errors.push("Description cannot be empty");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/finance/category/[id] - Use Case Pattern
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

    // 1. Extract payload
    const id = (await params).id;

    // 2. Use use case for read operation with validation
    const repo = new FinanceCategoryRepositoryPrisma();
    const useCase = new GetFinanceCategoryByIdUseCase(repo);
    const financeCategory = await useCase.execute(id);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: financeCategory,
    });
  } catch (error) {
    console.error("Error fetching finance category:", error);

    // Handle not found errors specifically
    if ((error as Error).message === "Finance category not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Finance category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch finance category",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/finance/category/[id] - Use Case Pattern
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

    // 1. Extract payload
    const id = (await params).id;
    const body = await extractUpdateFinanceCategoryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateUpdateFinanceCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new FinanceCategoryRepositoryPrisma();
    const useCase = new UpdateFinanceCategoryUseCase(repo);
    const financeCategory = await useCase.execute(id, body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: financeCategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating finance category:", error);

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

    // Handle not found errors
    if ((error as Error).message === "Finance category not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Finance category not found",
        },
        { status: 404 },
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

// ============================================================================
// DELETE /api/finance/category/[id] - Use Case Pattern
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

    // 1. Extract payload
    const id = (await params).id;

    // 2. Use use case for delete operation with validation and logging
    const repo = new FinanceCategoryRepositoryPrisma();
    const useCase = new DeleteFinanceCategoryUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 3. Response
    return NextResponse.json({
      success: true,
      message: "Finance category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting finance category:", error);

    // Handle not found errors
    if ((error as Error).message === "Finance category not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Finance category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
