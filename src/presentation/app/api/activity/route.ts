import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all activities with user and management info, filtered by roles DPO, BPH, PENGURUS
    const activities = await prisma.activityLog.findMany({
      where: {
        user: {
          role: {
            in: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
          },
        },
      },
      include: {
        user: {
          include: {
            managements: {
              where: {
                period: {
                  isActive: true,
                },
              },
              select: {
                department: true,
              },
            },
          },
        },
      },
    });

    // Group activities by department and count them, only for departments INFOKOM, LITBANG, KWU, PSDM
    const departmentActivityCounts: { [key: string]: number } = {};
    const allowedDepartments = ["BPH", "INFOKOM", "LITBANG", "KWU", "PSDM"];

    activities.forEach((activity) => {
      if (activity.user?.managements && activity.user.managements.length > 0) {
        const department = activity.user.managements[0].department;
        if (allowedDepartments.includes(department)) {
          departmentActivityCounts[department] =
            (departmentActivityCounts[department] || 0) + 1;
        }
      }
    });

    // Define department names mapping
    const departmentNames: { [key: string]: string } = {
      BPH: "BPH",
      INFOKOM: "INFOKOM",
      LITBANG: "LITBANG",
      KWU: "KWU",
      PSDM: "PSDM",
    };

    // Create data for radar chart using allowed departments
    const radarData = allowedDepartments.map((dept) => ({
      subject: departmentNames[dept] || dept,
      A: departmentActivityCounts[dept] || 0,
      fullMark: Math.max(...Object.values(departmentActivityCounts), 0) || 100,
    }));

    return NextResponse.json(radarData);
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
