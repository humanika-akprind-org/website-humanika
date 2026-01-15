import { type NextRequest, NextResponse } from "next/server";
import type { UpdateStatisticInput } from "@/types/statistic";
import {
  getStatistic,
  updateStatistic,
  deleteStatistic,
} from "@/services/statistic/statistic.service";
import { getCurrentUser } from "@/lib/auth-server";

interface StatisticParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: StatisticParams) {
  try {
    const { id } = await params;

    // Business logic
    const statistic = await getStatistic(id);

    if (!statistic) {
      return NextResponse.json(
        { error: "Statistic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(statistic);
  } catch (error) {
    console.error("Error fetching statistic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: StatisticParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validation - check if statistic exists
    const existingStatistic = await getStatistic(id);
    if (!existingStatistic) {
      return NextResponse.json(
        { error: "Statistic not found" },
        { status: 404 }
      );
    }

    // Business logic
    const updateData: UpdateStatisticInput = {
      activeMembers: body.activeMembers,
      annualEvents: body.annualEvents,
      collaborativeProjects: body.collaborativeProjects,
      innovationProjects: body.innovationProjects,
      awards: body.awards,
      memberSatisfaction: body.memberSatisfaction,
      learningMaterials: body.learningMaterials,
      periodId: body.periodId,
    };

    const statistic = await updateStatistic(id, updateData, user);

    return NextResponse.json(statistic);
  } catch (error) {
    console.error("Error updating statistic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: StatisticParams
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Business logic
    await deleteStatistic(id, user);

    return NextResponse.json({
      message: "Statistic deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting statistic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
