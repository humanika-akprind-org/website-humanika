/**
 * Activity API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET activities: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type { ActivityType } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetActivitiesUseCase,
  type GetActivitiesResult,
  CreateActivityUseCase,
} from "@/application/use-cases/activity";
import { ActivityRepositoryPrisma } from "@/infrastructure/repositories/activity";

// ============================================================================
// Local Types for Query Params (string values from URL)
// ============================================================================

interface ActivityQueryParams {
  activityType?: ActivityType | "ALL" | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractActivityQueryParams(request: NextRequest): ActivityQueryParams {
  const { searchParams } = new URL(request.url);
  return {
    activityType:
      (searchParams.get("activityType") as ActivityType | "ALL") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
  };
}

interface CreateActivityBody {
  activityType: ActivityType;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: unknown;
}

async function extractCreateActivityBody(
  request: NextRequest,
): Promise<CreateActivityBody> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateActivityInput(body: CreateActivityBody) {
  const errors: string[] = [];

  if (!body.activityType) {
    errors.push("Activity type is required");
  }

  if (!body.entityType || body.entityType.trim() === "") {
    errors.push("Entity type is required");
  }

  if (!body.description || body.description.trim() === "") {
    errors.push("Description is required");
  } else if (body.description.length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }

  if (body.entityId !== undefined && body.entityId.trim() === "") {
    errors.push("Entity ID cannot be empty if provided");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/system/activity - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractActivityQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new ActivityRepositoryPrisma();
    const useCase = new GetActivitiesUseCase(repo);
    const filter = {
      activityType: queryParams.activityType,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
    };
    const pagination = {
      page: queryParams.page,
      limit: queryParams.limit,
    };
    const result: GetActivitiesResult = await useCase.execute(
      filter,
      pagination,
    );

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch activities",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/system/activity - Use Case Pattern
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
    const body = await extractCreateActivityBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateActivityInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Get IP address and user agent from request
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 4. Use use case for complex write with validation, logging, and approval
    const repo = new ActivityRepositoryPrisma();
    const useCase = new CreateActivityUseCase(repo);
    const result = await useCase.execute(
      {
        activityType: body.activityType,
        entityType: body.entityType,
        entityId: body.entityId,
        description: body.description,
        metadata: body.metadata,
      },
      { id: user.id },
      ipAddress,
      userAgent,
    );

    // 5. Response
    return NextResponse.json(
      {
        success: true,
        data: result.activity,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating activity log:", error);

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
