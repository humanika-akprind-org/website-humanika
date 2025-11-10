import { type NextRequest, NextResponse } from "next/server";
import type { PeriodApiResponse } from "@/types/period";
import { ObjectId } from "mongodb";
import {
  getPeriod,
  updatePeriod,
  deletePeriod,
} from "@/lib/services/period/period.service";

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

    const period = await getPeriod(id);

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

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid period ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validation
    if (
      body.startYear !== undefined &&
      body.endYear !== undefined &&
      body.startYear >= body.endYear
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Start year must be less than end year",
        },
        { status: 400 }
      );
    }

    const period = await updatePeriod(id, body);

    return NextResponse.json({
      success: true,
      data: period,
      message: "Period updated successfully",
    });
  } catch (error) {
    console.error("Error updating period:", error);
    if (error instanceof Error && error.message === "Period not found") {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 }
      );
    }
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

    await deletePeriod(id);

    return NextResponse.json({
      success: true,
      message: "Period deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting period:", error);
    if (error instanceof Error && error.message === "Period not found") {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 }
      );
    }
    if (
      error instanceof Error &&
      error.message === "Cannot delete period with related data"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }
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
