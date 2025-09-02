import { type NextRequest, NextResponse } from "next/server";
import type { PeriodApiResponse } from "@/types/period";
import prisma from "@/lib/prisma";
import { ObjectId } from "mongodb";

interface Context {
  params: { id: string };
}

export async function GET(
  _request: NextRequest,
  context: Context
): Promise<NextResponse<PeriodApiResponse>> {
  try {
    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid period ID",
        },
        { status: 400 }
      );
    }

    const period = await prisma.period.findUnique({
      where: { id },
    });

    if (!period) {
      return NextResponse.json(
        {
          success: false,
          error: "Period not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: period,
    });
  } catch (error) {
    console.error("Error fetching period:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch period",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: Context
): Promise<NextResponse<PeriodApiResponse>> {
  try {
    const { id } = context.params;
    const body = await request.json();
    const { name, startYear, endYear, isActive } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid period ID",
        },
        { status: 400 }
      );
    }

    // Check if period exists
    const existingPeriod = await prisma.period.findUnique({
      where: { id },
    });

    if (!existingPeriod) {
      return NextResponse.json(
        {
          success: false,
          error: "Period not found",
        },
        { status: 404 }
      );
    }

    // Validation
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
        where: {
          isActive: true,
          id: { not: id },
        },
        data: { isActive: false },
      });
    }

    const period = await prisma.period.update({
      where: { id },
      data: {
        name,
        startYear,
        endYear,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: period,
      message: "Period updated successfully",
    });
  } catch (error) {
    console.error("Error updating period:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update period",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: Context
): Promise<NextResponse<PeriodApiResponse>> {
  try {
    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid period ID",
        },
        { status: 400 }
      );
    }

    // Check if period exists
    const existingPeriod = await prisma.period.findUnique({
      where: { id },
      include: {
        managements: true,
        finances: true,
        letters: true,
        workPrograms: true,
        events: true,
        articles: true,
      },
    });

    if (!existingPeriod) {
      return NextResponse.json(
        {
          success: false,
          error: "Period not found",
        },
        { status: 404 }
      );
    }

    // Check if period has related data
    const hasRelatedData =
      existingPeriod.managements.length > 0 ||
      existingPeriod.finances.length > 0 ||
      existingPeriod.letters.length > 0 ||
      existingPeriod.workPrograms.length > 0 ||
      existingPeriod.events.length > 0 ||
      existingPeriod.articles.length > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete period with related data",
        },
        { status: 400 }
      );
    }

    await prisma.period.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Period deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting period:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete period",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
