/**
 * Event Category API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET event-categories: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateEventCategoryInput } from "@/domain/value-objects/event-category";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import { GetEventCategoriesUseCase } from "@/application/use-cases/event-category";
import { CreateEventCategoryUseCase } from "@/application/use-cases/event-category";
import { EventCategoryRepositoryPrisma } from "@/infrastructure/repositories/event-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractCreateEventCategoryBody(
  request: NextRequest,
): Promise<CreateEventCategoryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateEventCategoryInput(body: CreateEventCategoryInput) {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/event/category - Use Case Pattern
// ============================================================================

export async function GET(_request: NextRequest) {
  try {
    // 1. Use use case for complex read with validation
    const repo = new EventCategoryRepositoryPrisma();
    const useCase = new GetEventCategoriesUseCase(repo);
    const categories = await useCase.execute();

    // 2. Response - consistent format
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching event categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch event categories",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/event/category - Use Case Pattern
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
    const body = await extractCreateEventCategoryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateEventCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new EventCategoryRepositoryPrisma();
    const useCase = new CreateEventCategoryUseCase(repo);
    const category = await useCase.execute(body, user.id);

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating event category:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
      );
    }

    // Handle duplicate errors
    if ((error as Error).message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 409 },
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
