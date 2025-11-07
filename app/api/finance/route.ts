import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateFinanceInput } from "@/types/finance";
import type { FinanceType, Status } from "@/types/enums";
import { ApprovalType } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import { StatusApproval } from "@/types/approval-enums";
import type {
  Prisma,
  Status as PrismaStatus,
  FinanceType as PrismaFinanceType,
} from "@prisma/client";
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
    const status = searchParams.get("status") as unknown as Status;
    const periodId = searchParams.get("periodId");
    const categoryId = searchParams.get("categoryId");
    const eventId = searchParams.get("eventId");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Prisma.FinanceWhereInput = {};

    if (type) where.type = { equals: type as PrismaFinanceType };
    if (status) where.status = { equals: status as unknown as PrismaStatus };
    if (periodId) where.periodId = periodId;
    if (categoryId) where.categoryId = categoryId;
    if (eventId) where.eventId = eventId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const finances = await prisma.finance.findMany({
      where,
      include: {
        period: true,
        category: true,
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(finances);
  } catch (error) {
    console.error("Error fetching finances:", error);
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

    const body: CreateFinanceInput = await request.json();

    if (
      !body.name ||
      !body.amount ||
      !body.categoryId ||
      !body.type ||
      !body.periodId ||
      !body.date
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const financeData: Prisma.FinanceCreateInput = {
      name: body.name,
      amount: body.amount,
      description: body.description || "",
      date: new Date(body.date),
      category: { connect: { id: body.categoryId } },
      type: body.type,
      period: { connect: { id: body.periodId } },
      user: { connect: { id: user.id } },
      proof: body.proof,
    };

    // Only include eventId if it's provided and not empty
    if (body.eventId && body.eventId.trim() !== "") {
      financeData.event = { connect: { id: body.eventId } };
    }

    const finance = await prisma.finance.create({
      data: financeData,
      include: {
        period: true,
        category: true,
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
        },
      },
    });

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Finance",
      entityId: finance.id,
      description: `Created finance transaction: ${finance.name}`,
      metadata: {
        newData: {
          name: finance.name,
          amount: finance.amount,
          description: finance.description,
          date: finance.date,
          categoryId: finance.categoryId,
          type: finance.type,
          periodId: finance.periodId,
          eventId: finance.eventId,
          userId: finance.userId,
          proof: finance.proof,
          status: finance.status,
        },
      },
    });

    // Create initial approval request for the finance if status is PENDING
    if (financeData.status === "PENDING") {
      await prisma.approval.create({
        data: {
          entityType: ApprovalType.FINANCE,
          entityId: finance.id,
          userId: user.id,
          status: StatusApproval.PENDING,
          note: "Finance transaction submitted for approval",
        },
      });
    }

    return NextResponse.json(finance, { status: 201 });
  } catch (error) {
    console.error("Error creating finance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
