import { type NextRequest, NextResponse } from "next/server";
import type { UpdateArticleInput } from "@/types/article";
import { getCurrentUser } from "@/lib/auth";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/lib/services/article/article.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const article = await getArticleById(params.id);

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
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateArticleInput = await request.json();

    const article = await updateArticle(params.id, body, user.id, request);

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
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteArticle(params.id, user.id, request);

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
