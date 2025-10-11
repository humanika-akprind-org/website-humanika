import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateArticleCategoryInput } from "@/types/article-category";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articleCategory = await prisma.articleCategory.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!articleCategory) {
      return NextResponse.json({ error: "Article category not found" }, { status: 404 });
    }

    return NextResponse.json(articleCategory);
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

    // Check if article category exists
    const existingCategory = await prisma.articleCategory.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Article category not found" }, { status: 404 });
    }

    // Check if new name conflicts with existing category (if name is being updated)
    if (body.name && body.name.trim() !== existingCategory.name) {
      const nameConflict = await prisma.articleCategory.findUnique({
        where: { name: body.name.trim() },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: "Category name already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();

    const articleCategory = await prisma.articleCategory.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return NextResponse.json(articleCategory);
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

    // Check if article category exists
    const existingCategory = await prisma.articleCategory.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Article category not found" }, { status: 404 });
    }

    // Check if category has articles
    if (existingCategory._count?.articles && existingCategory._count.articles > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that contains articles" },
        { status: 400 }
      );
    }

    await prisma.articleCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Article category deleted successfully" });
  } catch (error) {
    console.error("Error deleting article category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
