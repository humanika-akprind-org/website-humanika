import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateLetterInput } from "@/types/letter";
import type { LetterType, LetterPriority, Status } from "@/types/enums";
import { ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type {
  Prisma,
  LetterType as PrismaLetterType,
  LetterPriority as PrismaLetterPriority,
  Status as PrismaStatus,
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
    const type = searchParams.get("type") as unknown as LetterType;
    const priority = searchParams.get("priority") as unknown as LetterPriority;
    const status = searchParams.get("status") as unknown as Status;
    const periodId = searchParams.get("periodId");
    const eventId = searchParams.get("eventId");
    const search = searchParams.get("search");

    const where: Prisma.LetterWhereInput = {};
    if (type) where.type = { equals: type as unknown as PrismaLetterType };
    if (priority) {
      where.priority = { equals: priority as unknown as PrismaLetterPriority };
    }
    if (status) where.status = { equals: status as unknown as PrismaStatus };
    if (periodId) where.periodId = periodId;
    if (eventId) where.eventId = eventId;
    if (search) {
      where.OR = [
        { regarding: { contains: search, mode: "insensitive" } },
        { number: { contains: search, mode: "insensitive" } },
        { origin: { contains: search, mode: "insensitive" } },
        { destination: { contains: search, mode: "insensitive" } },
      ];
    }

    const letters = await prisma.letter.findMany({
      where,
      include: {
        period: true,
        event: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            document: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(letters);
  } catch (error) {
    console.error("Error fetching letters:", error);
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

    const body: CreateLetterInput = await request.json();

    if (
      !body.regarding ||
      !body.origin ||
      !body.destination ||
      !body.date ||
      !body.type ||
      !body.priority
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const letterData: Prisma.LetterCreateInput = {
      regarding: body.regarding,
      origin: body.origin,
      destination: body.destination,
      date: new Date(body.date),
      type: body.type,
      priority: body.priority,
      status: (body.status as unknown as PrismaStatus) || "DRAFT",
      body: body.body || null,
      letter: body.letter || null,
      notes: body.notes || null,
      createdBy: { connect: { id: user.id } },
    };

    // Optional fields
    if (body.number) letterData.number = body.number;
    if (body.periodId) letterData.period = { connect: { id: body.periodId } };
    if (body.eventId) letterData.event = { connect: { id: body.eventId } };

    const letter = await prisma.letter.create({
      data: letterData,
      include: {
        period: true,
        event: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            document: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Create initial approval request for the letter if status is PENDING
    if (body.status === "PENDING") {
      await prisma.approval.create({
        data: {
          entityType: ApprovalType.LETTER,
          entityId: letter.id,
          userId: user.id,
          status: StatusApproval.PENDING,
          note: "Letter submitted for approval",
        },
      });
    }

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Letter",
      entityId: letter.id,
      description: `Created letter: ${letter.regarding}`,
      metadata: {
        newData: {
          regarding: letter.regarding,
          number: letter.number,
          origin: letter.origin,
          destination: letter.destination,
          type: letter.type,
          priority: letter.priority,
          status: letter.status,
          periodId: letter.periodId,
          eventId: letter.eventId,
        },
      },
    });

    return NextResponse.json(letter, { status: 201 });
  } catch (error) {
    console.error("Error creating letter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
