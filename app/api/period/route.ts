import { type NextRequest, NextResponse } from "next/server";
import type { PeriodApiResponse } from "@/types/period";
import { getPeriods, createPeriod } from "@/lib/services/period/period.service";

// Extract payload functions
async function extractCreatePeriodBody(request: NextRequest) {
  return await request.json();
}

// Validation functions
function validateCreatePeriodInput(body: {
  name?: string;
  startYear?: number;
  endYear?: number;
  isActive?: boolean;
}) {
  if (!body.name || !body.startYear || !body.endYear) {
    return { isValid: false, error: "Missing required fields" };
  }
  if (body.startYear >= body.endYear) {
    return { isValid: false, error: "Start year must be less than end year" };
  }
  return { isValid: true };
}

export async function GET(): Promise<NextResponse<PeriodApiResponse>> {
  try {
    // 1. Business logic
    const periods = await getPeriods();

    // 2. Response
    return NextResponse.json({
      success: true,
      data: periods,
    });
  } catch (error) {
    console.error("Error fetching periods:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch periods",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PeriodApiResponse>> {
  try {
    // 1. Extract payload
    const body = await extractCreatePeriodBody(request);

    // 2. Validasi
    const validation = validateCreatePeriodInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // 3. Business logic
    const period = await createPeriod(body);

    // 4. Response
    return NextResponse.json({
      success: true,
      data: period,
      message: "Period created successfully",
    });
  } catch (error) {
    console.error("Error creating period:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create period",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
