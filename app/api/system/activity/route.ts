import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ActivityType } from "@/types/enums";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const activityType = searchParams.get("activityType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: {
      activityType?: ActivityType;
      createdAt?: {
        gte: Date;
        lte: Date;
      };
    } = {};

    if (activityType && activityType !== "ALL") {
      // Validate activity type
      if (!Object.values(ActivityType).includes(activityType as ActivityType)) {
        return NextResponse.json(
          { error: "Invalid activity type" },
          { status: 400 }
        );
      }
      where.activityType = activityType as ActivityType;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Get activities with pagination
    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
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
    const { activityType, entityType, entityId, description, metadata } = body;

    // Validate required fields
    if (!activityType || !entityType || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get IP address from request
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Get user agent from request
    const userAgent = req.headers.get("user-agent") || "unknown";

    const activity = await prisma.activityLog.create({
      data: {
        userId: user.id,
        activityType,
        entityType,
        entityId,
        description,
        metadata,
        ipAddress,
        userAgent,
      },
    });

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
