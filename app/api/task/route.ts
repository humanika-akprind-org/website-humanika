/**
 * Task API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET tasks: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateDepartmentTaskInput } from "@/domain/entities/task-department.entity";
import type { Department, Status } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetDepartmentTasksUseCase,
  type GetDepartmentTasksResult,
  CreateDepartmentTaskUseCase,
} from "@/application/use-cases/task-department";
import { TaskDepartmentRepositoryPrisma } from "@/infrastructure/repositories/task-department";

// ============================================================================
// Local Types for Query Params (string values from URL)
// ============================================================================

interface TaskQueryParams {
  department?: Department | undefined;
  status?: Status | undefined;
  userId?: string | undefined;
  search?: string | undefined;
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractTaskQueryParams(request: NextRequest): TaskQueryParams {
  const { searchParams } = new URL(request.url);
  return {
    department: searchParams.get("department") as Department | undefined,
    status: searchParams.get("status") as Status | undefined,
    userId: searchParams.get("userId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateTaskBody(
  request: NextRequest,
): Promise<CreateDepartmentTaskInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateTaskInput(body: CreateDepartmentTaskInput) {
  const errors: string[] = [];

  if (!body.title || body.title.trim() === "") {
    errors.push("Title is required");
  }

  if (!body.note || body.note.trim() === "") {
    errors.push("Note is required");
  }

  if (!body.department) {
    errors.push("Department is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/task - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractTaskQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new TaskDepartmentRepositoryPrisma();
    const useCase = new GetDepartmentTasksUseCase(repo);
    const result: GetDepartmentTasksResult = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching department tasks:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch department tasks",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/task - Use Case Pattern
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
    const body = await extractCreateTaskBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateTaskInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new TaskDepartmentRepositoryPrisma();
    const useCase = new CreateDepartmentTaskUseCase(repo);
    const departmentTask = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: departmentTask,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating department task:", error);

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
