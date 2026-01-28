/**
 * Organizational Structure API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET structures: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type {
  CreateOrganizationalStructureInput,
  OrganizationalStructureFilter,
} from "@/domain/entities/organizational-structure.entity";
import type { Status } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetStructuresUseCase,
  type GetStructuresResult,
  CreateStructureUseCase,
} from "@/application/use-cases/structure";
import { OrganizationalStructureRepositoryPrisma } from "@/infrastructure/repositories/organizational-structure";

// ============================================================================
// Local Types for Query Params (string values from URL)
// ============================================================================

interface StructureQueryParams {
  status?: Status | undefined;
  periodId?: string | undefined;
  search?: string | undefined;
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractStructureQueryParams(
  request: NextRequest,
): StructureQueryParams {
  const { searchParams } = new URL(request.url);
  return {
    status: searchParams.get("status") as Status | undefined,
    periodId: searchParams.get("periodId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateStructureBody(
  request: NextRequest,
): Promise<CreateOrganizationalStructureInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateStructureInput(
  body: CreateOrganizationalStructureInput,
) {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!body.periodId) {
    errors.push("Period ID is required");
  }

  if (body.decree !== undefined && body.decree.trim() === "") {
    errors.push("Decree cannot be empty if provided");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/structure - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractStructureQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new OrganizationalStructureRepositoryPrisma();
    const useCase = new GetStructuresUseCase(repo);
    const filter: OrganizationalStructureFilter = {
      status: queryParams.status,
      periodId: queryParams.periodId,
      search: queryParams.search,
    };
    const result: GetStructuresResult = await useCase.execute(filter);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.structures,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching organizational structures:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch organizational structures",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/structure - Use Case Pattern
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
    const body = await extractCreateStructureBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateStructureInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new OrganizationalStructureRepositoryPrisma();
    const useCase = new CreateStructureUseCase(repo);
    const structure = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: structure,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating organizational structure:", error);

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
