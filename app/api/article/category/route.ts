/**
 * Article Category API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the pattern:
 * - GET: Uses use case for read operations with validation
 * - POST: Uses use case for write operations with validation
 *
 * Pattern Choice Rationale:
 * - Use cases provide better separation for validation and business logic
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateArticleCategoryInput } from "@/domain/value-objects/article-category";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import { ArticleCategoryRepositoryPrisma } from "@/infrastructure/repositories/article-category";
import {
  GetArticleCategoriesUseCase,
  type GetArticleCategoriesResult,
  CreateArticleCategoryUseCase,
} from "@/application/use-cases/article-category";

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

function validateCreateCategoryInput(body: CreateArticleCategoryInput): {
  isValid: boolean;
  error?: string;
} {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!body.description || body.description.trim() === "") {
    errors.push("Description is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/articles/category - Use Case Pattern
// ============================================================================

export async function GET() {
  try {
    // 1. Use use case for read operation with validation
    const repo = new ArticleCategoryRepositoryPrisma();
    const useCase = new GetArticleCategoriesUseCase(repo);
    const result: GetArticleCategoriesResult = await useCase.execute({
      withCount: true,
    });

    // 2. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.categories,
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
// POST /api/articles/category - Use Case Pattern
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
    const body = await extractCreateCategoryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for write operation with validation
    const repo = new ArticleCategoryRepositoryPrisma();
    const useCase = new CreateArticleCategoryUseCase(repo);
    const category = await useCase.execute(body, user.id);

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating article category:", error);

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
        error: "Internal server error",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
