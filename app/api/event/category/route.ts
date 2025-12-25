import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import {
  getEventCategories,
  createEventCategory,
} from "@/services/event/event-category.service";
import type { CreateEventCategoryInput } from "@/types/event-category";

// Validation functions
function validateCreateEventCategoryInput(body: CreateEventCategoryInput) {
  if (!body.name || body.name.trim() === "") {
    return { isValid: false, error: "Name is required" };
  }
  return { isValid: true };
}

export async function GET(_request: NextRequest) {
  try {
    // Allow public access for dropdowns
    const categories = await getEventCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching event categories:", error);
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

    const body: CreateEventCategoryInput = await request.json();

    // Validation
    const validation = validateCreateEventCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Business logic
    const category = await createEventCategory(body, user);

    // Response
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating event category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
