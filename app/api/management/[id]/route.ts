import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFileToDrive, deleteFileFromDrive } from "@/lib/google-drive";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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
            // avatarColor: true,
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
      { error: "Failed to fetch management" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const user = await getCurrentUser();
    // if (!user || user.role !== "SUPER_ADMIN") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const periodId = formData.get("periodId") as string;
    const position = formData.get("position") as string;
    const department = formData.get("department") as string;
    const photo = formData.get("photo") as File | null;
    const removePhoto = formData.get("removePhoto") === "true";

    const existingManagement = await prisma.management.findUnique({
      where: { id: params.id },
    });

    if (!existingManagement) {
      return NextResponse.json(
        { error: "Management not found" },
        { status: 404 }
      );
    }

    let photoUrl = existingManagement.photo;

    // Handle photo removal
    if (removePhoto && existingManagement.photo) {
      try {
        // Extract file ID from Google Drive URL for deletion
        const fileId = existingManagement.photo.match(/\/d\/([^\/]+)/)?.[1];
        if (fileId) {
          await deleteFileFromDrive(fileId);
        }
        photoUrl = null;
      } catch (error) {
        console.error("Error deleting old photo:", error);
      }
    }

    // Handle new photo upload
    if (photo) {
      try {
        // Delete old photo if exists
        if (existingManagement.photo) {
          const oldFileId =
            existingManagement.photo.match(/\/d\/([^\/]+)/)?.[1];
          if (oldFileId) {
            await deleteFileFromDrive(oldFileId);
          }
        }

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

    const updateData: any = {
      userId: userId || existingManagement.userId,
      periodId: periodId || existingManagement.periodId,
      position: position || existingManagement.position,
      department: department || existingManagement.department,
      photo: photoUrl,
    };

    const management = await prisma.management.update({
      where: { id: params.id },
      data: updateData,
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
    console.error("Error updating management:", error);
    return NextResponse.json(
      { error: "Failed to update management" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const user = await getCurrentUser();
    // if (!user || user.role !== "DPO") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const management = await prisma.management.findUnique({
      where: { id: params.id },
    });

    if (!management) {
      return NextResponse.json(
        { error: "Management not found" },
        { status: 404 }
      );
    }

    // Delete photo from Google Drive if exists
    if (management.photo) {
      try {
        const fileId = management.photo.match(/\/d\/([^\/]+)/)?.[1];
        if (fileId) {
          await deleteFileFromDrive(fileId);
        }
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }

    await prisma.management.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Management deleted successfully" });
  } catch (error) {
    console.error("Error deleting management:", error);
    return NextResponse.json(
      { error: "Failed to delete management" },
      { status: 500 }
    );
  }
}
