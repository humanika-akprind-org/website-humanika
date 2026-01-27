/**
 * Article Slug API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single read operation with validation
 *
 * Pattern Choice Rationale:
 * - GET article by slug: Use case provides better separation and validation
 */

import { type NextRequest, NextResponse } from "next/server";
import { GetArticleBySlugUseCase } from "@/application/use-cases/article";
import { ArticleRepositoryPrisma } from "@/infrastructure/repositories/article";

// ============================================================================
// GET /api/articles/slug/:slug - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // 1. Extract payload
    const slug = (await params).slug;

    // 2. Use use case for single read with validation
    const repo = new ArticleRepositoryPrisma();
    const useCase = new GetArticleBySlugUseCase(repo);
    const article = await useCase.execute(slug);

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
    if ((error as Error).message.includes("Slug is required")) {
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
