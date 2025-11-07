import { type NextRequest, NextResponse } from "next/server";
import { ManagementService } from "@/lib/services/management";
import type { ManagementServerData } from "@/types/management";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const management = await ManagementService.getManagement(params.id);

    return NextResponse.json({
      success: true,
      data: management,
    });
  } catch (error) {
    console.error("Error fetching management:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch management",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Get existing management for logging
    const existingManagement = await ManagementService.getManagement(params.id);

    const formData: ManagementServerData = await request.json();
    const management = await ManagementService.updateManagement(
      params.id,
      formData
    );

    // Log activity
    await logActivityFromRequest(request, {
      userId: management.userId,
      activityType: ActivityType.UPDATE,
      entityType: "Management",
      entityId: management.id,
      description: `Updated management: ${management.user?.name || "Unknown"}`,
      metadata: {
        oldData: {
          userId: existingManagement.userId,
          position: existingManagement.position,
          periodId: existingManagement.periodId,
          photo: existingManagement.photo,
        },
        newData: {
          userId: management.userId,
          position: management.position,
          periodId: management.periodId,
          photo: management.photo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: management,
      message: "Management updated successfully",
    });
  } catch (error) {
    console.error("Error updating management:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update management",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Get the management record first to access the photo URL
    const management = await ManagementService.getManagement(params.id);

    // Delete the photo from Google Drive if it exists
    if (
      management.photo &&
      management.photo.includes("drive.google.com/file/d/")
    ) {
      const fileIdMatch = management.photo.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        try {
          // Get access token from request headers or body
          const accessToken = request.headers
            .get("authorization")
            ?.replace("Bearer ", "");

          if (accessToken) {
            const { callApi } = await import("@/use-cases/api/google-drive");
            await callApi({
              action: "delete",
              fileId: fileIdMatch[1],
              accessToken,
            });
          }
        } catch (deleteError) {
          console.warn("Failed to delete photo from Drive:", deleteError);
          // Continue with management deletion even if photo deletion fails
        }
      }
    }

    // Delete the management record
    await ManagementService.deleteManagement(params.id);

    // Log activity
    await logActivityFromRequest(request, {
      userId: management.userId,
      activityType: ActivityType.DELETE,
      entityType: "Management",
      entityId: params.id,
      description: `Deleted management: ${management.user?.name || "Unknown"}`,
      metadata: {
        oldData: {
          userId: management.userId,
          position: management.position,
          periodId: management.periodId,
          photo: management.photo,
        },
        newData: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Management deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting management:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete management",
      },
      { status: 500 }
    );
  }
}
