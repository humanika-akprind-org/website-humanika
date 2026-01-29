/**
 * Organization Contact API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET organization contacts: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and duplicate checking
 */

import { type NextRequest, NextResponse } from "next/server";
import type {
  CreateOrganizationContactInput,
  OrganizationContactFilter,
} from "@/domain/entities/organization-contact.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetOrganizationContactsUseCase,
  CreateOrganizationContactUseCase,
} from "@/application/use-cases/organization-contact";
import { OrganizationContactRepositoryPrisma } from "@/infrastructure/repositories/organization-contact";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractOrganizationContactQueryParams(
  request: NextRequest,
): OrganizationContactFilter {
  const { searchParams } = new URL(request.url);
  return {
    periodId: searchParams.get("periodId") || undefined,
    period: searchParams.get("period") || undefined,
  };
}

async function extractCreateOrganizationContactBody(
  request: NextRequest,
): Promise<CreateOrganizationContactInput> {
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

function validateCreateOrganizationContactInput(
  body: CreateOrganizationContactInput,
) {
  const errors: string[] = [];

  if (!body.vision || body.vision.trim() === "") {
    errors.push("Vision is required");
  }

  if (!body.mission) {
    errors.push("Mission is required");
  }

  if (!body.email || body.email.trim() === "") {
    errors.push("Email is required");
  }

  if (!body.address || body.address.trim() === "") {
    errors.push("Address is required");
  }

  if (!body.periodId || body.periodId.trim() === "") {
    errors.push("Period ID is required");
  }

  // Validate email format
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Invalid email format");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/organization-contact - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractOrganizationContactQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new OrganizationContactRepositoryPrisma();
    const useCase = new GetOrganizationContactsUseCase(repo);
    const result = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.records,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching organization contacts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch organization contacts",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/organization-contact - Use Case Pattern
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
    const body = await extractCreateOrganizationContactBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateOrganizationContactInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and duplicate checking
    const repo = new OrganizationContactRepositoryPrisma();
    const useCase = new CreateOrganizationContactUseCase(repo);
    const organizationContact = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: organizationContact,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating organization contact:", error);

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
