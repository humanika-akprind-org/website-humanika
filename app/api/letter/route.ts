import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateLetterInput } from "@/types/letter";
import type { LetterType, LetterPriority } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type {
  Prisma,
  LetterType as PrismaLetterType,
  LetterPriority as PrismaLetterPriority,
} from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as unknown as LetterType;
    const priority = searchParams.get("priority") as unknown as LetterPriority;
    const periodId = searchParams.get("periodId");
    const eventId = searchParams.get("eventId");
    const search = searchParams.get("search");

    const where: Prisma.LetterWhereInput = {};
    if (type) where.type = { equals: type as unknown as PrismaLetterType };
    if (priority) {
      where.priority = { equals: priority as unknown as PrismaLetterPriority };
    }
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

    return NextResponse.json(letter, { status: 201 });
  } catch (error) {
    console.error("Error creating letter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
