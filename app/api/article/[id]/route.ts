/**
 * Article ID API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the pattern:
 * - GET: Uses repository directly for single read operation
 * - PUT: Uses repository directly for write operations
 * - DELETE: Uses repository directly for delete operation
 *
 * Pattern Choice Rationale:
 * - Direct repository calls for simpler operations
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateArticleInput } from "@/domain/entities/article.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/infrastructure/repositories/article";

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
// GET /api/articles/:id
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    // Use repository directly
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
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
// PUT /api/articles/:id
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

    const id = (await params).id;
    const body = await extractUpdateArticleBody(request);

    const validation = validateUpdateArticleInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // Use repository directly with user
    const article = await updateArticle(id, body, { id: user.id });

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error updating article:", error);
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
// DELETE /api/articles/:id
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

    const id = (await params).id;

    // Use repository directly with user
    await deleteArticle(id, { id: user.id });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
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
