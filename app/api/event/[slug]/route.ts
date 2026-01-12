import { type NextRequest, NextResponse } from "next/server";
import { getEventBySlug } from "@/services/event/event.service";

/**
 * Event API Route - uses slug for public URLs
 * GET: Finds event by slug
 * PUT/DELETE: Uses parameter as ID (admin operations)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const event = await getEventBySlug((await params).slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
