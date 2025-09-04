import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Department, Position } from "@/types/enums";
import { callApi } from "@/lib/api/google-drive";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") as Department | null;
    const position = searchParams.get("position") as Position | null;

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { user: { name: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
          { period: { name: { contains: search, mode: "insensitive" } } },
        ],
      });
    }

    if (department) {
      where.AND.push({ department });
    }

    if (position) {
      where.AND.push({ position });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const [managements, total] = await Promise.all([
      prisma.management.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              department: true,
              position: true,
            },
          },
          period: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.management.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      managements,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching managements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "BPH") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const periodId = formData.get("periodId") as string;
    const position = formData.get("position") as Position;
    const department = formData.get("department") as Department;
    const photoFile = formData.get("photo") as File | null;

    // Validate required fields
    if (!userId || !periodId || !position || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already has a management position in this period
    const existingManagement = await prisma.management.findFirst({
      where: {
        userId,
        periodId,
      },
    });

    if (existingManagement) {
      return NextResponse.json(
        { error: "User already has a management position in this period" },
        { status: 400 }
      );
    }

    // Check if position in department is already taken
    const existingPosition = await prisma.management.findFirst({
      where: {
        periodId,
        position,
        department,
      },
    });

    if (existingPosition) {
      return NextResponse.json(
        { error: "This position in the department is already taken" },
        { status: 400 }
      );
    }

    let photoUrl = null;

    // Upload photo to Google Drive if provided
    if (photoFile) {
      try {
        const accessToken = request.cookies.get("google_access_token")?.value;

        if (!accessToken) {
          return NextResponse.json(
            { error: "Google Drive access token required" },
            { status: 401 }
          );
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", photoFile);
        uploadFormData.append("action", "upload");
        uploadFormData.append("accessToken", accessToken);
        uploadFormData.append("folderId", "root");

        const uploadResult = await callApi(
          {
            action: "upload",
            accessToken,
          },
          uploadFormData
        );

        if (uploadResult.success) {
          photoUrl = uploadResult.file.url;
        }
      } catch (uploadError) {
        console.error("Error uploading photo:", uploadError);
        // Continue without photo if upload fails
      }
    }

    // Create management record
    const management = await prisma.management.create({
      data: {
        userId,
        periodId,
        position,
        department,
        photo: photoUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            position: true,
          },
        },
        period: true,
      },
    });

    return NextResponse.json(management);
  } catch (error) {
    console.error("Error creating management:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
