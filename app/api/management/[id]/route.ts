import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ManagementService } from "@/services/management/management.service";
import type { ManagementServerData } from "@/types/management";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const management = await ManagementService.getManagement((await params).id);

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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData: ManagementServerData = await request.json();

    const management = await ManagementService.updateManagement(
      (
        await params
      ).id,
      formData,
      user
    );

    return NextResponse.json({
      success: true,
      data: management,
      message: "Management updated successfully",
    });
  } catch (error) {
    console.error("Error updating management:", error);
    if (error instanceof Error && error.message === "Management not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the management record first to access the photo URL
    const management = await ManagementService.getManagement((await params).id);

    // Delete the photo from Google Drive if it exists
    if (management.photo) {
      // Extract file ID from various formats (URL or direct ID)
      let fileId: string | null = null;

      // Handle direct file IDs (33 characters, alphanumeric with underscores/hyphens)
      if (
        management.photo.length === 33 &&
        /^[a-zA-Z0-9_-]+$/.test(management.photo)
      ) {
        fileId = management.photo;
      } else {
        // Handle Google Drive URLs
        const patterns = [
          /[?&]id=([a-zA-Z0-9_-]+)/,
          /\/file\/d\/([a-zA-Z0-9_-]+)/,
          /\/d\/([a-zA-Z0-9_-]+)/,
          /uc\?export=view&id=([a-zA-Z0-9_-]+)/,
        ];

        for (const pattern of patterns) {
          const match = management.photo.match(pattern);
          if (match && match[1]) {
            fileId = match[1];
            break;
          }
        }
      }

      if (fileId) {
        try {
          // Get access token from request headers
          const accessToken = request.headers
            .get("authorization")
            ?.replace("Bearer ", "");

          if (accessToken) {
            const { callApi } = await import("@/use-cases/api/google-drive");
            await callApi({
              action: "delete",
              fileId,
              accessToken,
            });
            console.log(
              `Successfully deleted photo file ${fileId} from Google Drive`
            );
          } else {
            console.warn("No access token available for photo deletion");
          }
        } catch (deleteError) {
          console.warn("Failed to delete photo from Drive:", deleteError);
          // Continue with management deletion even if photo deletion fails
        }
      }
    }

    // Delete the management record
    await ManagementService.deleteManagement((await params).id, user);

    return NextResponse.json({
      success: true,
      message: "Management deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting management:", error);
    if (error instanceof Error && error.message === "Management not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
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
