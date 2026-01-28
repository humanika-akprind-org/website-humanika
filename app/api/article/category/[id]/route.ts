/**
 * Article Category ID API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the pattern:
 * - GET: Uses use case for single read operation with validation
 * - PUT: Uses use case for write operations with validation
 * - DELETE: Uses use case for delete operations with validation
 *
 * Pattern Choice Rationale:
 * - Use cases provide better separation for validation and business logic
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateArticleCategoryInput } from "@/domain/value-objects/article-category";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import { ArticleCategoryRepositoryPrisma } from "@/infrastructure/repositories/article-category";
import {
  GetArticleCategoryByIdUseCase,
  UpdateArticleCategoryUseCase,
  DeleteArticleCategoryUseCase,
} from "@/application/use-cases/article-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractIdParam(
  params: Promise<{ id: string }>,
): Promise<string> {
  const { id } = await params;
  return id;
}

async function extractUpdateCategoryBody(
  request: NextRequest,
): Promise<UpdateArticleCategoryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateIdParam(id: string): { isValid: boolean; error?: string } {
  if (!id || id.trim() === "") {
    return { isValid: false, error: "Category ID is required" };
  }

  // Basic ID format validation (UUID-like)
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return { isValid: false, error: "Invalid ID format" };
  }

  return { isValid: true };
}

function validateUpdateCategoryInput(body: UpdateArticleCategoryInput): {
  isValid: boolean;
  error?: string;
} {
  // At least one field must be provided
  if (body.name === undefined && body.description === undefined) {
    return { isValid: false, error: "At least one field is required" };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/articles/category/:id - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Extract payload
    const id = await extractIdParam(params);

    // 2. Basic validation
    const validation = validateIdParam(id);
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
    const repo = new ArticleCategoryRepositoryPrisma();
    const useCase = new GetArticleCategoryByIdUseCase(repo);
    const category = await useCase.execute(id);

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching article category:", error);

    // Handle not found error
    if ((error as Error).message === "Article category not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Article category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch article category",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/articles/category/:id - Use Case Pattern
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
    const body = await extractUpdateCategoryBody(request);

    // 2. Basic validation
    const idValidation = validateIdParam(id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, error: idValidation.error },
        { status: 400 },
      );
    }

    const bodyValidation = validateUpdateCategoryInput(body);
    if (!bodyValidation.isValid) {
      return NextResponse.json(
        { success: false, error: bodyValidation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for write operation with validation
    const repo = new ArticleCategoryRepositoryPrisma();
    const useCase = new UpdateArticleCategoryUseCase(repo);
    const category = await useCase.execute(id, body, user.id);

    // 4. Response
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error updating article category:", error);

    // Handle not found error
    if ((error as Error).message === "Article category not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Article category not found",
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
        error: "Failed to update article category",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/articles/category/:id - Use Case Pattern
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
    const validation = validateIdParam(id);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 },
      );
    }

    // 3. Use use case for delete operation with validation
    const repo = new ArticleCategoryRepositoryPrisma();
    const useCase = new DeleteArticleCategoryUseCase(repo);
    await useCase.execute(id, user.id);

    // 4. Response
    return NextResponse.json({
      success: true,
      message: "Article category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article category:", error);

    // Handle not found error
    if ((error as Error).message === "Article category not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Article category not found",
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
        error: "Failed to delete article category",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
