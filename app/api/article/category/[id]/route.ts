import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateArticleCategoryInput } from "@/types/article-category";
import { getCurrentUser } from "@/lib/auth";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.articleCategory.findUnique({
      where: { id: params.id },
    });

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

    // Check if category exists
    const existingCategory = await prisma.articleCategory.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Article category not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.name && body.name.trim()) {
      updateData.name = body.name.trim();
    }

    const category = await prisma.articleCategory.update({
      where: { id: params.id },
      data: updateData,
    });

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "ArticleCategory",
      entityId: category.id,
      description: `Updated article category: ${category.name}`,
      metadata: {
        oldData: {
          name: existingCategory.name,
        },
        newData: {
          name: category.name,
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating article category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if category exists
    const existingCategory = await prisma.articleCategory.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Article category not found" },
        { status: 404 }
      );
    }

    // Check if category is being used by any articles
    const articlesCount = await prisma.article.count({
      where: { categoryId: params.id },
    });

    if (articlesCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that is being used by articles" },
        { status: 400 }
      );
    }

    await prisma.articleCategory.delete({
      where: { id: params.id },
    });

    // Log activity
    await logActivityFromRequest(_request, {
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "ArticleCategory",
      entityId: params.id,
      description: `Deleted article category: ${existingCategory.name}`,
      metadata: {
        oldData: {
          name: existingCategory.name,
        },
        newData: null,
      },
    });

    return NextResponse.json({
      message: "Article category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
