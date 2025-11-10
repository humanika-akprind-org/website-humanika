import { type NextRequest, NextResponse } from "next/server";
import type { CreateDepartmentTaskInput } from "@/types/task";
import type { Department, Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import {
  createDepartmentTask,
  getDepartmentTasks,
} from "@/lib/services/task/task.service";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department") as Department;
    const statusParam = searchParams.get("status") as Status | null;
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");

    const departmentTasks = await getDepartmentTasks({
      department,
      status: statusParam || undefined,
      userId: userId || undefined,
      search: search || undefined,
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

    const departmentTask = await createDepartmentTask(body, user);

    return NextResponse.json(departmentTask, { status: 201 });
  } catch (error) {
    console.error("Error creating department task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
