/**
 * Article Slug API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the pattern:
 * - GET: Uses repository directly for single read operation
 *
 * Pattern Choice Rationale:
 * - Direct repository call for simpler operation
 */

import { type NextRequest, NextResponse } from "next/server";
import { getArticleBySlug } from "@/infrastructure/repositories/article";

// ============================================================================
// GET /api/articles/slug/:slug
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;

    // Use repository directly
    const article = await getArticleBySlug(slug);

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
