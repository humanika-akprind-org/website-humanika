import { type NextRequest, NextResponse } from "next/server";
import type { ActivityType } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import {
  getActivities,
  createActivity,
} from "@/lib/services/activity/activity.service";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const activityType = searchParams.get("activityType") as
      | ActivityType
      | "ALL";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getActivities(
      {
        activityType,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
      { page, limit }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Function to log activity
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      activityType,
      entityType,
      entityId,
      description,
      metadata,
    }: {
      activityType: ActivityType;
      entityType: string;
      entityId?: string;
      description: string;
      metadata?: unknown;
    } = body;

    // Get IP address from request
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Get user agent from request
    const userAgent = req.headers.get("user-agent") || "unknown";

    const activity = await createActivity(
      { activityType, entityType, entityId, description, metadata },
      user,
      ipAddress,
      userAgent
    );

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error creating activity log:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
