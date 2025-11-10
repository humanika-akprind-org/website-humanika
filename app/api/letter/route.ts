import { type NextRequest, NextResponse } from "next/server";
import type { CreateLetterInput } from "@/types/letter";
import type { LetterType, LetterPriority, Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import { getLetters, createLetter } from "@/lib/services/letter/letter.service";

// Extract payload functions
function extractLetterQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    type: searchParams.get("type") as unknown as LetterType,
    priority: searchParams.get("priority") as unknown as LetterPriority,
    status: searchParams.get("status") as unknown as Status,
    periodId: searchParams.get("periodId") || undefined,
    eventId: searchParams.get("eventId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateLetterBody(
  request: NextRequest
): Promise<CreateLetterInput> {
  return await request.json();
}

// Validation functions
function validateCreateLetterInput(body: CreateLetterInput) {
  if (
    !body.regarding ||
    !body.origin ||
    !body.destination ||
    !body.date ||
    !body.type ||
    !body.priority
  ) {
    return { isValid: false, error: "Missing required fields" };
  }
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Extract payload
    const queryParams = extractLetterQueryParams(request);

    // 2. Validasi - no validation needed for GET request

    // 3. Business logic
    const letters = await getLetters(queryParams);

    // 4. Response
    return NextResponse.json(letters);
  } catch (error) {
    console.error("Error fetching letters:", error);
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
    const body = await extractCreateLetterBody(request);

    // 2. Validasi
    const validation = validateCreateLetterInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Business logic
    const letter = await createLetter(body, user);

    // 4. Response
    return NextResponse.json(letter, { status: 201 });
  } catch (error) {
    console.error("Error creating letter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
