import { type NextRequest, NextResponse } from "next/server";
import type { CreateEventInput } from "@/types/event";
import type { Status, Department } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import { getEvents, createEvent } from "@/lib/services/event/event.service";

// Extract payload functions
function extractEventQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    department: searchParams.get("department") as Department,
    status: searchParams.get("status") as unknown as Status,
    periodId: searchParams.get("periodId") || undefined,
    workProgramId: searchParams.get("workProgramId") || undefined,
    search: searchParams.get("search") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
  };
}

async function extractCreateEventBody(
  request: NextRequest
): Promise<CreateEventInput> {
  return await request.json();
}

// Validation functions
function validateCreateEventInput(body: CreateEventInput) {
  if (
    !body.name ||
    !body.department ||
    !body.periodId ||
    !body.responsibleId ||
    !body.startDate ||
    !body.endDate
  ) {
    return { isValid: false, error: "Missing required fields" };
  }
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  /**
   * 1. Extract payload --> tempat sendiri
   * 2. Validasi --> tempat sendiri
   * 3. Error handling
   * 4. Response
   */
  try {
    // Temporarily remove authentication check to allow public access for periods/events dropdowns
    // const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // 1. Extract payload
    const queryParams = extractEventQueryParams(request);

    // 2. Validasi - no validation needed for GET request

    // 3. Business logic
    const events = await getEvents(queryParams);

    // 4. Response
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
    const body = await extractCreateEventBody(request);

    // 2. Validasi
    const validation = validateCreateEventInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Business logic
    const event = await createEvent(body, user);

    // 4. Response
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
