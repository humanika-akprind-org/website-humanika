import { type NextRequest, NextResponse } from "next/server";
import type { UpdateArticleCategoryInput } from "@/types/article-category";
import { getCurrentUser } from "@/lib/auth";
import {
  getArticleCategoryById,
  updateArticleCategory,
  deleteArticleCategory,
} from "@/services/article/article-category.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await getArticleCategoryById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: "Article category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching article category:", error);
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

    const body: UpdateArticleCategoryInput = await request.json();

    const category = await updateArticleCategory(
      params.id,
      body,
      user.id,
      request
    );

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating article category:", error);
    if (error instanceof Error) {
      if (error.message === "Article category not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }
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

    await deleteArticleCategory(params.id, user.id, request);

    return NextResponse.json({
      message: "Article category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article category:", error);
    if (error instanceof Error) {
      if (error.message === "Article category not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (
        error.message ===
        "Cannot delete category that is being used by articles"
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
