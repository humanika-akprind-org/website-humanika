import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFileToDrive } from "@/lib/google-drive";
import type { Department, Position } from "@/types/enums";

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
      OR: search
        ? [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { period: { name: { contains: search, mode: "insensitive" } } },
          ]
        : undefined,
      department: department || undefined,
      position: position || undefined,
    };

    const [managements, total] = await Promise.all([
      prisma.management.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              // avatarColor: true,
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

    return NextResponse.json({
      managements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching managements:", error);
    return NextResponse.json(
      { error: "Failed to fetch managements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // const user = await getCurrentUser();
    // if (!user || user.role !== "DPO") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const periodId = formData.get("periodId") as string;
    const position = formData.get("position") as Position;
    const department = formData.get("department") as Department;
    const photo = formData.get("photo") as File | null;

    // Validate required fields
    if (!userId || !periodId || !position || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already has a position in this period
    const existingManagement = await prisma.management.findFirst({
      where: {
        userId,
        periodId,
      },
    });

    if (existingManagement) {
      return NextResponse.json(
        { error: "User already has a position in this period" },
        { status: 400 }
      );
    }

    let photoUrl = null;

    // Upload photo to Google Drive if provided
    if (photo) {
      try {
        const uploadResult = await uploadFileToDrive(
          photo,
          "management-photos"
        );
        photoUrl = uploadResult.webViewLink;
      } catch (uploadError) {
        console.error("Error uploading photo:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload photo" },
          { status: 500 }
        );
      }
    }

    // Create management
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
            // avatarColor: true,
          },
        },
        period: true,
      },
    });

    return NextResponse.json(management);
  } catch (error) {
    console.error("Error creating management:", error);
    return NextResponse.json(
      { error: "Failed to create management" },
      { status: 500 }
    );
  }
}
