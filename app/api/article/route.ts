import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateArticleInput } from "@/types/article";
import type { Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";

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

    const where: Prisma.ArticleWhereInput = {};

    if (status) where.status = { equals: status as unknown as PrismaStatus };
    if (periodId) where.periodId = periodId;
    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    if (isPublished !== null) where.isPublished = isPublished === "true";
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
      orderBy: { createdAt: "desc" },
    });

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

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const articleData: Prisma.ArticleCreateInput = {
      title: body.title,
      slug,
      thumbnail: body.thumbnail,
      content: body.content,
      author: { connect: { id: body.authorId } },
      category: { connect: { id: body.categoryId } },
      isPublished: body.isPublished || false,
      publishedAt: body.publishedAt,
    };

    // Only include periodId if it's provided and not empty
    if (body.periodId && body.periodId.trim() !== "") {
      articleData.period = { connect: { id: body.periodId } };
    }

    const article = await prisma.article.create({
      data: articleData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
