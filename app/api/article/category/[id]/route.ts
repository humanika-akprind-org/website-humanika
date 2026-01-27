/**
 * Article Category ID API Route - Clean Architecture Hybrid Pattern
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
import type { UpdateArticleCategoryInput } from "@/domain/value-objects/article-category";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  getArticleCategoryById,
  updateArticleCategory,
  deleteArticleCategory,
} from "@/infrastructure/repositories/article-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateCategoryBody(
  request: NextRequest,
): Promise<UpdateArticleCategoryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateCategoryInput(body: UpdateArticleCategoryInput) {
  // At least one field must be provided
  if (body.name === undefined && body.description === undefined) {
    return { isValid: false, error: "At least one field is required" };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/articles/category/:id
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    // Use repository directly
    const category = await getArticleCategoryById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Article category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching article category:", error);
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
// PUT /api/articles/category/:id
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
    const body = await extractUpdateCategoryBody(request);

    const validation = validateUpdateCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // Use repository directly with user.id and request
    const category = await updateArticleCategory(id, body, user.id, request);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error updating article category:", error);
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
// DELETE /api/articles/category/:id
// ============================================================================

export async function DELETE(
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

    // Use repository directly with user.id and request
    await deleteArticleCategory(id, user.id, request);

    return NextResponse.json({
      success: true,
      message: "Article category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article category:", error);
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
