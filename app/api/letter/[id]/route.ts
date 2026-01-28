/**
 * Letter API Route [id] - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single read operation
 * - PUT: Uses use case for complex write operations with validation
 * - DELETE: Uses use case for complex write operations with logging
 *
 * Pattern Choice Rationale:
 * - GET letter by ID: Use case provides better separation for single entity retrieval
 * - PUT update: Use case provides validation, logging, and duplicate checking
 * - DELETE: Use case provides existence checking and activity logging
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateLetterInput } from "@/domain/entities/letter.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetLetterByIdUseCase,
  UpdateLetterUseCase,
  DeleteLetterUseCase,
} from "@/application/use-cases/letter";
import { LetterRepositoryPrisma } from "@/infrastructure/repositories/letter";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateLetterBody(
  request: NextRequest,
): Promise<UpdateLetterInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateLetterInput(body: UpdateLetterInput) {
  const errors: string[] = [];

  if (body.regarding !== undefined && body.regarding.trim() === "") {
    errors.push("Regarding cannot be empty");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/letters/[id] - Use Case Pattern
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

    // 2. Use use case for single entity retrieval
    const repo = new LetterRepositoryPrisma();
    const useCase = new GetLetterByIdUseCase(repo);
    const letter = await useCase.execute(id);

    // 3. Response
    return NextResponse.json({
      success: true,
      data: letter,
    });
  } catch (error) {
    console.error("Error fetching letter:", error);

    if ((error as Error).message === "Letter not found") {
      return NextResponse.json(
        { success: false, error: "Letter not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch letter",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/letters/[id] - Use Case Pattern
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
    const body = await extractUpdateLetterBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateUpdateLetterInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, duplicate checking, and logging
    const repo = new LetterRepositoryPrisma();
    const useCase = new UpdateLetterUseCase(repo);
    const letter = await useCase.execute(id, body, { id: user.id });

    // 4. Response
    return NextResponse.json({
      success: true,
      data: letter,
    });
  } catch (error) {
    console.error("Error updating letter:", error);

    if ((error as Error).message === "Letter not found") {
      return NextResponse.json(
        { success: false, error: "Letter not found" },
        { status: 404 },
      );
    }

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

// ============================================================================
// DELETE /api/letters/[id] - Use Case Pattern
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

    // 2. Use use case for complex write with existence checking and logging
    const repo = new LetterRepositoryPrisma();
    const useCase = new DeleteLetterUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 3. Response
    return NextResponse.json({
      success: true,
      message: "Letter deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting letter:", error);

    if ((error as Error).message === "Letter not found") {
      return NextResponse.json(
        { success: false, error: "Letter not found" },
        { status: 404 },
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
