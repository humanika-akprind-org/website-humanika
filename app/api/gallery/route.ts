/**
 * Gallery API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET galleries: Use case provides better separation for filtering/pagination
 * - POST create: Use case provides validation and logging
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateGalleryInput } from "@/domain/entities/gallery.entity";
import type { GalleryFilter } from "@/application/interface/gallery.repository.interface";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetGalleriesUseCase,
  CreateGalleryUseCase,
} from "@/application/use-cases/gallery";
import { GalleryRepositoryPrisma } from "@/infrastructure/repositories/gallery";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

function extractGalleryQueryParams(request: NextRequest): GalleryFilter {
  const { searchParams } = new URL(request.url);
  return {
    eventId: searchParams.get("eventId") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    periodId: searchParams.get("periodId") || undefined,
    search: searchParams.get("search") || undefined,
  };
}

async function extractCreateGalleryBody(
  request: NextRequest,
): Promise<CreateGalleryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateGalleryInput(body: CreateGalleryInput) {
  const errors: string[] = [];

  if (!body.title || body.title.trim() === "") {
    errors.push("Title is required");
  }

  if (!body.eventId) {
    errors.push("Event ID is required");
  }

  if (!body.image || body.image.trim() === "") {
    errors.push("Image is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/galleries - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const queryParams = extractGalleryQueryParams(request);

    // 2. Use use case for complex read with validation and pagination
    const repo = new GalleryRepositoryPrisma();
    const useCase = new GetGalleriesUseCase(repo);
    const result = await useCase.execute(queryParams);

    // 3. Response - consistent format
    return NextResponse.json({
      success: true,
      data: result.galleries,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch galleries",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/galleries - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Extract payload
    const body = await extractCreateGalleryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateGalleryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation and logging
    const repo = new GalleryRepositoryPrisma();
    const useCase = new CreateGalleryUseCase(repo);
    const gallery = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: gallery,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating gallery:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
