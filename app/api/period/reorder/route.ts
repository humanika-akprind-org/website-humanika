import { type NextRequest, NextResponse } from "next/server";
import type { PeriodApiResponse } from "@/types/period";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest
): Promise<NextResponse<PeriodApiResponse>> {
  try {
    const body = await request.json();
    const { periods } = body;

    if (!periods || !Array.isArray(periods)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid periods data",
        },
        { status: 400 }
      );
    }

    // Update order for all periods
    const updatePromises = periods.map((period: any) =>
      prisma.period.update({
        where: { id: period.id },
        data: {
          // If your model doesn't have an order field, you might need to add it
          // For now, we'll update the name and years if needed
          name: period.name,
          startYear: period.startYear,
          endYear: period.endYear,
          isActive: period.isActive,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Periods reordered successfully",
    });
  } catch (error) {
    console.error("Error reordering periods:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reorder periods",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
