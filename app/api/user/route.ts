/**
 * User API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UserRole, Department } from "@prisma/client";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetUsersUseCase,
  CreateUserUseCase,
} from "@/application/use-cases/user";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/user";
import type {
  UserFilter,
  CreateUserInput,
} from "@/application/interface/user.repository.interface";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractUserQueryParams(
  request: NextRequest,
): Omit<UserFilter, "excludeUserId"> {
  const { searchParams } = new URL(request.url);
  return {
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") || "1")
      : undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit") || "10")
      : undefined,
    search: searchParams.get("search") || undefined,
    role: (searchParams.get("role") as UserRole) || undefined,
    department: (searchParams.get("department") as Department) || undefined,
    isActive:
      searchParams.get("isActive") !== null
        ? searchParams.get("isActive") === "true"
        : undefined,
    verifiedAccount:
      searchParams.get("verifiedAccount") !== null
        ? searchParams.get("verifiedAccount") === "true"
        : undefined,
    allUsers: searchParams.get("allUsers") === "true",
  };
}

async function extractCreateUserBody(
  request: NextRequest,
): Promise<CreateUserInput> {
  const body = await request.json();
  return {
    name: body.name,
    email: body.email,
    username: body.username,
    password: body.password,
    role: body.role as UserRole | undefined,
    department: body.department as Department | undefined,
    position: body.position,
    isActive: body.isActive,
    verifiedAccount: body.verifiedAccount,
  };
}

// ============================================================================
// GET /api/user - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Get current user to exclude from results
    const currentUser = await getCurrentUser();

    // 2. Extract payload
    const queryParams = extractUserQueryParams(request);

    // 3. When search is provided, automatically fetch all users without pagination
    const shouldFetchAll = !!queryParams.search || queryParams.allUsers;

    // 4. Use use case for complex read with validation and pagination
    const repo = new UserRepositoryPrisma();
    const useCase = new GetUsersUseCase(repo);
    const filter: UserFilter = {
      ...queryParams,
      page: shouldFetchAll ? undefined : queryParams.page,
      limit: shouldFetchAll ? undefined : queryParams.limit,
      excludeUserId: currentUser?.id,
    };
    const result = await useCase.execute(filter);

    // 5. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/user - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Extract payload
    const body = await extractCreateUserBody(request);

    // 2. Use use case for complex write with validation, logging, and approval
    const repo = new UserRepositoryPrisma();
    const useCase = new CreateUserUseCase(repo);
    const user = await useCase.execute(body, { id: "system" });

    // 3. Response
    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);

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

    // Handle duplicate error specifically
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
