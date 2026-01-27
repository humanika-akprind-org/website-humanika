/**
 * Event Slug API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single read operation with validation
 *
 * Pattern Choice Rationale:
 * - GET event by slug: Use case provides better separation for validation
 */

import { type NextRequest, NextResponse } from "next/server";
import { EventRepositoryPrisma } from "@/infrastructure/repositories/event.repository";
import { GetEventBySlugUseCase } from "@/application/use-cases/event/get-event-by-slug.usecase";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractSlugParam(
  params: Promise<{ slug: string }>,
): Promise<string> {
  const { slug } = await params;
  return slug;
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateSlug(slug: string): { isValid: boolean; error?: string } {
  if (!slug || slug.trim() === "") {
    return { isValid: false, error: "Slug is required" };
  }

  // Basic slug format validation (alphanumeric, hyphens only)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { isValid: false, error: "Invalid slug format" };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/events/slug/[slug] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // 1. Extract payload
    const slug = await extractSlugParam(params);

    // 2. Basic validation
    const validation = validateSlug(slug);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 },
      );
    }

    // 3. Use use case for read operation with validation
    const repo = new EventRepositoryPrisma();
    const useCase = new GetEventBySlugUseCase(repo);
    const event = await useCase.execute(slug);

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event by slug:", error);

    // Handle not found error
    if ((error as Error).message === "Event not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 },
      );
    }

    // Handle validation errors
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
        error: "Failed to fetch event",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
