import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gallery = await prisma.gallery.findUnique({
      where: { id: params.id },
      include: {
        event: true,
      },
    });

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Check if gallery exists
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: params.id },
    });

    if (!existingGallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.title) updateData.title = body.title;
    if (body.eventId) updateData.eventId = body.eventId;
    if (body.image) updateData.image = body.image;

    const gallery = await prisma.gallery.update({
      where: { id: params.id },
      data: updateData,
      include: {
        event: true,
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if gallery exists
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: params.id },
    });

    if (!existingGallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    await prisma.gallery.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
