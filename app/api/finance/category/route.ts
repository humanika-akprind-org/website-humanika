import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateFinanceCategoryInput } from "@/types/finance-category";
import type { FinanceType } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as FinanceType;
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    const where: Prisma.FinanceCategoryWhereInput = {};

    if (type) where.type = { equals: type };
    if (isActive !== null) where.isActive = { equals: isActive === "true" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const financeCategories = await prisma.financeCategory.findMany({
      where,
      include: {
        _count: {
          select: {
            finances: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(financeCategories);
  } catch (error) {
    console.error("Error fetching finance categories:", error);
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

    const body: CreateFinanceCategoryInput = await request.json();

    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const financeCategoryData: Prisma.FinanceCategoryCreateInput = {
      name: body.name,
      description: body.description,
      type: body.type,
    };

    const financeCategory = await prisma.financeCategory.create({
      data: financeCategoryData,
      include: {
        _count: {
          select: {
            finances: true,
          },
        },
      },
    });

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "FinanceCategory",
      entityId: financeCategory.id,
      description: `Created finance category: ${financeCategory.name}`,
      metadata: {
        newData: {
          name: financeCategory.name,
          description: financeCategory.description,
          type: financeCategory.type,
          isActive: financeCategory.isActive,
        },
      },
    });

    return NextResponse.json(financeCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating finance category:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Category name must be unique" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
