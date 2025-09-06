import { type NextRequest, NextResponse } from "next/server";
import { ManagementService } from "@/lib/services/management";
import type { ManagementServerData } from "@/types/management";

export async function GET() {
  try {
    const managements = await ManagementService.getManagements();

    return NextResponse.json({
      success: true,
      data: managements,
    });
  } catch (error) {
    console.error("Error fetching managements:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch managements",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: ManagementServerData = await request.json();
    const management = await ManagementService.createManagement(formData);

    return NextResponse.json({
      success: true,
      data: management,
      message: "Management created successfully",
    });
  } catch (error) {
    console.error("Error creating management:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create management",
      },
      { status: 500 }
    );
  }
}
