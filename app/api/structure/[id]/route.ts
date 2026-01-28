/**
 * Organizational Structure API Route [ID] - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - PUT: Uses use case for complex write operations with validation
 * - DELETE: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET by ID: Use case provides better separation and error handling
 * - PUT update: Use case provides validation, logging, and audit trail
 * - DELETE: Use case provides logging and confirmation workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateOrganizationalStructureInput } from "@/domain/entities/organizational-structure.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetStructureByIdUseCase,
  UpdateStructureUseCase,
  DeleteStructureUseCase,
} from "@/application/use-cases/structure";
import { OrganizationalStructureRepositoryPrisma } from "@/infrastructure/repositories/organizational-structure";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateStructureBody(
  request: NextRequest,
): Promise<UpdateOrganizationalStructureInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateStructureInput(
  body: UpdateOrganizationalStructureInput,
) {
  const errors: string[] = [];

  // Name validation (optional but if provided must be valid)
  if (body.name !== undefined) {
    if (body.name.trim() === "") {
      errors.push("Name cannot be empty");
    } else if (body.name.length < 3) {
      errors.push("Name must be at least 3 characters");
    } else if (body.name.length > 255) {
      errors.push("Name must be less than 255 characters");
    }
  }

  // Period ID validation (optional but if provided must be valid)
  if (body.periodId !== undefined && body.periodId.trim() === "") {
    errors.push("Period ID cannot be empty if provided");
  }

  // Decree validation (optional but if provided must be valid)
  if (body.decree !== undefined && body.decree.trim() === "") {
    errors.push("Decree cannot be empty if provided");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/structure/[id] - Use Case Pattern
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

    // 2. Use use case for complex read with validation
    const repo = new OrganizationalStructureRepositoryPrisma();
    const useCase = new GetStructureByIdUseCase(repo);
    const structure = await useCase.execute(id);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: structure,
    });
  } catch (error) {
    console.error("Error fetching organizational structure:", error);

    // Handle not found errors specifically
    if (
      error instanceof Error &&
      error.message === "Organizational structure not found"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch organizational structure",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/structure/[id] - Use Case Pattern
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
    const body = await extractUpdateStructureBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateUpdateStructureInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and audit
    const repo = new OrganizationalStructureRepositoryPrisma();
    const useCase = new UpdateStructureUseCase(repo);
    const structure = await useCase.execute(id, body, { id: user.id });

    // 4. Response
    return NextResponse.json({
      success: true,
      data: structure,
    });
  } catch (error) {
    console.error("Error updating organizational structure:", error);

    // Handle not found errors specifically
    if (
      error instanceof Error &&
      error.message === "Organizational structure not found"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
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
// DELETE /api/structure/[id] - Use Case Pattern
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

    // 2. Use use case for complex write with logging and confirmation
    const repo = new OrganizationalStructureRepositoryPrisma();
    const useCase = new DeleteStructureUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      message: "Organizational structure deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting organizational structure:", error);

    // Handle not found errors specifically
    if (
      error instanceof Error &&
      error.message === "Organizational structure not found"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
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
