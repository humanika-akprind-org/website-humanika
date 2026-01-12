import { type NextRequest, NextResponse } from "next/server";
import { getArticleBySlug } from "@/services/article/article.service";

/**
 * Article Slug API Route - uses slug for public URLs
 * GET: Finds article by slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const article = await getArticleBySlug((await params).slug);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
