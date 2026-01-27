/**
 * Article ID API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single read operation with validation
 * - PUT: Uses use case for complex write operations with validation
 * - DELETE: Uses use case for delete operation with validation
 *
 * Pattern Choice Rationale:
 * - GET article by ID: Use case provides better separation and validation
 * - PUT update: Use case provides validation, logging, and approval workflow
 * - DELETE: Use case provides validation and activity logging
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateArticleInput } from "@/domain/entities/article.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetArticleByIdUseCase,
  UpdateArticleUseCase,
  DeleteArticleUseCase,
} from "@/application/use-cases/article";
import { ArticleRepositoryPrisma } from "@/infrastructure/repositories/article";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateArticleBody(
  request: NextRequest,
): Promise<UpdateArticleInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateArticleInput(body: UpdateArticleInput) {
  // At least one field must be provided
  if (
    !body.title &&
    !body.content &&
    !body.authorId &&
    !body.categoryId &&
    !body.periodId &&
    !body.status
  ) {
    return { isValid: false, error: "At least one field is required" };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/articles/:id - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Extract payload
    const id = (await params).id;

    // 2. Use use case for single read with validation
    const repo = new ArticleRepositoryPrisma();
    const useCase = new GetArticleByIdUseCase(repo);
    const article = await useCase.execute(id);

    // 3. Handle not found
    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found",
        },
        { status: 404 },
      );
    }

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error fetching article:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Article ID is required")) {
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
        error: "Failed to fetch article",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/articles/:id - Use Case Pattern
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Extract payload
    const id = (await params).id;
    const body = await extractUpdateArticleBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateUpdateArticleInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new ArticleRepositoryPrisma();
    const useCase = new UpdateArticleUseCase(repo);
    const article = await useCase.execute(id, body, { id: user.id });

    // 4. Response
    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error updating article:", error);

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

    // Handle not found error
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
        error: "Failed to update article",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/articles/:id - Use Case Pattern
// ============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Extract payload
    const id = (await params).id;

    // 2. Use use case for delete with validation
    const repo = new ArticleRepositoryPrisma();
    const useCase = new DeleteArticleUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 3. Response
    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);

    // Handle not found error
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
    if ((error as Error).message.includes("Article ID is required")) {
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
        error: "Failed to delete article",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
