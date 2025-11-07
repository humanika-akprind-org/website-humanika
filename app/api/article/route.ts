import { type NextRequest, NextResponse } from "next/server";
import type { CreateArticleInput } from "@/types/article";
import type { Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import {
  getArticles,
  createArticle,
} from "@/lib/services/article/article.service";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as unknown as Status;
    const periodId = searchParams.get("periodId");
    const categoryId = searchParams.get("categoryId");
    const authorId = searchParams.get("authorId");
    const isPublished = searchParams.get("isPublished");
    const search = searchParams.get("search");

    const filter = {
      status: status || undefined,
      periodId: periodId || undefined,
      categoryId: categoryId || undefined,
      authorId: authorId || undefined,
      isPublished: isPublished ? isPublished === "true" : undefined,
      search: search || undefined,
    };

    const articles = await getArticles(filter);

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
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

    const body: CreateArticleInput = await request.json();

    if (!body.title || !body.content || !body.authorId || !body.categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const article = await createArticle(body, user.id, request);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
