import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateWorkProgramInput } from "@/types/work";
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
    const status = searchParams.get("status") as Status;
    const periodId = searchParams.get("periodId");
    const search = searchParams.get("search");

    const where: Prisma.WorkProgramWhereInput = {};

    if (department) where.department = { equals: department };
    if (status) where.status = { equals: status as PrismaStatus };
    if (periodId) where.periodId = periodId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { goal: { contains: search, mode: "insensitive" } },
      ];
    }

    const workPrograms = await prisma.workProgram.findMany({
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
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(workPrograms);
  } catch (error) {
    console.error("Error fetching work programs:", error);
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

    const body: CreateWorkProgramInput = await request.json();

    if (
      !body.name ||
      !body.department ||
      !body.periodId ||
      !body.responsibleId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const workProgram = await prisma.workProgram.create({
      data: {
        name: body.name,
        department: body.department,
        schedule: body.schedule || "",
        funds: body.funds || 0,
        usedFunds: body.usedFunds || 0,
        remainingFunds: (body.funds || 0) - (body.usedFunds || 0),
        goal: body.goal || "",
        periodId: body.periodId,
        responsibleId: body.responsibleId,
      },
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
      },
    });

    return NextResponse.json(workProgram, { status: 201 });
  } catch (error) {
    console.error("Error creating work program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
