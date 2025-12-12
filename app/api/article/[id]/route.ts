import { type NextRequest, NextResponse } from "next/server";
import type { UpdateArticleInput } from "@/types/article";
import { getCurrentUser } from "@/lib/auth-server";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/services/article/article.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Keep fetching user if needed for future enhancements, but do not require authentication
    await getCurrentUser();

    const { id } = await params;
    const article = await getArticleById(id);

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateArticleInput = await request.json();

    const article = await updateArticle(id, body, user.id, request);

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof Error && error.message === "Article not found") {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteArticle(id, user.id, request);

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Article not found") {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
