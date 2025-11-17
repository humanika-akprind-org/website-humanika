import { type NextRequest, NextResponse } from "next/server";
import type { CreateArticleCategoryInput } from "@/types/article-category";
import { getCurrentUser } from "@/lib/auth";
import {
  getArticleCategories,
  createArticleCategory,
} from "@/services/article/article-category.service";

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await getArticleCategories();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching article categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateArticleCategoryInput = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const category = await createArticleCategory(body, user.id, request);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating article category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
