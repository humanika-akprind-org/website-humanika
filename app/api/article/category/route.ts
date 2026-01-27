/**
 * Article Category API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the pattern:
 * - GET: Uses repository directly for read operations with filtering
 * - POST: Uses repository directly for write operations
 *
 * Pattern Choice Rationale:
 * - Direct repository calls for simpler operations
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateArticleCategoryInput } from "@/domain/value-objects/article-category";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  getArticleCategoriesWithCount,
  createArticleCategory,
} from "@/infrastructure/repositories/article-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractCreateCategoryBody(
  request: NextRequest,
): Promise<CreateArticleCategoryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateCategoryInput(body: CreateArticleCategoryInput) {
  if (!body.name || !body.description) {
    return { isValid: false, error: "Name and description are required" };
  }
  return { isValid: true };
}

// ============================================================================
// GET /api/articles/category
// ============================================================================

export async function GET() {
  try {
    // Use repository directly (no filter needed)
    const categories = await getArticleCategoriesWithCount();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching article categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch article categories",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/articles/category
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

    const body = await extractCreateCategoryBody(request);

    const validation = validateCreateCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // Use repository directly with user.id and request
    const category = await createArticleCategory(body, user.id, request);

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating article category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
