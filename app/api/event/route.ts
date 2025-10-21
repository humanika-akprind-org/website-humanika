import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateEventInput } from "@/types/event";
import type { Status, Department } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department") as Department;
    const status = searchParams.get("status") as unknown as Status;
    const periodId = searchParams.get("periodId");
    const workProgramId = searchParams.get("workProgramId");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Prisma.EventWhereInput = {};

    if (department) where.department = { equals: department };
    if (status) where.status = { equals: status as unknown as PrismaStatus };
    if (periodId) where.periodId = periodId;
    if (workProgramId) where.workProgramId = workProgramId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { goal: { contains: search, mode: "insensitive" } },
      ];
    }
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = new Date(startDate);
      if (endDate) where.startDate.lte = new Date(endDate);
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        period: true,
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        workProgram: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
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

    const body: CreateEventInput = await request.json();

    if (
      !body.name ||
      !body.department ||
      !body.periodId ||
      !body.responsibleId ||
      !body.startDate ||
      !body.endDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const eventData: Prisma.EventCreateInput = {
      name: body.name,
      slug,
      thumbnail: body.thumbnail,
      description: body.description || "",
      goal: body.goal || "",
      department: body.department,
      period: { connect: { id: body.periodId } },
      responsible: { connect: { id: body.responsibleId } },
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      funds: typeof body.funds === 'string' ? parseFloat(body.funds) : (body.funds || 0),
      usedFunds: 0,
      remainingFunds: typeof body.funds === 'string' ? parseFloat(body.funds) : (body.funds || 0),
    };

    // Only include workProgramId if it's provided and not empty
    if (body.workProgramId && body.workProgramId.trim() !== "") {
      eventData.workProgram = { connect: { id: body.workProgramId } };
    }

    const event = await prisma.event.create({
      data: eventData,
      include: {
        period: true,
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        workProgram: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
