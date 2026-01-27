/**
 * Event API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET events: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateEventInput } from "@/domain/entities/event.entity";
import type { Department, Status } from "@/domain/enums/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import { GetEventsUseCase } from "@/application/use-cases/event";
import { CreateEventUseCase } from "@/application/use-cases/event";
import { EventRepositoryPrisma } from "@/infrastructure/repositories/event";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractEventQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    department: searchParams.get("department") as Department | undefined,
    status: searchParams.get("status") as unknown as Status | undefined,
    periodId: searchParams.get("periodId") || undefined,
    workProgramId: searchParams.get("workProgramId") || undefined,
    search: searchParams.get("search") || undefined,
    scheduleStartDate: searchParams.get("scheduleStartDate") || undefined,
    scheduleEndDate: searchParams.get("scheduleEndDate") || undefined,
    date: searchParams.get("date") || undefined,
    location: searchParams.get("location") || undefined,
  };
}

async function extractCreateEventBody(
  request: NextRequest,
): Promise<CreateEventInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateEventInput(body: CreateEventInput) {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!body.department) {
    errors.push("Department is required");
  }

  if (!body.periodId) {
    errors.push("Period ID is required");
  }

  if (!body.responsibleId) {
    errors.push("Responsible ID is required");
  }

  if (!body.schedules || body.schedules.length === 0) {
    errors.push("At least one schedule is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/events - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractEventQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new EventRepositoryPrisma();
    const useCase = new GetEventsUseCase(repo);
    const result = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch events",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/events - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Extract payload
    const body = await extractCreateEventBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateEventInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new EventRepositoryPrisma();
    const useCase = new CreateEventUseCase(repo);
    const event = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
