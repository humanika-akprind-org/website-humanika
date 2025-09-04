import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Department, Position } from "@/types/enums";
import { callApi } from "@/lib/api/google-drive";

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const management = await prisma.management.findUnique({
      where: { id: params.id },
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

    if (!management) {
      return NextResponse.json(
        { error: "Management not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(management);
  } catch (error) {
    console.error("Error fetching management:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const removePhoto = formData.get("removePhoto") === "true";

    // Check if management exists
    const existingManagement = await prisma.management.findUnique({
      where: { id: params.id },
    });

    if (!existingManagement) {
      return NextResponse.json(
        { error: "Management not found" },
        { status: 404 }
      );
    }

    // Check for conflicts if changing user, period, position, or department
    if (
      userId !== existingManagement.userId ||
      periodId !== existingManagement.periodId ||
      position !== existingManagement.position ||
      department !== existingManagement.department
    ) {
      const conflict = await prisma.management.findFirst({
        where: {
          id: { not: params.id },
          OR: [
            { userId, periodId }, // Same user in same period
            { periodId, position, department }, // Same position in same department and period
          ],
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "Management conflict detected" },
          { status: 400 }
        );
      }
    }

    let photoUrl = existingManagement.photo;

    // Handle photo changes
    if (removePhoto) {
      photoUrl = null;
      // Optionally delete from Google Drive here
    } else if (photoFile) {
      try {
        const accessToken = request.cookies.get("google_access_token")?.value;

        if (accessToken) {
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
            // Optionally delete old photo from Google Drive
          }
        }
      } catch (uploadError) {
        console.error("Error uploading photo:", uploadError);
      }
    }

    // Update management record
    const management = await prisma.management.update({
      where: { id: params.id },
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
    console.error("Error updating management:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "BPH") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if management exists
    const management = await prisma.management.findUnique({
      where: { id: params.id },
    });

    if (!management) {
      return NextResponse.json(
        { error: "Management not found" },
        { status: 404 }
      );
    }

    // Optionally delete photo from Google Drive here

    await prisma.management.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Management deleted successfully" });
  } catch (error) {
    console.error("Error deleting management:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
