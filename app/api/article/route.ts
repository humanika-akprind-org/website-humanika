import { type NextRequest, NextResponse } from "next/server";
import type { CreateArticleInput } from "@/types/article";
import type { Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth-server";
import { getArticles, createArticle } from "@/services/article/article.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublished = searchParams.get("isPublished") === "true";

    // Allow public access for published articles
    if (!isPublished) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const status = searchParams.get("status") as unknown as Status;
    const periodId = searchParams.get("periodId");
    const categoryId = searchParams.get("categoryId");
    const authorId = searchParams.get("authorId");
    const search = searchParams.get("search");

    const filter = {
      status: status || undefined,
      periodId: periodId || undefined,
      categoryId: categoryId || undefined,
      authorId: authorId || undefined,
      isPublished: isPublished || undefined,
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
