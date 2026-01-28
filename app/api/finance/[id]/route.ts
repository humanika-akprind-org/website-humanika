/**
 * Finance ID API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the pattern:
 * - GET: Uses use case for single read operation with validation
 * - PUT: Uses use case for write operations with validation
 * - DELETE: Uses use case for delete operations with validation
 *
 * Pattern Choice Rationale:
 * - Use cases provide better separation for validation and business logic
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateFinanceInput } from "@/domain/entities/finance.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import { FinanceRepositoryPrisma } from "@/infrastructure/repositories/finance";
import {
  GetFinanceByIdUseCase,
  UpdateFinanceUseCase,
  DeleteFinanceUseCase,
} from "@/application/use-cases/finance";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractIdParam(
  params: Promise<{ id: string }>,
): Promise<string> {
  const { id } = await params;
  return id;
}

async function extractUpdateFinanceBody(
  request: NextRequest,
): Promise<UpdateFinanceInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateIdParam(id: string): { isValid: boolean; error?: string } {
  if (!id || id.trim() === "") {
    return { isValid: false, error: "Finance ID is required" };
  }

  // Basic ID format validation (UUID-like)
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return { isValid: false, error: "Invalid ID format" };
  }

  return { isValid: true };
}

function validateUpdateFinanceInput(body: UpdateFinanceInput): {
  isValid: boolean;
  error?: string;
} {
  // At least one field must be provided
  if (
    !body.name &&
    body.amount === undefined &&
    !body.description &&
    !body.categoryId &&
    !body.workProgramId &&
    !body.periodId &&
    !body.type &&
    !body.status
  ) {
    return { isValid: false, error: "At least one field is required" };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/finances/:id - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Extract payload
    const id = await extractIdParam(params);

    // 2. Basic validation
    const validation = validateIdParam(id);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 },
      );
    }

    // 3. Use use case for read operation with validation
    const repo = new FinanceRepositoryPrisma();
    const useCase = new GetFinanceByIdUseCase(repo);
    const finance = await useCase.execute(id);

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: finance,
    });
  } catch (error) {
    console.error("Error fetching finance:", error);

    // Handle not found error
    if ((error as Error).message === "Finance not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Finance not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch finance",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/finances/:id - Use Case Pattern
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
    const id = await extractIdParam(params);
    const body = await extractUpdateFinanceBody(request);

    // 2. Basic validation
    const idValidation = validateIdParam(id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, error: idValidation.error },
        { status: 400 },
      );
    }

    const bodyValidation = validateUpdateFinanceInput(body);
    if (!bodyValidation.isValid) {
      return NextResponse.json(
        { success: false, error: bodyValidation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for write operation with validation
    const repo = new FinanceRepositoryPrisma();
    const useCase = new UpdateFinanceUseCase(repo);
    const finance = await useCase.execute(id, body, { id: user.id });

    // 4. Response
    return NextResponse.json({
      success: true,
      data: finance,
    });
  } catch (error) {
    console.error("Error updating finance:", error);

    // Handle not found error
    if ((error as Error).message === "Finance not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Finance not found",
        },
        { status: 404 },
      );
    }

    // Handle validation errors
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
        error: "Failed to update finance",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/finances/:id - Use Case Pattern
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
    const id = await extractIdParam(params);

    // 2. Basic validation
    const validation = validateIdParam(id);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 },
      );
    }

    // 3. Use use case for delete operation with validation
    const repo = new FinanceRepositoryPrisma();
    const useCase = new DeleteFinanceUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 4. Response
    return NextResponse.json({
      success: true,
      message: "Finance deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting finance:", error);

    // Handle not found error
    if ((error as Error).message === "Finance not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Finance not found",
        },
        { status: 404 },
      );
    }

    // Handle validation errors
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
        error: "Failed to delete finance",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
