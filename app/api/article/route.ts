import { type NextRequest, NextResponse } from "next/server";
import type { CreateArticleInput } from "@/types/article";
import type { Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth-server";
import { getArticles, createArticle } from "@/services/article/article.service";

// Extract payload functions
function extractArticleQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    status: searchParams.get("status") as Status,
    periodId: searchParams.get("periodId") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    authorId: searchParams.get("authorId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateArticleBody(
  request: NextRequest
): Promise<CreateArticleInput> {
  return await request.json();
}

// Validation functions
function validateCreateArticleInput(body: CreateArticleInput) {
  if (!body.title || !body.content || !body.authorId || !body.categoryId) {
    return { isValid: false, error: "Missing required fields" };
  }
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  /**
   * 1. Extract payload --> tempat sendiri
   * 2. Validasi --> tempat sendiri
   * 3. Error handling
   * 4. Response
   */
  try {
    // Temporarily remove authentication check to allow public access for published articles
    // const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // 1. Extract payload
    const queryParams = extractArticleQueryParams(request);

    // 2. Validasi - no validation needed for GET request

    // 3. Business logic
    const articles = await getArticles(queryParams);

    // 4. Response
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

    // 1. Extract payload
    const body = await extractCreateArticleBody(request);

    // 2. Validasi
    const validation = validateCreateArticleInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Business logic
    const article = await createArticle(body, user);

    // 4. Response
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
