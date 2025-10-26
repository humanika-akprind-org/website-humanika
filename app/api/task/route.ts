import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateDepartmentTaskInput } from "@/types/task";
import type { Department } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department") as Department;
    const statusParam = searchParams.get("status");
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");

    const where: Prisma.DepartmentTaskWhereInput = {};

    if (department) where.department = department;
    if (statusParam) {
      where.status = statusParam as Prisma.EnumStatusFilter<"DepartmentTask">;
    }
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [{ note: { contains: search, mode: "insensitive" } }];
    }

    const departmentTasks = await prisma.departmentTask.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(departmentTasks);
  } catch (error) {
    console.error("Error fetching department tasks:", error);
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

    const body: CreateDepartmentTaskInput = await request.json();

    if (!body.note || !body.department) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const departmentTaskData: Prisma.DepartmentTaskCreateInput = {
      note: body.note,
      department: body.department,
      ...(body.userId && { user: { connect: { id: body.userId } } }),
      status: body.status || "PENDING",
    };

    const departmentTask = await prisma.departmentTask.create({
      data: departmentTaskData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(departmentTask, { status: 201 });
  } catch (error) {
    console.error("Error creating department task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
