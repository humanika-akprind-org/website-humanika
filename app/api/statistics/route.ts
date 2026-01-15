import { type NextRequest, NextResponse } from "next/server";
import type { CreateStatisticInput, StatisticFilter } from "@/types/statistic";
import {
  getStatistics,
  getActivePeriodStatistic,
  createStatistic,
} from "@/services/statistic/statistic.service";
import { getCurrentUser } from "@/lib/auth-server";

// Extract payload functions
function extractStatisticQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    periodId: searchParams.get("periodId") || undefined,
    period: searchParams.get("period") || undefined,
  };
}

async function extractCreateStatisticBody(
  request: NextRequest
): Promise<CreateStatisticInput> {
  const body = await request.json();
  return {
    activeMembers: body.activeMembers,
    annualEvents: body.annualEvents,
    collaborativeProjects: body.collaborativeProjects,
    innovationProjects: body.innovationProjects,
    awards: body.awards,
    memberSatisfaction: body.memberSatisfaction,
    learningMaterials: body.learningMaterials,
    periodId: body.periodId,
  };
}

// Validation functions
function validateCreateStatisticInput(body: CreateStatisticInput) {
  if (!body.periodId) {
    return { isValid: false, error: "Period ID is required" };
  }
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractStatisticQueryParams(request);

    // 2. Business logic - handle period=active query parameter
    if (queryParams.period === "active") {
      const statistic = await getActivePeriodStatistic();
      if (!statistic) {
        return NextResponse.json(null, { status: 200 });
      }
      return NextResponse.json(statistic);
    }

    const statistics = await getStatistics(queryParams as StatisticFilter);

    // 3. Response
    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
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

    // 1. Extract payload
    const body = await extractCreateStatisticBody(request);

    // 2. Validasi
    const validation = validateCreateStatisticInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Business logic
    const statistic = await createStatistic(body, user);

    // 4. Response
    return NextResponse.json(statistic, { status: 201 });
  } catch (error) {
    console.error("Error creating statistic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
