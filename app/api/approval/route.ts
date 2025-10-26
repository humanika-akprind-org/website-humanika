import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/approval-enums";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const entityType = searchParams.get("entityType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status as StatusApproval;
    }

    if (entityType) {
      where.entityType = entityType as ApprovalType;
    }

    // Get total count
    const total = await prisma.approval.count({ where });

    // Get approvals with related data
    const approvals = await prisma.approval.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
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
        workProgram: {
          select: {
            id: true,
            name: true,
            department: true,
            status: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            department: true,
            status: true,
          },
        },
        finance: {
          select: {
            id: true,
            name: true,
            amount: true,
            type: true,
            status: true,
          },
        },
        document: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
            status: true,
            isPublished: true,
          },
        },
        letter: {
          select: {
            id: true,
            regarding: true,
            type: true,
            status: true,
          },
        },
      },
    });

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      approvals,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    console.error("Error fetching approvals:", error);
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

    const body = await request.json();
    const { entityType, entityId, userId, status, note } = body;

    if (!entityType || !entityId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if approval already exists for this entity
    const existingApproval = await prisma.approval.findFirst({
      where: {
        entityType: entityType as ApprovalType,
        entityId,
        userId,
      },
    });

    if (existingApproval) {
      return NextResponse.json(
        { error: "Approval already exists for this entity" },
        { status: 400 }
      );
    }

    const approval = await prisma.approval.create({
      data: {
        entityType: entityType as ApprovalType,
        entityId,
        userId,
        status: (status as StatusApproval) || StatusApproval.PENDING,
        note,
      },
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
    });

    return NextResponse.json(approval);
  } catch (error) {
    console.error("Error creating approval:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
