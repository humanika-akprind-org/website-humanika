/**
 * Article API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET articles: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation, logging, and approval workflow
 */

import { type NextRequest, NextResponse } from "next/server";
import type {
  CreateArticleInput,
  ArticleFilter,
} from "@/domain/entities/article.entity";
import type { Status } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetArticlesUseCase,
  type GetArticlesResult,
  CreateArticleUseCase,
} from "@/application/use-cases/article";
import { ArticleRepositoryPrisma } from "@/infrastructure/repositories/article";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractArticleQueryParams(request: NextRequest): ArticleFilter {
  const { searchParams } = new URL(request.url);
  return {
    status: searchParams.get("status") as Status | undefined,
    periodId: searchParams.get("periodId") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    authorId: searchParams.get("authorId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateArticleBody(
  request: NextRequest,
): Promise<CreateArticleInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateArticleInput(body: CreateArticleInput) {
  const errors: string[] = [];

  if (!body.title || body.title.trim() === "") {
    errors.push("Title is required");
  }

  if (!body.content || body.content.trim() === "") {
    errors.push("Content is required");
  }

  if (!body.authorId || body.authorId.trim() === "") {
    errors.push("Author ID is required");
  }

  if (!body.categoryId || body.categoryId.trim() === "") {
    errors.push("Category ID is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/articles - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractArticleQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new ArticleRepositoryPrisma();
    const useCase = new GetArticlesUseCase(repo);
    const result: GetArticlesResult = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.articles,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch articles",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/articles - Use Case Pattern
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
    const body = await extractCreateArticleBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateArticleInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation, logging, and approval
    const repo = new ArticleRepositoryPrisma();
    const useCase = new CreateArticleUseCase(repo);
    const article = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: article,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating article:", error);

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
