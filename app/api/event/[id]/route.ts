/**
 * Event ID API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single read operation with validation
 * - PUT: Uses use case for complex write operation with validation
 * - DELETE: Uses use case for complex write operation with validation
 *
 * Pattern Choice Rationale:
 * - GET event by ID: Use case provides validation and consistent error handling
 * - PUT update: Use case provides validation, logging, and approval workflow
 * - DELETE: Use case provides validation and activity logging
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateEventInput } from "@/domain/entities/event.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import { EventRepositoryPrisma } from "@/infrastructure/repositories/event.repository";
import { GetEventByIdUseCase } from "@/application/use-cases/event/get-event-by-id.usecase";
import { UpdateEventUseCase } from "@/application/use-cases/event/update-event.usecase";
import { DeleteEventUseCase } from "@/application/use-cases/event/delete-event.usecase";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractIdParam(
  params: Promise<{ id: string }>,
): Promise<string> {
  const { id } = await params;
  return id;
}

async function extractUpdateEventBody(
  request: NextRequest,
): Promise<UpdateEventInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateId(id: string): { isValid: boolean; error?: string } {
  if (!id || id.trim() === "") {
    return { isValid: false, error: "Event ID is required" };
  }

  // UUID validation (basic format check)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return { isValid: false, error: "Invalid event ID format" };
  }

  return { isValid: true };
}

function validateUpdateEventInput(body: UpdateEventInput): {
  isValid: boolean;
  error?: string;
} {
  const errors: string[] = [];

  // Name validation (if provided)
  if (body.name !== undefined && body.name.trim() === "") {
    errors.push("Name cannot be empty if provided");
  }

  // Description validation (if provided)
  if (body.description !== undefined && body.description.trim() === "") {
    errors.push("Description cannot be empty if provided");
  }

  // Goal validation (if provided)
  if (body.goal !== undefined && body.goal.trim() === "") {
    errors.push("Goal cannot be empty if provided");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/events/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Extract payload
    const id = await extractIdParam(params);

    // 2. Basic validation
    const validation = validateId(id);
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
    const repo = new EventRepositoryPrisma();
    const useCase = new GetEventByIdUseCase(repo);
    const event = await useCase.execute(id);

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);

    // Handle not found error
    if ((error as Error).message === "Event not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
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
        error: "Failed to fetch event",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/events/[id] - Use Case Pattern
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
    const body = await extractUpdateEventBody(request);

    // 2. Basic validation
    const idValidation = validateId(id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, error: idValidation.error },
        { status: 400 },
      );
    }

    const inputValidation = validateUpdateEventInput(body);
    if (!inputValidation.isValid) {
      return NextResponse.json(
        { success: false, error: inputValidation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation and logging
    const repo = new EventRepositoryPrisma();
    const useCase = new UpdateEventUseCase(repo);
    const event = await useCase.execute(id, body, { id: user.id });

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);

    // Handle not found error
    if ((error as Error).message === "Event not found") {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    // Handle validation errors
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update event",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/events/[id] - Use Case Pattern
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
    const validation = validateId(id);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation and logging
    const repo = new EventRepositoryPrisma();
    const useCase = new DeleteEventUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);

    // Handle not found error
    if ((error as Error).message === "Event not found") {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    // Handle validation errors
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete event",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
