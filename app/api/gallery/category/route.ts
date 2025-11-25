import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getGalleryCategories,
  createGalleryCategory,
} from "@/services/gallery/gallery-category.service";
import type { CreateGalleryCategoryInput } from "@/types/gallery-category";

// Validation functions
function validateCreateGalleryCategoryInput(body: CreateGalleryCategoryInput) {
  if (!body.name || body.name.trim() === "") {
    return { isValid: false, error: "Name is required" };
  }
  return { isValid: true };
}

export async function GET(_request: NextRequest) {
  try {
    // Allow public access for dropdowns
    const categories = await getGalleryCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching gallery categories:", error);
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

    const body: CreateGalleryCategoryInput = await request.json();

    // Validation
    const validation = validateCreateGalleryCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Business logic
    const category = await createGalleryCategory(body, user);

    // Response
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
