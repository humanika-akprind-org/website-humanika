import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total count
    const total = await prisma.management.count();

    // Get count by department
    const byDepartment = await prisma.management.groupBy({
      by: ["department"],
      _count: {
        department: true,
      },
    });

    // Get count by position
    const byPosition = await prisma.management.groupBy({
      by: ["position"],
      _count: {
        position: true,
      },
    });

    // Convert to record format
    const departmentStats: Record<string, number> = {};
    byDepartment.forEach((item) => {
      departmentStats[item.department] = item._count.department;
    });

    const positionStats: Record<string, number> = {};
    byPosition.forEach((item) => {
      positionStats[item.position] = item._count.position;
    });

    return NextResponse.json({
      total,
      byDepartment: departmentStats,
      byPosition: positionStats,
    });
  } catch (error) {
    console.error("Error fetching management stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
