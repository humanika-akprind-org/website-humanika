import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ManagementService } from "@/lib/services/management/management.service";
import type { ManagementServerData } from "@/types/management";

// Extract payload functions
async function extractCreateManagementBody(
  request: NextRequest
): Promise<ManagementServerData> {
  return await request.json();
}

// Validation functions
function validateCreateManagementInput(body: ManagementServerData) {
  if (!body.userId || !body.periodId || !body.position || !body.department) {
    return { isValid: false, error: "Missing required fields" };
  }
  return { isValid: true };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Business logic
    const managements = await ManagementService.getManagements();

    // 2. Response
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Extract payload
    const body = await extractCreateManagementBody(request);

    // 2. Validasi
    const validation = validateCreateManagementInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Business logic
    const management = await ManagementService.createManagement(body, user);

    // 4. Response
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
