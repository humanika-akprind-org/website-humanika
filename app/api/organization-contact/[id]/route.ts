/**
 * Organization Contact [id] API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for read operations
 * - PUT: Uses use case for complex write operations with validation
 * - DELETE: Uses use case for complex write operations with logging
 *
 * Pattern Choice Rationale:
 * - GET by ID: Use case provides better separation for error handling
 * - PUT update: Use case provides validation, logging, and entity status sync
 * - DELETE: Use case provides logging and audit trail
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateOrganizationContactInput } from "@/domain/entities/organization-contact.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetOrganizationContactByIdUseCase,
  UpdateOrganizationContactUseCase,
  DeleteOrganizationContactUseCase,
} from "@/application/use-cases/organization-contact";
import { OrganizationContactRepositoryPrisma } from "@/infrastructure/repositories/organization-contact";

// ============================================================================
// Type Definitions
// ============================================================================

interface OrganizationContactParams {
  params: Promise<{ id: string }>;
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateOrganizationContactBody(
  request: NextRequest,
): Promise<UpdateOrganizationContactInput> {
  const body = await request.json();
  return {
    vision: body.vision,
    mission: body.mission,
    phone: body.phone,
    email: body.email,
    address: body.address,
    periodId: body.periodId,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateOrganizationContactInput(
  body: UpdateOrganizationContactInput,
) {
  const errors: string[] = [];

  // Validate email format if provided
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Invalid email format");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/organization-contact/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: OrganizationContactParams,
) {
  try {
    const { id } = await params;

    // 1. Use use case for read operation
    const repo = new OrganizationContactRepositoryPrisma();
    const useCase = new GetOrganizationContactByIdUseCase(repo);
    const organizationContact = await useCase.execute(id);

    if (!organizationContact) {
      return NextResponse.json(
        { success: false, error: "Organization contact not found" },
        { status: 404 },
      );
    }

    // 2. Response - consistent format
    return NextResponse.json({
      success: true,
      data: organizationContact,
    });
  } catch (error) {
    console.error("Error fetching organization contact:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch organization contact",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/organization-contact/[id] - Use Case Pattern
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: OrganizationContactParams,
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    // 1. Extract payload
    const body = await extractUpdateOrganizationContactBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateUpdateOrganizationContactInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging
    const repo = new OrganizationContactRepositoryPrisma();
    const useCase = new UpdateOrganizationContactUseCase(repo);
    const organizationContact = await useCase.execute(id, body, {
      id: user.id,
    });

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: organizationContact,
    });
  } catch (error) {
    console.error("Error updating organization contact:", error);

    // Handle not found errors
    if ((error as Error).message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
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
// DELETE /api/organization-contact/[id] - Use Case Pattern
// ============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: OrganizationContactParams,
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    // 1. Use use case for complex write with validation and logging
    const repo = new OrganizationContactRepositoryPrisma();
    const useCase = new DeleteOrganizationContactUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 2. Response - consistent format
    return NextResponse.json({
      success: true,
      message: "Organization contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting organization contact:", error);

    // Handle not found errors
    if ((error as Error).message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
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
