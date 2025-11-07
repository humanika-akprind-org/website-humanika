import { type NextRequest, NextResponse } from "next/server";
import type { PeriodApiResponse } from "@/types/period";
import prisma from "@/lib/prisma";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

export async function GET(): Promise<NextResponse<PeriodApiResponse>> {
  try {
    const periods = await prisma.period.findMany({
      orderBy: {
        startYear: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: periods,
    });
  } catch (error) {
    console.error("Error fetching periods:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch periods",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PeriodApiResponse>> {
  try {
    const body = await request.json();
    const { name, startYear, endYear, isActive = false } = body;

    // Validation
    if (!name || !startYear || !endYear) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    if (startYear >= endYear) {
      return NextResponse.json(
        {
          success: false,
          error: "Start year must be less than end year",
        },
        { status: 400 }
      );
    }

    // If setting this period as active, deactivate all others
    if (isActive) {
      await prisma.period.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const period = await prisma.period.create({
      data: {
        name,
        startYear,
        endYear,
        isActive,
      },
    });

    // Log activity
    await logActivityFromRequest(request, {
      userId: "system", // Since there's no user context in this API
      activityType: ActivityType.CREATE,
      entityType: "Period",
      entityId: period.id,
      description: `Created period: ${period.name}`,
      metadata: {
        newData: {
          name: period.name,
          startYear: period.startYear,
          endYear: period.endYear,
          isActive: period.isActive,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: period,
      message: "Period created successfully",
    });
  } catch (error) {
    console.error("Error creating period:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create period",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
