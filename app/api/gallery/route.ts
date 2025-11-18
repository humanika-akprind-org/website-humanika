import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getGalleries,
  createGallery,
  type CreateGalleryInput,
} from "@/services/gallery/gallery.service";

// Extract payload functions
function extractGalleryQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    eventId: searchParams.get("eventId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateGalleryBody(
  request: NextRequest
): Promise<CreateGalleryInput> {
  return await request.json();
}

// Validation functions
function validateCreateGalleryInput(body: CreateGalleryInput) {
  if (!body.title || !body.eventId || !body.image) {
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
    const queryParams = extractGalleryQueryParams(request);

    // 2. Validasi - no validation needed for GET request

    // 3. Business logic
    const galleries = await getGalleries(queryParams);

    // 4. Response
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
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
    const body = await extractCreateGalleryBody(request);

    // 2. Validasi
    const validation = validateCreateGalleryInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Business logic
    const gallery = await createGallery(body, user);

    // 4. Response
    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
