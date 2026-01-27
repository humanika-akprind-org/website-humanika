/**
 * Event Category API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single entity read with validation
 * - PUT: Uses use case for complex write operations with validation
 * - DELETE: Uses use case for write operations with logging
 *
 * Pattern Choice Rationale:
 * - GET single: Use case provides better separation and error handling
 * - PUT update: Use case provides validation, duplicate checking, and logging
 * - DELETE: Use case provides logging and confirmation workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetEventCategoryByIdUseCase,
  UpdateEventCategoryUseCase,
  DeleteEventCategoryUseCase,
} from "@/application/use-cases/event-category";
import { EventCategoryRepositoryPrisma } from "@/infrastructure/repositories/event-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateCategoryBody(request: NextRequest): Promise<{
  name?: string;
  description?: string;
}> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateCategoryInput(body: {
  name?: string;
  description?: string;
}) {
  const errors: string[] = [];

  if (body.name !== undefined && body.name.trim() === "") {
    errors.push("Name cannot be empty");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/event/category/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const categoryId = (await params).id;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 },
      );
    }

    // Use use case for single entity read with validation
    const repo = new EventCategoryRepositoryPrisma();
    const useCase = new GetEventCategoryByIdUseCase(repo);
    const category = await useCase.execute(categoryId);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching event category:", error);

    if (
      error instanceof Error &&
      error.message === "Event category not found"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Event category not found",
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

// ============================================================================
// PUT /api/event/category/[id] - Use Case Pattern
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

    const categoryId = (await params).id;

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    // 1. Extract payload
    const body = await extractUpdateCategoryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateUpdateCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, duplicate checking, and logging
    const repo = new EventCategoryRepositoryPrisma();
    const useCase = new UpdateEventCategoryUseCase(repo);
    const category = await useCase.execute(
      categoryId,
      { name: body.name, description: body.description },
      user.id,
    );

    // 4. Response
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error updating event category:", error);

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

    if (
      error instanceof Error &&
      error.message === "Event category not found"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Event category not found",
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

// ============================================================================
// DELETE /api/event/category/[id] - Use Case Pattern
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

    const categoryId = (await params).id;

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    // Use use case for write operation with logging
    const repo = new EventCategoryRepositoryPrisma();
    const useCase = new DeleteEventCategoryUseCase(repo);
    await useCase.execute(categoryId, user.id);

    return NextResponse.json({
      success: true,
      message: "Event category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event category:", error);

    if (
      error instanceof Error &&
      error.message === "Event category not found"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Event category not found",
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
