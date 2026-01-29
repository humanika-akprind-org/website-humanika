/**
 * User by ID API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UserRole, Department } from "@prisma/client";
import {
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from "@/application/use-cases/user";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/user";
import type { UpdateUserInput } from "@/application/interface/user.repository.interface";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateUserBody(
  request: NextRequest,
): Promise<UpdateUserInput> {
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
// GET /api/user/[id] - Get user by ID
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Use use case for read
    const repo = new UserRepositoryPrisma();
    const useCase = new GetUserByIdUseCase(repo);
    const user = await useCase.execute(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/user/[id] - Update user
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. Extract payload
    const body = await extractUpdateUserBody(request);

    // 2. Use use case for complex write with validation, logging
    const repo = new UserRepositoryPrisma();
    const useCase = new UpdateUserUseCase(repo);
    const updatedUser = await useCase.execute(id, body);

    // 3. Response
    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle specific errors
    if ((error as Error).message === "User not found") {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
      );
    }

    if ((error as Error).message.includes("already taken")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
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

// ============================================================================
// DELETE /api/user/[id] - Delete user
// ============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Use use case for delete
    const repo = new UserRepositoryPrisma();
    const useCase = new DeleteUserUseCase(repo);
    await useCase.execute(id);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    if ((error as Error).message === "User not found") {
      return NextResponse.json(
        { success: false, error: "User not found" },
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
